import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info,
  HelpCircle,
  Zap,
  ChevronRight,
  Settings,
  Mail,
  History,
  Trash2,
  Clock,
  User,
  LayoutDashboard,
  Sparkles,
  Calendar,
  Link2,
  Milestone,
  FileText,
  ClipboardList,
  FileUp,
  Mic,
  Send,
  AlertCircle,
  Download,
  FileJson,
  MapPin,
  Shield,
  BarChart3,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import type { ActionItem } from './lib/gemini';
import { extractActionItems } from './lib/gemini';
import { ruleBasedExtraction, generateRuleBasedSummary } from './lib/ruleEngine';

// --- IMAGE ASSETS (LINKED TO PUBLIC FOLDER) ---
const GUIDE_STEP_1 = "zerion_guide_step1_input_1772475477275.png";
const GUIDE_STEP_2 = "zerion_guide_step2_analysis_1772475496731.png";
const GUIDE_STEP_3 = "zerion_guide_step3_results_1772475515564.png";

// --- COMPONENTS ---

const Logo = ({ size = 32, className = "", style = {}, theme = "dark" }: { size?: number, className?: string, style?: any, theme?: string }) => {
  const brandShadow = theme === 'dark'
    ? 'drop-shadow(0 0 10px rgba(255, 140, 0, 0.5))'
    : 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.4))';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ ...style, filter: brandShadow }}
    >
      <g transform="translate(50, 50)">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              d="M-4 -12 L4 -12 L6 -28 L0 -34 L-6 -28 Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <line x1="-3" y1="-18" x2="3" y2="-18" stroke="currentColor" strokeWidth="1.2" />
            <line x1="0" y1="-12" x2="0" y2="-34" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4 -12 L10 0" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
            <circle cx="0" cy="-38" r="3.2" fill="var(--background)" stroke="currentColor" strokeWidth="1.8" />
          </g>
        ))}
        <circle cx="0" cy="0" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
        <circle cx="0" cy="0" r="1.5" fill="currentColor" />
      </g>
    </svg>
  );
};

const ExtractorView = ({ transcript, setTranscript, onProcess, loading, results, error, onFileUpload, summary, theme }: any) => {
  const exportToCSV = () => {
    const headers = ["Task", "Owner", "Deadline", "Priority", "Status"];
    const rows = results.map((item: any) => [
      `"${item.task}"`,
      `"${item.owner}"`,
      `"${item.deadline}"`,
      `"${item.priority || 'Medium'}"`,
      '"Pending"'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((e: any) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "zerion_action_items.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="container view-section" style={{ maxWidth: '1400px' }}>
      {/* Tool Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Meeting <span className="gradient-text">Studio</span></h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Transform your raw transcripts into actionable intelligence instantly.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: results.length > 0 ? '450px 1fr' : '1fr', gap: '4rem', alignItems: 'start' }}>

        {/* Left Side: Input Studio */}
        <div className="flex-column" style={{ gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', margin: '1rem', border: '0px solid var(--primary)' }}>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 140, 0, 0.1)', padding: '10px', borderRadius: '12px' }}>
                <ClipboardList size={22} className="text-primary" />
              </div>
              Input Source
            </h3>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <label className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', cursor: 'pointer', fontSize: '0.85rem', padding: '1rem' }}>
                <FileUp size={18} /> Upload .txt
                <input type="file" accept=".txt" hidden onChange={onFileUpload} />
              </label>
              <label className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', cursor: 'pointer', fontSize: '0.85rem', padding: '1rem' }}>
                <Mic size={18} /> Audio
              </label>
            </div>

            <textarea
              className="input-field"
              style={{ minHeight: '400px', fontSize: '0.95rem', lineHeight: '1.6' }}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting notes, Zoom transcripts, or upload a text file..."
            />

            <div style={{ marginTop: '2.5rem' }}>
              <button className="btn btn-primary" style={{ width: '100%', padding: '1.4rem', fontSize: '1rem' }} onClick={onProcess} disabled={loading || !transcript.trim()}>
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Zap size={20} />
                  </motion.div>
                ) : (
                  <>Begin Intelligence Extraction <Send size={20} /></>
                )}
              </button>
            </div>
            {error && <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,68,68,0.1)', borderRadius: '12px', color: '#ff4444', display: 'flex', gap: '0.8rem', alignItems: 'center', fontSize: '0.9rem' }}><AlertCircle size={18} />{error}</div>}
          </div>

          {/* Tips Card */}
          <div className="glass-panel" style={{ margin: '1rem', padding: '2rem', background: 'var(--card-bg)', border: '1px dashed var(--border-subtle)' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--primary)' }}>Pro Tips</h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>Ensure transcript includes speaker names for better ownership detection.</li>
              <li>Mention dates clearly (e.g., "by next Friday").</li>
              <li>Use the Gemini 2.5 Flash model in Settings for highest accuracy.</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Results Dashboard */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="flex-column" style={{ gap: '2.5rem' }}>

              {/* Summary Card */}
              <div className="glass-panel" style={{ padding: '2rem', margin: '1rem', borderLeft: '0px solid var(--primary)' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <div style={{ background: 'rgba(255, 140, 0, 0.1)', padding: '12px', borderRadius: '14px', display: 'flex' }}>
                    <FileText size={24} className="text-primary" />
                  </div>
                  Meeting Intelligence Summary
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.9', fontSize: '1.1rem', background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {summary}
                </p>
              </div>

              {/* Action Items Dashboard */}
              <div className="glass-panel" style={{ padding: '2rem', margin: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{ background: 'rgba(255, 140, 0, 0.15)', padding: '12px', borderRadius: '14px', display: 'flex' }}>
                      <LayoutDashboard size={28} style={{ color: 'var(--primary)' }} />
                    </div>
                    Intelligence Dashboard
                  </h2>
                  <div style={{ display: 'flex', gap: '1.2rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }} onClick={exportToCSV}>
                      <Download size={20} /> CSV
                    </button>
                    <button className="btn btn-outline" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }} onClick={() => navigator.clipboard.writeText(JSON.stringify(results, null, 2))}>
                      <FileJson size={20} /> JSON
                    </button>
                  </div>
                </div>

                <div className="table-container" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 1rem' }}>
                    <thead>
                      <tr style={{ color: '#666', fontSize: '0.9rem', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>Action Description</th>
                        <th style={{ padding: '1rem' }}>Participant</th>
                        <th style={{ padding: '1rem' }}>Deadline</th>
                        <th style={{ padding: '1rem' }}>ML Confidence</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((item: any, idx: number) => (
                        <tr key={idx} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
                          <td style={{ padding: '1.2rem', fontWeight: 600, fontSize: '1.05rem', borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }}>{item.task}</td>
                          <td style={{ padding: '1.2rem' }}>
                            <span className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.7rem', color: 'var(--text-muted)' }}><User size={16} /> {item.owner}</span>
                          </td>
                          <td style={{ padding: '1.2rem' }}>
                            <span className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.7rem', color: 'var(--text-muted)' }}><Clock size={16} /> {item.deadline}</span>
                          </td>
                          <td style={{ padding: '1.2rem', width: '200px' }}>
                            <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.confidence || 0.85) * 100}%` }}
                                style={{
                                  height: '100%',
                                  background: (item.confidence || 0.85) > 0.8 ? 'var(--secondary)' : 'var(--primary)',
                                  boxShadow: (theme === 'dark' ? '0 0 15px rgba(0, 242, 255, 0.4)' : 'none')
                                }}
                              />
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 800 }}>{Math.round((item.confidence || 0.85) * 100)}% Match</div>
                          </td>
                          <td style={{ padding: '1.2rem', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}>
                            <span style={{
                              background: item.priority === 'High' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(0, 242, 255, 0.1)',
                              color: item.priority === 'High' ? '#ff4444' : 'var(--primary)',
                              padding: '6px 16px',
                              borderRadius: '30px',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              {item.priority === 'High' ? 'Priority' : 'Scheduled'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Integrations */}
              <div className="glass-panel" style={{ padding: '2rem', margin: '1rem', background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.05), transparent)', border: '1px solid rgba(255, 140, 0, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div style={{ background: 'rgba(255, 140, 0, 0.1)', padding: '14px', borderRadius: '16px' }}>
                    <Sparkles size={28} style={{ color: 'var(--secondary)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem' }}>Ecosystem Connect</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Push your intelligence data to the tools you use every day.</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  <motion.button whileHover={{ scale: 1.02 }} className="btn btn-outline" style={{ padding: '1.8rem', justifyContent: 'center', background: 'var(--card-bg)' }}>
                    <Calendar size={20} /> Add to Google Calendar
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} className="btn btn-outline" style={{ padding: '1.8rem', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <Link2 size={20} /> Delegate via Slack
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} className="btn btn-outline" style={{ padding: '1.8rem', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                    <Milestone size={20} /> Synchronize with Jira
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const SettingsView = ({ apiKey, setApiKey, selectedModel, setSelectedModel, useMockMode, setUseMockMode, customModel, setCustomModel, theme, setTheme }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container view-section" style={{ maxWidth: '800px' }}>
    <div className="glass-panel" style={{ padding: '2rem', margin: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="flex-center" style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255, 140, 0, 0.1)', color: 'var(--primary)' }}>
          <Settings size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.8rem' }}>Configuration Studio</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tailor the AI experience to your project needs.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Theme Section */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              {theme === 'dark' ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
              Appearance Mode
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Switch between Dark and Light aesthetics.</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={theme === 'light'}
              onChange={(e) => setTheme(e.target.checked ? 'light' : 'dark')}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Simulation Section */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Zap size={18} className="text-primary" />
              Simulation Mode
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Use mock data instead of real AI calls.</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={useMockMode}
              onChange={(e) => setUseMockMode(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Model Section */}
        <div className="glass-card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <BarChart3 size={18} className="text-primary" />
            AI Model Engine
          </h4>
          <select
            className="input-field"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (AI Engine)</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            <option value="rule-engine">Phase 1: Rule Engine (Pattern-based)</option>
            <option value="custom">Custom Implementation ID</option>
          </select>
          {selectedModel === 'custom' && (
            <input
              className="input-field"
              style={{ marginTop: '1rem' }}
              placeholder="Enter Custom Model ID"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
            />
          )}
        </div>

        {/* API Credentials */}
        <div className="glass-card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Shield size={18} className="text-primary" />
            Security Credentials
          </h4>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              className="input-field"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="VITE_GEMINI_API_KEY"
            />
            <div style={{ position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
              <Mail size={18} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.8rem', paddingLeft: '0.5rem' }}>
            * Your key is only used locally for processing transcripts.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);


const Navbar = ({ activeView, setActiveView, theme }: { activeView: string, setActiveView: (v: string) => void, theme: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container flex-center" style={{ justifyContent: 'space-between' }}>
        <div className="flex-center" style={{ gap: '0.8rem', cursor: 'pointer' }} onClick={() => { setActiveView('home'); setMenuOpen(false); }}>
          <div className="flex-center" style={{ width: 42, height: 42 }}>
            <Logo size={40} className="text-primary" theme={theme} />
          </div>
          <h1 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
            Zer<span className="gradient-text">ion</span>
          </h1>
        </div>

        <ul className={`nav-links ${menuOpen ? 'mobile-show' : ''}`}>
          {[
            { id: 'home', label: 'Home', icon: <Info size={16} /> },
            { id: 'guide', label: 'How to Use', icon: <HelpCircle size={16} /> },
            { id: 'backend', label: 'BackEnd Works', icon: <Sparkles size={16} /> },
            { id: 'tool', label: 'Tool', icon: <Zap size={16} /> },
            { id: 'history', label: 'History', icon: <History size={16} /> },
            { id: 'contact', label: 'Contact', icon: <Mail size={16} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
          ].map((v) => (
            <li
              key={v.id}
              className={`nav-link ${activeView === v.id ? 'active' : ''}`}
              onClick={() => { setActiveView(v.id); setMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              {v.icon}
              {v.label}
            </li>
          ))}
        </ul>

        <div className="flex-center" style={{ gap: '1rem' }}>
          <button className="btn btn-outline settings-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => { setActiveView('settings'); setMenuOpen(false); }}>
            <Settings size={16} />
          </button>

          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const HomeView = ({ onStart, theme }: { onStart: () => void, theme: string }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <div className="video-hero">
      <video autoPlay muted loop playsInline className="bg-video">
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="hero-content">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ marginBottom: '2rem' }}
        >
          <Logo size={80} className="text-primary" theme={theme} style={{ margin: '0 auto' }} />
        </motion.div>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1>AI-Powered <span className="gradient-text">Meeting Intelligence</span>.</h1>
          <p>
            Zerion is a state-of-the-art solution for extracting structured action items from any meeting transcript.
            It uses Gemini AI to identify tasks, owners, and deadlines with incredible precision.
          </p>
          <div className="flex-center" style={{ gap: '1.5rem', marginTop: '2.5rem' }}>
            <button className="btn btn-primary" onClick={onStart} style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
              Get Started
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', opacity: 0.5, zIndex: 10 }}
      >
        <div style={{ width: '2px', height: '60px', background: 'linear-gradient(to bottom, var(--primary), transparent)', borderRadius: '1px' }} />
      </motion.div>
    </div>

    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="container view-section"
    >
      <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Why Choose Zerion?</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {[
          { icon: <Shield size={32} className="text-primary" />, title: "Privacy First", desc: "No data is stored on our servers. All API processing is handled via your local key." },
          { icon: <Zap size={32} color="var(--secondary)" />, title: "Instant Analysis", desc: "Get your structured task list in seconds, regardless of the meeting length." },
          { icon: <BarChart3 size={32} style={{ color: '#ffd700' }} />, title: "Smart Extraction", desc: "Detects nuanced owners and deadlines even if they are mentioned informally." }
        ].map((feat, i) => (
          <motion.div 
            whileHover={{ y: -10 }} 
            className="glass-card" 
            key={i}
          >
            {feat.icon}
            <h3 style={{ margin: '1rem 0' }}>{feat.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  </motion.div>
);

const BackEndWorksView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container view-section">
    <h2 style={{ textAlign: 'center', marginBottom: '4rem' }}>BackEnd Works</h2>

    <section>
      <h3 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--primary)' }}>System Architecture</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '900px' }}>

          {/* Layer 1: UI */}
          <div className="glass-panel" style={{ padding: '1.5rem', width: '100%', textAlign: 'center', border: '1px solid var(--primary)' }}>
            <div className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 800 }}>LAYER 01: FRONTEND</div>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>React + Vite Studio</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Framer Motion UI & State Management</p>
          </div>

          <div style={{ color: 'var(--primary)', opacity: 0.5 }}>▼</div>

          {/* Layer 2: API Gateway */}
          <div className="glass-panel" style={{ padding: '1.5rem', width: '100%', textAlign: 'center', border: '1px solid var(--secondary)' }}>
            <div className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 800 }}>LAYER 02: API GATEWAY</div>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>Node + Express Backend</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>POST /analyze-transcript — JSON Request/Response Orchestration</p>
          </div>

          <div style={{ color: 'var(--primary)', opacity: 0.5 }}>▼</div>

          {/* Layer 3: Pipeline */}
          <div className="glass-panel" style={{ padding: '1.5rem', width: '100%', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
            <div className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 800 }}>LAYER 03: PIPELINE</div>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>NLP Preprocessing</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sentence Tokenization, POS Tagging, & NER Analysis</p>
          </div>

          <div style={{ color: 'var(--primary)', opacity: 0.5 }}>▼</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%' }}>
            <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: 'var(--card-bg)', border: '1px dashed var(--primary)' }}>
              <div className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 900 }}>PHASE 1: MVP</div>
              <h4 style={{ marginTop: '0.5rem' }}>Rule-Based Engine</h4>
              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Regex, Pattern Matching & Fallback committed verb analysis.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: 'var(--card-bg)', border: '2px solid var(--secondary)' }}>
              <div className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 900 }}>PHASE 2: ML DETECTION</div>
              <h4 style={{ marginTop: '0.5rem' }}>AI Intelligence</h4>
              <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Prompt-based LLM (Gemini 2.5) for Context Logic & NER.</p>
            </motion.div>
          </div>

          {/* New: NLP Intelligence Details */}
          <div className="glass-panel" style={{ width: '100%', padding: '2rem', marginTop: '1rem', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Intelligence Pipeline Components</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontWeight: 800, fontSize: '0.8rem' }}>01. NER</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Detecting PERSON, DATE, & ORG entities.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontWeight: 800, fontSize: '0.8rem' }}>02. DEP-PARSING</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Subject-Verb-Object (SVO) extraction.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontWeight: 800, fontSize: '0.8rem' }}>03. COREFERENCE</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Resolving pronouns (e.g., "He" → Rahul).</p>
              </div>
            </div>
          </div>
          {/* Data Strategy Section */}
          <div className="glass-panel" style={{ width: '100%', padding: '2rem', marginTop: '2rem', background: 'var(--card-bg)' }}>
            <div className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 800, textAlign: 'center' }}>STRATEGIC DATA OPS</div>
            <h3 style={{ textAlign: 'center', margin: '0.5rem 0 1.5rem' }}>Training & Annotation Strategy</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div>
                <h4 style={{ color: 'var(--secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={16} /> Dataset Sources
                </h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.8' }}>
                  <li><strong>AMI Meeting Corpus:</strong> 100 hours of meeting recordings & transcripts.</li>
                  <li><strong>ICSI Meeting Corpus:</strong> 75 hours of academic meeting data.</li>
                  <li><strong>Custom Annotation:</strong> 200–300 manually verified meeting snippets.</li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ClipboardList size={16} /> Annotation Format
                </h4>
                <div style={{ background: 'var(--border-subtle)', padding: '1rem', borderRadius: '12px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                  <div style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>// Example Structure</div>
                  <span style={{ color: 'var(--primary)' }}>"Rahul will prepare slides by Friday"</span><br />
                  <span style={{ color: 'var(--text-muted)' }}>- Task:</span> prepare slides<br />
                  <span style={{ color: 'var(--text-muted)' }}>- Owner:</span> Rahul<br />
                  <span style={{ color: 'var(--text-muted)' }}>- Deadline:</span> Friday
                </div>
              </div>
            </div>
          </div>
          {/* Evaluation Metrics Section */}
          <div className="glass-panel" style={{ width: '100%', padding: '2rem', marginTop: '2rem', border: '1px solid var(--border-subtle)' }}>
            <div className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 800, textAlign: 'center' }}>ACADEMIC RIGOR</div>
            <h3 style={{ textAlign: 'center', margin: '0.5rem 0 2rem' }}>Model Performance Metrics</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '16px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>P / R / F1</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Classification Quality</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Measures detection accuracy, coverage, and harmonic mean.</p>
              </div>

              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '16px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>EMA</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Exact Match Accuracy</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Strict verification of task-owner-deadline triplets.</p>
              </div>

              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '16px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ff4444', marginBottom: '0.5rem' }}>Token-F1</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Entity Extraction</div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Precision of NER token spans for Names and Dates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

const HowToUseView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container view-section">
    <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How to Use Zerion AI</h2>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
      {[
        {
          step: "Step 01",
          title: "Input Your Transcript",
          desc: "Collect your transcript from Zoom, Google Meet, or Microsoft Teams. Paste the raw text into our interactive input field. Don't worry about formatting.",
          img: GUIDE_STEP_1
        },
        {
          step: "Step 02",
          title: "Trigger AI Analysis",
          desc: "Choose your preferred Gemini model and click 'Extract'. Our system analyzes linguistic patterns to find actionable commitments.",
          img: GUIDE_STEP_2
        },
        {
          step: "Step 03",
          title: "Export & Action",
          desc: "Review the extracted tasks, owners, and deadlines. Export them as clean JSON for your project management tools.",
          img: GUIDE_STEP_3
        }
      ].map((s, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1.2fr' : '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}
        >
          {i % 2 === 0 ? (
            <div>
              <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{s.step}</span>
              <h3 style={{ fontSize: '2rem', margin: '1rem 0' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--primary)' }}>
              <img src={s.img} alt={s.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}
          {i % 2 !== 0 ? (
            <div>
              <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{s.step}</span>
              <h3 style={{ fontSize: '2rem', margin: '1rem 0' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--primary)' }}>
              <img src={s.img} alt={s.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const HistoryView = ({ history, onClear, onRevisit }: { history: any[], onClear: () => void, onRevisit: (item: any) => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container view-section">
    <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
      <h2>Meeting History</h2>
      {history.length > 0 && (
        <button className="btn btn-outline" style={{ color: '#ff4444' }} onClick={onClear}>
          <Trash2 size={16} />
          Clear All
        </button>
      )}
    </div>

    {history.length === 0 ? (
      <div className="glass-panel flex-center" style={{ height: '300px', flexDirection: 'column' }}>
        <Clock size={40} opacity={0.3} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>No history found. Try processing a transcript!</p>
      </div>
    ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {history.map((h, i) => (
          <div className="glass-card" key={i} onClick={() => onRevisit(h)} style={{ cursor: 'pointer' }}>
            <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {new Date(h.timestamp).toLocaleString()}
              </span>
              <span className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{h.items.length} items</span>
            </div>
            <p style={{ fontSize: '0.95rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', color: '#ccc' }}>
              {h.transcript}
            </p>
          </div>
        ))}
      </div>
    )}
  </motion.div>
);

const ContactView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container view-section">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
      <div>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Get in Touch</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}> Connect with the team. </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '1.5rem' }}>
            <div className="glass-panel flex-center" style={{ width: 50, height: 50, borderRadius: '50%' }}> <Mail className="text-primary" size={24} /> </div>
            <div>
              <div style={{ fontWeight: 600 }}>Email</div>
              <div style={{ color: 'var(--text-secondary)' }}>support@zerion.ai</div>
            </div>
          </div>
          <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '1.5rem' }}>
            <div className="glass-panel flex-center" style={{ width: 50, height: 50, borderRadius: '50%' }}> <MapPin className="text-primary" size={24} /> </div>
            <div>
              <div style={{ fontWeight: 600 }}>Location</div>
              <div style={{ color: 'var(--text-secondary)' }}>San Francisco, CA</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', margin: '1rem' }}>
        <h3 style={{ marginBottom: '2rem' }}>Send a Message</h3>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => e.preventDefault()}>
          <input className="input-field" placeholder="Your Name" />
          <input className="input-field" placeholder="Your Email" />
          <textarea className="input-field" placeholder="Your Message" style={{ minHeight: '150px' }} />
          <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem' }}>Send Message</button>
        </form>
      </div>
    </div>
  </motion.div>
);

// --- MAIN APP ---

function App() {
  const [activeView, setActiveView] = useState('home');
  const [transcript, setTranscript] = useState('');
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [useMockMode, setUseMockMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState('rule-engine');
  const [customModel, setCustomModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ActionItem[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Ensure scroll is at top when we switch views
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) setTranscript(event.target.result as string);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const saved = localStorage.getItem('zerion_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleProcess = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError(null);
    try {
      let finalItems: ActionItem[] = [];
      let finalSummary: string = "";
      const modelToUse = selectedModel === 'custom' ? customModel : selectedModel;

      if (selectedModel === 'rule-engine') {
        // Step 2 & 3: Rule-Based Pipeline
        finalItems = ruleBasedExtraction(transcript);
        finalSummary = generateRuleBasedSummary(transcript);
        // Simulate a tiny delay for local processing
        await new Promise(r => setTimeout(r, 800));
      } else {
        const keyToUse = useMockMode ? undefined : apiKey;
        const result = await extractActionItems(transcript, keyToUse, modelToUse);
        finalItems = result.actionItems;
        finalSummary = result.summary;
      }

      setResults(finalItems);
      setSummary(finalSummary);

      const newEntry = {
        transcript: transcript.substring(0, 500),
        items: finalItems,
        timestamp: new Date().toISOString()
      };
      const newHistory = [newEntry, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('zerion_history', JSON.stringify(newHistory));
    } catch (err: any) {
      if (err?.message?.includes('429')) setError('Rate Limit Reached. Try again in 60s.');
      else setError(err?.message || 'AI Error. Check settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="mesh-glow" />
      <div className="grid-pattern" />
      <div className="cosmic-dust" />
      <div className="noise-overlay" />
      <div className="beam-container">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="beam" 
            style={{ 
              left: `${15 + i * 15}%`, 
              animationDelay: `${i * 1.5}s`,
              height: `${100 + Math.random() * 200}px` 
            }} 
          />
        ))}
      </div>
      <div className="stars-background" />
      <div className="glow-overlay" />
      <div className="app-root">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <Navbar activeView={activeView} setActiveView={setActiveView} theme={theme} />
      <main style={{ minHeight: '80vh', paddingBottom: '4rem' }}>
        <AnimatePresence mode="wait">
          {activeView === 'home' && <HomeView key="home" onStart={() => setActiveView('tool')} theme={theme} />}
          {activeView === 'guide' && <HowToUseView key="guide" />}
          {activeView === 'backend' && <BackEndWorksView key="backend" />}
          {activeView === 'tool' && (
            <ExtractorView
              key="tool"
              transcript={transcript}
              setTranscript={setTranscript}
              onProcess={handleProcess}
              loading={loading}
              results={results}
              error={error}
              onFileUpload={handleFileUpload}
              summary={summary}
              theme={theme}
            />
          )}
          {activeView === 'history' && (
            <HistoryView key="history" history={history} onClear={() => { setHistory([]); localStorage.removeItem('zerion_history'); }} onRevisit={(item) => { setTranscript(item.transcript); setResults(item.items); setActiveView('tool'); }} />
          )}
          {activeView === 'contact' && <ContactView key="contact" />}
          {activeView === 'settings' && (
            <SettingsView
              key="settings"
              apiKey={apiKey}
              setApiKey={setApiKey}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              useMockMode={useMockMode}
              setUseMockMode={setUseMockMode}
              customModel={customModel}
              setCustomModel={setCustomModel}
              theme={theme}
              setTheme={setTheme}
            />
          )}
        </AnimatePresence>
      </main>
      <footer className="container footer" style={{ padding: '4rem 0 2rem', borderTop: '1px solid var(--glass-border)', opacity: 0.6, textAlign: 'center' }}>
        <div className="flex-center" style={{ gap: '2rem', marginBottom: '1.5rem' }}>
          <Logo size={28} className="text-primary" theme={theme} />
          <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
            <span onClick={() => setActiveView('home')} style={{ cursor: 'pointer', color: 'var(--text-primary)' }}>Home</span>
            <span onClick={() => setActiveView('tool')} style={{ cursor: 'pointer', color: 'var(--text-primary)' }}>Tool</span>
            <span onClick={() => setActiveView('contact')} style={{ cursor: 'pointer', color: 'var(--text-primary)' }}>Contact</span>
          </nav>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>© 2026 Zerion AI System • Powered by Google Gemini</p>
      </footer>
      </div>
    </div>
  );
}

export default App;
