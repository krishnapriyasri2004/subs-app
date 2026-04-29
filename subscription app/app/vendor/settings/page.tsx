'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVendorAuth } from '@/lib/vendor-auth';
import { Bell, Lock, Building2, Mail, Shield, Zap, Trash2, Smartphone, Save } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const { user } = useVendorAuth();
  
  // States for toggles
  const [notifications, setNotifications] = useState({
    payments: true,
    subscriptions: true,
    weekly: false
  });

  const [securityStatus, setSecurityStatus] = useState({
    twoFactor: false,
    sessionPersistence: true
  });

  const handleUpdate = (section: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: `Saving ${section} changes...`,
        success: `${section} updated successfully.`,
        error: `Failed to update ${section}.`
      }
    );
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    setNotifications(prev => ({ ...prev, [key]: newValue }));
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${newValue ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 mt-2 font-medium">Control your workspace, security, and team notifications.</p>
        </div>
        <Button onClick={() => handleUpdate('Global Settings')} className="bg-slate-900 hover:bg-black text-white font-black rounded-xl h-11 px-8 shadow-xl">
          <Save className="w-4 h-4 mr-2" /> Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation / TOC */}
        <div className="space-y-1">
          {['Business Profile', 'Personal Account', 'Security', 'Notifications', 'Danger Zone'].map((item) => (
            <button
              key={item}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl text-sm font-black transition-all",
                item === 'Business Profile' ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-8">
          {/* Business Information */}
          <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 group-hover:scale-125 transition-transform duration-500">
              <Building2 className="w-24 h-24" />
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Business Profile</h2>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Business Name</label>
                  <Input 
                    value={user?.businessName} 
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white font-bold transition-all text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
                  <Input 
                    value={user?.businessType === 'both' ? 'Hybrid' : user?.businessType === 'milk' ? 'Milk' : 'Rice'} 
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white font-bold transition-all text-slate-900"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Onboarding Date</p>
                <p className="text-sm font-bold text-slate-600">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}</p>
              </div>

              <Button onClick={() => handleUpdate('Business')} className="w-full h-12 bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50 hover:border-slate-200 font-black rounded-xl transition-all shadow-sm">
                Update Profile
              </Button>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Security & Privacy</h2>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-slate-100 hover:bg-slate-50/50 transition-colors flex items-center justify-between group/row">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover/row:text-emerald-500 transition-colors">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Two-Factor Authentication</p>
                    <p className="text-[11px] font-medium text-slate-400">Secure your account with mobile verification</p>
                  </div>
                </div>
                <Switch 
                  checked={securityStatus.twoFactor} 
                  onCheckedChange={(val) => {
                    setSecurityStatus(s => ({...s, twoFactor: val}));
                    toast.success(`2FA ${val ? 'enabled' : 'disabled'}`);
                  }}
                />
              </div>

              <div className="p-6 rounded-2xl border border-slate-100 hover:bg-slate-50/50 transition-colors flex items-center justify-between group/row">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover/row:text-blue-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Change Password</p>
                    <p className="text-[11px] font-medium text-slate-400">Regularly update for better security</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-[11px] font-black uppercase text-blue-600 hover:bg-blue-50 px-4 h-9 rounded-lg" onClick={() => toast.info('Password reset link sent to your email')}>
                  Reset Now
                </Button>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Bell className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Notification Streams</h2>
            </div>

            <div className="space-y-3">
              {[
                { id: 'payments' as const, label: 'Payment Success', desc: 'Real-time alerts for successful transactions' },
                { id: 'subscriptions' as const, label: 'New Subscription', desc: 'Alert when a new node joins your network' },
                { id: 'weekly' as const, label: 'Performance Summary', desc: 'Aggregated analytics every Monday' }
              ].map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => toggleNotification(item.id)}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center transition-all",
                    notifications[item.id] ? "bg-blue-600 border-blue-600" : "border-slate-200 group-hover:border-slate-300"
                  )}>
                    {notifications[item.id] && <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -rotate-45 mb-0.5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-none">{item.label}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-8 border-rose-100 bg-rose-50/20 rounded-3xl overflow-hidden relative group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Zap className="w-48 h-48 text-rose-500" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-rose-900 tracking-tight">Danger Zone</h2>
            </div>

            <p className="text-xs font-bold text-rose-600/70 mb-6 max-w-sm">
              Proceed with extreme caution. Deleting your workspace will permanently purge all customer data, configurations, and transaction records. This action is irreversible.
            </p>

            <Button variant="outline" className="h-12 px-6 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 font-black transition-all shadow-sm">
              Purge Workspace Data
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}