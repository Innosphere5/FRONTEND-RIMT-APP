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

export default function DownloadsScreen({ onNavigate }) {
  const { currentStudent } = useAuth();
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
      Alert.alert('Sign in required', 'Sign in before uploading a document.');
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

  return (
    <View style={styles.container}>
      <Header
        title="Downloads"
        eyebrow="RIMT ACADEMIC TRUST"
        onNotificationPress={() => Alert.alert('Downloads', 'Offline documents are up to date.')}
        onProfilePress={() => onNavigate?.('profile')}
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.eyebrow}>Offline Document Cache</Text>
          <View style={styles.titleRow}>
            <Text style={styles.heading}>Downloaded Transcripts &amp; Seals</Text>
            {/* List/Grid Toggle — Mega Update §4.1 */}
            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </View>
          <Text style={styles.subtext}>
            Cryptographically sealed offline copies available for local presentation and employer verification.
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUpload}
            disabled={isUploading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Upload document"
          >
            <Text style={styles.uploadButtonText}>{isUploading ? 'Uploading...' : 'Upload PDF or Word file'}</Text>
          </TouchableOpacity>
        </View>

        {/* Storage Bar — zoom on hover/tap (Mega Update §4.1) */}
        <ZoomCard
          scaleTo={1.05}
          containerStyle={styles.storageCardWrapper}
        >
          <View style={styles.storageCard}>
            <View style={styles.storageHeader}>
              <Text style={styles.storageTitle}>Institutional Storage Used</Text>
              <Text style={styles.storageValue}>4.35 MB / 50 MB</Text>
            </View>
            <View style={styles.storageBarBg}>
              <View style={styles.storageBarFill} />
            </View>
          </View>
        </ZoomCard>

        {/* Live uploaded documents */}
        <View style={[styles.cardList, viewMode === 'grid' && styles.gridCardList]}>
          {isLoading && <Text style={styles.emptyText}>Loading your documents...</Text>}
          {!isLoading && documents.length === 0 && (
            <Text style={styles.emptyText}>No documents uploaded yet. Choose a PDF or Word file above.</Text>
          )}
          {!isLoading && documents.map((document) => (
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
  storageCardWrapper: {
    marginHorizontal: Spacing.margin,
    marginBottom: Spacing.spaceMd,
  },
  storageCard: {
    backgroundColor: '#ffffff',
    borderRadius: Radii.lg,
    padding: Spacing.spaceMd,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storageTitle: {
    ...Typography.labelSm,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  storageValue: {
    ...Typography.codeXs,
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  storageBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.canvas,
    overflow: 'hidden',
  },
  storageBarFill: {
    width: '12%',
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
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
