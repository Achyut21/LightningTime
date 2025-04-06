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
    <div className="card bg-gradient-to-br from-dark-card to-dark-card/80 backdrop-blur-lg border border-dark-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-light">Payment History</span>
        </h2>
        <div className="flex items-center">
          <span className="text-xs text-gray-400 mr-2">Total Payments:</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary-light border border-primary/20 shadow-sm">
            {paymentHistory.length}
          </span>
        </div>
      </div>
      
      {paymentHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-dark-lighter/40 rounded-lg border border-dark-border/50">
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
          <div className="overflow-x-auto -mx-6 relative">
            {/* Table glow effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -inset-1 w-full h-full bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-md blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            <div className="align-middle inline-block min-w-full px-6 group">
              <div className="overflow-hidden border border-dark-border rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-dark-border">
                  <thead className="bg-gradient-to-r from-dark-lighter to-dark-lighter/80">
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
                      <tr key={index} className="hover:bg-dark-lighter/50 transition-colors group/row">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 group-hover/row:text-gray-300">
                          {formatTimestamp(payment.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-lightning mr-1.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="currentColor" fillOpacity="0.2"/>
                              <path d="M17.2 10.4C17.612 8.94 16.5 8.4 14.912 8.036L15.364 6.4H14.104L13.664 7.988C13.336 7.904 13 7.828 12.668 7.752L13.112 6.152H11.852L11.4 7.784C11.132 7.72 10.872 7.656 10.624 7.588L10.628 7.576L8.864 7.244L8.572 8.604C8.572 8.604 9.488 8.812 9.46 8.828C10.004 8.956 10.108 9.328 10.088 9.628L9.572 11.524C9.612 11.536 9.668 11.552 9.728 11.576L9.568 11.536L8.844 14.212C8.776 14.388 8.608 14.648 8.232 14.56C8.248 14.584 7.336 14.336 7.336 14.336L6.8 15.8L8.472 16.112C8.768 16.184 9.056 16.26 9.34 16.332L8.88 17.996H10.14L10.592 16.352C10.932 16.444 11.26 16.528 11.576 16.604L11.128 18.236H12.388L12.848 16.576C14.948 16.928 16.52 16.82 17.14 14.924C17.644 13.4 17.04 12.5 15.92 11.916C16.736 11.744 17.348 11.252 17.2 10.4ZM14.38 14.024C14.032 15.548 11.78 14.84 10.908 14.636L11.52 12.404C12.392 12.608 14.744 12.436 14.38 14.024ZM14.728 10.376C14.416 11.752 12.548 11.156 11.824 10.988L12.38 8.968C13.104 9.136 15.052 8.944 14.728 10.376Z"/>
                            </svg>
                            <span className="text-sm font-medium text-transparent bg-clip-text bg-pink-400 group-hover/row:from-pink-400 group-hover/row:to-primary-light transition-all">
                              {payment.amount}
                            </span>
                            <span className="text-xs text-gray-500 ml-1 group-hover/row:text-gray-400 transition-colors">sats</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-900/30 text-green-400 border border-green-900/30 group-hover/row:bg-green-900/50 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            Confirmed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 group-hover/row:text-gray-400 transition-colors">
                          <div className="flex items-center">
                            <span className="font-mono text-xs truncate w-20">
                              {payment.paymentHash ? payment.paymentHash.substring(0, 8) + '...' : 'N/A'}
                            </span>
                            <button className="ml-2 text-primary hover:text-primary-light transition-colors tooltip" data-tip="Copy Hash">
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