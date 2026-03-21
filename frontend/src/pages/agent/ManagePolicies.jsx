import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiShield, FiTrash2, FiEdit } from 'react-icons/fi';

const ManagePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolicies = async () => {
    try {
      const { data } = await axios.get('/api/policies/all');
      setPolicies(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchPolicies(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this policy?')) return;
    try {
      await axios.delete(`/api/policies/${id}`);
      toast.success('Policy deleted');
      fetchPolicies();
    } catch (err) {
      toast.error('Failed to delete policy');
    }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Manage Policies</h1>
        <p>View and manage all your created policies</p>
      </div>

      {policies.length === 0 ? (
        <div className="empty-state"><FiShield /><h3>No policies created yet</h3></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Premium</th>
                <th>Coverage</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map(p => (
                <tr key={p._id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.title}</td>
                  <td>{p.type}</td>
                  <td>₹{p.premiumAmount}/mo</td>
                  <td>₹{p.coverageAmount}</td>
                  <td>{p.duration} months</td>
                  <td><span className={`badge ${p.status}`}>{p.status}</span></td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
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

export default ManagePolicies;
