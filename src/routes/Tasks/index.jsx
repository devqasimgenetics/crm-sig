import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Edit, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Mock data for tasks - will be replaced with API data later
const mockTasks = [
  {
    id: '1',
    title: 'Follow up with John Doe',
    description: 'Call to discuss gold investment options',
    status: 'Pending',
    priority: 'High',
    assignedTo: 'Ahmed Ali',
    dueDate: '2024-11-15',
    createdAt: '2024-11-08',
  },
  {
    id: '2',
    title: 'Prepare Q4 sales report',
    description: 'Compile and analyze Q4 sales data for presentation',
    status: 'In Progress',
    priority: 'Medium',
    assignedTo: 'Sarah Khan',
    dueDate: '2024-11-20',
    createdAt: '2024-11-07',
  },
  {
    id: '3',
    title: 'Client meeting preparation',
    description: 'Prepare documents and presentation for VIP client meeting',
    status: 'Completed',
    priority: 'High',
    assignedTo: 'Mohammed Hassan',
    dueDate: '2024-11-10',
    createdAt: '2024-11-05',
  },
  {
    id: '4',
    title: 'Update CRM database',
    description: 'Update client contact information in CRM system',
    status: 'Pending',
    priority: 'Low',
    assignedTo: 'Fatima Ahmed',
    dueDate: '2024-11-25',
    createdAt: '2024-11-08',
  },
  {
    id: '5',
    title: 'Team training session',
    description: 'Conduct training on new gold investment products',
    status: 'In Progress',
    priority: 'Medium',
    assignedTo: 'Ali Raza',
    dueDate: '2024-11-18',
    createdAt: '2024-11-06',
  },
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);

  const tabs = ['All', 'Pending', 'In Progress', 'Completed'];

  useEffect(() => {
    setIsLoaded(true);
    // Load mock data
    setTasks(mockTasks);
  }, []);

  // Filter tasks based on search and active tab
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'All' || task.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Completed': 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return styles[status] || styles.Pending;
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    const styles = {
      'High': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Medium': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Low': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return styles[priority] || styles.Medium;
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
          </div>
        </div>

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
              placeholder="Search by title, description, or assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-[#BBA473]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBA473]/50 focus:border-[#BBA473] bg-[#1A1A1A] text-white transition-all duration-300 hover:border-[#BBA473]"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden border border-[#BBA473]/20 animate-fadeIn">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1A1A1A] border-b border-[#BBA473]/30">
                <tr>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Task Title</th>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Description</th>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Priority</th>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Assigned To</th>
                  <th className="text-left px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Due Date</th>
                  <th className="text-center px-6 py-4 text-[#E8D5A3] font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BBA473]/10">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-[#3A3A3A] transition-all duration-300 group"
                    >
                      <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                        #{task.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white group-hover:text-[#BBA473] transition-colors duration-300">
                          {task.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm max-w-xs truncate">
                        {task.description}
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
                      <td className="px-6 py-4 text-gray-300">{task.assignedTo}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
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
              <span className="text-white font-semibold">{tasks.length}</span> tasks
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;