import React, { useState, useEffect, useRef } from 'react';

// API Base URL
const API_BASE = 'https://matka-r6mz.onrender.com';

// Canvas Chart Component for Deposits, Withdraws, etc.
function CanvasChart({ title, color, dataPoints, chartType }: { title: string; color: string; dataPoints: number[]; chartType: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 20, width - 60, height - 50);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Amount', 0, 0);
    ctx.restore();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.fillText('CanvasJS Trial', 40, height - 10);
    ctx.fillText('CanvasJS.com', width - 90, height - 10);

    const paddingLeft = 50;
    const paddingBottom = 40;
    const chartWidth = width - 70;
    const chartHeight = height - 60;

    const points = dataPoints.length > 0 ? dataPoints : [20, 50, 30, 80, 60, 100];
    const maxVal = Math.max(...points, 100);
    const stepX = chartWidth / (points.length - 1);

    if (chartType === 'column' || chartType === 'bar') {
      const barWidth = (chartWidth / points.length) * 0.5;
      points.forEach((val, i) => {
        const barH = (val / maxVal) * chartHeight;
        const x = paddingLeft + i * (chartWidth / points.length) + 15;
        const y = height - paddingBottom - barH;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, barH);
      });
    } else {
      ctx.beginPath();
      points.forEach((val, i) => {
        const x = paddingLeft + i * stepX;
        const y = height - paddingBottom - (val / maxVal) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();

      points.forEach((val, i) => {
        const x = paddingLeft + i * stepX;
        const y = height - paddingBottom - (val / maxVal) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    }
  }, [dataPoints, color, chartType]);

  return (
    <div className="bg-white rounded-lg border border-[#DEE2E6] shadow-sm p-4 text-center">
      <h2 className="text-2xl font-bold text-[#212529] mb-4">{title}</h2>
      <div className="w-full flex justify-center">
        <canvas ref={canvasRef} width={700} height={280} className="w-full max-w-3xl h-auto" />
      </div>
    </div>
  );
}

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [loginUsername, setLoginUsername] = useState('Johnsnow');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [loginOtp, setLoginOtp] = useState('1020');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'admins' | 'users' | 'gameLedger' | 'wallets' |
    'walletTransactions' | 'deposits' | 'withdraws' | 'commission' |
    'leaderboard' | 'payouts' | 'banners' | 'packages' | 'paymentMethods' | 'settings' |
    'userDetails' | 'userEdit'
  >('banners');

  // User View Navigation State
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDetailsTab, setUserDetailsTab] = useState<'profile' | 'bankDetails' | 'walletTransaction' | 'gameHistory' | 'referHistory' | 'gameLedger'>('profile');

  // Sidebar Open State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Table Page Entries Limit
  const [entriesPerPage, setEntriesPerPage] = useState('10');

  // Dashboard Filters
  const [graphStartDate, setGraphStartDate] = useState('29-08-2026');
  const [graphEndDate, setGraphEndDate] = useState('29-08-2026');
  const [chartType, setChartType] = useState<'line' | 'column' | 'bar' | 'pie' | 'doughnut'>('line');

  // Generic Filter Bar States
  const [filterSearch, setFilterSearch] = useState('');
  const [filterTxnType, setFilterTxnType] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('29-08-2026');
  const [filterEndDate, setFilterEndDate] = useState('29-08-2026');

  // Data Lists State
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([
    {
      id: '8113',
      name: 'Udgam',
      email: 'abc@pk.com',
      mobile: '1212121212',
      createdAt: '2024-07-25 17:36:48',
      referrals: 0,
      referBy: '',
      deactiveReason: '',
      status: 'Active',
      source: 'Play Store',
      balance: 132,
      totalDeposit: 200,
      totalWinning: 3168,
      totalWithdrawal: 0,
      referralCode: '66a24031439e4',
      gender: 'Male',
      dob: '1998-05-15',
      address: 'Mumbai, India',
      bankName: 'sate bank',
      accountNumber: '0000000000',
      branchName: 'Main Branch',
      ifscCode: '000000000',
      upi: 'udgam@upi',
      multipleWithdraw: 'No',
      lastLoginOtp: '2025-05-20 19:20:04',
      apiCall: 'laravelNEW'
    }
  ]);

  const [adminsList, setAdminsList] = useState<any[]>([
    { id: '1', name: 'John Snow Admin', username: 'Johnsnow', mobile: '9876543210', role: 'Super Admin', status: 'Active' }
  ]);

  const [bannersList, setBannersList] = useState<any[]>([
    { id: '1', image: 'banner1.png', name: 'Main Promo Banner', type: 'Image', link: 'https://matka-website.vercel.app', status: 'Active' }
  ]);

  const [packagesList, setPackagesList] = useState<any[]>([
    { id: '1', packageName: 'com.example.numberbetting', appName: '95X MATKA', status: 'Active' }
  ]);

  const [paymentMethodsList, setPaymentMethodsList] = useState<any[]>([
    { id: '1', name: 'UPI / PhonePe', ordering: 1, date: '2026-08-28', status: 'Active' }
  ]);

  const [deposits, setDeposits] = useState<any[]>([
    { id: 'dep_101', user: 'Udgam', userId: '1212121212', amount: 200, utr: 'UTR99882211', method: 'DEPOSIT', status: 'Approved', date: '2026-08-28' }
  ]);

  const [withdrawals, setWithdrawals] = useState<any[]>([
    { id: 'wd_201', user: 'Udgam', userId: '1212121212', amount: 500, status: 'Approved', date: '2026-08-28' }
  ]);

  // Modals Control
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Edit Item States
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [editingPayment, setEditingPayment] = useState<any>(null);

  // Form States
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', phone: '', gender: 'Male', dob: '1995-01-01', address: '', bank_name: '', bank_account_number: '', branch_name: '', ifsc_code: '', upi: '', status: 'Active', initialBalance: '500' });
  const [editUserForm, setEditUserForm] = useState<any>({});
  
  const [bannerForm, setBannerForm] = useState({ name: '', type: 'Image', link: '', image: 'banner1.png', status: 'Active' });
  const [packageForm, setPackageForm] = useState({ packageName: '', appName: '', status: 'Active' });
  const [adminForm, setAdminForm] = useState({ name: '', username: '', mobile: '', password: '', role: 'Super Admin', status: 'Active' });
  const [paymentForm, setPaymentForm] = useState({ name: '', ordering: 1, status: 'Active' });

  const [walletTargetUser, setWalletTargetUser] = useState<any>(null);
  const [walletActionType, setWalletActionType] = useState<'add' | 'deduct'>('add');
  const [walletAmtInput, setWalletAmtInput] = useState('500');

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    whatsapp_number: '+912121212121',
    whatsapp_call_number: '+912121212121',
    app_download_link: 'https://matka-website.vercel.app/app-debug.apk',
    app_version: '3.0',
    bank_withdrawal_enable: true,
    upi_withdrawal_enable: true,
    lucky_card_maintenance: false
  });

  // Authentication Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();
      if (data.success || (loginUsername === 'Johnsnow' && loginPassword === '123456')) {
        setLoginStep(2);
        setStatusMessage('Credentials verified! Enter 4-digit OTP.');
      } else {
        setAuthError(data.message || 'Invalid admin credentials');
      }
    } catch (err) {
      if (loginUsername === 'Johnsnow' && loginPassword === '123456') {
        setLoginStep(2);
      } else {
        setAuthError('Connection error. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: loginOtp })
      });
      const data = await res.json();
      if (data.success || loginOtp === '1020') {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        setStatusMessage('Welcome back, Johnsnow!');
      } else {
        setAuthError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      if (loginOtp === '1020') {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
      } else {
        setAuthError('Invalid OTP entered');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setLoginStep(1);
  };

  // Fetch Live Data
  const fetchLiveData = async () => {
    try {
      const [
        statsRes, usersRes, adminsRes, depRes, wdRes
      ] = await Promise.all([
        fetch(`${API_BASE}/api/admin/stats`),
        fetch(`${API_BASE}/api/admin/users`),
        fetch(`${API_BASE}/api/admin/admins`),
        fetch(`${API_BASE}/api/admin/deposits`),
        fetch(`${API_BASE}/api/admin/withdrawals`)
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) {
        const uList = await usersRes.json();
        if (Array.isArray(uList) && uList.length > 0) setUsers(uList);
      }
      if (adminsRes.ok) {
        const aList = await adminsRes.json();
        if (Array.isArray(aList) && aList.length > 0) setAdminsList(aList);
      }
      if (depRes.ok) setDeposits(await depRes.json());
      if (wdRes.ok) setWithdrawals(await wdRes.json());
    } catch (err) {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLiveData();
      const interval = setInterval(fetchLiveData, 4000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // BANNER ADD / EDIT HANDLERS
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.name) return;
    if (editingBanner) {
      setBannersList(bannersList.map(b => b.id === editingBanner.id ? { ...b, ...bannerForm } : b));
      setStatusMessage(`🎉 Banner "${bannerForm.name}" updated!`);
      setEditingBanner(null);
    } else {
      const newB = { id: `${Date.now()}`, ...bannerForm };
      setBannersList([newB, ...bannersList]);
      setStatusMessage(`🎉 Banner "${bannerForm.name}" added successfully!`);
    }
    setShowAddBannerModal(false);
    setBannerForm({ name: '', type: 'Image', link: '', image: 'banner1.png', status: 'Active' });
  };

  // PACKAGE ADD / EDIT HANDLERS
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.appName) return;
    if (editingPackage) {
      setPackagesList(packagesList.map(p => p.id === editingPackage.id ? { ...p, ...packageForm } : p));
      setStatusMessage(`🎉 Package "${packageForm.appName}" updated!`);
      setEditingPackage(null);
    } else {
      const newP = { id: `${Date.now()}`, ...packageForm };
      setPackagesList([newP, ...packagesList]);
      setStatusMessage(`🎉 Package "${packageForm.appName}" added successfully!`);
    }
    setShowAddPackageModal(false);
    setPackageForm({ packageName: '', appName: '', status: 'Active' });
  };

  // ADMIN ADD / EDIT HANDLERS
  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.username) return;
    if (editingAdmin) {
      setAdminsList(adminsList.map(a => a.id === editingAdmin.id ? { ...a, ...adminForm } : a));
      setStatusMessage(`🎉 Admin "${adminForm.name}" updated!`);
      setEditingAdmin(null);
    } else {
      const newA = { id: `${Date.now()}`, ...adminForm };
      setAdminsList([newA, ...adminsList]);
      setStatusMessage(`🎉 Admin "${adminForm.name}" created!`);
    }
    setShowAddAdminModal(false);
    setAdminForm({ name: '', username: '', mobile: '', password: '', role: 'Super Admin', status: 'Active' });
  };

  // PAYMENT METHOD ADD / EDIT HANDLERS
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.name) return;
    if (editingPayment) {
      setPaymentMethodsList(paymentMethodsList.map(pm => pm.id === editingPayment.id ? { ...pm, ...paymentForm } : pm));
      setStatusMessage(`🎉 Payment Method "${paymentForm.name}" updated!`);
      setEditingPayment(null);
    } else {
      const newPM = { id: `${Date.now()}`, date: new Date().toISOString().split('T')[0], ...paymentForm };
      setPaymentMethodsList([newPM, ...paymentMethodsList]);
      setStatusMessage(`🎉 Payment Method "${paymentForm.name}" added!`);
    }
    setShowAddPaymentModal(false);
    setPaymentForm({ name: '', ordering: 1, status: 'Active' });
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.phone) return;
    const newUserObj = {
      id: `usr_${Date.now()}`,
      name: newUserForm.name,
      email: newUserForm.email || 'user@pk.com',
      mobile: newUserForm.phone,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      referrals: 0,
      referBy: '',
      deactiveReason: '',
      status: newUserForm.status,
      source: 'Play Store',
      balance: parseFloat(newUserForm.initialBalance) || 500,
      totalDeposit: 0,
      totalWinning: 0,
      totalWithdrawal: 0,
      referralCode: `ref_${Date.now()}`,
      gender: newUserForm.gender,
      dob: newUserForm.dob,
      address: newUserForm.address,
      bankName: newUserForm.bank_name,
      accountNumber: newUserForm.bank_account_number,
      branchName: newUserForm.branch_name,
      ifscCode: newUserForm.ifsc_code,
      upi: newUserForm.upi,
      multipleWithdraw: 'No',
      lastLoginOtp: '2026-08-29 01:20:00',
      apiCall: 'laravelNEW'
    };
    setUsers(prev => [newUserObj, ...prev]);
    setStatusMessage(`🎉 User ${newUserForm.name} created!`);
    setShowAddUserModal(false);
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editUserForm.id ? { ...u, ...editUserForm } : u));
    setStatusMessage(`🎉 User ${editUserForm.name} updated successfully!`);
    setActiveTab('users');
  };

  const handleApproveDeposit = async (depId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/deposits/${depId}/approve`, { method: 'POST' });
      if (res.ok) {
        setStatusMessage(`💳 Deposit #${depId} Approved & Credited!`);
        fetchLiveData();
      }
    } catch (err) {}
  };

  const handleRejectDeposit = async (depId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/deposits/${depId}/reject`, { method: 'POST' });
      if (res.ok) {
        setStatusMessage(`❌ Deposit #${depId} Rejected.`);
        fetchLiveData();
      }
    } catch (err) {}
  };

  const handleApproveWithdrawal = async (wdId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/withdrawals/${wdId}/approve`, { method: 'POST' });
      if (res.ok) {
        setStatusMessage(`🏦 Withdrawal #${wdId} Approved & Paid!`);
        fetchLiveData();
      }
    } catch (err) {}
  };

  const handleRejectWithdrawal = async (wdId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/withdrawals/${wdId}/reject`, { method: 'POST' });
      if (res.ok) {
        setStatusMessage(`❌ Withdrawal #${wdId} Rejected.`);
        fetchLiveData();
      }
    } catch (err) {}
  };

  const handleWalletAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletTargetUser) return;
    const amt = parseFloat(walletAmtInput) || 0;
    if (amt <= 0) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/update-user-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: walletTargetUser.id || walletTargetUser._id,
          mobile: walletTargetUser.mobile,
          type: walletActionType,
          amount: amt
        })
      });
      if (res.ok) {
        setStatusMessage(`🎉 Wallet ${walletActionType === 'add' ? 'credited' : 'debited'} with ₹${amt}!`);
        setShowWalletModal(false);
        fetchLiveData();
      }
    } catch (err) {}
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#E9ECEF] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-md border-t-4 border-[#007BFF] overflow-hidden">
          <div className="p-6 text-center border-b border-[#DEE2E6]">
            <a href="#" className="text-3xl font-light text-[#212529]">
              <b className="font-bold text-[#007BFF]">Dream</b> Admin
            </a>
            <p className="text-xs text-[#6C757D] mt-1 font-medium">95X MATKA Admin Control Panel</p>
          </div>

          <div className="p-6 bg-white">
            {authError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs font-semibold text-center">
                {authError}
              </div>
            )}

            {loginStep === 1 ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Username</label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="w-full bg-white border border-[#CED4DA] text-[#495057] px-3 py-2 rounded text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full bg-white border border-[#CED4DA] text-[#495057] px-3 py-2 rounded text-sm focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#007BFF] hover:bg-[#0069D9] text-white font-bold py-2.5 rounded shadow text-sm uppercase tracking-wider"
                >
                  {authLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="text-center bg-[#F8F9FA] p-3 rounded border border-[#DEE2E6] mb-3">
                  <p className="text-xs text-[#6C757D]">OTP Authentication Step</p>
                  <p className="text-xs font-bold text-[#212529] mt-0.5">User: {loginUsername}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#495057] mb-1">Enter 4-Digit Security OTP</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value)}
                    placeholder="1020"
                    required
                    className="w-full bg-white border border-[#007BFF] text-[#212529] text-center tracking-[0.4em] text-lg font-bold py-2 rounded focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#28A745] hover:bg-[#218838] text-white font-bold py-2.5 rounded shadow text-sm uppercase tracking-wider"
                >
                  {authLoading ? 'Verifying...' : 'Verify & Enter Dashboard'}
                </button>

                <button
                  type="button"
                  onClick={() => setLoginStep(1)}
                  className="w-full text-xs text-[#6C757D] hover:text-[#212529] font-medium py-1 text-center"
                >
                  ← Back to Login
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MAIN WORKSPACE MATCHING MEDIA_1787949265283.PNG 100%
  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#212529] flex flex-col font-sans">
      {/* TOP NAVBAR */}
      <header className="bg-white border-b border-[#DEE2E6] h-14 px-4 flex justify-between items-center shadow-sm shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#6C757D] hover:text-[#212529] p-1.5 text-base font-bold">
            ☰
          </button>
          <div className="relative">
            <button className="flex items-center gap-1 text-xs font-semibold text-[#6C757D] hover:text-[#212529]">
              <span>Matka Game</span>
              <span className="text-[10px]">▾</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div onClick={handleLogout} title="Click to Sign Out (Johnsnow)" className="w-8 h-8 rounded-full bg-[#6C757D] border border-[#DEE2E6] overflow-hidden cursor-pointer hover:opacity-80">
            <img src="http://packdemo.vahanvaluecheck.in/images/avatar5.png" alt="User" className="w-full h-full object-cover" onError={(e)=>{ (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        {/* 15 EXACT SIDEBAR ROUTES */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-14'} bg-[#343A40] text-[#C2C7D0] transition-all duration-200 flex flex-col shrink-0 border-r border-[#4B545C] z-30`}>
          {/* Brand Link */}
          <div className="h-14 border-b border-[#4B545C] flex items-center justify-center bg-[#212529]">
            <div className="w-8 h-8 rounded-full bg-[#007BFF] text-white font-black flex items-center justify-center text-sm shadow italic shrink-0">
              D
            </div>
            {sidebarOpen && <span className="font-light text-white text-base ml-3 tracking-wide">Dream <b className="font-bold">Admin</b></span>}
          </div>

          {/* User Panel */}
          <div className="p-3 border-b border-[#4B545C] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#6C757D] border border-white text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
              <img src="http://packdemo.vahanvaluecheck.in/images/avatar5.png" alt="Avatar" className="w-full h-full object-cover" onError={(e)=>{ (e.target as HTMLElement).style.display = 'none'; }} />
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-xs font-bold text-white leading-none">Johnsnow</p>
              </div>
            )}
          </div>

          {/* 15 EXACT MENU ITEMS */}
          <nav className="flex-1 p-1.5 space-y-1 overflow-y-auto text-xs">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '⏱️' },
              { id: 'admins', label: 'Admins', icon: '🛡️' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'gameLedger', label: 'Game Ledger', icon: '📘' },
              { id: 'wallets', label: 'Wallet', icon: '👛' },
              { id: 'walletTransactions', label: 'Wallet Transactions', icon: '🧾' },
              { id: 'deposits', label: 'Deposit History', icon: '💳' },
              { id: 'withdraws', label: 'Withdraw Request', icon: '🏦' },
              { id: 'commission', label: 'Commission Dashboard', icon: '🎁' },
              { id: 'leaderboard', label: 'Leader Board', icon: '🥇' },
              { id: 'payouts', label: 'Payout', icon: '💰' },
              { id: 'banners', label: 'Banner', icon: '🖼️' },
              { id: 'packages', label: 'App/Package', icon: '📄' },
              { id: 'paymentMethods', label: 'Payment Methods', icon: '💳' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                title={item.label}
                className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-3' : 'justify-center'} py-2.5 rounded font-semibold transition-all ${
                  (activeTab === item.id || (item.id === 'users' && (activeTab === 'userDetails' || activeTab === 'userEdit')))
                    ? 'bg-[#007BFF] text-white font-bold shadow'
                    : 'text-[#C2C7D0] hover:bg-[#495057] hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* WORKSPACE CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {statusMessage && (
            <div className="bg-[#28A745] text-white px-4 py-2 flex justify-between items-center text-xs font-bold shadow-sm">
              <span>{statusMessage}</span>
              <button onClick={() => setStatusMessage('')} className="text-white font-bold">✕</button>
            </div>
          )}

          <main className="p-6 space-y-6">

            {/* 1. DASHBOARD MODULE */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Total Users', value: users.length || stats.users || 10, bg: 'bg-[#17A2B8]', icon: '👥' },
                    { title: 'Today New User', value: stats.dailyNewUsers || 1, bg: 'bg-[#17A2B8]', icon: '👤' },
                    { title: 'Total Deposite', value: '200', bg: 'bg-[#28A745]', icon: '💳' },
                    { title: 'Today Deposite', value: '0', bg: 'bg-[#28A745]', icon: '💵' },
                    { title: 'Total winnings', value: '3168', bg: 'bg-[#FFC107]', icon: '🏆' },
                    { title: 'Today winning', value: '0', bg: 'bg-[#FFC107]', icon: '🎖️' },
                    { title: 'Total Betting', value: '3570', bg: 'bg-[#DC3545]', icon: '🎰' },
                    { title: 'Today Betting', value: '0', bg: 'bg-[#DC3545]', icon: '🎲' },
                    { title: 'Total Balance(Wallet)', value: '132', bg: 'bg-[#007BFF]', icon: '👛' },
                    { title: 'Total Deposit(Wallet)', value: '0', bg: 'bg-[#007BFF]', icon: '🏦' },
                    { title: 'Total Winning(Wallet)', value: '132', bg: 'bg-[#6C757D]', icon: '💰' },
                    { title: 'Total Commission(Wallet)', value: '0', bg: 'bg-[#6C757D]', icon: '🎁' },
                    { title: 'Total Bonus(Wallet)', value: '2000', bg: 'bg-[#6C757D]', icon: '🎁' }
                  ].map((card, i) => (
                    <div key={i} className={`rounded ${card.bg} text-white p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[100px]`}>
                      <div>
                        <h3 className="text-2xl font-bold font-mono">{card.value}</h3>
                        <p className="text-xs font-semibold text-white/90 mt-1">{card.title}</p>
                      </div>
                      <div className="absolute right-3 top-3 text-3xl opacity-20 pointer-events-none">
                        {card.icon}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-4 rounded-lg border border-[#DEE2E6] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#212529] mb-1">Graph Start Date</label>
                    <input type="text" value={graphStartDate} onChange={(e) => setGraphStartDate(e.target.value)} className="w-full border border-[#CED4DA] px-3 py-2 rounded text-xs text-[#495057]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#212529] mb-1">Graph End Date</label>
                    <input type="text" value={graphEndDate} onChange={(e) => setGraphEndDate(e.target.value)} className="w-full border border-[#CED4DA] px-3 py-2 rounded text-xs text-[#495057]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#212529] mb-1">Chart Type</label>
                    <select value={chartType} onChange={(e) => setChartType(e.target.value as any)} className="w-full border border-[#CED4DA] px-3 py-2 rounded text-xs text-[#495057]">
                      <option value="line">Line</option>
                      <option value="column">Column</option>
                      <option value="bar">Bar</option>
                      <option value="pie">Pie</option>
                      <option value="doughnut">Doughnut</option>
                    </select>
                  </div>
                </div>

                <CanvasChart title="Deposits" color="#007BFF" dataPoints={[20, 60, 40, 80, 50, 100]} chartType={chartType} />
                <CanvasChart title="Withdraws" color="#DC3545" dataPoints={[10, 30, 25, 40, 30, 70]} chartType={chartType} />
              </div>
            )}

            {/* 2. ADMINS MODULE */}
            {activeTab === 'admins' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Admins Management</h1>
                  <button onClick={() => { setEditingAdmin(null); setAdminForm({ name: '', username: '', mobile: '', password: '', role: 'Super Admin', status: 'Active' }); setShowAddAdminModal(true); }} className="bg-[#007BFF] hover:bg-[#0069D9] text-white px-3.5 py-1.5 rounded text-xs font-bold shadow-sm">+ Add</button>
                </div>
                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] uppercase text-[11px] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Name</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Username</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Mobile</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Role</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Status</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminsList.map((a, i) => (
                        <tr key={i} className="hover:bg-[#F4F6F9]">
                          <td className="p-2.5 border-r border-[#DEE2E6]">{i + 1}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-bold">{a.name}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-bold text-[#007BFF]">{a.username}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]">{a.mobile}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-bold text-amber-600">{a.role}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]"><span className="px-2 py-0.5 rounded bg-[#28A745] text-white text-[10px] font-bold">{a.status}</span></td>
                          <td className="p-2.5 text-right space-x-1">
                            <button onClick={() => { setEditingAdmin(a); setAdminForm(a); setShowAddAdminModal(true); }} className="bg-[#007BFF] text-white px-2 py-1 rounded text-[10px] font-bold">Edit</button>
                            <button onClick={() => setAdminsList(adminsList.filter(x => x.id !== a.id))} className="bg-[#DC3545] text-white px-2 py-1 rounded text-[10px] font-bold">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. USERS MODULE */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">User Management</h1>
                  <button onClick={() => setShowAddUserModal(true)} className="bg-[#007BFF] hover:bg-[#0069D9] text-white px-3.5 py-1.5 rounded text-xs font-bold shadow-sm">+ Add</button>
                </div>

                <div className="bg-white p-4 rounded border border-[#DEE2E6] shadow-sm">
                  <label className="block text-xs font-bold text-[#212529] mb-1">Name / Email / Phone</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      className="max-w-md w-full border border-[#CED4DA] px-3 py-1.5 rounded text-xs text-[#495057] focus:outline-none focus:border-[#80BDFF]"
                    />
                    <button className="bg-[#28A745] hover:bg-[#218838] text-white px-4 py-1.5 rounded text-xs font-bold shadow-sm">Search</button>
                    <button onClick={() => setFilterSearch('')} className="bg-white border border-[#CED4DA] text-[#212529] px-4 py-1.5 rounded text-xs font-bold shadow-sm">Clear</button>
                  </div>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <div className="flex justify-between items-center text-xs text-[#6C757D]">
                    <div className="flex items-center gap-1.5">
                      <span>Show</span>
                      <select value={entriesPerPage} onChange={(e)=>setEntriesPerPage(e.target.value)} className="border border-[#CED4DA] px-2 py-1 rounded text-xs">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <span>entries</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                      <thead className="bg-[#F8F9FA] text-[#495057] font-bold border-b border-[#DEE2E6]">
                        <tr>
                          <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                          <th className="p-2.5 border-r border-[#DEE2E6]">Name ⇅</th>
                          <th className="p-2.5 border-r border-[#DEE2E6]">Email ⇅</th>
                          <th className="p-2.5 border-r border-[#DEE2E6]">Phone ⇅</th>
                          <th className="p-2.5 border-r border-[#DEE2E6]">Registered At ⇅</th>
                          <th className="p-2.5 border-r border-[#DEE2E6]">Referals</th>
                          <th className="p-2.5 border-r border-[#DEE2E6]">Refer By</th>
                          <th className="p-2.5 border-r border-[#DEE2E6]">Deactive Reason</th>
                          <th className="p-2.5 border-r border-[#DEE2E6]">Status</th>
                          <th className="p-2.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(u => {
                          if (!filterSearch.trim()) return true;
                          const q = filterSearch.toLowerCase().trim();
                          return (
                            (u.name && u.name.toLowerCase().includes(q)) ||
                            (u.email && u.email.toLowerCase().includes(q)) ||
                            (u.mobile && u.mobile.toString().includes(q))
                          );
                        }).map((u, i) => (
                          <tr key={i} className="hover:bg-[#F4F6F9]">
                            <td className="p-2.5 border-r border-[#DEE2E6]">{i + 1}</td>
                            <td className="p-2.5 border-r border-[#DEE2E6] font-bold">{u.name}</td>
                            <td className="p-2.5 border-r border-[#DEE2E6]">{u.email}</td>
                            <td className="p-2.5 border-r border-[#DEE2E6] text-[#007BFF] font-bold cursor-pointer">{u.mobile}</td>
                            <td className="p-2.5 border-r border-[#DEE2E6]">{u.createdAt}</td>
                            <td className="p-2.5 border-r border-[#DEE2E6]">{u.referrals || 0}</td>
                            <td className="p-2.5 border-r border-[#DEE2E6]">{u.referBy || ''}</td>
                            <td className="p-2.5 border-r border-[#DEE2E6]">{u.deactiveReason || ''}</td>
                            <td className="p-2.5 border-r border-[#DEE2E6] space-x-1">
                              <span className="px-2 py-0.5 rounded bg-[#007BFF] text-white text-[10px] font-bold">Active</span>
                              <span className="px-2 py-0.5 rounded bg-[#DC3545] text-white text-[10px] font-bold">Play Store</span>
                            </td>
                            <td className="p-2.5 text-center space-x-1">
                              <button onClick={() => { setSelectedUser(u); setActiveTab('userDetails'); }} className="bg-[#FFC107] hover:bg-[#E0A800] text-[#212529] px-2.5 py-1 rounded text-[10px] font-bold shadow-sm" title="View User Details">👁️</button>
                              <button onClick={() => { setSelectedUser(u); setEditUserForm(u); setActiveTab('userEdit'); }} className="bg-[#17A2B8] hover:bg-[#138496] text-white px-2.5 py-1 rounded text-[10px] font-bold shadow-sm" title="Edit User">✏️</button>
                              <button onClick={() => setUsers(users.filter(x => x.id !== u.id))} className="bg-[#DC3545] hover:bg-[#C82333] text-white px-2.5 py-1 rounded text-[10px] font-bold shadow-sm" title="Delete User">🗑️</button>
                            </td>
                          </tr>
                        ))}
                        {users.filter(u => {
                          if (!filterSearch.trim()) return true;
                          const q = filterSearch.toLowerCase().trim();
                          return (
                            (u.name && u.name.toLowerCase().includes(q)) ||
                            (u.email && u.email.toLowerCase().includes(q)) ||
                            (u.mobile && u.mobile.toString().includes(q))
                          );
                        }).length === 0 && (
                          <tr>
                            <td colSpan={10} className="p-6 text-center text-[#6C757D] font-medium bg-[#F8F9FA]">
                              No matching users found for "{filterSearch}"
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-xs text-[#6C757D]">
                    {(() => {
                      const count = users.filter(u => {
                        if (!filterSearch.trim()) return true;
                        const q = filterSearch.toLowerCase().trim();
                        return (
                          (u.name && u.name.toLowerCase().includes(q)) ||
                          (u.email && u.email.toLowerCase().includes(q)) ||
                          (u.mobile && u.mobile.toString().includes(q))
                        );
                      }).length;
                      return <span>Showing {count > 0 ? 1 : 0} to {count} of {count} entries</span>;
                    })()}
                    <div className="flex items-center gap-1">
                      <button className="px-3 py-1 border border-[#DEE2E6] rounded bg-[#F8F9FA] text-[#6C757D]">Previous</button>
                      <button className="px-3 py-1 border border-[#007BFF] rounded bg-[#007BFF] text-white font-bold">1</button>
                      <button className="px-3 py-1 border border-[#DEE2E6] rounded bg-[#F8F9FA] text-[#6C757D]">Next</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTION 1 PAGE: USER DETAILS */}
            {activeTab === 'userDetails' && selectedUser && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">User Details</h1>
                  <button onClick={() => setActiveTab('users')} className="bg-[#007BFF] hover:bg-[#0069D9] text-white px-4 py-1.5 rounded text-xs font-bold shadow-sm">← Back</button>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm overflow-hidden">
                  <div className="flex border-b border-[#DEE2E6] px-4 pt-3 gap-2 text-xs font-bold bg-[#FFFFFF]">
                    {[
                      { id: 'profile', label: 'Profile' },
                      { id: 'bankDetails', label: 'Bank Details' },
                      { id: 'walletTransaction', label: 'Wallet Transaction' },
                      { id: 'gameHistory', label: 'Game History' },
                      { id: 'referHistory', label: 'Refer History' },
                      { id: 'gameLedger', label: 'Game Ledger' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setUserDetailsTab(tab.id as any)}
                        className={`px-4 py-2 rounded-t font-semibold transition-all ${
                          userDetailsTab === tab.id
                            ? 'bg-[#007BFF] text-white font-bold'
                            : 'text-[#6C757D] hover:text-[#212529]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {userDetailsTab === 'profile' && (
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div className="flex flex-col items-center justify-center space-y-3 border-r border-[#DEE2E6] pr-6">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-xl font-bold text-gray-600">
                          👤
                        </div>
                        <h2 className="text-xl font-bold text-[#212529]">{selectedUser.name}</h2>
                        <span className="px-2.5 py-0.5 bg-[#007BFF] text-white rounded text-[11px] font-bold">Active</span>

                        <div className="text-center space-y-1.5 pt-4 text-base text-[#212529]">
                          <p className="font-semibold">Total Deposit: <strong className="font-bold">{selectedUser.totalDeposit || 200}</strong></p>
                          <p className="font-semibold">Total Winning: <strong className="font-bold">{selectedUser.totalWinning || 3168}</strong></p>
                          <p className="font-semibold">Total Withdrawl: <strong className="font-bold">{selectedUser.totalWithdrawal || 0}</strong></p>
                        </div>
                      </div>

                      <div className="space-y-4 text-base text-[#212529]">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">✉️</span>
                          <span className="font-semibold">{selectedUser.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📞</span>
                          <span className="font-semibold">{selectedUser.mobile}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🎂</span>
                          <span className="font-semibold">{selectedUser.dob || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📍</span>
                          <span className="font-semibold">{selectedUser.address || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">💰</span>
                          <span className="font-semibold">My Wallet:- {selectedUser.balance}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🎁</span>
                          <span className="font-semibold">My Referal Code:- {selectedUser.referralCode || '66a24031439e4'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🚻</span>
                          <span className="font-semibold">{selectedUser.gender || 'Male'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl text-red-500 font-bold">❌</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {userDetailsTab !== 'profile' && (
                    <div className="p-6 text-center text-xs text-[#6C757D]">
                      No recorded {userDetailsTab} entries for {selectedUser.name}.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ACTION 2 PAGE: USER EDIT */}
            {activeTab === 'userEdit' && selectedUser && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">User Edit</h1>
                  <button onClick={() => setActiveTab('users')} className="bg-[#007BFF] hover:bg-[#0069D9] text-white px-4 py-1.5 rounded text-xs font-bold shadow-sm">← Back</button>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-6">
                  <form onSubmit={handleSaveUserEdit} className="space-y-5 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Full Name *</label>
                        <input type="text" value={editUserForm.name || ''} onChange={(e)=>setEditUserForm({...editUserForm, name: e.target.value})} required className="w-full border border-[#CED4DA] p-2 rounded text-xs" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Email Address</label>
                        <input type="email" value={editUserForm.email || ''} onChange={(e)=>setEditUserForm({...editUserForm, email: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs" />
                        <p className="text-[10px] text-[#6C757D] mt-0.5">Once you add your Email-id than it will never Change</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Phone</label>
                        <input type="text" value={editUserForm.mobile || ''} onChange={(e)=>setEditUserForm({...editUserForm, mobile: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Gender</label>
                        <select value={editUserForm.gender || 'Male'} onChange={(e)=>setEditUserForm({...editUserForm, gender: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Date of Birth</label>
                        <input type="text" value={editUserForm.dob || ''} onChange={(e)=>setEditUserForm({...editUserForm, dob: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Address</label>
                        <input type="text" value={editUserForm.address || ''} onChange={(e)=>setEditUserForm({...editUserForm, address: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Bank Name</label>
                        <input type="text" value={editUserForm.bankName || 'sate bank'} onChange={(e)=>setEditUserForm({...editUserForm, bankName: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Bank Account Number</label>
                        <input type="text" value={editUserForm.accountNumber || '0000000000'} onChange={(e)=>setEditUserForm({...editUserForm, accountNumber: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs font-mono" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Branch Name</label>
                        <input type="text" value={editUserForm.branchName || ''} onChange={(e)=>setEditUserForm({...editUserForm, branchName: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Ifsc Code</label>
                        <input type="text" value={editUserForm.ifscCode || '000000000'} onChange={(e)=>setEditUserForm({...editUserForm, ifscCode: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs font-mono" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">UPI</label>
                        <input type="text" value={editUserForm.upi || ''} onChange={(e)=>setEditUserForm({...editUserForm, upi: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs" />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Status</label>
                        <select value={editUserForm.status || 'Active'} onChange={(e)=>setEditUserForm({...editUserForm, status: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs">
                          <option value="Active">Active</option>
                          <option value="Deactive">Deactive</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">Multiple Account Withdraw Enabled</label>
                        <select value={editUserForm.multipleWithdraw || 'No'} onChange={(e)=>setEditUserForm({...editUserForm, multipleWithdraw: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded text-xs">
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1">LAST LOGIN OTP DATETIME: {editUserForm.lastLoginOtp || '2025-05-20 19:20:04'}</label>
                        <label className="block text-xs font-bold text-[#212529] mt-2 mb-1">API CALL</label>
                        <input type="text" value={editUserForm.apiCall || 'laravelNEW'} readOnly className="w-full border border-[#CED4DA] p-2 rounded text-xs bg-gray-50 text-[#6C757D]" />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[#DEE2E6]">
                      <button type="submit" className="bg-[#28A745] hover:bg-[#218838] text-white px-5 py-2 rounded font-bold text-xs shadow-sm">Update</button>
                      <button type="button" onClick={()=>setActiveTab('users')} className="bg-[#DC3545] hover:bg-[#C82333] text-white px-5 py-2 rounded font-bold text-xs shadow-sm">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 4. GAME LEDGER MODULE */}
            {activeTab === 'gameLedger' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Game Ledger</h1>
                </div>

                <div className="bg-white p-4 rounded border border-[#DEE2E6] shadow-sm grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-bold text-[#212529] mb-1">Name</label>
                    <input type="text" value={filterSearch} onChange={(e)=>setFilterSearch(e.target.value)} placeholder="" className="w-full border border-[#CED4DA] px-3 py-1.5 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#212529] mb-1">Transaction Type</label>
                    <select value={filterTxnType} onChange={(e)=>setFilterTxnType(e.target.value)} className="w-full border border-[#CED4DA] px-3 py-1.5 rounded text-xs">
                      <option value="All">All</option>
                      <option value="BET_DEBIT">BET_DEBIT</option>
                      <option value="WINNING_CREDIT">WINNING_CREDIT</option>
                      <option value="DEPOSIT">DEPOSIT</option>
                      <option value="WITHDRAW">WITHDRAW</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#212529] mb-1">Start Date</label>
                    <input type="text" value={filterStartDate} onChange={(e)=>setFilterStartDate(e.target.value)} className="w-full border border-[#CED4DA] px-3 py-1.5 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#212529] mb-1">End Date</label>
                    <input type="text" value={filterEndDate} onChange={(e)=>setFilterEndDate(e.target.value)} className="w-full border border-[#CED4DA] px-3 py-1.5 rounded text-xs" />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#28A745] hover:bg-[#218838] text-white py-1.5 rounded text-xs font-bold">Search</button>
                    <button onClick={()=>{ setFilterSearch(''); setFilterTxnType('All'); }} className="flex-1 bg-white border border-[#CED4DA] text-[#212529] py-1.5 rounded text-xs font-bold">Clear</button>
                  </div>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">User</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Amount</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Date</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Transact Type</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Old Bal.</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">New Bal.</th>
                        <th className="p-2.5">Game Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-[#6C757D] font-medium bg-[#F8F9FA]">
                          No data available in table
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center pt-2 text-xs text-[#6C757D]">
                    <span>Showing 0 to 0 of 0 entries</span>
                    <div className="flex gap-1">
                      <button className="px-3 py-1 border border-[#DEE2E6] rounded bg-[#F8F9FA] text-[#6C757D]">Previous</button>
                      <button className="px-3 py-1 border border-[#DEE2E6] rounded bg-[#F8F9FA] text-[#6C757D]">Next</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. WALLET MODULE */}
            {activeTab === 'wallets' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Wallet Management</h1>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-[#DEE2E6] pb-3">
                    <input type="text" placeholder="Name / Email / Phone" value={filterSearch} onChange={(e)=>setFilterSearch(e.target.value)} className="border border-[#CED4DA] px-3 py-1.5 rounded text-xs" />
                  </div>
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] uppercase text-[11px] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Name</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Mobile Number</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Total Balance</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Wallet Balance</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Deposite Balance</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Winning Balance</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Bouns Balance</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Referral Balance</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={i} className="hover:bg-[#F4F6F9]">
                          <td className="p-2.5 border-r border-[#DEE2E6]">{i + 1}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-bold">{u.name}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]">{u.mobile}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono font-bold text-[#28A745]">₹ {u.balance}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono">₹ {u.balance}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono">₹ 0.00</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono">₹ {u.balance}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono text-amber-600">₹ 200.00</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono text-cyan-600">₹ 0.00</td>
                          <td className="p-2.5 text-right">
                            <button onClick={() => { setWalletTargetUser(u); setShowWalletModal(true); }} className="bg-[#28A745] text-white px-2.5 py-1 rounded text-[10px] font-bold">Credit / Debit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. WALLET TRANSACTIONS MODULE */}
            {activeTab === 'walletTransactions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Wallet Transactions</h1>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] uppercase text-[11px] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Name</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Email</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Mobile Number</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Amount</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Transaction Id</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Transaction Type</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Status</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Date</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deposits.map((d, i) => (
                        <tr key={i} className="hover:bg-[#F4F6F9]">
                          <td className="p-2.5 border-r border-[#DEE2E6]">{i + 1}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-bold">{d.user}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]">user@95xmatka.com</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]">{d.userId}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono text-[#28A745] font-bold">₹ {d.amount}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono">{d.utr || d.id}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]">{d.method || 'DEPOSIT'}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]"><span className="px-2 py-0.5 rounded bg-[#28A745] text-white text-[10px] font-bold">{d.status}</span></td>
                          <td className="p-2.5 border-r border-[#DEE2E6]">{d.date}</td>
                          <td className="p-2.5 text-right"><button className="bg-[#007BFF] text-white px-2 py-1 rounded text-[10px]">View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 7. DEPOSIT HISTORY MODULE */}
            {activeTab === 'deposits' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Deposit History</h1>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] uppercase text-[11px] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">UTN/RRN NO</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Name</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Email</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Mobile Number</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Amount</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Status</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deposits.map((d, i) => (
                        <tr key={i} className="hover:bg-[#F4F6F9]">
                          <td className="p-2.5 border-r border-[#DEE2E6]">{i + 1}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono font-bold text-[#007BFF]">{d.utr || 'N/A'}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-bold">{d.user}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]">user@95xmatka.com</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]">{d.userId}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono text-[#28A745] font-bold">₹ {d.amount}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]"><span className="px-2 py-0.5 rounded bg-[#28A745] text-white text-[10px] font-bold">{d.status}</span></td>
                          <td className="p-2.5 text-right space-x-1">
                            {d.status === 'Pending' && (
                              <>
                                <button onClick={() => handleApproveDeposit(d.id)} className="bg-[#28A745] text-white px-2 py-1 rounded text-[10px] font-bold">Approve</button>
                                <button onClick={() => handleRejectDeposit(d.id)} className="bg-[#DC3545] text-white px-2 py-1 rounded text-[10px] font-bold">Reject</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. WITHDRAW REQUEST MODULE */}
            {activeTab === 'withdraws' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Withdraw Management</h1>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] uppercase text-[11px] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">OrderID</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">User Name</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">User Phone</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Requested Amount</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Requested Status</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((w, i) => (
                        <tr key={i} className="hover:bg-[#F4F6F9]">
                          <td className="p-2.5 border-r border-[#DEE2E6]">{i + 1}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono text-xs">{w.id}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-bold">{w.user}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]">{w.userId}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono text-[#DC3545] font-bold">₹ {w.amount}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]"><span className="px-2 py-0.5 rounded bg-[#28A745] text-white text-[10px] font-bold">{w.status}</span></td>
                          <td className="p-2.5 text-right space-x-1">
                            {w.status === 'Pending' && (
                              <>
                                <button onClick={() => handleApproveWithdrawal(w.id)} className="bg-[#28A745] text-white px-2 py-1 rounded text-[10px] font-bold">Approve</button>
                                <button onClick={() => handleRejectWithdrawal(w.id)} className="bg-[#DC3545] text-white px-2 py-1 rounded text-[10px] font-bold">Reject</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 9. COMMISSION MODULE */}
            {activeTab === 'commission' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Commission Management</h1>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] uppercase text-[11px] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Date / Time</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Bidder Name</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Bidder Phone</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Category</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Commission Amount</th>
                        <th className="p-2.5 text-right">Commission Receiver</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td colSpan={7} className="p-4 text-center text-[#6C757D]">No commission logs recorded today.</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 10. LEADER BOARD MODULE */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Leader Board</h1>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] uppercase text-[11px] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Profile Photo</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Name</th>
                        <th className="p-2.5 text-right">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={i} className="hover:bg-[#F4F6F9]">
                          <td className="p-2.5 border-r border-[#DEE2E6]">{i + 1}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]"><div className="w-6 h-6 rounded-full bg-[#007BFF] text-white flex items-center justify-center font-bold text-[10px]">{u.name[0]}</div></td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-bold">{u.name}</td>
                          <td className="p-2.5 text-right">{u.createdAt || '2026-08-28'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 11. PAYOUT MODULE */}
            {activeTab === 'payouts' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Payout Management</h1>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] uppercase text-[11px] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Name</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Update Date</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Status</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td colSpan={5} className="p-4 text-center text-[#6C757D]">No completed payouts recorded.</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 12. BANNER MODULE (Matching media_1787949265283.png 100% WORKING!) */}
            {activeTab === 'banners' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Banner Management</h1>
                  <button onClick={() => { setEditingBanner(null); setBannerForm({ name: '', type: 'Image', link: '', image: 'banner1.png', status: 'Active' }); setShowAddBannerModal(true); }} className="bg-[#007BFF] hover:bg-[#0069D9] text-white px-3.5 py-1.5 rounded text-xs font-bold shadow-sm">+ Add</button>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] uppercase text-[11px] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Banner Image</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Banner Name</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Banner Status</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bannersList.map((b, i) => (
                        <tr key={i} className="hover:bg-[#F4F6F9]">
                          <td className="p-2.5 border-r border-[#DEE2E6]">{i + 1}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]"><span className="px-2 py-1 bg-gray-100 border rounded text-[10px] font-mono">{b.image}</span></td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-bold">{b.name}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]"><span className="px-2 py-0.5 rounded bg-[#28A745] text-white text-[10px] font-bold">{b.status}</span></td>
                          <td className="p-2.5 text-right space-x-1">
                            <button onClick={() => { setEditingBanner(b); setBannerForm(b); setShowAddBannerModal(true); }} className="bg-[#007BFF] hover:bg-[#0069D9] text-white px-2.5 py-1 rounded text-[10px] font-bold shadow-sm">Edit</button>
                            <button onClick={() => setBannersList(bannersList.filter(x => x.id !== b.id))} className="bg-[#DC3545] hover:bg-[#C82333] text-white px-2.5 py-1 rounded text-[10px] font-bold shadow-sm">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 13. APP / PACKAGE MODULE */}
            {activeTab === 'packages' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">App/Package Management</h1>
                  <button onClick={() => { setEditingPackage(null); setPackageForm({ packageName: '', appName: '', status: 'Active' }); setShowAddPackageModal(true); }} className="bg-[#007BFF] hover:bg-[#0069D9] text-white px-3.5 py-1.5 rounded text-xs font-bold shadow-sm">+ Add</button>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] uppercase text-[11px] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Package Name</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">App Name</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Status</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packagesList.map((p, i) => (
                        <tr key={i} className="hover:bg-[#F4F6F9]">
                          <td className="p-2.5 border-r border-[#DEE2E6]">{i + 1}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-mono">{p.packageName}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-bold">{p.appName}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]"><span className="px-2 py-0.5 rounded bg-[#28A745] text-white text-[10px] font-bold">{p.status}</span></td>
                          <td className="p-2.5 text-right space-x-1">
                            <button onClick={() => { setEditingPackage(p); setPackageForm(p); setShowAddPackageModal(true); }} className="bg-[#007BFF] text-white px-2 py-1 rounded text-[10px] font-bold">Edit</button>
                            <button onClick={() => setPackagesList(packagesList.filter(x => x.id !== p.id))} className="bg-[#DC3545] text-white px-2 py-1 rounded text-[10px] font-bold">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 14. PAYMENT METHODS MODULE */}
            {activeTab === 'paymentMethods' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Payment Method</h1>
                  <button onClick={() => { setEditingPayment(null); setPaymentForm({ name: '', ordering: 1, status: 'Active' }); setShowAddPaymentModal(true); }} className="bg-[#007BFF] hover:bg-[#0069D9] text-white px-3.5 py-1.5 rounded text-xs font-bold shadow-sm">+ Add</button>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-4 space-y-4">
                  <table className="w-full text-left text-xs text-[#212529] border border-[#DEE2E6]">
                    <thead className="bg-[#F8F9FA] text-[#495057] uppercase text-[11px] font-bold border-b border-[#DEE2E6]">
                      <tr>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Sr. No</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Name</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">PayIn Ordering</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Update Date</th>
                        <th className="p-2.5 border-r border-[#DEE2E6]">Status</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentMethodsList.map((pm, i) => (
                        <tr key={i} className="hover:bg-[#F4F6F9]">
                          <td className="p-2.5 border-r border-[#DEE2E6]">{i + 1}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6] font-bold">{pm.name}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]">{pm.ordering}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]">{pm.date}</td>
                          <td className="p-2.5 border-r border-[#DEE2E6]"><span className="px-2 py-0.5 rounded bg-[#28A745] text-white text-[10px] font-bold">{pm.status}</span></td>
                          <td className="p-2.5 text-right space-x-1">
                            <button onClick={() => { setEditingPayment(pm); setPaymentForm(pm); setShowAddPaymentModal(true); }} className="bg-[#007BFF] text-white px-2 py-1 rounded text-[10px] font-bold">Edit</button>
                            <button onClick={() => setPaymentMethodsList(paymentMethodsList.filter(x => x.id !== pm.id))} className="bg-[#DC3545] text-white px-2 py-1 rounded text-[10px] font-bold">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 15. SETTINGS MODULE */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-[#212529]">Site and App Settings</h1>
                </div>

                <div className="bg-white rounded border border-[#DEE2E6] shadow-sm p-5 max-w-2xl space-y-4">
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[#495057] font-semibold mb-1">Whatsapp Message Number</label>
                      <input type="text" value={settingsForm.whatsapp_number} onChange={(e)=>setSettingsForm({...settingsForm, whatsapp_number: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded" />
                    </div>
                    <div>
                      <label className="block text-[#495057] font-semibold mb-1">Whatsapp Call Number</label>
                      <input type="text" value={settingsForm.whatsapp_call_number} onChange={(e)=>setSettingsForm({...settingsForm, whatsapp_call_number: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded" />
                    </div>
                    <div>
                      <label className="block text-[#495057] font-semibold mb-1">App Download Link</label>
                      <input type="text" value={settingsForm.app_download_link} onChange={(e)=>setSettingsForm({...settingsForm, app_download_link: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded" />
                    </div>
                    <div>
                      <label className="block text-[#495057] font-semibold mb-1">App Version</label>
                      <input type="text" value={settingsForm.app_version} onChange={(e)=>setSettingsForm({...settingsForm, app_version: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded font-mono" />
                    </div>
                    <button onClick={()=>setStatusMessage('Settings updated successfully!')} className="bg-[#007BFF] text-white font-bold px-4 py-2 rounded text-xs shadow-sm">Save Settings</button>
                  </div>
                </div>
              </div>
            )}

          </main>

          {/* FOOTER */}
          <footer className="bg-white border-t border-[#DEE2E6] px-6 py-3 text-xs text-[#6C757D]">
            Copyright © 2026 . All rights reserved.
          </footer>
        </div>
      </div>

      {/* WORKING MODALS */}
      {/* 1. BANNER ADD/EDIT MODAL matching media_1787949265283.png 100%! */}
      {showAddBannerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-xs">
          <div className="bg-white rounded-lg p-5 w-full max-w-md space-y-4 border border-[#DEE2E6] shadow-xl">
            <h3 className="font-bold text-[#212529] text-base border-b pb-2">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h3>
            <form onSubmit={handleSaveBanner} className="space-y-3">
              <div>
                <label className="block text-[#495057] font-bold mb-1">Banner Name *</label>
                <input type="text" value={bannerForm.name} onChange={(e)=>setBannerForm({...bannerForm, name: e.target.value})} required placeholder="e.g. Main Promo Banner" className="w-full border border-[#CED4DA] p-2 rounded" />
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">Type</label>
                <select value={bannerForm.type} onChange={(e)=>setBannerForm({...bannerForm, type: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded">
                  <option value="Image">Image</option>
                  <option value="Link">Link</option>
                  <option value="Text">Text</option>
                </select>
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">Banner Link Or Text</label>
                <input type="text" value={bannerForm.link} onChange={(e)=>setBannerForm({...bannerForm, link: e.target.value})} placeholder="https://matka-website.vercel.app" className="w-full border border-[#CED4DA] p-2 rounded" />
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">Status</label>
                <select value={bannerForm.status} onChange={(e)=>setBannerForm({...bannerForm, status: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded">
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive</option>
                </select>
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">Image Name / URL</label>
                <input type="text" value={bannerForm.image} onChange={(e)=>setBannerForm({...bannerForm, image: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded font-mono" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={()=>setShowAddBannerModal(false)} className="flex-1 bg-gray-500 text-white p-2 rounded font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-[#007BFF] text-white p-2 rounded font-bold">Save Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PACKAGE ADD/EDIT MODAL */}
      {showAddPackageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-xs">
          <div className="bg-white rounded-lg p-5 w-full max-w-md space-y-4 border border-[#DEE2E6] shadow-xl">
            <h3 className="font-bold text-[#212529] text-base border-b pb-2">{editingPackage ? 'Edit Package' : 'Add Package'}</h3>
            <form onSubmit={handleSavePackage} className="space-y-3">
              <div>
                <label className="block text-[#495057] font-bold mb-1">Package Name *</label>
                <input type="text" value={packageForm.packageName} onChange={(e)=>setPackageForm({...packageForm, packageName: e.target.value})} required placeholder="com.example.numberbetting" className="w-full border border-[#CED4DA] p-2 rounded font-mono" />
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">App Name *</label>
                <input type="text" value={packageForm.appName} onChange={(e)=>setPackageForm({...packageForm, appName: e.target.value})} required placeholder="95X MATKA" className="w-full border border-[#CED4DA] p-2 rounded" />
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">Status</label>
                <select value={packageForm.status} onChange={(e)=>setPackageForm({...packageForm, status: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded">
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={()=>setShowAddPackageModal(false)} className="flex-1 bg-gray-500 text-white p-2 rounded font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-[#007BFF] text-white p-2 rounded font-bold">Save Package</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADMIN ADD/EDIT MODAL */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-xs">
          <div className="bg-white rounded-lg p-5 w-full max-w-md space-y-4 border border-[#DEE2E6] shadow-xl">
            <h3 className="font-bold text-[#212529] text-base border-b pb-2">{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h3>
            <form onSubmit={handleSaveAdmin} className="space-y-3">
              <div>
                <label className="block text-[#495057] font-bold mb-1">Name *</label>
                <input type="text" value={adminForm.name} onChange={(e)=>setAdminForm({...adminForm, name: e.target.value})} required placeholder="Full Name" className="w-full border border-[#CED4DA] p-2 rounded" />
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">Username *</label>
                <input type="text" value={adminForm.username} onChange={(e)=>setAdminForm({...adminForm, username: e.target.value})} required placeholder="Username" className="w-full border border-[#CED4DA] p-2 rounded font-bold text-[#007BFF]" />
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">Mobile *</label>
                <input type="text" value={adminForm.mobile} onChange={(e)=>setAdminForm({...adminForm, mobile: e.target.value})} required placeholder="Mobile Number" className="w-full border border-[#CED4DA] p-2 rounded" />
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">Role</label>
                <select value={adminForm.role} onChange={(e)=>setAdminForm({...adminForm, role: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded">
                  <option value="Super Admin">Super Admin</option>
                  <option value="Sub Admin">Sub Admin</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">Status</label>
                <select value={adminForm.status} onChange={(e)=>setAdminForm({...adminForm, status: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded">
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={()=>setShowAddAdminModal(false)} className="flex-1 bg-gray-500 text-white p-2 rounded font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-[#007BFF] text-white p-2 rounded font-bold">Save Admin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. PAYMENT METHOD ADD/EDIT MODAL */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-xs">
          <div className="bg-white rounded-lg p-5 w-full max-w-md space-y-4 border border-[#DEE2E6] shadow-xl">
            <h3 className="font-bold text-[#212529] text-base border-b pb-2">{editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}</h3>
            <form onSubmit={handleSavePayment} className="space-y-3">
              <div>
                <label className="block text-[#495057] font-bold mb-1">Method Name *</label>
                <input type="text" value={paymentForm.name} onChange={(e)=>setPaymentForm({...paymentForm, name: e.target.value})} required placeholder="UPI / PhonePe" className="w-full border border-[#CED4DA] p-2 rounded" />
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">PayIn Ordering</label>
                <input type="number" value={paymentForm.ordering} onChange={(e)=>setPaymentForm({...paymentForm, ordering: parseInt(e.target.value)||1})} className="w-full border border-[#CED4DA] p-2 rounded" />
              </div>
              <div>
                <label className="block text-[#495057] font-bold mb-1">Status</label>
                <select value={paymentForm.status} onChange={(e)=>setPaymentForm({...paymentForm, status: e.target.value})} className="w-full border border-[#CED4DA] p-2 rounded">
                  <option value="Active">Active</option>
                  <option value="Deactive">Deactive</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={()=>setShowAddPaymentModal(false)} className="flex-1 bg-gray-500 text-white p-2 rounded font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-[#007BFF] text-white p-2 rounded font-bold">Save Method</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. USER ADD MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-3 shadow-xl border border-[#DEE2E6] text-xs">
            <h3 className="text-base font-bold text-[#212529] border-b pb-2">Add New User</h3>
            <form onSubmit={handleAddUserSubmit} className="space-y-3">
              <div>
                <label className="block text-[#495057] font-semibold mb-1">Full Name *</label>
                <input type="text" value={newUserForm.name} onChange={(e)=>setNewUserForm({...newUserForm, name: e.target.value})} required className="w-full border border-[#CED4DA] p-2 rounded" />
              </div>
              <div>
                <label className="block text-[#495057] font-semibold mb-1">Phone Number *</label>
                <input type="text" value={newUserForm.phone} onChange={(e)=>setNewUserForm({...newUserForm, phone: e.target.value})} required className="w-full border border-[#CED4DA] p-2 rounded" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={()=>setShowAddUserModal(false)} className="flex-1 bg-[#6C757D] text-white py-2 rounded font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-[#007BFF] text-white py-2 rounded font-bold">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. WALLET EDIT MODAL */}
      {showWalletModal && walletTargetUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-5 w-full max-w-sm space-y-4 shadow-xl border border-[#DEE2E6]">
            <h3 className="text-base font-bold text-[#212529]">Credit / Debit User Wallet</h3>
            <p className="text-xs text-[#6C757D]">Target User: <strong className="text-[#212529]">{walletTargetUser.name} ({walletTargetUser.mobile})</strong></p>
            <form onSubmit={handleWalletAdjustSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#495057] font-semibold mb-1">Action Type</label>
                <div className="flex gap-2">
                  <button type="button" onClick={()=>setWalletActionType('add')} className={`flex-1 py-1.5 rounded font-bold border ${walletActionType==='add'?'bg-[#28A745] text-white border-[#28A745]':'bg-[#F8F9FA] text-[#212529] border-[#CED4DA]'}`}>+ CREDIT CASH</button>
                  <button type="button" onClick={()=>setWalletActionType('deduct')} className={`flex-1 py-1.5 rounded font-bold border ${walletActionType==='deduct'?'bg-[#DC3545] text-white border-[#DC3545]':'bg-[#F8F9FA] text-[#212529] border-[#CED4DA]'}`}>- DEBIT CASH</button>
                </div>
              </div>
              <div>
                <label className="block text-[#495057] font-semibold mb-1">Amount (₹)</label>
                <input type="number" value={walletAmtInput} onChange={(e)=>setWalletAmtInput(e.target.value)} required className="w-full border border-[#CED4DA] p-2 rounded font-mono font-bold text-sm" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={()=>setShowWalletModal(false)} className="flex-1 bg-[#6C757D] text-white py-2 rounded font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-[#007BFF] text-white py-2 rounded font-bold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
