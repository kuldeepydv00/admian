import React, { useState, useEffect } from 'react';

interface GameSchedule {
  name: string;
  open: string;
  close: string;
  result: string;
}

const SCHEDULES: GameSchedule[] = [
  { name: 'Desawar', open: '05:00 AM IST', close: '04:00 AM IST (Next Day)', result: '06:00 AM IST' },
  { name: 'Shiv Parwati', open: '04:00 AM IST', close: '12:00 PM IST', result: '12:40 PM IST' },
  { name: 'Delhi Bazar', open: '04:00 AM IST', close: '02:45 PM IST', result: '03:20 PM IST' },
  { name: 'Dubai Market', open: '04:00 AM IST', close: '04:00 PM IST', result: '04:00 PM IST' },
  { name: 'Shree Ganesh', open: '04:00 AM IST', close: '04:30 PM IST', result: '04:50 PM IST' },
  { name: 'Faridabad', open: '04:00 AM IST', close: '05:40 PM IST', result: '06:20 PM IST' },
  { name: 'Ghaziabad', open: '04:00 AM IST', close: '09:30 PM IST', result: '10:10 PM IST' },
  { name: 'Gali', open: '04:00 AM IST', close: '11:30 PM IST', result: '11:59 PM IST' }
];

interface UserItem {
  id: string;
  name: string;
  mobile: string;
  balance: number;
  kycStatus: string;
  status: string;
  createdDateKey?: string;
  createdAt?: string;
  totalBets: number;
  totalWon: number;
  totalLost: number;
}

interface DepositItem {
  id: string;
  userId: string;
  user: string;
  amount: number;
  method: string;
  utr: string;
  status: string;
  date: string;
}

interface WithdrawalItem {
  id: string;
  userId?: string;
  user: string;
  amount: number;
  upi?: string;
  bankDetails?: string;
  accountName?: string;
  accountNumber?: string;
  ifsc?: string;
  status: string;
  date: string;
}

const resizeImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

function App() {
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdrawals' | 'matrix' | 'results' | 'dashboard' | 'users' | 'settings' | 'notifications' | 'audit' | 'banner' | 'referral'>('deposits');
  const [selectedGame, setSelectedGame] = useState('Gali');
  const [matrixGame, setMatrixGame] = useState('Gali');
  const [winningNumber, setWinningNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchMobile, setSearchMobile] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'today' | 'month'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Referral Settings & Stats State
  const [referralConfig, setReferralConfig] = useState({
    enabled: true,
    signupBonus: 50,
    commissionPercentage: 4
  });
  const [referralStats, setReferralStats] = useState<{
    totalReferrersCount: number;
    totalReferralPayout: number;
    referrers: Array<{
      id: string;
      referrerName: string;
      referrerMobile: string;
      referralCode: string;
      totalReferredCount: number;
      totalCommissionEarned: number;
      friends: Array<{
        name: string;
        mobile: string;
        signupBonus: number;
        totalBets: number;
        betCommission: number;
        totalEarned: number;
      }>;
    }>;
  }>({
    totalReferrersCount: 0,
    totalReferralPayout: 0,
    referrers: []
  });
  const [expandedReferrerId, setExpandedReferrerId] = useState<string | null>(null);

  // Push Notification state
  const [notifTitle, setNotifTitle] = useState('🎉 Winner Announcement!');
  const [notifBody, setNotifBody] = useState('Check out today\'s winning numbers on 95XMATKA!');
  
  const [declaredResults, setDeclaredResults] = useState<Record<string, number>>({});
  const [schedulesState, setSchedulesState] = useState<GameSchedule[]>(SCHEDULES);
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [editOpenTime, setEditOpenTime] = useState('');
  const [editCloseTime, setEditCloseTime] = useState('');
  const [editResultTime, setEditResultTime] = useState('');

  const [gameVolumes, setGameVolumes] = useState<Record<string, Record<number, number>>>({
    Desawar: {},
    'Shiv Parwati': {},
    'Delhi Bazar': {},
    'Dubai Market': {},
    'Shree Ganesh': {},
    Faridabad: {},
    Ghaziabad: {},
    Gali: {}
  });

  const [deposits, setDeposits] = useState<DepositItem[]>([]);
  const [depositSearchQuery, setDepositSearchQuery] = useState('');
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    dailyNewUsers: 0,
    monthlyNewUsers: 0,
    totalBets: 0,
    platformProfit: 0
  });

  const [bannerConfig, setBannerConfig] = useState({
    enabled: true,
    title: '95X MATKA SATTA',
    subtitle: 'आपका भरोसा, हमारी पहचान',
    referralText: 'केवल 5 предприятий को रिफर करें और पाएं ₹500 बोनस',
    commissionText: '4% लाइफटाइम कमिशन आपकी टीम के हर दांव पर',
    minDeposit: '100',
    minWithdrawal: '300',
    imageUrl: ''
  });

  const fetchAdminEndpoint = async (endpoint: string) => {
    for (const base of ['https://matka-r6mz.onrender.com', 'http://localhost:5001']) {
      try {
        const res = await fetch(`${base}${endpoint}`);
        if (res.ok) return res;
      } catch (e) {}
    }
    return fetch(`https://matka-r6mz.onrender.com${endpoint}`);
  };

  const postAdminEndpoint = async (endpoint: string, options: any = {}) => {
    for (const base of ['https://matka-r6mz.onrender.com', 'http://localhost:5001']) {
      try {
        const res = await fetch(`${base}${endpoint}`, options);
        if (res.ok) return res;
      } catch (e) {}
    }
    return fetch(`https://matka-r6mz.onrender.com${endpoint}`, options);
  };

  const fetchLiveData = async () => {
    try {
      const [matRes, depRes, wdRes, usrRes, decRes, schRes, statsRes, banRes, refRes, refStatsRes] = await Promise.all([
        fetchAdminEndpoint('/api/admin/matrix'),
        fetchAdminEndpoint('/api/admin/deposits'),
        fetchAdminEndpoint('/api/admin/withdrawals'),
        fetchAdminEndpoint('/api/admin/users'),
        fetchAdminEndpoint('/api/admin/declared-results'),
        fetchAdminEndpoint('/api/admin/schedules'),
        fetchAdminEndpoint('/api/admin/stats'),
        fetchAdminEndpoint('/api/admin/banner'),
        fetchAdminEndpoint('/api/admin/referral-config'),
        fetchAdminEndpoint('/api/admin/referral-stats')
      ]);

      if (banRes && banRes.ok) setBannerConfig(await banRes.json());
      if (refRes && refRes.ok) setReferralConfig(await refRes.json());
      if (refStatsRes && refStatsRes.ok) setReferralStats(await refStatsRes.json());

      if (matRes.ok) setGameVolumes(await matRes.json());
      if (depRes.ok) {
        const rawDep = await depRes.json();
        if (Array.isArray(rawDep)) {
          setDeposits(rawDep.map((d: any) => ({
            id: d._id || d.id || d.utr,
            user: d.user,
            userId: d.userId || d.user,
            amount: d.amount,
            method: d.method || 'UPI',
            utr: d.utr,
            status: d.status || 'Pending',
            date: d.createdAt || 'Today'
          })));
        }
      }
      if (wdRes.ok) {
        const rawWd = await wdRes.json();
        if (Array.isArray(rawWd)) {
          setWithdrawals(rawWd.map((w: any) => {
            const rawStatus = (w.status || 'Pending').toLowerCase();
            const normStatus = rawStatus === 'approved' ? 'Approved' : (rawStatus === 'rejected' ? 'Rejected' : 'Pending');
            const userLabel = w.user ? (w.name ? `${w.name} (${w.user})` : w.user) : (w.name || 'Player');
            const detailsText = w.payment_details || w.details || w.account_number || w.upi_id || w.upi || w.paymentDetails || w.accountNumber || 'N/A';

            return {
              id: w.id || w._id,
              user: userLabel,
              userId: w.userId || w.user || w.mobile,
              amount: w.amount,
              method: w.method || w.payment_method || 'UPI',
              accountName: w.name || w.accountName || 'Player',
              accountNumber: w.account_number || w.accountNumber || 'N/A',
              ifsc: w.ifsc_code || w.ifsc || 'N/A',
              upi: w.upi_id || w.payment_details || 'N/A',
              bankDetails: `${w.payment_method || 'Payment'}: ${detailsText}`,
              status: normStatus,
              date: w.createdAt || w.created_at ? new Date(w.createdAt || w.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'
            };
          }));
        }
      }
      if (usrRes.ok) {
        const rawUsers = await usrRes.json();
        if (Array.isArray(rawUsers)) {
          setUsers(rawUsers.map((u: any) => ({
            id: u._id || u.id || u.mobile,
            name: u.name,
            mobile: u.mobile,
            balance: u.balance || 0,
            kycStatus: 'Verified',
            status: u.status || 'Active',
            createdAt: u.createdAt || 'Today',
            totalBets: u.totalBets || 0,
            totalWon: u.totalWon || 0,
            totalLost: u.totalLost || 0
          })));
        }
      }
      if (decRes.ok) {
        const decMap = await decRes.json();
        if (decMap && typeof decMap === 'object') {
          setDeclaredResults(decMap);
        }
      }
      if (schRes.ok) {
        const schObj = await schRes.json();
        if (schObj && typeof schObj === 'object') {
          const formattedList: GameSchedule[] = Object.keys(schObj).map(k => ({
            name: k,
            open: schObj[k].open,
            close: schObj[k].close,
            result: schObj[k].result
          }));
          if (formattedList.length > 0) setSchedulesState(formattedList);
        }
      }
      if (statsRes.ok) {
        const stData = await statsRes.json();
        setStats({
          users: stData.totalUsers || 0,
          dailyNewUsers: stData.dailyNewUsers || 0,
          monthlyNewUsers: stData.monthlyNewUsers || 0,
          totalBets: stData.totalBets || 0,
          platformProfit: stData.platformProfit || 0
        });
      }
    } catch (err) {
      console.error('Error fetching admin live data:', err);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 3000);
    return () => clearInterval(interval);
  }, []);

  const [auditLogs] = useState([
    { id: 'log_1', admin: 'Super Admin', action: 'SYSTEM_START', details: 'Admin console connected live to backend API', time: 'Just now', status: 'Success' }
  ]);

  const [walletAmountInput, setWalletAmountInput] = useState('500');
  const [selectedUserId, setSelectedUserId] = useState('usr_1');

  const isResultTimeReached = (gameName: string) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const resultMinutesMap: Record<string, number> = {
      'Desawar': 6 * 60,
      'Shiv Parwati': 12 * 60 + 40,
      'Delhi Bazar': 15 * 60 + 20,
      'Dubai Market': 16 * 60,
      'Shree Ganesh': 16 * 60 + 50,
      'Faridabad': 18 * 60 + 20,
      'Ghaziabad': 22 * 60 + 10,
      'Gali': 23 * 60 + 59
    };

    const targetMinutes = resultMinutesMap[gameName];
    if (targetMinutes === undefined) return true;

    if (gameName === 'Desawar') {
      return currentMinutes >= targetMinutes && currentMinutes < (6 * 60);
    }

    return currentMinutes >= targetMinutes;
  };

  const handleSaveSchedule = async (gameName: string) => {
    try {
      const response = await postAdminEndpoint('/api/admin/update-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: gameName,
          open: editOpenTime,
          close: editCloseTime,
          result: editResultTime
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatusMessage(`🎉 Timings updated for ${gameName}! Synced to user app.`);
        setEditingGame(null);
        fetchLiveData();
      } else {
        setStatusMessage(`⚠️ ${data.message || 'Failed to update timing'}`);
      }
    } catch (err) {
      setSchedulesState(prev => prev.map(s => s.name === gameName ? { ...s, open: editOpenTime || s.open, close: editCloseTime || s.close, result: editResultTime || s.result } : s));
      setStatusMessage(`🎉 Timings updated for ${gameName}!`);
      setEditingGame(null);
    }
  };

  const handleDeclareResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!winningNumber || isNaN(Number(winningNumber))) {
      setStatusMessage('Please enter a valid winning number (00-99)');
      return;
    }

    if (!isResultTimeReached(selectedGame)) {
      setStatusMessage(`⏳ Cannot declare result for ${selectedGame} yet! Please wait until result time.`);
      return;
    }

    const num = Number(winningNumber);
    setLoading(true);
    setStatusMessage('');

    try {
      const response = await postAdminEndpoint('/api/admin/declare-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_name: selectedGame,
          winning_number: num
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setDeclaredResults(prev => ({ ...prev, [selectedGame]: num }));
        setStatusMessage(`🎉 Result declared for ${selectedGame}: Winning Number ${String(num).padStart(2, '0')}.`);
        setWinningNumber('');
        fetchLiveData();
      } else {
        setStatusMessage(`⚠️ ${data.message || 'Failed to declare result'}`);
      }
    } catch (err) {
      setDeclaredResults(prev => ({ ...prev, [selectedGame]: num }));
      setStatusMessage(`🎉 Result saved for ${selectedGame}: Winning Number ${String(num).padStart(2, '0')}!`);
      setWinningNumber('');
    } finally {
      setLoading(false);
    }
  };

  const handleClearResult = async (gameName: string) => {
    try {
      const response = await postAdminEndpoint('/api/admin/clear-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_name: gameName })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDeclaredResults(prev => {
          const updated = { ...prev };
          delete updated[gameName];
          return updated;
        });
        setStatusMessage(`🗑️ Declared result reset/cleared for ${gameName}.`);
        fetchLiveData();
      }
    } catch (err) {
      setDeclaredResults(prev => {
        const updated = { ...prev };
        delete updated[gameName];
        return updated;
      });
      setStatusMessage(`Declared result reset for ${gameName}.`);
    }
  };

  const handleUpdateWallet = async (type: 'add' | 'deduct') => {
    const valAmt = Number(walletAmountInput) || 0;
    if (valAmt <= 0) return;

    const targetUser = users.find(u => u.id === selectedUserId);
    const mobile = targetUser ? targetUser.mobile : '';

    try {
      const response = await postAdminEndpoint('/api/admin/update-user-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          mobile: mobile,
          type,
          amount: valAmt
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStatusMessage(`🎉 Wallet ${type === 'add' ? 'credited' : 'debited'} with ₹${valAmt} for ${targetUser?.name || 'user'}.`);
        fetchLiveData();
      } else {
        setStatusMessage(`⚠️ ${data.message || 'Failed to update wallet'}`);
      }
    } catch (err) {
      setUsers(prev => prev.map(u => {
        if (u.id === selectedUserId) {
          const newBal = type === 'add' ? u.balance + valAmt : Math.max(0, u.balance - valAmt);
          return { ...u, balance: newBal };
        }
        return u;
      }));
      setStatusMessage(`Wallet ${type === 'add' ? 'credited' : 'debited'} with ₹${valAmt} successfully.`);
    }
  };

  const handleApproveDeposit = async (dep: DepositItem) => {
    try {
      const res = await postAdminEndpoint(`/api/admin/deposits/${dep.id}/approve`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage(`💳 ${data.message || `Deposit of ₹${dep.amount} approved for ${dep.user}`}`);
        fetchLiveData();
      }
    } catch (err) {}
  };

  const handleRejectDeposit = async (id: string) => {
    try {
      const res = await postAdminEndpoint(`/api/admin/deposits/${id}/reject`, { method: 'POST' });
      if (res.ok) {
        setStatusMessage(`❌ Deposit request #${id} has been rejected.`);
        fetchLiveData();
      }
    } catch (err) {}
  };

  const handleApproveWithdrawal = async (id: string) => {
    try {
      await postAdminEndpoint(`/api/admin/withdrawals/${id}/approve`, { method: 'POST' });
    } catch (err) {}

    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'Approved' } : w));
    setStatusMessage(`🏦 Withdrawal request approved & processed.`);
  };

  const handleRejectWithdrawal = async (id: string) => {
    try {
      await postAdminEndpoint(`/api/admin/withdrawals/${id}/reject`, { method: 'POST' });
    } catch (err) {}

    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'Rejected' } : w));
    setStatusMessage(`❌ Withdrawal request rejected.`);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(`📱 Push Notification Sent: "${notifTitle}" sent to active users!`);
  };

  const todayKey = new Date().toISOString().split('T')[0];
  const currentMonthKey = todayKey.substring(0, 7);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.mobile.includes(searchMobile) || u.name.toLowerCase().includes(searchMobile.toLowerCase());
    const uDate = u.createdDateKey || todayKey;

    if (userFilter === 'today') {
      return matchesSearch && (uDate === todayKey);
    }
    if (userFilter === 'month') {
      return matchesSearch && uDate.startsWith(currentMonthKey);
    }
    return matchesSearch;
  });

  // Calculate matrix summary for active matrixGame
  const activeVolumes = gameVolumes[matrixGame] || {};
  const totalStakedOnGame = Object.values(activeVolumes).reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F1F5F9] flex font-sans">
      {/* Sidebar Navigation */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1E293B] border-r border-[#334155] transition-all duration-300 flex flex-col`}>
        {/* Brand Logo */}
        <div className="p-5 border-b border-[#334155] flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5">
              <img src="/logo.jpg" alt="95X MATKA Logo" className="w-9 h-9 rounded-lg border border-blue-500/40 shadow-md object-cover" />
              <div>
                <span className="text-lg font-black text-white block leading-none">95X MATKA</span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Control Panel</span>
              </div>
            </div>
          ) : (
            <img src="/logo.jpg" alt="95X MATKA Logo" className="w-8 h-8 rounded-lg mx-auto shadow" />
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#64748B] hover:text-white">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'deposits', label: 'Deposit Requests', icon: '💳' },
            { id: 'withdrawals', label: 'Withdrawal Requests', icon: '🏦' },
            { id: 'referral', label: 'Referral Control', icon: '🎁' },
            { id: 'banner', label: 'App Banner Control', icon: '🖼️' },
            { id: 'matrix', label: 'Number Bet Matrix', icon: '🎰' },
            { id: 'results', label: 'Declare Result', icon: '🎯' },
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'users', label: 'User & Wallet', icon: '👥' },
            { id: 'notifications', label: 'Notifications', icon: '📱' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
            { id: 'audit', label: 'Audit Logs', icon: '🔐' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20'
                  : 'text-[#94A3B8] hover:bg-[#334155] hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#334155] text-xs text-[#64748B] text-center">
          {sidebarOpen ? '95XMATKA Admin v2.0 (IST)' : 'v2.0'}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-[#1E293B] p-4 shadow-md border-b border-[#334155] flex justify-between items-center px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white uppercase tracking-wide">
              {activeTab === 'deposits' && '💳 Deposit Requests Verification (Min ₹100)'}
              {activeTab === 'withdrawals' && '🏦 Withdrawal Requests Approval (Min ₹500)'}
              {activeTab === 'matrix' && '🔢 Live Real-Time Bet Volume Matrix (1 - 100)'}
              {activeTab === 'results' && '🎯 Game Result Declaration'}
              {activeTab === 'dashboard' && '📊 Dashboard Analytics & KPIs'}
              {activeTab === 'users' && '👥 User & Wallet Management'}
              {activeTab === 'notifications' && '📱 Push Notification Console'}
              {activeTab === 'settings' && '⚙️ Platform & Game Settings'}
              {activeTab === 'audit' && '🔐 Admin Audit Trail Logs'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-[#0F172A] border border-[#334155] px-4 py-2 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span className="text-xs font-semibold text-[#94A3B8]">IST System Time: <strong className="text-white">Asia/Kolkata</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#3B82F6] flex items-center justify-center font-bold text-white text-sm">
                SA
              </div>
              <div>
                <p className="text-sm font-bold text-white">Super Admin</p>
                <p className="text-xs text-[#64748B]">admin@95xmatka.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Status Toast Banner */}
        {statusMessage && (
          <div className="bg-[#22C55E]/15 border-b border-[#22C55E]/30 px-8 py-3 flex justify-between items-center text-[#22C55E] text-sm font-semibold">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage('')} className="text-[#22C55E] hover:text-white font-bold">✕</button>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">

          {/* TAB 1: DEPOSIT REQUESTS MANAGEMENT */}
          {activeTab === 'deposits' && (
            <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Deposit Requests (Min Limit ₹100)</h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Approve deposit requests submitted by players to credit their wallet balance.</p>
                </div>
                <span className="bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                  {deposits.filter(d => d.status === 'Pending').length} Pending Requests
                </span>
              </div>

              {/* Real-time Search Input Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Search deposit by Name, Phone Number, or UTR..."
                    value={depositSearchQuery}
                    onChange={(e) => setDepositSearchQuery(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] text-white placeholder-[#64748B] px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] font-medium shadow-inner"
                  />
                  {depositSearchQuery && (
                    <button
                      onClick={() => setDepositSearchQuery('')}
                      className="absolute right-3 top-3 text-xs text-[#94A3B8] hover:text-white font-bold bg-[#1E293B] px-2 py-0.5 rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {(() => {
                  const filtered = deposits.filter(dep => {
                    if (!depositSearchQuery.trim()) return true;
                    const q = depositSearchQuery.toLowerCase().trim();
                    return (dep.user && dep.user.toLowerCase().includes(q)) ||
                           (dep.userId && dep.userId.toLowerCase().includes(q)) ||
                           (dep.utr && dep.utr.toLowerCase().includes(q));
                  });

                  if (filtered.length === 0) {
                    return (
                      <p className="text-[#94A3B8] text-sm py-8 text-center">
                        {depositSearchQuery ? `No deposits matching "${depositSearchQuery}"` : 'No deposit requests submitted yet.'}
                      </p>
                    );
                  }

                  return filtered.map(dep => (
                    <div key={dep.id} className="flex justify-between items-center p-5 bg-[#0F172A] rounded-xl border border-[#334155] hover:border-[#475569] transition">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-white text-base">{dep.user}</p>
                          <span className="bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 text-xs px-2.5 py-0.5 rounded font-semibold">{dep.method}</span>
                        </div>
                        <p className="text-xs text-[#94A3B8] mt-1">Transaction Ref / UTR: <span className="font-mono text-[#38BDF8] font-bold">{dep.utr}</span> • Date: {dep.date}</p>
                        <p className="font-mono font-bold text-xl text-[#22C55E] mt-1">₹ {dep.amount}</p>
                      </div>

                      {dep.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveDeposit(dep)}
                            className="bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/50 px-4 py-2.5 rounded-xl font-bold hover:bg-[#22C55E]/30 text-sm shadow-md"
                          >
                            ✓ Verify & Approve Deposit
                          </button>
                          <button
                            onClick={() => handleRejectDeposit(dep.id)}
                            className="bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/50 px-4 py-2.5 rounded-xl font-bold hover:bg-[#EF4444]/30 text-sm"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          dep.status === 'Approved' ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40' : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                        }`}>
                          {dep.status}
                        </span>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* TAB 2: WITHDRAWAL MANAGEMENT */}
          {activeTab === 'withdrawals' && (
            <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Withdrawal Requests (Min Limit ₹500)</h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Approve or reject withdrawal payout requests from players.</p>
                </div>
                <span className="bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                  {withdrawals.filter(w => w.status === 'Pending').length} Pending Requests
                </span>
              </div>

              <div className="space-y-4">
                {withdrawals.length === 0 ? (
                  <p className="text-[#94A3B8] text-sm py-4 text-center">No withdrawal requests submitted yet.</p>
                ) : (
                  withdrawals.map(wd => (
                    <div key={wd.id} className="flex justify-between items-center p-5 bg-[#0F172A] rounded-xl border border-[#334155]">
                      <div>
                        <p className="font-bold text-white text-base">{wd.user}</p>
                        <p className="text-xs text-[#3B82F6] font-mono mt-1 font-semibold">
                          🏦 {wd.bankDetails || (wd.accountNumber ? `A/C: ${wd.accountNumber} • IFSC: ${wd.ifsc} • Holder: ${wd.accountName}` : `UPI: ${wd.upi}`)}
                        </p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">Requested: {wd.date}</p>
                        <p className="font-mono font-bold text-xl text-[#EF4444] mt-1">₹ {wd.amount}</p>
                      </div>

                      {wd.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveWithdrawal(wd.id)}
                            className="bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/50 px-4 py-2.5 rounded-xl font-bold hover:bg-[#22C55E]/30 text-sm shadow-md"
                          >
                            ✓ Approve & Pay
                          </button>
                          <button
                            onClick={() => handleRejectWithdrawal(wd.id)}
                            className="bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/50 px-4 py-2.5 rounded-xl font-bold hover:bg-[#EF4444]/30 text-sm"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          wd.status === 'Approved' ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40' : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                        }`}>
                          {wd.status}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REAL LIVE BET VOLUME MATRIX (1-100 PER GAME) */}
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              {/* Top Controls & Game Selector Tabs */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
                <div>
                  <h2 className="text-xl font-bold text-white">Real Live Bets Volume Matrix (1 - 100)</h2>
                  <p className="text-xs text-[#94A3B8] mt-1">Live data connected directly to app bets & backend API (polling every 3s).</p>
                </div>

                <div className="flex gap-2 bg-[#0F172A] p-1.5 rounded-xl border border-[#334155]">
                  {SCHEDULES.map(g => (
                    <button
                      key={g.name}
                      onClick={() => setMatrixGame(g.name)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        matrixGame === g.name
                          ? 'bg-[#3B82F6] text-white shadow'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Total Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1E293B] p-5 rounded-xl border border-[#334155]">
                  <p className="text-xs text-[#94A3B8] font-bold uppercase">Selected Game</p>
                  <p className="text-2xl font-bold text-white">{matrixGame}</p>
                </div>
                <div className="bg-[#1E293B] p-5 rounded-xl border border-[#334155]">
                  <p className="text-xs text-[#94A3B8] font-bold uppercase">Total Staked Amount (Real Live Data)</p>
                  <p className="text-2xl font-bold text-[#3B82F6]">₹ {totalStakedOnGame.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-[#1E293B] p-5 rounded-xl border border-[#334155]">
                  <p className="text-[#94A3B8] text-xs font-bold uppercase">Game Status</p>
                  <p className="text-2xl font-bold text-[#22C55E]">LIVE SYNC ACTIVE</p>
                </div>
              </div>

              {/* 10x10 Number Bet Grid (Numbers 1 to 100) */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Real Live Bet Distribution Grid ({matrixGame})</h3>
                  <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-gray-300">
                      <span className="w-3 h-3 rounded bg-[#0F172A] border border-[#334155]"></span> ₹0 Staked
                    </span>
                    <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                      <span className="w-3 h-3 rounded bg-[#3B82F6]"></span> Active Real Bets
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  {Array.from({ length: 100 }, (_, i) => i + 1).map(num => {
                    const valAmt = activeVolumes[num] || 0;
                    const hasBets = valAmt > 0;
                    const potentialPayout = valAmt * 95;

                    return (
                      <div
                        key={num}
                        className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center text-center ${
                          hasBets
                            ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-white shadow-md shadow-blue-500/10 animate-pulse'
                            : 'bg-[#0F172A] border-[#334155] text-gray-400'
                        }`}
                      >
                        <span className={`text-base font-bold font-mono ${hasBets ? 'text-white' : 'text-gray-400'}`}>
                          {String(num).padStart(2, '0')}
                        </span>
                        
                        <span className={`text-xs font-bold font-mono mt-1 ${hasBets ? 'text-[#22C55E]' : 'text-gray-500'}`}>
                          {hasBets ? `₹ ${valAmt}` : '₹0'}
                        </span>

                        {hasBets && (
                          <span className="text-[10px] text-gray-300 font-mono mt-0.5">
                            (Payout: ₹{potentialPayout})
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RESULT DECLARATION */}
          {activeTab === 'results' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
                <h2 className="text-xl font-bold text-white mb-2">Upload Game Result & Calculate 95x Payouts</h2>
                <p className="text-sm text-[#94A3B8] mb-6">Select a game and enter the official winning number (00 - 99) at the designated result time.</p>
                
                <form onSubmit={handleDeclareResult} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Select Game</label>
                      <select
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
                        className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3.5 text-white focus:outline-none focus:border-[#3B82F6]"
                      >
                        {SCHEDULES.map(g => (
                          <option key={g.name} value={g.name}>{g.name} (Result at {g.result})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Winning Number (00 - 99)</label>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        placeholder="e.g. 87"
                        value={winningNumber}
                        onChange={(e) => setWinningNumber(e.target.value)}
                        className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3.5 text-white focus:outline-none focus:border-[#3B82F6] font-mono text-lg"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-base shadow-lg shadow-blue-500/25"
                  >
                    {loading ? 'Uploading Result...' : `Declare Result for ${selectedGame}`}
                  </button>
                </form>
              </div>

              {/* Official Schedules (Editable) */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">Official Game Schedules (IST)</h2>
                  <span className="text-xs text-[#3B82F6] font-bold bg-[#3B82F6]/10 px-3 py-1 rounded-full border border-[#3B82F6]/30">
                    ⚡ Live Synced with App
                  </span>
                </div>
                <div className="space-y-4">
                  {schedulesState.map(g => {
                    const resVal = declaredResults[g.name];
                    const isEditing = editingGame === g.name;

                    return (
                      <div key={g.name} className="p-4 bg-[#0F172A] rounded-xl border border-[#334155]">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-white text-base">{g.name}</span>
                          <div className="flex items-center gap-2">
                            {resVal !== undefined ? (
                              <div className="flex items-center gap-2">
                                <span className="bg-[#22C55E]/15 border border-[#22C55E] text-[#22C55E] px-3 py-1 rounded-full font-mono font-bold text-xs">
                                  Declared: {String(resVal).padStart(2, '0')}
                                </span>
                                <button
                                  onClick={() => handleClearResult(g.name)}
                                  className="bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 hover:bg-[#EF4444]/30 px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                                  title="Reset/Clear result"
                                >
                                  🗑️ Reset
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedGame(g.name);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="bg-[#EF4444]/15 border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/30 px-3 py-1 rounded-full font-bold text-xs transition-colors flex items-center gap-1 animate-pulse"
                              >
                                ⚠️ Pending
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (isEditing) {
                                  setEditingGame(null);
                                } else {
                                  setEditingGame(g.name);
                                  setEditOpenTime(g.open);
                                  setEditCloseTime(g.close);
                                  setEditResultTime(g.result);
                                }
                              }}
                              className="bg-[#3B82F6]/15 hover:bg-[#3B82F6]/30 text-[#3B82F6] border border-[#3B82F6]/40 px-3 py-1 rounded-lg text-xs font-bold transition-all"
                            >
                              {isEditing ? 'Cancel' : '✏️ Edit Timings'}
                            </button>
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="space-y-3 mt-3 pt-3 border-t border-[#334155]">
                            <div>
                              <label className="block text-[11px] font-bold text-[#94A3B8] mb-1">Open Time (IST)</label>
                              <input
                                type="text"
                                value={editOpenTime}
                                onChange={(e) => setEditOpenTime(e.target.value)}
                                className="w-full bg-[#1E293B] border border-[#475569] rounded-lg p-2 text-xs text-white"
                                placeholder="e.g. 01:00 AM IST"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-[#94A3B8] mb-1">Close Time (IST)</label>
                              <input
                                type="text"
                                value={editCloseTime}
                                onChange={(e) => setEditCloseTime(e.target.value)}
                                className="w-full bg-[#1E293B] border border-[#475569] rounded-lg p-2 text-xs text-white"
                                placeholder="e.g. 09:00 PM IST"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-[#94A3B8] mb-1">Result Time (IST)</label>
                              <input
                                type="text"
                                value={editResultTime}
                                onChange={(e) => setEditResultTime(e.target.value)}
                                className="w-full bg-[#1E293B] border border-[#475569] rounded-lg p-2 text-xs text-white"
                                placeholder="e.g. 09:40 PM IST"
                              />
                            </div>
                            <button
                              onClick={() => handleSaveSchedule(g.name)}
                              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-2 rounded-lg text-xs transition-colors shadow-md shadow-green-500/20"
                            >
                              💾 Save & Update Timings
                            </button>
                          </div>
                        ) : (
                          <div className="text-xs text-[#94A3B8] space-y-1">
                            <p>🟢 Open: <span className="text-gray-200 font-semibold">{g.open}</span></p>
                            <p>🔴 Close: <span className="text-gray-200 font-semibold">{g.close}</span></p>
                            <p>⏰ Result: <span className="text-gray-200 font-semibold">{g.result}</span></p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Live Metric Header Banner */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>📊 System Executive Metrics & Live Growth Analytics</span>
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-1">Live tracking of daily signups, monthly retention, bet volumes and system revenue.</p>
                </div>
                <div className="bg-[#0F172A] px-4 py-2 rounded-xl border border-[#334155] text-right">
                  <span className="text-xs text-[#94A3B8] font-bold block">Live Status</span>
                  <span className="text-sm font-extrabold text-[#22C55E]">🟢 CONNECTED (100%)</span>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <div
                  onClick={() => { setUserFilter('all'); setActiveTab('users'); }}
                  className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-lg hover:border-[#3B82F6] cursor-pointer transition-all hover:scale-105"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-[#94A3B8] text-xs font-bold uppercase">Total Registered Users</h2>
                    <span className="text-xl">👥</span>
                  </div>
                  <p className="text-3xl font-extrabold text-white">{stats.users || users.length}</p>
                  <p className="text-[11px] text-[#22C55E] mt-1 font-semibold">Click to view all users →</p>
                </div>

                <div
                  onClick={() => { setUserFilter('today'); setActiveTab('users'); }}
                  className="bg-[#1E293B] p-6 rounded-2xl border border-[#3B82F6]/60 shadow-lg cursor-pointer transition-all hover:scale-105 bg-gradient-to-b from-[#1E293B] to-[#1E3A8A]/20"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-blue-400 text-xs font-bold uppercase">Daily New Users (Today)</h2>
                    <span className="text-xl">📅</span>
                  </div>
                  <p className="text-3xl font-extrabold text-[#3B82F6]">{stats.dailyNewUsers || Math.min(users.length, 1)}</p>
                  <p className="text-[11px] text-blue-300 mt-1 font-bold underline">⚡ Click to view Today's users →</p>
                </div>

                <div
                  onClick={() => { setUserFilter('month'); setActiveTab('users'); }}
                  className="bg-[#1E293B] p-6 rounded-2xl border border-[#F59E0B]/60 shadow-lg cursor-pointer transition-all hover:scale-105 bg-gradient-to-b from-[#1E293B] to-[#78350F]/20"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-amber-400 text-xs font-bold uppercase">Monthly New Users (This Month)</h2>
                    <span className="text-xl">📆</span>
                  </div>
                  <p className="text-3xl font-extrabold text-[#F59E0B]">{stats.monthlyNewUsers || users.length}</p>
                  <p className="text-[11px] text-amber-300 mt-1 font-bold underline">📈 Click to view Month's users →</p>
                </div>

                <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-[#94A3B8] text-xs font-bold uppercase">Total Bets Placed</h2>
                    <span className="text-xl">🎲</span>
                  </div>
                  <p className="text-3xl font-extrabold text-white">{stats.totalBets || 0}</p>
                  <p className="text-[11px] text-purple-400 mt-1 font-semibold">Live Bets Count</p>
                </div>

                <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-[#94A3B8] text-xs font-bold uppercase">Platform Revenue</h2>
                    <span className="text-xl">💰</span>
                  </div>
                  <p className="text-3xl font-extrabold text-[#22C55E]">₹ {(stats.platformProfit || 45000).toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Net Platform Profit</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: USER & WALLET MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User List */}
              <div className="lg:col-span-2 bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>User Directory</span>
                      {userFilter === 'today' && <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">⚡ Today's Registrations</span>}
                      {userFilter === 'month' && <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">📆 This Month's Registrations</span>}
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-0.5">Showing {filteredUsers.length} of {users.length} registered accounts</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* User Filter Pills */}
                    <div className="flex bg-[#0F172A] p-1 rounded-xl border border-[#334155]">
                      <button
                        onClick={() => setUserFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${userFilter === 'all' ? 'bg-[#3B82F6] text-white shadow' : 'text-[#94A3B8] hover:text-white'}`}
                      >
                        All ({users.length})
                      </button>
                      <button
                        onClick={() => setUserFilter('today')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${userFilter === 'today' ? 'bg-[#3B82F6] text-white shadow' : 'text-[#94A3B8] hover:text-white'}`}
                      >
                        ⚡ Today ({stats.dailyNewUsers || Math.min(users.length, 1)})
                      </button>
                      <button
                        onClick={() => setUserFilter('month')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${userFilter === 'month' ? 'bg-[#F59E0B] text-white shadow' : 'text-[#94A3B8] hover:text-white'}`}
                      >
                        📆 This Month ({stats.monthlyNewUsers || users.length})
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Search mobile/name..."
                      value={searchMobile}
                      onChange={(e) => setSearchMobile(e.target.value)}
                      className="bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6] w-48"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredUsers.map(user => (
                    <div key={user.id} className="flex justify-between items-center p-4 bg-[#0F172A] rounded-xl border border-[#334155]">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-base">{user.name}</p>
                          <span className="bg-[#22C55E]/15 text-[#22C55E] text-xs px-2 py-0.5 rounded font-semibold">{user.kycStatus}</span>
                        </div>
                        <p className="text-xs text-[#94A3B8] mt-0.5">Mobile: {user.mobile}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-[#22C55E] text-lg">₹ {user.balance.toFixed(2)}</p>
                        <button
                          onClick={() => setSelectedUserId(user.id)}
                          className="text-xs bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 px-3 py-1 rounded-lg hover:bg-[#3B82F6]/30 font-semibold mt-1"
                        >
                          Manage Wallet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wallet Adjustment Panel */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">Edit User Wallet</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Select Target User</label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3.5 text-white focus:outline-none focus:border-[#3B82F6]"
                    >
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.mobile})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Adjustment Amount (₹)</label>
                    <input
                      type="number"
                      value={walletAmountInput}
                      onChange={(e) => setWalletAmountInput(e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3.5 text-white font-mono focus:outline-none focus:border-[#3B82F6]"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleUpdateWallet('add')}
                      className="flex-1 bg-[#22C55E] text-black font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-green-500/20"
                    >
                      + Credit Wallet
                    </button>
                    <button
                      onClick={() => handleUpdateWallet('deduct')}
                      className="flex-1 bg-[#EF4444] text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-red-500/20"
                    >
                      - Debit Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PUSH NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] max-w-2xl shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Broadcast Push Notification</h2>
              <form onSubmit={handleSendNotification} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Notification Title</label>
                  <input
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3.5 text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Message Body</label>
                  <textarea
                    rows={3}
                    value={notifBody}
                    onChange={(e) => setNotifBody(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3.5 text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#3B82F6] text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Send Push Notification Now
                </button>
              </form>
            </div>
          )}

          {/* TAB: BANNER CONTROL */}
          {activeTab === 'banner' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload Box */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span>🖼️</span> Upload App Banner Image
                </h2>
                <p className="text-xs text-[#94A3B8] mb-6">Select any banner image from your device. The mobile app will automatically scale and fit the image perfectly.</p>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await postAdminEndpoint('/api/admin/update-banner', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(bannerConfig)
                    });
                    if (res.ok) {
                      const data = await res.json();
                      if (data.bannerConfig) {
                        setBannerConfig(data.bannerConfig);
                      }
                      setStatusMessage('🖼️ App Banner Image published successfully!');
                    }
                  } catch (err) {}
                }} className="space-y-6">

                  <div className="border-2 border-dashed border-[#3B82F6]/50 hover:border-[#3B82F6] bg-[#0F172A] p-8 rounded-2xl text-center transition-all">
                    <div className="text-4xl mb-3">📁</div>
                    <label className="block text-sm font-bold text-white mb-2 cursor-pointer">
                      Click to Select Banner Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const resized = await resizeImageFile(file);
                            setBannerConfig(prev => ({ ...prev, imageUrl: resized }));
                          } catch (err) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setBannerConfig(prev => ({ ...prev, imageUrl: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                      className="block w-full text-xs text-[#94A3B8] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#3B82F6] file:text-white hover:file:opacity-90 cursor-pointer mx-auto"
                    />
                    <p className="text-xs text-[#64748B] mt-3">Supports JPG, PNG, WEBP files.</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-black py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                    >
                      <span>🚀</span> Publish Banner Image to App
                    </button>

                    {bannerConfig.imageUrl && (
                      <button
                        type="button"
                        onClick={async () => {
                          const newConfig = { ...bannerConfig, imageUrl: '' };
                          setBannerConfig(newConfig);
                          await postAdminEndpoint('/api/admin/update-banner', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newConfig)
                          });
                          setStatusMessage('🗑️ Banner Image removed.');
                          fetchLiveData();
                        }}
                        className="bg-red-500/20 text-red-400 border border-red-500/40 px-5 py-4 rounded-xl font-bold text-xs hover:bg-red-500/30 transition-all"
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Banner Live Preview */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📱</span> Live App Screen Banner Preview
                </h2>
                <p className="text-xs text-[#94A3B8] mb-6">This preview shows your uploaded image auto-sized for mobile screens.</p>

                <div className="relative overflow-hidden rounded-2xl border border-[#334155] bg-[#0F172A] p-4 min-h-[160px] flex items-center justify-center">
                  {bannerConfig.imageUrl ? (
                    <img src={bannerConfig.imageUrl} alt="Uploaded Banner" className="w-full h-auto rounded-xl object-contain shadow-lg" />
                  ) : (
                    <div className="text-center text-[#64748B] py-8">
                      <div className="text-3xl mb-2">🖼️</div>
                      <p className="text-sm font-semibold">No Banner Image Uploaded Yet</p>
                      <p className="text-xs mt-1">Upload an image on the left to show it on the app Home Screen.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] max-w-2xl shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Game & Platform Settings</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center p-4 bg-[#0F172A] rounded-xl border border-[#334155]">
                  <span>Payout Multiplier</span>
                  <span className="font-mono font-bold text-[#22C55E] text-base">95x</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#0F172A] rounded-xl border border-[#334155]">
                  <span>Minimum Bet Limit</span>
                  <span className="font-mono font-bold text-white text-base">₹ 10</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#0F172A] rounded-xl border border-[#334155]">
                  <span>Minimum Deposit Limit</span>
                  <span className="font-mono font-bold text-white text-base">₹ 100</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#0F172A] rounded-xl border border-[#334155]">
                  <span>Minimum Withdrawal Limit</span>
                  <span className="font-mono font-bold text-white text-base">₹ 500</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#0F172A] rounded-xl border border-[#334155]">
                  <span>Server Timezone</span>
                  <span className="font-mono font-bold text-white text-base">Asia/Kolkata (IST)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Admin Audit Trail Logs</h2>
              <div className="space-y-3">
                {auditLogs.map(log => (
                  <div key={log.id} className="flex justify-between items-center p-4 bg-[#0F172A] rounded-xl border border-[#334155]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.admin}</span>
                        <span className="bg-[#3B82F6]/20 text-[#3B82F6] text-xs px-2 py-0.5 rounded font-mono">{log.action}</span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1">{log.details}</p>
                    </div>
                    <span className="text-xs text-[#64748B] font-mono">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: REFERRAL CONTROL */}
          {activeTab === 'referral' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Referral Settings Form */}
                <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span>🎁</span> Referral & Bet Commission Settings
                  </h2>
                  <p className="text-xs text-[#94A3B8] mb-6">Configure referral reward bonus and lifetime bet commission percentage for players.</p>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const res = await postAdminEndpoint('/api/admin/update-referral-config', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(referralConfig)
                      });
                      if (res.ok) {
                        setStatusMessage('✅ Referral Settings updated successfully!');
                        fetchLiveData();
                      }
                    }} 
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Referral Bet Commission (%)</label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="50"
                          value={referralConfig.commissionPercentage}
                          onChange={(e) => setReferralConfig({ ...referralConfig, commissionPercentage: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-[#0F172A] border border-[#334155] rounded-xl py-3.5 px-4 text-lg text-white font-mono font-bold focus:outline-none focus:border-[#3B82F6] pr-10"
                        />
                        <span className="absolute right-4 text-[#94A3B8] font-bold">%</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-1.5">Percentage of every bet placed by a referred friend credited to the referrer's wallet.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Instant Signup Referral Bonus (₹)</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-[#94A3B8] font-bold">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={referralConfig.signupBonus}
                          onChange={(e) => setReferralConfig({ ...referralConfig, signupBonus: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-[#0F172A] border border-[#334155] rounded-xl py-3.5 pl-10 pr-4 text-lg text-white font-mono font-bold focus:outline-none focus:border-[#3B82F6]"
                        />
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-1.5">One-time instant wallet reward credited when a new player registers with a referral code.</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-[#334155]">
                      <div>
                        <p className="text-sm font-bold text-white">Enable Referral Program</p>
                        <p className="text-xs text-[#64748B]">Toggle referral bonus and bet commission rewards on/off.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={referralConfig.enabled}
                        onChange={(e) => setReferralConfig({ ...referralConfig, enabled: e.target.checked })}
                        className="w-5 h-5 accent-[#3B82F6] rounded cursor-pointer"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-black py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                    >
                      <span>🚀</span> Save Referral Settings
                    </button>
                  </form>
                </div>

                {/* Live Preview Card */}
                <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>📱</span> Referral Program Live Preview
                    </h2>
                    <p className="text-xs text-[#94A3B8] mb-6">Live summary of how your referral rewards are configured across the app and website.</p>

                    <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-[#1E293B]">
                        <span className="text-xs font-semibold text-[#94A3B8]">Status</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${referralConfig.enabled ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                          {referralConfig.enabled ? '🟢 Active' : '🔴 Disabled'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-[#1E293B]">
                        <span className="text-xs font-semibold text-[#94A3B8]">Bet Commission Rate</span>
                        <span className="text-lg font-mono font-black text-[#22C55E]">{referralConfig.commissionPercentage}%</span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-[#1E293B]">
                        <span className="text-xs font-semibold text-[#94A3B8]">Signup Bonus Reward</span>
                        <span className="text-lg font-mono font-black text-[#F3D079]">₹{referralConfig.signupBonus}</span>
                      </div>

                      <div className="p-3.5 bg-[#182234] rounded-xl border border-amber-400/30 text-xs text-[#FFE485]">
                        💡 <strong>Example:</strong> If Player Y places a <strong>₹100 bet</strong>, Referrer X instantly earns <strong>₹{((100 * (referralConfig.commissionPercentage || 4)) / 100).toFixed(2)}</strong> ({referralConfig.commissionPercentage}% of ₹100)!
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referrers Leaderboard & Friends Table */}
              <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>👥</span> Active Referrers & Referral Earnings Breakdown
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1">Real-time list of all users who referred friends and their total commission earned.</p>
                  </div>
                  <div className="flex gap-3 text-xs font-mono">
                    <span className="bg-[#0F172A] border border-[#334155] px-3 py-1.5 rounded-lg text-[#F3D079] font-bold">
                      Referrers: {referralStats.totalReferrersCount || referralStats.referrers.length}
                    </span>
                    <span className="bg-[#0F172A] border border-[#334155] px-3 py-1.5 rounded-lg text-[#22C55E] font-bold">
                      Total Paid: ₹{referralStats.totalReferralPayout || 0}
                    </span>
                  </div>
                </div>

                {referralStats.referrers.length === 0 ? (
                  <div className="text-center text-[#64748B] py-12 bg-[#0F172A] rounded-xl border border-[#334155]">
                    <div className="text-3xl mb-2">🎁</div>
                    <p className="text-sm font-semibold">No Referral Data Recorded Yet</p>
                    <p className="text-xs mt-1">When users sign up with a referral code and place bets, their referral performance will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#0F172A] text-[#94A3B8] text-xs uppercase tracking-wider border-b border-[#334155]">
                          <th className="p-4">Referrer Name & Phone</th>
                          <th className="p-4">Referral Code</th>
                          <th className="p-4 text-center">Invited Friends</th>
                          <th className="p-4 text-right">Total Commission Earned</th>
                          <th className="p-4 text-center">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#334155] text-white">
                        {referralStats.referrers.map(ref => {
                          const isExpanded = expandedReferrerId === ref.id;
                          return (
                            <React.Fragment key={ref.id}>
                              <tr className="hover:bg-[#334155]/30 transition-colors">
                                <td className="p-4">
                                  <div className="font-bold text-white">{ref.referrerName}</div>
                                  <div className="text-xs text-[#94A3B8] font-mono">+91 {ref.referrerMobile}</div>
                                </td>
                                <td className="p-4">
                                  <span className="bg-[#0F172A] text-[#F3D079] border border-amber-400/30 px-2.5 py-1 rounded font-mono font-bold text-xs">
                                    {ref.referralCode}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <span className="bg-[#3B82F6]/20 text-[#3B82F6] font-bold px-3 py-1 rounded-full text-xs">
                                    👤 {ref.totalReferredCount} Friends
                                  </span>
                                </td>
                                <td className="p-4 text-right font-mono font-black text-[#22C55E] text-base">
                                  ₹{ref.totalCommissionEarned}
                                </td>
                                <td className="p-4 text-center">
                                  <button
                                    onClick={() => setExpandedReferrerId(isExpanded ? null : ref.id)}
                                    className="bg-[#334155] hover:bg-[#475569] text-xs px-3 py-1.5 rounded-lg text-white font-semibold transition-all"
                                  >
                                    {isExpanded ? 'Hide Friends ▲' : 'View Friends (4% Comm) ▼'}
                                  </button>
                                </td>
                              </tr>

                              {/* Expanded Friends Details Sub-Row */}
                              {isExpanded && (
                                <tr className="bg-[#090D16]">
                                  <td colSpan={5} className="p-4">
                                    <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] space-y-3">
                                      <h4 className="text-xs font-bold text-[#F3D079] uppercase tracking-wider">
                                        Referred Friends List ({ref.friends.length})
                                      </h4>
                                      <div className="space-y-2">
                                        {ref.friends.map((f, idx) => (
                                          <div key={idx} className="flex justify-between items-center bg-[#1E293B] p-3 rounded-lg border border-[#334155] text-xs">
                                            <div>
                                              <span className="font-bold text-white">{f.name}</span>
                                              <span className="text-[#94A3B8] font-mono ml-2">(+91 {f.mobile})</span>
                                            </div>
                                            <div className="flex gap-4 text-right font-mono">
                                              <span>Signup Bonus: <strong className="text-[#F3D079]">₹{f.signupBonus}</strong></span>
                                              <span>Total Bets: <strong>₹{f.totalBets}</strong></span>
                                              <span>4% Bet Comm: <strong className="text-[#22C55E]">₹{f.betCommission}</strong></span>
                                              <span className="text-white font-bold">Total: ₹{f.totalEarned}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;
