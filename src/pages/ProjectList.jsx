
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [editProjectId, setEditProjectId] = useState(null);
  const [infoVisible, setInfoVisible] = useState({}); // Track visibility of mobile info text
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Fetch projects error:', err.response?.data, err.message);
      setError(err.response?.data?.message || 'Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setError('Project title is required');
      return;
    }
    try {
      await api.post('/projects', { title: newTitle.trim() });
      setNewTitle('');
      fetchProjects();
    } catch (err) {
      console.error('Create project error:', err.response?.data, err.message);
      setError(err.response?.data?.message || 'Error creating project');
    }
  };

  const handleEditProject = async (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    if (!project) return;
    setEditProjectId(projectId);
    setNewTitle(project.title);
  };

  const handleUpdateProject = async (projectId) => {
    if (!newTitle.trim()) {
      setError('Project title is required');
      return;
    }
    try {
      await api.put(`/projects/${projectId}`, { title: newTitle.trim() });
      setEditProjectId(null);
      setNewTitle('');
      fetchProjects();
    } catch (err) {
      console.error('Update project error:', err.response?.data, err.message);
      setError(err.response?.data?.message || 'Error updating project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${projectId}`);
      fetchProjects();
    } catch (err) {
      console.error('Delete project error:', err.response?.data, err.message);
      setError(err.response?.data?.message || 'Error deleting project');
    }
  };

  const toggleInfo = (projectId) => {
    setInfoVisible((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Your Projects
          </h2>
        </div>

        {/* Create Project Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleCreateProject} className="space-y-6">
            <div>
              <label
                htmlFor="newTitle"
                className="block text-sm font-medium text-gray-700"
              >
                New Project Title
              </label>
              <input
                id="newTitle"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                placeholder="Enter project title"
                disabled={loading}
              />
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
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        </div>

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

        {/* Project List */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {projects.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">
                No projects yet. Create one above!
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <li
                    key={project._id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200 relative group"
                  >
                    {editProjectId === project._id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                          placeholder="Enter new title"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleUpdateProject(project._id)}
                            className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditProjectId(null)}
                            className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/projects/${project._id}/tasks`}
                            className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            {project.title}
                          </Link>
                          {/* Mobile "!" Button */}
                          <button
                            onClick={() => toggleInfo(project._id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                toggleInfo(project._id);
                              }
                            }}
                            className="sm:hidden w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            aria-label="Show project navigation info"
                          >
                            !
                          </button>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEditProject(project._id)}
                            className="py-2 px-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="py-2 px-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Desktop Hover Text */}
                    <div
                      className="hidden sm:group-hover:block absolute top-0 left-1/2 transform -translate-x-1/2  px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      aria-hidden="true"
                    >
                      Click the project name to continue
                    </div>
                    {/* Mobile Info Text */}
                    {infoVisible[project._id] && (
                      <div className="sm:hidden mt-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
                        Click the project name to continue
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

export default ProjectList;
