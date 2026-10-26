import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mekdela-clinic-demo-data';
const SEED_DATA = {
  patients: [
    { id: 'P-1048', name: 'Selamawit Bekele', age: 24, sex: 'Female', phone: '0911 234 567', status: 'Waiting', visits: [] },
    { id: 'P-1047', name: 'Dawit Alemu', age: 31, sex: 'Male', phone: '0912 345 678', status: 'Waiting', visits: [] },
    { id: 'P-1046', name: 'Hana Tadesse', age: 19, sex: 'Female', phone: '0913 456 789', status: 'In consultation', visits: [] },
    { id: 'P-1045', name: 'Yonas Girma', age: 42, sex: 'Male', phone: '0914 567 890', status: 'Completed', visits: [] },
  ],
  inventory: [
    { id: 'M-01', name: 'Paracetamol 500 mg', category: 'Pain relief', quantity: 120, reorder: 30, expiry: '2027-08-30' },
    { id: 'M-02', name: 'Amoxicillin 500 mg', category: 'Antibiotic', quantity: 68, reorder: 20, expiry: '2027-04-12' },
    { id: 'M-03', name: 'Oral rehydration salts', category: 'Rehydration', quantity: 14, reorder: 25, expiry: '2027-01-20' },
    { id: 'M-04', name: 'Ibuprofen 200 mg', category: 'Pain relief', quantity: 56, reorder: 20, expiry: '2027-11-05' },
  ],
  leaves: [
    { id: 'SL-207', patientId: 'P-1047', patientName: 'Dawit Alemu', from: '2026-10-26', to: '2026-10-28', reason: 'Acute illness', status: 'Pending', created: '2026-10-26' },
  ],
  prescriptions: [],
};

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: '⌂' },
  { id: 'patients', label: 'Patients', icon: '♡' },
  { id: 'doctor', label: 'Consultations', icon: '✚' },
  { id: 'leave', label: 'Sick leave', icon: '▤' },
  { id: 'pharmacy', label: 'Pharmacy', icon: '⚕' },
];

function readSavedData() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...SEED_DATA, ...JSON.parse(saved) } : SEED_DATA;
  } catch (error) {
    console.error('Could not load demo clinic data from local storage.', error);
    return SEED_DATA;
  }
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const [data, setData] = useState(readSavedData);
  const [page, setPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Could not save demo clinic data to local storage.', error);
      setNotice('Local storage is unavailable. Changes may not persist after refresh.');
    }
  }, [data]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function updateData(updater) {
    setData((current) => typeof updater === 'function' ? updater(current) : updater);
  }

  if (!user) {
    return <WelcomePage onSignIn={setUser} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={() => setPage('dashboard')}>
          <span className="brand-mark"><img alt="" src="/logo-mekdela-amba.png" /></span>
          <span><strong>Mekdela Amba University</strong><small>CLINIC MANAGEMENT SYSTEM</small></span>
        </a>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button className={`nav-item ${page === item.id ? 'active' : ''}`} key={item.id} onClick={() => setPage(item.id)} type="button">
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>{item.label}
              {item.id === 'leave' && data.leaves.some((leave) => leave.status === 'Pending') && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="demo-callout"><span className="status-dot" /> Demo workspace <small>Sample records only</small></div>
          <button className="profile-button" onClick={() => setUser(null)} type="button" aria-label="Log out">
            <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
            <span className="profile-info"><strong>{user.name}</strong><small>{user.role}</small></span>
            <span className="logout-label"><span aria-hidden="true">↪</span> Log out</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark"><img alt="" src="/logo-mekdela-amba.png" /></span><strong>Mekdela Amba University</strong></div>
          <div className="breadcrumb">Clinic <span>/</span> <strong>{NAV_ITEMS.find((item) => item.id === page)?.label}</strong></div>
          <div className="topbar-right"><span className="today-label">{new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(new Date())}</span><span className="avatar avatar-small">{user.name.slice(0, 1).toUpperCase()}</span></div>
        </header>
        {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')} type="button" aria-label="Dismiss notification">×</button></div>}
        <div className="content">
          {page === 'dashboard' && <Dashboard data={data} onNavigate={setPage} />}
          {page === 'patients' && <PatientsPage data={data} updateData={updateData} notify={setNotice} />}
          {page === 'doctor' && <ConsultationsPage data={data} updateData={updateData} notify={setNotice} />}
          {page === 'leave' && <LeavePage data={data} updateData={updateData} notify={setNotice} />}
          {page === 'pharmacy' && <PharmacyPage data={data} updateData={updateData} notify={setNotice} />}
          <footer className="app-footer"><span>MA</span> Mekdela Amba University <span className="footer-separator">·</span> Demo environment — do not enter real patient information</footer>
        </div>
      </main>
    </div>
  );
}

function WelcomePage({ onSignIn }) {
  return (
    <main className="welcome-screen">
      <header className="welcome-header">
        <a className="university-brand" href="#welcome">
          <img className="university-mark" alt="" src="/logo-mekdela-amba.png" />
          <span><strong>Mekdela Amba University</strong><small>CLINIC MANAGEMENT SYSTEM</small></span>
        </a>
        <span className="campus-label">HEALTH SERVICES</span>
      </header>
      <section className="welcome-layout">
        <div className="welcome-left">
          <div className="welcome-content">
            <div className="welcome-emblem"><img alt="" src="/logo-mekdela-amba.png" /></div>
            <div className="eyebrow">MEKDELA AMBA UNIVERSITY · HEALTH SERVICES</div>
            <h1>Welcome to<br /><span>Mekdela Amba University</span></h1>
            <p className="welcome-subtitle">Clinic Management System</p>
            <p>A coordinated workspace for university clinic services, patient care, and pharmacy management.</p>
            <div className="welcome-note"><span aria-hidden="true">✦</span> Supporting a healthier university community</div>
          </div>
          <div className="welcome-visual" aria-label="Mekdela Amba University campus">
            <img alt="Mekdela Amba University campus" src="/mekdela-campus.jpg" />
          </div>
        </div>
        <SignInForm onSignIn={onSignIn} />
      </section>
      <footer className="welcome-footer">MEKDELA AMBA UNIVERSITY <span>·</span> HEALTH SERVICES</footer>
    </main>
  );
}

function SignInForm({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password.trim()) {
      setError('Enter both your email address and password to continue.');
      return;
    }
    onSignIn({ name: trimmedEmail.split('@')[0], role: 'University staff' });
  }

  return (
    <div className="signin-card">
      <div className="login-kicker">UNIVERSITY HEALTH SERVICES</div>
      <h2>Sign in</h2>
      <p className="login-copy">Use your university account to continue.</p>
      <form className="form-stack" onSubmit={submit}>
        <label htmlFor="login-email">Email address
          <input autoComplete="username" id="login-email" onChange={(event) => { setEmail(event.target.value); setError(''); }} placeholder="name@university.edu" required type="email" value={email} />
        </label>
        <label htmlFor="login-password">Password
          <input autoComplete="current-password" id="login-password" onChange={(event) => { setPassword(event.target.value); setError(''); }} placeholder="Enter your password" required type="password" value={password} />
        </label>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="welcome-button login-submit" type="submit">Sign in <span aria-hidden="true">→</span></button>
      </form>
      <div className="login-divider"><span>OR</span></div>
      <button className="guest-sign-in" onClick={() => onSignIn({ name: 'Guest', role: 'Guest access' })} type="button">
        Sign in without an account
      </button>
      <p className="privacy-note"><span aria-hidden="true">ⓘ</span> Demo sign-in only. Credentials are not verified or stored.</p>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

function Dashboard({ data, onNavigate }) {
  const waiting = data.patients.filter((patient) => patient.status === 'Waiting');
  const pendingLeaves = data.leaves.filter((leave) => leave.status === 'Pending').length;
  const lowStock = data.inventory.filter((item) => item.quantity <= item.reorder);
  return (
    <>
      <PageHeading eyebrow="MONDAY, OCTOBER 26, 2026" title="Good morning" description="Here’s what’s happening at your clinic today." action={<button className="button button-primary" onClick={() => onNavigate('patients')} type="button"><span>＋</span> Register patient</button>} />
      <div className="demo-banner"><span className="banner-icon">i</span><span><strong>Demo workspace</strong> — All information is sample data saved only in this browser.</span><button type="button" aria-label="Dismiss">×</button></div>
      <div className="stat-grid">
        <StatCard label="Patients today" value={data.patients.length} detail="Registered in this workspace" icon="♡" color="mint" />
        <StatCard label="Waiting for care" value={waiting.length} detail="Patients in the queue" icon="◷" color="blue" />
        <StatCard label="Pending leave" value={pendingLeaves} detail="Awaiting review" icon="▤" color="amber" />
        <StatCard label="Low stock items" value={lowStock.length} detail="At or below reorder level" icon="⚕" color="rose" />
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading"><div><h2>Patient queue</h2><p>Patients waiting to be seen</p></div><button className="text-button" onClick={() => onNavigate('doctor')} type="button">Open workspace <span>→</span></button></div>
          <PatientRows patients={waiting.slice(0, 4)} />
          {waiting.length === 0 && <EmptyState title="Queue is clear" body="Newly registered patients will appear here." />}
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h2>Pharmacy watch</h2><p>Items that may need restocking</p></div><button className="text-button" onClick={() => onNavigate('pharmacy')} type="button">View inventory <span>→</span></button></div>
          {lowStock.length ? lowStock.slice(0, 3).map((item) => <div className="stock-watch" key={item.id}><span className="medicine-icon">Rx</span><span className="stock-name"><strong>{item.name}</strong><small>Reorder at {item.reorder} units</small></span><span className="stock-count">{item.quantity} left</span></div>) : <EmptyState title="Stock levels look good" body="No items are below their reorder level." />}
        </section>
      </div>
      <section className="panel quick-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Jump into a common clinic task</p></div></div><div className="quick-actions"><QuickAction icon="＋" title="Register patient" onClick={() => onNavigate('patients')} /><QuickAction icon="✚" title="Start consultation" onClick={() => onNavigate('doctor')} /><QuickAction icon="▤" title="Review sick leave" onClick={() => onNavigate('leave')} /><QuickAction icon="⚕" title="Dispense medicine" onClick={() => onNavigate('pharmacy')} /></div></section>
    </>
  );
}

function StatCard({ label, value, detail, icon, color }) {
  return <article className="stat-card"><span className={`stat-icon ${color}`}>{icon}</span><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></article>;
}

function QuickAction({ icon, title, onClick }) {
  return <button className="quick-action" onClick={onClick} type="button"><span>{icon}</span><strong>{title}</strong><i>→</i></button>;
}

function PatientsPage({ data, updateData, notify }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const patients = data.patients.filter((patient) => {
    const matchQuery = `${patient.name} ${patient.id} ${patient.phone}`.toLowerCase().includes(query.toLowerCase());
    return matchQuery && (status === 'All statuses' || patient.status === status);
  });
  function addPatient(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patient = { id: makeId('P'), name: form.get('name').trim(), age: Number(form.get('age')), sex: form.get('sex'), phone: form.get('phone').trim(), status: 'Waiting', visits: [] };
    updateData((current) => ({ ...current, patients: [patient, ...current.patients] }));
    setShowForm(false);
    notify(`${patient.name} added to the patient list.`);
  }
  return (
    <>
      <PageHeading eyebrow="CARE DIRECTORY" title="Patients" description="Search and manage your clinic’s patient records." action={<button className="button button-primary" onClick={() => setShowForm(true)} type="button"><span>＋</span> Add patient</button>} />
      <section className="panel">
        <div className="toolbar"><label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search patients" onChange={(event) => setQuery(event.target.value)} placeholder="Search name, patient ID or phone" value={query} /></label><select aria-label="Filter by status" className="filter-select" onChange={(event) => setStatus(event.target.value)} value={status}><option>All statuses</option><option>Waiting</option><option>In consultation</option><option>Completed</option></select><span className="result-count">{patients.length} patients</span></div>
        <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Patient ID</th><th>Age / Sex</th><th>Phone</th><th>Status</th><th></th></tr></thead><tbody>{patients.map((patient) => <tr key={patient.id}><td><button className="patient-link" onClick={() => setSelected(patient)} type="button"><span className="avatar table-avatar">{patient.name.slice(0, 1)}</span><strong>{patient.name}</strong></button></td><td className="muted-cell">{patient.id}</td><td>{patient.age} <span className="muted-cell">/ {patient.sex}</span></td><td>{patient.phone}</td><td><StatusBadge value={patient.status} /></td><td><button aria-label={`View ${patient.name}`} className="row-action" onClick={() => setSelected(patient)} type="button">View ↗</button></td></tr>)}</tbody></table>{patients.length === 0 && <EmptyState title="No patients found" body="Try another search or add a patient record." />}</div>
      </section>
      {showForm && <Modal title="Register a patient" onClose={() => setShowForm(false)}><form className="form-stack" onSubmit={addPatient}><label>Full name<input autoFocus name="name" placeholder="Patient name" required /></label><div className="form-row"><label>Age<input max="120" min="0" name="age" required type="number" /></label><label>Sex<select name="sex"><option>Female</option><option>Male</option><option>Other</option></select></label></div><label>Phone number<input name="phone" placeholder="Phone number" required /></label><div className="form-actions"><button className="button button-quiet" onClick={() => setShowForm(false)} type="button">Cancel</button><button className="button button-primary" type="submit">Save patient</button></div></form></Modal>}
      {selected && <Modal title="Patient record" onClose={() => setSelected(null)}><div className="patient-record"><div className="record-person"><span className="avatar record-avatar">{selected.name.slice(0, 1)}</span><div><h3>{selected.name}</h3><p>{selected.id} · {selected.age} years · {selected.sex}</p></div></div><div className="record-line"><span>Phone</span><strong>{selected.phone}</strong></div><div className="record-line"><span>Queue status</span><StatusBadge value={selected.status} /></div><h4>Consultation history</h4>{selected.visits?.length ? selected.visits.map((visit) => <div className="visit-note" key={visit.id}><strong>{visit.date}</strong><p>{visit.diagnosis}</p><small>{visit.notes}</small></div>) : <p className="empty-history">No consultation notes have been recorded.</p>}</div></Modal>}
    </>
  );
}

function ConsultationsPage({ data, updateData, notify }) {
  const eligible = data.patients.filter((patient) => patient.status !== 'Completed');
  const [selectedId, setSelectedId] = useState(eligible[0]?.id ?? '');
  const selected = data.patients.find((patient) => patient.id === selectedId);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicine, setMedicine] = useState('');
  const [instructions, setInstructions] = useState('');
  function saveConsultation(event) {
    event.preventDefault();
    if (!selected || !diagnosis.trim()) return;
    const visit = { id: makeId('V'), date: today(), diagnosis: diagnosis.trim(), notes: notes.trim() };
    const prescription = medicine.trim() ? { id: makeId('RX'), patientId: selected.id, patientName: selected.name, medicine: medicine.trim(), instructions: instructions.trim(), date: today(), status: 'Ready' } : null;
    updateData((current) => ({
      ...current,
      patients: current.patients.map((patient) => patient.id === selected.id ? { ...patient, status: 'Completed', visits: [visit, ...(patient.visits || [])] } : patient),
      prescriptions: prescription ? [prescription, ...current.prescriptions] : current.prescriptions,
    }));
    setDiagnosis(''); setNotes(''); setMedicine(''); setInstructions('');
    notify(prescription ? 'Consultation saved and prescription sent to pharmacy.' : 'Consultation saved.');
  }
  return (
    <>
      <PageHeading eyebrow="CLINICAL WORKSPACE" title="Consultations" description="Review the queue, record clinical notes and prepare prescriptions." />
      <div className="consult-grid">
        <section className="panel queue-panel"><div className="panel-heading"><div><h2>Patient queue</h2><p>{eligible.length} waiting for care</p></div><span className="queue-count">{eligible.length}</span></div><PatientRows patients={eligible} selectedId={selectedId} onSelect={setSelectedId} />{eligible.length === 0 && <EmptyState title="Queue is clear" body="Register a patient to start a consultation." />}</section>
        <section className="panel consultation-panel">
          {selected ? <><div className="patient-summary"><span className="avatar record-avatar">{selected.name.slice(0, 1)}</span><div><div className="eyebrow">CURRENT PATIENT</div><h2>{selected.name}</h2><p>{selected.id} <span>·</span> {selected.age} years <span>·</span> {selected.sex}</p></div><StatusBadge value={selected.status} /></div>
            {selected.visits?.[0] && <div className="last-visit"><strong>Previous diagnosis</strong><span>{selected.visits[0].diagnosis}</span></div>}
            <form className="form-stack consultation-form" onSubmit={saveConsultation}><label>Diagnosis <span className="required">*</span><textarea onChange={(event) => setDiagnosis(event.target.value)} placeholder="Enter clinical diagnosis" required rows="3" value={diagnosis} /></label><label>Clinical notes<textarea onChange={(event) => setNotes(event.target.value)} placeholder="Symptoms, observations and care plan" rows="3" value={notes} /></label><div className="form-divider"><span>OPTIONAL PRESCRIPTION</span></div><label>Medication<input onChange={(event) => setMedicine(event.target.value)} placeholder="e.g. Paracetamol 500 mg" value={medicine} /></label>{medicine && <label>Instructions<input onChange={(event) => setInstructions(event.target.value)} placeholder="e.g. 1 tablet every 8 hours" value={instructions} /></label>}<div className="form-actions"><button className="button button-primary" type="submit">Save consultation <span>→</span></button></div></form>
          </> : <EmptyState title="Select a patient" body="Choose someone in the queue to open a consultation." />}
        </section>
      </div>
    </>
  );
}

function LeavePage({ data, updateData, notify }) {
  const [showForm, setShowForm] = useState(false);
  function requestLeave(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patient = data.patients.find((item) => item.id === form.get('patientId'));
    if (!patient) return;
    const leave = { id: makeId('SL'), patientId: patient.id, patientName: patient.name, from: form.get('from'), to: form.get('to'), reason: form.get('reason').trim(), status: 'Pending', created: today() };
    updateData((current) => ({ ...current, leaves: [leave, ...current.leaves] }));
    setShowForm(false);
    notify('Sick leave request submitted for review.');
  }
  function decide(id, status) {
    updateData((current) => ({ ...current, leaves: current.leaves.map((leave) => leave.id === id ? { ...leave, status } : leave) }));
    notify(`Request ${status.toLowerCase()}.`);
  }
  const pending = data.leaves.filter((leave) => leave.status === 'Pending');
  const reviewed = data.leaves.filter((leave) => leave.status !== 'Pending');
  return (
    <>
      <PageHeading eyebrow="STUDENT HEALTH SERVICES" title="Sick leave" description="Create requests and review medical leave certificates." action={<button className="button button-primary" onClick={() => setShowForm(true)} type="button"><span>＋</span> New request</button>} />
      <div className="leave-overview"><span className="leave-overview-icon">▤</span><div><strong>{pending.length} request{pending.length === 1 ? '' : 's'} awaiting review</strong><p>Approved certificates can be printed for the patient.</p></div></div>
      <section className="panel"><div className="panel-heading"><div><h2>Requests to review</h2><p>Review details before approving or declining</p></div></div>{pending.length ? <div className="leave-list">{pending.map((leave) => <LeaveCard key={leave.id} leave={leave} onDecide={decide} />)}</div> : <EmptyState title="Nothing to review" body="New leave requests will appear here." />}</section>
      <section className="panel reviewed-panel"><div className="panel-heading"><div><h2>Reviewed requests</h2><p>Previously approved or declined</p></div></div>{reviewed.length ? <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Dates</th><th>Reason</th><th>Status</th><th></th></tr></thead><tbody>{reviewed.map((leave) => <tr key={leave.id}><td><strong>{leave.patientName}</strong><div className="muted-cell">{leave.id}</div></td><td>{leave.from} — {leave.to}</td><td>{leave.reason}</td><td><StatusBadge value={leave.status} /></td><td>{leave.status === 'Approved' && <button className="row-action" onClick={() => window.print()} type="button">Print certificate ↗</button>}</td></tr>)}</tbody></table></div> : <EmptyState title="No reviewed requests yet" body="Approved and declined requests will be listed here." />}</section>
      {showForm && <Modal title="New sick leave request" onClose={() => setShowForm(false)}><form className="form-stack" onSubmit={requestLeave}><label>Patient<select name="patientId" required defaultValue=""><option disabled value="">Select a patient</option>{data.patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>)}</select></label><div className="form-row"><label>From<input min={today()} name="from" required type="date" /></label><label>To<input min={today()} name="to" required type="date" /></label></div><label>Medical reason<input name="reason" placeholder="Brief reason for leave" required /></label><div className="form-actions"><button className="button button-quiet" onClick={() => setShowForm(false)} type="button">Cancel</button><button className="button button-primary" type="submit">Submit request</button></div></form></Modal>}
    </>
  );
}

function LeaveCard({ leave, onDecide }) {
  return <article className="leave-card"><div className="leave-person"><span className="avatar table-avatar">{leave.patientName.slice(0, 1)}</span><div><strong>{leave.patientName}</strong><small>{leave.id} · Submitted {leave.created}</small></div></div><div className="leave-dates"><small>REQUESTED PERIOD</small><strong>{leave.from} <span>→</span> {leave.to}</strong></div><div className="leave-reason"><small>REASON</small><span>{leave.reason}</span></div><div className="leave-actions"><button className="button button-quiet button-danger" onClick={() => onDecide(leave.id, 'Declined')} type="button">Decline</button><button className="button button-primary" onClick={() => onDecide(leave.id, 'Approved')} type="button">Approve</button></div></article>;
}

function PharmacyPage({ data, updateData, notify }) {
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedRx, setSelectedRx] = useState('');
  const available = data.prescriptions.filter((prescription) => prescription.status === 'Ready');
  const stock = data.inventory.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()));
  function addMedicine(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const medicine = { id: makeId('M'), name: form.get('name').trim(), category: form.get('category').trim(), quantity: Number(form.get('quantity')), reorder: Number(form.get('reorder')), expiry: form.get('expiry') };
    updateData((current) => ({ ...current, inventory: [medicine, ...current.inventory] }));
    setShowAdd(false);
    notify(`${medicine.name} added to inventory.`);
  }
  function dispense(event) {
    event.preventDefault();
    const prescription = data.prescriptions.find((item) => item.id === selectedRx);
    if (!prescription) return;
    const medicine = data.inventory.find((item) => item.name.toLowerCase() === prescription.medicine.toLowerCase());
    if (!medicine) { notify('This medicine is not in the inventory. Add or restock it before dispensing.'); return; }
    if (medicine.quantity < 1) { notify('This item is out of stock. Restock it before dispensing.'); return; }
    updateData((current) => ({
      ...current,
      inventory: current.inventory.map((item) => item.id === medicine.id ? { ...item, quantity: item.quantity - 1 } : item),
      prescriptions: current.prescriptions.map((item) => item.id === prescription.id ? { ...item, status: 'Dispensed', dispensed: today() } : item),
    }));
    setSelectedRx('');
    notify(`Dispensed ${prescription.medicine} for ${prescription.patientName}.`);
  }
  return (
    <>
      <PageHeading eyebrow="MEDICINE & SUPPLIES" title="Pharmacy" description="Track medicine stock and fulfill prescriptions from consultations." action={<button className="button button-primary" onClick={() => setShowAdd(true)} type="button"><span>＋</span> Add medicine</button>} />
      <div className="pharmacy-stats"><div className="mini-stat"><span>Total items</span><strong>{data.inventory.length}</strong></div><div className="mini-stat"><span>Units in stock</span><strong>{data.inventory.reduce((sum, item) => sum + item.quantity, 0)}</strong></div><div className="mini-stat"><span>Low stock</span><strong className={data.inventory.some((item) => item.quantity <= item.reorder) ? 'warning-text' : ''}>{data.inventory.filter((item) => item.quantity <= item.reorder).length}</strong></div><div className="mini-stat"><span>Ready prescriptions</span><strong>{available.length}</strong></div></div>
      <section className="panel dispense-panel"><div className="panel-heading"><div><h2>Dispense prescription</h2><p>Dispensing reduces the matching inventory by one unit.</p></div></div><form className="dispense-form" onSubmit={dispense}><label className="search-box"><span aria-hidden="true">Rx</span><select aria-label="Choose prescription" onChange={(event) => setSelectedRx(event.target.value)} required value={selectedRx}><option value="">Select a ready prescription</option>{available.map((rx) => <option key={rx.id} value={rx.id}>{rx.patientName} — {rx.medicine} ({rx.instructions || 'No instructions'})</option>)}</select></label><button className="button button-primary" disabled={!available.length} type="submit">Dispense medicine <span>→</span></button></form>{!available.length && <p className="form-hint">No prescriptions are waiting. Add one from the Consultations workspace.</p>}</section>
      <section className="panel"><div className="panel-heading"><div><h2>Medicine inventory</h2><p>Monitor quantities and expiry dates</p></div></div><div className="toolbar"><label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search inventory" onChange={(event) => setQuery(event.target.value)} placeholder="Search medicine or category" value={query} /></label><span className="result-count">{stock.length} items</span></div><div className="table-wrap"><table><thead><tr><th>Medicine</th><th>Category</th><th>In stock</th><th>Reorder at</th><th>Expiry date</th><th>Status</th></tr></thead><tbody>{stock.map((item) => <tr key={item.id}><td><span className="medicine-icon">Rx</span><strong>{item.name}</strong></td><td>{item.category}</td><td><strong>{item.quantity}</strong> units</td><td>{item.reorder} units</td><td>{item.expiry}</td><td><StatusBadge value={item.quantity <= item.reorder ? 'Low stock' : 'In stock'} /></td></tr>)}</tbody></table>{!stock.length && <EmptyState title="No medicines found" body="Try another search term." />}</div></section>
      <section className="panel prescription-history"><div className="panel-heading"><div><h2>Recent prescriptions</h2><p>Medication orders recorded during consultations</p></div></div>{data.prescriptions.length ? <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Medication</th><th>Instructions</th><th>Date</th><th>Status</th></tr></thead><tbody>{data.prescriptions.map((rx) => <tr key={rx.id}><td><strong>{rx.patientName}</strong></td><td>{rx.medicine}</td><td>{rx.instructions || '—'}</td><td>{rx.date}</td><td><StatusBadge value={rx.status} /></td></tr>)}</tbody></table></div> : <EmptyState title="No prescriptions yet" body="Prescriptions saved in consultations will appear here." />}</section>
      {showAdd && <Modal title="Add medicine to inventory" onClose={() => setShowAdd(false)}><form className="form-stack" onSubmit={addMedicine}><label>Medicine name<input autoFocus name="name" placeholder="e.g. Paracetamol 500 mg" required /></label><label>Category<input name="category" placeholder="e.g. Pain relief" required /></label><div className="form-row"><label>Quantity<input min="0" name="quantity" required type="number" /></label><label>Reorder level<input min="0" name="reorder" required type="number" /></label></div><label>Expiry date<input min={today()} name="expiry" required type="date" /></label><div className="form-actions"><button className="button button-quiet" onClick={() => setShowAdd(false)} type="button">Cancel</button><button className="button button-primary" type="submit">Save medicine</button></div></form></Modal>}
    </>
  );
}

function PatientRows({ patients, selectedId, onSelect }) {
  return <div className="patient-rows">{patients.map((patient, index) => <button className={`patient-row ${selectedId === patient.id ? 'selected' : ''}`} key={patient.id} onClick={() => onSelect?.(patient.id)} type="button"><span className={`avatar queue-avatar avatar-tone-${index % 4}`}>{patient.name.slice(0, 1)}</span><span className="patient-row-info"><strong>{patient.name}</strong><small>{patient.id} · {patient.age} years</small></span><StatusBadge value={patient.status} /><span className="row-chevron">›</span></button>)}</div>;
}

function StatusBadge({ value }) {
  const normalized = value.toLowerCase().replaceAll(' ', '-');
  return <span className={`badge badge-${normalized}`}>{value}</span>;
}

function EmptyState({ title, body }) {
  return <div className="empty-state"><span className="empty-icon">⌕</span><strong>{title}</strong><p>{body}</p></div>;
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    function onKeyDown(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section aria-labelledby="modal-title" aria-modal="true" className="modal-card" role="dialog"><div className="modal-heading"><h2 id="modal-title">{title}</h2><button aria-label="Close dialog" className="icon-button" onClick={onClose} type="button">×</button></div>{children}</section></div>;
}

export default App;
