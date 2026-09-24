import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Spacing, Typography, Radii } from '../theme/tokens';
import Header from '../components/Header';
import DocumentCard from '../components/DocumentCard';

export default function CredentialsScreen({ onNavigate }) {
  const [activeSegment, setActiveSegment] = useState('all');

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
          <Text style={styles.heading}>Institutional Certifications</Text>
          <Text style={styles.subtext}>
            Tamper-proof, digitally signed academic records validated on the RIMT institutional ledger.
          </Text>
        </View>

        {/* Filter Segment */}
        <View style={styles.segmentRow}>
          {[
            { id: 'all', label: 'All Records' },
            { id: 'degrees', label: 'Degrees (3)' },
            { id: 'transcripts', label: 'Transcripts' },
          ].map((seg) => (
            <TouchableOpacity
              key={seg.id}
              style={[styles.segmentBtn, activeSegment === seg.id && styles.segmentBtnActive]}
              onPress={() => setActiveSegment(seg.id)}
            >
              <Text
                style={[
                  styles.segmentBtnText,
                  activeSegment === seg.id && styles.segmentBtnTextActive,
                ]}
              >
                {seg.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Credential Cards */}
        <View style={styles.cardList}>
          <DocumentCard
            icon="military-tech"
            iconColor={Colors.primary}
            iconBgColor="rgba(163, 19, 33, 0.08)"
            statusBadge="Verified"
            statusBadgeColor={Colors.verifiedGreen}
            statusBadgeBg="rgba(46, 125, 79, 0.1)"
            fileMeta="PDF · 2.4 MB · SHA-256 Validated"
            title="Bachelor of Technology (CSE)"
            verificationLabel="Digitally Signed by Vice-Chancellor"
            verificationIcon="lock"
            onDownloadPress={() => Alert.alert('Download', 'Downloading Bachelor of Technology degree…')}
          />

          <DocumentCard
            icon="description"
            iconColor={Colors.secondary}
            iconBgColor="rgba(62, 97, 134, 0.08)"
            statusBadge="Official"
            statusBadgeColor={Colors.secondary}
            statusBadgeBg={Colors.surfaceContainerHigh}
            fileMeta="PDF · 1.1 MB · 8 Semesters"
            title="Cumulative Grade Transcript (Sem 1-7)"
            verificationLabel="Certified by Controller of Examinations"
            verificationIcon="verified"
            onDownloadPress={() => Alert.alert('Download', 'Downloading Cumulative Grade Transcript…')}
          />

          <DocumentCard
            icon="card-membership"
            iconColor={Colors.tertiary}
            iconBgColor="rgba(88, 107, 134, 0.1)"
            statusBadge="Verified"
            statusBadgeColor={Colors.verifiedGreen}
            statusBadgeBg="rgba(46, 125, 79, 0.1)"
            fileMeta="PDF · 850 KB · Merit Honor"
            title="Dean's Academic Excellence Honor Roll"
            verificationLabel="Registrar Seal Validated"
            verificationIcon="verified-user"
            onDownloadPress={() => Alert.alert('Download', 'Downloading Honor Roll Certificate…')}
          />

          <DocumentCard
            icon="workspace-premium"
            iconColor={Colors.primary}
            iconBgColor="rgba(163, 19, 33, 0.08)"
            statusBadge="Issued"
            statusBadgeColor={Colors.secondary}
            statusBadgeBg={Colors.surfaceContainerHigh}
            fileMeta="PDF · 620 KB · Lab Work"
            title="Advanced Data Structures Lab Certification"
            verificationLabel="Department of Computer Science"
            verificationIcon="verified"
            onDownloadPress={() => Alert.alert('Download', 'Downloading Lab Certificate…')}
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
});
