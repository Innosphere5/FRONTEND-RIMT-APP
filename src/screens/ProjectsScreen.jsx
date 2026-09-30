import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii, FontFamilies } from '../theme/tokens';
import Header from '../components/Header';
import ZoomCard from '../components/ZoomCard';
import ViewToggle from '../components/ViewToggle';

export default function ProjectsScreen({ onNavigate }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('stack'); // 'stack' | 'grid'
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('academic');
  const [newTech, setNewTech] = useState('');

  const [projects, setProjects] = useState([
    {
      id: 'PRJ-8842',
      category: 'academic',
      categoryLabel: 'Academic Core',
      status: 'Completed',
      statusType: 'completed',
      title: 'Academic Trust — Verification Protocol',
      description:
        'Decentralized document hashing and cryptographic verification engine for institutional credential exports.',
      tags: ['React Native', 'Node.js', 'SHA-256', 'Expo'],
      commitInfo: 'Last commit 3 days ago · #a7b931e',
      gitStatus: 'Git Synced',
      isPublic: false,
      icon: 'verified',
      iconBg: '#EEF2FF',
      iconColor: '#4F46E5',
    },
    {
      id: 'PRJ-7210',
      category: 'group',
      categoryLabel: 'Group Research',
      status: 'In progress',
      statusType: 'inProgress',
      title: 'Smart Campus Attendance Scanner',
      description:
        'BLE and geofenced automated beacon attendance recording for lecture halls.',
      tags: ['Python', 'FastAPI', 'Bluetooth LE', 'PostgreSQL'],
      commitInfo: 'Last commit yesterday · #c92f41d',
      gitStatus: 'Git Synced',
      isPublic: true,
      icon: 'sensors',
      iconBg: '#ECFDF5',
      iconColor: '#059669',
    },
    {
      id: 'PRJ-3109',
      category: 'personal',
      categoryLabel: 'Personal Archive',
      status: 'Archived',
      statusType: 'archived',
      title: 'Distributed Student Ledger',
      description:
        'Course grade archival system with digital registrar signatures and batch verification.',
      tags: ['Go', 'gRPC', 'Docker'],
      commitInfo: 'Snapshot locked · #e401d22',
      gitStatus: 'Read Only',
      isPublic: false,
      icon: 'account-balance',
      iconBg: '#FFF7ED',
      iconColor: '#D97706',
    },
    {
      id: 'PRJ-5401',
      category: 'academic',
      categoryLabel: 'Capstone Lab',
      status: 'Completed',
      statusType: 'completed',
      title: 'Tamper-Proof Credential QR Engine',
      description:
        'Zero-knowledge verification protocol for instant offline diploma and transcript validation.',
      tags: ['Rust', 'WebAssembly', 'ECC-256', 'Expo'],
      commitInfo: 'Last commit 5 days ago · #f129c0a',
      gitStatus: 'Git Synced',
      isPublic: true,
      icon: 'qr-code-scanner',
      iconBg: '#FFF1F2',
      iconColor: '#E11D48',
    },
  ]);

  const filteredProjects = projects.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  const handleAddProject = () => {
    if (!newTitle.trim()) {
      Alert.alert('Required', 'Please enter a project title');
      return;
    }

    const newProject = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newCategory,
      categoryLabel:
        newCategory === 'academic'
          ? 'Academic Core'
          : newCategory === 'group'
          ? 'Group Research'
          : 'Personal Lab',
      status: 'In progress',
      statusType: 'inProgress',
      title: newTitle.trim(),
      description: 'Newly registered repository synced with RIMT verified scholar ledger.',
      tags: newTech.trim()
        ? newTech.split(',').map((t) => t.trim())
        : ['React Native', 'TypeScript'],
      commitInfo: 'Initial commit today · #b482fc1',
      gitStatus: 'Git Synced',
      isPublic: false,
      icon: newCategory === 'academic' ? 'military-tech' : newCategory === 'group' ? 'hub' : 'science',
      iconBg: newCategory === 'academic' ? '#EEF2FF' : newCategory === 'group' ? '#F0F9FF' : '#F5F3FF',
      iconColor: newCategory === 'academic' ? '#4F46E5' : newCategory === 'group' ? '#0284C7' : '#7C3AED',
    };

    setProjects([newProject, ...projects]);
    setNewTitle('');
    setNewTech('');
    setModalVisible(false);
    Alert.alert('Project Created', 'Project added and synced to cryptographic record.');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Projects"
        eyebrow="RIMT ACADEMIC TRUST"
        onNotificationPress={() => Alert.alert('Notifications', 'Repository webhook synced successfully.')}
        onProfilePress={() => onNavigate?.('profile')}
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Add Project Action Bar */}
        <View style={styles.topBar}>
          <View style={styles.titleColumn}>
            <Text style={styles.eyebrowText}>Portfolio &amp; Lab Works</Text>
            <Text style={styles.screenHeading}>My Projects</Text>
          </View>

          <TouchableOpacity
            style={styles.addProjectBtnWrapper}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.primaryContainer, Colors.primary, Colors.crimsonPressed]}
              style={styles.addProjectGradient}
            >
              <MaterialIcons name="add" size={18} color="#ffffff" />
              <Text style={styles.addProjectBtnText}>Add Project</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Filter Pills & Bento Grid Layout Switcher */}
        <View style={styles.filterBarRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {[
              { id: 'all', label: 'All' },
              { id: 'academic', label: 'Academic' },
              { id: 'personal', label: 'Personal' },
              { id: 'group', label: 'Group' },
            ].map((f) => {
              const isActive = selectedFilter === f.id;
              return (
                <ZoomCard
                  key={f.id}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(f.id)}
                  scaleTo={1.08}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {f.label}
                  </Text>
                </ZoomCard>
              );
            })}
          </ScrollView>

          {/* View Mode Toggle — shared ViewToggle component (Mega Update §2.3) */}
          <ViewToggle
            mode={viewMode === 'stack' ? 'list' : 'grid'}
            onChange={(mode) => setViewMode(mode === 'list' ? 'stack' : 'grid')}
          />
        </View>

        {/* Bento Grate Projects Cards */}
        {viewMode === 'stack' ? (
          <View style={styles.listContainer}>
            {filteredProjects.map((item) => (
              <ZoomCard key={item.id} style={styles.bentoStackCard} scaleTo={1.05}>
                {/* Top Row: Pastel Squircle Icon + Category + Action Circle */}
                <View style={styles.bentoCardTopRow}>
                  <View style={styles.bentoLeftHeader}>
                    <View style={[styles.squircleIconBox, { backgroundColor: item.iconBg }]}>
                      <MaterialIcons name={item.icon} size={22} color={item.iconColor} />
                    </View>
                    <View>
                      <Text style={styles.categoryLabelText}>{item.categoryLabel}</Text>
                      <Text style={styles.projectIdText}>ID #{item.id}</Text>
                    </View>
                  </View>

                  <View style={styles.bentoRightHeader}>
                    {item.statusType === 'completed' && (
                      <View style={styles.statusPillCompleted}>
                        <Text style={styles.statusTextCompleted}>Completed</Text>
                        <MaterialIcons name="check" size={13} color={Colors.verifiedGreen} />
                      </View>
                    )}
                    {item.statusType === 'inProgress' && (
                      <View style={styles.statusPillProgress}>
                        <Text style={styles.statusTextProgress}>In progress</Text>
                        <View style={styles.pulseDotAmber} />
                      </View>
                    )}
                    {item.statusType === 'archived' && (
                      <View style={styles.statusPillArchived}>
                        <Text style={styles.statusTextArchived}>Archived</Text>
                      </View>
                    )}

                    {/* Circular Action Button from Reference Image 1 */}
                    <TouchableOpacity
                      style={styles.circularActionBtn}
                      onPress={() => Alert.alert(item.title, item.description)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="north-east" size={15} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.bentoTitleText}>{item.title}</Text>

                {/* Description */}
                <Text style={styles.bentoDescText} numberOfLines={2}>
                  {item.description}
                </Text>

                {/* Tech Stack Chips */}
                <View style={styles.techTagsRow}>
                  {item.tags.map((tag, idx) => (
                    <View key={idx} style={styles.techTag}>
                      <Text style={styles.techTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* Git Status / Ledger info (fixed invalid icon) */}
                <View style={styles.gitStatusRow}>
                  <View style={styles.gitStatusLeft}>
                    <MaterialIcons
                      name={item.gitStatus === 'Read Only' ? 'inventory-2' : 'sync'}
                      size={15}
                      color={item.statusType === 'completed' ? Colors.verifiedGreen : Colors.pendingAmber}
                    />
                    <Text style={styles.gitStatusLabel}>{item.gitStatus}</Text>
                    <View style={styles.dotSeparator} />
                    <Text style={styles.commitInfoText} numberOfLines={1}>
                      {item.commitInfo}
                    </Text>
                  </View>
                  <MaterialIcons
                    name={item.isPublic ? 'public' : 'lock'}
                    size={14}
                    color={Colors.neutralGray}
                  />
                </View>

                {/* Signature "Learn more" Pill Button from Reference Image 1 */}
                <TouchableOpacity
                  style={styles.learnMoreBtn}
                  onPress={() =>
                    Alert.alert(
                      item.title,
                      `${item.description}\n\nRepository: ${item.gitStatus}\nCommit: ${item.commitInfo}`
                    )
                  }
                  activeOpacity={0.75}
                >
                  <Text style={styles.learnMoreText}>Learn more</Text>
                  <MaterialIcons name="arrow-forward" size={13} color="#475569" />
                </TouchableOpacity>
              </ZoomCard>
            ))}
          </View>
        ) : (
          /* Bento 2-Column Grid (Image 1 Bento Grate layout) */
          <View style={styles.bentoGridContainer}>
            {filteredProjects.map((item) => (
              <ZoomCard
                key={item.id}
                containerStyle={styles.bentoGridCardWrapper}
                style={styles.bentoGridCard}
                scaleTo={1.05}
              >
                {/* Top Row: Squircle icon + Circular action button */}
                <View style={styles.bentoGridCardTop}>
                  <View style={[styles.squircleIconBoxSmall, { backgroundColor: item.iconBg }]}>
                    <MaterialIcons name={item.icon} size={18} color={item.iconColor} />
                  </View>
                  <TouchableOpacity
                    style={styles.circularActionBtnSmall}
                    onPress={() => Alert.alert(item.title, item.description)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="north-east" size={13} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Category */}
                <Text style={styles.gridCategoryText} numberOfLines={1}>
                  {item.categoryLabel}
                </Text>

                {/* Title */}
                <Text style={styles.bentoGridTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                {/* Short Description */}
                <Text style={styles.bentoGridDesc} numberOfLines={2}>
                  {item.description}
                </Text>

                {/* Primary Tag */}
                {item.tags.length > 0 && (
                  <View style={styles.gridTagPill}>
                    <Text style={styles.gridTagText} numberOfLines={1}>
                      {item.tags[0]} {item.tags.length > 1 ? `+${item.tags.length - 1}` : ''}
                    </Text>
                  </View>
                )}

                {/* Signature "Learn more" Pill Button */}
                <TouchableOpacity
                  style={styles.learnMoreBtnGrid}
                  onPress={() => Alert.alert(item.title, item.description)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.learnMoreTextGrid}>Learn more</Text>
                </TouchableOpacity>
              </ZoomCard>
            ))}
          </View>
        )}

        {/* Empty State / Add Card */}
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconCircle}>
            <MaterialIcons name="folder-open" size={32} color={Colors.primary} />
            <View style={styles.emptyPlusBadge}>
              <Text style={styles.emptyPlusText}>+</Text>
            </View>
          </View>

          <Text style={styles.emptyCardTitle}>Your projects will appear here.</Text>
          <Text style={styles.emptyCardSubtitle}>
            Connect institutional code repositories, capstones, and cryptographic lab modules
            directly to your verified academic record.
          </Text>

          <TouchableOpacity
            style={styles.emptyAddBtnWrapper}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.primaryContainer, Colors.primary, Colors.crimsonPressed]}
              style={styles.emptyAddGradient}
            >
              <MaterialIcons name="add-circle" size={18} color="#ffffff" />
              <Text style={styles.emptyAddBtnText}>Add Project</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.shaFootnote}>
            <MaterialIcons name="verified-user" size={14} color={Colors.verifiedGreen} />
            <Text style={styles.shaFootnoteText}>SHA-256 Ledger Backed</Text>
          </View>
        </View>

        {/* Bottom spacer for floating nav */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Add Project Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Academic Project</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalField}>
              <Text style={styles.fieldLabel}>Project Title</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Distributed Consensus Engine"
                placeholderTextColor={Colors.neutralGray}
                value={newTitle}
                onChangeText={setNewTitle}
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.fieldLabel}>Category</Text>
              <View style={styles.categorySelectRow}>
                {['academic', 'personal', 'group'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryOption,
                      newCategory === cat && styles.categoryOptionActive,
                    ]}
                    onPress={() => setNewCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        newCategory === cat && styles.categoryOptionTextActive,
                      ]}
                    >
                      {cat.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalField}>
              <Text style={styles.fieldLabel}>Technologies (comma separated)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. React Native, Go, Docker, WebSockets"
                placeholderTextColor={Colors.neutralGray}
                value={newTech}
                onChangeText={setNewTech}
              />
            </View>

            <TouchableOpacity
              style={styles.modalSubmitWrapper}
              onPress={handleAddProject}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[Colors.primaryContainer, Colors.primary, Colors.crimsonPressed]}
                style={styles.modalSubmitGradient}
              >
                <Text style={styles.modalSubmitText}>Save &amp; Verify Project</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  topBar: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.spaceMd,
    paddingBottom: Spacing.spaceXs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleColumn: {
    flex: 1,
  },
  eyebrowText: {
    ...Typography.eyebrow,
    color: Colors.textSecondary,
    fontSize: 10.5,
    marginBottom: 2,
  },
  screenHeading: {
    ...Typography.headlineMd,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  addProjectBtnWrapper: {
    height: 40,
    borderRadius: Radii.md,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addProjectGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  addProjectBtnText: {
    ...Typography.labelMd,
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  filterBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.margin,
    paddingVertical: Spacing.spaceSm,
    gap: 8,
  },
  filterScroll: {
    gap: 8,
  },
  filterChip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radii.full,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewToggleBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewToggleBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  listContainer: {
    paddingHorizontal: Spacing.margin,
    gap: Spacing.spaceSm,
  },
  bentoStackCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  bentoCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bentoLeftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  squircleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabelText: {
    ...Typography.eyebrow,
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 0.6,
  },
  projectIdText: {
    ...Typography.codeXs,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  bentoRightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPillCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 9,
    paddingVertical: 2.5,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(46, 125, 79, 0.12)',
  },
  statusTextCompleted: {
    ...Typography.labelSm,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.verifiedGreen,
  },
  statusPillProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 2.5,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(183, 121, 31, 0.15)',
  },
  statusTextProgress: {
    ...Typography.labelSm,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.pendingAmber,
  },
  pulseDotAmber: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.pendingAmber,
  },
  statusPillArchived: {
    paddingHorizontal: 9,
    paddingVertical: 2.5,
    borderRadius: Radii.full,
    backgroundColor: Colors.neutralChipBg,
  },
  statusTextArchived: {
    ...Typography.labelSm,
    fontSize: 11,
    fontWeight: '500',
    color: Colors.neutralGray,
  },
  circularActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoTitleText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 4,
  },
  bentoDescText: {
    fontFamily: FontFamilies.sans,
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  techTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  techTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.xs,
    backgroundColor: '#F1F5F9',
  },
  techTagText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  gitStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  gitStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  gitStatusLabel: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  dotSeparator: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: Colors.neutralGray,
  },
  commitInfoText: {
    ...Typography.codeXs,
    fontSize: 10.5,
    color: Colors.textSecondary,
    flex: 1,
  },
  learnMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: Radii.full,
    paddingVertical: 9,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  learnMoreText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  bentoGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.margin - 4,
    justifyContent: 'space-between',
  },
  bentoGridCardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  bentoGridCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bentoGridCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  squircleIconBoxSmall: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularActionBtnSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCategoryText: {
    ...Typography.eyebrow,
    fontSize: 9.5,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  bentoGridTitle: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 4,
  },
  bentoGridDesc: {
    fontFamily: FontFamilies.sans,
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 8,
  },
  gridTagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radii.xs,
    backgroundColor: '#F1F5F9',
    marginBottom: 10,
  },
  gridTagText: {
    ...Typography.codeXs,
    fontSize: 10,
    color: Colors.secondary,
    fontWeight: '600',
  },
  learnMoreBtnGrid: {
    backgroundColor: '#F1F5F9',
    borderRadius: Radii.full,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  learnMoreTextGrid: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  emptyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: Radii.xl,
    padding: Spacing.spaceXl,
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.spaceLg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  emptyPlusBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPlusText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCardTitle: {
    ...Typography.headlineSm,
    fontSize: 16.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptyCardSubtitle: {
    ...Typography.bodyMd,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 16,
    maxWidth: 290,
  },
  emptyAddBtnWrapper: {
    height: 48,
    borderRadius: Radii.md,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 220,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyAddGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyAddBtnText: {
    ...Typography.labelMd,
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  shaFootnote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  shaFootnoteText: {
    ...Typography.codeXs,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 61, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: Radii.xxl,
    borderTopRightRadius: Radii.xxl,
    padding: Spacing.spaceLg,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.spaceLg,
  },
  modalTitle: {
    ...Typography.headlineSm,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalField: {
    marginBottom: Spacing.spaceMd,
  },
  fieldLabel: {
    ...Typography.labelMd,
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  modalInput: {
    height: 46,
    borderRadius: Radii.md,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    ...Typography.bodyMd,
    color: Colors.textPrimary,
  },
  categorySelectRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryOption: {
    flex: 1,
    height: 38,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.canvas,
  },
  categoryOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryOptionText: {
    ...Typography.labelSm,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryOptionTextActive: {
    color: '#ffffff',
  },
  modalSubmitWrapper: {
    height: 50,
    borderRadius: Radii.md,
    overflow: 'hidden',
    marginTop: 8,
  },
  modalSubmitGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitText: {
    ...Typography.labelMd,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#ffffff',
  },
});
