import { useState, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { TransactionsPage } from './components/transactions/TransactionsPage';
import { AIAssistantPage } from './components/ai-assistant/AIAssistantPage';
import { TransactionGroup } from './components/transactions/HistoryView';
import { AutopilotFlowGroup } from './components/transactions/AutopilotBaseView';
import { FilterState } from './components/transactions/FilterMenu';
import { AddTransactionModal } from './components/transactions/AddTransactionModal';
import { AddNewAutopilotDrawer } from './components/transactions/AddNewAutopilotDrawer';
import { Dashboard } from './components/dashboard/Dashboard';
import { CashflowPage } from './components/cashflow/CashflowPage';
import { toast } from 'sonner';

// Mock data - replace with API calls
const mockTransactionGroups: TransactionGroup[] = [
  {
    date: '2026-04-06',
    label: 'Today, April 6',
    transactions: [
      {
        id: '1',
        merchant: 'Starbucks Coffee',
        category: 'Food & Dining',
        subcategory: 'Restaurants',
        amount: 1250,
        type: 'expense',
        icon: 'coffee',
      },
      {
        id: '2',
        merchant: 'Amazon.com',
        category: 'Shopping',
        subcategory: 'Online Shopping',
        amount: 8500,
        type: 'expense',
        icon: 'shopping',
      },
      {
        id: '3',
        merchant: 'Monthly Salary',
        category: 'Income',
        subcategory: 'Salary',
        amount: 125000,
        type: 'income',
        icon: 'salary',
      },
    ],
  },
  {
    date: '2026-04-05',
    label: 'Yesterday, April 5',
    transactions: [
      {
        id: '4',
        merchant: 'Uber',
        category: 'Transportation',
        subcategory: 'Ride Share',
        amount: 750,
        type: 'expense',
        icon: 'car',
      },
      {
        id: '5',
        merchant: 'Monthly Rent Payment',
        category: 'Housing',
        subcategory: 'Rent',
        amount: 45000,
        type: 'expense',
        icon: 'home',
      },
    ],
  },
];

const mockAutopilotFlowGroups: AutopilotFlowGroup[] = [
  {
    frequency: 'monthly',
    label: 'Monthly Flows',
    flows: [
      {
        id: 'ap1',
        title: 'Apartment Rent',
        schedule: '1st of every month',
        amount: 50000,
        type: 'expense',
        icon: 'house',
        enabled: true,
      },
      {
        id: 'ap2',
        title: 'Internet Bill',
        schedule: '15th of every month',
        amount: 4000,
        type: 'expense',
        icon: 'zap',
        enabled: false,
      },
      {
        id: 'ap3',
        title: 'Salary Deposit',
        schedule: 'Repeats on the 1st of every month',
        amount: 125000,
        type: 'income',
        icon: 'wallet',
        enabled: true,
      },
    ],
  },
  {
    frequency: 'weekly',
    label: 'Weekly Flows',
    flows: [
      {
        id: 'ap4',
        title: 'Transport Allowance',
        schedule: 'Every Monday, Friday',
        amount: 5000,
        type: 'expense',
        icon: 'car',
        enabled: true,
      },
      {
        id: 'ap5',
        title: 'Weekly Grocery Budget',
        schedule: 'Repeats every Monday',
        amount: 5000,
        type: 'expense',
        icon: 'shopping',
        enabled: true,
      },
    ],
  },
  {
    frequency: 'daily',
    label: 'Daily Flows',
    flows: [
      {
        id: 'ap6',
        title: 'Morning Coffee',
        schedule: 'Every Day',
        amount: 80,
        type: 'expense',
        icon: 'coffee',
        enabled: true,
      },
      {
        id: 'ap7',
        title: 'Breakfast',
        schedule: 'Every Day',
        amount: 250,
        type: 'expense',
        icon: 'coffee',
        enabled: false,
      },
    ],
  },
];

const mockUser = {
  name: 'Alexander Jhoe',
  email: 'alexanderjhoe@mail.com',
  badge: 'Free',
};

const mockSidebarLinks = {
  main: [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' as const, href: '/dashboard' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: 'bot' as const, href: '/ai-assistant' },
    { id: 'cash-flow', label: 'Cash Flow', icon: 'cash-flow' as const, href: '/cash-flow' },
    { id: 'transactions', label: 'Transactions', icon: 'list' as const, href: '/transactions' },
  ],
  secondary: [
    { id: 'goals-habits', label: 'Goals & Habits', icon: 'target' as const, href: '/goals-habits' },
    { id: 'advanced-planning', label: 'Advanced Planning', icon: 'folder' as const, href: '/advanced-planning' },
  ],
  bottom: [
    { id: 'help', label: 'Help Center', icon: 'help' as const, href: '/help' },
    { id: 'settings', label: 'Settings', icon: 'settings' as const, href: '/settings' },
  ],
};

const mockChatLinks = [
  { id: 'chat-1', label: 'April Utility Bill Analysis' },
  { id: 'chat-2', label: 'Tracking Daily Coffee Expenses' },
  { id: 'chat-3', label: 'Monthly Subscription Costs Overview' },
  { id: 'chat-4', label: 'Year-to-Date Tax Deduction Summary' },
  { id: 'chat-5', label: 'Weekend Dining Out Budget' },
  { id: 'chat-6', label: 'Holiday Gift Spending Plan' },
  { id: 'chat-7', label: 'How to start an emergency fund' },
];

export default function App() {
  const [activeSidebarLink, setActiveSidebarLink] = useState('dashboard');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddAutopilotOpen, setIsAddAutopilotOpen] = useState(false);

  useEffect(() => {
    const handleGlobalFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        // Use a tiny timeout to ensure focus is fully established before selecting
        setTimeout(() => {
          if (document.activeElement === target) {
            target.select();
          }
        }, 0);
      }
    };
    document.addEventListener('focus', handleGlobalFocus, true);
    return () => document.removeEventListener('focus', handleGlobalFocus, true);
  }, []);

  const handleSidebarLinkClick = (linkId: string) => {
    setActiveSidebarLink(linkId);
    console.log('Navigate to:', linkId);
  };

  const handleAddTransaction = () => {
    setIsAddTransactionOpen(true);
  };

  const handleUserMenuClick = () => {
    console.log('User menu clicked');
  };

  const handleTransactionMenuClick = (transactionId: string) => {
    console.log('Transaction menu clicked:', transactionId);
    toast.info('Opening transaction options');
  };

  const handleNewAutopilotFlowClick = () => {
    setIsAddAutopilotOpen(true);
  };

  const handleAutopilotFlowToggle = (flowId: string, enabled: boolean) => {
    console.log('Autopilot flow toggled:', flowId, enabled);
    const flow = mockAutopilotFlowGroups.flatMap(g => g.flows).find(f => f.id === flowId);
    if (enabled) {
      toast.success(`${flow?.title || 'Flow'} enabled`);
    } else {
      toast.info(`${flow?.title || 'Flow'} disabled`);
    }
  };

  const handleAutopilotFlowClick = (flowId: string) => {
    console.log('Autopilot flow clicked:', flowId);
  };

  const handleFilterChange = (filters: FilterState) => {
    console.log('Filters changed:', filters);
    // TODO: Apply filters to transaction data
  };

  const handleNewChat = () => {
    console.log('New chat clicked');
    toast.success('Starting new AI conversation');
  };

  return (
    <>
      <MainLayout
        user={mockUser}
        sidebarLinks={mockSidebarLinks}
        chatLinks={mockChatLinks}
        activeSidebarLink={activeSidebarLink}
        onSidebarLinkClick={handleSidebarLinkClick}
        onAddTransaction={handleAddTransaction}
        onUserMenuClick={handleUserMenuClick}
        onNewChat={handleNewChat}
      >
        {activeSidebarLink === 'ai-assistant' ? (
          <AIAssistantPage />
        ) : activeSidebarLink === 'dashboard' ? (
          <Dashboard />
        ) : activeSidebarLink === 'cash-flow' ? (
          <CashflowPage />
        ) : (
          <TransactionsPage
            transactionGroups={mockTransactionGroups}
            autopilotFlowGroups={mockAutopilotFlowGroups}
            autopilotTotalSavings={51500}
            onTransactionMenuClick={handleTransactionMenuClick}
            onNewAutopilotFlowClick={handleNewAutopilotFlowClick}
            onAutopilotFlowToggle={handleAutopilotFlowToggle}
            onAutopilotFlowClick={handleAutopilotFlowClick}
            onFilterChange={handleFilterChange}
          />
        )}

        {isAddTransactionOpen && (
          <AddTransactionModal
            onClose={() => setIsAddTransactionOpen(false)}
            onSave={(data) => {
              console.log('Saved transaction payload:', data);
              toast.success(`${data.name || 'Transaction'} added successfully`);
              setIsAddTransactionOpen(false);
            }}
          />
        )}

        {isAddAutopilotOpen && (
          <AddNewAutopilotDrawer onClose={() => setIsAddAutopilotOpen(false)} />
        )}
      </MainLayout>
    </>
  );
}