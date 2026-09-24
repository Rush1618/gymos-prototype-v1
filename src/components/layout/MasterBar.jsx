import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { StorageService } from '../../services/storageService';
import { SoundEngine } from '../../utils/audio';
import { 
  Building2, 
  Layers, 
  Globe, 
  UserCheck, 
  ShieldAlert, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Eye,
  Volume2,
  VolumeX,
  Sun,
  Moon
} from 'lucide-react';

export const MasterBar = () => {
  const [muted, setMuted] = useState(() => SoundEngine.isMuted());
  const {
    gyms,
    users,
    activeGym,
    activeGymId,
    setActiveGymId,
    activeSurface,
    setActiveSurface,
    isImpersonating,
    impersonatedRole,
    activeUser,
    startViewAs,
    exitViewAs,
    addToast,
    themeMode,
    toggleThemeMode
  } = useApp();

  const toggleAudio = () => {
    const isNowMuted = !SoundEngine.toggleSound();
    setMuted(isNowMuted);
    if (!isNowMuted) SoundEngine.playSuccessChime();
    addToast(isNowMuted ? 'Audio feedback muted' : 'Audio feedback enabled', 'info', 2000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default initial state?')) {
      StorageService.resetToDefaults();
    }
  };

  // Pre-configured quick role impersonation targets for the current gym
  const gymUsers = users.filter(u => u.gymId === activeGymId);
  const ownerUser = gymUsers.find(u => u.roleId === 'owner');
  const managerUser = gymUsers.find(u => u.roleId === 'manager');
  const trainerArjun = gymUsers.find(u => u.id === 'user_trainer_arjun');
  const receptionistKavita = gymUsers.find(u => u.roleId === 'receptionist');
  const memberRahul = gymUsers.find(u => u.id === 'user_member_rahul');
  const memberPriya = gymUsers.find(u => u.id === 'user_member_priya');

  return (
    <header className="master-bar">
      <div className="master-left">
        {/* Agency Logo & Badge */}
        <div className="master-brand-badge">
          <span>GymOS</span>
          <span className="agency-pill">Agency Platform</span>
        </div>

        {/* Surface Switcher (The 4 Connected Products from Prompt Section 4) */}
        <nav className="surface-switcher" aria-label="Product Surface Switcher">
          <button 
            className={`surface-btn ${activeSurface === 'superadmin' ? 'active' : ''}`}
            onClick={() => {
              SoundEngine.playClickPop();
              setActiveSurface('superadmin');
            }}
            title="Agency Control Tower & Multi-Tenant Management"
          >
            <ShieldAlert size={14} />
            <span>Super Admin</span>
          </button>

          <button 
            className={`surface-btn ${activeSurface === 'gymos' ? 'active' : ''}`}
            onClick={() => {
              SoundEngine.playClickPop();
              setActiveSurface('gymos');
            }}
            title="Gym Operating System (Owner & Staff)"
          >
            <Layers size={14} />
            <span>Gym OS</span>
          </button>

          <button 
            className={`surface-btn ${activeSurface === 'public' ? 'active' : ''}`}
            onClick={() => {
              SoundEngine.playClickPop();
              setActiveSurface('public');
            }}
            title="Public Conversion Website & Free Trial Capture"
          >
            <Globe size={14} />
            <span>Public Site</span>
          </button>

          <button 
            className={`surface-btn ${activeSurface === 'member' ? 'active' : ''}`}
            onClick={() => {
              SoundEngine.playClickPop();
              setActiveSurface('member');
            }}
            title="Member Experience & Digital QR Pass"
          >
            <UserCheck size={14} />
            <span>Member Portal</span>
          </button>
        </nav>
      </div>

      <div className="master-right">
        {/* Tenant Gym Selector */}
        <div className="control-dropdown-group">
          <span className="control-label">Tenant:</span>
          <select 
            className="control-select"
            value={activeGymId}
            onChange={(e) => setActiveGymId(e.target.value)}
          >
            {gyms.map(g => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.city}) — {g.status}
              </option>
            ))}
          </select>
        </div>

        {/* Impersonation / View-As Quick Selector (Prompt Section 8) */}
        <div className="control-dropdown-group">
          <span className="control-label">View-As:</span>
          <select 
            className="control-select"
            value={isImpersonating ? impersonatedRole : 'none'}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'none') {
                exitViewAs();
              } else if (val === 'owner') {
                startViewAs('owner', ownerUser);
              } else if (val === 'manager') {
                startViewAs('manager', managerUser);
              } else if (val === 'trainer') {
                startViewAs('trainer', trainerArjun);
              } else if (val === 'receptionist') {
                startViewAs('receptionist', receptionistKavita);
              } else if (val === 'member_rahul') {
                startViewAs('member', memberRahul);
              } else if (val === 'member_priya') {
                startViewAs('member', memberPriya);
              }
            }}
          >
            <option value="none">Platform Super Admin</option>
            <option value="owner">Owner: {ownerUser?.name || 'Vikram Patel'}</option>
            <option value="manager">Manager: {managerUser?.name || "Sarah D'Souza"}</option>
            <option value="trainer">Trainer: {trainerArjun?.name || 'Arjun Mehta'} (Has Analytics Override)</option>
            <option value="receptionist">Reception: {receptionistKavita?.name || 'Kavita Nair'}</option>
            <option value="member_rahul">Member: {memberRahul?.name || 'Rahul Sharma'} (At Churn Risk)</option>
            <option value="member_priya">Member: {memberPriya?.name || 'Priya Sen'} (Active)</option>
          </select>
        </div>

        {/* White / Dark Theme Mode Switcher */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => {
            SoundEngine.playClick();
            toggleThemeMode();
            addToast(`Switched to ${themeMode === 'light' ? 'Dark' : 'Light (White)'} Mode`, 'info', 2000);
          }}
          title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to White (Light) Mode'}
          style={{ 
            padding: '5px 11px', 
            fontSize: '11px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            fontWeight: '600'
          }}
        >
          {themeMode === 'light' ? (
            <>
              <Sun size={13} style={{ color: '#f59e0b' }} />
              <span>White Mode</span>
            </>
          ) : (
            <>
              <Moon size={13} style={{ color: '#818cf8' }} />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Sound FX Toggle Button */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={toggleAudio}
          title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          style={{ padding: '5px 10px', fontSize: '11px', color: muted ? 'var(--text-muted)' : 'var(--primary)' }}
        >
          {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          <span>{muted ? 'Muted' : 'Audio ON'}</span>
        </button>

        {/* Reset Demo State Button */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={handleResetData}
          title="Reset all demo data back to initial state"
          style={{ padding: '5px 10px', fontSize: '11px' }}
        >
          <RotateCcw size={12} />
          <span>Reset Demo</span>
        </button>
      </div>
    </header>
  );
};
