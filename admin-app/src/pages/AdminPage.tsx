import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import WithdrawalRequests from '../components/admin/WithdrawalRequests';
import AdminDeposits from '../components/admin/AdminDeposits';
import AdminCryptoSettings from '../components/admin/AdminCryptoSettings';
import SystemSettings from '../components/admin/SystemSettings';
import SubscriptionInvestments from '../components/admin/SubscriptionInvestments';
import KycReviews from '../components/admin/KycReviews';
import Commissions from '../components/admin/Commissions';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="admin-main">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/subscription-investments" element={<SubscriptionInvestments />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/kyc" element={<KycReviews />} />
            <Route path="/deposits" element={<AdminDeposits />} />
            <Route path="/withdrawals" element={<WithdrawalRequests />} />
            <Route path="/crypto-settings" element={<AdminCryptoSettings />} />
            <Route path="/system-settings" element={<SystemSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 