import React, { useEffect, useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, DollarSign, Calendar, Search, Star } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Transaction } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

export const WalletPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getUserTransactions, getWalletBalance, createTransaction, isLoading, error } = useWalletStore();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [processingDeposit, setProcessingDeposit] = useState(false);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [netWithdraw, setNetWithdraw] = useState(0);
  
  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user) return;
      
      try {
        const userTransactions = await getUserTransactions(user.id);
        const balance = await getWalletBalance(user.id);
        console.log("Fetched wallet balance:", balance); // DEBUG LOG
        
        setTransactions(userTransactions);
        setFilteredTransactions(userTransactions);
        setWalletBalance(balance);
      } catch (err) {
        console.error('Failed to fetch wallet data:', err);
      }
    };
    
    fetchWalletData();
  }, [user]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTransactions(transactions);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = transactions.filter(transaction => 
      transaction.description.toLowerCase().includes(query) ||
      transaction.type.toLowerCase().includes(query) ||
      formatCurrency(transaction.amount).toLowerCase().includes(query) ||
      formatDate(transaction.createdAt).toLowerCase().includes(query)
    );
    
    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);
  
  const handleDeposit = async () => {
    if (!user || !amount || isNaN(parseFloat(amount))) return;
    
    setProcessingDeposit(true);
    
    try {
      // In a real app, this would connect to Flutterwave for payment processing
      // For this mock, we'll just create a deposit transaction
      const depositAmount = parseFloat(amount);
      
      const newTransaction = await createTransaction({
        userId: user.id,
        amount: depositAmount,
        type: 'deposit',
        status: 'completed', // In a real app, this would start as 'pending'
        description: 'Account funding via Flutterwave',
      });
      
      // Update the transactions list and wallet balance
      setTransactions([newTransaction, ...transactions]);
      setWalletBalance(walletBalance + depositAmount);
      setAmount('');
      
      alert('Deposit successful!');
    } catch (err) {
      console.error('Failed to process deposit:', err);
      alert('Failed to process deposit. Please try again.');
    } finally {
      setProcessingDeposit(false);
    }
  };
  
  const handleWithdrawal = async () => {
    if (!user || !withdrawAmount || isNaN(parseFloat(withdrawAmount))) return;
    const withdrawalAmount = parseFloat(withdrawAmount);
    if (withdrawalAmount > walletBalance) {
      alert('Insufficient funds for withdrawal.');
      return;
    }
    // Calculate service charge and net amount
    const charge = withdrawalAmount * 0.10;
    const net = withdrawalAmount - charge;
    setServiceCharge(charge);
    setNetWithdraw(net);
    setShowWithdrawModal(true);
  };
  
  const confirmWithdrawal = async () => {
    if (!user) return;
    setProcessingWithdrawal(true);
    try {
      // In a real app, this would connect to a payment processor for withdrawal
      // For this mock, we'll just create a withdrawal transaction for the net amount
      const newTransaction = await createTransaction({
        userId: user.id,
        amount: netWithdraw,
        type: 'withdrawal',
        status: 'pending',
        description: `Withdrawal request (10% service charge: $${serviceCharge.toFixed(2)})`,
      });
      setTransactions([newTransaction, ...transactions]);
      setWithdrawAmount('');
      setShowWithdrawModal(false);
      alert('Withdrawal request submitted successfully!');
    } catch (err) {
      console.error('Failed to process withdrawal:', err);
      alert('Failed to process withdrawal. Please try again.');
    } finally {
      setProcessingWithdrawal(false);
    }
  };
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-5 w-5 text-amber-500" />;
      case 'earning':
        return <Star className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-red-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-amber-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const getAmountColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'earning':
        return 'text-green-600';
      case 'withdrawal':
      case 'payment':
        return 'text-red-600';
      default:
        return 'text-gray-900';
    }
  };
  
  // Add a handler for successful payment
  const handleFlutterwaveSuccess = async (response: any) => {
    // You can verify the payment on your backend here if needed
    // For now, treat as successful and update wallet
    if (!user) return;
    const depositAmount = parseFloat(amount);
    const newTransaction = await createTransaction({
      userId: user.id,
      amount: depositAmount,
      type: 'deposit',
      status: 'completed',
      description: 'Account funding via Flutterwave',
    });
    setTransactions([newTransaction, ...transactions]);
    setWalletBalance(walletBalance + depositAmount);
    setAmount('');
    alert('Deposit successful!');
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
      
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
              <CardDescription>Your available funds for campaigns or withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <WalletIcon className="h-12 w-12 text-blue-500 mr-4" />
                <div>
                  <span className="text-gray-500 text-sm">Available Balance</span>
                  <p className="text-3xl font-semibold">{formatCurrency(walletBalance)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Fund Wallet <br />minimum amount: $20</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder="Enter Amount"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {/* Show Flutterwave button only if amount is valid and user is a business owner */}
              {user?.role === 'business' && (
                <FlutterWaveButton
                  public_key={import.meta.env.VITE_FLW_PUBLIC_KEY}
                  tx_ref={Date.now().toString()}
                  amount={amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 ? parseFloat(amount) : 0}
                  currency="NGN"
                  payment_options="card,mobilemoney,ussd"
                  customer={{
                    email: user.email,
                    phone_number: user.phone_number || '',
                    name: user.name,
                  }}
                  customizations={{
                    title: 'ReviewH Payment',
                    description: 'Payment for campaign funding',
                    logo: 'https://yourdomain.com/logo.png',
                  }}
                  text="Deposit with Flutterwave"
                  callback={handleFlutterwaveSuccess}
                  onClose={() => {}}
                  className={`font-semibold py-2 rounded shadow w-full ${amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  disabled={!(amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0)}
                />
              )}
              {/* For reviewers, only show Withdraw button and require $30+ balance */}
              {user?.role === 'reviewer' && (
                <>
                  <Input
                    type="number"
                    placeholder="Withdraw Amount"
                    min="30"
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={handleWithdrawal}
                    isLoading={processingWithdrawal}
                    disabled={walletBalance < 30 || !withdrawAmount || isNaN(parseFloat(withdrawAmount)) || parseFloat(withdrawAmount) < 30 || parseFloat(withdrawAmount) > walletBalance}
                  >
                    Withdraw
                  </Button>
                  {walletBalance < 30 && (
                    <div className="text-sm text-amber-600 mt-2">
                      You need at least $30 in your wallet to withdraw.
                    </div>
                  )}
                  {/* Withdraw confirmation modal */}
                  {showWithdrawModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-2">Confirm Withdrawal</h3>
                        <p className="mb-2">Withdraw Amount: <span className="font-bold">${parseFloat(withdrawAmount).toFixed(2)}</span></p>
                        <p className="mb-2 text-amber-700">Service Charge (10%): <span className="font-bold">${serviceCharge.toFixed(2)}</span></p>
                        <p className="mb-4">Net Amount: <span className="font-bold">${netWithdraw.toFixed(2)}</span></p>
                        <div className="flex gap-2">
                          <Button onClick={confirmWithdrawal} isLoading={processingWithdrawal} fullWidth>
                            Confirm
                          </Button>
                          <Button variant="outline" onClick={() => setShowWithdrawModal(false)} fullWidth>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Transaction History */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          <div className="w-64">
            <Input
              placeholder="Search transactions..."
              icon={<Search className="h-5 w-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
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
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getTransactionTypeIcon(transaction.type)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </div>
                            <div className="text-sm text-gray-500">{transaction.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getAmountColor(transaction.type)}`}>
                          {transaction.type === 'withdrawal' || transaction.type === 'payment' ? '- ' : '+ '}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-opacity-10 ${getTransactionStatusColor(transaction.status)}`}>
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
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <WalletIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No transactions yet</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery
                ? 'No transactions match your search criteria.'
                : 'Your transaction history will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};