import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { getFileArrayBuffer } from '../utils/fileUtils';

const STORAGE_ACTIVE_SCHOLAR = '@rimt_active_scholar';
const STORAGE_LOCAL_STUDENTS = '@rimt_local_registered_students';

// Cross-platform storage helper
const storage = {
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn('Storage set error:', e);
    }
  },
  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage remove error:', e);
    }
  },
};

export const STORAGE_LAST_ROLL_NO = '@rimt_last_used_roll_no';
export const STORAGE_RECENT_SCHOLARS = '@rimt_recent_scholars';

/**
 * Normalizes roll number for consistent storage and query matching.
 * Strips whitespace, converts to uppercase.
 */
export const normalizeRollNo = (rollNo) => {
  if (!rollNo) return '';
  return String(rollNo).trim().toUpperCase().replace(/\s+/g, '');
};

export const getLastUsedRollNo = async () => {
  try {
    return (await storage.getItem(STORAGE_LAST_ROLL_NO)) || '';
  } catch {
    return '';
  }
};

export const getRecentScholars = async () => {
  try {
    const raw = await storage.getItem(STORAGE_RECENT_SCHOLARS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Checks Supabase database health and table availability.
 */
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase
      .from('students')
      .select('count', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('not find the table')) {
        return {
          connected: true,
          tableExists: false,
          message: "Database connected, but 'students' table is not yet created. Run schema.sql in Supabase SQL editor.",
        };
      }
      return {
        connected: false,
        tableExists: false,
        message: error.message || 'Supabase error',
      };
    }
    return {
      connected: true,
      tableExists: true,
      message: 'Supabase connected and students table ready',
    };
  } catch (err) {
    return {
      connected: false,
      tableExists: false,
      message: err.message || 'Network error',
    };
  }
};

/**
 * Sign Up Student with Gated Onboarding System
 * Saves student with status: 'PENDING'. Does NOT create an active session.
 */
export const signUpStudent = async ({
  name,
  fullName,
  rollNo,
  rollNumber,
  department,
  course,
  batch,
  yearSemester,
  avatarAsset,
  avatar_url,
}) => {
  const cleanName = (name || fullName || '').trim();
  const normalizedRoll = normalizeRollNo(rollNo || rollNumber);
  const cleanDept = (department || course || '').trim();
  const cleanBatch = (yearSemester || batch || '').trim();

  if (!cleanName || cleanName.length < 2) {
    return {
      success: false,
      error: 'Please provide a valid scholar name (at least 2 characters).',
    };
  }

  if (!normalizedRoll || normalizedRoll.length < 3) {
    return {
      success: false,
      error: 'Please provide a valid university Roll Number.',
    };
  }

  if (!cleanDept || !cleanBatch) {
    return {
      success: false,
      error: 'Please select your department and year/semester.',
    };
  }

  try {
    // 1. Check if student already exists in Supabase
    const { data: existingSupabase, error: lookupError } = await supabase
      .from('students')
      .select('*')
      .ilike('roll_no', normalizedRoll)
      .maybeSingle();
    if (lookupError) throw lookupError;

    if (existingSupabase) {
      const currentStatus = existingSupabase.status === 'VERIFIED' ? 'APPROVED' : (existingSupabase.status || 'PENDING');
      if (currentStatus === 'PENDING') {
        return {
          success: true,
          status: 'PENDING',
          student: existingSupabase,
          message: `Scholar "${normalizedRoll}" is already registered and is awaiting Admin approval.`,
        };
      }
      return {
        success: false,
        status: currentStatus,
        error: `Scholar with Roll Number "${normalizedRoll}" is already registered. Please sign in directly.`,
      };
    }

    // Determine avatar URL from avatarAsset (base64 or direct uri)
    let photoUrl = avatar_url || null;
    if (avatarAsset) {
      if (avatarAsset.base64) {
        photoUrl = `data:${avatarAsset.mimeType || 'image/jpeg'};base64,${avatarAsset.base64}`;
      } else if (avatarAsset.uri && (avatarAsset.uri.startsWith('data:') || avatarAsset.uri.startsWith('http'))) {
        photoUrl = avatarAsset.uri;
      }
    }

    // 2. Insert into Supabase with status: PENDING
    // Only pass columns that exist in the Supabase students table:
    const studentRecord = {
      name: cleanName,
      roll_no: normalizedRoll,
      department: cleanDept,
      course: cleanDept,
      batch: cleanBatch,
      semester: cleanBatch,
      status: 'PENDING',
    };
    if (photoUrl) {
      studentRecord.avatar_url = photoUrl;
    }

    let inserted = null;
    let { data, error: insertError } = await supabase
      .from('students')
      .insert([studentRecord])
      .select()
      .maybeSingle();

    if (insertError && studentRecord.avatar_url) {
      if (insertError.message?.includes('avatar_url') || insertError.code === 'PGRST204') {
        delete studentRecord.avatar_url;
        const retry = await supabase
          .from('students')
          .insert([studentRecord])
          .select()
          .maybeSingle();
        data = retry.data;
        insertError = retry.error;
      }
    }

    if (insertError) {
      console.warn('Supabase insert warning:', insertError.message);
      return {
        success: false,
        error: 'Registration could not be submitted to the university database. Check your connection and try again.',
      };
    }

    if (!data) {
      return {
        success: false,
        error: 'The university database did not confirm this registration. Please try again.',
      };
    }

    inserted = data;

    // Cache only a registration confirmed by Supabase.
    const localStudentsJson = await storage.getItem(STORAGE_LOCAL_STUDENTS);
    const localList = localStudentsJson ? JSON.parse(localStudentsJson) : [];

    const savedStudent = inserted;

    const existingIndex = localList.findIndex(
      (s) => normalizeRollNo(s.roll_no || s.roll_number) === normalizedRoll
    );
    if (existingIndex >= 0) {
      localList[existingIndex] = savedStudent;
    } else {
      localList.push(savedStudent);
    }
    await storage.setItem(STORAGE_LOCAL_STUDENTS, JSON.stringify(localList));
    await storage.setItem(STORAGE_LAST_ROLL_NO, normalizedRoll);

    try {
      const recentsRaw = await storage.getItem(STORAGE_RECENT_SCHOLARS);
      const recents = recentsRaw ? JSON.parse(recentsRaw) : [];
      const filtered = recents.filter((r) => normalizeRollNo(r.roll_no) !== normalizedRoll);
      filtered.unshift({
        name: cleanName,
        roll_no: normalizedRoll,
        department: cleanDept,
      });
      await storage.setItem(STORAGE_RECENT_SCHOLARS, JSON.stringify(filtered.slice(0, 5)));
    } catch (_e) {}

    return {
      success: true,
      status: 'PENDING',
      student: savedStudent,
      message: 'Registration submitted successfully. Awaiting Administrator verification.',
    };
  } catch (err) {
    console.error('Sign up error:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during registration.',
    };
  }
};

/**
 * Update Student Course, Department & Batch
 */
export const updateStudentProfile = async ({
  rollNo,
  name,
  phone,
  course,
  department,
  batch,
  bio,
  headline,
  skills,
  linkedin_url,
  github_url,
  portfolio_url,
  resume_url,
  avatarAsset,
  bannerAsset,
}) => {
  const normalizedRoll = normalizeRollNo(rollNo);
  if (!normalizedRoll) return { success: false, error: 'No roll number provided' };

  try {
    const warnings = [];
    const updatePayload = {
      updated_at: new Date().toISOString(),
    };
    if (name !== undefined) updatePayload.name = name.trim();
    if (phone !== undefined) updatePayload.phone = phone.trim() || null;
    if (department !== undefined) updatePayload.department = department || null;
    if (course !== undefined) updatePayload.course = course || null;
    if (batch !== undefined) updatePayload.batch = batch || null;
    if (bio !== undefined) updatePayload.bio = bio.trim() || null;

    const uploadImage = async (asset, type) => {
      if (!asset) return null;
      const fileName = asset.fileName || asset.uri.split('/').pop() || `${type}.jpg`;
      const extension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
      const safeRoll = normalizedRoll.replace(/[^A-Z0-9_-]/g, '_');
      const path = `${safeRoll}/${type}-${Date.now()}.${extension}`;
      const body = await getFileArrayBuffer(asset.uri, asset);
      const contentType = asset.mimeType || 'image/jpeg';
      const { error } = await supabase.storage
        .from('student-media')
        .upload(path, body, { contentType, upsert: false });

      if (error) throw error;
      return supabase.storage.from('student-media').getPublicUrl(path).data.publicUrl;
    };

    const [avatarUpload, bannerUpload] = await Promise.all(
      [[avatarAsset, 'avatar'], [bannerAsset, 'banner']].map(async ([asset, type]) => {
        if (!asset) return { url: null, error: null };
        try {
          return { url: await uploadImage(asset, type), error: null };
        } catch (error) {
          return { url: null, error };
        }
      })
    );
    const avatarUrl = avatarUpload.url;
    const bannerUrl = bannerUpload.url;
    if (avatarUrl) updatePayload.avatar_url = avatarUrl;
    if (bannerUrl) updatePayload.banner_url = bannerUrl;
    if (avatarUpload.error) {
      warnings.push(`Profile photo upload failed: ${avatarUpload.error.message || 'Storage rejected the upload.'}`);
    }
    if (bannerUpload.error) {
      warnings.push(`Profile banner upload failed: ${bannerUpload.error.message || 'Storage rejected the upload.'}`);
    }

    const requestedPayload = { ...updatePayload };
    let cloudResult = await supabase
      .from('students')
      .update(updatePayload)
      .ilike('roll_no', normalizedRoll)
      .select('*')
      .maybeSingle();
    let cloudStudent = cloudResult.data;
    let cloudError = cloudResult.error;

    const missingFields = new Set();
    while (cloudError?.code === '42703' || cloudError?.code === 'PGRST204') {
      const errorMessage = cloudError.message?.toLowerCase() || '';
      const match = errorMessage.match(/could not find the '([^']+)' column/i);
      const badCol = match ? match[1].toLowerCase() : null;

      const unsupportedFields = [
        'bio',
        'headline',
        'skills',
        'course',
        'department',
        'batch',
        'phone',
        'avatar_url',
        'banner_url',
        'linkedin_url',
        'github_url',
        'portfolio_url',
        'resume_url',
      ].filter(
        (field) =>
          (field === badCol || errorMessage.includes(field)) &&
          Object.prototype.hasOwnProperty.call(updatePayload, field)
      );

      if (!unsupportedFields.length) {
        if (badCol && Object.prototype.hasOwnProperty.call(updatePayload, badCol)) {
          unsupportedFields.push(badCol);
        } else {
          break;
        }
      }

      unsupportedFields.forEach((field) => {
        delete updatePayload[field];
        missingFields.add(field);
      });

      cloudResult = await supabase
        .from('students')
        .update(updatePayload)
        .ilike('roll_no', normalizedRoll)
        .select('*')
        .maybeSingle();
      cloudStudent = cloudResult.data;
      cloudError = cloudResult.error;
    }

    // If cloudStudent wasn't retrieved by the update, fetch it by roll_no
    if (!cloudStudent?.id) {
      const { data: existing } = await supabase
        .from('students')
        .select('*')
        .ilike('roll_no', normalizedRoll)
        .maybeSingle();
      if (existing) cloudStudent = existing;
    }

    const dossierSyncedFields = new Set([
      'bio',
      'headline',
      'skills',
      'linkedin_url',
      'github_url',
      'portfolio_url',
      'resume_url',
    ]);
    const criticalMissing = Array.from(missingFields).filter((f) => !dossierSyncedFields.has(f));
    if (criticalMissing.length > 0) {
      warnings.push(
        `Supabase students table is missing ${criticalMissing.join(', ')}.`
      );
    }

    const tableMissing = cloudError?.code === 'PGRST205'
      || cloudError?.message?.includes('not find the table');
    if (tableMissing) {
      warnings.push('The students table is not available in Supabase; changes were kept on this device.');
    }

    // Upsert into student_profiles table (Bio, Headline, Skills, Social Links, Resume)
    let profileData = null;
    if (cloudStudent?.id) {
      const studentId = cloudStudent.id;
      const profileRecord = {
        student_id: studentId,
        updated_at: new Date().toISOString(),
      };
      if (bio !== undefined) profileRecord.bio = bio ? bio.trim() : null;
      if (headline !== undefined) profileRecord.headline = headline ? headline.trim() : null;
      if (skills !== undefined) profileRecord.skills = Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map((s) => s.trim()).filter(Boolean) : []);
      if (linkedin_url !== undefined) profileRecord.linkedin_url = linkedin_url ? linkedin_url.trim() : null;
      if (github_url !== undefined) profileRecord.github_url = github_url ? github_url.trim() : null;
      if (portfolio_url !== undefined) profileRecord.portfolio_url = portfolio_url ? portfolio_url.trim() : null;
      if (resume_url !== undefined) profileRecord.resume_url = resume_url ? resume_url.trim() : null;

      try {
        const { data: profRes } = await supabase
          .from('student_profiles')
          .upsert(profileRecord, { onConflict: 'student_id' })
          .select()
          .maybeSingle();
        profileData = profRes || profileRecord;
      } catch (profErr) {
        console.warn('Upsert student_profiles error:', profErr.message);
      }

      // Record audit log for Admin Realtime visibility
      try {
        await supabase
          .from('admin_audit_log')
          .insert([{
            target_student_id: studentId,
            table_name: 'student_profiles',
            record_id: studentId,
            action: 'student_profile_update',
            old_data: null,
            new_data: profileRecord,
            created_at: new Date().toISOString(),
          }]);
      } catch {
        // silent fallback
      }
    }

    // Keep a local copy so older cloud rows can recover fields saved by the app.
    const active = await getActiveScholar();
    const updatedScholar = {
      ...(active || {}),
      ...(cloudStudent || {}),
      profile: profileData || active?.profile || null,
      headline: headline !== undefined ? headline : (active?.headline || null),
      skills: skills !== undefined ? skills : (active?.skills || []),
      linkedin_url: linkedin_url !== undefined ? linkedin_url : (active?.linkedin_url || null),
      github_url: github_url !== undefined ? github_url : (active?.github_url || null),
      portfolio_url: portfolio_url !== undefined ? portfolio_url : (active?.portfolio_url || null),
      resume_url: resume_url !== undefined ? resume_url : (active?.resume_url || null),
      roll_no: normalizedRoll,
      ...requestedPayload,
    };
    await storage.setItem(STORAGE_ACTIVE_SCHOLAR, JSON.stringify(updatedScholar));

    const localStudentsJson = await storage.getItem(STORAGE_LOCAL_STUDENTS);
    const localList = localStudentsJson ? JSON.parse(localStudentsJson) : [];
    const localIndex = localList.findIndex(
      (student) => normalizeRollNo(student.roll_no) === normalizedRoll
    );
    const updatedList = [...localList];
    if (localIndex === -1) updatedList.push(updatedScholar);
    else updatedList[localIndex] = { ...updatedList[localIndex], ...updatedScholar };
    await storage.setItem(STORAGE_LOCAL_STUDENTS, JSON.stringify(updatedList));

    return {
      success: !cloudError || tableMissing,
      student: updatedScholar,
      error: cloudError && !tableMissing ? cloudError.message : undefined,
      warning: warnings.join(' '),
    };
  } catch (err) {
    console.error('Error updating student profile:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch comprehensive student data including dossier profile and academic records
 */
export const getFullStudentData = async (student) => {
  if (!student) return null;
  const studentId = student.id;
  if (!studentId) return student;

  try {
    const [profileRes, acadRes, projectsRes, gitRes, certsRes, internshipsRes] = await Promise.all([
      supabase.from('student_profiles').select('*').eq('student_id', studentId).maybeSingle(),
      supabase.from('student_academic_summary').select('*').eq('student_id', studentId).maybeSingle(),
      supabase.from('student_projects').select('*').eq('student_id', studentId).eq('is_visible', true).order('sort_order', { ascending: true }),
      supabase.from('student_git_projects').select('*').eq('student_id', studentId).eq('is_visible', true).order('sort_order', { ascending: true }),
      supabase.from('student_certificates').select('*').eq('student_id', studentId).eq('is_visible', true).order('sort_order', { ascending: true }),
      supabase.from('student_internships').select('*').eq('student_id', studentId).order('created_at', { ascending: false }),
    ]);

    const profile = profileRes.data || {};
    const acad = acadRes.data || {};
    const projects = projectsRes.data || [];
    const git_projects = gitRes.data || [];
    const certificates = certsRes.data || [];
    const internships = internshipsRes.data || [];

    return {
      ...student,
      profile,
      headline: profile.headline || student.headline || null,
      bio: profile.bio || student.bio || null,
      skills: profile.skills || student.skills || [],
      linkedin_url: profile.linkedin_url || student.linkedin_url || null,
      github_url: profile.github_url || student.github_url || null,
      portfolio_url: profile.portfolio_url || student.portfolio_url || null,
      resume_url: profile.resume_url || student.resume_url || null,
      projects,
      git_projects,
      certificates,
      internships,
      academic_summary: acad,
      cgpa: acad.cgpa != null ? acad.cgpa : student.cgpa,
      overall_attendance: acad.overall_attendance != null ? acad.overall_attendance : student.overall_attendance,
      backlogs: acad.backlogs != null ? acad.backlogs : student.backlogs,
    };
  } catch {
    return student;
  }
};

export const signInStudent = async ({ rollNo }) => {
  const normalizedRoll = normalizeRollNo(rollNo);

  if (!normalizedRoll) {
    return {
      success: false,
      error: 'Please enter your registered university Roll Number.',
    };
  }

  try {
    // 1. Query Supabase database by roll_no
    let student = null;
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .ilike('roll_no', normalizedRoll)
      .maybeSingle();
    if (error) throw error;
    student = data;

    if (!student) {
      return {
        success: false,
        error: 'No student record found. Please verify your roll number or register a new account.',
      };
    }

    // CRITICAL GATED CHECK: VERIFIED or APPROVED allows entry
    const rawStatus = (student.status || 'UNKNOWN').toUpperCase();
    const isApproved = rawStatus === 'APPROVED' || rawStatus === 'VERIFIED';

    if (rawStatus === 'PENDING') {
      return {
        success: false,
        status: 'PENDING',
        student,
        error: 'Your account is currently awaiting Admin approval.',
      };
    }

    if (rawStatus === 'REJECTED') {
      return {
        success: false,
        status: 'REJECTED',
        student,
        reason: student.rejection_reason || 'Registration details did not meet university criteria.',
        error: 'Your student registration was rejected by university administration.',
      };
    }

    if (rawStatus === 'REVOKED') {
      return {
        success: false,
        status: 'REVOKED',
        student,
        reason: student.revocation_reason || 'Portal access was revoked by university administration.',
        error: 'Portal access has been revoked by university administration.',
      };
    }

    if (isApproved) {
      const fullStudent = await getFullStudentData(student);
      const activeStudent = { ...student, ...fullStudent, status: 'APPROVED' };
      await storage.setItem(STORAGE_ACTIVE_SCHOLAR, JSON.stringify(activeStudent));

      return {
        success: true,
        status: 'APPROVED',
        student: activeStudent,
        source: 'verified',
      };
    }

    return {
      success: false,
      status: rawStatus,
      error: 'Account status not recognized. Please contact administration.',
    };
  } catch (err) {
    console.error('Sign in error:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during sign in.',
    };
  }
};

/**
 * Check if a pending student has been approved by the Admin
 */
export const checkStudentApprovalStatus = async ({ rollNo }) => {
  const normalizedRoll = normalizeRollNo(rollNo);

  try {
    // 1. Query Supabase
    let student = null;
    if (normalizedRoll) {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .ilike('roll_no', normalizedRoll)
        .maybeSingle();
      if (error) throw error;
      student = data;
    }

    if (!student) {
      return { status: 'NOT_FOUND', error: 'Student record not found.' };
    }

    const rawStatus = (student.status || 'UNKNOWN').toUpperCase();
    const currentStatus = (rawStatus === 'APPROVED' || rawStatus === 'VERIFIED') ? 'APPROVED' : rawStatus;

    if (currentStatus === 'APPROVED') {
      // User was approved! Save session so they can enter immediately
      const fullStudent = await getFullStudentData(student);
      const activeStudent = { ...student, ...fullStudent, status: 'APPROVED' };
      await storage.setItem(STORAGE_ACTIVE_SCHOLAR, JSON.stringify(activeStudent));
      return {
        status: 'APPROVED',
        student: activeStudent,
      };
    }

    if (currentStatus === 'REVOKED') {
      return {
        status: currentStatus,
        student,
        reason: student.revocation_reason || 'Portal access was revoked by university administration.',
      };
    }

    return {
      status: currentStatus,
      student,
      reason: student.rejection_reason,
    };
  } catch (err) {
    console.error('Error checking status:', err);
    return { status: 'ERROR', error: err.message };
  }
};

/**
 * Get the currently logged-in scholar from storage
 */
export const getActiveScholar = async () => {
  try {
    const raw = await storage.getItem(STORAGE_ACTIVE_SCHOLAR);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Sign out the currently active scholar
 */
export const signOutStudent = async () => {
  try {
    await storage.removeItem(STORAGE_ACTIVE_SCHOLAR);
    await supabase.auth.signOut().catch(() => {});
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Check if any student has previously registered on this device.
 * Returns true if the local registered students list is non-empty,
 * or if an active scholar session was previously saved.
 */
export const hasRegisteredStudents = async () => {
  try {
    // Check if there's any active scholar session saved
    const activeRaw = await storage.getItem(STORAGE_ACTIVE_SCHOLAR);
    if (activeRaw) return true;

    // Check if any local registered students exist
    const localRaw = await storage.getItem(STORAGE_LOCAL_STUDENTS);
    if (localRaw) {
      const list = JSON.parse(localRaw);
      if (Array.isArray(list) && list.length > 0) return true;
    }

    return false;
  } catch {
    return false;
  }
};
