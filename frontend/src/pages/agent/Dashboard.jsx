import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiShield, FiUsers, FiAlertCircle, FiFileText } from 'react-icons/fi';

const AgentDashboard = () => {
  const [stats, setStats] = useState({ policies: 0, applications: 0, claims: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [policies, applications, claims] = await Promise.all([
          axios.get('/api/policies/all'),
          axios.get('/api/purchases/all'),
          axios.get('/api/claims/all')
        ]);
        setStats({
          policies: policies.data.length,
          applications: applications.data.length,
          claims: claims.data.filter(c => c.status === 'pending').length
        });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Agent Dashboard</h1>
        <p>Overview of policies, applications, and claims</p>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><FiShield /></div>
          <div className="stat-info"><h3>{stats.policies}</h3><p>My Policies</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><FiFileText /></div>
          <div className="stat-info"><h3>{stats.applications}</h3><p>Total Applications</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><FiAlertCircle /></div>
          <div className="stat-info"><h3>{stats.claims}</h3><p>Pending Claims</p></div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
