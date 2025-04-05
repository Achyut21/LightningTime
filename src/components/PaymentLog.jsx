// src/components/PaymentLog.jsx
import React, { useState } from 'react';
import { useWork } from '../contexts/WorkContext';

const PaymentLog = () => {
  const { paymentHistory } = useWork();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Format timestamp to readable date time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = paymentHistory.slice(indexOfFirstItem, indexOfLastItem);
  
  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);
  
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Payment History</h2>
        <div className="flex items-center">
          <span className="text-xs text-gray-400 mr-2">Total Payments:</span>
          <span className="badge badge-info">{paymentHistory.length}</span>
        </div>
      </div>
      
      {paymentHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-center text-gray-500 font-medium">No payments recorded yet</p>
          <p className="text-center text-gray-500 text-sm mt-1">
            Check in to start working and earning satoshis
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-6">
            <div className="align-middle inline-block min-w-full px-6">
              <div className="overflow-hidden border border-dark-border rounded-lg">
                <table className="min-w-full divide-y divide-dark-border">
                  <thead className="bg-dark-lighter">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Transaction
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-dark-card divide-y divide-dark-border">
                    {currentItems.map((payment, index) => (
                      <tr key={index} className="hover:bg-dark-lighter transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatTimestamp(payment.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-primary-light mr-1">₿</span>
                            <span className="text-sm font-medium text-white">{payment.amount}</span>
                            <span className="text-xs text-gray-500 ml-1">sats</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="badge badge-success">
                            Successful
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          <div className="flex items-center">
                            <span className="font-mono text-xs truncate w-20">
                              {payment.paymentHash ? payment.paymentHash.substring(0, 10) + '...' : 'N/A'}
                            </span>
                            <button className="ml-2 text-primary hover:text-primary-light">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-300">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium text-gray-300">
                  {Math.min(indexOfLastItem, paymentHistory.length)}
                </span> of{' '}
                <span className="font-medium text-gray-300">{paymentHistory.length}</span> payments
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === 1
                      ? 'bg-dark-lighter text-gray-500 cursor-not-allowed'
                      : 'bg-dark-lighter text-gray-300 hover:bg-primary/20 hover:text-primary-light'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === totalPages
                      ? 'bg-dark-lighter text-gray-500 cursor-not-allowed'
                      : 'bg-dark-lighter text-gray-300 hover:bg-primary/20 hover:text-primary-light'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentLog;