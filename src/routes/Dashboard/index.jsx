import React, { useState } from 'react';
import {
  ShoppingCart,
  Users,
  CreditCard,
  ArrowDownToLine,
  Coins,
  Activity,
  Gift,
  TrendingUp,
  ChevronDown,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Last 3 Days');

  // Stats data
  const stats = [
    {
      label: 'Sales Managers',
      value: 3,
      icon: ShoppingCart,
      color: 'rgb(255, 99, 132)',
      bgColor: 'rgba(255, 99, 132, 0.125)',
    },
    {
      label: 'Agents',
      value: 4,
      icon: Users,
      color: 'rgb(54, 162, 235)',
      bgColor: 'rgba(54, 162, 235, 0.125)',
    },
    {
      label: 'Moved to App',
      value: 72,
      icon: TrendingUp,
      color: 'rgb(255, 187, 40)',
      bgColor: 'rgba(255, 187, 40, 0.125)',
    },
    // {
    //   label: 'Customers',
    //   value: 0,
    //   icon: CreditCard,
    //   color: 'rgb(255, 206, 86)',
    //   bgColor: 'rgba(255, 206, 86, 0.125)',
    // },
    // {
    //   label: 'Withdrawal Requests',
    //   value: 1,
    //   icon: ArrowDownToLine,
    //   color: 'rgb(75, 192, 192)',
    //   bgColor: 'rgba(75, 192, 192, 0.125)',
    // },
    {
      label: 'Total Leads',
      value: 4,
      icon: Coins,
      color: 'rgb(156, 163, 175)',
      bgColor: 'rgba(156, 163, 175, 0.125)',
    },
    {
      label: 'Hot Leads',
      value: 13,
      icon: Activity,
      color: 'rgb(255, 128, 66)',
      bgColor: 'rgba(255, 128, 66, 0.125)',
    },
    {
      label: 'Cold Leads',
      value: 1,
      icon: Gift,
      color: 'rgb(136, 132, 216)',
      bgColor: 'rgba(136, 132, 216, 0.125)',
    },
  ];

  // Pie chart data
  const pieData = [
    { name: 'Total Orders', value: 3, color: '#FF6384' },
    { name: 'Total Users', value: 4, color: '#36A2EB' },
    { name: 'Loan Requests', value: 0, color: '#FFCE56' },
    { name: 'Withdrawal Requests', value: 1, color: '#4BC0C0' },
    { name: 'Total Deposits', value: 4, color: '#9CA3AF' },
    { name: 'Total Money Transactions', value: 13, color: '#FF8042' },
    { name: 'Total Gifts', value: 1, color: '#8884D8' },
    { name: 'Total Trades', value: 72, color: '#FFBB28' },
  ];

  // Bar chart data
  const barData = [
    { name: 'Orders', value: 3, color: '#FF6384' },
    { name: 'Users', value: 4, color: '#36A2EB' },
    { name: 'Loan Req.', value: 0, color: '#FFCE56' },
    { name: 'Withdrawal Req.', value: 1, color: '#4BC0C0' },
    { name: 'Deposits', value: 4, color: '#9CA3AF' },
    { name: 'Money Transactions', value: 13, color: '#FF8042' },
    { name: 'Gifts', value: 1, color: '#8884D8' },
    { name: 'Trades', value: 72, color: '#FFBB28' },
  ];

  // Custom label for pie chart
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={pieData.find((item) => item.name === name)?.color}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs"
      >
        {`${name.split(' ')[1] || name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <main>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to the Save In Gold Sales CRM
            </h2>
            <p className="text-gray-400">
              Easily track leads, agents, sales managers, and more — all in one place.
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="mt-4 md:mt-0 flex items-center flex-wrap">
            <span className="mr-4 text-gray-300">Filter by:</span>
            <div className="relative inline-block w-45">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="cursor-pointer w-full flex items-center justify-between h-10 px-3 bg-[#1A1A1A] border border-[#BBA473] focus:outline-none transition-colors duration-200 rounded"
              >
                <span className="text-sm">{selectedFilter}</span>
                <ChevronDown
                  className={`w-4 h-4 ml-2 text-white transition-transform duration-200 ${
                    filterOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {filterOpen && (
                <div className="absolute z-10 w-full mt-1 bg-[#1A1A1A] border border-[#BBA473] rounded shadow-lg">
                  {['Last 3 Days', 'Last Week', 'Last Month', 'Last Year'].map(
                    (option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setSelectedFilter(option);
                          setFilterOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-[#2A2A2A] cursor-pointer text-sm"
                      >
                        {option}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="border border-[#BBA473] rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-yellow-400"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <Icon style={{ color: stat.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Pie Chart */}
          <div className="border border-[#BBA473] rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-center text-white">
              Overview
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #BBA473',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="border border-[#BBA473] rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-center text-white">
              Summary
            </h3>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #BBA473',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;