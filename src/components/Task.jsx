import React, { useState } from 'react';

const Task = ({ task, onDelete, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'Pending');

  const validStatuses = ['Pending', 'In Progress', 'Completed'];

  const handleUpdate = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!validStatuses.includes(status)) {
      setError('Invalid status');
      return;
    }
    const updateData = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
    };
    console.log('Updating task:', task._id, updateData);
    setLoading(true);
    setError(null);
    try {
      await onUpdate(task._id, updateData);
      setIsEditing(false);
    } catch (err) {
      console.error('Update task error:', err.response?.data);
      setError(err.response?.data?.message || 'Error updating task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await onDelete(task._id);
    } catch (err) {
      console.error('Delete task error:', err.response?.data);
      setError(err.response?.data?.message || 'Error deleting task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 mb-4">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Task Title"
            disabled={loading}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Task Description"
            disabled={loading}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input input-bordered w-full"
            disabled={loading}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {error && <div className="text-red-500">{error}</div>}
          <button
            onClick={handleUpdate}
            className={`bg-blue-600 text-white p-2 mr-2 ${loading ? 'cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-600 text-white p-2 hover:bg-gray-700"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold">{task.title}</h3>
          <p>{task.description || 'No description'}</p>
          <p>Status: {task.status}</p>
          <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
          {task.completedAt && (
            <p>Completed: {new Date(task.completedAt).toLocaleDateString()}</p>
          )}
          <button
            onClick={() => handleDelete()}
            className={`bg-red-600 text-white p-2 mr-2 ${loading ? 'cursor-not-allowed' : 'hover:bg-red-700'}`}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className={`bg-blue-600 text-white p-2 ${loading ? 'cursor-not-allowed' : 'hover:bg-blue-700'}`}
            disabled={loading}
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default Task;