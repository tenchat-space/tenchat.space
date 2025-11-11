import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import Chat from './pages/Chat';
import { AuthModal } from './components/auth/auth-modal';
import { AppwriteProvider, useAppwrite } from './contexts/AppwriteContext';

function AppContent() {
  const { currentAccount, currentProfile, isAuthenticated, isLoading, logout } = useAppwrite();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show auth modal when not authenticated
  useEffect(() => {
    if (!isLoading) {
      setShowAuthModal(!isAuthenticated);
    }
  }, [isAuthenticated, isLoading]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Convert Appwrite account to legacy User type for compatibility
  const legacyUser = currentAccount && currentProfile ? {
    id: currentAccount.$id,
    displayName: currentProfile.displayName || currentAccount.name,
    identity: {
      id: currentAccount.$id,
      publicKey: '',
      identityKey: '',
      signedPreKey: '',
      oneTimePreKeys: [],
    },
    createdAt: new Date(currentAccount.$createdAt),
    lastSeen: new Date(currentProfile.lastSeen || currentAccount.$createdAt),
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">loading Tenchat...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Blur UI when not authenticated */}
      <div className={!isAuthenticated ? 'blur-sm pointer-events-none' : ''}>
        <Chat 
          currentUser={legacyUser} 
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
      </div>
      
      {/* Auth overlay - shows when not authenticated */}
      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={() => setShowAuthModal(false)}
      />
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppwriteProvider>
        <AppContent />
      </AppwriteProvider>
    </BrowserRouter>
  );
}

export default App;
