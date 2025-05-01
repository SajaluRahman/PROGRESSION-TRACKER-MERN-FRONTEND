
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';

const TaskList = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTask, setEditTask] = useState({ title: '', description: '', status: '' });
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/tasks?project=${projectId}`);
      console.log('Fetched tasks:', response.data);
      setTasks(response.data);
    } catch (err) {
      console.error('Fetch tasks error:', err.response?.data, err.message);
      setError(err.response?.data?.message || 'Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }
    try {
      await api.post('/tasks', { ...newTask, project: projectId });
      setNewTask({ title: '', description: '', status: 'To Do' });
      fetchTasks();
    } catch (err) {
      console.error('Create task error:', err.response?.data, err.message);
      setError(err.response?.data?.message || 'Error creating task');
    }
  };

  const handleEditTask = (task) => {
    setEditTaskId(task._id);
    setEditTask({ title: task.title, description: task.description, status: task.status });
  };

  const handleUpdateTask = async (taskId) => {
    if (!editTask.title.trim()) {
      setError('Task title is required');
      return;
    }
    try {
      console.log('Updating task:', taskId, editTask);
      await api.put(`/tasks/${taskId}`, editTask);
      setEditTaskId(null);
      setEditTask({ title: '', description: '', status: '' });
      fetchTasks();
    } catch (err) {
      console.error('Update task error:', err.response?.data, err.message);
      setError(err.response?.data?.message || 'Error updating task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Delete task error:', err.response?.data, err.message);
      setError(err.response?.data?.message || 'Error deleting task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Tasks for Project
          </h2>
          <button
            onClick={() => logout()}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Log Out
          </button>
        </div>

        {/* Create Task Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleCreateTask} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Task Title
              </label>
              <input
                id="title"
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                placeholder="Enter task title"
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                placeholder="Enter task description"
                disabled={loading}
                rows="4"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                disabled={loading}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
              ) : null}
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </div>

        {/* Back to Projects Button */}
        <button
          onClick={() => navigate('/projects')}
          className="mb-6 py-2 px-4 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
        >
          Back to Projects
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center p-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              ></path>
            </svg>
          </div>
        )}

        {/* Task List */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {tasks.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">
                No tasks yet. Create one above!
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <li
                    key={task._id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {editTaskId === task._id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editTask.title}
                          onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                          placeholder="Enter task title"
                        />
                        <textarea
                          value={editTask.description}
                          onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                          placeholder="Enter task description"
                          rows="4"
                        />
                        <select
                          value={editTask.status}
                          onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
                        </select>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleUpdateTask(task._id)}
                            className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditTaskId(null)}
                            className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          <p className="text-gray-600">{task.description}</p>
                          <p className="text-sm text-gray-500">
                            Status:{' '}
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === 'Done'
                                  ? 'bg-green-100 text-green-800'
                                  : task.status === 'In Progress'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {task.status}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(task.createdAt).toLocaleDateString()}
                          </p>
                          {task.completedAt && (
                            <p className="text-sm text-gray-500">
                              Completed: {new Date(task.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="py-2 px-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
