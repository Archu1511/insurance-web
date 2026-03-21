import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiAlertCircle } from 'react-icons/fi';

const ProcessClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const { data } = await axios.get('/api/claims/all');
      setClaims(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchClaims(); }, []);

  const handleProcess = async (id, status) => {
    const remarks = prompt(`Enter remarks for ${status}:`);
    if (remarks === null) return;
    try {
      await axios.put(`/api/claims/${id}/process`, { status, remarks });
      toast.success(`Claim ${status} successfully`);
      fetchClaims();
    } catch (err) {
      toast.error('Failed to process claim');
    }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Process Claims</h1>
        <p>Review and approve or reject insurance claims</p>
      </div>

      {claims.length === 0 ? (
        <div className="empty-state"><FiAlertCircle /><h3>No claims to process</h3></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Policy</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(c => (
                <tr key={c._id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.customer?.name}</td>
                  <td>{c.purchase?.policy?.title || 'N/A'}</td>
                  <td>₹{c.claimAmount}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description}</td>
                  <td><span className={`badge ${c.status}`}>{c.status}</span></td>
                  <td>
                    {c.status === 'pending' && (
                      <div className="btn-group">
                        <button className="btn btn-success btn-sm" onClick={() => handleProcess(c._id, 'approved')}>Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleProcess(c._id, 'rejected')}>Reject</button>
                      </div>
                    )}
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

export default ProcessClaims;
