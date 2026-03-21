import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiShield } from 'react-icons/fi';

const MonitorPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
    try {
      const { data } = await axios.get('/api/admin/policies');
      setPolicies(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchPolicies(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/admin/policies/${id}/status`, { status });
      toast.success(`Policy ${status}`);
      fetchPolicies();
    } catch (err) { toast.error('Failed to update policy'); }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Monitor Policies</h1>
        <p>Approve, activate, or deactivate insurance policies</p>
      </div>

      {policies.length === 0 ? (
        <div className="empty-state"><FiShield /><h3>No policies found</h3></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Agent</th>
                <th>Premium</th>
                <th>Coverage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map(p => (
                <tr key={p._id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.title}</td>
                  <td>{p.type}</td>
                  <td>{p.createdBy?.name || 'N/A'}</td>
                  <td>₹{p.premiumAmount}/mo</td>
                  <td>₹{p.coverageAmount}</td>
                  <td><span className={`badge ${p.status}`}>{p.status}</span></td>
                  <td>
                    <div className="btn-group">
                      {p.status !== 'active' && <button className="btn btn-success btn-sm" onClick={() => handleStatusChange(p._id, 'active')}>Activate</button>}
                      {p.status !== 'inactive' && <button className="btn btn-danger btn-sm" onClick={() => handleStatusChange(p._id, 'inactive')}>Deactivate</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MonitorPolicies;
