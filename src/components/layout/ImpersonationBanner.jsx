import React from 'react';
import { useApp } from '../../store/AppContext';
import { Eye, X } from 'lucide-react';

export const ImpersonationBanner = () => {
  const { isImpersonating, impersonatedRole, activeUser, activeGym, exitViewAs } = useApp();

  if (!isImpersonating) return null;

  return (
    <aside className="impersonation-banner" role="alert">
      <div className="banner-content">
        <span className="banner-pulse"></span>
        <Eye size={16} />
        <span>
          <strong>VIEWING AS:</strong> {impersonatedRole?.toUpperCase()} ({activeUser?.name}) — {activeGym?.name?.toUpperCase()}
        </span>
      </div>
      <button 
        className="btn-exit-impersonation"
        onClick={exitViewAs}
        title="Exit impersonation and return to Super Admin Control Tower"
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <X size={12} /> Exit View-As
        </span>
      </button>
    </aside>
  );
};
