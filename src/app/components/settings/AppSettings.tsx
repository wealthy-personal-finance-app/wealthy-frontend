import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  Eye,
  LayoutList,
  Link2,
  CreditCard,
  FileText,
  Bell,
  Globe,
  Coins,
  Moon,
  Sun,
  Smartphone,
  ChevronRight,
  Trash2,
  ExternalLink
} from 'lucide-react';

const FONT = { fontFamily: 'Inter Tight, sans-serif' };

const categories = [
  { id: 'preference', label: 'Preference', icon: Eye },
  { id: 'personalization', label: 'Personalization', icon: LayoutList },
  { id: 'archived-chats', label: 'Archived Chats', icon: FileText },
  { id: 'connected-apps', label: 'Connected Apps', icon: Link2 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export function AppSettings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get('plan') || 'Professional';
  const billingCycle = searchParams.get('billing') || 'monthly';
  const initialCategory = searchParams.get('category') || 'preference';

  const price = billingCycle === 'annual' ? 5.99 : 6.99;
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const [billingForm, setBillingForm] = useState({
    cardholderName: 'Alexander Jhoe',
    cardNumber: '',
    expDate: '',
    cvc: '',
    billingAddress: '',
    city: '',
    postalCode: '',
  });

  const handleBillingChange = (field: string, value: string) => {
    setBillingForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePayNow = () => {
    toast.success(`Subscribed to ${selectedPlan} Plan ($${price}/month)`);
    navigate('/dashboard');
  };

  const renderBilling = () => (
    <div className="flex-1 max-w-[700px]">
      <h2 className="text-white text-[24px] font-medium mb-6">Billing</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[12px] p-5">
          <div className="flex flex-col gap-1 mb-3">
            <span className="text-white text-[14px] font-medium">Free Plan</span>
            <span className="text-[#717784] text-[13px]">$0/month</span>
          </div>
          <span className="text-[#525866] text-[12px]">You are currently on free plan</span>
        </div>

        <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[12px] p-5 flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-white text-[14px] font-medium">Professional Plan</span>
              <span className="text-[#717784] text-[13px]">${price}/month</span>
            </div>
            <Button
              onClick={() => {}}
              className="bg-[#065f46] hover:bg-[#047857] text-white text-[12px] font-medium px-4 h-[32px] rounded-[8px] shrink-0 translate-y-2"
            >
              Upgrade Plan
            </Button>
          </div>
          <span className="text-[#525866] text-[12px]">Unlimited access</span>
        </div>
      </div>

      <h3 className="text-white text-[24px] font-medium mb-6">Payment Method</h3>

      <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[12px] p-6">
        <h4 className="text-white text-[14px] font-medium mb-5">Payment information</h4>
        
        <div className="mb-4">
          <label className="text-[#717784] text-[12px] mb-2 block">Card holder name</label>
          <div className="relative">
            <input
              type="text"
              value={billingForm.cardholderName}
              onChange={e => handleBillingChange('cardholderName', e.target.value)}
              className="w-full bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
              placeholder="Alexander Jhoe"
              style={FONT}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <div className="w-[24px] h-[16px] bg-[#1434CB] rounded-[2px] flex items-center justify-center">
                <span className="text-white text-[7px] font-bold">VISA</span>
              </div>
              <div className="w-[24px] h-[16px] bg-[#EB001B] rounded-[2px] flex items-center justify-center relative overflow-hidden">
                <div className="w-[10px] h-[10px] bg-[#F79E1B] rounded-full absolute right-[3px]" />
                <div className="w-[10px] h-[10px] bg-[#EB001B] rounded-full absolute left-[3px]" />
              </div>
              <div className="w-[24px] h-[16px] bg-[#006FCF] rounded-[2px] flex items-center justify-center">
                <span className="text-white text-[6px] font-bold">AMEX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[#717784] text-[12px] mb-2 block">Card number</label>
          <input
            type="text"
            value={billingForm.cardNumber}
            onChange={e => handleBillingChange('cardNumber', e.target.value)}
            className="w-full bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
            placeholder="1234 1234 1234 1234"
            style={FONT}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[#717784] text-[12px] mb-2 block">Exp date</label>
            <input
              type="text"
              value={billingForm.expDate}
              onChange={e => handleBillingChange('expDate', e.target.value)}
              className="w-full bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
              placeholder="MM/YY"
              style={FONT}
            />
          </div>
          <div>
            <label className="text-[#717784] text-[12px] mb-2 block">CVC</label>
            <div className="relative">
              <input
                type="text"
                value={billingForm.cvc}
                onChange={e => handleBillingChange('cvc', e.target.value)}
                className="w-full bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
                placeholder="123"
                style={FONT}
              />
              <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525866]" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[#717784] text-[12px] mb-2 block">Billing address</label>
          <input
            type="text"
            value={billingForm.billingAddress}
            onChange={e => handleBillingChange('billingAddress', e.target.value)}
            className="w-full bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
            placeholder="123 Main St"
            style={FONT}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-[#717784] text-[12px] mb-2 block">City</label>
            <input
              type="text"
              value={billingForm.city}
              onChange={e => handleBillingChange('city', e.target.value)}
              className="w-full bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
              placeholder="San Francisco"
              style={FONT}
            />
          </div>
          <div>
            <label className="text-[#717784] text-[12px] mb-2 block">Postal Code</label>
            <input
              type="text"
              value={billingForm.postalCode}
              onChange={e => handleBillingChange('postalCode', e.target.value)}
              className="w-full bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
              placeholder="94103"
              style={FONT}
            />
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2E2F33] rounded-[8px] p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#717784] text-[13px]">{selectedPlan} Plan</span>
            <span className="text-white text-[13px] font-medium">${price}/mo</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#717784] text-[13px]">Billing cycle</span>
            <span className="text-white text-[13px] font-medium capitalize">{billingCycle}</span>
          </div>
          <div className="border-t border-[#2E2F33] mt-3 pt-3 flex justify-between items-center">
            <span className="text-white text-[14px] font-semibold">Total due today</span>
            <span className="text-white text-[16px] font-semibold">
              ${billingCycle === 'annual' ? (price * 12).toFixed(2) : price}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-[#99A0AE] hover:text-white hover:bg-white/5 h-[40px] px-6 text-[13px] font-medium rounded-[8px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayNow}
            className="bg-[#065f46] hover:bg-[#047857] text-white h-[40px] px-6 text-[13px] font-semibold rounded-[8px]"
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPreference = () => (
    <div className="flex-1 max-w-[700px]">
      <h2 className="text-white text-[24px] font-medium mb-6">Preference</h2>
      
      <div className="flex flex-col gap-6">
        {/* Notifications */}
        <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[12px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-[32px] rounded-[8px] bg-[#141414] flex items-center justify-center text-[#10B981]">
              <Bell size={18} />
            </div>
            <h3 className="text-white text-[16px] font-medium">Notifications</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              { id: 'email-notif', label: 'Email Notifications', desc: 'Receive daily summary and market alerts via email.' },
              { id: 'push-notif', label: 'Push Notifications', desc: 'Get real-time alerts for large transactions.' },
              { id: 'budget-alerts', label: 'Budget Alerts', desc: 'Notify when approaching 80% of budget limits.' },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between py-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-white text-[14px] font-medium">{item.label}</span>
                  <span className="text-[#717784] text-[12px]">{item.desc}</span>
                </div>
                <div className="w-[40px] h-[22px] bg-[#065f46] rounded-full relative cursor-pointer">
                  <div className="absolute right-[2px] top-[2px] size-[18px] bg-white rounded-full shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Region & Language */}
        <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[12px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-[32px] rounded-[8px] bg-[#141414] flex items-center justify-center text-[#3B82F6]">
              <Globe size={18} />
            </div>
            <h3 className="text-white text-[16px] font-medium">Region & Language</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[#717784] text-[12px]">Language</label>
              <select className="w-full bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#717784] text-[12px]">Currency</label>
              <div className="relative">
                <select className="w-full bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none appearance-none">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#525866]">
                  <Coins size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalization = () => (
    <div className="flex-1 max-w-[700px]">
      <h2 className="text-white text-[24px] font-medium mb-6">Personalization</h2>

      <div className="flex flex-col gap-6">
        {/* Theme Appearance */}
        <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[12px] p-6">
          <h3 className="text-white text-[16px] font-medium mb-6">Appearance</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon, active: true },
              { id: 'system', label: 'System', icon: Smartphone },
            ].map(theme => (
              <button
                key={theme.id}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-[12px] border transition-all ${
                  theme.active 
                    ? 'bg-[#141414] border-[#065f46] text-white' 
                    : 'bg-[#141414] border-[#2E2F33] text-[#717784] hover:border-[#525866]'
                }`}
              >
                <div className={`size-[32px] rounded-[8px] flex items-center justify-center ${theme.active ? 'bg-[#065f46]/10 text-[#10B981]' : 'bg-white/5'}`}>
                  <theme.icon size={20} />
                </div>
                <span className="text-[13px] font-medium">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[12px] p-6">
          <h3 className="text-white text-[16px] font-medium mb-6">Accent Color</h3>
          <div className="flex gap-4">
            {['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E'].map(color => (
              <button
                key={color}
                className={`size-[32px] rounded-full border-2 transition-all hover:scale-110 ${color === '#10B981' ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderArchivedChats = () => (
    <div className="flex-1 max-w-[700px]">
      <h2 className="text-white text-[24px] font-medium mb-6">Archived Chats</h2>
      
      <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[12px] overflow-hidden">
        <div className="p-4 border-b border-[#2E2F33] flex justify-between items-center bg-white/5">
          <span className="text-[#99A0AE] text-[12px] font-medium uppercase tracking-wider">Conversation</span>
          <span className="text-[#99A0AE] text-[12px] font-medium uppercase tracking-wider">Date</span>
        </div>
        
        <div className="flex flex-col">
          {[
            { id: 1, title: 'Mortgage refinancing options analysis', date: 'Apr 02, 2026' },
            { id: 2, title: 'Tax deduction strategy for remote workers', date: 'Mar 28, 2026' },
            { id: 3, title: 'Portfolio rebalancing recommendations', date: 'Mar 15, 2026' },
            { id: 4, title: 'Emergency fund vs High-yield savings', date: 'Feb 20, 2026' },
          ].map(chat => (
            <div key={chat.id} className="flex items-center justify-between p-4 border-b border-[#2E2F33] hover:bg-white/[0.02] transition-colors group">
              <div className="flex flex-col gap-0.5">
                <span className="text-white text-[14px] font-medium group-hover:text-[#10B981] transition-colors cursor-pointer">{chat.title}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[#525866] text-[12px] flex items-center gap-1 hover:text-[#717784] cursor-pointer">
                    <Trash2 size={12} /> Delete
                  </span>
                  <span className="text-[#525866] text-[12px] flex items-center gap-1 hover:text-[#717784] cursor-pointer">
                    <ExternalLink size={12} /> View
                  </span>
                </div>
              </div>
              <span className="text-[#717784] text-[13px]">{chat.date}</span>
            </div>
          ))}
        </div>
        
        <div className="p-6 text-center">
          <p className="text-[#525866] text-[13px]">Only you can see archived chats. They are encrypted and private.</p>
        </div>
      </div>
    </div>
  );

  const renderConnectedApps = () => (
    <div className="flex-1 max-w-[700px]">
      <h2 className="text-white text-[24px] font-medium mb-6">Connected Apps</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {[
          { id: 'plaid', name: 'Plaid', desc: 'Securely connect your bank accounts and credit cards.', connected: true, logo: 'P' },
          { id: 'stripe', name: 'Stripe', desc: 'Manage your subscription and payment history.', connected: true, logo: 'S' },
          { id: 'notion', name: 'Notion', desc: 'Export your monthly financial reports to Notion.', connected: false, logo: 'N' },
          { id: 'zapier', name: 'Zapier', desc: 'Automate tasks between Wealthy and other apps.', connected: false, logo: 'Z' },
        ].map(app => (
          <div key={app.id} className="bg-[#191B1F] border border-[#2E2F33] rounded-[12px] p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`size-[48px] rounded-[12px] flex items-center justify-center text-[20px] font-bold ${app.connected ? 'bg-[#065f46]/20 text-[#10B981]' : 'bg-[#141414] text-[#717784]'}`}>
                {app.logo}
              </div>
              <div className="flex flex-col">
                <span className="text-white text-[15px] font-medium">{app.name}</span>
                <span className="text-[#717784] text-[13px]">{app.desc}</span>
              </div>
            </div>
            
            <Button
              variant={app.connected ? 'ghost' : 'default'}
              className={`h-[36px] px-5 text-[13px] font-medium rounded-[8px] ${
                app.connected 
                  ? 'text-[#F87171] hover:text-white hover:bg-red-500/10' 
                  : 'bg-[#065f46] hover:bg-[#047857] text-white'
              }`}
            >
              {app.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'billing': return renderBilling();
      case 'preference': return renderPreference();
      case 'personalization': return renderPersonalization();
      case 'archived-chats': return renderArchivedChats();
      case 'connected-apps': return renderConnectedApps();
      default: return renderPreference();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#141414] overflow-y-auto" style={FONT}>
      <div className="flex flex-1 justify-center py-8">
        <div className="flex w-full max-w-[1000px] gap-8 px-8">
          {/* Left Sidebar - Categories */}
          <aside className="w-[200px] shrink-0">
            <span className="text-[#525866] text-[11px] font-semibold uppercase tracking-wider mb-3 block px-3">
              Categories
            </span>
            <nav className="flex flex-col gap-[2px]">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-3 py-[10px] rounded-[8px] transition-all text-[13px] font-medium w-full text-left ${
                    activeCategory === cat.id
                      ? 'bg-[#191B1F] text-white'
                      : 'text-[#717784] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
