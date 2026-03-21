import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBarChart2, FiTrendingUp, FiDollarSign, FiUsers, FiShield } from 'react-icons/fi';

const Reports = () => {
  const [stats, setStats] = useState({});
  const [premiums, setPremiums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, premiumsRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/premiums/all')
        ]);
        setStats(statsRes.data);
        setPremiums(premiumsRes.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  const paidPremiums = premiums.filter(p => p.status === 'paid');
  const pendingPremiums = premiums.filter(p => p.status === 'pending');

  return (
    <div>
      <div className="page-header">
        <h1>Financial Reports</h1>
        <p>Financial summaries and system analytics</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon green"><FiTrendingUp /></div>
          <div className="stat-info"><h3>₹{stats.totalRevenue || 0}</h3><p>Total Revenue Collected</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><FiDollarSign /></div>
          <div className="stat-info"><h3>{paidPremiums.length}</h3><p>Premiums Paid</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><FiDollarSign /></div>
          <div className="stat-info"><h3>{pendingPremiums.length}</h3><p>Premiums Pending</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><FiShield /></div>
          <div className="stat-info"><h3>{stats.totalPolicies || 0}</h3><p>Total Policies</p></div>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: '24px' }}>
        <div className="table-header">
          <h3>Recent Premium Payments</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Policy</th>
              <th>Amount</th>
              <th>Paid Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paidPremiums.slice(0, 10).map(p => (
              <tr key={p._id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.customer?.name}</td>
                <td>{p.purchase?.policy?.title || 'N/A'}</td>
                <td>₹{p.amount}</td>
                <td>{p.paidDate ? new Date(p.paidDate).toLocaleDateString() : '—'}</td>
                <td><span className="badge paid">Paid</span></td>
              </tr>
            ))}
            {paidPremiums.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No payments recorded yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
