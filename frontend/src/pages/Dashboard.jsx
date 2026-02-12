import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/v1/tasks');
      setTasks(data.data);
    } catch {
      setError('Failed to load tasks');
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const clearMessages = () => { setError(''); setSuccess(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      if (editId) {
        await api.put(`/v1/tasks/${editId}`, form);
        setSuccess('Task updated');
      } else {
        await api.post('/v1/tasks', form);
        setSuccess('Task created');
      }
      setForm({ title: '', description: '', status: 'pending' });
      setEditId(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setForm({ title: task.title, description: task.description || '', status: task.status });
    clearMessages();
  };

  const handleDelete = async (id) => {
    clearMessages();
    try {
      await api.delete(`/v1/tasks/${id}`);
      setSuccess('Task deleted');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete');
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ title: '', description: '', status: 'pending' });
  };

  const badgeClass = (status) => `badge badge-${status}`;

  return (
    <>
      <h1>Dashboard</h1>
      <p className="mt-8" style={{ color: '#666' }}>
        Welcome, {user.name} — role: <strong>{user.role}</strong>
      </p>

      {error && <div className="alert alert-error mt-16">{error}</div>}
      {success && <div className="alert alert-success mt-16">{success}</div>}

      <div className="card mt-16">
        <h2>{editId ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex gap-8">
            <button className="btn btn-primary">{editId ? 'Update' : 'Create'}</button>
            {editId && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card mt-16">
        <h2>Tasks ({tasks.length})</h2>
        {tasks.length === 0 && <p style={{ color: '#999' }}>No tasks yet</p>}
        {tasks.map((t) => (
          <div className="task-item" key={t.id}>
            <div>
              <strong>{t.title}</strong>
              {t.description && <p style={{ fontSize: 13, color: '#666' }}>{t.description}</p>}
            </div>
            <div className="task-meta">
              <span className={badgeClass(t.status)}>{t.status}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(t)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
