import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Search, Calendar, ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'earning' | 'payment';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

export const WalletPage: React.FC = () => {
  const { user } = useAuthStore();
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Calculate service charge and net withdrawal amount
  const serviceCharge = parseFloat(withdrawAmount) * 0.1;
  const netWithdraw = parseFloat(withdrawAmount) - serviceCharge;

  useEffect(() => {
    fetchWalletData();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery]);

  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setWalletBalance(user?.role === 'business' ? 1250.75 : 89.50);
      setTransactions([
        {
          id: '1',
          type: 'deposit',
          amount: 500,
          description: 'Wallet funding',
          status: 'completed',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'earning',
          amount: 25,
          description: 'Review payment for Tech Product Campaign',
          status: 'completed',
          created_at: '2024-01-14T15:45:00Z'
        },
        {
          id: '3',
          type: 'withdrawal',
          amount: 45,
          description: 'Withdrawal to bank account',
          status: 'pending',
          created_at: '2024-01-13T09:20:00Z'
        }
      ]);
    } catch (err) {
      setError('Failed to load wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;
    
    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTransactions(filtered);
  };

  const handleWithdrawal = () => {
    if (parseFloat(withdrawAmount) >= 30 && parseFloat(withdrawAmount) <= walletBalance) {
      setShowWithdrawModal(true);
    }
  };

  const confirmWithdrawal = async () => {
    try {
      setProcessingWithdrawal(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update balance and add transaction
      setWalletBalance(prev => prev - parseFloat(withdrawAmount));
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: parseFloat(withdrawAmount),
        description: `Withdrawal to bank account`,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      setWithdrawAmount('');
      setShowWithdrawModal(false);
      alert('Withdrawal request submitted successfully!');
    } catch (err) {
      setError('Failed to process withdrawal');
    } finally {
      setProcessingWithdrawal(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5 text-green-400" />;
      case 'earning':
        return <DollarSign className="h-5 w-5 text-green-400" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-5 w-5 text-red-400" />;
      case 'payment':
        return <ArrowUpRight className="h-5 w-5 text-red-400" />;
      default:
        return <WalletIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'earning':
        return 'text-green-400';
      case 'withdrawal':
      case 'payment':
        return 'text-red-400';
      default:
        return 'text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500 bg-opacity-20 border-green-500 border-opacity-30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500 bg-opacity-20 border-yellow-500 border-opacity-30';
      case 'failed':
        return 'text-red-400 bg-red-500 bg-opacity-20 border-red-500 border-opacity-30';
      default:
        return 'text-gray-400 bg-gray-500 bg-opacity-20 border-gray-500 border-opacity-30';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="text-primary">Wallet</span> Management
              </h1>
              <p className="text-xl text-gray-300">
                {user?.role === 'business' 
                  ? 'Fund your account and manage campaign budgets' 
                  : 'Track your earnings and withdraw funds'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl p-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {/* Wallet Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Wallet Balance Card */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-2">Wallet Balance</h3>
              <p className="text-gray-400 text-sm mb-6">Your available funds for campaigns or withdrawals</p>
              <div className="flex items-center">
                <WalletIcon className="h-12 w-12 text-primary mr-4" />
                <div>
                  <span className="text-gray-400 text-sm">Available Balance</span>
                  <p className="text-4xl font-bold text-white">{formatCurrency(walletBalance)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions Card */}
          <div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-2">Fund Wallet</h3>
              <p className="text-gray-400 text-sm mb-4">Minimum amount: $20</p>
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                
                {user?.role === 'business' && (
                  <Button
                    className="bg-primary hover:bg-primary-600 text-black font-semibold py-3 rounded-xl w-full"
                    onClick={() => window.open('https://flutterwave.com/pay/lgcn81dgv4rc', '_blank')}
                    disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
                  >
                    Fund Wallet
                  </Button>
                )}

                {user?.role === 'reviewer' && (
                  <>
                    <input
                      type="number"
                      placeholder="Withdraw Amount"
                      min="30"
                      step="0.01"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <Button
                      onClick={handleWithdrawal}
                      disabled={walletBalance < 30 || !withdrawAmount || isNaN(parseFloat(withdrawAmount)) || parseFloat(withdrawAmount) < 30 || parseFloat(withdrawAmount) > walletBalance}
                      className="border-gray-600 text-gray-300 hover:border-primary hover:text-primary hover:bg-primary hover:bg-opacity-10 w-full"
                    >
                      Withdraw
                    </Button>
                    {walletBalance < 30 && (
                      <div className="text-sm text-yellow-400 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-lg p-3">
                        You need at least $30 in your wallet to withdraw.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-white">Confirm Withdrawal</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Withdraw Amount:</span>
                  <span className="font-bold text-white">${parseFloat(withdrawAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Service Charge (10%):</span>
                  <span className="font-bold text-yellow-400">-${serviceCharge.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-medium">Net Amount:</span>
                    <span className="font-bold text-primary text-lg">${netWithdraw.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={confirmWithdrawal}
                  isLoading={processingWithdrawal}
                  className="bg-primary hover:bg-primary-600 text-black flex-1"
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowWithdrawModal(false)}
                  className="border-gray-600 text-gray-300 hover:border-gray-500 flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Transaction History</h3>
                <p className="text-gray-400 text-sm">Your recent wallet transactions</p>
              </div>
              <div className="w-full md:w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <svg
                  className="animate-spin h-8 w-8 text-primary"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="bg-gray-900 overflow-hidden rounded-xl border border-gray-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-700">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </div>
                                <div className="text-sm text-gray-400">{transaction.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <div className="text-sm text-gray-300">{formatDate(transaction.created_at)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${getAmountColor(transaction.type)}`}>
                              {transaction.type === 'withdrawal' || transaction.type === 'payment' ? '- ' : '+ '}
                              {formatCurrency(transaction.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(transaction.status)}`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 rounded-lg bg-gray-900 border border-gray-700">
                <WalletIcon className="mx-auto h-12 w-12 mb-4 text-gray-600" />
                <h3 className="text-lg font-medium mb-2 text-white">No transactions yet</h3>
                <p className="text-gray-400">
                  {searchQuery
                    ? 'No transactions match your search criteria.'
                    : 'Your transaction history will appear here.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
