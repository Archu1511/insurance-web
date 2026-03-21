import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Customer
import CustomerDashboard from './pages/customer/Dashboard';
import ViewPolicies from './pages/customer/ViewPolicies';
import MyPolicies from './pages/customer/MyPolicies';
import Premiums from './pages/customer/Premiums';
import SubmitClaim from './pages/customer/SubmitClaim';
import TrackClaims from './pages/customer/TrackClaims';

// Agent
import AgentDashboard from './pages/agent/Dashboard';
import CreatePolicy from './pages/agent/CreatePolicy';
import ManagePolicies from './pages/agent/ManagePolicies';
import ReviewApplications from './pages/agent/ReviewApplications';
import ProcessClaims from './pages/agent/ProcessClaims';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import MonitorPolicies from './pages/admin/MonitorPolicies';
import Reports from './pages/admin/Reports';

const DashboardRouter = () => {
  const { user } = useAuth();
  if (user?.role === 'agent') return <AgentDashboard />;
  if (user?.role === 'admin') return <AdminDashboard />;
  return <CustomerDashboard />;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />

              {/* Customer Routes */}
              <Route path="/policies" element={<ProtectedRoute roles={['customer']}><ViewPolicies /></ProtectedRoute>} />
              <Route path="/my-policies" element={<ProtectedRoute roles={['customer']}><MyPolicies /></ProtectedRoute>} />
              <Route path="/premiums" element={<ProtectedRoute roles={['customer']}><Premiums /></ProtectedRoute>} />
              <Route path="/submit-claim" element={<ProtectedRoute roles={['customer']}><SubmitClaim /></ProtectedRoute>} />
              <Route path="/my-claims" element={<ProtectedRoute roles={['customer']}><TrackClaims /></ProtectedRoute>} />

              {/* Agent Routes */}
              <Route path="/create-policy" element={<ProtectedRoute roles={['agent']}><CreatePolicy /></ProtectedRoute>} />
              <Route path="/manage-policies" element={<ProtectedRoute roles={['agent']}><ManagePolicies /></ProtectedRoute>} />
              <Route path="/review-applications" element={<ProtectedRoute roles={['agent']}><ReviewApplications /></ProtectedRoute>} />
              <Route path="/process-claims" element={<ProtectedRoute roles={['agent']}><ProcessClaims /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/manage-users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
              <Route path="/monitor-policies" element={<ProtectedRoute roles={['admin']}><MonitorPolicies /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute roles={['admin']}><Reports /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;
