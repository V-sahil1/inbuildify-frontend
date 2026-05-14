import React, { useEffect, useState } from 'react';
import { Button, Result, Spin } from 'antd';
import { useRouter } from 'next/router';

const SignComplete: React.FC = () => {
  const router = useRouter();
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    const { envelopeId, event } = router.query;
    if (!router.isReady) return;

    // Sync the envelope status with the backend regardless of what DocuSign's
    // server-to-server webhook already did — this is a reliable fallback.
    if (envelopeId && typeof envelopeId === 'string') {
      const apiBase = process.env.NEXT_PUBLIC_API_ENDPOINT || '';
      fetch(`${apiBase}/docusign/public/status/${envelopeId}`)
        .catch((err) => console.warn('[sign-complete] status sync failed:', err))
        .finally(() => setSyncing(false));
    } else {
      setSyncing(false);
    }
  }, [router.isReady, router.query]);

  if (syncing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f4f4f4' }}>
        <Spin size="large" tip="Finalising your signature…" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f4f4f4' }}>
      <Result
        status="success"
        title="Document Signed Successfully"
        subTitle="Thank you for signing. Your builder has been notified and will be in touch with you shortly."
        extra={
          <Button type="primary" onClick={() => window.close()}>
            Close
          </Button>
        }
      />
    </div>
  );
};

export default SignComplete;
