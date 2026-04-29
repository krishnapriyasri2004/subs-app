'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVendorAuth } from '@/lib/vendor-auth';
import { Bell, Lock, User, Loader2, Check, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
    const { user, updateUser, changePassword } = useVendorAuth();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const [is2FAUpdating, setIs2FAUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        setIsUpdating(true);
        setIsSuccess(false);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        updateUser({ name, phone, address });

        setIsUpdating(false);
        setIsSuccess(true);

        setTimeout(() => setIsSuccess(false), 3000);
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            setPasswordError('Please fill in both fields.');
            return;
        }
        setPasswordError('');
        setIsChangingPassword(true);
        setPasswordSuccess(false);

        try {
            const success = await changePassword(currentPassword, newPassword);
            if (success) {
                setPasswordSuccess(true);
                setCurrentPassword('');
                setNewPassword('');
                setTimeout(() => setPasswordSuccess(false), 3000);
            } else {
                setPasswordError('Incorrect current password.');
            }
        } catch (e) {
            setPasswordError('An error occurred. Please try again later.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleToggle2FA = async () => {
        setIs2FAUpdating(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const newValue = !user?.twoFactorEnabled;
        updateUser({ twoFactorEnabled: newValue });

        setIs2FAUpdating(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your customer account and preferences</p>
            </div>

            {/* Account Information */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Personal Information</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Full Name
                        </label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Email Address
                        </label>
                        <Input value={user?.email || ''} readOnly className="bg-muted/50 text-muted-foreground cursor-not-allowed" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Phone Number
                            </label>
                            <Input 
                                placeholder="+91 00000 00000"
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Full Address
                        </label>
                        <Input 
                            placeholder="Street, City, State, ZIPCODE"
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                        />
                    </div>

                    <Button
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 rounded-xl"
                        onClick={handleUpdateProfile}
                        disabled={isUpdating || (name === user?.name && phone === user?.phone && address === user?.address)}
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : isSuccess ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Updated Successfully
                            </>
                        ) : (
                            'Update Profile'
                        )}
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
                    <div className="p-4 bg-muted rounded-lg space-y-4">
                        <div>
                            <p className="font-medium text-foreground mb-4">Change Password</p>

                            <div className="space-y-3 max-w-sm">
                                <div className="relative">
                                    <Input
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="Current Password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {passwordError && <p className="text-sm text-red-500 font-medium">{passwordError}</p>}

                                <Button
                                    onClick={handleChangePassword}
                                    disabled={isChangingPassword || !currentPassword || !newPassword}
                                    className="w-full"
                                >
                                    {isChangingPassword ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : passwordSuccess ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Password Updated
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">Two-Factor Authentication</p>
                            <p className="text-xs text-muted-foreground">
                                {user?.twoFactorEnabled
                                    ? 'Enabled. Your account is secured.'
                                    : 'Not enabled. We highly recommend enabling 2FA.'}
                            </p>
                        </div>
                        <Button
                            variant={user?.twoFactorEnabled ? "destructive" : "outline"}
                            onClick={handleToggle2FA}
                            disabled={is2FAUpdating}
                        >
                            {is2FAUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : user?.twoFactorEnabled ? (
                                'Disable 2FA'
                            ) : (
                                'Enable 2FA'
                            )}
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
                            <p className="font-medium text-foreground">Payment Receipts</p>
                            <p className="text-xs text-muted-foreground">Get notified when a payment is successful</p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <div>
                            <p className="font-medium text-foreground">Subscription Updates</p>
                            <p className="text-xs text-muted-foreground">Get notified about changes to your subscriptions</p>
                        </div>
                    </label>

                    <Button className="w-full mt-4">Save Preferences</Button>
                </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-6 border-red-200 bg-red-50/50">
                <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>

                <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start border-red-200 text-red-700 hover:bg-red-100">
                        Delete Account
                    </Button>
                    <p className="text-xs text-red-600/80">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                </div>
            </Card>
        </div>
    );
}