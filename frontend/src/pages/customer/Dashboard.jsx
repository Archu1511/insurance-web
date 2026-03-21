import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FiShield, FiDollarSign, FiAlertCircle, FiFileText, FiActivity } from 'react-icons/fi';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ purchases: 0, pendingPremiums: 0, claims: 0, activePolicies: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [purchases, premiums, claims] = await Promise.all([
          axios.get('/api/purchases'),
          axios.get('/api/premiums'),
          axios.get('/api/claims')
        ]);
        setStats({
          purchases: purchases.data.length,
          activePolicies: purchases.data.filter(p => p.status === 'active').length,
          pendingPremiums: premiums.data.filter(p => p.status === 'pending').length,
          claims: claims.data.length
        });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {user?.name} 👋</h1>
        <p>Here's an overview of your insurance portfolio</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><FiShield /></div>
          <div className="stat-info">
            <h3>{stats.activePolicies}</h3>
            <p>Active Policies</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FiFileText /></div>
          <div className="stat-info">
            <h3>{stats.purchases}</h3>
            <p>Total Purchases</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><FiDollarSign /></div>
          <div className="stat-info">
            <h3>{stats.pendingPremiums}</h3>
            <p>Pending Premiums</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><FiAlertCircle /></div>
          <div className="stat-info">
            <h3>{stats.claims}</h3>
            <p>Claims Filed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
