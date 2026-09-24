import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors, Spacing, Typography, Radii } from '../theme/tokens';
import Header from '../components/Header';
import DocumentCard from '../components/DocumentCard';

export default function DownloadsScreen({ onNavigate }) {
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
          <Text style={styles.heading}>Downloaded Transcripts &amp; Seals</Text>
          <Text style={styles.subtext}>
            Cryptographically sealed offline copies available for local presentation and employer verification.
          </Text>
        </View>

        {/* Storage Bar */}
        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <Text style={styles.storageTitle}>Institutional Storage Used</Text>
            <Text style={styles.storageValue}>4.35 MB / 50 MB</Text>
          </View>
          <View style={styles.storageBarBg}>
            <View style={styles.storageBarFill} />
          </View>
        </View>

        {/* Downloaded items */}
        <View style={styles.cardList}>
          <DocumentCard
            icon="description"
            iconColor={Colors.primary}
            iconBgColor="rgba(163, 19, 33, 0.08)"
            statusBadge="Cached"
            statusBadgeColor={Colors.verifiedGreen}
            statusBadgeBg="rgba(46, 125, 79, 0.1)"
            fileMeta="PDF · 2.4 MB · Saved locally"
            title="Bachelor of Technology (CSE)"
            verificationLabel="Verified Offline Signature"
            verificationIcon="check-circle"
            onDownloadPress={() => Alert.alert('File', 'File already downloaded in secure storage.')}
          />

          <DocumentCard
            icon="receipt-long"
            iconColor={Colors.secondary}
            iconBgColor="rgba(62, 97, 134, 0.08)"
            statusBadge="Cached"
            statusBadgeColor={Colors.verifiedGreen}
            statusBadgeBg="rgba(46, 125, 79, 0.1)"
            fileMeta="PDF · 1.1 MB · Saved locally"
            title="Cumulative Grade Transcript (Sem 1-7)"
            verificationLabel="Verified Offline Signature"
            verificationIcon="check-circle"
            onDownloadPress={() => Alert.alert('File', 'File already downloaded in secure storage.')}
          />

          <DocumentCard
            icon="badge"
            iconColor={Colors.tertiary}
            iconBgColor="rgba(88, 107, 134, 0.1)"
            statusBadge="Cached"
            statusBadgeColor={Colors.verifiedGreen}
            statusBadgeBg="rgba(46, 125, 79, 0.1)"
            fileMeta="PDF · 850 KB · Identity Proof"
            title="Institutional Student ID & Scholar Pass"
            verificationLabel="QR Code Cryptographically Active"
            verificationIcon="qr-code-2"
            onDownloadPress={() => Alert.alert('File', 'File already downloaded in secure storage.')}
          />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
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
  },
  subtext: {
    ...Typography.bodyMd,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  storageCard: {
    marginHorizontal: Spacing.margin,
    marginBottom: Spacing.spaceMd,
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
});
