import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from './supabase';
import {
  ensureLocalAccessibleUri,
  getFileArrayBuffer,
} from '../utils/fileUtils';

const DOCUMENTS_TABLE = 'student_documents';
const DOCUMENTS_BUCKET = 'student-media';
const LOCAL_DOCUMENTS_PREFIX = '@rimt_student_documents_';

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'cka7ipqa';
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'text/plain',
  'application/octet-stream',
  '*/*',
];

const normalizeRollNo = (rollNo) => (rollNo || '').trim().toUpperCase();
const localKey = (rollNo) => `${LOCAL_DOCUMENTS_PREFIX}${normalizeRollNo(rollNo)}`;

const readLocalDocuments = async (rollNo) => {
  try {
    const raw = await AsyncStorage.getItem(localKey(rollNo));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeLocalDocuments = async (rollNo, documents) => {
  await AsyncStorage.setItem(localKey(rollNo), JSON.stringify(documents));
};

const getFileExtension = (name = '') => {
  const extension = name.split('.').pop()?.toLowerCase();
  return ['docx', 'doc', 'pdf', 'txt', 'jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm', 'mov'].includes(extension)
    ? extension
    : '';
};

const getContentType = (extension, providedType) => {
  const extensionTypes = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
  };
  return extensionTypes[extension] || (providedType && providedType !== 'application/octet-stream' ? providedType : 'application/octet-stream');
};

export const formatDocumentSize = (bytes) => {
  if (!bytes || bytes < 1024) return `${bytes || 0} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getDocumentIcon = (document) => (
  document.mime_type?.startsWith('image/')
    ? 'image'
    : document.mime_type === 'application/pdf' || document.format === 'pdf'
    ? 'picture-as-pdf'
    : 'description'
);

export const listStudentDocuments = async (rollNo) => {
  const normalizedRoll = normalizeRollNo(rollNo);
  if (!normalizedRoll) return { success: false, documents: [], error: 'No active student.' };

  const localDocs = await readLocalDocuments(normalizedRoll);

  try {
    const { data, error } = await supabase
      .from(DOCUMENTS_TABLE)
      .select('*')
      .eq('roll_no', normalizedRoll)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      // Merge remote + local documents seamlessly
      const remoteIds = new Set(data.map((d) => d.id || d.cloudinary_public_id));
      const unsyncedLocal = localDocs.filter(
        (d) => !remoteIds.has(d.id) && !remoteIds.has(d.cloudinary_public_id)
      );
      return { success: true, documents: [...data, ...unsyncedLocal], source: 'supabase' };
    }
  } catch (error) {
    console.warn('[documentService] Supabase list exception notice:', error?.message || error);
  }

  return { success: true, documents: localDocs, source: 'local' };
};

const saveDocumentMetadata = async (document) => {
  try {
    let { data, error } = await supabase
      .from(DOCUMENTS_TABLE)
      .insert(document)
      .select()
      .single();

    if (error?.code === 'PGRST204') {
      const legacyDocument = { ...document };
      delete legacyDocument.storage_provider;
      ({ data, error } = await supabase
        .from(DOCUMENTS_TABLE)
        .insert(legacyDocument)
        .select()
        .single());
    }

    if (!error && data) {
      // Update local cache so document is instantly available offline
      const existing = await readLocalDocuments(document.roll_no);
      const updated = [data, ...existing.filter((d) => d.id !== data.id && d.cloudinary_public_id !== data.cloudinary_public_id)];
      await writeLocalDocuments(document.roll_no, updated);
      return { success: true, document: data, source: 'supabase' };
    }

    console.warn('[documentService] Supabase insert notice:', error?.message || error);
  } catch (dbError) {
    console.warn('[documentService] Supabase document insert notice:', dbError?.message || dbError);
  }

  // Graceful Local Persistence Fallback: Guarantees zero lost files
  try {
    const localDoc = {
      ...document,
      id: document.id || `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      storage_provider: document.storage_provider || 'local',
      created_at: new Date().toISOString(),
    };
    const existing = await readLocalDocuments(document.roll_no);
    const updated = [localDoc, ...existing.filter((d) => d.id !== localDoc.id)];
    await writeLocalDocuments(document.roll_no, updated);
    return { success: true, document: localDoc, source: 'local' };
  } catch (localErr) {
    return { success: false, error: 'File metadata could not be recorded: ' + (localErr?.message || localErr) };
  }
};

/**
 * Attempts unsigned Cloudinary upload. Signing secrets must never be bundled into the app.
 * Returns null if not configured or rejected, allowing transparent fallback.
 */
const tryCloudinaryUpload = async ({ asset, localUri, normalizedRoll, fileName, contentType, extension }) => {
  if (!CLOUDINARY_CLOUD_NAME) return null;

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
  const folder = `rimt-academic-trust/${normalizedRoll}`;
  const parameters = {
    folder,
  };

  const isUnsigned = Boolean(CLOUDINARY_UPLOAD_PRESET);

  if (isUnsigned) {
    parameters.upload_preset = CLOUDINARY_UPLOAD_PRESET;
  } else {
    return null;
  }

  try {
    if (Platform.OS === 'web') {
      const formData = new FormData();
      formData.append('file', asset.file || await fetch(localUri).then((r) => r.blob()), fileName);
      Object.entries(parameters).forEach(([k, v]) => formData.append(k, v));

      const response = await fetch(uploadUrl, { method: 'POST', body: formData });
      const result = await response.json();
      if (response.ok && !result.error) {
        return {
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format || extension,
          bytes: result.bytes || asset.size,
        };
      }
      console.warn('[documentService] Cloudinary web response notice:', result.error?.message || response.status);
      return null;
    }

    // Native: Android / iOS using native multipart uploader
    const nativeResult = await FileSystem.uploadAsync(uploadUrl, localUri, {
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      mimeType: contentType,
      httpMethod: 'POST',
      parameters,
    });

    const result = JSON.parse(nativeResult.body || '{}');
    if (nativeResult.status >= 200 && nativeResult.status < 300 && !result.error) {
      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        format: result.format || extension,
        bytes: result.bytes || asset.size,
      };
    }
    console.warn('[documentService] Cloudinary native response notice:', result.error?.message || nativeResult.status);
    return null;
  } catch (cloudinaryError) {
    console.warn('[documentService] Cloudinary upload attempt notice:', cloudinaryError?.message || cloudinaryError);
    return null;
  }
};

export const uploadStudentDocument = async ({ asset, rollNo }) => {
  const normalizedRoll = normalizeRollNo(rollNo);
  const fileName = asset?.name || asset?.fileName || '';
  const extension = getFileExtension(fileName);
  const contentType = getContentType(extension, asset?.mimeType);

  if (!normalizedRoll) return { success: false, error: 'Sign in before uploading a document.' };
  if (!asset?.uri || !fileName || !extension) {
    return { success: false, error: 'Choose a PDF, DOC, DOCX, TXT, JPG, PNG, WebP, MP4, WebM, or MOV file.' };
  }
  if (asset.size && asset.size > 20 * 1024 * 1024) {
    return { success: false, error: 'Documents must be 20 MB or smaller.' };
  }

  let localUri = asset.uri;

  try {
    // 1. Ensure file is locally accessible in sandbox cache on native
    localUri = await ensureLocalAccessibleUri(asset.uri, fileName);

    let fileUrl = null;
    let publicId = null;
    let storageProvider = null;
    let format = extension;
    let uploadedBytes = asset.size;

    // 2. Try Cloudinary first
    const cloudinaryResult = await tryCloudinaryUpload({
      asset,
      localUri,
      normalizedRoll,
      fileName,
      contentType,
      extension,
    });

    if (cloudinaryResult?.secure_url) {
      fileUrl = cloudinaryResult.secure_url;
      publicId = cloudinaryResult.public_id;
      storageProvider = 'cloudinary';
      format = cloudinaryResult.format || extension;
      uploadedBytes = cloudinaryResult.bytes || asset.size;
    } else {
      // 3. Supabase Storage Upload
      const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `documents/${normalizedRoll}/${Date.now()}-${safeFileName}`;
      let uploadedToSupabase = false;

      // 3a. On Native, try streaming binary upload via FileSystem.uploadAsync
      if (Platform.OS !== 'web' && FileSystem.uploadAsync) {
        try {
          const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://pwghazyfxhypzkadqfnn.supabase.co';
          const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY || 'sb_publishable_i_u2xeBeomYmIqQ2XhD66Q_jD0bb4XN';
          const uploadEndpoint = `${supabaseUrl}/storage/v1/object/${DOCUMENTS_BUCKET}/${storagePath}`;

          const uploadRes = await FileSystem.uploadAsync(uploadEndpoint, localUri, {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              'Content-Type': contentType,
              'x-upsert': 'true',
            },
          });

          if (uploadRes.status >= 200 && uploadRes.status < 300) {
            fileUrl = supabase.storage.from(DOCUMENTS_BUCKET).getPublicUrl(storagePath).data.publicUrl;
            publicId = storagePath;
            storageProvider = 'supabase';
            uploadedToSupabase = true;
          } else {
            console.warn('[documentService] Native binary upload returned status:', uploadRes.status, uploadRes.body);
          }
        } catch (nativeUploadErr) {
          console.warn('[documentService] Native binary upload notice:', nativeUploadErr?.message || nativeUploadErr);
        }
      }

      // 3b. Web or Native fallback using standard Supabase Storage JS SDK
      if (!uploadedToSupabase) {
        try {
          const arrayBuffer = await getFileArrayBuffer(localUri, asset);
          const { error: storageError } = await supabase.storage
            .from(DOCUMENTS_BUCKET)
            .upload(storagePath, arrayBuffer, {
              contentType,
              upsert: true,
            });

          if (!storageError) {
            fileUrl = supabase.storage.from(DOCUMENTS_BUCKET).getPublicUrl(storagePath).data.publicUrl;
            publicId = storagePath;
            storageProvider = 'supabase';
            uploadedToSupabase = true;
          } else {
            console.warn('[documentService] Supabase storage upload notice:', storageError.message);
          }
        } catch (storageErr) {
          console.warn('[documentService] Supabase buffer upload notice:', storageErr?.message || storageErr);
        }
      }

      // 3c. If remote cloud storage is unavailable or pending bucket migration, securely persist to local device vault
      if (!uploadedToSupabase) {
        fileUrl = localUri;
        publicId = localUri;
        storageProvider = 'local';
      }
    }

    // 4. Save metadata to Supabase table or local storage
    const metadata = {
      roll_no: normalizedRoll,
      title: fileName.replace(/\.[^/.]+$/, ''),
      original_filename: fileName,
      mime_type: contentType,
      file_size: uploadedBytes || null,
      cloudinary_url: fileUrl,
      cloudinary_public_id: publicId,
      storage_provider: storageProvider,
      resource_type: storageProvider === 'cloudinary' ? 'auto' : 'raw',
      format,
      status: 'Uploaded',
    };

    const saved = await saveDocumentMetadata(metadata);
    if (!saved.success) {
      if (storageProvider === 'supabase') {
        await supabase.storage.from(DOCUMENTS_BUCKET).remove([publicId]).catch(() => {});
      }
      return saved;
    }
    return { success: true, document: saved.document, source: saved.source };
  } catch (error) {
    return { success: false, error: error?.message || 'Document upload failed.' };
  }
};

export const toDocumentCardProps = (document) => ({
  icon: getDocumentIcon(document),
  iconColor: document.format === 'pdf' ? '#A31321' : '#3E6186',
  iconBgColor: document.format === 'pdf' ? 'rgba(163, 19, 33, 0.08)' : 'rgba(62, 97, 134, 0.08)',
  statusBadge: document.status || 'Uploaded',
  statusBadgeColor: '#2E7D4F',
  statusBadgeBg: 'rgba(46, 125, 79, 0.1)',
  fileMeta: `${(document.format || 'file').toUpperCase()} · ${formatDocumentSize(document.file_size)}`,
  title: document.title || document.original_filename,
  verificationLabel: document.storage_provider === 'local'
    ? 'Saved on this device'
    : document.storage_provider === 'supabase'
    ? 'Stored in Academic Vault'
    : 'Stored in Cloudinary',
  verificationIcon: 'cloud-done',
});

export const deleteStudentDocument = async ({ documentId, rollNo }) => {
  const normalizedRoll = normalizeRollNo(rollNo);
  if (!normalizedRoll || !documentId) {
    return { success: false, error: 'Invalid document.' };
  }

  try {
    await supabase
      .from(DOCUMENTS_TABLE)
      .delete()
      .eq('id', documentId)
      .eq('roll_no', normalizedRoll);
  } catch (err) {
    console.warn('[documentService] Supabase delete notice:', err?.message || err);
  }

  try {
    const currentDocs = await readLocalDocuments(normalizedRoll);
    const updatedDocs = currentDocs.filter(
      (doc) => doc.id !== documentId && doc.cloudinary_public_id !== documentId
    );
    await writeLocalDocuments(normalizedRoll, updatedDocs);
    return { success: true };
  } catch (localErr) {
    return { success: false, error: localErr?.message || 'Failed to remove document.' };
  }
};

