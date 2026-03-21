import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiFileText } from 'react-icons/fi';

const ReviewApplications = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const { data } = await axios.get('/api/purchases/all');
        setPurchases(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchPurchases();
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Review Applications</h1>
        <p>View all customer policy applications</p>
      </div>

      {purchases.length === 0 ? (
        <div className="empty-state"><FiFileText /><h3>No applications yet</h3></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Policy</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p._id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.customer?.name}</td>
                  <td>{p.customer?.email}</td>
                  <td>{p.policy?.title}</td>
                  <td>{new Date(p.startDate).toLocaleDateString()}</td>
                  <td>{new Date(p.endDate).toLocaleDateString()}</td>
                  <td><span className={`badge ${p.status}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewApplications;
