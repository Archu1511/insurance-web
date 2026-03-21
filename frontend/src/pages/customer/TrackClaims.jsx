import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiAlertCircle } from 'react-icons/fi';

const TrackClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const { data } = await axios.get('/api/claims');
        setClaims(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchClaims();
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Track Claims</h1>
        <p>Monitor the status of your insurance claims</p>
      </div>

      {claims.length === 0 ? (
        <div className="empty-state">
          <FiAlertCircle />
          <h3>No claims filed yet</h3>
          <p>Submit a claim to start tracking</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Policy</th>
                <th>Claim Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(c => (
                <tr key={c._id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.purchase?.policy?.title || 'N/A'}</td>
                  <td>₹{c.claimAmount}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td><span className={`badge ${c.status}`}>{c.status}</span></td>
                  <td>{c.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrackClaims;
