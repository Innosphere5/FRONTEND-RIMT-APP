import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';

export default function PendingApprovalScreen({ student, onApproved, onRejected, onBackToSignIn }) {
  const { checkStatusForStudent } = useAuth();
  const [checking, setChecking] = useState(false);
  const currentStudent = student || {};

  // Real-time background status verification
  React.useEffect(() => {
    const rollNo = currentStudent.roll_number || currentStudent.roll_no;
    if (!rollNo) return;

    let isMounted = true;

    const pollStatus = async () => {
      try {
        const result = await checkStatusForStudent({ rollNo });
        if (!isMounted) return false;

        if (result.status === 'APPROVED' || result.status === 'VERIFIED') {
          onApproved?.(result.student);
          return true;
        }

        if (result.status === 'REJECTED' || result.status === 'REVOKED') {
          onRejected?.(result.student, result.reason || result.student?.revocation_reason);
          return true;
        }
      } catch (_err) {
        // silent background check
      }
      return false;
    };

    // Check immediately on mount
    pollStatus();

    // Poll every 3.5 seconds in real time
    const interval = setInterval(async () => {
      const finished = await pollStatus();
      if (finished) clearInterval(interval);
    }, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentStudent.roll_number, currentStudent.roll_no, checkStatusForStudent, onApproved, onRejected]);

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const rollNo = currentStudent.roll_number || currentStudent.roll_no;

      const result = await checkStatusForStudent({ rollNo });
      if (result.status === 'APPROVED' || result.status === 'VERIFIED') {
        Alert.alert(
          'Congratulations!',
          'Your account has been APPROVED by University Administration. Welcome to RIMT Portal!',
          [{ text: 'Enter Campus Portal', onPress: () => onApproved?.(result.student) }]
        );
      } else if (result.status === 'REJECTED' || result.status === 'REVOKED') {
        Alert.alert(
          result.status === 'REVOKED' ? 'Access Revoked' : 'Application Update',
          result.status === 'REVOKED'
            ? `Your portal access was revoked. Reason: ${result.reason || result.student?.revocation_reason || 'Administrative decision.'}`
            : `Your application was reviewed and rejected. Reason: ${result.reason || 'Criteria not met.'}`,
          [{ text: 'View Rejection Details', onPress: () => (onRejected ? onRejected(result.student, result.reason) : onBackToSignIn?.()) }]
        );
      } else {
        Alert.alert(
          'Still Under Review',
          'Your application is currently in the Admin queue. The administrator will review your enrollment shortly.',
          [{ text: 'Got It' }]
        );
      }
    } catch (_err) {
      Alert.alert('Status Check', 'Could not refresh status at this moment. Please try again shortly.');
    } finally {
      setChecking(false);
    }
  };

  const scholarName = currentStudent.full_name || currentStudent.name || 'Scholar';
  const rollNo = currentStudent.roll_number || currentStudent.roll_no || 'N/A';
  const dept = currentStudent.department || 'Undergraduate Studies';
  const sem = currentStudent.year_semester || currentStudent.semester || 'Academic Year';
  const email = currentStudent.email || 'scholar@rimt.ac.in';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top University Brand Bar */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <MaterialIcons name="security" size={28} color={Colors.primary} />
        </View>
        <Text style={styles.universityTitle}>RIMT UNIVERSITY</Text>
        <Text style={styles.portalSubtitle}>Academic & Placement Portal</Text>
      </View>

      {/* Main Status Hero Card */}
      <LinearGradient
        colors={['#fffbf0', '#fff8e7', '#fff']}
        style={styles.heroCard}
      >
        <View style={styles.iconCircle}>
          <MaterialIcons name="hourglass-empty" size={38} color="#b45309" />
        </View>

        <View style={styles.statusPill}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusPillText}>APPLICATION UNDER REVIEW</Text>
        </View>

        <Text style={styles.heroTitle}>Awaiting Admin Approval</Text>
        <Text style={styles.heroDescription}>
          Hello <Text style={styles.boldText}>{scholarName}</Text>, your student registration has been received by the Registrar&apos;s Office. Campus portal features remain locked until an administrator approves your enrollment.
        </Text>
      </LinearGradient>

      {/* Submitted Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsSectionTitle}>SUBMITTED CREDENTIALS</Text>

        <View style={styles.detailRow}>
          <MaterialIcons name="person" size={18} color={Colors.textSecondary} />
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{scholarName}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="badge" size={18} color={Colors.textSecondary} />
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>Roll Number</Text>
            <Text style={[styles.detailValue, styles.monoText]}>{rollNo}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="school" size={18} color={Colors.textSecondary} />
          <View style={styles.detailTextCol}>
            <Text style={styles.detailLabel}>Department & Semester</Text>
            <Text style={styles.detailValue}>{dept} • {sem}</Text>
          </View>
        </View>

        {email && !email.includes('scholar@rimt.ac.in') ? (
          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={18} color={Colors.textSecondary} />
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>University Email</Text>
              <Text style={styles.detailValue}>{email}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.detailRow}>
            <MaterialIcons name="verified" size={18} color={Colors.textSecondary} />
            <View style={styles.detailTextCol}>
              <Text style={styles.detailLabel}>Verification Queue</Text>
              <Text style={styles.detailValue}>RIMT Academic Registrar Desk</Text>
            </View>
          </View>
        )}
      </View>

      {/* Timeline Steps */}
      <View style={styles.timelineCard}>
        <Text style={styles.detailsSectionTitle}>ONBOARDING WORKFLOW</Text>

        <View style={styles.timelineStep}>
          <View style={[styles.stepIcon, styles.stepIconSuccess]}>
            <MaterialIcons name="check" size={16} color="#fff" />
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>1. Registration Submitted</Text>
            <Text style={styles.stepDesc}>Student records initialized with pending status.</Text>
          </View>
        </View>

        <View style={styles.timelineLine} />

        <View style={styles.timelineStep}>
          <View style={[styles.stepIcon, styles.stepIconActive]}>
            <MaterialIcons name="sync" size={16} color="#fff" />
          </View>
          <View style={styles.stepInfo}>
            <Text style={[styles.stepTitle, { color: '#b45309' }]}>2. Admin Verification (Current)</Text>
            <Text style={styles.stepDesc}>The Placement Coordinator is validating your roll number against the batch roster.</Text>
          </View>
        </View>

        <View style={styles.timelineLine} />

        <View style={styles.timelineStep}>
          <View style={[styles.stepIcon, styles.stepIconPending]}>
            <MaterialIcons name="lock" size={16} color={Colors.textSecondary} />
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitleMuted}>3. Full Campus Portal Access</Text>
            <Text style={styles.stepDesc}>Unlocked immediately following administrative approval.</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCheckStatus}
          disabled={checking}
          activeOpacity={0.8}
        >
          {checking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <MaterialIcons name="refresh" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Check Approval Status</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onBackToSignIn}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={18} color={Colors.primary} />
          <Text style={styles.secondaryButtonText}>Return to Sign In</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  universityTitle: {
    fontSize: Typography?.bodyMedium?.fontSize || 14,
    fontWeight: '800',
    color: Colors.primary,
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
    borderColor: '#fef3c7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.pill,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#b45309',
    marginRight: Spacing.xs,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400e',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: Typography?.titleLarge?.fontSize || 20,
    fontWeight: '800',
    color: Colors.textPrimary,
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
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailsSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailTextCol: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: Typography?.bodySmall?.fontSize || 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  monoText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.primary,
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconSuccess: {
    backgroundColor: '#10b981',
  },
  stepIconActive: {
    backgroundColor: '#f59e0b',
  },
  stepIconPending: {
    backgroundColor: '#e2e8f0',
  },
  stepInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stepTitleMuted: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stepDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: '#e2e8f0',
    marginLeft: 13,
    marginVertical: 2,
  },
  actionSection: {
    gap: Spacing.sm,
  },
  primaryButton: {
    backgroundColor: '#b45309',
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: Typography?.bodyMedium?.fontSize || 14,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: Typography?.bodyMedium?.fontSize || 14,
    fontWeight: '700',
  },
});
