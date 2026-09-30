import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii } from '../theme/tokens';
import Header from '../components/Header';
import DocumentCard from '../components/DocumentCard';
import ZoomCard from '../components/ZoomCard';
import ViewToggle from '../components/ViewToggle';
import UploadSuccessModal from '../components/UploadSuccessModal';
import DocumentDetailModal from '../components/DocumentDetailModal';
import { useAuth } from '../context/AuthContext';
import {
  listStudentDocuments,
  SUPPORTED_DOCUMENT_TYPES,
  toDocumentCardProps,
  uploadStudentDocument,
  deleteStudentDocument,
} from '../services/documentService';
import {
  downloadDocumentToDevice,
} from '../utils/documentViewer';

export default function CredentialsScreen({ onNavigate }) {
  const { currentStudent } = useAuth();
  const [activeSegment, setActiveSegment] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [justUploadedDocument, setJustUploadedDocument] = useState(null);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    listStudentDocuments(currentStudent?.roll_no).then((result) => {
      if (isMounted) {
        setDocuments(result.documents || []);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentStudent?.roll_no]);

  const handleUpload = async () => {
    if (!currentStudent?.roll_no) {
      Alert.alert('Sign in required', 'Sign in before uploading a document or image.');
      return;
    }

    const selection = await DocumentPicker.getDocumentAsync({
      type: SUPPORTED_DOCUMENT_TYPES,
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (selection.canceled || !selection.assets?.[0]) return;

    setIsUploading(true);
    const result = await uploadStudentDocument({
      asset: selection.assets[0],
      rollNo: currentStudent.roll_no,
    });
    setIsUploading(false);

    if (!result.success) {
      Alert.alert('Upload failed', result.error);
      return;
    }

    setDocuments((current) => [result.document, ...current]);
    setJustUploadedDocument(result.document);
    setIsSuccessModalVisible(true);
  };

  const filteredDocuments = documents.filter((document) => {
    if (activeSegment === 'all') return true;
    return activeSegment === 'pdf'
      ? document.format === 'pdf' || document.mime_type === 'application/pdf'
      : document.format === 'doc' || document.format === 'docx';
  });

  return (
    <View style={styles.container}>
      <Header
        title="Credentials"
        eyebrow="RIMT ACADEMIC TRUST"
        onNotificationPress={() => Alert.alert('Credentials', 'All credentials cryptographically certified.')}
        onProfilePress={() => onNavigate?.('profile')}
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.eyebrow}>Cryptographic Credential Vault</Text>
          <View style={styles.titleRow}>
            <Text style={styles.heading}>Institutional Certifications</Text>
            {/* List/Grid Toggle — Mega Update §4.3 */}
            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </View>
          <Text style={styles.subtext}>
            Tamper-proof, digitally signed academic records validated on the RIMT institutional ledger.
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUpload}
            disabled={isUploading}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel="Upload document or image"
          >
            <MaterialIcons name="cloud-upload" size={18} color="#ffffff" />
            <Text style={styles.uploadButtonText}>
              {isUploading ? 'Uploading...' : 'Upload document or image'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Segment — zoom on hover/tap (Mega Update §4.3) */}
        <View style={styles.segmentRow}>
          {[
            { id: 'all', label: 'All Documents' },
            { id: 'pdf', label: 'PDF' },
            { id: 'word', label: 'Word Files' },
          ].map((seg) => (
            <ZoomCard
              key={seg.id}
              style={[styles.segmentBtn, activeSegment === seg.id && styles.segmentBtnActive]}
              onPress={() => setActiveSegment(seg.id)}
              scaleTo={1.08}
            >
              <Text
                style={[
                  styles.segmentBtnText,
                  activeSegment === seg.id && styles.segmentBtnTextActive,
                ]}
              >
                {seg.label}
              </Text>
            </ZoomCard>
          ))}
        </View>

        {/* Credential Cards */}
        <View style={[styles.cardList, viewMode === 'grid' && styles.gridCardList]}>
          {isLoading && <Text style={styles.emptyText}>Loading your documents...</Text>}
          {!isLoading && filteredDocuments.length === 0 && (
            <Text style={styles.emptyText}>No matching uploaded documents found.</Text>
          )}
          {!isLoading && filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id || document.cloudinary_public_id}
              {...toDocumentCardProps(document)}
              viewMode={viewMode}
              onPress={() => setSelectedDocument(document)}
              onDownloadPress={() => downloadDocumentToDevice(document)}
            />
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Upload Success Modal */}
      <UploadSuccessModal
        visible={isSuccessModalVisible}
        document={justUploadedDocument}
        onClose={() => setIsSuccessModalVisible(false)}
        onViewDocument={(doc) => setSelectedDocument(doc)}
        onDownloadDocument={(doc) => downloadDocumentToDevice(doc)}
      />

      {/* Document Detail Modal */}
      <DocumentDetailModal
        visible={!!selectedDocument}
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
        onDelete={async (doc) => {
          await deleteStudentDocument({ documentId: doc.id, rollNo: currentStudent.roll_no });
          setDocuments((cur) => cur.filter((d) => d.id !== doc.id && d.cloudinary_public_id !== doc.cloudinary_public_id));
          setSelectedDocument(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  titleSection: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.spaceMd,
    paddingBottom: Spacing.spaceSm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    ...Typography.eyebrow,
    color: Colors.textSecondary,
    fontSize: 10.5,
    marginBottom: 2,
  },
  heading: {
    ...Typography.headlineMd,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  subtext: {
    ...Typography.bodyMd,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  uploadButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.spaceSm,
    paddingHorizontal: Spacing.spaceMd,
    paddingVertical: 10,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
  },
  uploadButtonText: {
    ...Typography.labelSm,
    color: '#ffffff',
    fontWeight: '700',
  },
  segmentRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.margin,
    gap: 8,
    marginBottom: Spacing.spaceMd,
  },
  segmentBtn: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  segmentBtnText: {
    ...Typography.labelSm,
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '500',
  },
  segmentBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  cardList: {
    paddingHorizontal: Spacing.margin,
  },
  gridCardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyText: {
    ...Typography.bodyMd,
    paddingHorizontal: Spacing.margin,
    paddingVertical: Spacing.spaceLg,
    color: Colors.textSecondary,
  },
});
