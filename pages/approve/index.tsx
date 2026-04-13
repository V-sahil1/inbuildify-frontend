import React, { useEffect, useState, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { Spin, Result, Button } from 'antd';
import type { NextPage } from 'next';
import SystemRoutes from '@lib/constants/Routes';

const ApprovalPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isThankYou, setIsThankYou] = useState(false);

  useEffect(() => {
    const handleApproval = async () => {
      try {
        const { email, quotationId, envelopeId, approved } = router.query;

        // Check if this is a thank you page (already approved)
        if (approved === 'true') {
          setIsThankYou(true);
          setLoading(false);
          return;
        }

        // Validate required parameters
        if (!email || !quotationId || !envelopeId) {
          setError('Missing required parameters');
          setLoading(false);
          return;
        }

        // Show redirecting message
        console.log('Redirecting to e-signature PDF...');

        // Call DocuSign API (this would be your actual API call)
        const response = await fetch('/api/docusign/esignature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            quotationId,
            envelopeId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to initiate e-signature');
        }

        const data = await response.json();

        // Redirect to the e-signature URL
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No e-signature URL received');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    // Only run when router is ready
    if (router.isReady) {
      handleApproval();
    }
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-lg font-medium text-gray-900">
            Redirecting to e-signature PDF...
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Please wait while we prepare your document for signature.
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Result
          status="error"
          title="E-Signature Error"
          subTitle={error}
          extra={[
            <Button key="home" type="primary" href="/">
              Go to Homepage
            </Button>,
          ]}
        />
      </div>
    );
  }

  if (isThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Result
          status="success"
          title="Thank You!"
          subTitle="Your quotation has been successfully approved and signed."
          extra={[
            <Button key="home" href="/">
              Go to Homepage
            </Button>,
          ]}
        />
      </div>
    );
  }

  return null;
};

export default ApprovalPage;
