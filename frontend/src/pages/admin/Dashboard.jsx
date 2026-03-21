import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiShield, FiDollarSign, FiAlertCircle, FiTrendingUp, FiActivity } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats');
        setStats(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>System overview and key metrics</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><FiUsers /></div>
          <div className="stat-info"><h3>{stats.totalCustomers || 0}</h3><p>Customers</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><FiUsers /></div>
          <div className="stat-info"><h3>{stats.totalAgents || 0}</h3><p>Agents</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FiShield /></div>
          <div className="stat-info"><h3>{stats.activePolicies || 0}</h3><p>Active Policies</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><FiActivity /></div>
          <div className="stat-info"><h3>{stats.totalPurchases || 0}</h3><p>Total Purchases</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><FiAlertCircle /></div>
          <div className="stat-info"><h3>{stats.pendingClaims || 0}</h3><p>Pending Claims</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FiTrendingUp /></div>
          <div className="stat-info"><h3>₹{stats.totalRevenue || 0}</h3><p>Total Revenue</p></div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
