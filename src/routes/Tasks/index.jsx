import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Edit, Trash2, Filter } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getAllTasks } from '../../services/taskService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isLoaded, setIsLoaded] = useState(false);

  const [loading, setLoading] = useState(false);
  const [totalTasks, setTotalTasks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  
  // Filter states - filters open by default
  const [showFilters, setShowFilters] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [assignedToFilter, setAssignedToFilter] = useState('All');

  const tabs = ['All', 'Open', 'In Progress', 'Completed'];
  const priorities = ['All', 'High', 'Normal', 'Low'];

  // Fetch tasks from API
  const fetchTasks = async (page = 1, limit = 30) => {
    setLoading(true);
    try {
      console.log('🔵 Fetching tasks from component...');
      const result = await getAllTasks(page, limit, '', '');
      
      console.log('📦 Result from API:', result);
      
      if (result.success && result.data) {
        console.log('✅ Success! Data:', result.data);
        
        // Transform API data to match component structure
        const transformedTasks = result.data.map((task) => {
          console.log('🔄 Transforming task:', task);
          
          return {
            id: task._id,
            taskId: task.taskId,
            title: task.taskTitle || 'Untitled Task',
            description: task.taskDescription || 'No description provided',
            status: task.taskStatus || 'Open',
            priority: task.taskPriority || 'Normal',
            assignedTo: task.agentId?.length > 0 
              ? `${task.agentId[0].firstName} ${task.agentId[0].lastName}` 
              : 'Unassigned',
            assignedToUsername: task.agentId?.length > 0 ? task.agentId[0].username : '',
            salesManager: task.salesManagerId?.length > 0
              ? `${task.salesManagerId[0].firstName} ${task.salesManagerId[0].lastName}`
              : '',
            leadName: task.leadId?.length > 0 ? task.leadId[0].leadName : 'No Lead',
            leadId: task.leadId?.length > 0 ? task.leadId[0].leadId : '',
            leadPhone: task.leadId?.length > 0 ? task.leadId[0].leadPhoneNumber : '',
            dueDate: task.taskDueDate || new Date().toISOString(),
            createdAt: task.createdAt || new Date().toISOString(),
            isDeleted: task.isDeleted,
          };
        });
        
        console.log('✅ Transformed tasks:', transformedTasks);
        setTasks(transformedTasks);
        setTotalTasks(result.metadata?.total || transformedTasks.length);
        toast.success(`Loaded ${transformedTasks.length} tasks successfully!`);
      } else {
        console.error('❌ Failed to fetch tasks:', result.message);
        toast.error(result.message || 'Failed to fetch tasks');
        setTasks([]);
      }
    } catch (error) {
      console.error('❌ Error fetching tasks:', error);
      toast.error('Failed to fetch tasks. Please try again.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on component mount and when pagination changes
  useEffect(() => {
    setIsLoaded(true);
    fetchTasks(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Get unique assignees for filter dropdown
  const uniqueAssignees = ['All', ...new Set(tasks.map(task => task.assignedTo).filter(Boolean))];

  // Filter tasks based on search, active tab, and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'All' || task.status === activeTab;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    const matchesAssignee = assignedToFilter === 'All' || task.assignedTo === assignedToFilter;
    
    return matchesSearch && matchesTab && matchesPriority && matchesAssignee;
  });

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'Open': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Completed': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Pending': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return styles[status] || styles.Open;
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    const styles = {
      'High': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Normal': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Medium': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Low': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return styles[priority] || styles.Normal;
  };

  const handleEdit = (task) => {
    toast.success('Edit functionality coming soon!');
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully!');
    }
  };

  const clearFilters = () => {
    setPriorityFilter('All');
    setAssignedToFilter('All');
    setSearchQuery('');
    setActiveTab('All');
    toast.success('Filters cleared');
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#2A2A2A',
            color: '#fff',
            border: '1px solid #BBA473',
          },
          success: {
            iconTheme: {
              primary: '#BBA473',
              secondary: '#1A1A1A',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1A1A1A',
            },
          },
        }}
      />

      <div className={`min-h-screen bg-[#1A1A1A] text-white p-6 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#BBA473] to-[#8E7D5A] bg-clip-text text-transparent">
                Tasks Management
              </h1>
              <p className="text-gray-400 mt-2">View and manage your team's tasks</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-[#BBA473]/20 text-[#BBA473] rounded-lg hover:bg-[#BBA473]/30 transition-all duration-300 border border-[#BBA473]/30"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-6 bg-[#2A2A2A] rounded-xl p-6 border border-[#BBA473]/20 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#BBA473]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBA473]/50 focus:border-[#BBA473] bg-[#1A1A1A] text-white transition-all duration-300 hover:border-[#BBA473] appearance-none cursor-pointer"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Assigned To Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Assigned To</label>
                <div className="relative">
                  <select
                    value={assignedToFilter}
                    onChange={(e) => setAssignedToFilter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#BBA473]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBA473]/50 focus:border-[#BBA473] bg-[#1A1A1A] text-white transition-all duration-300 hover:border-[#BBA473] appearance-none cursor-pointer"
                  >
                    {uniqueAssignees.map((assignee) => (
                      <option key={assignee} value={assignee}>
                        {assignee}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 border border-red-500/30 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto animate-fadeIn">
          <div className="flex gap-2 border-b border-[#BBA473]/30 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-[#BBA473] text-[#BBA473] bg-[#BBA473]/10'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 animate-fadeIn">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, description, assignee, lead, or task ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-[#BBA473]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBA473]/50 focus:border-[#BBA473] bg-[#1A1A1A] text-white transition-all duration-300 hover:border-[#BBA473]"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#BBA473]"></div>
            <p className="text-gray-400 mt-2">Loading tasks...</p>
          </div>
        )}

        {/* Table Container */}
        {!loading && (
          <div className="bg-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden border border-[#BBA473]/20 animate-fadeIn">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1A1A1A] border-b border-[#BBA473]/30">
                  <tr>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Task ID</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Task Title</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Lead Info</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Priority</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Assigned To</th>
                    <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Created At</th>
                    <th className="text-center px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BBA473]/10">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                        {tasks.length === 0 ? 'No tasks available' : 'No tasks found matching your filters'}
                      </td>
                    </tr>
                  ) : (
                    filteredTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="hover:bg-[#3A3A3A] transition-all duration-300 group"
                      >
                        <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                          {task.taskId}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white group-hover:text-[#BBA473] transition-colors duration-300">
                            {task.title}
                          </div>
                          <div className="text-gray-400 text-xs mt-1 truncate max-w-xs">
                            {task.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white text-sm">{task.leadName}</div>
                          <div className="text-gray-400 text-xs">{task.leadId}</div>
                          {task.leadPhone && (
                            <div className="text-gray-400 text-xs">{task.leadPhone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-300">{task.assignedTo}</div>
                          {task.assignedToUsername && (
                            <div className="text-gray-400 text-xs">@{task.assignedToUsername}</div>
                          )}
                          {task.salesManager && (
                            <div className="text-gray-400 text-xs">SM: {task.salesManager}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex opacity-50 pointer-events-none justify-center gap-2">
                            <button
                              onClick={() => handleEdit(task)}
                              className="p-2 rounded-lg bg-[#BBA473]/20 text-[#BBA473] hover:bg-[#BBA473] hover:text-black transition-all duration-300 hover:scale-110"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination/Summary Bar */}
            <div className="px-6 py-4 bg-[#1A1A1A] border-t border-[#BBA473]/30 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-sm">
                Showing <span className="text-white font-semibold">{filteredTasks.length}</span> of{' '}
                <span className="text-white font-semibold">{totalTasks}</span> tasks
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-[#BBA473]/20 text-[#BBA473] rounded-lg hover:bg-[#BBA473]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-400 px-4">Page {currentPage}</span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={filteredTasks.length < itemsPerPage}
                  className="px-4 py-2 bg-[#BBA473]/20 text-[#BBA473] rounded-lg hover:bg-[#BBA473]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks;