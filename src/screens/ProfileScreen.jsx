import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii, ImageAssets } from '../theme/tokens';
import Header from '../components/Header';
import ShineEffect from '../components/ShineEffect';

export default function ProfileScreen({ onNavigate }) {
  const [detailsExpanded, setDetailsExpanded] = useState(true);

  return (
    <View style={styles.container}>
      <Header
        title="Profile"
        eyebrow="RIMT ACADEMIC TRUST"
        onNotificationPress={() => Alert.alert('Notifications', 'Profile documents reviewed.')}
        onProfilePress={() => Alert.alert('Scholar ID', 'RIMT/22/BTCSE/0417 · Harpreet Singh')}
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contextual Action Strip */}
        <View style={styles.actionStrip}>
          <View style={styles.recordIndicator}>
            <View style={styles.activeRecordDot} />
            <Text style={styles.recordIndicatorText}>Active Scholar Record</Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => Alert.alert('Edit Profile', 'Edit request submitted to Registrar portal.')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="edit" size={14} color={Colors.secondary} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Scholar Identity Card */}
        <View style={styles.identityCardWrapper}>
          <LinearGradient
            colors={['#182b42', '#101e30', '#0d1826']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.identityCard}
          >
            {/* Crystalline Shimmer Sweep Animation */}
            <ShineEffect
              colors={[
                'transparent',
                'rgba(255, 255, 255, 0.02)',
                'rgba(255, 255, 255, 0.22)',
                'rgba(255, 255, 255, 0.6)',
                'rgba(255, 255, 255, 0.22)',
                'rgba(255, 255, 255, 0.02)',
                'transparent',
              ]}
              duration={2700}
              delay={2400}
              angle="-20deg"
            />

            <View style={styles.identityHeader}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: ImageAssets.studentAvatar }}
                  style={styles.avatarImage}
                />
                <View style={styles.avatarCheckBadge}>
                  <MaterialIcons name="check" size={12} color="#ffffff" />
                </View>
              </View>

              <View style={styles.identityDetails}>
                <Text style={styles.studentName}>Harpreet Singh</Text>
                <View style={styles.enrollmentTag}>
                  <Text style={styles.enrollmentText}>RIMT/22/BTCSE/0417</Text>
                </View>
                <Text style={styles.programText}>
                  Computer Science &amp; Engineering · Batch 2022–26 · Section A
                </Text>
              </View>
            </View>

            {/* Profile Completion Bar */}
            <TouchableOpacity
              style={styles.completionBanner}
              onPress={() => Alert.alert('Profile Completion', 'Complete document verification to achieve 100%.')}
              activeOpacity={0.8}
            >
              <View style={styles.completionLeft}>
                <MaterialIcons name="verified-user" size={18} color={Colors.pendingAmber} />
                <Text style={styles.completionTitle}>Profile 85% complete</Text>
              </View>
              <View style={styles.completionRight}>
                <Text style={styles.finishText}>FINISH</Text>
                <MaterialIcons name="chevron-right" size={16} color="#fef3c7" />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Academic Summary Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Academic Summary</Text>
            <Text style={styles.sessionMetaText}>AY 2025-26</Text>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryRow}>
              {/* Card 1: Semester */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryCardLabel}>Current semester</Text>
                <View style={styles.summaryCardBottom}>
                  <Text style={styles.summaryCardValue}>Semester 8</Text>
                  <MaterialIcons name="school" size={18} color={Colors.secondary} />
                </View>
              </View>

              {/* Card 2: CGPA */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryCardLabel}>Cumulative CGPA</Text>
                <View style={styles.summaryCardBottom}>
                  <Text style={[styles.summaryCardValue, { color: Colors.primary }]}>
                    8.84 <Text style={styles.cgpaMax}>/ 10.0</Text>
                  </Text>
                  <MaterialIcons name="grade" size={18} color={Colors.primary} />
                </View>
              </View>
            </View>

            <View style={[styles.summaryRow, { marginTop: 8 }]}>
              {/* Card 3: Attendance */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryCardLabel}>Overall Attendance</Text>
                <View style={styles.summaryCardBottom}>
                  <Text style={[styles.summaryCardValue, { color: Colors.verifiedGreen }]}>
                    92.4%
                  </Text>
                  <MaterialIcons name="fact-check" size={18} color={Colors.verifiedGreen} />
                </View>
              </View>

              {/* Card 4: Faculty Advisor */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryCardLabel}>Faculty Advisor</Text>
                <View style={styles.summaryCardBottom}>
                  <Text style={[styles.summaryCardValue, { fontSize: 13 }]} numberOfLines={1}>
                    Dr. Gurpreet Kaur
                  </Text>
                  <MaterialIcons name="co-present" size={18} color={Colors.secondary} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Contact & Personal Details Expandable Card */}
        <View style={styles.detailsCardWrapper}>
          <TouchableOpacity
            style={styles.detailsCardHeader}
            onPress={() => setDetailsExpanded(!detailsExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.detailsHeaderLeft}>
              <MaterialIcons name="badge" size={20} color={Colors.secondary} />
              <Text style={styles.detailsHeaderTitle}>Contact &amp; Personal Details</Text>
            </View>
            <MaterialIcons
              name={detailsExpanded ? 'expand-less' : 'expand-more'}
              size={22}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          {detailsExpanded && (
            <View style={styles.detailsBody}>
              <View style={styles.detailRow}>
                <View style={styles.detailLabelRow}>
                  <MaterialIcons name="phone" size={17} color={Colors.secondary} />
                  <Text style={styles.detailLabel}>Phone</Text>
                </View>
                <Text style={styles.detailValue}>+91 98765 43210</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailLabelRow}>
                  <MaterialIcons name="alternate-email" size={17} color={Colors.secondary} />
                  <Text style={styles.detailLabel}>Email</Text>
                </View>
                <Text style={styles.detailValue} numberOfLines={1}>
                  harpreet.s@rimt.ac.in
                </Text>
              </View>

              <View style={styles.grid2Col}>
                <View style={styles.gridColCard}>
                  <Text style={styles.detailLabel}>Date of Birth</Text>
                  <Text style={styles.detailValueLarge}>14 Oct 2004</Text>
                </View>
                <View style={styles.gridColCard}>
                  <Text style={styles.detailLabel}>Blood Group</Text>
                  <Text style={styles.detailValueLarge}>B+</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Documents on File Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Documents on file</Text>
            <Text style={styles.docCountMeta}>3 of 4 verified</Text>
          </View>

          {/* Aadhaar Card */}
          <View style={styles.documentItem}>
            <View style={styles.docItemLeft}>
              <View style={styles.docIconBox}>
                <MaterialIcons name="fingerprint" size={20} color={Colors.secondary} />
              </View>
              <View style={styles.docItemText}>
                <Text style={styles.docItemTitle}>Aadhaar Card</Text>
                <View style={styles.docVerifiedPill}>
                  <View style={styles.greenDotSmall} />
                  <Text style={styles.docVerifiedText}>Verified</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.docViewBtn}
              onPress={() => Alert.alert('Aadhaar Card', 'Viewing verified Aadhaar card snapshot.')}
              activeOpacity={0.7}
            >
              <MaterialIcons name="visibility" size={18} color={Colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Admission Letter */}
          <View style={styles.documentItem}>
            <View style={styles.docItemLeft}>
              <View style={styles.docIconBox}>
                <MaterialIcons name="description" size={20} color={Colors.secondary} />
              </View>
              <View style={styles.docItemText}>
                <Text style={styles.docItemTitle}>Admission Letter</Text>
                <View style={styles.docVerifiedPill}>
                  <View style={styles.greenDotSmall} />
                  <Text style={styles.docVerifiedText}>Verified</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.docViewBtn}
              onPress={() => Alert.alert('Admission Letter', 'Viewing verified RIMT Admission letter.')}
              activeOpacity={0.7}
            >
              <MaterialIcons name="visibility" size={18} color={Colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Semester 7 Fee Receipt */}
          <View style={styles.documentItem}>
            <View style={styles.docItemLeft}>
              <View style={styles.docIconBox}>
                <MaterialIcons name="receipt-long" size={20} color={Colors.secondary} />
              </View>
              <View style={styles.docItemText}>
                <Text style={styles.docItemTitle}>Semester 7 Fee Receipt</Text>
                <View style={styles.docVerifiedPill}>
                  <View style={styles.greenDotSmall} />
                  <Text style={styles.docVerifiedText}>Verified</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.docViewBtn}
              onPress={() => Alert.alert('Fee Receipt', 'Receipt verified with accounts department.')}
              activeOpacity={0.7}
            >
              <MaterialIcons name="visibility" size={18} color={Colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Migration Certificate (Pending) */}
          <View style={[styles.documentItem, styles.pendingDocItem]}>
            <View style={styles.docItemLeft}>
              <View style={[styles.docIconBox, { backgroundColor: 'rgba(254, 243, 199, 0.9)' }]}>
                <MaterialIcons name="upload-file" size={20} color={Colors.pendingAmber} />
              </View>
              <View style={styles.docItemText}>
                <Text style={styles.docItemTitle}>Migration Certificate</Text>
                <View style={styles.docPendingPill}>
                  <View style={styles.amberDotSmall} />
                  <Text style={styles.docPendingText}>Pending</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.docAddBtn}
              onPress={() => Alert.alert('Upload Certificate', 'Upload dialog opened for Migration Certificate.')}
              activeOpacity={0.85}
            >
              <MaterialIcons name="add" size={16} color="#ffffff" />
              <Text style={styles.docAddBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pinned Primary CTA */}
        <View style={styles.updateCtaWrapper}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => Alert.alert('Update Profile', 'Scholar profile submitted for Registrar verification.')}
            activeOpacity={0.85}
          >
            <MaterialIcons name="sync" size={20} color="#ffffff" />
            <Text style={styles.updateButtonText}>Update profile</Text>
          </TouchableOpacity>
          <Text style={styles.updateFootnote}>
            Last authenticated update: 12 Feb 2026 · Digital Registrar
          </Text>
        </View>

        {/* Space for bottom navigation */}
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
  actionStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.spaceSm,
    paddingBottom: Spacing.spaceXs,
  },
  recordIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeRecordDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.verifiedGreen,
  },
  recordIndicatorText: {
    ...Typography.eyebrow,
    color: Colors.textSecondary,
    fontSize: 10.5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#12263D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  editButtonText: {
    ...Typography.labelSm,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
  identityCardWrapper: {
    paddingHorizontal: Spacing.margin,
    marginTop: Spacing.spaceXs,
  },
  identityCard: {
    borderRadius: Radii.xl,
    padding: Spacing.spaceMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  identityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.spaceMd,
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: Radii.lg,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: Radii.lg,
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.verifiedGreen,
    borderWidth: 2,
    borderColor: '#101e30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityDetails: {
    flex: 1,
  },
  studentName: {
    ...Typography.headlineMd,
    fontSize: 19,
    fontWeight: '700',
    color: '#ffffff',
  },
  enrollmentTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    marginTop: 4,
    marginBottom: 4,
  },
  enrollmentText: {
    ...Typography.codeXs,
    fontSize: 11,
    color: 'rgb(203, 213, 225)',
  },
  programText: {
    ...Typography.bodyMd,
    fontSize: 12,
    color: 'rgb(203, 213, 225)',
    lineHeight: 16,
  },
  completionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderRadius: Radii.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.38)',
    marginTop: Spacing.spaceMd,
  },
  completionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completionTitle: {
    ...Typography.labelSm,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgb(253, 230, 138)',
  },
  completionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  finishText: {
    ...Typography.eyebrow,
    fontSize: 10,
    fontWeight: '700',
    color: '#fef3c7',
  },
  section: {
    marginTop: Spacing.spaceLg,
    paddingHorizontal: Spacing.margin,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.spaceSm,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sessionMetaText: {
    ...Typography.codeXs,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  summaryGrid: {
    width: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    height: 84,
    backgroundColor: '#ffffff',
    borderRadius: Radii.lg,
    padding: Spacing.spaceSm,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
    shadowColor: '#12263D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryCardLabel: {
    ...Typography.labelSm,
    fontSize: 11.5,
    color: Colors.textSecondary,
  },
  summaryCardBottom: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  summaryCardValue: {
    ...Typography.titleFormal,
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cgpaMax: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  detailsCardWrapper: {
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.spaceLg,
    backgroundColor: 'rgba(243, 245, 249, 0.85)',
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(209, 218, 235, 0.8)',
    overflow: 'hidden',
  },
  detailsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.spaceMd,
  },
  detailsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsHeaderTitle: {
    ...Typography.headlineSm,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  detailsBody: {
    paddingHorizontal: Spacing.spaceMd,
    paddingBottom: Spacing.spaceMd,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    ...Typography.labelSm,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  detailValue: {
    ...Typography.codeSm,
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  grid2Col: {
    flexDirection: 'row',
    gap: 8,
  },
  gridColCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailValueLarge: {
    ...Typography.bodyMdMedium,
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  docCountMeta: {
    ...Typography.labelSm,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: Radii.lg,
    padding: Spacing.spaceSm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    shadowColor: '#12263D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  pendingDocItem: {
    backgroundColor: 'rgba(255, 253, 248, 0.98)',
    borderColor: 'rgba(245, 158, 11, 0.28)',
  },
  docItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.spaceSm,
    flex: 1,
  },
  docIconBox: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docItemText: {
    flex: 1,
  },
  docItemTitle: {
    ...Typography.bodyMdMedium,
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  docVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(46, 125, 79, 0.1)',
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  greenDotSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.verifiedGreen,
  },
  docVerifiedText: {
    ...Typography.labelSm,
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.verifiedGreen,
  },
  docPendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  amberDotSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.pendingAmber,
  },
  docPendingText: {
    ...Typography.labelSm,
    fontSize: 10.5,
    fontWeight: '600',
    color: Colors.pendingAmber,
  },
  docViewBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: Radii.full,
    backgroundColor: Colors.pendingAmber,
  },
  docAddBtnText: {
    ...Typography.labelSm,
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  updateCtaWrapper: {
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.spaceLg,
  },
  updateButton: {
    height: 48,
    borderRadius: Radii.md,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  updateButtonText: {
    ...Typography.labelMd,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#ffffff',
  },
  updateFootnote: {
    ...Typography.codeXs,
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
