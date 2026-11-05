import { useEffect, useState } from 'react';
import { apiRequest } from './services/api.js';

const departments = [
  { id: 'admin', name: 'Admin', description: 'Manage staff oversight, generate operational reports, configure security settings, and supervise clinic workflows.', mark: 'AD', accent: 'linear-gradient(135deg, #0891b2, #0369a1)' },
  { id: 'cardroom', name: 'Card Room', description: 'Register patients, create medical history cards, archive files, and search existing records.', mark: 'CR', accent: 'linear-gradient(135deg, #10b981, #047857)' },
  { id: 'emergency', name: 'Emergency Room', description: 'Handle urgent admissions, critical triage, immediate care assignments, and emergency transfers.', mark: 'ER', accent: 'linear-gradient(135deg, #f43f5e, #be123c)' },
  { id: 'pharmacy', name: 'Pharmacy', description: 'Review prescriptions, dispense medications, monitor stock balances, and track expiration dates.', mark: 'PH', accent: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  { id: 'laboratory', name: 'Laboratory', description: 'Process diagnostic test orders, track specimens, record findings, and publish results.', mark: 'LB', accent: 'linear-gradient(135deg, #f59e0b, #b45309)' },
  { id: 'doctor', name: 'Doctor', description: 'Review patient queues, record diagnoses, order laboratory tests, and prescribe medication.', mark: 'DR', accent: 'linear-gradient(135deg, #06b6d4, #0e7490)' },
];

const publicPages = ['Home', 'About Us', 'Services', 'Contact'];

const publicServices = [
  ['General Medical Consultation', 'Clinical assessment and treatment planning for common health concerns.'],
  ['Patient Registration', 'Patient identity registration and clinic visit coordination.'],
  ['Nursing Services', 'Vital signs, nursing assessment, and patient care support.'],
  ['Emergency Medical Services', 'Urgent assessment and priority response for emergency cases.'],
  ['Laboratory Services', 'Diagnostic testing coordinated with authorized clinical staff.'],
  ['Pharmacy Services', 'Prescription review, dispensing, and medicine guidance.'],
  ['Medical Record Management', 'Confidential medical history and visit documentation.'],
  ['Health Education', 'Health promotion and practical guidance for campus wellbeing.'],
  ['Follow-up and Patient Monitoring', 'Continuity of care through follow-up and monitoring.'],
  ['Medical Referral Services', 'Coordination of referrals when additional care is needed.'],
];

const departmentRoles = {
  admin: ['super_admin', 'administrator'],
  cardroom: ['super_admin', 'administrator', 'card_room_officer'],
  emergency: ['super_admin', 'administrator', 'emergency_staff', 'triage_nurse'],
  pharmacy: ['super_admin', 'administrator', 'pharmacist'],
  laboratory: ['super_admin', 'administrator', 'laboratory_technician'],
  doctor: ['super_admin', 'administrator', 'doctor', 'nurse', 'triage_nurse'],
};

const styles = {
  root: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 75% -10%, #123a38 0%, #0c2027 38%, #09121d 78%)',
    color: '#edf5f2',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  navbar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    minHeight: 76,
    padding: '12px clamp(18px, 5vw, 64px)',
    borderBottom: '1px solid rgba(166, 204, 194, 0.13)',
    background: 'rgba(7, 17, 26, 0.9)',
  },
  logoContainer: { display: 'flex', minWidth: 0, alignItems: 'center', gap: 11 },
  logoBadge: {
    display: 'grid',
    width: 42,
    height: 42,
    flex: '0 0 42px',
    placeItems: 'center',
    borderRadius: 10,
    background: '#0d7568',
    color: '#eafff8',
    fontSize: 13,
    fontWeight: 800,
  },
  logoText: { overflow: 'hidden', color: '#f1f7f4', fontSize: 14, fontWeight: 700, textOverflow: 'ellipsis' },
  navLinks: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5 },
  navLink: {
    minHeight: 38,
    padding: '0 11px',
    border: '1px solid transparent',
    borderRadius: 7,
    background: 'transparent',
    color: '#afc3c0',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
  activeNavLink: {
    minHeight: 38,
    padding: '0 11px',
    border: '1px solid rgba(84, 208, 177, 0.26)',
    borderRadius: 7,
    background: 'rgba(13, 117, 104, 0.2)',
    color: '#8ee2c9',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
  },
  loginNavButton: {
    minHeight: 38,
    marginLeft: 5,
    padding: '0 16px',
    border: '1px solid #178b79',
    borderRadius: 7,
    background: '#0d7568',
    color: '#f2fffb',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
  },
  logoutNavButton: {
    minHeight: 38,
    marginLeft: 5,
    padding: '0 14px',
    border: '1px solid rgba(255, 164, 143, 0.35)',
    borderRadius: 7,
    background: 'rgba(138, 54, 48, 0.22)',
    color: '#ffd0c7',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
  },
  main: { width: 'min(1300px, 100%)', minHeight: 'calc(100vh - 138px)', margin: '0 auto', padding: '44px clamp(18px, 5vw, 64px) 60px' },
  eyebrow: { color: '#75cdb4', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' },
  hero: {
    position: 'relative',
    display: 'flex',
    minHeight: 'min(520px, 62vh)',
    alignItems: 'center',
    overflow: 'hidden',
    padding: '56px clamp(22px, 7vw, 80px)',
    border: '1px solid rgba(166, 204, 194, 0.14)',
    borderRadius: 14,
    backgroundColor: '#153c39',
    backgroundImage: 'linear-gradient(90deg, rgba(5, 23, 24, 0.92), rgba(5, 23, 24, 0.63) 55%, rgba(5, 23, 24, 0.12)), url("/mekdela-campus.jpg")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  heroText: { position: 'relative', zIndex: 1, maxWidth: 630 },
  heroTitle: { margin: '15px 0 14px', color: '#f4fbf7', fontSize: 'clamp(34px, 6vw, 58px)', fontWeight: 700, lineHeight: 1.08 },
  heroSubtitle: { maxWidth: 550, margin: 0, color: '#c4d6d1', fontSize: 16, lineHeight: 1.7 },
  primaryButton: {
    minHeight: 46,
    marginTop: 24,
    padding: '0 18px',
    border: '1px solid #36a991',
    borderRadius: 7,
    background: '#0d7568',
    color: '#f2fffb',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
  },
  pageHeading: { margin: '0 0 12px', color: '#f1f8f5', fontSize: 32, lineHeight: 1.2 },
  pageCopy: { maxWidth: 760, margin: 0, color: '#b5c8c3', fontSize: 15, lineHeight: 1.8 },
  pageIntro: { marginBottom: 28 },
  homeSection: { display: 'grid', gap: 28, marginTop: 28 },
  sectionCard: { padding: 'clamp(22px, 4vw, 32px)', border: '1px solid rgba(166, 204, 194, 0.14)', borderRadius: 16, background: 'rgba(13, 29, 38, 0.8)', boxShadow: '0 18px 30px rgba(0, 0, 0, 0.14)' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 16, marginTop: 24 },
  metricCard: { padding: 20, border: '1px solid rgba(166, 204, 194, 0.14)', borderRadius: 12, background: 'linear-gradient(180deg, rgba(19, 41, 46, 0.92), rgba(12, 19, 25, 0.82))' },
  metricValue: { display: 'block', color: '#ecfdf5', fontSize: 28, fontWeight: 800 },
  metricLabel: { display: 'block', marginTop: 8, color: '#a9c5c0', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' },
  splitGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20 },
  featureList: { display: 'grid', gap: 12, marginTop: 18 },
  featureItem: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, border: '1px solid rgba(166, 204, 194, 0.12)', borderRadius: 10, background: 'rgba(11, 25, 34, 0.42)', color: '#d8eee9', fontSize: 14 },
  serviceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: 12, marginTop: 26 },
  serviceCard: { minHeight: 146, padding: 18, border: '1px solid rgba(166, 204, 194, 0.15)', borderRadius: 9, background: 'rgba(13, 29, 38, 0.82)' },
  serviceMark: { color: '#5fd2af', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em' },
  serviceTitle: { margin: '12px 0 6px', color: '#edf6f2', fontSize: 17 },
  serviceCopy: { margin: 0, color: '#a8bfba', fontSize: 13, lineHeight: 1.6 },
  staffGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 18, marginTop: 24 },
  staffCard: { padding: 18, border: '1px solid rgba(166, 204, 194, 0.12)', borderRadius: 12, background: 'rgba(12, 19, 25, 0.7)', textAlign: 'center' },
  staffAvatar: { display: 'grid', width: 58, height: 58, margin: '0 auto 12px', placeItems: 'center', borderRadius: '50%', background: 'linear-gradient(135deg, #0d7568, #0ea5a4)', color: '#f2fffb', fontWeight: 800 },
  staffName: { margin: '0 0 6px', color: '#effaf7', fontSize: 17 },
  staffRole: { margin: 0, color: '#9cc7c1', fontSize: 13 },
  contactList: { display: 'grid', maxWidth: 720, gap: 0, marginTop: 30, borderTop: '1px solid rgba(166, 204, 194, 0.16)' },
  contactRow: { display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr)', gap: 18, padding: '17px 0', borderBottom: '1px solid rgba(166, 204, 194, 0.16)' },
  contactLabel: { color: '#87a29b', fontSize: 13 },
  contactValue: { color: '#e6f1ed', fontSize: 14, lineHeight: 1.6 },
  loginWrap: { display: 'grid', minHeight: 'calc(100vh - 180px)', placeItems: 'center' },
  loginCard: { width: 'min(460px, 100%)', padding: 'clamp(22px, 5vw, 34px)', border: '1px solid rgba(166, 204, 194, 0.16)', borderRadius: 13, background: 'rgba(11, 25, 34, 0.94)', boxShadow: '0 24px 70px rgba(0, 0, 0, 0.28)' },
  loginMark: { display: 'grid', width: 48, height: 48, margin: '0 auto 16px', placeItems: 'center', borderRadius: 12, background: '#0d7568', color: '#eafff8', fontWeight: 800 },
  loginTitle: { margin: 0, color: '#f1f8f5', fontSize: 24, textAlign: 'center' },
  loginSubtitle: { margin: '8px 0 24px', color: '#a8bfba', fontSize: 13, textAlign: 'center' },
  form: { display: 'grid', gap: 15 },
  label: { display: 'grid', gap: 7, color: '#d3e2dd', fontSize: 13, fontWeight: 600 },
  input: { width: '100%', minHeight: 44, padding: '10px 12px', border: '1px solid rgba(166, 204, 194, 0.23)', borderRadius: 7, outline: 'none', background: '#0a1721', color: '#f3faf7', fontSize: 14 },
  error: { margin: 0, padding: '10px 12px', border: '1px solid rgba(255, 130, 120, 0.35)', borderRadius: 7, background: 'rgba(126, 43, 40, 0.2)', color: '#ffc6bf', fontSize: 13 },
  dashboardHeader: { display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: 14, marginBottom: 28 },
  dashboardTitle: { margin: '8px 0 0', color: '#f1f8f5', fontSize: 30 },
  userPill: { padding: '8px 11px', border: '1px solid rgba(166, 204, 194, 0.16)', borderRadius: 7, background: 'rgba(13, 29, 38, 0.8)', color: '#b9cec8', fontSize: 12 },
  departmentGrid: { display: 'grid', gridTemplateColumns: '1fr', justifyItems: 'center', alignItems: 'stretch', gap: 30, width: '100%' },
  departmentButton: { display: 'flex', width: '100%', maxWidth: 1200, minHeight: 300, minWidth: 0, flexDirection: 'column', alignItems: 'stretch', padding: 40, border: '1px solid rgba(166, 204, 194, 0.17)', borderRadius: 18, background: 'linear-gradient(145deg, rgba(17, 35, 44, 0.98), rgba(11, 25, 34, 0.88))', color: '#edf5f2', cursor: 'pointer', textAlign: 'left', boxShadow: '0 16px 34px rgba(0, 0, 0, 0.2)', transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease' },
  departmentCardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  departmentMark: { display: 'grid', width: 75, height: 75, placeItems: 'center', borderRadius: 16, color: '#fff', fontSize: 22, fontWeight: 800, boxShadow: '0 8px 18px rgba(0, 0, 0, 0.25)' },
  departmentName: { display: 'block', margin: '2px 0 14px', color: '#f2f8f5', fontSize: 32, fontWeight: 700, lineHeight: 1.2 },
  departmentCopy: { display: 'block', maxWidth: 820, color: '#a8bfba', fontSize: 20, lineHeight: 1.7 },
  departmentArrow: { color: '#70cbb0', fontSize: 30 },
  departmentCardFooter: { marginTop: 'auto', paddingTop: 22, borderTop: '1px solid rgba(166, 204, 194, 0.13)', color: '#79d9be', fontSize: 18, fontWeight: 700 },
  backButton: { minHeight: 38, marginBottom: 22, padding: '0 12px', border: '1px solid rgba(166, 204, 194, 0.2)', borderRadius: 7, background: 'rgba(13, 29, 38, 0.8)', color: '#c5d8d2', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  workspacePanel: { padding: 'clamp(20px, 4vw, 32px)', border: '1px solid rgba(166, 204, 194, 0.16)', borderRadius: 11, background: 'rgba(13, 29, 38, 0.86)' },
  workspaceMark: { display: 'grid', width: 50, height: 50, marginBottom: 16, placeItems: 'center', borderRadius: 11, background: 'rgba(13, 117, 104, 0.22)', color: '#79d9be', fontSize: 13, fontWeight: 800 },
  workspaceTitle: { margin: '0 0 8px', color: '#f2f8f5', fontSize: 26 },
  workspaceCopy: { maxWidth: 700, margin: 0, color: '#adc2bc', fontSize: 14, lineHeight: 1.7 },
  workspaceTools: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 10, marginTop: 24 },
  toolItem: { minHeight: 68, padding: '14px 15px', border: '1px solid rgba(166, 204, 194, 0.13)', borderRadius: 8, background: 'rgba(7, 17, 26, 0.62)', color: '#c6d9d3', fontSize: 13, fontWeight: 600 },
  dashboardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 18, marginTop: 28 },
  dashboardCard: { display: 'flex', minHeight: 220, flexDirection: 'column', padding: 20, border: '1px solid rgba(166, 204, 194, 0.14)', borderRadius: 14, background: 'linear-gradient(160deg, rgba(17, 35, 44, 0.98), rgba(11, 25, 34, 0.88))', boxShadow: '0 16px 30px rgba(0, 0, 0, 0.18)', color: '#f0f7f5', transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease' },
  dashboardBadge: { display: 'inline-flex', width: 'fit-content', marginBottom: 14, padding: '7px 12px', borderRadius: 999, color: '#f0fff9', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' },
  dashboardMeta: { display: 'grid', gap: 8, marginTop: 'auto' },
  dashboardMetric: { color: '#d8efe9', fontSize: 13, fontWeight: 700 },
  dashboardCardButton: { minHeight: 42, marginTop: 18, padding: '0 14px', border: '1px solid rgba(120, 221, 188, 0.2)', borderRadius: 8, background: 'rgba(13, 117, 104, 0.18)', color: '#9fe7d0', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  dashboardDetail: { display: 'grid', gap: 18 },
  dashboardStats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 14, marginTop: 18 },
  statTile: { padding: 18, border: '1px solid rgba(166, 204, 194, 0.14)', borderRadius: 10, background: 'rgba(13, 29, 38, 0.8)' },
  statTileLabel: { display: 'block', color: '#a7c0be', fontSize: 12, marginBottom: 8 },
  statTileValue: { color: '#f4faf8', fontSize: 26, fontWeight: 800 },
  dataTable: { width: '100%', borderCollapse: 'collapse', marginTop: 8, overflow: 'hidden', borderRadius: 10, border: '1px solid rgba(166, 204, 194, 0.12)' },
  dataTableHeader: { color: '#dff5ef', fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(16, 42, 48, 0.9)' },
  dataTableCell: { padding: '12px 14px', borderBottom: '1px solid rgba(166, 204, 194, 0.09)', color: '#d8eee9', fontSize: 13 },
  footer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, padding: '16px clamp(18px, 5vw, 64px)', borderTop: '1px solid rgba(166, 204, 194, 0.12)', color: '#819a94', fontSize: 11 },
};

const workspaceTools = {
  admin: ['Staff accounts', 'Clinic reports', 'System activity', 'Department settings'],
  cardroom: ['Register patient', 'Find medical record', 'Issue queue number', 'Patient history'],
  emergency: ['Triage queue', 'Urgent admissions', 'Emergency cases', 'Care handover'],
  pharmacy: ['Prescription queue', 'Dispense medicine', 'Inventory levels', 'Reorder watch'],
  laboratory: ['New test orders', 'Work in progress', 'Record results', 'Result history'],
  doctor: ['Patient queue', 'Consultation notes', 'Diagnosis records', 'Prescriptions'],
};

const dashboardCatalog = [
  { id: 'super-admin', role: 'super_admin', name: 'Super Admin Dashboard', description: 'System-wide governance, permissions, and operational oversight.', accent: 'linear-gradient(135deg, #1d4ed8, #0f766e)' },
  { id: 'administrator', role: 'administrator', name: 'Administrator Dashboard', description: 'Department coordination, compliance, and service operations.', accent: 'linear-gradient(135deg, #0ea5e9, #2563eb)' },
  { id: 'reception', role: 'receptionist', name: 'Reception Dashboard', description: 'Queue handling, registration, appointments, and check-in.', accent: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  { id: 'card-room', role: 'card_room_officer', name: 'Card Room Dashboard', description: 'Medical records, file creation, and patient history access.', accent: 'linear-gradient(135deg, #10b981, #047857)' },
  { id: 'doctor', role: 'doctor', name: 'Doctor Dashboard', description: 'Case review, diagnosis, and treatment planning.', accent: 'linear-gradient(135deg, #06b6d4, #0e7490)' },
  { id: 'nurse', role: 'nurse', name: 'Nurse Dashboard', description: 'Vital signs, monitoring, and patient care tracking.', accent: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { id: 'emergency-room', role: 'emergency_staff', name: 'Emergency Room Dashboard', description: 'Urgent care triage, referrals, and critical case monitoring.', accent: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
  { id: 'pharmacy', role: 'pharmacist', name: 'Pharmacy Dashboard', description: 'Medicine inventory, dispensing, and low-stock management.', accent: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  { id: 'laboratory', role: 'laboratory_technician', name: 'Laboratory Dashboard', description: 'Test requests, specimen workflow, and result processing.', accent: 'linear-gradient(135deg, #f97316, #ea580c)' },
  { id: 'finance', role: 'cashier', name: 'Cashier / Finance Dashboard', description: 'Billing, receipts, payment history, and reporting.', accent: 'linear-gradient(135deg, #14b8a6, #0f766e)' },
  { id: 'clinic-manager', role: 'clinic_manager', name: 'Clinic Manager Dashboard', description: 'Operations intelligence and staff performance visibility.', accent: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
  { id: 'patient', role: 'patient', name: 'Patient / Student Dashboard', description: 'Profile, appointments, records, prescriptions, and billing.', accent: 'linear-gradient(135deg, #ec4899, #db2777)' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [dashboardError, setDashboardError] = useState('');
  const [contactMessages, setContactMessages] = useState([]);
  const [contactMessagesError, setContactMessagesError] = useState('');
  const isLoggedIn = Boolean(user);
  const accessibleDepartments = departments.filter((department) => departmentRoles[department.id]?.includes(user?.role));

  useEffect(() => {
    const token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token');
    if (!token) {
      setAuthLoading(false);
      return undefined;
    }

    let active = true;
    apiRequest('auth/me')
      .then(({ user: currentUser }) => {
        if (!active) return;
        setUser(currentUser);
        setEmail(currentUser.email);
        setCurrentPage('Dashboard');
      })
      .catch(() => {
        window.localStorage.removeItem('token');
        window.sessionStorage.removeItem('token');
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (currentPage !== 'Dashboard' || !user) return undefined;
    let active = true;
    apiRequest('reports/dashboard')
      .then((summary) => { if (active) setDashboardSummary(summary); })
      .catch((requestError) => { if (active) setDashboardError(requestError.message); });
    return () => { active = false; };
  }, [currentPage, user]);

  useEffect(() => {
    if (!selectedDashboard || !['super_admin', 'administrator'].includes(user?.role)) return undefined;
    let active = true;
    apiRequest('contact/messages?limit=20')
      .then(({ messages }) => { if (active) setContactMessages(messages); })
      .catch((requestError) => { if (active) setContactMessagesError(requestError.message); });
    return () => { active = false; };
  }, [selectedDashboard, user]);

  function showPage(page) {
    setCurrentPage(page);
    setError('');
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email address and password to continue.');
      return;
    }
    setError('');
    setIsSubmittingLogin(true);
    try {
      const result = await apiRequest('auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: email.trim(), password }),
      });
      window.localStorage.removeItem('token');
      window.sessionStorage.removeItem('token');
      const tokenStore = rememberMe ? window.localStorage : window.sessionStorage;
      tokenStore.setItem('token', result.accessToken);
      setUser(result.user);
      setEmail(result.user.email);
      setPassword('');
      setSelectedDashboard(null);
      setSelectedDepartment(null);
      setCurrentPage('Dashboard');
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  async function handleLogout() {
    try {
      await apiRequest('auth/logout', { method: 'POST' });
    } catch {
      // Clear the browser session even if the API is temporarily unavailable.
    }
    window.localStorage.removeItem('token');
    window.sessionStorage.removeItem('token');
    setUser(null);
    setSelectedDepartment(null);
    setSelectedDashboard(null);
    setEmail('');
    setPassword('');
    setError('');
    setCurrentPage('Home');
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    setContactError('');
    setContactSubmitted(false);
    setContactSubmitting(true);
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    try {
      await apiRequest('v1/public/contact', { method: 'POST', body: JSON.stringify(values) });
      setContactSubmitted(true);
      setContactSubject('');
      form.reset();
    } catch (requestError) {
      setContactError(requestError.message || 'Unable to send your message. Please try again later.');
    } finally {
      setContactSubmitting(false);
    }
  }

  async function updateContactStatus(messageId, status) {
    setContactMessagesError('');
    try {
      const { message } = await apiRequest(`contact/messages/${messageId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setContactMessages((messages) => messages.map((item) => item._id === messageId ? message : item));
    } catch (requestError) {
      setContactMessagesError(requestError.message || 'Unable to update message status.');
    }
  }

  function renderPublicPage() {
    if (currentPage === 'Home') {
      return (
        <section style={styles.homeSection}>
          <section style={styles.hero}>
            <div style={styles.heroText}>
              <span style={styles.eyebrow}>Mekdela Amba University Clinic</span>
              <h1 style={styles.heroTitle}>Welcome to Mekdela Amba University Clinic</h1>
              <p style={styles.heroSubtitle}>Quality Healthcare Services for Our Campus Community. Accessible clinic services for students, staff, and visitors.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <button onClick={() => showPage(isLoggedIn ? 'Dashboard' : 'Login')} style={styles.primaryButton} type="button">Access Clinic System</button>
                <button onClick={() => { setContactSubject('Appointment request'); showPage('Contact'); }} style={styles.backButton} type="button">Book an Appointment</button>
              </div>
            </div>
          </section>

          <section style={styles.sectionCard}>
            <span style={styles.eyebrow}>Featured services</span>
            <div style={styles.serviceGrid}>
              {publicServices.slice(0, 4).map(([title, description], index) => (
                <article key={title} style={styles.serviceCard}>
                  <span style={styles.serviceMark}>{String(index + 1).padStart(2, '0')}</span>
                  <h2 style={styles.serviceTitle}>{title}</h2>
                  <p style={styles.serviceCopy}>{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section style={styles.sectionCard}>
            <span style={styles.eyebrow}>Clinic overview</span>
            <h2 style={styles.pageHeading}>Modern, patient-first healthcare for the university community.</h2>
            <p style={styles.pageCopy}>The Mekdela Amba University Clinic Management System supports students, staff, and families through efficient registration, nursing care, physician consultation, pharmacy, laboratory services, and administrative coordination.</p>

            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}><span style={styles.metricValue}>24/7</span><span style={styles.metricLabel}>Emergency response</span></div>
              <div style={styles.metricCard}><span style={styles.metricValue}>12</span><span style={styles.metricLabel}>Departments</span></div>
              <div style={styles.metricCard}><span style={styles.metricValue}>98%</span><span style={styles.metricLabel}>Patient satisfaction</span></div>
              <div style={styles.metricCard}><span style={styles.metricValue}>1K+</span><span style={styles.metricLabel}>Annual visits</span></div>
            </div>
          </section>

          <section style={styles.sectionCard}>
            <span style={styles.eyebrow}>Mission and vision</span>
            <div style={styles.splitGrid}>
              <div>
                <h3 style={{ margin: '8px 0 12px', color: '#f1f8f5', fontSize: 26 }}>Our mission</h3>
                <p style={styles.pageCopy}>To provide accessible, safe, efficient, and compassionate healthcare services to the Mekdela Amba University community through a responsive and well-coordinated clinical system.</p>
              </div>
              <div>
                <h3 style={{ margin: '8px 0 12px', color: '#f1f8f5', fontSize: 26 }}>Our vision</h3>
                <p style={styles.pageCopy}>To become a model university clinic that integrates evidence-based care, digital records, and patient-centered operations for sustainable community health.</p>
              </div>
            </div>
          </section>

          <section style={styles.sectionCard}>
            <span style={styles.eyebrow}>Why choose our clinic</span>
            <div style={styles.featureList}>
              <div style={styles.featureItem}><span aria-hidden="true" style={{ color: '#75cdb4', fontWeight: 800 }}>✓</span><span>Integrated digital workflows across registration, diagnosis, pharmacy, and laboratory services.</span></div>
              <div style={styles.featureItem}><span aria-hidden="true" style={{ color: '#75cdb4', fontWeight: 800 }}>✓</span><span>Experienced clinical staff, responsive nurses, clinicians, and support personnel.</span></div>
              <div style={styles.featureItem}><span aria-hidden="true" style={{ color: '#75cdb4', fontWeight: 800 }}>✓</span><span>Secure patient records, efficient queue management, and improved service continuity.</span></div>
              <div style={styles.featureItem}><span aria-hidden="true" style={{ color: '#75cdb4', fontWeight: 800 }}>✓</span><span>Student and staff-focused care that promotes health, safety, and academic productivity.</span></div>
            </div>
          </section>

          <section style={styles.sectionCard}>
            <span style={styles.eyebrow}>Medical staff</span>
            <div style={styles.staffGrid}>
              <div style={styles.staffCard}><div style={styles.staffAvatar}>DR</div><h3 style={styles.staffName}>Dr. Selam Hailu</h3><p style={styles.staffRole}>General Physician</p></div>
              <div style={styles.staffCard}><div style={styles.staffAvatar}>RN</div><h3 style={styles.staffName}>Sofia Bekele</h3><p style={styles.staffRole}>Senior Nurse</p></div>
              <div style={styles.staffCard}><div style={styles.staffAvatar}>PH</div><h3 style={styles.staffName}>Kibrom Tadesse</h3><p style={styles.staffRole}>Pharmacist</p></div>
              <div style={styles.staffCard}><div style={styles.staffAvatar}>LB</div><h3 style={styles.staffName}>Daniel Moges</h3><p style={styles.staffRole}>Laboratory Lead</p></div>
            </div>
          </section>
        </section>
      );
    }

    if (currentPage === 'About Us') {
      return (
        <section style={styles.sectionCard}>
          <span style={styles.eyebrow}>About the clinic</span>
          <h1 style={styles.pageHeading}>Connected care for the university community.</h1>
          <p style={styles.pageCopy}>The Mekdela Amba University Clinic Management System connects patient services, emergency response, clinicians, pharmacy, laboratory, and administration through coordinated digital workflows.</p>
          <div style={styles.splitGrid}>
            <div>
              <h3 style={{ margin: '18px 0 10px', color: '#f1f8f5', fontSize: 24 }}>Who we serve</h3>
              <p style={styles.pageCopy}>We provide inclusive health support for students, academic staff, administrative teams, and the wider university community.</p>
            </div>
            <div>
              <h3 style={{ margin: '18px 0 10px', color: '#f1f8f5', fontSize: 24 }}>How we work</h3>
              <p style={styles.pageCopy}>Each department works through a unified digital process to improve continuity, reduce waiting time, and keep patient records secure.</p>
            </div>
          </div>
        </section>
      );
    }

    if (currentPage === 'Services') {
      return (
        <section>
          <div style={styles.pageIntro}>
            <span style={styles.eyebrow}>Clinic operations</span>
            <h1 style={styles.pageHeading}>Departments and services</h1>
            <p style={styles.pageCopy}>Choose a department workspace after signing in to access its clinic tools.</p>
          </div>
          <div style={styles.serviceGrid}>
            {publicServices.map(([title, description], index) => (
              <article key={title} style={styles.serviceCard}>
                <span style={styles.serviceMark}>{String(index + 1).padStart(2, '0')}</span>
                <h2 style={styles.serviceTitle}>{title}</h2>
                <p style={styles.serviceCopy}>{description}</p>
                <button onClick={() => { setContactSubject(title); showPage('Contact'); }} style={{ ...styles.backButton, marginTop: 16, marginBottom: 0 }} type="button">Learn More</button>
              </article>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section>
        <div style={styles.pageIntro}>
          <span style={styles.eyebrow}>Contact and support</span>
          <h1 style={styles.pageHeading}>Contact the clinic team.</h1>
          <p style={styles.pageCopy}>For non-urgent questions, send a message to the Mekdela Amba University Clinic. Please do not include private medical details.</p>
        </div>
        <div style={styles.contactList}>
          <div style={styles.contactRow}><span style={styles.contactLabel}>Clinic</span><strong style={styles.contactValue}>Mekdela Amba University Clinic</strong></div>
          <div style={styles.contactRow}><span style={styles.contactLabel}>Address</span><strong style={styles.contactValue}>Mekdela Amba University, Ethiopia</strong></div>
          <div style={styles.contactRow}><span style={styles.contactLabel}>Phone</span><strong style={styles.contactValue}>Official clinic phone number to be confirmed</strong></div>
          <div style={styles.contactRow}><span style={styles.contactLabel}>Email</span><strong style={styles.contactValue}>Official clinic email to be confirmed</strong></div>
          <div style={styles.contactRow}><span style={styles.contactLabel}>Hours</span><strong style={styles.contactValue}>Please confirm working hours with the clinic</strong></div>
        </div>
        <form onSubmit={handleContactSubmit} style={{ ...styles.loginCard, width: 'min(720px, 100%)', marginTop: 30 }}>
          <h2 style={{ ...styles.loginTitle, textAlign: 'left' }}>Send a message</h2>
          <div style={styles.form}>
            <label style={styles.label}>Full name<input autoComplete="name" maxLength="120" name="fullName" required style={styles.input} /></label>
            <label style={styles.label}>Email address<input autoComplete="email" maxLength="254" name="email" required style={styles.input} type="email" /></label>
            <label style={styles.label}>Phone number<input autoComplete="tel" maxLength="40" name="phone" required style={styles.input} type="tel" /></label>
            <label style={styles.label}>Campus<select name="campus" required style={styles.input} defaultValue=""><option disabled value="">Select campus</option><option>Main Campus</option><option>Tulu Awulya</option><option>Ginba</option></select></label>
            <label style={styles.label}>Subject<input maxLength="160" name="subject" onChange={(event) => setContactSubject(event.target.value)} required style={styles.input} value={contactSubject} /></label>
            <label style={styles.label}>Message<textarea maxLength="3000" minLength="10" name="message" required rows="5" style={{ ...styles.input, resize: 'vertical' }} /></label>
            <input aria-hidden="true" autoComplete="off" name="website" tabIndex="-1" style={{ position: 'absolute', left: '-10000px' }} />
            {contactError && <p role="alert" style={styles.error}>{contactError}</p>}
            {contactSubmitted && <p role="status" style={{ ...styles.error, borderColor: 'rgba(80, 190, 150, 0.35)', background: 'rgba(20, 112, 84, 0.18)', color: '#b7f4dc' }}>Your message was received. Thank you for contacting the clinic.</p>}
            <button disabled={contactSubmitting} style={styles.primaryButton} type="submit">{contactSubmitting ? 'Sending...' : 'Send message'}</button>
          </div>
        </form>
      </section>
    );
  }

  function renderLogin() {
    return (
      <section style={styles.loginWrap}>
        <div style={styles.loginCard}>
          <div style={styles.loginMark}>MAU</div>
          <h1 style={styles.loginTitle}>System Login</h1>
          <p style={styles.loginSubtitle}>Enter your credentials to continue.</p>
          <form onSubmit={handleLogin} style={styles.form}>
            <label style={styles.label}>
              Email or username
              <input autoComplete="username" onChange={(event) => setEmail(event.target.value)} placeholder="Email or username" required style={styles.input} value={email} />
            </label>
            <label style={styles.label}>
              Password
              <span style={{ display: 'flex', gap: 8 }}>
                <input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required style={styles.input} type={showPassword ? 'text' : 'password'} value={password} />
                <button aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} style={styles.backButton} type="button">{showPassword ? 'Hide' : 'Show'}</button>
              </span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b9cec8', fontSize: 13 }}><input checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" />Remember me</label>
              <button onClick={() => { setContactSubject('Password reset request'); showPage('Contact'); }} style={{ border: 0, background: 'transparent', color: '#8ee2c9', cursor: 'pointer', fontSize: 13 }} type="button">Forgot password?</button>
            </div>
            {error && <p role="alert" style={styles.error}>{error}</p>}
            <button disabled={isSubmittingLogin || authLoading} style={styles.primaryButton} type="submit">{isSubmittingLogin ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <button onClick={() => showPage('Home')} style={{ ...styles.backButton, display: 'block', margin: '18px auto 0' }} type="button">Back to Home</button>
        </div>
      </section>
    );
  }

  function renderDashboardOverview() {
    const availableDashboards = dashboardCatalog.filter((dashboard) => (
      dashboard.role === user?.role
      || (dashboard.id === 'nurse' && user?.role === 'triage_nurse')
      || user?.role === 'super_admin'
    ));

    return (
      <section>
        <div style={styles.dashboardHeader}>
          <div>
            <span style={styles.eyebrow}>Secure role workspace</span>
            <h1 style={styles.dashboardTitle}>{user?.role === 'super_admin' ? 'Clinical dashboard center' : availableDashboards[0]?.name || 'Clinic dashboard'}</h1>
          </div>
          <span style={styles.userPill}>{user?.name} · {user?.email}</span>
        </div>
        {dashboardError && <p role="alert" style={styles.error}>Live dashboard data is unavailable: {dashboardError}</p>}
        <div style={styles.dashboardGrid}>
          {availableDashboards.map((dashboard) => (
            <div key={dashboard.id} className="role-dashboard-card" style={{ ...styles.dashboardCard, boxShadow: '0 18px 30px rgba(0, 0, 0, 0.2)' }}>
              <span style={{ ...styles.dashboardBadge, background: dashboard.accent }}>{dashboard.name.split(' ')[0]}</span>
              <h2 style={{ margin: 0, color: '#f3faf7', fontSize: 20, lineHeight: 1.25 }}>{dashboard.name}</h2>
              <p style={{ margin: '12px 0 0', color: '#aec6c0', fontSize: 14, lineHeight: 1.6 }}>{dashboard.description}</p>
              <span style={{ ...styles.dashboardMetric, marginTop: 'auto', paddingTop: 16 }}>Signed in as {user?.role?.replaceAll('_', ' ')}</span>
              <button
                onClick={() => {
                  setSelectedDashboard(dashboard);
                  setCurrentPage('Dashboard');
                }}
                style={styles.dashboardCardButton}
                type="button"
              >
                Open Dashboard
              </button>
            </div>
          ))}
        </div>
        {!availableDashboards.length && <p style={styles.pageCopy}>No dashboard is assigned to this account. Contact the clinic administrator.</p>}
      </section>
    );
  }

  function renderDashboardDetail() {
    if (!selectedDashboard) {
      return renderDashboardOverview();
    }

    const summaryRows = [
      { label: 'Registered patients', value: dashboardSummary?.patients },
      { label: 'Active doctors', value: dashboardSummary?.doctors },
      { label: 'Active nurses', value: dashboardSummary?.nurses },
      { label: 'Active staff accounts', value: dashboardSummary?.staff },
      { label: 'Medical records', value: dashboardSummary?.medicalRecords },
      { label: 'Patients in active queue', value: dashboardSummary?.activeQueue },
      { label: 'Visits in clinic today', value: dashboardSummary?.visitsToday },
      { label: 'Available medicine items', value: dashboardSummary?.availableMedicines },
    ];

    return (
      <section style={styles.dashboardDetail}>
        <button
          onClick={() => {
            setSelectedDashboard(null);
            setCurrentPage('Dashboard');
          }}
          style={styles.backButton}
          type="button"
        >
          ← Back to Dashboard Center
        </button>

        <div style={styles.workspacePanel}>
          <div style={{ ...styles.workspaceMark, background: selectedDashboard.accent, color: '#f4faf7' }}>{selectedDashboard.name.split(' ').slice(0, 2).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div>
          <span style={styles.eyebrow}>Department role</span>
          <h1 style={styles.workspaceTitle}>{selectedDashboard.name}</h1>
          <p style={styles.workspaceCopy}>{selectedDashboard.description}</p>
          {dashboardError && <p role="alert" style={{ ...styles.error, marginTop: 16 }}>Live dashboard data is unavailable: {dashboardError}</p>}

          <div style={styles.dashboardStats}>
            {summaryRows.map((row) => (
              <div key={row.label} style={styles.statTile}>
                <span style={styles.statTileLabel}>{row.label}</span>
                <span style={styles.statTileValue}>{row.value ?? '—'}</span>
              </div>
            ))}
          </div>

          <h2 style={{ margin: '30px 0 0', color: '#f1f8f5', fontSize: 20 }}>Live clinic totals</h2>
          <table style={styles.dataTable}>
            <thead>
              <tr>
                <th style={{ ...styles.dataTableCell, ...styles.dataTableHeader }}>Metric</th>
                <th style={{ ...styles.dataTableCell, ...styles.dataTableHeader }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map(({ label, value }) => (
                <tr key={label}>
                  <td style={styles.dataTableCell}>{label}</td>
                  <td style={styles.dataTableCell}>{value ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {['super_admin', 'administrator'].includes(user?.role) && (
            <section aria-labelledby="contact-inbox-heading" style={{ marginTop: 32 }}>
              <h2 id="contact-inbox-heading" style={{ margin: 0, color: '#f1f8f5', fontSize: 20 }}>Contact message inbox</h2>
              {contactMessagesError && <p role="alert" style={styles.error}>{contactMessagesError}</p>}
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.dataTable}>
                  <thead><tr><th style={{ ...styles.dataTableCell, ...styles.dataTableHeader }}>Sender</th><th style={{ ...styles.dataTableCell, ...styles.dataTableHeader }}>Subject</th><th style={{ ...styles.dataTableCell, ...styles.dataTableHeader }}>Message</th><th style={{ ...styles.dataTableCell, ...styles.dataTableHeader }}>Status</th></tr></thead>
                  <tbody>
                    {contactMessages.map((message) => (
                      <tr key={message._id}>
                        <td style={styles.dataTableCell}>{message.fullName}<br />{message.email}</td>
                        <td style={styles.dataTableCell}>{message.subject}</td>
                        <td style={styles.dataTableCell}>{message.message}</td>
                        <td style={styles.dataTableCell}>
                          <select aria-label={`Status for ${message.subject}`} onChange={(event) => updateContactStatus(message._id, event.target.value)} style={styles.input} value={message.status}>
                            <option value="new">New</option><option value="reviewed">Reviewed</option><option value="closed">Closed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {!contactMessages.length && <tr><td colSpan="4" style={styles.dataTableCell}>No contact messages found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </section>
    );
  }

  function renderDepartments() {
    return (
      <section>
        <div style={styles.dashboardHeader}>
          <div>
            <span style={styles.eyebrow}>Clinic workspace</span>
            <h1 style={styles.dashboardTitle}>Choose a department</h1>
          </div>
          <span style={styles.userPill}>{email}</span>
        </div>
        <div style={styles.departmentGrid}>
          {accessibleDepartments.map((department) => (
            <button
              key={department.id}
              className="department-workspace-card"
              onClick={() => {
                setSelectedDepartment(department);
                setCurrentPage('Workspace');
              }}
              style={styles.departmentButton}
              type="button"
            >
              <span style={styles.departmentCardHeader}>
                <span style={{ ...styles.departmentMark, background: department.accent }}>{department.mark}</span>
                <span aria-hidden="true" style={styles.departmentArrow}>→</span>
              </span>
              <span style={{ display: 'block' }}>
                <strong style={styles.departmentName}>{department.name}</strong>
                <span style={styles.departmentCopy}>{department.description}</span>
              </span>
              <span style={styles.departmentCardFooter}>Open Workspace</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  function renderWorkspace() {
    return (
      <section>
        <button
          onClick={() => {
            setSelectedDepartment(null);
            setCurrentPage('Departments');
          }}
          style={styles.backButton}
          type="button"
        >
          ← Back to Departments
        </button>
        <div style={styles.workspacePanel}>
          <div style={styles.workspaceMark}>{selectedDepartment.mark}</div>
          <span style={styles.eyebrow}>Department workspace</span>
          <h1 style={styles.workspaceTitle}>{selectedDepartment.name}</h1>
          <p style={styles.workspaceCopy}>{selectedDepartment.description}. Use the workspace tools below to continue clinic operations.</p>
          <div style={styles.workspaceTools}>
            {workspaceTools[selectedDepartment.id].map((tool) => <div key={tool} style={styles.toolItem}>{tool}</div>)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div style={styles.root}>
      <header style={styles.navbar}>
        <div style={styles.logoContainer}>
          <div style={styles.logoBadge}>MAU</div>
          <span style={styles.logoText}>Mekdela Amba University Clinic</span>
        </div>
        <nav aria-label="Main navigation" style={styles.navLinks}>
          {publicPages.map((page) => (
            <button key={page} onClick={() => showPage(page)} style={currentPage === page ? styles.activeNavLink : styles.navLink} type="button">{page === 'Contact' ? 'Contact Us' : page}</button>
          ))}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  setSelectedDashboard(null);
                  setSelectedDepartment(null);
                  showPage('Dashboard');
                }}
                style={currentPage === 'Dashboard' ? styles.activeNavLink : styles.navLink}
                type="button"
              >
                Dashboard
              </button>
              {accessibleDepartments.length > 0 && <button
                onClick={() => {
                  setSelectedDepartment(null);
                  showPage('Departments');
                }}
                style={currentPage === 'Departments' ? styles.activeNavLink : styles.navLink}
                type="button"
              >
                Departments
              </button>}
              <button onClick={handleLogout} style={styles.logoutNavButton} type="button">Logout</button>
            </>
          ) : (
            <button onClick={() => showPage('Login')} style={styles.loginNavButton} type="button">Login</button>
          )}
        </nav>
      </header>

      <main style={styles.main}>
        {currentPage === 'Login' && !isLoggedIn && renderLogin()}
        {currentPage === 'Dashboard' && isLoggedIn && (selectedDashboard ? renderDashboardDetail() : renderDashboardOverview())}
        {currentPage === 'Departments' && isLoggedIn && renderDepartments()}
        {currentPage === 'Workspace' && isLoggedIn && selectedDepartment && departmentRoles[selectedDepartment.id]?.includes(user?.role) && renderWorkspace()}
        {publicPages.includes(currentPage) && renderPublicPage()}
      </main>

      <footer style={styles.footer}>
        <strong>MAU Clinic</strong>
        <span>Mekdela Amba University · Amhara Region, Ethiopia</span>
      </footer>
    </div>
  );
}