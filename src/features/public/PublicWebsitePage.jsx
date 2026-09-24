import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { LeadService } from '../../services/leadService';
import { SoundEngine } from '../../utils/audio';
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
  ChevronDown,
  X,
  Zap,
  Activity,
  Award,
  Calendar,
  Volume2
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

  // Interactive Membership Calculator State (Framer-tier interaction)
  const [durationMonths, setDurationMonths] = useState(12);
  const [includePT, setIncludePT] = useState(false);

  // Interactive Class Filter State
  const [classFilter, setClassFilter] = useState('All');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const theme = activeGym.theme || {};

  // Pricing calculation
  const getMonthlyRate = (months) => {
    switch (months) {
      case 1: return 3500;
      case 3: return 3000;
      case 6: return 2500;
      case 12: return 2000;
      default: return 2000;
    }
  };

  const baseMonthly = getMonthlyRate(durationMonths);
  const ptAddon = includePT ? 1500 : 0;
  const effectiveMonthly = baseMonthly + ptAddon;
  const totalAmount = effectiveMonthly * durationMonths;
  const standardAnnualTotal = (3500 + ptAddon) * durationMonths;
  const savings = standardAnnualTotal - totalAmount;

  const handleTrialSubmit = (e) => {
    e.preventDefault();
    if (!trialForm.name || !trialForm.phone) {
      addToast('Please provide your name and phone number', 'danger');
      return;
    }

    SoundEngine.playSuccessChime();

    // Loop 1: Visitor -> Website -> Free Trial -> Lead in CRM!
    LeadService.createLeadFromPublicWebsite({
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
    } catch (err) {}

    setIsSubmitted(true);
    refreshData();
    addToast(`Free trial requested! Lead created in ${activeGym.name} CRM pipeline.`, 'success');
  };

  const handleResetModal = () => {
    setShowTrialModal(false);
    setIsSubmitted(false);
    setTrialForm({ name: '', phone: '', email: '', goal: 'Hypertrophy & Strength' });
  };

  // Mock interactive classes for schedule section
  const sampleClasses = [
    { id: 'c1', title: 'Olympic Snatch & Clean Workshop', coach: 'Arjun Mehta', time: '07:00 AM - 08:15 AM', type: 'Strength', spots: 3, badge: 'Popular' },
    { id: 'c2', title: 'VO2 Max MetCon & Sled Drills', coach: 'Maya Sen', time: '09:00 AM - 10:00 AM', type: 'HIIT', spots: 5, badge: 'High Burn' },
    { id: 'c3', title: 'Infrared Mobility & Contrast Therapy', coach: 'Dr. Kabir Roy', time: '05:30 PM - 06:30 PM', type: 'Recovery', spots: 2, badge: 'Relax' },
    { id: 'c4', title: 'Heavy Barbell Hypertrophy Squad', coach: 'Arjun Mehta', time: '07:00 PM - 08:30 PM', type: 'Strength', spots: 4, badge: 'Advanced' }
  ];

  const filteredClasses = classFilter === 'All' 
    ? sampleClasses 
    : sampleClasses.filter(c => c.type === classFilter);

  const faqs = [
    {
      q: `How does digital turnstile access work at ${activeGym.name}?`,
      a: "Upon joining, you immediately receive a holographic dynamic QR pass in your Member Portal. Simply scan your phone screen or tap NFC at the entryway turnstiles for instant, 24/7 keyless admission."
    },
    {
      q: "Are the Olympic platforms open for drop-ins during peak hours?",
      a: "Yes! We maintain 8 dedicated Eleiko drop platforms with calibrated competition plates. Our real-time floor capacity monitor keeps floor traffic balanced so you never have to wait for a rack."
    },
    {
      q: "What is included with the 3-Day Complimentary Trial?",
      a: "Your 3-day pass includes unlimited floor access, all group conditioning classes, recovery sauna privileges, and a 30-minute 1-on-1 movement screening with Head Coach Arjun Mehta."
    },
    {
      q: "Can I freeze or pause my membership if I travel?",
      a: "Absolutely. All 6-month and 12-month memberships include up to 60 days of complimentary travel freeze, handled with 1 click directly in your Member Portal."
    }
  ];

  return (
    <div style={{ 
      background: theme.bgDark || '#0d0f12', 
      minHeight: '100vh', 
      color: theme.textMain || '#fff', 
      fontFamily: theme.fontFamily || 'var(--brand-font)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Framer-grade Ambient Glow Orbs */}
      <div className="glow-orb" style={{ top: '150px', left: '-100px', width: '450px', height: '450px', background: theme.primaryColor || '#ff5722' }} />
      <div className="glow-orb" style={{ top: '650px', right: '-120px', width: '500px', height: '500px', background: '#3b82f6' }} />
      <div className="glow-orb" style={{ top: '1800px', left: '20%', width: '600px', height: '600px', background: theme.primaryColor || '#ff5722' }} />

      {/* Public Sticky Glass Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 48px',
        borderBottom: `1px solid ${theme.borderColor || 'rgba(255, 87, 34, 0.2)'}`,
        background: 'rgba(10, 12, 16, 0.88)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: '45px', // under master bar
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
            boxShadow: `0 0 18px ${theme.primaryColor || '#ff5722'}88`
          }}>
            {activeGym.logo || '⚡'}
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '-0.5px', margin: 0 }}>
              {activeGym.name}
            </h1>
            <span style={{ fontSize: '11px', color: theme.textMuted || '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={11} /> {activeGym.city} • {activeGym.area}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#memberships" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'color 0.2s' }}>Pricing</a>
          <a href="#classes" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'color 0.2s' }}>Classes</a>
          <a href="#coaches" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'color 0.2s' }}>Head Coaches</a>
          <a href="#faq" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', fontWeight: '600', transition: 'color 0.2s' }}>FAQ</a>

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => {
              SoundEngine.playClick();
              setShowTrialModal(true);
            }}
            style={{ 
              background: theme.primaryColor, 
              borderColor: theme.primaryColor,
              boxShadow: `0 0 16px ${theme.primaryColor || '#ff5722'}66`
            }}
          >
            <Sparkles size={14} />
            <span>Claim Free Pass</span>
          </button>
        </div>
      </nav>

      {/* Hero Section with Photorealistic Gym Visual Banner */}
      <section style={{
        position: 'relative',
        padding: '100px 48px 120px',
        maxWidth: '1280px',
        margin: '0 auto',
        textAlign: 'center',
        zIndex: 1
      }}>
        {/* Background Visual Card Frame */}
        <div style={{
          position: 'absolute',
          inset: '20px 20px 0 20px',
          borderRadius: 'var(--radius-xl)',
          backgroundImage: 'linear-gradient(180deg, rgba(13,15,18,0.72) 0%, rgba(13,15,18,0.96) 90%), url("./images/gym-hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 80px rgba(0,0,0,0.8)',
          zIndex: -1
        }} />

        <div style={{ padding: '30px 20px' }}>
          {/* Live Telemetry Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${theme.borderColor || 'rgba(255, 87, 34, 0.35)'}`,
            padding: '7px 20px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '26px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: '#10b981', 
              boxShadow: '0 0 10px #10b981',
              display: 'inline-block',
              animation: 'pulseGlow 2s infinite'
            }} />
            <span>42 Athletes Currently Training • Turnstiles Online 24/7</span>
          </div>

          <h2 style={{
            fontSize: '56px',
            fontWeight: '900',
            letterSpacing: '-1.8px',
            lineHeight: '1.08',
            maxWidth: '960px',
            margin: '0 auto 24px',
            color: '#ffffff',
            textShadow: '0 4px 24px rgba(0,0,0,0.7)'
          }}>
            {theme.heroHeadline || `Unleash Human Peak Performance at ${activeGym.name}`}
          </h2>

          <p style={{
            fontSize: '19px',
            color: '#cbd5e1',
            maxWidth: '720px',
            margin: '0 auto 40px',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            {theme.heroSubheadline || `Olympic calibrated Eleiko platforms, high-density sprint turf, contrast therapy tubs, and automated keyless QR access in ${activeGym.city}.`}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => {
                SoundEngine.playClick();
                setShowTrialModal(true);
              }}
              style={{ 
                background: theme.primaryColor, 
                borderColor: theme.primaryColor, 
                boxShadow: `0 0 32px ${theme.primaryColor || '#ff5722'}77`,
                padding: '16px 36px',
                fontSize: '16px'
              }}
            >
              <Sparkles size={20} />
              <span>Claim Free 3-Day Pass</span>
            </button>

            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => {
                SoundEngine.playClick();
                setActiveSurface('member');
                setActiveTab('qr_pass');
              }}
              style={{
                backdropFilter: 'blur(12px)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '16px 30px',
                fontSize: '15px'
              }}
            >
              <Zap size={18} color="#ffd600" />
              <span>Simulate Member Digital QR Pass</span>
            </button>
          </div>

          {/* Social Proof Metric Bar */}
          <div style={{
            marginTop: '70px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            padding: '24px 32px',
            background: 'rgba(10, 12, 16, 0.75)',
            backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '880px',
            margin: '70px auto 0'
          }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: theme.primaryColor || '#ff5722', letterSpacing: '-0.5px' }}>4.97 ★★★★★</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>420+ Google Reviews</div>
            </div>
            <div style={{ width: '1px', height: '36px', background: 'rgba(255, 255, 255, 0.12)' }} />
            <div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.5px' }}>8 Platforms</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>Eleiko Calibrated Rig</div>
            </div>
            <div style={{ width: '1px', height: '36px', background: 'rgba(255, 255, 255, 0.12)' }} />
            <div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#00e5ff', letterSpacing: '-0.5px' }}>100% Keyless</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>Turnstile QR & NFC Pass</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Framer-Grade Membership Pricing Calculator */}
      <section id="memberships" style={{ padding: '80px 48px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span className="badge badge-info" style={{ marginBottom: '12px', fontSize: '11px', letterSpacing: '1px' }}>
            TRANSPARENT PRICING CALCULATOR
          </span>
          <h3 style={{ fontSize: '38px', fontWeight: '900', letterSpacing: '-1px' }}>
            Choose Your Commitment Level
          </h3>
          <p style={{ color: theme.textMuted, fontSize: '15px', marginTop: '8px' }}>
            Slide duration to unlock progressive loyalty pricing. No joiner fees, no hidden maintenance.
          </p>
        </div>

        {/* Interactive Pricing Card Box */}
        <div className="glass-card" style={{ 
          maxWidth: '920px', 
          margin: '0 auto', 
          padding: '40px', 
          border: `2px solid ${theme.borderColor || 'rgba(255, 87, 34, 0.3)'}`,
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}>
          {/* Duration Selector Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {[1, 3, 6, 12].map(m => (
              <button
                key={m}
                onClick={() => {
                  SoundEngine.playClick();
                  setDurationMonths(m);
                }}
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-full)',
                  border: durationMonths === m ? `2px solid ${theme.primaryColor}` : '1px solid var(--surface-border)',
                  background: durationMonths === m ? 'rgba(255, 87, 34, 0.15)' : 'var(--bg-dark)',
                  color: durationMonths === m ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: durationMonths === m ? '800' : '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{m} {m === 1 ? 'Month' : 'Months'}</span>
                {m === 12 && (
                  <span style={{ fontSize: '10px', background: theme.primaryColor, color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>
                    SAVE 42%
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Interactive Range Slider */}
          <div style={{ marginBottom: '32px', padding: '0 10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Flexible (1 Month)</span>
              <span>Dedicated (6 Months)</span>
              <span style={{ color: theme.primaryColor, fontWeight: '700' }}>Annual Elite (12 Months)</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="12" 
              step="1"
              value={durationMonths}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                // snap to 1, 3, 6, 12
                if (val <= 2) setDurationMonths(1);
                else if (val <= 4) setDurationMonths(3);
                else if (val <= 9) setDurationMonths(6);
                else setDurationMonths(12);
              }}
              className="framer-slider"
            />
          </div>

          {/* Calculator Output Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '30px', 
            paddingTop: '24px', 
            borderTop: '1px solid var(--surface-border)',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Effective Monthly Investment
              </div>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#ffffff', letterSpacing: '-1.5px', margin: '6px 0' }}>
                ₹{effectiveMonthly.toLocaleString()} <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: '500' }}>/ month</span>
              </div>
              
              <div style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                <Check size={16} /> Total Contract: ₹{totalAmount.toLocaleString()} ({durationMonths} Months)
              </div>
              {savings > 0 && (
                <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px', fontWeight: '600' }}>
                  ⚡ You save ₹{savings.toLocaleString()} compared to month-to-month rate!
                </div>
              )}

              {/* Personal Training Add-on Checkbox */}
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                marginTop: '20px', 
                cursor: 'pointer',
                padding: '10px 14px',
                background: includePT ? 'rgba(255, 87, 34, 0.1)' : 'var(--bg-dark)',
                border: `1px solid ${includePT ? theme.primaryColor : 'var(--surface-border)'}`,
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s'
              }}>
                <input 
                  type="checkbox" 
                  checked={includePT}
                  onChange={(e) => {
                    SoundEngine.playClick();
                    setIncludePT(e.target.checked);
                  }}
                  style={{ width: '16px', height: '16px', accentColor: theme.primaryColor }}
                />
                <span style={{ fontSize: '13px', fontWeight: '600' }}>
                  Include 4x Monthly 1-on-1 PT Sessions (+₹1,500/mo)
                </span>
              </label>
            </div>

            <div style={{ background: 'var(--bg-dark)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: theme.primaryColor }}>
                All Memberships Include:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Check size={16} color="#10b981" /> 
                  <span>24/7 Turnstile QR & NFC Keyless Pass</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Check size={16} color="#10b981" /> 
                  <span>Unlimited High-Performance Floor & Platform Access</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Check size={16} color="#10b981" /> 
                  <span>Infrared Sauna & Contrast Cold Tub Privileges</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Check size={16} color="#10b981" /> 
                  <span>AI Workout & Nutrition Log in Member Portal</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Check size={16} color="#10b981" /> 
                  <span>Complimentary Travel Freeze (Up to 60 Days)</span>
                </div>
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => {
                  SoundEngine.playClick();
                  setShowTrialModal(true);
                }}
                style={{ 
                  width: '100%', 
                  marginTop: '22px', 
                  background: theme.primaryColor, 
                  borderColor: theme.primaryColor,
                  padding: '12px'
                }}
              >
                Join Now with {durationMonths}-Month Pass
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Head Coaches Spotlight (Featuring Arjun Mehta portrait) */}
      <section id="coaches" style={{ padding: '80px 48px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '12px', fontSize: '11px', letterSpacing: '1px' }}>
            ELITE PEDAGOGY & COACHING
          </span>
          <h3 style={{ fontSize: '38px', fontWeight: '900', letterSpacing: '-1px' }}>
            Guided By Master Strength Practitioners
          </h3>
          <p style={{ color: theme.textMuted, fontSize: '15px', marginTop: '8px' }}>
            Every trainer is CSCS or Olympic certified. Zero generic fitness influencer advice.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {/* Head Coach Arjun Mehta Card */}
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: `1px solid ${theme.primaryColor || '#ff5722'}55` }}>
            <div style={{ height: '320px', position: 'relative', overflow: 'hidden' }}>
              <img 
                src="./images/trainer-arjun.jpg" 
                alt="Head Coach Arjun Mehta"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(180deg, transparent 40%, rgba(21, 25, 33, 0.95) 100%)' 
              }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
                <span className="badge badge-success" style={{ marginBottom: '6px' }}>Head Coach & Founder</span>
                <h4 style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>Arjun Mehta, CSCS</h4>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Olympic Lifting & Hypertrophy Specialist</span>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '18px' }}>
                Former national-level weightlifter with 9+ years coaching powerlifters, field athletes, and executive clients to peak body composition.
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <span className="badge badge-info" style={{ fontSize: '10px' }}>Barbell Mechanics</span>
                <span className="badge badge-info" style={{ fontSize: '10px' }}>Periodization</span>
                <span className="badge badge-info" style={{ fontSize: '10px' }}>Mobility Rehab</span>
              </div>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  SoundEngine.playClick();
                  setShowTrialModal(true);
                }}
                style={{ width: '100%', borderColor: theme.primaryColor, color: theme.primaryColor }}
              >
                Schedule Assessment with Arjun
              </button>
            </div>
          </div>

          {/* Coach Maya Sen Card */}
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '320px', position: 'relative', overflow: 'hidden' }}>
              <img 
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80" 
                alt="Coach Maya Sen"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(180deg, transparent 40%, rgba(21, 25, 33, 0.95) 100%)' 
              }} />
              <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
                <span className="badge badge-warning" style={{ marginBottom: '6px' }}>Conditioning Director</span>
                <h4 style={{ fontSize: '24px', fontWeight: '900', color: '#fff' }}>Maya Sen</h4>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>VO2 Max & Athletic Conditioning</span>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '18px' }}>
                Specializes in energy system development, sled sprint mechanics, and injury-prevention protocols for endurance and team sport athletes.
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <span className="badge badge-info" style={{ fontSize: '10px' }}>HIIT & MetCon</span>
                <span className="badge badge-info" style={{ fontSize: '10px' }}>VO2 Max Protocols</span>
                <span className="badge badge-info" style={{ fontSize: '10px' }}>Kettlebell Flow</span>
              </div>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  SoundEngine.playClick();
                  setShowTrialModal(true);
                }}
                style={{ width: '100%' }}
              >
                Schedule Assessment with Maya
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Class Schedule with Filter Tabs */}
      <section id="classes" style={{ padding: '80px 48px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="badge badge-warning" style={{ marginBottom: '10px', fontSize: '11px', letterSpacing: '1px' }}>
              DAILY PERFORMANCE SESSIONS
            </span>
            <h3 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-1px' }}>
              Mastery Class Schedule
            </h3>
            <p style={{ color: theme.textMuted, fontSize: '14px', marginTop: '6px' }}>
              Capped at 12 athletes per session for meticulous coach correction.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-dark)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
            {['All', 'Strength', 'HIIT', 'Recovery'].map(type => (
              <button
                key={type}
                onClick={() => {
                  SoundEngine.playClick();
                  setClassFilter(type);
                }}
                style={{
                  background: classFilter === type ? 'var(--primary)' : 'transparent',
                  color: classFilter === type ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredClasses.map(cls => (
            <div key={cls.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-info" style={{ fontSize: '10px' }}>{cls.type}</span>
                  <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '700' }}>⚡ {cls.spots} Spots Left</span>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', lineHeight: '1.3', marginBottom: '8px' }}>{cls.title}</h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Clock size={13} /> {cls.time}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={13} /> Coach: {cls.coach}
                </div>
              </div>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  SoundEngine.playClick();
                  setShowTrialModal(true);
                }}
                style={{ marginTop: '20px', width: '100%' }}
              >
                Reserve Free Guest Slot
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section id="faq" style={{ padding: '80px 48px', maxWidth: '880px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h3 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.5px' }}>
            Frequently Asked Questions
          </h3>
          <p style={{ color: theme.textMuted, fontSize: '14px', marginTop: '6px' }}>
            Everything you need to know about our technology, memberships, and facility rules.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="glass-card" 
                style={{ 
                  padding: '20px 24px', 
                  cursor: 'pointer',
                  border: isOpen ? `1px solid ${theme.primaryColor || '#ff5722'}` : '1px solid var(--surface-border)'
                }}
                onClick={() => {
                  SoundEngine.playClick();
                  setOpenFaq(isOpen ? null : index);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: isOpen ? theme.primaryColor : '#ffffff' }}>
                    {faq.q}
                  </h4>
                  {isOpen ? <ChevronDown size={18} color={theme.primaryColor} /> : <ChevronRight size={18} color="var(--text-muted)" />}
                </div>

                {isOpen && (
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '14px', marginBottom: 0 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '48px 48px', 
        borderTop: '1px solid var(--surface-border)', 
        background: 'rgba(10, 12, 16, 0.95)',
        textAlign: 'center', 
        fontSize: '13px', 
        color: theme.textMuted,
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: theme.primaryColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
            {activeGym.logo || '⚡'}
          </div>
          <strong style={{ color: '#fff', fontSize: '15px' }}>{activeGym.name}</strong>
        </div>
        <p style={{ maxWidth: '500px', margin: '0 auto 16px', fontSize: '12px', lineHeight: '1.5' }}>
          High-performance physical training infrastructure powered by <strong>GymOS Agency Multi-Tenant Engine</strong>.
        </p>
        <p style={{ fontSize: '11px', color: '#64748b' }}>
          © {new Date().getFullYear()} {activeGym.name}. All rights reserved. Remote Agency Deployment Active.
        </p>
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
              <button 
                onClick={handleResetModal} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
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
