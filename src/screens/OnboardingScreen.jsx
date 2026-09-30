import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii, ImageAssets, FontFamilies } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';
import ZoomCard from '../components/ZoomCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const AVAILABLE_COURSES = [
  {
    id: 'bca',
    code: 'BCA',
    name: 'Bachelor of Computer Applications',
    fullDegree: 'Bachelor of Computer Applications (BCA)',
    department: 'Department of Computer Applications',
    duration: '3 Years · 6 Semesters',
    badge: 'Core Program',
    icon: 'laptop-mac',
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
    hash: '0x8f2a...c4b1',
    description: 'Foundations of software development, database architecture, and full-stack systems.',
  },
  {
    id: 'bca_aiml',
    code: 'BCA(AIML/AIDS)',
    name: 'BCA in AI & Machine Learning / Data Science',
    fullDegree: 'BCA with Specialization in AIML & AIDS',
    department: 'Department of Computer Applications',
    duration: '3 Years · 6 Semesters',
    badge: 'Next-Gen AI',
    icon: 'psychology',
    iconBg: '#F5F3FF',
    iconColor: '#7C3AED',
    hash: '0xd71e...880a',
    description: 'Deep neural networks, computer vision, data engineering, and generative AI models.',
  },
  {
    id: 'bca_cyber',
    code: 'BCA CYBERSECURITY',
    name: 'BCA in Cyber Security & Digital Forensics',
    fullDegree: 'BCA with Specialization in Cyber Security',
    department: 'Department of Cyber Security & Digital Forensics',
    duration: '3 Years · 6 Semesters',
    badge: 'High Security',
    icon: 'security',
    iconBg: '#FFF1F2',
    iconColor: '#E11D48',
    hash: '0x33ca...f291',
    description: 'Ethical hacking, cryptographic protocols, incident response, and zero-trust systems.',
  },
  {
    id: 'bca_horns',
    code: 'BCA HORNS',
    name: 'BCA Honours (Research & Advanced Computing)',
    fullDegree: 'Bachelor of Computer Applications (Honours)',
    department: 'Department of Computer Applications',
    duration: '4 Years · 8 Semesters',
    badge: 'Honours Degree',
    icon: 'workspace-premium',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    hash: '0x99bb...21dc',
    description: '4-Year NEP aligned degree with specialized dissertation, research, and advanced computing.',
  },
  {
    id: 'bsc_it',
    code: 'BSCIT',
    name: 'Bachelor of Science in Information Technology',
    fullDegree: 'B.Sc. in Information Technology (BSCIT)',
    department: 'Department of Information Technology',
    duration: '3 Years · 6 Semesters',
    badge: 'Applied Science',
    icon: 'memory',
    iconBg: '#ECFDF5',
    iconColor: '#059669',
    hash: '0x55aa...64ee',
    description: 'Network engineering, enterprise cloud infrastructures, DevOps, and IT systems management.',
  },
  {
    id: 'bsc_cyber',
    code: 'BSC CYBERSECURITY',
    name: 'B.Sc. in Cyber Security & Threat Intelligence',
    fullDegree: 'B.Sc. in Cyber Security (BSC CYBERSECURITY)',
    department: 'Department of Cyber Security & Computing',
    duration: '3 Years · 6 Semesters',
    badge: 'Threat Intel',
    icon: 'shield',
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    hash: '0x44ee...9972',
    description: 'Penetration testing, cryptographic key vault security, reverse engineering, and threat defense.',
  },
];

export const AVAILABLE_DEPARTMENTS = [
  'Department of Computer Applications',
  'Department of Information Technology',
  'Department of Cyber Security & Digital Forensics',
  'Department of Computer Science & Engineering',
  'School of Computing & Artificial Intelligence',
];

const ONBOARDING_SLIDES = [
  {
    id: 'vault',
    eyebrow: 'CRYPTOGRAPHIC CREDENTIAL VAULT',
    title: 'Tamper-Proof Degrees\n& Academic Records',
    description:
      'Institutionally certified degrees, grade transcripts, and merit honors signed on the immutable RIMT institutional ledger.',
    icon: 'military-tech',
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
    accentColor: Colors.primary,
    bentoTag: 'SHA-256 Validated',
    bentoTitle: 'Bachelor of Technology (CSE)',
    bentoSubtitle: 'Digitally Signed by Vice-Chancellor',
    badge: 'Verified',
    badgeColor: Colors.verifiedGreen,
    badgeBg: 'rgba(46, 125, 79, 0.1)',
  },
  {
    id: 'projects',
    eyebrow: 'BENTO LABS & PORTFOLIO',
    title: 'Git-Synced Research\n& Academic Capstones',
    description:
      'Connect code repositories, capstones, and cryptographic lab modules directly to your verified university portfolio.',
    icon: 'code',
    iconBg: '#ECFDF5',
    iconColor: '#059669',
    accentColor: Colors.secondary,
    bentoTag: 'Git Synced · #a7b931e',
    bentoTitle: 'Academic Trust — Verification Protocol',
    bentoSubtitle: 'React Native · Node.js · SHA-256 · Expo',
    badge: 'Completed',
    badgeColor: Colors.verifiedGreen,
    badgeBg: 'rgba(46, 125, 79, 0.1)',
  },
  {
    id: 'scholar',
    eyebrow: 'OFFICIAL SCHOLAR IDENTITY',
    title: 'Holographic Student\nPass & Credentials',
    description:
      'Access your official collegiate profile, dynamic attendance records, verified CGPA standings, and university documents.',
    icon: 'verified-user',
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    accentColor: Colors.primary,
    bentoTag: 'Active Scholar Record',
    bentoTitle: 'Scholar Name',
    bentoSubtitle: 'Roll No · Course · Batch',
    badge: '85% Verified',
    badgeColor: Colors.pendingAmber,
    badgeBg: 'rgba(183, 121, 31, 0.12)',
  },
];

export default function OnboardingScreen({ onGetStarted, onSignIn }) {
  const { currentStudent, updateProfile } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  // Selected Course and Department
  const initialCourse =
    AVAILABLE_COURSES.find((c) => c.code === currentStudent?.course) || AVAILABLE_COURSES[0];
  const [selectedCourse, setSelectedCourse] = useState(initialCourse);
  const [selectedDepartment, setSelectedDepartment] = useState(
    initialCourse.department
  );

  // Batch / Academic Session state
  const BATCH_PRESETS = ['2023–2026', '2024–2027', '2022–2025', '2025–2028', '2023–2024', '2024–2025'];
  const [selectedBatch, setSelectedBatch] = useState(currentStudent?.batch || '');
  const [customBatch, setCustomBatch] = useState('');
  const [showCustomBatchInput, setShowCustomBatchInput] = useState(false);
  const [showDeptPicker, setShowDeptPicker] = useState(false);

  const scholarName = currentStudent?.name || '---';
  const scholarRoll = currentStudent?.roll_no || '---';

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setSelectedDepartment(course.department);
  };

  const handleSaveAndProceed = async (navigateNext = true) => {
    try {
      if (updateProfile) {
        await updateProfile({
          course: selectedCourse.code,
          department: selectedDepartment,
          batch: selectedBatch || null,
        });
      }
    } catch (e) {
      console.warn('Profile save warning in onboarding:', e);
    }

    const isAuth = !!currentStudent;

    if (navigateNext) {
      if (activeIndex < ONBOARDING_SLIDES.length - 1) {
        scrollRef.current?.scrollTo({
          x: (activeIndex + 1) * SCREEN_WIDTH,
          animated: true,
        });
        setActiveIndex(activeIndex + 1);
      } else {
        if (isAuth) {
          onGetStarted?.();
        } else if (onSignIn) {
          onSignIn();
        } else {
          onGetStarted?.();
        }
      }
    } else {
      if (isAuth) {
        onGetStarted?.();
      } else if (onSignIn) {
        onSignIn();
      } else {
        onGetStarted?.();
      }
    }
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < ONBOARDING_SLIDES.length) {
      setActiveIndex(index);
    }
  };

  const handleNext = () => {
    handleSaveAndProceed(true);
  };

  const handleSkipToDashboard = () => {
    handleSaveAndProceed(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.crestRow}>
          <Image
            source={{ uri: ImageAssets.universityLogo }}
            style={styles.crestImage}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.crestBrand}>RIMT UNIVERSITY</Text>
            <Text style={styles.crestSub}>ACADEMIC TRUST GATEWAY</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkipToDashboard}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Slide Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.slideScroll}
      >
        {/* Slide 0: Course & Department Selection Vault (matches user's screenshot) */}
        <View style={[styles.slidePage, { width: SCREEN_WIDTH }]}>
          <ScrollView
            style={styles.slideInnerScroll}
            contentContainerStyle={styles.slideInnerContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Bento Interactive Mockup Card */}
            <View style={styles.bentoMockWrapper}>
              <View style={styles.bentoCard}>
                <View style={styles.bentoTopRow}>
                  <View style={[styles.squircleIcon, { backgroundColor: selectedCourse.iconBg }]}>
                    <MaterialIcons
                      name={selectedCourse.icon}
                      size={24}
                      color={selectedCourse.iconColor}
                    />
                  </View>
                  <View style={[styles.badgePill, { backgroundColor: 'rgba(46, 125, 79, 0.1)' }]}>
                    <Text style={[styles.badgePillText, { color: Colors.verifiedGreen }]}>
                      Verified
                    </Text>
                  </View>
                </View>

                <Text style={styles.bentoTagText}>
                  SHA-256 VALIDATED · {selectedCourse.hash}
                </Text>
                <Text style={styles.bentoCardTitle}>{selectedCourse.fullDegree}</Text>
                <Text style={styles.bentoCardSubtitle} numberOfLines={2}>
                  {selectedDepartment} · Digitally Signed by Vice-Chancellor
                </Text>

                <View style={styles.bentoBottomBar}>
                  <View style={styles.bentoLearnMorePill}>
                    <Text style={styles.bentoLearnMoreText}>Learn more</Text>
                    <MaterialIcons name="arrow-forward" size={13} color="#475569" />
                  </View>
                  <View style={styles.verifiedDotCluster}>
                    <View style={styles.microCheckDot}>
                      <MaterialIcons name="check" size={10} color="#ffffff" />
                    </View>
                    <Text style={styles.securedByLedgerText}>Secured by Ledger</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Slide Text Content */}
            <View style={styles.textContent}>
              <Text style={styles.eyebrow}>CRYPTOGRAPHIC CREDENTIAL VAULT</Text>
              <Text style={styles.title}>{'Tamper-Proof Degrees\n& Academic Records'}</Text>
              <Text style={styles.description}>
                Institutionally certified degrees, grade transcripts, and merit honors signed on
                the immutable RIMT institutional ledger.
              </Text>
            </View>

            {/* Course & Department Selection Section */}
            <View style={styles.courseSectionContainer}>
              <View style={styles.courseSectionHeader}>
                <View style={styles.sectionBadge}>
                  <MaterialIcons name="school" size={14} color={Colors.primary} />
                  <Text style={styles.sectionBadgeText}>PROGRAM ENROLLMENT</Text>
                </View>
                <Text style={styles.courseSectionTitle}>Select Your Course & Department</Text>
                <Text style={styles.courseSectionDesc}>
                  Choose your program to bind your official credentials to the university trust gateway:
                </Text>
              </View>

              {/* Department Selector Pill */}
              <View style={styles.deptCard}>
                <View style={styles.deptCardHeader}>
                  <View style={styles.deptLabelRow}>
                    <MaterialIcons name="domain" size={16} color={Colors.primary} />
                    <Text style={styles.deptCardLabel}>Enrolled Department</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deptChangeToggle}
                    onPress={() => setShowDeptPicker(!showDeptPicker)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deptChangeToggleText}>
                      {showDeptPicker ? 'Close' : 'Change Department'}
                    </Text>
                    <MaterialIcons
                      name={showDeptPicker ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                      size={16}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.activeDeptName}>{selectedDepartment}</Text>

                {/* Expandable Department Selection List */}
                {showDeptPicker && (
                  <View style={styles.deptPickerDropdown}>
                    <Text style={styles.pickerInstruction}>Tap to select your preferred department:</Text>
                    {AVAILABLE_DEPARTMENTS.map((dept) => (
                      <TouchableOpacity
                        key={dept}
                        style={[
                          styles.deptOptionPill,
                          selectedDepartment === dept && styles.deptOptionPillActive,
                        ]}
                        onPress={() => {
                          setSelectedDepartment(dept);
                          setShowDeptPicker(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons
                          name={selectedDepartment === dept ? 'radio-button-checked' : 'radio-button-unchecked'}
                          size={16}
                          color={selectedDepartment === dept ? Colors.primary : Colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.deptOptionText,
                            selectedDepartment === dept && styles.deptOptionTextActive,
                          ]}
                        >
                          {dept}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Courses List */}
              <View style={styles.courseList}>
                {AVAILABLE_COURSES.map((course) => {
                  const isSelected = selectedCourse.id === course.id;
                  return (
                    <ZoomCard
                      key={course.id}
                      onPress={() => handleSelectCourse(course)}
                      scaleTo={1.045}
                    >
                      <View style={[styles.courseCard, isSelected && styles.courseCardSelected]}>
                        <View style={styles.courseCardTop}>
                        <View style={[styles.courseIconBox, { backgroundColor: course.iconBg }]}>
                          <MaterialIcons
                            name={course.icon}
                            size={20}
                            color={course.iconColor}
                          />
                        </View>

                        <View style={styles.courseCardMain}>
                          <View style={styles.courseCodeRow}>
                            <Text
                              style={[
                                styles.courseCodeText,
                                isSelected && styles.courseCodeTextSelected,
                              ]}
                            >
                              {course.code}
                            </Text>
                            <View style={styles.courseDurationBadge}>
                              <Text style={styles.courseDurationText}>{course.badge}</Text>
                            </View>
                          </View>
                          <Text style={styles.courseNameText}>{course.name}</Text>
                        </View>

                        {/* Radio Checkbox */}
                        <View
                          style={[
                            styles.radioCircle,
                            isSelected && styles.radioCircleSelected,
                          ]}
                        >
                          {isSelected && (
                            <MaterialIcons name="check" size={14} color="#ffffff" />
                          )}
                        </View>
                        </View>

                        {/* Course details footer */}
                        <View style={styles.courseCardFooter}>
                          <Text style={styles.courseMetaText}>
                            ⏳ {course.duration}
                          </Text>
                          <Text style={styles.courseDeptMetaText} numberOfLines={1}>
                            🏛️ {course.department}
                          </Text>
                        </View>
                      </View>
                    </ZoomCard>
                  );
                })}
              </View>

              {/* Batch / Academic Session Selector */}
              <View style={styles.batchSectionContainer}>
                <View style={styles.sectionBadge}>
                  <MaterialIcons name="date-range" size={14} color={Colors.primary} />
                  <Text style={styles.sectionBadgeText}>ACADEMIC SESSION</Text>
                </View>
                <Text style={styles.courseSectionTitle}>Select Your Batch Year</Text>
                <Text style={styles.courseSectionDesc}>
                  Choose or enter your academic batch / session period:
                </Text>

                {/* Preset batch year chips */}
                <View style={styles.batchChipsContainer}>
                  {BATCH_PRESETS.map((batch) => {
                    const isActive = selectedBatch === batch;
                    return (
                      <TouchableOpacity
                        key={batch}
                        style={[
                          styles.batchChip,
                          isActive && styles.batchChipActive,
                        ]}
                        onPress={() => {
                          setSelectedBatch(batch);
                          setShowCustomBatchInput(false);
                          setCustomBatch('');
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.batchChipText,
                            isActive && styles.batchChipTextActive,
                          ]}
                        >
                          {batch}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Custom batch toggle chip */}
                  <TouchableOpacity
                    style={[
                      styles.batchChip,
                      showCustomBatchInput && styles.batchChipActive,
                    ]}
                    onPress={() => {
                      setShowCustomBatchInput(!showCustomBatchInput);
                      if (!showCustomBatchInput) {
                        setSelectedBatch('');
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name="edit"
                      size={13}
                      color={showCustomBatchInput ? '#ffffff' : Colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.batchChipText,
                        showCustomBatchInput && styles.batchChipTextActive,
                      ]}
                    >
                      Custom
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Custom batch text input */}
                {showCustomBatchInput && (
                  <View style={styles.customBatchInputWrapper}>
                    <TextInput
                      style={styles.customBatchInput}
                      placeholder="e.g. 2023–2027 or 2024–2025"
                      placeholderTextColor="#94A3B8"
                      value={customBatch}
                      onChangeText={(text) => {
                        setCustomBatch(text);
                        setSelectedBatch(text);
                      }}
                      autoCapitalize="none"
                      returnKeyType="done"
                    />
                  </View>
                )}

                {/* Display selected batch */}
                {selectedBatch ? (
                  <View style={styles.selectedBatchDisplay}>
                    <MaterialIcons name="check-circle" size={16} color={Colors.verifiedGreen} />
                    <Text style={styles.selectedBatchText}>
                      Selected: Batch {selectedBatch}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Slide 1: Git-Synced Research & Capstones */}
        <View style={[styles.slidePage, { width: SCREEN_WIDTH }]}>
          <ScrollView
            style={styles.slideInnerScroll}
            contentContainerStyle={styles.slideInnerContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.bentoMockWrapper}>
              <View style={styles.bentoCard}>
                <View style={styles.bentoTopRow}>
                  <View style={[styles.squircleIcon, { backgroundColor: '#ECFDF5' }]}>
                    <MaterialIcons name="code" size={24} color="#059669" />
                  </View>
                  <View style={[styles.badgePill, { backgroundColor: 'rgba(46, 125, 79, 0.1)' }]}>
                    <Text style={[styles.badgePillText, { color: Colors.verifiedGreen }]}>
                      Completed
                    </Text>
                  </View>
                </View>
                <Text style={styles.bentoTagText}>Git Synced · #a7b931e</Text>
                <Text style={styles.bentoCardTitle}>Academic Trust — Verification Protocol</Text>
                <Text style={styles.bentoCardSubtitle} numberOfLines={2}>
                  React Native · Node.js · SHA-256 · Expo
                </Text>
                <View style={styles.bentoBottomBar}>
                  <View style={styles.bentoLearnMorePill}>
                    <Text style={styles.bentoLearnMoreText}>View Repository</Text>
                    <MaterialIcons name="arrow-forward" size={13} color="#475569" />
                  </View>
                  <View style={styles.verifiedDotCluster}>
                    <View style={styles.microCheckDot}>
                      <MaterialIcons name="check" size={10} color="#ffffff" />
                    </View>
                    <Text style={styles.securedByLedgerText}>Secured by Ledger</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.textContent}>
              <Text style={styles.eyebrow}>BENTO LABS & PORTFOLIO</Text>
              <Text style={styles.title}>{'Git-Synced Research\n& Academic Capstones'}</Text>
              <Text style={styles.description}>
                Connect code repositories, capstones, and cryptographic lab modules directly to your verified university portfolio.
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* Slide 2: Holographic Student Pass */}
        <View style={[styles.slidePage, { width: SCREEN_WIDTH }]}>
          <ScrollView
            style={styles.slideInnerScroll}
            contentContainerStyle={styles.slideInnerContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.bentoMockWrapper}>
              <View style={styles.bentoCard}>
                <View style={styles.bentoTopRow}>
                  <View style={[styles.squircleIcon, { backgroundColor: '#FFF7ED' }]}>
                    <MaterialIcons name="verified-user" size={24} color="#EA580C" />
                  </View>
                  <View style={[styles.badgePill, { backgroundColor: 'rgba(183, 121, 31, 0.12)' }]}>
                    <Text style={[styles.badgePillText, { color: Colors.pendingAmber }]}>
                      85% Verified
                    </Text>
                  </View>
                </View>
                <Text style={styles.bentoTagText}>Active Scholar Record</Text>
                <Text style={styles.bentoCardTitle}>{scholarName}</Text>
                <Text style={styles.bentoCardSubtitle} numberOfLines={2}>
                  {scholarRoll} · {selectedCourse.code}{selectedBatch ? ` · Batch ${selectedBatch}` : ''}
                </Text>
                <View style={styles.bentoBottomBar}>
                  <View style={styles.bentoLearnMorePill}>
                    <Text style={styles.bentoLearnMoreText}>Scholar ID Pass</Text>
                    <MaterialIcons name="arrow-forward" size={13} color="#475569" />
                  </View>
                  <View style={styles.verifiedDotCluster}>
                    <View style={styles.microCheckDot}>
                      <MaterialIcons name="check" size={10} color="#ffffff" />
                    </View>
                    <Text style={styles.securedByLedgerText}>Secured by Ledger</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.textContent}>
              <Text style={styles.eyebrow}>OFFICIAL SCHOLAR IDENTITY</Text>
              <Text style={styles.title}>{'Holographic Student\nPass & Credentials'}</Text>
              <Text style={styles.description}>
                Access your official collegiate profile, dynamic attendance records, verified CGPA standings, and university documents.
              </Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Footer Controls: Dots & Glossy Actions */}
      <View style={styles.footerContainer}>
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {[0, 1, 2].map((i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                scrollRef.current?.scrollTo({ x: i * SCREEN_WIDTH, animated: true });
                setActiveIndex(i);
              }}
              style={[
                styles.dot,
                activeIndex === i ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Glossy Primary CTA Button */}
        <TouchableOpacity
          style={styles.ctaButtonWrapper}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.primaryContainer, Colors.primary, Colors.crimsonPressed]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.ctaButtonGradient}
          >
            {/* Top Gloss Specular Highlight */}
            <View style={styles.glossHighlight} />
            <Text style={styles.ctaButtonText}>
              {activeIndex === 2
                ? (currentStudent ? 'Enter Academic Dashboard' : 'Sign In to Access Dashboard')
                : (currentStudent
                    ? `Continue with ${selectedCourse.code}`
                    : `Save ${selectedCourse.code} & Sign In`)}
            </Text>
            <MaterialIcons
              name={activeIndex === 2 ? 'arrow-forward' : 'chevron-right'}
              size={18}
              color="#ffffff"
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Secondary Action */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleSkipToDashboard}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>
            {currentStudent ? (
              <>
                Skip selection → <Text style={styles.signInLinkBold}>Go to Dashboard</Text>
              </>
            ) : (
              <>
                Already have Roll No.? <Text style={styles.signInLinkBold}>Sign In to Portal</Text>
              </>
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.spaceMd,
    paddingBottom: Spacing.spaceXs,
    backgroundColor: '#F8FAFC',
  },
  crestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  crestImage: {
    width: 38,
    height: 38,
  },
  crestBrand: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  crestSub: {
    ...Typography.eyebrow,
    fontSize: 9.5,
    color: Colors.textSecondary,
    letterSpacing: 0.8,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.full,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skipText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  slideScroll: {
    flex: 1,
  },
  slidePage: {
    flex: 1,
  },
  slideInnerScroll: {
    flex: 1,
  },
  slideInnerContent: {
    paddingHorizontal: Spacing.margin,
    paddingBottom: Spacing.spaceLg,
  },
  bentoMockWrapper: {
    width: '100%',
    paddingVertical: 14,
  },
  bentoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  bentoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  squircleIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  badgePillText: {
    ...Typography.credentialBadge,
    fontSize: 11,
    fontWeight: '700',
  },
  bentoTagText: {
    ...Typography.eyebrow,
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  bentoCardTitle: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: '#0F172A',
    marginBottom: 4,
  },
  bentoCardSubtitle: {
    fontFamily: FontFamilies.sans,
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  bentoBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  bentoLearnMorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.full,
  },
  bentoLearnMoreText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  verifiedDotCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  microCheckDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.verifiedGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  securedByLedgerText: {
    fontFamily: FontFamilies.sans,
    fontSize: 10.5,
    fontWeight: '500',
    color: Colors.verifiedGreen,
  },
  textContent: {
    width: '100%',
    marginTop: 6,
    marginBottom: 16,
  },
  eyebrow: {
    ...Typography.eyebrow,
    color: Colors.primary,
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 30,
    color: '#0F172A',
    marginBottom: 8,
  },
  description: {
    fontFamily: FontFamilies.sans,
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
  },
  // Course selection section styling
  courseSectionContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  courseSectionHeader: {
    marginBottom: 14,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  sectionBadgeText: {
    ...Typography.eyebrow,
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  courseSectionTitle: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  courseSectionDesc: {
    fontFamily: FontFamilies.sans,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  // Department Card
  deptCard: {
    backgroundColor: '#ffffff',
    borderRadius: Radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  deptCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  deptLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deptCardLabel: {
    ...Typography.labelSm,
    fontSize: 11.5,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  deptChangeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  deptChangeToggleText: {
    ...Typography.labelSm,
    fontSize: 11.5,
    color: Colors.primary,
    fontWeight: '700',
  },
  activeDeptName: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  deptPickerDropdown: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  pickerInstruction: {
    fontFamily: FontFamilies.sans,
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  deptOptionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: Radii.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deptOptionPillActive: {
    backgroundColor: 'rgba(163, 19, 33, 0.08)',
    borderColor: Colors.primary,
  },
  deptOptionText: {
    fontFamily: FontFamilies.sans,
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  deptOptionTextActive: {
    fontFamily: FontFamilies.sansMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  // Courses List
  courseList: {
    gap: 10,
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  courseCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFBFB',
    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  courseCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  courseIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseCardMain: {
    flex: 1,
  },
  courseCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  courseCodeText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  courseCodeTextSelected: {
    color: Colors.primary,
  },
  courseDurationBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: '#F1F5F9',
    borderRadius: Radii.full,
  },
  courseDurationText: {
    ...Typography.codeXs,
    fontSize: 9.5,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  courseNameText: {
    fontFamily: FontFamilies.sans,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  courseCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  courseMetaText: {
    fontFamily: FontFamilies.sans,
    fontSize: 11,
    color: '#94A3B8',
  },
  courseDeptMetaText: {
    fontFamily: FontFamilies.sans,
    fontSize: 11,
    color: '#64748B',
    maxWidth: '55%',
  },
  // Footer
  footerContainer: {
    paddingHorizontal: Spacing.margin,
    paddingBottom: Spacing.spaceLg,
    paddingTop: Spacing.spaceXs,
    backgroundColor: '#F8FAFC',
    gap: 10,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  dot: {
    height: 7,
    borderRadius: 3.5,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 7,
    backgroundColor: '#CBD5E1',
  },
  ctaButtonWrapper: {
    height: 52,
    borderRadius: Radii.md,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    position: 'relative',
  },
  glossHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  ctaButtonText: {
    ...Typography.labelMd,
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  secondaryButtonText: {
    fontFamily: FontFamilies.sans,
    fontSize: 13,
    color: '#64748B',
  },
  signInLinkBold: {
    fontWeight: '700',
    color: Colors.primary,
  },

  // ── Batch / Academic Session Selector ──
  batchSectionContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  batchChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  batchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  batchChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  batchChipText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  batchChipTextActive: {
    color: '#ffffff',
  },
  customBatchInputWrapper: {
    marginTop: 10,
  },
  customBatchInput: {
    fontFamily: FontFamilies.sans,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radii.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selectedBatchDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(46, 125, 79, 0.08)',
    borderRadius: Radii.sm,
  },
  selectedBatchText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.verifiedGreen,
  },
});

