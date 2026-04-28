'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVendorAuth } from '@/lib/vendor-auth';
import { Bell, Lock, Building2, Mail, Loader2, KeyRound, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const { user, updateUser } = useVendorAuth();

  const [isLoadingBusiness, setIsLoadingBusiness] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(false);

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FALoading, setIs2FALoading] = useState(false);

  // Modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Forms
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [businessForm, setBusinessForm] = useState({ name: '', type: '', memberSince: '' });
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    if (user) {
      setBusinessForm({
        name: user.businessName || '',
        type: user.role === 'admin' ? 'Admin' : (user.businessType || ''),
        memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''
      });
      setProfileForm({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleUpdateBusiness = async () => {
    setIsLoadingBusiness(true);
    await new Promise(r => setTimeout(r, 800));
    updateUser({ businessName: businessForm.name });
    setIsLoadingBusiness(false);
    toast.success("Business information updated successfully!");
  };

  const handleUpdateProfile = async () => {
    setIsLoadingProfile(true);
    await new Promise(r => setTimeout(r, 800));
    updateUser({ name: profileForm.name, email: profileForm.email });
    setIsLoadingProfile(false);
    toast.success("Profile information updated successfully!");
  };

  const handleToggle2FA = async () => {
    setIs2FALoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIs2FAEnabled(!is2FAEnabled);
    setIs2FALoading(false);
    toast.success(`Two-Factor Authentication has been ${!is2FAEnabled ? 'enabled' : 'disabled'}.`);
  };

  const handleSavePreferences = async () => {
    setIsLoadingPrefs(true);
    await new Promise(r => setTimeout(r, 600));
    setIsLoadingPrefs(false);
    toast.success("Notification preferences saved.");
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwordForm.new.length < 6) {
      toast.error("Password is too short.");
      return;
    }

    // Simulate API Call
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Updating password...',
        success: () => {
          setIsPasswordModalOpen(false);
          setPasswordForm({ current: '', new: '', confirm: '' });
          return 'Password has been changed successfully.';
        },
        error: 'Failed to update password.'
      }
    );
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    await new Promise(r => setTimeout(r, 2000));
    setDeleting(false);
    setIsDeleteModalOpen(false);
    toast.error("Account deleted (simulated).");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Business Information */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Business Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Name
            </label>
            <Input
              value={businessForm.name}
              onChange={e => setBusinessForm({ ...businessForm, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Business Type
            </label>
            <Input
              value={businessForm.type}
              onChange={e => setBusinessForm({ ...businessForm, type: e.target.value })}
              readOnly={user?.role === 'admin'}
              className={user?.role === 'admin' ? "bg-slate-50 cursor-not-allowed text-muted-foreground" : ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Member Since
            </label>
            <Input
              value={businessForm.memberSince}
              onChange={e => setBusinessForm({ ...businessForm, memberSince: e.target.value })}
            />
          </div>

          <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleUpdateBusiness} disabled={isLoadingBusiness}>
            {isLoadingBusiness ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Update Business Info
          </Button>
        </div>
      </Card>

      {/* Account Information */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Account Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <Input
              value={profileForm.name}
              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <Input
              value={profileForm.email}
              onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
            />
          </div>

          <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleUpdateProfile} disabled={isLoadingProfile}>
            {isLoadingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Update Profile
          </Button>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 2 months ago</p>
            </div>
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>Change Password</Button>
          </div>

          <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">{is2FAEnabled ? 'Currently active' : 'Not enabled'}</p>
            </div>
            <Button
              variant={is2FAEnabled ? "secondary" : "outline"}
              onClick={handleToggle2FA}
              disabled={is2FALoading}
              className={is2FAEnabled ? "text-red-500 hover:text-red-600 hover:bg-red-50" : ""}
            >
              {is2FALoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Notifications</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <div>
              <p className="font-medium text-foreground">Payment Reminders</p>
              <p className="text-xs text-muted-foreground">Get notified when invoices are due</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <div>
              <p className="font-medium text-foreground">New Subscription</p>
              <p className="text-xs text-muted-foreground">Get notified of new customers</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <div>
              <p className="font-medium text-foreground">Weekly Report</p>
              <p className="text-xs text-muted-foreground">Receive weekly business summary</p>
            </div>
          </label>

          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleSavePreferences} disabled={isLoadingPrefs}>
            {isLoadingPrefs ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Billing & Subscription */}
      <Card className="p-6 border-red-200 bg-red-50/50">
        <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200" onClick={() => setIsDeleteModalOpen(true)}>
            Delete Account
          </Button>
          <p className="text-xs text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </div>
      </Card>

      {/* Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-blue-500" /> Change Password
            </DialogTitle>
            <DialogDescription>
              Update your account password to stay secure.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Input type={showCurrent ? "text" : "password"} value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} className="pr-10" />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input type={showNew ? "text" : "password"} value={passwordForm.new} onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })} className="pr-10" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Input type={showConfirm ? "text" : "password"} value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="pr-10" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleChangePassword}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" /> Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Yes, Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}