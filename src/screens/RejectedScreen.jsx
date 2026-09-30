import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii } from '../theme/tokens';

export default function RejectedScreen({ student, rejectionReason, onBackToSignIn }) {
  const isRevoked = student?.status === 'REVOKED';
  const scholarName = student?.full_name || student?.name || 'Applicant';
  const rollNo = student?.roll_number || student?.roll_no || 'N/A';
  const reasonText =
    rejectionReason ||
    student?.rejection_reason ||
    student?.revocation_reason ||
    'Submitted student information does not match active university registrar batch records.';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top University Brand Bar */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <MaterialIcons name="security" size={28} color="#dc2626" />
        </View>
        <Text style={styles.universityTitle}>RIMT UNIVERSITY</Text>
        <Text style={styles.portalSubtitle}>Academic & Placement Trust</Text>
      </View>

      {/* Rejection Alert Card */}
      <LinearGradient
        colors={['#fff1f2', '#ffe4e6', '#fff']}
        style={styles.heroCard}
      >
        <View style={styles.iconCircle}>
          <MaterialIcons name="cancel" size={42} color="#dc2626" />
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>{isRevoked ? 'PORTAL ACCESS REVOKED' : 'APPLICATION REJECTED'}</Text>
        </View>

        <Text style={styles.heroTitle}>{isRevoked ? 'Portal Access Revoked' : 'Registration Not Approved'}</Text>
        <Text style={styles.heroDescription}>
          {isRevoked
            ? `Portal access for ${scholarName} (${rollNo}) was revoked by the University Administration.`
            : `The application for ${scholarName} (${rollNo}) was reviewed by the University Administration and could not be approved for campus portal access.`}
        </Text>
      </LinearGradient>

      {/* Official Reason Section */}
      <View style={styles.reasonCard}>
        <View style={styles.reasonHeader}>
          <MaterialIcons name="info" size={20} color="#dc2626" />
          <Text style={styles.reasonHeaderTitle}>OFFICIAL REGISTRAR REMARKS</Text>
        </View>
        <Text style={styles.reasonText}>&ldquo;{reasonText}&rdquo;</Text>
      </View>

      {/* Resolution Advice */}
      <View style={styles.adviceCard}>
        <Text style={styles.adviceTitle}>WHAT SHOULD YOU DO NEXT?</Text>

        <View style={styles.adviceRow}>
          <MaterialIcons name="fact-check" size={18} color={Colors.textSecondary} />
          <Text style={styles.adviceText}>
            Ensure your university roll number and registered email strictly match your admission offer letter.
          </Text>
        </View>

        <View style={styles.adviceRow}>
          <MaterialIcons name="contact-support" size={18} color={Colors.textSecondary} />
          <Text style={styles.adviceText}>
            Contact your department Single Point of Contact (SPOC) or visit the Placement Administration Desk in Block A.
          </Text>
        </View>

        <View style={styles.adviceRow}>
          <MaterialIcons name="mail-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.adviceText}>
            Direct queries can be emailed to <Text style={styles.linkText}>registrar@rimt.ac.in</Text>
          </Text>
        </View>
      </View>

      {/* Return to Sign In / Sign Up */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onBackToSignIn}
        activeOpacity={0.8}
      >
        <MaterialIcons name="arrow-back" size={18} color="#fff" />
        <Text style={styles.actionButtonText}>Back to Sign In / Register Again</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  header: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  logoBadge: {
    width: 54,
    height: 54,
    borderRadius: Radii.lg,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  universityTitle: {
    fontSize: Typography?.bodyMedium?.fontSize || 14,
    fontWeight: '800',
    color: '#991b1b',
    letterSpacing: 1.5,
  },
  portalSubtitle: {
    fontSize: Typography?.caption?.fontSize || 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  heroCard: {
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    marginVertical: Spacing.md,
    borderWidth: 1,
    borderColor: '#fecdd3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statusPill: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.pill,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991b1b',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: Typography?.titleLarge?.fontSize || 20,
    fontWeight: '800',
    color: '#991b1b',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  heroDescription: {
    fontSize: Typography?.bodySmall?.fontSize || 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reasonCard: {
    backgroundColor: '#fff',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  reasonHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991b1b',
    letterSpacing: 1,
  },
  reasonText: {
    fontSize: Typography?.bodySmall?.fontSize || 13,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  adviceCard: {
    backgroundColor: '#fff',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  adviceTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  adviceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  adviceText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: Typography?.bodyMedium?.fontSize || 14,
    fontWeight: '700',
  },
});
