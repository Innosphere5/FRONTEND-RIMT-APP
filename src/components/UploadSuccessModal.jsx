import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radii, Typography, Spacing } from '../theme/tokens';
import { formatDocumentSize, getDocumentIcon } from '../services/documentService';

export default function UploadSuccessModal({
  visible,
  document,
  onClose,
  onViewDocument,
  onDownloadDocument,
}) {
  if (!document) return null;

  const isLocal = document.storage_provider === 'local';
  const icon = getDocumentIcon(document);
  const iconColor = document.format === 'pdf' ? '#A31321' : document.mime_type?.startsWith('image/') ? '#0284C7' : '#3E6186';
  const iconBgColor = document.format === 'pdf' ? 'rgba(163, 19, 33, 0.08)' : document.mime_type?.startsWith('image/') ? 'rgba(2, 132, 199, 0.08)' : 'rgba(62, 97, 134, 0.08)';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          {/* Top Emerald Success Badge */}
          <View style={styles.badgeRing}>
            <View style={styles.badgeCircle}>
              <MaterialIcons name="check" size={32} color="#ffffff" />
            </View>
          </View>

          {/* Heading and Subtext */}
          <Text style={styles.title}>Upload Complete</Text>
          <Text style={styles.subtitle}>
            Your document has been cryptographically validated and secured in the academic credential vault.
          </Text>

          {/* Document Summary Card */}
          <View style={styles.docSummaryCard}>
            <View style={[styles.docIconWrapper, { backgroundColor: iconBgColor }]}>
              <MaterialIcons name={icon} size={26} color={iconColor} />
            </View>
            <View style={styles.docInfoCol}>
              <Text style={styles.docTitle} numberOfLines={1}>
                {document.title || document.original_filename || 'Uploaded Document'}
              </Text>
              <View style={styles.docMetaRow}>
                <Text style={styles.docMetaText}>
                  {(document.format || 'file').toUpperCase()} · {formatDocumentSize(document.file_size)}
                </Text>
                <View style={styles.vaultPill}>
                  <MaterialIcons
                    name={isLocal ? 'phone-android' : 'cloud-done'}
                    size={11}
                    color={Colors.verifiedGreen}
                  />
                  <Text style={styles.vaultPillText}>
                    {isLocal ? 'Device Vault' : 'Cloud Vault'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            {onViewDocument && (
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => {
                  onClose();
                  onViewDocument(document);
                }}
                activeOpacity={0.75}
              >
                <MaterialIcons name="visibility" size={17} color={Colors.secondaryNavy} />
                <Text style={styles.secondaryBtnText}>View File</Text>
              </TouchableOpacity>
            )}

            {onDownloadDocument && (
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => {
                  onClose();
                  onDownloadDocument(document);
                }}
                activeOpacity={0.75}
              >
                <MaterialIcons name="download" size={17} color={Colors.secondaryNavy} />
                <Text style={styles.secondaryBtnText}>Download</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Done</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.margin,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: Radii.xxl,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
  badgeRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(46, 125, 79, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badgeCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.verifiedGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.verifiedGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    ...Typography.headlineSm,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyMd,
    fontSize: 13,
    lineHeight: 18.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  docSummaryCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    gap: 12,
    marginBottom: 20,
  },
  docIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfoCol: {
    flex: 1,
  },
  docTitle: {
    ...Typography.labelMd,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  docMetaText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  vaultPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.verifiedGreenBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  vaultPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.verifiedGreen,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 10,
  },
  secondaryBtn: {
    flex: 1,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  secondaryBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.secondaryNavy,
  },
  primaryBtn: {
    width: '100%',
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
});
