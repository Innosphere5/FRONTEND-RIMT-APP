import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Typography, Radii } from '../theme/tokens';
import { useNotifications } from '../context/NotificationContext';
import ZoomCard from '../components/ZoomCard';

export default function NotificationScreen({ onNavigate, onBack }) {
  const {
    notifications,
    unreadCount,
    isLoading,
    isLiveConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    triggerSimulatedNotification,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'internship' | 'drive' | 'unread'
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshNotifications();
    setRefreshing(false);
  };

  // Filter & Search Logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Category filter
      if (activeFilter === 'internship' && notif.type !== 'internship') return false;
      if (activeFilter === 'drive' && notif.type !== 'drive') return false;
      if (activeFilter === 'unread' && notif.is_read) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (notif.title || '').toLowerCase().includes(q);
        const msgMatch = (notif.message || '').toLowerCase().includes(q);
        const companyMatch = (notif.data?.company_name || '').toLowerCase().includes(q);
        const roleMatch = (notif.data?.title || notif.data?.role_title || '').toLowerCase().includes(q);
        return titleMatch || msgMatch || companyMatch || roleMatch;
      }

      return true;
    });
  }, [notifications, activeFilter, searchQuery]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      internship: notifications.filter((n) => n.type === 'internship').length,
      drive: notifications.filter((n) => n.type === 'drive').length,
      unread: notifications.filter((n) => !n.is_read).length,
    };
  }, [notifications]);

  // Handle deep-link to career portal
  const handleActionRoute = (notification) => {
    markAsRead(notification.id);
    if (onNavigate) {
      onNavigate(notification.action_route || 'placement');
    }
  };

  // Format relative timestamp
  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHrs = Math.floor(diffMin / 60);
      if (diffHrs < 24) return `${diffHrs}h ago`;
      const diffDays = Math.floor(diffHrs / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return new Date(isoString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Row */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack || (() => onNavigate?.('home'))}
            accessibilityLabel="Back to Dashboard"
          >
            <MaterialIcons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <View style={styles.headerEyebrowRow}>
              <Text style={styles.eyebrowText}>RIMT T&P DIVISION</Text>
              {unreadCount > 0 && (
                <View style={styles.unreadCountBadge}>
                  <Text style={styles.unreadCountText}>{unreadCount} unread</Text>
                </View>
              )}
            </View>
            <Text style={styles.headerTitle}>Notifications & Alerts</Text>
          </View>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllReadBtn}
            onPress={markAllAsRead}
            accessibilityLabel="Mark all as read"
          >
            <MaterialIcons name="done-all" size={16} color={Colors.primary} />
            <Text style={styles.markAllReadText}>Mark Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Real-time Status & Testing Toolbar */}
      <View style={styles.statusBar}>
        <View style={styles.liveSyncPill}>
          <View style={styles.greenBeacon} />
          <Text style={styles.liveSyncText}>Live Supabase CDC Connected</Text>
        </View>

        {/* Rapid Simulation Triggers for live testing */}
        <View style={styles.simulationBar}>
          <TouchableOpacity
            style={styles.simBtn}
            onPress={() => triggerSimulatedNotification('internship')}
          >
            <MaterialIcons name="add" size={14} color="#7C3AED" />
            <Text style={styles.simBtnText}>+ Internship</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.simBtn}
            onPress={() => triggerSimulatedNotification('drive')}
          >
            <MaterialIcons name="add" size={14} color={Colors.primary} />
            <Text style={[styles.simBtnText, { color: Colors.primary }]}>+ Drive</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search internships, drives, companies..."
            placeholderTextColor={Colors.neutralGray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {Boolean(searchQuery) && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="cancel" size={18} color={Colors.neutralGray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Segmented Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
            All ({counts.all})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'internship' && styles.filterPillActive]}
          onPress={() => setActiveFilter('internship')}
        >
          <MaterialIcons
            name="work-outline"
            size={14}
            color={activeFilter === 'internship' ? '#ffffff' : '#7C3AED'}
            style={styles.filterIcon}
          />
          <Text style={[styles.filterText, activeFilter === 'internship' && styles.filterTextActive]}>
            Internships ({counts.internship})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'drive' && styles.filterPillActive]}
          onPress={() => setActiveFilter('drive')}
        >
          <MaterialIcons
            name="rocket-launch"
            size={14}
            color={activeFilter === 'drive' ? '#ffffff' : Colors.primary}
            style={styles.filterIcon}
          />
          <Text style={[styles.filterText, activeFilter === 'drive' && styles.filterTextActive]}>
            Drives ({counts.drive})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, activeFilter === 'unread' && styles.filterPillActive]}
          onPress={() => setActiveFilter('unread')}
        >
          <View style={[styles.unreadDot, activeFilter === 'unread' && { backgroundColor: '#ffffff' }]} />
          <Text style={[styles.filterText, activeFilter === 'unread' && styles.filterTextActive]}>
            Unread ({counts.unread})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Main Notifications Feed */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <MaterialIcons name="notifications-none" size={48} color={Colors.neutralGray} />
            </View>
            <Text style={styles.emptyTitle}>No Notifications Found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? `No alerts matching "${searchQuery}". Try a different keyword.`
                : 'All caught up! New internship opportunities and campus recruitment drives will appear here in real time.'}
            </Text>
            {Boolean(searchQuery || activeFilter !== 'all') && (
              <TouchableOpacity
                style={styles.resetFilterBtn}
                onPress={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                <Text style={styles.resetFilterText}>Reset Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredNotifications.map((notif) => {
            const isInternship = notif.type === 'internship';
            const isDrive = notif.type === 'drive';
            const isExpanded = expandedId === notif.id;

            const categoryTheme = isInternship
              ? {
                  badgeBg: '#F3E8FF',
                  badgeBorder: '#D8B4FE',
                  badgeText: '#7C3AED',
                  icon: 'work',
                  label: 'INTERNSHIP MONITORING',
                  gradient: ['#7C3AED', '#6D28D9'],
                }
              : {
                  badgeBg: '#FEE2E2',
                  badgeBorder: '#FECACA',
                  badgeText: Colors.primary,
                  icon: 'rocket-launch',
                  label: 'PLACEMENT DRIVE',
                  gradient: ['#A31321', '#7A0E19'],
                };

            return (
              <ZoomCard
                key={notif.id}
                style={[
                  styles.notifCard,
                  !notif.is_read && styles.notifCardUnread,
                ]}
                scaleTo={1.015}
                raiseOnScale={false}
                onPress={() => {
                  if (!notif.is_read) markAsRead(notif.id);
                  setExpandedId(isExpanded ? null : notif.id);
                }}
              >
                {/* Unread Accent Bar */}
                {!notif.is_read && <View style={styles.unreadAccentBar} />}

                <View style={styles.cardHeaderRow}>
                  {/* Category Pill with Icon */}
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: categoryTheme.badgeBg, borderColor: categoryTheme.badgeBorder },
                    ]}
                  >
                    <MaterialIcons
                      name={categoryTheme.icon}
                      size={12}
                      color={categoryTheme.badgeText}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.categoryBadgeText, { color: categoryTheme.badgeText }]}>
                      {categoryTheme.label}
                    </Text>
                  </View>

                  <View style={styles.headerRightSection}>
                    <Text style={styles.relativeTime}>{formatRelativeTime(notif.created_at)}</Text>
                    {!notif.is_read && <View style={styles.unreadPulseDot} />}
                  </View>
                </View>

                {/* Title & Organization */}
                <View style={styles.cardBody}>
                  <Text style={[styles.notifTitle, !notif.is_read && styles.notifTitleBold]}>
                    {notif.title}
                  </Text>
                  <Text style={styles.notifMessage} numberOfLines={isExpanded ? undefined : 3}>
                    {notif.message}
                  </Text>
                </View>

                {/* Key Attributes Chips */}
                {Boolean(notif.data) && (
                  <View style={styles.chipsRow}>
                    {Boolean(notif.data?.stipend_amount) && (
                      <View style={[styles.metaChip, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                        <MaterialIcons name="payments" size={12} color="#059669" />
                        <Text style={[styles.metaChipText, { color: '#059669' }]}>
                          ₹{Number(notif.data.stipend_amount).toLocaleString('en-IN')}/mo
                        </Text>
                      </View>
                    )}

                    {Boolean(notif.data?.package_min) && (
                      <View style={[styles.metaChip, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                        <MaterialIcons name="grade" size={12} color="#D97706" />
                        <Text style={[styles.metaChipText, { color: '#D97706' }]}>
                          {notif.data.package_min}
                          {notif.data.package_max ? ` - ${notif.data.package_max}` : ''} LPA
                        </Text>
                      </View>
                    )}

                    {Boolean(notif.data?.work_mode || notif.data?.mode) && (
                      <View style={styles.metaChip}>
                        <MaterialIcons name="location-city" size={12} color={Colors.textSecondary} />
                        <Text style={styles.metaChipText}>
                          {notif.data.work_mode || notif.data.mode}
                        </Text>
                      </View>
                    )}

                    {Boolean(notif.data?.application_deadline || notif.data?.registration_deadline) && (
                      <View style={styles.metaChip}>
                        <MaterialIcons name="event" size={12} color={Colors.textSecondary} />
                        <Text style={styles.metaChipText}>
                          Due {new Date(notif.data.application_deadline || notif.data.registration_deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Expanded Details Section */}
                {isExpanded && Boolean(notif.data?.required_skills) && (
                  <View style={styles.skillsSection}>
                    <Text style={styles.skillsHeading}>Required Skills / Qualifications:</Text>
                    <View style={styles.skillsList}>
                      {notif.data.required_skills.map((skill, idx) => (
                        <View key={idx} style={styles.skillTag}>
                          <Text style={styles.skillTagText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Action Buttons Row */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.primaryActionBtn}
                    onPress={() => handleActionRoute(notif)}
                  >
                    <LinearGradient
                      colors={categoryTheme.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.primaryActionGradient}
                    >
                      <Text style={styles.primaryActionText}>
                        {isInternship ? 'Explore Opportunity' : 'View Placement Drive'}
                      </Text>
                      <MaterialIcons name="arrow-forward" size={14} color="#ffffff" />
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.cardSecondaryActions}>
                    {!notif.is_read ? (
                      <TouchableOpacity
                        style={styles.iconActionBtn}
                        onPress={() => markAsRead(notif.id)}
                        accessibilityLabel="Mark read"
                      >
                        <MaterialIcons name="check" size={18} color={Colors.secondary} />
                      </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => deleteNotification(notif.id)}
                      accessibilityLabel="Delete notification"
                    >
                      <MaterialIcons name="delete-outline" size={18} color={Colors.neutralGray} />
                    </TouchableOpacity>
                  </View>
                </View>
              </ZoomCard>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.spaceMd,
    paddingBottom: Spacing.spaceSm,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.spaceSm,
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: Radii.full,
    backgroundColor: Colors.canvasAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
  },
  headerEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  eyebrowText: {
    ...Typography.eyebrow,
    fontSize: 9.5,
    letterSpacing: 1.1,
    color: Colors.textSecondary,
  },
  unreadCountBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: Radii.full,
  },
  unreadCountText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '700',
  },
  headerTitle: {
    ...Typography.headlineSm,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  markAllReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(163, 19, 33, 0.08)',
  },
  markAllReadText: {
    ...Typography.labelButton,
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.primary,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.margin,
    paddingVertical: 8,
    backgroundColor: '#FAF5FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9D5FF',
  },
  liveSyncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenBeacon: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  liveSyncText: {
    ...Typography.bodySm,
    fontSize: 10.5,
    fontWeight: '600',
    color: '#6B21A8',
  },
  simulationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.sm,
    borderWidth: 0.8,
    borderColor: '#E2E8F0',
  },
  simBtnText: {
    ...Typography.labelButton,
    fontSize: 10,
    fontWeight: '700',
    color: '#7C3AED',
    marginLeft: 2,
  },
  searchWrapper: {
    paddingHorizontal: Spacing.margin,
    paddingVertical: Spacing.spaceXs,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.canvasAlt,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.spaceSm,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: Spacing.spaceXs,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodyDefault,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  filtersScroll: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    maxHeight: 48,
  },
  filtersContent: {
    paddingHorizontal: Spacing.margin,
    paddingVertical: 8,
    gap: Spacing.spaceXs,
    flexDirection: 'row',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radii.full,
    backgroundColor: Colors.canvasAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterIcon: {
    marginRight: 4,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 6,
  },
  filterText: {
    ...Typography.labelButton,
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.margin,
    paddingBottom: 40,
    gap: Spacing.spaceSm,
  },
  notifCard: {
    backgroundColor: '#ffffff',
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.spaceMd,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#12263D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  notifCardUnread: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(163, 19, 33, 0.25)',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  unreadAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3.5,
    backgroundColor: Colors.primary,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.spaceXs,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
    borderWidth: 0.8,
  },
  categoryBadgeText: {
    ...Typography.eyebrow,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  relativeTime: {
    ...Typography.bodySm,
    fontSize: 11,
    color: Colors.neutralGray,
  },
  unreadPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.primary,
  },
  cardBody: {
    marginBottom: Spacing.spaceXs,
  },
  notifTitle: {
    ...Typography.headlineSm,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  notifTitleBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  notifMessage: {
    ...Typography.bodyDefault,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.spaceSm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.canvasAlt,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: Radii.sm,
    borderWidth: 0.6,
    borderColor: Colors.border,
  },
  metaChipText: {
    ...Typography.codeXs,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  skillsSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: Radii.md,
    padding: Spacing.spaceSm,
    marginBottom: Spacing.spaceSm,
    borderWidth: 0.8,
    borderColor: '#E2E8F0',
  },
  skillsHeading: {
    ...Typography.eyebrow,
    fontSize: 10,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillTag: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radii.xs,
    borderWidth: 0.6,
    borderColor: '#CBD5E1',
  },
  skillTagText: {
    ...Typography.codeXs,
    fontSize: 10.5,
    color: '#334155',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.spaceXs,
    borderTopWidth: 0.6,
    borderTopColor: Colors.borderLight,
  },
  primaryActionBtn: {
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  primaryActionText: {
    ...Typography.labelButton,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#ffffff',
  },
  cardSecondaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.canvasAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: Spacing.margin,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.canvasAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.spaceMd,
  },
  emptyTitle: {
    ...Typography.headlineSm,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    ...Typography.bodyDefault,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
    marginBottom: Spacing.spaceLg,
  },
  resetFilterBtn: {
    backgroundColor: Colors.canvasAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetFilterText: {
    ...Typography.labelButton,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
});
