import React, { useEffect } from 'react';

export default function Notification({ show, message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const styles = {
    container: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      background: type === 'success' ? '#4CAF50' : '#f44336',
      color: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'slideIn 0.3s ease-out',
      maxWidth: '400px',
      wordWrap: 'break-word'
    },
    icon: {
      fontSize: '18px',
      fontWeight: 'bold'
    },
    message: {
      flex: 1,
      fontSize: '14px'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '18px',
      cursor: 'pointer',
      padding: '0 5px',
      opacity: 0.8,
      transition: 'opacity 0.2s'
    }
  };

  return (
    <>
      <div style={styles.container}>
        <span style={styles.icon}>
          {type === 'success' ? '✓' : '✕'}
        </span>
        <span style={styles.message}>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            style={styles.closeButton}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}} />
    </>
  );
}