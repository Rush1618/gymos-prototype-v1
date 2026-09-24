import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { LeadService } from '../../services/leadService';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Dumbbell, 
  Flame, 
  Users, 
  Clock, 
  MapPin, 
  Check, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  Mail,
  ChevronRight,
  X
} from 'lucide-react';

export const PublicWebsitePage = () => {
  const { activeGym, activeGymId, setActiveSurface, setActiveTab, refreshData, addToast } = useApp();
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialForm, setTrialForm] = useState({
    name: '',
    phone: '',
    email: '',
    goal: 'Hypertrophy & Strength'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const theme = activeGym.theme || {};

  const handleTrialSubmit = (e) => {
    e.preventDefault();
    if (!trialForm.name || !trialForm.phone) {
      addToast('Please provide your name and phone number', 'danger');
      return;
    }

    // Loop 1: Visitor -> Website -> Free Trial -> Lead in CRM!
    const newLead = LeadService.createLeadFromPublicWebsite({
      gymId: activeGymId,
      name: trialForm.name,
      phone: trialForm.phone,
      email: trialForm.email || `${trialForm.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      goal: trialForm.goal,
      source: 'Website Free Trial'
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // fallback if confetti canvas fails
    }

    setIsSubmitted(true);
    refreshData();
    addToast(`Free trial requested! Lead created in ${activeGym.name} CRM pipeline.`, 'success');
  };

  const handleResetModal = () => {
    setShowTrialModal(false);
    setIsSubmitted(false);
    setTrialForm({ name: '', phone: '', email: '', goal: 'Hypertrophy & Strength' });
  };

  return (
    <div style={{ background: theme.bgDark || '#0d0f12', minHeight: '100vh', color: theme.textMain || '#fff', fontFamily: theme.fontFamily }}>
      {/* Public Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 48px',
        borderBottom: `1px solid ${theme.borderColor || 'rgba(255, 87, 34, 0.2)'}`,
        background: 'rgba(10, 12, 16, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: '45px', // sits right under master bar
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            background: theme.primaryColor || '#ff5722',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            color: '#fff',
            boxShadow: `0 0 16px ${theme.primaryColor || '#ff5722'}`
          }}>
            {activeGym.logo || '⚡'}
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', margin: 0 }}>
              {activeGym.name}
            </h1>
            <span style={{ fontSize: '11px', color: theme.textMuted || '#94a3b8' }}>
              {activeGym.city} • {activeGym.area}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#memberships" style={{ color: theme.textMuted, textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Memberships</a>
          <a href="#classes" style={{ color: theme.textMuted, textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Classes</a>
          <a href="#trainers" style={{ color: theme.textMuted, textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Coaches</a>
          <a href="#facilities" style={{ color: theme.textMuted, textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Facility</a>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowTrialModal(true)}
            style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}
          >
            <Sparkles size={14} />
            <span>Claim Free Pass</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '80px 48px 100px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${theme.borderColor || 'rgba(255, 87, 34, 0.3)'}`,
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '24px',
          fontSize: '12px',
          fontWeight: '700',
          color: theme.primaryColor
        }}>
          <Flame size={14} />
          <span>Voted #1 Premium Athletic Facility in {activeGym.city}</span>
        </div>

        <h2 style={{
          fontSize: '52px',
          fontWeight: '900',
          letterSpacing: '-1.5px',
          lineHeight: '1.1',
          maxWidth: '920px',
          margin: '0 auto 20px',
          color: theme.textMain || '#fff'
        }}>
          {theme.heroHeadline || `Unleash Human Performance at ${activeGym.name}`}
        </h2>

        <p style={{
          fontSize: '18px',
          color: theme.textMuted || '#94a3b8',
          maxWidth: '680px',
          margin: '0 auto 36px',
          lineHeight: '1.6'
        }}>
          {theme.heroSubheadline || `State-of-the-art strength platforms, dynamic group conditioning, and dedicated biometric tracking in ${activeGym.city}.`}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => setShowTrialModal(true)}
            style={{ background: theme.primaryColor, borderColor: theme.primaryColor, boxShadow: `0 0 24px ${theme.primaryColor || '#ff5722'}55` }}
          >
            <Sparkles size={18} />
            <span>Book Your Free 3-Day Trial</span>
          </button>

          <button 
            className="btn btn-secondary btn-lg"
            onClick={() => {
              setActiveSurface('gymos');
              setActiveTab('leads');
            }}
          >
            <span>Staff Portal / CRM View</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Social Proof Bar */}
        <div style={{
          marginTop: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '36px',
          flexWrap: 'wrap',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--surface-border)'
        }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: theme.primaryColor }}>4.9 ★★★★★</div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Over 400+ Verified Reviews</div>
          </div>
          <div style={{ width: '1px', height: '30px', background: 'var(--surface-border)' }} />
          <div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>9,500 sq.ft</div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Olympic Calibrated Floor</div>
          </div>
          <div style={{ width: '1px', height: '30px', background: 'var(--surface-border)' }} />
          <div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>24/7</div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Biometric & QR Pass Access</div>
          </div>
        </div>
      </section>

      {/* Memberships Section */}
      <section id="memberships" style={{ padding: '80px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h3 style={{ fontSize: '32px', fontWeight: '800' }}>Transparent Membership Tiers</h3>
          <p style={{ color: theme.textMuted, fontSize: '14px', marginTop: '6px' }}>
            No hidden maintenance fees. All memberships include mobile QR pass & assessments.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="glass-card" style={{ background: theme.bgCard }}>
            <span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: '700', textTransform: 'uppercase' }}>Flexible Monthly</span>
            <h4 style={{ fontSize: '22px', fontWeight: '800', marginTop: '4px' }}>1-Month Standard</h4>
            <div style={{ fontSize: '32px', fontWeight: '900', margin: '14px 0' }}>₹3,500 <span style={{ fontSize: '14px', color: theme.textMuted }}>/ month</span></div>
            <p style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '20px' }}>Full gym floor access, steam, shower and general training orientation.</p>
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', marginBottom: '20px' }}
              onClick={() => setShowTrialModal(true)}
            >
              Start 1-Month
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={14} color="#10b981" /> Full Gym Floor Access</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={14} color="#10b981" /> Steam Room & Shower</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={14} color="#10b981" /> Mobile Digital Pass</div>
            </div>
          </div>

          <div className="glass-card" style={{ background: theme.bgCard, border: `2px solid ${theme.primaryColor}`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: theme.primaryColor, color: '#fff', fontSize: '10px', fontWeight: '800', padding: '3px 12px', borderRadius: '12px', textTransform: 'uppercase' }}>
              Most Popular In Bandra
            </div>
            <span style={{ fontSize: '11px', color: theme.primaryColor, fontWeight: '700', textTransform: 'uppercase' }}>Full Commitment</span>
            <h4 style={{ fontSize: '22px', fontWeight: '800', marginTop: '4px' }}>12-Month Elite Pro</h4>
            <div style={{ fontSize: '32px', fontWeight: '900', margin: '14px 0' }}>₹24,000 <span style={{ fontSize: '14px', color: theme.textMuted }}>/ year</span></div>
            <p style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '20px' }}>All-inclusive access to all classes, coach onboarding, and AI workout logs.</p>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginBottom: '20px', background: theme.primaryColor, borderColor: theme.primaryColor }}
              onClick={() => setShowTrialModal(true)}
            >
              Join Elite Pro
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={14} color="#10b981" /> All Group Classes Included</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={14} color="#10b981" /> 4 Personal Training Sessions</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={14} color="#10b981" /> 24/7 AI Member Coach</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={14} color="#10b981" /> 2 Guest Passes Per Month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities & Atmosphere */}
      <section id="facilities" style={{ padding: '60px 48px', maxWidth: '1200px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '28px', fontWeight: '800' }}>Engineered For Human Greatness</h3>
          <p style={{ color: theme.textMuted, fontSize: '13px' }}>Every square foot is calibrated for biomechanics and focus.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Olympic Lifting Platforms</h4>
            <p style={{ fontSize: '12px', color: theme.textMuted }}>8 dedicated Eleiko drop platforms with calibrated bumper plates.</p>
          </div>
          <div style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Indoor Turf & Sled Track</h4>
            <p style={{ fontSize: '12px', color: theme.textMuted }}>30-meter high-density turf for sprint mechanics, sled pushes, and farmer walks.</p>
          </div>
          <div style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Infrared Recovery Sauna</h4>
            <p style={{ fontSize: '12px', color: theme.textMuted }}>Full recovery suite with Himalayan salt infrared sauna and contrast tubs.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 48px', borderTop: '1px solid var(--surface-border)', textAlign: 'center', fontSize: '12px', color: theme.textMuted }}>
        <p>© {new Date().getFullYear()} {activeGym.name}. Powered by <strong>GymOS Agency Architecture</strong>.</p>
      </footer>

      {/* Free Trial Lead Modal (Loop 1: Visitor -> Lead Capture) */}
      {showTrialModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Claim 3-Day Complimentary Pass</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Experience {activeGym.name}'s equipment, classes, and coaching.
                </p>
              </div>
              <button onClick={handleResetModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleTrialSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={trialForm.name}
                      onChange={(e) => setTrialForm({ ...trialForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">WhatsApp / Phone Number *</label>
                    <input 
                      type="tel" 
                      className="form-input"
                      required
                      placeholder="+91 98200 00000"
                      value={trialForm.phone}
                      onChange={(e) => setTrialForm({ ...trialForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address (Optional)</label>
                    <input 
                      type="email" 
                      className="form-input"
                      placeholder="ananya@gmail.com"
                      value={trialForm.email}
                      onChange={(e) => setTrialForm({ ...trialForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Fitness Goal</label>
                    <select 
                      className="form-select"
                      value={trialForm.goal}
                      onChange={(e) => setTrialForm({ ...trialForm, goal: e.target.value })}
                    >
                      <option value="Hypertrophy & Strength">Hypertrophy & Strength</option>
                      <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                      <option value="Mobility & Athletic Longevity">Mobility & Athletic Longevity</option>
                      <option value="Powerlifting & Heavy Barbells">Powerlifting & Heavy Barbells</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleResetModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ background: theme.primaryColor, borderColor: theme.primaryColor }}>
                    Submit Free Trial Request
                  </button>
                </div>
              </form>
            ) : (
              <div className="modal-body" style={{ textAlign: 'center', padding: '36px 20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Free Trial Pass Reserved!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '400px', margin: '0 auto 20px' }}>
                  Thank you <strong>{trialForm.name}</strong>. Our front desk coach at {activeGym.name} has received your request in our CRM and will WhatsApp you within 2 hours.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      handleResetModal();
                      setActiveSurface('gymos');
                      setActiveTab('leads');
                    }}
                  >
                    <span>View In Owner CRM Pipeline</span>
                    <ArrowRight size={14} />
                  </button>
                  <button className="btn btn-secondary" onClick={handleResetModal}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
