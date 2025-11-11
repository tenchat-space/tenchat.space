import { useEffect, useRef } from 'react';
import { useAppwrite } from '@/contexts/AppwriteContext';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const { isAuthenticated } = useAppwrite();
  const windowRef = useRef<Window | null>(null);

  const buildAuthUrl = (): string => {
    const authSubdomain = import.meta.env.VITE_AUTH_SUBDOMAIN || 'accounts';
    const domain = import.meta.env.VITE_DOMAIN || 'tenchat.space';

    // Clean up auth subdomain - remove http/https if present
    const cleanSubdomain = authSubdomain
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');

    // Clean up domain - remove http/https if present
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');

    // Build the URL
    const url = `https://${cleanSubdomain}.${cleanDomain}`;
    console.log('[Auth] Opening window with URL:', url);
    return url;
  };

  const openAuthWindow = () => {
    const authUrl = buildAuthUrl();
    windowRef.current = window.open(authUrl, 'tenchat-auth', 'width=500,height=700');
    if (!windowRef.current) {
      console.error('[Auth] Failed to open auth window');
    }
  };

  // Monitor for successful authentication
  useEffect(() => {
    if (!open) return;

    const checkAuth = setInterval(() => {
      if (isAuthenticated) {
        console.log('[Auth] Session detected, closing auth window');
        if (windowRef.current && !windowRef.current.closed) {
          windowRef.current.close();
        }
        windowRef.current = null;
        clearInterval(checkAuth);
        onOpenChange(false);
        onSuccess();
      }
    }, 500);

    return () => clearInterval(checkAuth);
  }, [open, isAuthenticated, onOpenChange, onSuccess]);

  // Check if auth window was closed
  useEffect(() => {
    if (!open || !windowRef.current) return;

    const checkClosed = setInterval(() => {
      if (windowRef.current && windowRef.current.closed) {
        clearInterval(checkClosed);
        windowRef.current = null;
      }
    }, 500);

    return () => clearInterval(checkClosed);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2">Connect to Tenchat</h2>
        <p className="text-gray-400 mb-6">
          A secure connection window will open. Complete the authentication process there.
        </p>
        <button
          onClick={openAuthWindow}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
        >
          Open Connection Window
        </button>
        <p className="text-xs text-gray-500 mt-4 text-center">
          Make sure pop-ups are enabled in your browser
        </p>
      </div>
    </div>
  );
}
