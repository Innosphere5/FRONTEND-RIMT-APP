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
import { Colors, Spacing, Typography, Radii } from '../theme/tokens';
import Header from '../components/Header';

export default function ProjectsScreen({ onNavigate }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
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
        'Decentralized document hashing and cryptographic verification engine for institutional credential exports…',
      tags: ['React Native', 'Node.js', 'SHA-256', 'Expo', '+2 more'],
      commitInfo: 'Last commit 3 days ago · #a7b931e',
      gitStatus: 'Git Synced',
      isPublic: false,
    },
    {
      id: 'PRJ-7210',
      category: 'group',
      categoryLabel: 'Group Research',
      status: 'In progress',
      statusType: 'inProgress',
      title: 'Smart Campus Attendance Scanner',
      description:
        'BLE and geofenced automated beacon attendance recording for lecture halls…',
      tags: ['Python', 'FastAPI', 'Bluetooth LE', 'PostgreSQL'],
      commitInfo: 'Last commit yesterday · #c92f41d',
      gitStatus: 'Git Synced',
      isPublic: true,
    },
    {
      id: 'PRJ-3109',
      category: 'personal',
      categoryLabel: 'Personal Archive',
      status: 'Archived',
      statusType: 'archived',
      title: 'Distributed Student Ledger',
      description:
        'Course grade archival system with digital registrar signatures and batch verification…',
      tags: ['Go', 'gRPC', 'Docker'],
      commitInfo: 'Snapshot locked · #e401d22',
      gitStatus: 'Read Only',
      isPublic: false,
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

        {/* Filter Pills */}
        <View style={styles.filterBar}>
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
                <TouchableOpacity
                  key={f.id}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(f.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Projects List */}
        <View style={styles.listContainer}>
          {filteredProjects.map((item) => (
            <View key={item.id} style={styles.projectCard}>
              {/* Category & Status Header */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.categoryLeft}>
                  <Text style={styles.categoryLabelText}>{item.categoryLabel}</Text>
                  <View style={styles.dotSeparator} />
                  <Text style={styles.projectIdText}>ID #{item.id}</Text>
                </View>

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
              </View>

              {/* Title & Chevron */}
              <View style={styles.titleRow}>
                <Text style={styles.projectTitleText}>{item.title}</Text>
                <TouchableOpacity
                  style={styles.chevronBtn}
                  onPress={() => Alert.alert(item.title, item.description)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="chevron-right" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Description */}
              <Text style={styles.projectDescText} numberOfLines={2}>
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

              {/* Git Status Bottom Bar */}
              <View style={styles.gitStatusFooter}>
                <View style={styles.gitStatusLeft}>
                  <MaterialIcons
                    name={item.gitStatus === 'Read Only' ? 'inventory-2' : 'source-environment'}
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
                  size={15}
                  color={Colors.neutralGray}
                />
              </View>
            </View>
          ))}
        </View>

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
  filterBar: {
    paddingHorizontal: Spacing.margin,
    paddingVertical: Spacing.spaceSm,
  },
  filterScroll: {
    gap: 8,
  },
  filterChip: {
    height: 30,
    paddingHorizontal: 14,
    borderRadius: Radii.full,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.labelSm,
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: Spacing.margin,
    gap: Spacing.spaceMd,
  },
  projectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: Radii.xl,
    padding: Spacing.spaceMd,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#12263D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryLabelText: {
    ...Typography.eyebrow,
    fontSize: 10.5,
    color: Colors.textSecondary,
  },
  dotSeparator: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: Colors.neutralGray,
  },
  projectIdText: {
    ...Typography.codeXs,
    fontSize: 10.5,
    color: Colors.textSecondary,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  projectTitleText: {
    ...Typography.titleFormal,
    fontSize: 15.5,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  chevronBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectDescText: {
    ...Typography.bodyMd,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  techTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    marginBottom: 12,
  },
  techTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.xs,
    backgroundColor: Colors.surfaceContainerLow,
  },
  techTagText: {
    ...Typography.labelSm,
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '500',
  },
  gitStatusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.canvasAlt,
    marginHorizontal: -Spacing.spaceMd,
    marginBottom: -Spacing.spaceMd,
    paddingHorizontal: Spacing.spaceMd,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  gitStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  gitStatusLabel: {
    ...Typography.labelSm,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  commitInfoText: {
    ...Typography.codeXs,
    fontSize: 10.5,
    color: Colors.textSecondary,
    flex: 1,
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
