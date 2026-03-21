import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiShield, FiFileText, FiDollarSign, FiAlertCircle, FiUsers, FiBarChart2, FiLogOut, FiPlusCircle, FiCheckSquare, FiList, FiActivity } from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = {
    customer: 'Customer Panel',
    agent: 'Agent Panel',
    admin: 'Admin Panel'
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>InsureVault</h2>
        <small>{roleLabel[user?.role] || 'Dashboard'}</small>
      </div>

      <nav className="sidebar-nav">
        {/* Common */}
        <NavLink to="/dashboard"><FiHome /> Dashboard</NavLink>

        {/* Customer Links */}
        {user?.role === 'customer' && (
          <>
            <div className="sidebar-section-title">Policies</div>
            <NavLink to="/policies"><FiShield /> View Policies</NavLink>
            <NavLink to="/my-policies"><FiFileText /> My Policies</NavLink>
            <div className="sidebar-section-title">Payments</div>
            <NavLink to="/premiums"><FiDollarSign /> Pay Premium</NavLink>
            <div className="sidebar-section-title">Claims</div>
            <NavLink to="/submit-claim"><FiAlertCircle /> Submit Claim</NavLink>
            <NavLink to="/my-claims"><FiList /> Track Claims</NavLink>
          </>
        )}

        {/* Agent Links */}
        {user?.role === 'agent' && (
          <>
            <div className="sidebar-section-title">Policy Management</div>
            <NavLink to="/create-policy"><FiPlusCircle /> Create Policy</NavLink>
            <NavLink to="/manage-policies"><FiShield /> Manage Policies</NavLink>
            <div className="sidebar-section-title">Customer</div>
            <NavLink to="/review-applications"><FiCheckSquare /> Review Applications</NavLink>
            <NavLink to="/process-claims"><FiAlertCircle /> Process Claims</NavLink>
          </>
        )}

        {/* Admin Links */}
        {user?.role === 'admin' && (
          <>
            <div className="sidebar-section-title">Management</div>
            <NavLink to="/manage-users"><FiUsers /> Manage Users</NavLink>
            <NavLink to="/monitor-policies"><FiShield /> Monitor Policies</NavLink>
            <div className="sidebar-section-title">Analytics</div>
            <NavLink to="/reports"><FiBarChart2 /> Reports</NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-nav" style={{ padding: '12px', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={handleLogout}><FiLogOut /> Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
