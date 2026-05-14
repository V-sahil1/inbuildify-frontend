import React from 'react';
import { useRouter } from 'next/router';
import { Button, Result } from 'antd';

const reasonMessages: Record<string, string> = {
  missing_token: 'The signing link is incomplete. Please use the link from your email.',
  invalid_token: 'The signing link has expired or is invalid. Please contact your builder for a new link.',
  docusign_error: 'We could not reach the signing service right now. Please try again in a few minutes or contact your builder.',
};

const SigningError: React.FC = () => {
  const router = useRouter();
  const reason = typeof router.query.reason === 'string' ? router.query.reason : 'docusign_error';
  const message = reasonMessages[reason] ?? reasonMessages.docusign_error;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f4f4f4' }}>
      <Result
        status="warning"
        title="Unable to Open Signing Page"
        subTitle={message}
        extra={
          <Button type="primary" onClick={() => window.close()}>
            Close
          </Button>
        }
      />
    </div>
  );
};

export default SigningError;
