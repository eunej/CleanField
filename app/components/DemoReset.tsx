'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * DemoReset Component
 * 
 * Listens for the user typing "reset" anywhere on the page.
 * When triggered, calls the reset API to reset all farm claims for demos.
 */
export default function DemoReset() {
  const [buffer, setBuffer] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ success: false, message: '' });

  const triggerReset = useCallback(async () => {
    if (isResetting) return;
    
    setIsResetting(true);
    setShowNotification(true);
    setNotification({ success: true, message: 'Resetting all farms for demo...' });

    try {
      const response = await fetch('/api/reset', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        setNotification({ 
          success: true, 
          message: `Reset complete! All farms can now claim rewards again.` 
        });
        // Auto-hide after 3 seconds
        setTimeout(() => setShowNotification(false), 3000);
      } else {
        setNotification({ 
          success: false, 
          message: data.error || 'Reset failed' 
        });
        setTimeout(() => setShowNotification(false), 5000);
      }
    } catch (error) {
      setNotification({ 
        success: false, 
        message: 'Failed to connect to reset service' 
      });
      setTimeout(() => setShowNotification(false), 5000);
    } finally {
      setIsResetting(false);
    }
  }, [isResetting]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();
      
      // Only track alphabetic keys
      if (key.length === 1 && /[a-z]/.test(key)) {
        setBuffer(prev => {
          const newBuffer = (prev + key).slice(-5); // Keep last 5 characters
          
          // Check if buffer ends with "reset"
          if (newBuffer === 'reset') {
            triggerReset();
            return '';
          }
          
          return newBuffer;
        });
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [triggerReset]);

  // Clear buffer after 2 seconds of inactivity
  useEffect(() => {
    if (buffer) {
      const timeout = setTimeout(() => setBuffer(''), 2000);
      return () => clearTimeout(timeout);
    }
  }, [buffer]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 ${
        notification.success 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
          : 'bg-gradient-to-r from-red-500 to-rose-600'
      }`}>
        {isResetting ? (
          <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : notification.success ? (
          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        ) : (
          <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
        )}
        <span className="text-white font-semibold">{notification.message}</span>
        {!isResetting && (
          <button 
            onClick={() => setShowNotification(false)}
            className="ml-2 text-white opacity-75 hover:opacity-100"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
