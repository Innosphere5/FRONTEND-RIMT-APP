import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii, ImageAssets } from '../theme/tokens';

export default function SignInScreen({ onSignInSuccess }) {
  const [enrollment, setEnrollment] = useState('RIMT/22/BTCSE/0417');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleSignIn = () => {
    if (!enrollment.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your enrollment number and password.');
      return;
    }

    setIsLoading(true);
    // Simulate secure TLS authentication sequence from design
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      setTimeout(() => {
        setIsVerified(false);
        onSignInSuccess?.();
      }, 900);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Campus Hero Header with Navy Gradient */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: ImageAssets.campusHero }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(18, 38, 61, 0.2)', 'rgba(18, 38, 61, 0.7)', '#12263D']}
            style={styles.heroScrim}
          />

          {/* Top Badges */}
          <View style={styles.topBadgesRow}>
            <View style={styles.officialBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.officialBadgeText}>Official Portal</Text>
            </View>
            <Text style={styles.secTlsText}>SEC-TLS 1.3</Text>
          </View>

          {/* Hero Titles */}
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroEyebrow}>Collegiate Digital Identity</Text>
            <Text style={styles.heroHeadline}>Academic Access Gateway</Text>
          </View>
        </View>

        {/* Elevated Sign-In Card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* RIMT Logo Crest */}
            <View style={styles.crestWrapper}>
              <Image
                source={{ uri: ImageAssets.universityLogo }}
                style={styles.crestImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Sign in</Text>
              <Text style={styles.cardSubtitle}>
                Use the enrollment number and password given by the university.
              </Text>
            </View>

            {/* Enrollment Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Enrollment No. or Registered Email</Text>
                <Text style={styles.requiredTag}>Required</Text>
              </View>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="school"
                  size={20}
                  color={Colors.neutralGray}
                  style={styles.inputLeadingIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={enrollment}
                  onChangeText={setEnrollment}
                  placeholder="e.g. RIMT/22/BTCSE/0417"
                  placeholderTextColor={Colors.neutralGray}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Password</Text>
                <TouchableOpacity onPress={() => Alert.alert('Password Recovery', 'Please contact Campus IT Support to reset your institutional credentials.')}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="lock"
                  size={20}
                  color={Colors.neutralGray}
                  style={styles.inputLeadingIcon}
                />
                <TextInput
                  style={[styles.textInput, { paddingRight: 44 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.neutralGray}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  accessibilityLabel="Toggle password visibility"
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color={Colors.neutralGray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In CTA Button */}
            <TouchableOpacity
              style={styles.submitButtonWrapper}
              onPress={handleSignIn}
              disabled={isLoading || isVerified}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={
                  isVerified
                    ? ['#2E7D4F', '#236B42']
                    : [Colors.primaryContainer, Colors.primary, Colors.crimsonPressed]
                }
                style={styles.submitGradient}
              >
                {isLoading ? (
                  <View style={styles.buttonLoadingRow}>
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text style={styles.submitButtonText}>Authenticating...</Text>
                  </View>
                ) : isVerified ? (
                  <View style={styles.buttonLoadingRow}>
                    <MaterialIcons name="check-circle" size={20} color="#ffffff" />
                    <Text style={styles.submitButtonText}>Identity Verified</Text>
                  </View>
                ) : (
                  <View style={styles.buttonLoadingRow}>
                    <Text style={styles.submitButtonText}>Sign In</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Encrypted Proof Footnote */}
            <View style={styles.encryptedBanner}>
              <MaterialIcons name="verified-user" size={18} color={Colors.verifiedGreen} />
              <Text style={styles.encryptedBannerText}>
                Encrypted university credential verification
              </Text>
            </View>
          </View>

          {/* IT Helpdesk Card */}
          <View style={styles.helpdeskCard}>
            <View style={styles.headsetIconBox}>
              <MaterialIcons name="headset-mic" size={20} color={Colors.secondary} />
            </View>
            <View style={styles.helpdeskTextColumn}>
              <Text style={styles.helpdeskTitle}>Need help signing in?</Text>
              <Text style={styles.helpdeskSubtitle}>Contact Campus IT Support</Text>
              <Text style={styles.helpdeskContact}>
                helpdesk@rimt.ac.in · +91 (1765) 523100 · Mon-Fri 9AM-5PM
              </Text>
            </View>
          </View>

          {/* Institutional Compliance Tag */}
          <View style={styles.footerCertRow}>
            <Text style={styles.certText}>Institutional Protocol v4.8</Text>
            <Text style={styles.certDot}>•</Text>
            <Text style={styles.certText}>ISO 27001 Certified</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  heroContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroScrim: {
    position: 'absolute',
    inset: 0,
  },
  topBadgesRow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: Spacing.margin,
    right: Spacing.margin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(220, 226, 235, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.verifiedGreen,
  },
  officialBadgeText: {
    ...Typography.eyebrow,
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  secTlsText: {
    ...Typography.codeXs,
    color: 'rgba(209, 228, 255, 0.9)',
    fontSize: 11,
    fontWeight: '600',
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 30,
    left: Spacing.margin,
    right: Spacing.margin,
  },
  heroEyebrow: {
    ...Typography.eyebrow,
    color: Colors.secondaryFixed,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  heroHeadline: {
    ...Typography.headlineMd,
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  cardContainer: {
    marginTop: -22,
    paddingHorizontal: Spacing.marginMobile,
    alignItems: 'center',
    zIndex: 10,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: Radii.xl,
    padding: Spacing.spaceLg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#12263D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  crestWrapper: {
    alignSelf: 'center',
    width: 190,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: Radii.lg,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -38,
    marginBottom: Spacing.spaceMd,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#12263D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  crestImage: {
    width: '100%',
    height: '100%',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: Spacing.spaceLg,
  },
  cardTitle: {
    ...Typography.displayHeroMobile,
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...Typography.bodyMd,
    textAlign: 'center',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: Spacing.spaceMd,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    ...Typography.labelMd,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  requiredTag: {
    ...Typography.codeXs,
    fontSize: 10.5,
    color: Colors.textSecondary,
  },
  forgotPasswordText: {
    ...Typography.labelSm,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  inputWrapper: {
    height: 48,
    borderRadius: Radii.md,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  inputLeadingIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    ...Typography.bodyMd,
    color: Colors.textPrimary,
  },
  eyeButton: {
    position: 'absolute',
    right: 4,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonWrapper: {
    height: 52,
    borderRadius: Radii.md,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  submitGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    ...Typography.labelMd,
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  encryptedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: Spacing.spaceMd,
  },
  encryptedBannerText: {
    ...Typography.labelSm,
    fontSize: 12,
    color: Colors.verifiedGreen,
    fontWeight: '600',
  },
  helpdeskCard: {
    width: '100%',
    backgroundColor: Colors.canvasAlt,
    borderRadius: Radii.lg,
    padding: Spacing.spaceMd,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.spaceSm,
    marginTop: Spacing.spaceMd,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headsetIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpdeskTextColumn: {
    flex: 1,
  },
  helpdeskTitle: {
    ...Typography.labelMd,
    fontSize: 13.5,
    color: Colors.textPrimary,
  },
  helpdeskSubtitle: {
    ...Typography.bodyMd,
    fontSize: 12.5,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  helpdeskContact: {
    ...Typography.codeXs,
    fontSize: 10.5,
    color: Colors.textSecondary,
    lineHeight: 15,
    marginTop: 4,
  },
  footerCertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.spaceLg,
  },
  certText: {
    ...Typography.eyebrow,
    fontSize: 10.5,
    color: Colors.textSecondary,
  },
  certDot: {
    color: Colors.textSecondary,
    fontSize: 10,
  },
});
