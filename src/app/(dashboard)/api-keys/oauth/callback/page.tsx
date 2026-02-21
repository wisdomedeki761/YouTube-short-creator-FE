'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { CheckCircle, XCircle } from 'lucide-react';

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  useEffect(() => {
    if (code && window.opener) {
      window.opener.postMessage(
        { type: 'youtube-oauth-callback', code },
        window.location.origin
      );
      console.log('✅ Sent OAuth code to parent window');
    } else if (error && window.opener) {
      window.opener.postMessage(
        { type: 'youtube-oauth-error', error },
        window.location.origin
      );
      console.log('❌ OAuth error:', error);
    }
  }, [code, error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 text-center">
        {code ? (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Authorization Successful!</h1>
            <p className="text-gray-600">You can close this window now.</p>
          </>
        ) : error ? (
          <>
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Authorization Failed</h1>
            <p className="text-gray-600">{error}</p>
          </>
        ) : (
          <p className="text-gray-600">Processing...</p>
        )}
      </Card>
    </div>
  );
}
