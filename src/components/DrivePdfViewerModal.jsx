import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Colors } from '../theme/tokens';
import { downloadResumeToDevice, shareResumeFile } from '../services/resumeService';

// RIMT Drive Theme Palette (Enhanced Google Drive / Docs Dark Palette)
const DriveColors = {
  headerBg: '#1E1F22',
  headerBorder: '#2E3135',
  canvasBg: '#323639', // Exact Google Drive / Chrome PDF canvas background
  textLight: '#E8EAED',
  textMuted: '#9AA0A6',
  accentBlue: '#8AB4F8',
  searchBarBg: '#282A2D',
  highlightActive: '#FFA000', // Active match highlight
  highlightMatch: '#FFF59D',  // Other matches highlight
  badgeBg: 'rgba(255,255,255,0.12)',
  redAction: '#8E0E1B',       // Dark Institutional Crimson Red
  redActionDark: '#6B0A14',
  cardBg: '#202124',
  greenSuccess: '#81C995',
};

export default function DrivePdfViewerModal({
  visible,
  pdfUri,
  pdfBase64,
  pdfHtml,
  fileName = 'CVForge_Resume.pdf',
  onClose,
  onPrint,
  onDownload,
  studentName = 'Scholar',
}) {
  const insets = useSafeAreaInsets();
  const [externalPdf, setExternalPdf] = useState(null);
  
  // Onboarding Helper Banner State
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(true);

  // Search state
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchCount, setMatchCount] = useState({ current: 0, total: 0 });
  
  // Zoom & Page state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 1 });
  const [isPickingPdf, setIsPickingPdf] = useState(false);

  const webViewRef = useRef(null);
  const iframeRef = useRef(null);

  // Status bar inset calculation for Android & iOS to bring header below battery/notch
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 0);
  const bottomInset = insets.bottom || 0;

  // Active document data (external picked PDF or parent resume data)
  const currentUri = externalPdf ? externalPdf.uri : pdfUri;
  const currentBase64 = externalPdf ? externalPdf.base64 : pdfBase64;
  const currentHtml = externalPdf ? null : pdfHtml;
  const currentFileName = externalPdf ? externalPdf.fileName : (fileName || 'CVForge_Resume.pdf');
  const fileSizeText = currentBase64
    ? `${Math.round((currentBase64.length * 3) / 4096)} KB · Verified ATS`
    : (externalPdf ? 'Device Document' : 'A4 Vector PDF');

  const handleClose = () => {
    setExternalPdf(null);
    setIsSearchVisible(false);
    setSearchQuery('');
    setMatchCount({ current: 0, total: 0 });
    if (onClose) onClose();
  };

  // Pick ANY PDF from Device Storage (Student can open any PDF from phone)
  const handlePickExternalPdf = async () => {
    try {
      setIsPickingPdf(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const pickedName = asset.name || 'Document.pdf';
        const pickedUri = asset.uri;

        // Read base64
        let b64 = null;
        try {
          if (Platform.OS === 'web' && asset.file) {
            b64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const res = reader.result;
                if (typeof res === 'string') {
                  resolve(res.includes(',') ? res.split(',')[1] : res);
                } else {
                  resolve(null);
                }
              };
              reader.onerror = () => resolve(null);
              reader.readAsDataURL(asset.file);
            });
          } else {
            b64 = await FileSystem.readAsStringAsync(pickedUri, {
              encoding: FileSystem.EncodingType.Base64,
            });
          }
        } catch (readErr) {
          console.warn('Could not read external PDF base64:', readErr);
        }

        setExternalPdf({
          uri: pickedUri,
          base64: b64,
          fileName: pickedName,
        });
        setSearchQuery('');
        setMatchCount({ current: 0, total: 0 });
        setIsSearchVisible(false);
      }
    } catch (err) {
      Alert.alert('File Picker Error', err.message || 'Could not load PDF document.');
    } finally {
      setIsPickingPdf(false);
    }
  };

  // Download Handler from inside Drive Viewer (Red Download Action)
  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
      return;
    }
    if (currentUri || currentBase64) {
      const res = await downloadResumeToDevice(currentUri, studentName, currentBase64);
      if (res.success) {
        Alert.alert('📥 Download Complete', `Saved "${res.fileName}" directly to your device storage.`);
      }
    }
  };

  // Share Handler from inside Drive Viewer
  const handleShare = async () => {
    if (currentUri) {
      await shareResumeFile(currentUri, currentFileName);
    } else {
      Alert.alert('Share', 'Document is compiling, please wait a moment.');
    }
  };

  // Webview communication
  const sendWebViewCommand = (command) => {
    const jsonStr = JSON.stringify(command);
    if (Platform.OS === 'web') {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(jsonStr, '*');
      }
    } else if (webViewRef.current) {
      webViewRef.current.postMessage(jsonStr);
    }
  };

  // Search Controls
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    sendWebViewCommand({ type: 'SEARCH', query: text });
  };

  const handleSearchNext = () => {
    sendWebViewCommand({ type: 'SEARCH_NEXT' });
  };

  const handleSearchPrev = () => {
    sendWebViewCommand({ type: 'SEARCH_PREV' });
  };

  const handleCloseSearch = () => {
    setIsSearchVisible(false);
    setSearchQuery('');
    setMatchCount({ current: 0, total: 0 });
    sendWebViewCommand({ type: 'SEARCH_CLEAR' });
  };

  // Zoom Controls
  const handleZoom = (delta) => {
    const nextZoom = Math.min(250, Math.max(40, zoomLevel + delta));
    setZoomLevel(nextZoom);
    sendWebViewCommand({ type: 'SET_ZOOM', zoom: nextZoom / 100 });
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
    sendWebViewCommand({ type: 'SET_ZOOM', zoom: 1.0 });
  };

  const handleFitWidth = () => {
    sendWebViewCommand({ type: 'FIT_WIDTH' });
  };

  // Receive messages from embedded viewer engine
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MATCH_COUNT') {
        setMatchCount({ current: data.current, total: data.total });
      } else if (data.type === 'PAGE_INFO') {
        setPageInfo({ current: data.current, total: data.total });
      } else if (data.type === 'ZOOM_INFO') {
        setZoomLevel(data.zoom);
      }
    } catch (_e) {
      // ignore
    }
  };

  // Build the self-contained RIMT Drive PDF Viewer HTML Engine
  const generateDriveViewerHtml = () => {
    const base64Data = currentBase64 || '';
    const hasRawHtml = Boolean(currentHtml);
    const sanitizedHtml = hasRawHtml ? currentHtml : '';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
  <title>RIMT PDF Viewer</title>
  <!-- Mozilla PDF.js CDN for standalone external PDFs -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background-color: #323639; /* Exact Google Drive / Chrome PDF canvas background */
      color: #E8EAED;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      min-height: 100%;
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-font-smoothing: antialiased;
    }

    #drive-stage {
      width: 100%;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 6px 120px;
      overflow-x: hidden;
      overflow-y: auto;
    }

    #drive-container {
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform-origin: top center;
      transition: transform 0.15s ease-out;
    }

    /* Individual PDF Page Frame (Google Drive Card) */
    .drive-page-card {
      background: #ffffff;
      color: #111827;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      overflow: hidden;
      position: relative;
      margin: 0 auto 20px;
      width: 100%;
      max-width: 820px;
      min-height: 480px;
      flex-shrink: 0;
    }

    /* Search Highlights */
    mark.drive-find-highlight {
      background-color: #FFF59D !important;
      color: #000000 !important;
      padding: 1px 3px !important;
      border-radius: 2px !important;
      box-shadow: 0 0 2px rgba(0,0,0,0.2) !important;
    }

    mark.drive-find-highlight.active-match {
      background-color: #FF9800 !important;
      color: #000000 !important;
      font-weight: 800 !important;
      outline: 2.5px solid #E65100 !important;
      border-radius: 2px !important;
      box-shadow: 0 0 8px rgba(255, 152, 0, 0.75) !important;
    }

    #loading-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #323639;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: #9AA0A6;
      font-size: 13px;
      gap: 12px;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3.5px solid rgba(255,255,255,0.15);
      border-top-color: #8AB4F8;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .canvas-page {
      display: block;
      margin: 0 auto;
      width: 100%;
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div id="loading-overlay">
    <div class="spinner"></div>
    <div>Loading document in RIMT PDF Viewer...</div>
  </div>

  <div id="drive-stage">
    <div id="drive-container">
      ${hasRawHtml ? `
        <!-- High-Fidelity Vector HTML Page Frame -->
        <div id="html-page-frame" class="drive-page-card">
          ${sanitizedHtml}
        </div>
      ` : `
        <!-- PDF.js Dynamic Canvas Container for External PDFs -->
        <div id="pdf-pages-target"></div>
      `}
    </div>
  </div>

  <script>
    var currentMatches = [];
    var activeMatchIndex = -1;
    var currentZoom = 1.0;
    var pdfDoc = null;

    function postToReactNative(obj) {
      var msg = JSON.stringify(obj);
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(msg);
      } else if (window.parent && window.parent.postMessage) {
        window.parent.postMessage(msg, '*');
      }
    }

    // Auto-Fit to Device Screen Width (Native Fluid Responsiveness)
    function applyAutoFit() {
      var container = document.getElementById('drive-container');
      if (!container) return;
      currentZoom = 1.0;
      container.style.transform = 'scale(1.0)';
      container.style.width = '100%';
      container.style.height = 'auto';
      postToReactNative({ type: 'ZOOM_INFO', zoom: 100 });
    }

    function setExplicitZoom(scaleVal) {
      var container = document.getElementById('drive-container');
      if (!container) return;
      currentZoom = scaleVal;
      container.style.transform = 'scale(' + scaleVal + ')';
      if (scaleVal > 1.0) {
        var card = document.querySelector('.drive-page-card');
        if (card) {
          container.style.height = (card.offsetHeight * scaleVal) + 'px';
        }
      } else {
        container.style.width = '100%';
        container.style.height = 'auto';
      }
      postToReactNative({ type: 'ZOOM_INFO', zoom: Math.round(scaleVal * 100) });
    }

    // Initialize document
    window.addEventListener('load', function() {
      var isHtmlMode = ${hasRawHtml ? 'true' : 'false'};
      var base64Pdf = "${base64Data}";

      if (isHtmlMode) {
        var loader = document.getElementById('loading-overlay');
        if (loader) loader.style.display = 'none';
        postToReactNative({ type: 'READY' });
        postToReactNative({ type: 'PAGE_INFO', current: 1, total: 1 });
        setTimeout(applyAutoFit, 60);
      } else if (base64Pdf) {
        loadPdfFromBase64(base64Pdf);
      } else {
        var loader = document.getElementById('loading-overlay');
        if (loader) loader.style.display = 'none';
        postToReactNative({ type: 'READY' });
        setTimeout(applyAutoFit, 60);
      }
    });

    window.addEventListener('resize', function() {
      applyAutoFit();
    });

    // Load PDF using PDF.js
    function loadPdfFromBase64(b64) {
      if (typeof pdfjsLib === 'undefined') {
        var loader = document.getElementById('loading-overlay');
        if (loader) loader.innerHTML = '<div style="color:#fff;padding:20px;text-align:center;">Viewer loaded. Use system viewer for full binary view.</div>';
        postToReactNative({ type: 'READY' });
        return;
      }

      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
      var raw = atob(b64);
      var uint8Array = new Uint8Array(raw.length);
      for (var i = 0; i < raw.length; i++) {
        uint8Array[i] = raw.charCodeAt(i);
      }

      pdfjsLib.getDocument({ data: uint8Array }).promise.then(function(doc) {
        pdfDoc = doc;
        var container = document.getElementById('pdf-pages-target');
        container.innerHTML = '';
        var numPages = doc.numPages;

        postToReactNative({ type: 'PAGE_INFO', current: 1, total: numPages });

        var renderPromises = [];
        for (var pageNum = 1; pageNum <= numPages; pageNum++) {
          renderPromises.push(renderSinglePdfPage(pageNum, container));
        }

        Promise.all(renderPromises).then(function() {
          var loader = document.getElementById('loading-overlay');
          if (loader) loader.style.display = 'none';
          postToReactNative({ type: 'READY' });
          setTimeout(applyAutoFit, 60);
        });
      }).catch(function(err) {
        console.error('PDF.js error:', err);
        var loader = document.getElementById('loading-overlay');
        if (loader) loader.style.display = 'none';
        postToReactNative({ type: 'READY' });
      });
    }

    function renderSinglePdfPage(num, target) {
      return pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport({ scale: 1.5 });
        var pageCard = document.createElement('div');
        pageCard.className = 'drive-page-card';
        pageCard.setAttribute('data-page', num);

        var canvas = document.createElement('canvas');
        canvas.className = 'canvas-page';
        var ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        pageCard.appendChild(canvas);
        target.appendChild(pageCard);

        return page.render({ canvasContext: ctx, viewport: viewport }).promise;
      });
    }

    // -------------------------------------------------------------
    // LIVE IN-DOCUMENT SEARCH ENGINE
    // -------------------------------------------------------------
    function performSearch(query) {
      clearHighlights();
      if (!query || query.trim().length === 0) {
        postToReactNative({ type: 'MATCH_COUNT', current: 0, total: 0 });
        return;
      }

      var q = query.trim();
      var root = document.getElementById('drive-container');
      walkAndHighlightTextNodes(root, q);

      currentMatches = document.querySelectorAll('mark.drive-find-highlight');
      var total = currentMatches.length;

      if (total > 0) {
        activeMatchIndex = 0;
        setActiveMatch(0);
        postToReactNative({ type: 'MATCH_COUNT', current: 1, total: total });
      } else {
        activeMatchIndex = -1;
        postToReactNative({ type: 'MATCH_COUNT', current: 0, total: 0 });
      }
    }

    function walkAndHighlightTextNodes(node, query) {
      if (!node) return;
      if (node.nodeType === 3) {
        var val = node.nodeValue;
        var lowerVal = val.toLowerCase();
        var lowerQ = query.toLowerCase();
        var idx = lowerVal.indexOf(lowerQ);

        if (idx !== -1) {
          var parent = node.parentNode;
          if (parent && parent.nodeName !== 'MARK' && parent.nodeName !== 'SCRIPT' && parent.nodeName !== 'STYLE') {
            var frag = document.createDocumentFragment();
            var lastIdx = 0;

            while (idx !== -1) {
              if (idx > lastIdx) {
                frag.appendChild(document.createTextNode(val.substring(lastIdx, idx)));
              }
              var mark = document.createElement('mark');
              mark.className = 'drive-find-highlight';
              mark.appendChild(document.createTextNode(val.substring(idx, idx + query.length)));
              frag.appendChild(mark);

              lastIdx = idx + query.length;
              idx = lowerVal.indexOf(lowerQ, lastIdx);
            }

            if (lastIdx < val.length) {
              frag.appendChild(document.createTextNode(val.substring(lastIdx)));
            }

            parent.replaceChild(frag, node);
          }
        }
      } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
        var children = Array.from(node.childNodes);
        for (var i = 0; i < children.length; i++) {
          walkAndHighlightTextNodes(children[i], query);
        }
      }
    }

    function setActiveMatch(index) {
      if (!currentMatches || currentMatches.length === 0) return;
      currentMatches.forEach(function(m) {
        m.classList.remove('active-match');
      });

      var active = currentMatches[index];
      if (active) {
        active.classList.add('active-match');
        active.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    function nextMatch() {
      if (currentMatches.length === 0) return;
      activeMatchIndex = (activeMatchIndex + 1) % currentMatches.length;
      setActiveMatch(activeMatchIndex);
      postToReactNative({ type: 'MATCH_COUNT', current: activeMatchIndex + 1, total: currentMatches.length });
    }

    function prevMatch() {
      if (currentMatches.length === 0) return;
      activeMatchIndex = (activeMatchIndex - 1 + currentMatches.length) % currentMatches.length;
      setActiveMatch(activeMatchIndex);
      postToReactNative({ type: 'MATCH_COUNT', current: activeMatchIndex + 1, total: currentMatches.length });
    }

    function clearHighlights() {
      var marks = document.querySelectorAll('mark.drive-find-highlight');
      marks.forEach(function(mark) {
        var parent = mark.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(mark.textContent), mark);
          parent.normalize();
        }
      });
      currentMatches = [];
      activeMatchIndex = -1;
    }

    // Commands from React Native parent
    function handleIncomingCommand(data) {
      if (data.type === 'SEARCH') {
        performSearch(data.query);
      } else if (data.type === 'SEARCH_NEXT') {
        nextMatch();
      } else if (data.type === 'SEARCH_PREV') {
        prevMatch();
      } else if (data.type === 'SEARCH_CLEAR') {
        clearHighlights();
        postToReactNative({ type: 'MATCH_COUNT', current: 0, total: 0 });
      } else if (data.type === 'SET_ZOOM') {
        setExplicitZoom(data.zoom);
      } else if (data.type === 'FIT_WIDTH') {
        applyAutoFit();
      }
    }

    window.addEventListener('message', function(e) {
      try {
        var data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        handleIncomingCommand(data);
      } catch(err) {}
    });

    document.addEventListener('message', function(e) {
      try {
        var data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        handleIncomingCommand(data);
      } catch(err) {}
    });
  </script>
</body>
</html>
    `;
  };

  const viewerHtml = generateDriveViewerHtml();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={[styles.modalRoot, { paddingTop: topInset }]}>
        <StatusBar barStyle="light-content" backgroundColor={DriveColors.headerBg} translucent={true} />

        {/* ============================================================= */}
        {/* TOP BAR: RIMT DRIVE VIEW APP BAR (SAFELY BELOW BATTERY/NOTCH) */}
        {/* ============================================================= */}
        {/* ============================================================= */}
        {/* 1. DOCUMENT TITLE BAR: THE WRITTEN PART (COMPLETELY SEPARATE)  */}
        {/* ============================================================= */}
        <View style={styles.documentTitleBar}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={handleClose}
            style={styles.headerIconBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={DriveColors.textLight} />
          </TouchableOpacity>

          {/* Document Title & Subtitle (Written Part with Full Horizontal Space) */}
          <View style={styles.headerTitleContainer}>
            <View style={styles.fileNameRow}>
              <View style={styles.pdfBadge}>
                <Text style={styles.pdfBadgeText}>PDF</Text>
              </View>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {currentFileName}
              </Text>
            </View>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {fileSizeText}
            </Text>
          </View>

          {/* Prominent High-Quality Red Download Button */}
          <TouchableOpacity
            onPress={handleDownload}
            style={styles.headerDownloadBtn}
            activeOpacity={0.8}
          >
            <MaterialIcons name="file-download" size={17} color="#ffffff" />
            <Text style={styles.headerDownloadText}>Download</Text>
          </TouchableOpacity>
        </View>

        {/* ============================================================= */}
        {/* 2. DEDICATED OPTIONS TOOLBAR: ACTIONS STRIP SEPARATED BELOW    */}
        {/* ============================================================= */}
        {!isSearchVisible ? (
          <View style={styles.optionsToolbar}>
            {/* Dedicated Left Badge: RIMT PDF Viewer (Zero overlap) */}
            <View style={styles.rimtPill}>
              <MaterialIcons name="picture-as-pdf" size={13} color="#8AB4F8" style={{ marginRight: 5 }} />
              <Text style={styles.rimtPillText}>RIMT PDF Viewer</Text>
            </View>

            {/* Dedicated Right Option Actions */}
            <View style={styles.toolbarOptionsGroup}>
              {/* Search in Document Toggle */}
              <TouchableOpacity
                onPress={() => setIsSearchVisible(true)}
                style={styles.toolOptionBtn}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              >
                <MaterialIcons name="search" size={20} color={DriveColors.textLight} />
              </TouchableOpacity>

              {/* Open Any PDF File from Device Storage */}
              <TouchableOpacity
                onPress={handlePickExternalPdf}
                disabled={isPickingPdf}
                style={styles.toolOptionBtn}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              >
                {isPickingPdf ? (
                  <ActivityIndicator size="small" color={DriveColors.accentBlue} />
                ) : (
                  <MaterialIcons name="folder-open" size={20} color={DriveColors.accentBlue} />
                )}
              </TouchableOpacity>

              {/* Print Document */}
              {onPrint && (
                <TouchableOpacity
                  onPress={onPrint}
                  style={styles.toolOptionBtn}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                >
                  <MaterialIcons name="print" size={19} color={DriveColors.textLight} />
                </TouchableOpacity>
              )}

              {/* Share PDF */}
              <TouchableOpacity
                onPress={handleShare}
                style={styles.toolOptionBtn}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              >
                <MaterialIcons name="share" size={19} color={DriveColors.textLight} />
              </TouchableOpacity>

              {/* Fit Screen */}
              <TouchableOpacity
                onPress={handleFitWidth}
                style={styles.toolOptionBtn}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              >
                <MaterialIcons name="fit-screen" size={19} color={DriveColors.textLight} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.searchBarContainer}>
            <MaterialIcons name="search" size={22} color={DriveColors.textMuted} style={{ marginLeft: 6 }} />
            
            <TextInput
              style={styles.searchInput}
              placeholder="Find text, skills, lines in document..."
              placeholderTextColor={DriveColors.textMuted}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={handleSearchNext}
            />

            {/* Match Counter Badge */}
            {searchQuery.trim().length > 0 && (
              <View style={styles.matchCountBadge}>
                <Text style={styles.matchCountText}>
                  {matchCount.total > 0 ? `${matchCount.current} of ${matchCount.total}` : '0 of 0'}
                </Text>
              </View>
            )}

            {/* Previous Match */}
            <TouchableOpacity
              onPress={handleSearchPrev}
              disabled={matchCount.total === 0}
              style={[styles.searchNavBtn, matchCount.total === 0 && { opacity: 0.4 }]}
            >
              <MaterialIcons name="keyboard-arrow-up" size={24} color={DriveColors.textLight} />
            </TouchableOpacity>

            {/* Next Match */}
            <TouchableOpacity
              onPress={handleSearchNext}
              disabled={matchCount.total === 0}
              style={[styles.searchNavBtn, matchCount.total === 0 && { opacity: 0.4 }]}
            >
              <MaterialIcons name="keyboard-arrow-down" size={24} color={DriveColors.textLight} />
            </TouchableOpacity>

            {/* Close Search */}
            <TouchableOpacity onPress={handleCloseSearch} style={styles.searchCloseBtn}>
              <MaterialIcons name="close" size={22} color={DriveColors.textLight} />
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================= */}
        {/* ONBOARDING SCREEN BANNER (Institutional Studio Guide)          */}
        {/* ============================================================= */}
        {showOnboardingBanner && !isSearchVisible && (
          <View style={styles.onboardingBanner}>
            <View style={styles.onboardingTopRow}>
              <View style={styles.onboardingTitleGroup}>
                <MaterialIcons name="verified" size={15} color="#8AB4F8" />
                <Text style={styles.onboardingTitle}>RIMT PDF Studio</Text>
                <View style={styles.onboardingPill}>
                  <Text style={styles.onboardingPillText}>A4 Responsive</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowOnboardingBanner(false)}
                style={styles.onboardingCloseBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialIcons name="close" size={16} color={DriveColors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.onboardingSubtitle}>
              Live document inspector: search text, adjust responsive zoom to fit screen, or open any PDF from your device storage.
            </Text>
            <View style={styles.onboardingActions}>
              <TouchableOpacity
                onPress={() => setIsSearchVisible(true)}
                style={styles.onboardingChip}
                activeOpacity={0.7}
              >
                <MaterialIcons name="search" size={13} color="#8AB4F8" />
                <Text style={styles.onboardingChipText}>Search in PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePickExternalPdf}
                style={styles.onboardingChip}
                activeOpacity={0.7}
              >
                <MaterialIcons name="folder-open" size={13} color="#81C995" />
                <Text style={styles.onboardingChipText}>Open Device PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDownload}
                style={[styles.onboardingChip, { borderColor: 'rgba(234, 67, 53, 0.4)' }]}
                activeOpacity={0.7}
              >
                <MaterialIcons name="file-download" size={13} color="#F28B82" />
                <Text style={[styles.onboardingChipText, { color: '#F28B82' }]}>Save PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================= */}
        {/* DOCUMENT VIEWPORT (PDF.JS + VECTOR ENGINE)                   */}
        {/* ============================================================= */}
        <View style={styles.viewportContainer}>
          {Platform.OS === 'web' ? (
            <iframe
              ref={iframeRef}
              srcDoc={viewerHtml}
              style={styles.webIframe}
              title="RIMT PDF Viewer"
            />
          ) : (
            <WebView
              ref={webViewRef}
              source={{ html: viewerHtml }}
              originWhitelist={['*']}
              allowFileAccess={true}
              allowFileAccessFromFileURLs={true}
              allowUniversalAccessFromFileURLs={true}
              mixedContentMode="always"
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={true}
              onMessage={handleWebViewMessage}
              style={styles.webView}
            />
          )}

          {/* Floating Responsive Drive Toolbar at Bottom */}
          <View style={[styles.floatingControls, { bottom: Math.max(16, bottomInset + 10) }]}>
            {/* Page Count */}
            <View style={styles.pageCountChip}>
              <Text style={styles.pageCountText}>
                {pageInfo.current} / {pageInfo.total}
              </Text>
            </View>

            {/* Fit Width Button */}
            <TouchableOpacity
              onPress={handleFitWidth}
              style={styles.fitWidthBtn}
              activeOpacity={0.7}
            >
              <MaterialIcons name="fit-screen" size={13} color={DriveColors.accentBlue} />
              <Text style={styles.fitWidthText}>Fit</Text>
            </TouchableOpacity>

            {/* Zoom Out */}
            <TouchableOpacity onPress={() => handleZoom(-15)} style={styles.zoomBtn} activeOpacity={0.7}>
              <MaterialIcons name="remove" size={18} color={DriveColors.textLight} />
            </TouchableOpacity>

            {/* Zoom Reset / Current Zoom */}
            <TouchableOpacity onPress={handleResetZoom} style={styles.zoomResetBtn} activeOpacity={0.7}>
              <Text style={styles.zoomResetText}>{zoomLevel}%</Text>
            </TouchableOpacity>

            {/* Zoom In */}
            <TouchableOpacity onPress={() => handleZoom(15)} style={styles.zoomBtn} activeOpacity={0.7}>
              <MaterialIcons name="add" size={18} color={DriveColors.textLight} />
            </TouchableOpacity>

            {/* Open Device PDF Button */}
            <TouchableOpacity
              onPress={handlePickExternalPdf}
              style={styles.openAnotherPdfBtn}
              activeOpacity={0.8}
            >
              <MaterialIcons name="folder-open" size={14} color="#ffffff" />
              <Text style={styles.openAnotherPdfText}>Open PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: DriveColors.headerBg,
  },
  documentTitleBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: DriveColors.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: '#282A2E',
    gap: 8,
  },
  optionsToolbar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#25272B',
    borderBottomWidth: 1,
    borderBottomColor: DriveColors.headerBorder,
  },
  toolbarOptionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolOptionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 2,
    justifyContent: 'center',
  },
  fileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pdfBadge: {
    backgroundColor: 'rgba(234, 67, 53, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(234, 67, 53, 0.4)',
  },
  pdfBadgeText: {
    color: '#F28B82',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: DriveColors.textLight,
    flex: 1,
    letterSpacing: 0.1,
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: DriveColors.textMuted,
    marginTop: 2,
  },
  rimtPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 180, 248, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(138, 180, 248, 0.28)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  rimtPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: DriveColors.accentBlue,
    letterSpacing: 0.2,
  },
  headerDownloadBtn: {
    backgroundColor: DriveColors.redAction,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
    shadowColor: DriveColors.redAction,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  headerDownloadText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // ONBOARDING BANNER
  onboardingBanner: {
    backgroundColor: '#26292E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  onboardingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  onboardingTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onboardingTitle: {
    color: DriveColors.textLight,
    fontSize: 12.5,
    fontWeight: '800',
  },
  onboardingPill: {
    backgroundColor: 'rgba(138, 180, 248, 0.16)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  onboardingPillText: {
    color: '#8AB4F8',
    fontSize: 9.5,
    fontWeight: '700',
  },
  onboardingCloseBtn: {
    padding: 4,
  },
  onboardingSubtitle: {
    color: DriveColors.textMuted,
    fontSize: 10.5,
    lineHeight: 14.5,
    marginBottom: 8,
  },
  onboardingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  onboardingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onboardingChipText: {
    color: DriveColors.textLight,
    fontSize: 10.5,
    fontWeight: '600',
  },

  // SEARCH BAR
  searchBarContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: DriveColors.searchBarBg,
    borderBottomWidth: 1,
    borderBottomColor: DriveColors.headerBorder,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 13.5,
    color: DriveColors.textLight,
    paddingHorizontal: 8,
  },
  matchCountBadge: {
    backgroundColor: DriveColors.badgeBg,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  matchCountText: {
    color: DriveColors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  searchNavBtn: {
    padding: 6,
    borderRadius: 4,
  },
  searchCloseBtn: {
    padding: 6,
    borderRadius: 4,
    marginLeft: 4,
  },

  // VIEWPORT
  viewportContainer: {
    flex: 1,
    backgroundColor: DriveColors.canvasBg,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: DriveColors.canvasBg,
  },
  webIframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    backgroundColor: DriveColors.canvasBg,
  },

  // FLOATING DRIVE CONTROLS (BOTTOM)
  floatingControls: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(32, 33, 36, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 24,
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  pageCountChip: {
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
  },
  pageCountText: {
    color: DriveColors.textLight,
    fontSize: 10.5,
    fontWeight: '700',
  },
  fitWidthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(138, 180, 248, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(138, 180, 248, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  fitWidthText: {
    color: DriveColors.accentBlue,
    fontSize: 10.5,
    fontWeight: '700',
  },
  zoomBtn: {
    padding: 5,
    borderRadius: 12,
  },
  zoomResetBtn: {
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  zoomResetText: {
    color: DriveColors.accentBlue,
    fontSize: 11,
    fontWeight: '700',
  },
  openAnotherPdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 9,
    paddingVertical: 5.5,
    borderRadius: 12,
    marginLeft: 3,
  },
  openAnotherPdfText: {
    color: '#ffffff',
    fontSize: 10.5,
    fontWeight: '800',
  },
});
