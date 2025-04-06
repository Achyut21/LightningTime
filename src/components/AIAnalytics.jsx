import React, { useState } from 'react';
import { useWork } from '../contexts/WorkContext';

const AIAnalytics = () => {
  const { paymentHistory, stats } = useWork();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate insights
  const calculateInsights = () => {
    if (!paymentHistory || paymentHistory.length === 0) {
      return {
        workPattern: "Not enough data to analyze work patterns.",
        earnings: "Start tracking work time to see earnings predictions.",
        suggestions: ["Start by checking in to track your first work session."]
      };
    }
    
    // Work pattern analysis
    const timestamps = paymentHistory.map(payment => new Date(payment.timestamp));
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    
    timestamps.forEach(date => {
      dayOfWeekCounts[date.getDay()]++;
    });
    
    const mostActiveDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      [dayOfWeekCounts.indexOf(Math.max(...dayOfWeekCounts))];
    
    // Time of day analysis
    const hourCounts = Array(24).fill(0);
    
    timestamps.forEach(date => {
      hourCounts[date.getHours()]++;
    });
    
    const mostActiveHourIndex = hourCounts.indexOf(Math.max(...hourCounts));
    const mostActiveHour = 
      mostActiveHourIndex === 0 ? "12 AM" : 
      mostActiveHourIndex < 12 ? `${mostActiveHourIndex} AM` : 
      mostActiveHourIndex === 12 ? "12 PM" : 
      `${mostActiveHourIndex - 12} PM`;
    
    // Recent behavior
    const lastSevenDays = timestamps.filter(date => 
      new Date().getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000
    ).length;
    
    const recentActivity = lastSevenDays > 3 
      ? "High activity" 
      : lastSevenDays > 0 
        ? "Moderate activity" 
        : "Low activity";
    
    // Earnings projection based on current rate and history
    const weeklyProjection = stats.hourlyRate * 40; // Assuming 40 hours/week
    const monthlyProjection = weeklyProjection * 4;
    
    // Generate suggestions
    const suggestions = [];
    
    if (lastSevenDays < 3) {
      suggestions.push("Consider increasing your working frequency for more consistent earnings.");
    }
    
    // Calculate consistency
    const lastThreeWeeks = [0, 0, 0]; // Hours in the last 3 weeks
    
    timestamps.forEach(date => {
      const daysAgo = Math.floor((new Date().getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
      if (daysAgo < 7) lastThreeWeeks[0]++;
      else if (daysAgo < 14) lastThreeWeeks[1]++;
      else if (daysAgo < 21) lastThreeWeeks[2]++;
    });
    
    const consistency = Math.min(...lastThreeWeeks) > 0 
      ? "Your work pattern is consistent over the past few weeks."
      : "Your work pattern shows some inconsistency over time.";
    
    if (Math.min(...lastThreeWeeks) === 0) {
      suggestions.push("Try to maintain a more consistent work schedule across weeks.");
    }
    
    // Add at least one positive reinforcement
    suggestions.push(`Your most productive day is ${mostActiveDay}. Consider scheduling important tasks for this day.`);
    
    return {
      workPattern: `You're most active on ${mostActiveDay}s around ${mostActiveHour}. ${consistency}`,
      earnings: `Based on your current rate of ${stats.hourlyRate} sats/hour, you're projected to earn ${weeklyProjection} sats weekly and ${monthlyProjection} sats monthly.`,
      recentActivity,
      suggestions
    };
  };
  
  const insights = calculateInsights();

  return (
    <div className="card bg-dark-card border border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <svg 
            className="w-5 h-5 mr-2 text-primary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          AI Insights
        </h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg 
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-4 overflow-hidden transition-all duration-300" style={{ maxHeight: isExpanded ? '1000px' : '300px' }}>
        {/* Work Pattern Insight */}
        <div className="p-3 bg-dark-lighter rounded-lg">
          <div className="flex items-start">
            <div className="p-2 rounded-md bg-primary/10 mr-3">
              <svg 
                className="w-5 h-5 text-primary" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Work Pattern</h3>
              <p className="text-xs text-gray-400 mt-1">{insights.workPattern}</p>
            </div>
          </div>
        </div>
        
        {/* Earnings Insight */}
        <div className="p-3 bg-dark-lighter rounded-lg">
          <div className="flex items-start">
            <div className="p-2 rounded-md bg-primary/10 mr-3">
              <svg 
                className="w-5 h-5 text-primary" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Earnings Projection</h3>
              <p className="text-xs text-gray-400 mt-1">{insights.earnings}</p>
            </div>
          </div>
        </div>
        
        {/* Suggestions */}
        <div className="p-3 bg-dark-lighter rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2 flex items-center">
            <svg 
              className="w-5 h-5 mr-2 text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            AI Recommendations
          </h3>
          <ul className="space-y-2">
            {insights.suggestions.map((suggestion, index) => (
              <li key={index} className="text-xs text-gray-400 flex items-start">
                <svg 
                  className="w-3 h-3 text-primary flex-shrink-0 mr-2 mt-0.5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Activity Status */}
        {insights.recentActivity && (
          <div className="p-3 bg-dark-lighter rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg 
                  className="w-5 h-5 mr-2 text-primary" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="text-sm font-medium text-white">Recent Activity</span>
              </div>
              <span 
                className={`px-2 py-1 rounded-full text-xs
                  ${insights.recentActivity === 'High activity' 
                    ? 'bg-green-900/30 text-green-400 border border-green-900/30' 
                    : insights.recentActivity === 'Moderate activity'
                      ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/30' 
                      : 'bg-red-900/30 text-red-400 border border-red-900/30'
                  }
                `}
              >
                {insights.recentActivity}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Button to show more/less */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-4 py-2 text-sm text-primary bg-dark-lighter hover:bg-dark-border rounded-md transition-colors flex items-center justify-center"
      >
        {isExpanded ? (
          <>
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Show Less
          </>
        ) : (
          <>
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Show More Insights
          </>
        )}
      </button>

      <div className="mt-4 p-2 bg-primary/5 rounded-lg border border-primary/10 text-xs text-gray-400">
        <div className="flex">
          <svg 
            className="w-4 h-4 text-primary flex-shrink-0 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            AI insights are generated based on your work patterns and payment history.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;