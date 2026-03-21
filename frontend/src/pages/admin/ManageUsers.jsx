import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUsers, FiToggleLeft, FiToggleRight, FiTrash2 } from 'react-icons/fi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const url = filter ? `/api/admin/users?role=${filter}` : '/api/admin/users';
      const { data } = await axios.get(url);
      setUsers(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [filter]);

  const handleToggle = async (id) => {
    try {
      await axios.put(`/api/admin/users/${id}/toggle`);
      toast.success('User status updated');
      fetchUsers();
    } catch (err) { toast.error('Failed to update user'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) { toast.error('Failed to delete user'); }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>View, activate/deactivate, and manage all users</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <select className="form-control" style={{ width: '200px' }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="customer">Customers</option>
          <option value="agent">Agents</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || '—'}</td>
                <td><span className="badge" style={{ background: 'rgba(108,92,231,0.12)', color: 'var(--accent-light)' }}>{u.role}</span></td>
                <td><span className={`badge ${u.isActive ? 'active' : 'inactive'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-outline btn-sm" onClick={() => handleToggle(u._id)} title={u.isActive ? 'Deactivate' : 'Activate'}>
                      {u.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
