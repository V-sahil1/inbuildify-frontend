import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import CryptoJS from 'crypto-js';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PropertyDetails {
  builderName?: string;
  projectName?: string;
  address?: string;
  lotNumber?: string;
  floorPlan?: string;
  facade?: string;
  range?: string;
  package?: string;
}

type PageState = 'loading' | 'ready' | 'uploading' | 'success' | 'error' | 'invalid';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5000';
const EXT_SECRET = process.env.NEXT_PUBLIC_API_SECRET || 'fallback_secret_key_123';
const EXT_SECRET_TEXT = (process.env.NEXT_PUBLIC_API_SECRET_TEXT || 'ALLOW_REPORT').trim();

/** Build an encrypted token that matches the backend validateExternalToken middleware. */
function generateSecureToken(): string {
  const payload = `${EXT_SECRET_TEXT}|${Date.now()}`;
  return CryptoJS.AES.encrypt(payload, EXT_SECRET).toString();
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div style={styles.center}>
      <div style={styles.spinner} />
      <p style={{ color: '#94a3b8', marginTop: 16, fontSize: 15 }}>Loading details…</p>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div style={styles.center}>
      <div style={iconCircle('#fee2e2', '#ef4444')}>✕</div>
      <h2 style={{ color: '#1e293b', marginTop: 16, marginBottom: 8 }}>Something went wrong</h2>
      <p style={{ color: '#64748b', maxWidth: 360, textAlign: 'center' }}>{message}</p>
    </div>
  );
}

function InvalidScreen() {
  return (
    <div style={styles.center}>
      <div style={iconCircle('#fef3c7', '#d97706')}>⚠</div>
      <h2 style={{ color: '#1e293b', marginTop: 16, marginBottom: 8 }}>Invalid Link</h2>
      <p style={{ color: '#64748b', maxWidth: 360, textAlign: 'center' }}>
        This link is invalid or the required parameters are missing. Please use the link provided in your email.
      </p>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div style={styles.center}>
      <div style={iconCircle('#d1fae5', '#10b981')}>✓</div>
      <h2 style={{ color: '#1e293b', marginTop: 16, marginBottom: 8 }}>Report Uploaded Successfully</h2>
      <p style={{ color: '#64748b', maxWidth: 360, textAlign: 'center' }}>
        Thank you! Your structural engineering report has been uploaded. The builder has been notified.
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExternalUploadPage() {
  const router = useRouter();
  const { Type, id } = router.query as { Type?: string; id?: string };

  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [details, setDetails] = useState<PropertyDetails>({});
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ── Load public details ───────────────────────────────────────────────────

  const loadDetails = useCallback(async (versionId: string) => {
    try {
      const token = generateSecureToken();
      const res = await axios.get(
        `${API_BASE}/quotation/version/${versionId}/public-details`,
        { headers: { 'x-secure-access': token } }
      );
      const d = res.data?.data || {};
      const prop = d.property_details || {};
      const street = prop.street || prop.address_line1 || '';
      const city = prop.city || '';
      const zip = prop.zip_code || '';
      const addressParts = [street, city, zip].filter(Boolean);
      setDetails({
        builderName: d.builder_name || undefined,
        address: addressParts.length > 0 ? addressParts.join(', ') : undefined,
        lotNumber: prop.lot_number ? String(prop.lot_number) : undefined,
        range: undefined,
        floorPlan: undefined,
        facade: undefined,
        package: undefined,
      });
      setPageState('ready');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to load project details.';
      setErrorMessage(msg);
      setPageState('error');
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    if (!Type || !id) {
      setPageState('invalid');
      return;
    }

    if (Type === 'structuralengineer') {
      loadDetails(id);
    } else {
      setPageState('invalid');
    }
  }, [router.isReady, Type, id, loadDetails]);

  // ── Upload handler ────────────────────────────────────────────────────────

  const handleUpload = async () => {
    if (!file || !id) return;

    try {
      setPageState('uploading');
      setUploadProgress(0);

      const token = generateSecureToken();
      const formData = new FormData();
      formData.append('pdf', file);

      await axios.post(
        `${API_BASE}/quotation/version/${id}/structure-engineer-report`,
        formData,
        {
          headers: {
            'x-secure-access': token,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (e) => {
            if (e.total) {
              setUploadProgress(Math.round((e.loaded / e.total) * 100));
            }
          },
        }
      );

      setPageState('success');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Upload failed. Please try again.';
      setErrorMessage(msg);
      setPageState('error');
    }
  };

  // ── File drop ─────────────────────────────────────────────────────────────

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Head>
        <title>Upload Structural Engineering Report | inBuildify</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div style={styles.page}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <span style={styles.logo}>inBuildify</span>
            <span style={styles.badge}>Structural Engineering Portal</span>
          </div>
        </header>

        {/* Body */}
        <main style={styles.main}>
          {pageState === 'loading' && <LoadingScreen />}
          {pageState === 'invalid' && <InvalidScreen />}
          {pageState === 'success' && <SuccessScreen />}
          {pageState === 'error' && <ErrorScreen message={errorMessage} />}

          {(pageState === 'ready' || pageState === 'uploading') && (
            <div style={styles.card}>
              {/* Project details */}
              <div style={styles.sectionTitle}>Project Details</div>
              <div style={styles.detailsGrid}>
                {details.builderName && <DetailRow label="Builder" value={details.builderName} />}
                {details.address && <DetailRow label="Address" value={details.address} />}
                {details.lotNumber && <DetailRow label="Lot No." value={details.lotNumber} />}
                {details.range && <DetailRow label="Range" value={details.range} />}
                {details.floorPlan && <DetailRow label="Floor Plan" value={details.floorPlan} />}
                {details.facade && <DetailRow label="Facade" value={details.facade} />}
                {details.package && <DetailRow label="Package" value={details.package} />}
              </div>

              <div style={{ height: 1, background: '#e2e8f0', margin: '24px 0' }} />

              {/* Upload zone */}
              <div style={styles.sectionTitle}>Upload Your Report (PDF)</div>

              <div
                style={{
                  ...styles.dropZone,
                  borderColor: dragOver ? '#f97316' : file ? '#10b981' : '#cbd5e1',
                  background: dragOver ? '#fff7ed' : file ? '#f0fdf4' : '#f8fafc',
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('pdf-input')?.click()}
              >
                <input
                  id="pdf-input"
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                {file ? (
                  <>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                    <div style={{ fontWeight: 600, color: '#10b981', marginBottom: 4 }}>{file.name}</div>
                    <div style={{ color: '#64748b', fontSize: 13 }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB — click to change
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>
                      Drop your PDF here or click to browse
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: 13 }}>Max file size: 10 MB</div>
                  </>
                )}
              </div>

              {/* Progress bar */}
              {pageState === 'uploading' && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>Uploading…</span>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{uploadProgress}%</span>
                  </div>
                  <div style={styles.progressTrack}>
                    <div style={{ ...styles.progressBar, width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                style={{
                  ...styles.submitBtn,
                  opacity: !file || pageState === 'uploading' ? 0.5 : 1,
                  cursor: !file || pageState === 'uploading' ? 'not-allowed' : 'pointer',
                }}
                disabled={!file || pageState === 'uploading'}
                onClick={handleUpload}
              >
                {pageState === 'uploading' ? 'Uploading…' : '📤 Submit Report'}
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: 12 }}>
            © {new Date().getFullYear()} inBuildify — Modern Construction &amp; CRM Solutions
          </p>
        </footer>
      </div>
    </>
  );
}

// ─── Detail Row ───────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>{value}</span>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    background: '#f6f9fc',
    color: '#1e293b',
  },
  header: {
    background: '#0056b3',
    padding: '18px 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  headerInner: {
    maxWidth: 680,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  badge: {
    fontSize: 11,
    fontWeight: 700,
    color: '#b3d7ff',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    background: 'rgba(255,255,255,0.15)',
    padding: '4px 10px',
    borderRadius: 4,
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '40px 16px',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    width: '100%',
    maxWidth: 480,
  },
  card: {
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #eef2f5',
    padding: '32px',
    width: '100%',
    maxWidth: 600,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    background: '#f8fafc',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderBottom: '1px solid #e2e8f0',
    fontSize: 14,
  },
  detailLabel: {
    color: '#64748b',
  },
  detailValue: {
    fontWeight: 600,
    color: '#1e293b',
    textAlign: 'right',
    maxWidth: '60%',
  },
  dropZone: {
    border: '2px dashed',
    borderRadius: 8,
    padding: '36px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  progressTrack: {
    height: 6,
    background: '#e2e8f0',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: '#f97316',
    borderRadius: 9999,
    transition: 'width 0.3s',
  },
  submitBtn: {
    display: 'block',
    width: '100%',
    marginTop: 20,
    padding: '14px',
    background: '#f97316',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '0.3px',
    boxShadow: '0 4px 12px rgba(249,115,22,0.25)',
    transition: 'opacity 0.2s',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #0056b3',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  footer: {
    textAlign: 'center',
    padding: '20px 16px',
    borderTop: '1px solid #eef2f5',
    background: '#f8fafc',
  },
};

const iconCircle = (bg: string, color: string): React.CSSProperties => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 28,
  color,
  fontWeight: 700,
});
