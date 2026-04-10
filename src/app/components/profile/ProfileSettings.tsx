import React, { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const FONT = { fontFamily: 'Inter Tight, sans-serif' };

export function ProfileSettings() {
  const [form, setForm] = useState({
    firstName: 'Alexander',
    lastName: 'Jhoe',
    email: 'alexanderjhoe@mail.com',
    phone: '+1 (555) 000-0000',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile settings updated successfully');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#141414] overflow-y-auto" style={FONT}>
      <div className="flex flex-1 justify-center py-8">
        <div className="flex w-full max-w-[800px] flex-col gap-8 px-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-[24px] font-medium">Profile Settings</h2>
            <p className="text-[#717784] text-[14px]">Manage your personal information and profile visibility.</p>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="bg-[#191B1F] border border-[#2E2F33] rounded-[12px] p-6 flex flex-col gap-6">
              <h3 className="text-white text-[16px] font-medium border-b border-[#2E2F33] pb-4 -mx-6 px-6">
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[#717784] text-[12px] font-medium">First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#717784] text-[12px] font-medium">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#717784] text-[12px] font-medium">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="bg-[#141414]/50 border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-[#525866] text-[13px] cursor-not-allowed"
                />
                <p className="text-[#525866] text-[11px]">Email cannot be changed. Contact support for assistance.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#717784] text-[12px] font-medium">Phone Number</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="bg-[#141414] border border-[#2E2F33] rounded-[8px] px-4 h-[42px] text-white text-[13px] outline-none focus:border-[#065f46] transition-colors"
                  placeholder="+1 (xxx) xxx-xxxx"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                className="text-[#99A0AE] hover:text-white hover:bg-white/5 h-[40px] px-6 text-[13px] font-medium rounded-[8px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#065f46] hover:bg-[#047857] text-white h-[40px] px-10 text-[13px] font-semibold rounded-[8px]"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
