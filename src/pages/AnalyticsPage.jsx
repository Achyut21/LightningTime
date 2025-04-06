import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWork } from '../contexts/WorkContext';
import Header from '../components/Header';

const AnalyticsPage = () => {
  const { user, isAdmin } = useAuth();
  const { fetchStats, stats, paymentHistory } = useWork();
  const [activeTab, setActiveTab] = useState('earnings');
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  // Calculate weekly and monthly data
  const getWeeklyData = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return paymentHistory.filter(payment => 
      new Date(payment.timestamp) > oneWeekAgo
    );
  };
  
  const getMonthlyData = () => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    return paymentHistory.filter(payment => 
      new Date(payment.timestamp) > oneMonthAgo
    );
  };
  
  // Calculate total earnings/hours by day
  const getDailyStats = () => {
    const dailyStats = {};
    
    paymentHistory.forEach(payment => {
      const date = new Date(payment.timestamp).toISOString().split('T')[0];
      
      if (!dailyStats[date]) {
        dailyStats[date] = { 
          earnings: 0, 
          hours: 0
        };
      }
      
      dailyStats[date].earnings += payment.amount;
      dailyStats[date].hours += 1; // Each payment represents 1 hour in our app
    });
    
    // Convert to array sorted by date
    return Object.entries(dailyStats)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  // Calculate weekly totals
  const weeklyPayments = getWeeklyData();
  const weeklyEarnings = weeklyPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const weeklyHours = weeklyPayments.length;
  
  // Calculate monthly totals
  const monthlyPayments = getMonthlyData();
  const monthlyEarnings = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const monthlyHours = monthlyPayments.length;
  
  // Calculate all time averages
  const avgEarningsPerHour = stats.totalHoursPaid > 0 ? 
    (stats.totalSatsPaid / stats.totalHoursPaid).toFixed(2) : 0;
  
  // Daily earnings data for charts
  const dailyStats = getDailyStats();
  
  return (
    <div className="min-h-screen bg-dark relative">
      {/* Glow effect background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full filter blur-[100px] -z-10"></div>
      
      <Header />
      
      <div className="pt-24 pb-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                <span className="text-transparent bg-clip-text bg-pink-500">Advanced Analytics</span>
              </h1>
              <p className="text-gray-400">
                Detailed insights on your earnings and work hours
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <select className="bg-dark-lighter text-white border border-dark-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="all">All Time</option>
                <option value="year">This Year</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
              </select>
              
              <button className="btn btn-primary flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Export
              </button>
            </div>
          </div>
          
          {/* Analytics Tabs */}
          <div className="flex mb-6 bg-dark-lighter rounded-lg p-1 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('earnings')}
              className={`flex-1 py-2 px-3 rounded-md transition-colors duration-200 text-sm font-medium ${
                activeTab === 'earnings' ? 'bg-primary text-white shadow-md' : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`flex-1 py-2 px-3 rounded-md transition-colors duration-200 text-sm font-medium ${
                activeTab === 'hours' ? 'bg-primary text-white shadow-md' : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Work Hours
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex-1 py-2 px-3 rounded-md transition-colors duration-200 text-sm font-medium ${
                activeTab === 'payments' ? 'bg-primary text-white shadow-md' : 'bg-transparent text-gray-400 hover:text-white'
              }`}
            >
              Payments
            </button>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1 - Total Earnings */}
            <div className="card bg-gradient-to-br from-dark-card via-dark-card to-primary/5 backdrop-blur-lg border border-dark-border/50 shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-primary/20 rounded-full blur-lg"></div>
                
                <div className="relative">
                  <h3 className="text-gray-400 text-sm mb-1">Total Earnings</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{stats.totalSatsPaid}</span>
                    <span className="ml-1 text-primary-light">sats</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-xs">
                    <div className="flex items-center">
                      <span className="text-white font-medium mr-1">Weekly:</span>
                      <span className="text-primary-light">{weeklyEarnings} sats</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white font-medium mr-1">Monthly:</span>
                      <span className="text-primary-light">{monthlyEarnings} sats</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card 2 - Work Hours */}
            <div className="card bg-gradient-to-br from-dark-card via-dark-card to-blue-500/5 backdrop-blur-lg border border-dark-border/50 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-500/20 rounded-full blur-lg"></div>
                
                <div className="relative">
                  <h3 className="text-gray-400 text-sm mb-1">Total Hours</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{stats.totalHoursPaid}</span>
                    <span className="ml-1 text-blue-400">hrs</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-xs">
                    <div className="flex items-center">
                      <span className="text-white font-medium mr-1">Weekly:</span>
                      <span className="text-blue-400">{weeklyHours} hrs</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white font-medium mr-1">Monthly:</span>
                      <span className="text-blue-400">{monthlyHours} hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card 3 - Average Rate */}
            <div className="card bg-gradient-to-br from-dark-card via-dark-card to-pink-500/5 backdrop-blur-lg border border-dark-border/50 shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-pink-500/20 rounded-full blur-lg"></div>
                
                <div className="relative">
                  <h3 className="text-gray-400 text-sm mb-1">Average Rate</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{avgEarningsPerHour}</span>
                    <span className="ml-1 text-pink-400">sats/hr</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-xs">
                    <div className="flex items-center">
                      <span className="text-white font-medium mr-1">Current:</span>
                      <span className="text-pink-400">{stats.hourlyRate} sats/hr</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white font-medium mr-1">Lifetime:</span>
                      <span className="text-pink-400">{avgEarningsPerHour} sats/hr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Based on Active Tab */}
          <div className="space-y-6">
            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <>
                <div className="card bg-gradient-to-br from-dark-card to-dark-lighter border border-dark-border/50">
                  <h3 className="text-xl font-semibold text-white mb-6">Earnings Over Time</h3>
                  
                  {/* Earnings Chart - Placeholder */}
                  <div className="bg-dark-lighter h-64 rounded-lg border border-dark-border flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      <p className="text-gray-400">Earnings chart visualization</p>
                      <p className="text-xs text-gray-500 mt-1">Showing total earnings over time</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card bg-gradient-to-br from-dark-card to-dark-lighter border border-dark-border/50">
                    <h3 className="text-xl font-semibold text-white mb-4">Earnings Breakdown</h3>
                    
                    <div className="space-y-4">
                      {/* Today */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Today</span>
                          <span className="text-primary-light font-medium">{weeklyPayments.filter(p => 
                            new Date(p.timestamp).toDateString() === new Date().toDateString()
                          ).reduce((sum, p) => sum + p.amount, 0)} sats</span>
                        </div>
                        <div className="mt-2 h-2 bg-dark rounded overflow-hidden">
                          <div className="bg-gradient-to-r from-primary to-pink-500 h-full" style={{width: '75%'}}></div>
                        </div>
                      </div>
                      
                      {/* This Week */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">This Week</span>
                          <span className="text-primary-light font-medium">{weeklyEarnings} sats</span>
                        </div>
                        <div className="mt-2 h-2 bg-dark rounded overflow-hidden">
                          <div className="bg-gradient-to-r from-primary to-pink-500 h-full" style={{width: '60%'}}></div>
                        </div>
                      </div>
                      
                      {/* This Month */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">This Month</span>
                          <span className="text-primary-light font-medium">{monthlyEarnings} sats</span>
                        </div>
                        <div className="mt-2 h-2 bg-dark rounded overflow-hidden">
                          <div className="bg-gradient-to-r from-primary to-pink-500 h-full" style={{width: '45%'}}></div>
                        </div>
                      </div>
                      
                      {/* All Time */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">All Time</span>
                          <span className="text-primary-light font-medium">{stats.totalSatsPaid} sats</span>
                        </div>
                        <div className="mt-2 h-2 bg-dark rounded overflow-hidden">
                          <div className="bg-gradient-to-r from-primary to-pink-500 h-full" style={{width: '100%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-br from-dark-card to-dark-lighter border border-dark-border/50">
                    <h3 className="text-xl font-semibold text-white mb-4">Earnings Projections</h3>
                    
                    <div className="space-y-4">
                      {/* Daily Projections */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Daily (8 hours)</span>
                          <span className="text-green-400 font-medium">{stats.hourlyRate * 8} sats</span>
                        </div>
                        <div className="text-xs text-gray-500">Based on your current hourly rate</div>
                      </div>
                      
                      {/* Weekly Projections */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Weekly (40 hours)</span>
                          <span className="text-green-400 font-medium">{stats.hourlyRate * 40} sats</span>
                        </div>
                        <div className="text-xs text-gray-500">Based on your current hourly rate</div>
                      </div>
                      
                      {/* Monthly Projections */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Monthly (160 hours)</span>
                          <span className="text-green-400 font-medium">{stats.hourlyRate * 160} sats</span>
                        </div>
                        <div className="text-xs text-gray-500">Based on your current hourly rate</div>
                      </div>
                      
                      {/* Yearly Projections */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Yearly (2000 hours)</span>
                          <span className="text-green-400 font-medium">{stats.hourlyRate * 2000} sats</span>
                        </div>
                        <div className="text-xs text-gray-500">Based on your current hourly rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Hours Tab */}
            {activeTab === 'hours' && (
              <>
                <div className="card bg-gradient-to-br from-dark-card to-dark-lighter border border-dark-border/50">
                  <h3 className="text-xl font-semibold text-white mb-6">Working Hours Over Time</h3>
                  
                  {/* Hours Chart - Placeholder */}
                  <div className="bg-dark-lighter h-64 rounded-lg border border-dark-border flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400">Hours worked visualization</p>
                      <p className="text-xs text-gray-500 mt-1">Showing total hours worked over time</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card bg-gradient-to-br from-dark-card to-dark-lighter border border-dark-border/50">
                    <h3 className="text-xl font-semibold text-white mb-4">Working Pattern</h3>
                    
                    {/* Heat Calendar - Placeholder */}
                    <div className="bg-dark-lighter rounded-lg p-4 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-gray-400">Hour distribution heatmap</p>
                        <p className="text-xs text-gray-500 mt-1">Showing when you tend to work most</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-br from-dark-card to-dark-lighter border border-dark-border/50">
                    <h3 className="text-xl font-semibold text-white mb-4">Productivity Metrics</h3>
                    
                    <div className="space-y-4">
                      {/* Consistency Score */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Consistency Score</span>
                          <span className="text-blue-400 font-medium">85%</span>
                        </div>
                        <div className="mt-2 h-2 bg-dark rounded overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-500 to-primary h-full" style={{width: '85%'}}></div>
                        </div>
                      </div>
                      
                      {/* Longest Streak */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Longest Streak</span>
                          <span className="text-blue-400 font-medium">5 days</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">Your longest consecutive working days</div>
                      </div>
                      
                      {/* Most Productive Day */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Most Productive Day</span>
                          <span className="text-blue-400 font-medium">Tuesday</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">Average of 6.2 hours per Tuesday</div>
                      </div>
                      
                      {/* Peak Hours */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Peak Hours</span>
                          <span className="text-blue-400 font-medium">10 AM - 2 PM</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">Your most active working time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <>
                <div className="card bg-gradient-to-br from-dark-card to-dark-lighter border border-dark-border/50">
                  <h3 className="text-xl font-semibold text-white mb-6">Lightning Network Transactions</h3>
                  
                  {/* Transaction Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark-border">
                      <thead>
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment Hash</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border">
                        {paymentHistory.length > 0 ? (
                          paymentHistory.map((payment, index) => (
                            <tr key={index} className="hover:bg-dark-lighter">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                {new Date(payment.timestamp).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="text-primary-light font-medium">{payment.amount} sats</span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                                  Confirmed
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-500 truncate">
                                {payment.paymentHash ? payment.paymentHash.substring(0, 8) + '...' : 'N/A'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                              No payment transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card bg-gradient-to-br from-dark-card to-dark-lighter border border-dark-border/50">
                    <h3 className="text-xl font-semibold text-white mb-4">Lightning Network Stats</h3>
                    
                    <div className="space-y-4">
                      {/* Transaction Success Rate */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Transaction Success Rate</span>
                          <span className="text-green-400 font-medium">100%</span>
                        </div>
                        <div className="mt-2 h-2 bg-dark rounded overflow-hidden">
                          <div className="bg-gradient-to-r from-green-500 to-green-400 h-full w-full"></div>
                        </div>
                      </div>
                      
                      {/* Average Confirmation Time */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Avg. Confirmation Time</span>
                          <span className="text-green-400 font-medium">1 sec</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">Lightning Network instant payments</div>
                      </div>
                      
                      {/* Total Network Fees */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Network Fees</span>
                          <span className="text-green-400 font-medium">0 sats</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">Internal node-to-node transactions have no fees</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card bg-gradient-to-br from-dark-card to-dark-lighter border border-dark-border/50">
                    <h3 className="text-xl font-semibold text-white mb-4">Wallet Summary</h3>
                    
                    {/* Wallet Info */}
                    <div className="bg-dark-lighter rounded-lg p-4 mb-4">
                      <div className="flex items-center mb-3">
                        <div className="p-2 rounded-md bg-primary/30 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Your Lightning Wallet</div>
                          <div className="text-white font-medium">LNbits</div>
                        </div>
                        <div className="ml-auto">
                          <div className="px-2 py-1 rounded-full bg-green-900/50 text-green-400 text-xs">
                            Active
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-dark-card rounded-lg p-3 mt-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-xs">Wallet ID:</span>
                          <span className="text-gray-300 text-xs font-mono truncate max-w-[200px]">12167a02f43642c9a53...</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-xs">Current Balance:</span>
                          <span className="text-primary-light text-xs font-medium">{stats.userWalletBalance || 0} sats</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Last Payment */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="text-gray-400 text-xs mb-1">Last Payment</div>
                        <div className="text-white font-medium">
                          {paymentHistory.length > 0 
                            ? `${paymentHistory[0].amount} sats` 
                            : 'No payments yet'}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          {paymentHistory.length > 0 
                            ? new Date(paymentHistory[0].timestamp).toLocaleString() 
                            : ''}
                        </div>
                      </div>
                      
                      {/* Total Transactions */}
                      <div className="bg-dark-lighter rounded-lg p-4">
                        <div className="text-gray-400 text-xs mb-1">Total Transactions</div>
                        <div className="text-white font-medium">
                          {paymentHistory.length}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          Successful Lightning payments
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Bitcoin Price Reference */}
          <div className="mt-8 card bg-gradient-to-r from-dark-card to-dark-lighter border border-dark-border/50">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-10 w-10 mr-3 rounded-full bg-yellow-600/20 flex items-center justify-center">
                  <svg className="h-6 w-6 text-yellow-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="currentColor" fillOpacity="0.2"/>
                    <path d="M17.2 10.4C17.612 8.94 16.5 8.4 14.912 8.036L15.364 6.4H14.104L13.664 7.988C13.336 7.904 13 7.828 12.668 7.752L13.112 6.152H11.852L11.4 7.784C11.132 7.72 10.872 7.656 10.624 7.588L10.628 7.576L8.864 7.244L8.572 8.604C8.572 8.604 9.488 8.812 9.46 8.828C10.004 8.956 10.108 9.328 10.088 9.628L9.572 11.524C9.612 11.536 9.668 11.552 9.728 11.576L9.568 11.536L8.844 14.212C8.776 14.388 8.608 14.648 8.232 14.56C8.248 14.584 7.336 14.336 7.336 14.336L6.8 15.8L8.472 16.112C8.768 16.184 9.056 16.26 9.34 16.332L8.88 17.996H10.14L10.592 16.352C10.932 16.444 11.26 16.528 11.576 16.604L11.128 18.236H12.388L12.848 16.576C14.948 16.928 16.52 16.82 17.14 14.924C17.644 13.4 17.04 12.5 15.92 11.916C16.736 11.744 17.348 11.252 17.2 10.4ZM14.38 14.024C14.032 15.548 11.78 14.84 10.908 14.636L11.52 12.404C12.392 12.608 14.744 12.436 14.38 14.024ZM14.728 10.376C14.416 11.752 12.548 11.156 11.824 10.988L12.38 8.968C13.104 9.136 15.052 8.944 14.728 10.376Z"/>
                  </svg>
                </div>
                
                <div>
                  <div className="text-gray-400 text-xs">Current Bitcoin Price</div>
                  <div className="text-white font-medium flex items-center">
                    $82,974 <span className="text-green-400 text-xs ml-2">+1.2%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-gray-400 text-xs">Your Earnings</div>
                  <div className="text-white font-medium">${((stats.totalSatsPaid / 100000000) * 82974).toFixed(2)} USD</div>
                </div>
                
                <div className="text-center">
                  <div className="text-gray-400 text-xs">Exchange Rate</div>
                  <div className="text-white font-medium">1 sat = $0.00083 USD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;