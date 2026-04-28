'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth-context';
import { mockTenants } from '@/lib/mock-data';
import { Save, Bell, Lock, CreditCard, Users, ShieldCheck, Mail, Smartphone, Globe, Trash2, LogOut, Settings2, Sparkles, AlertCircle, Zap, Server, Activity, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSaveMetadata = () => {
    toast.promise(
      updateUser({ name, email, phone }),
      {
        loading: 'Synchronizing identity metadata...',
        success: 'Profile and enterprise metadata updated successfully.',
        error: 'Failed to sync metadata',
      }
    );
  };

  const handleAddCard = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Authorizing through PCI gateway...',
        success: 'Card vaulted and tokenized successfully.',
        error: 'Authorization failed',
      }
    );
    setIsAddCardOpen(false);
  };

  const handleDeleteCard = (last4: string) => {
    toast.success(`Card ending in ${last4} removed from vault.`);
  };

  const handleSaveCompliance = () => {
    toast.success("Compliance data anchored", {
      description: "Tax identifiers and financial records have been updated."
    });
  };

  const handleConfigureHooks = () => {
    toast.error("Handshake Failed", {
      description: "Razorpay/Stripe hooks require active production keys in environment variables."
    });
  };

  const handleCommitAlerts = () => {
    toast.success("Alert streams updated", {
      description: "Intelligent notification logic has been committed to the security kernel."
    });
  };

  const handleCycleCredentials = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Recalculating password entropy...',
        success: 'Credentials cycled successfully across all nodes.',
        error: 'Entropy calculation failure',
      }
    );
  };

  const handleDeleteData = () => {
    toast.error("Action Prohibited", {
      description: "Enterprise data erasure requires Multi-Factor Hardware Key verification."
    });
  };

  const handleVerifyHub = () => {
    toast.success("Identity Verified", {
      description: "MFA heartbeat confirmed at 23ms latency."
    });
  };

  const handleCommitGovernance = () => {
    toast.success("Governance Baseline Committed", {
      description: "Operational protocols have been propagated to system nodes."
    });
  };

  const handleToggleFeature = (label: string, enabled: boolean) => {
    toast(enabled ? `${label} Enabled` : `${label} Disabled`, {
      description: `Targeting all active nodes for ${label.toLowerCase()} synchronization.`,
      icon: enabled ? <Zap className="w-4 h-4 text-primary" /> : <AlertCircle className="w-4 h-4 text-muted-foreground" />,
    });
  };

  const handlePurgeCDN = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: 'Invalidating Global Edge Cache...',
        success: 'CDN purged across 14 points of presence.',
        error: 'Cloudflare/Akamai handshake timeout',
      }
    );
  };

  const handleInvalSessions = () => {
    toast.warning("Global Session Invalidation", {
      description: "Broadcasting termination signal to all active JWT holders."
    });
  };
  const isSuperAdmin = user?.role === 'super_admin';
  const isCustomer = user?.role === 'customer' || user?.email === 'customer@user.com';
  const tenant = mockTenants.find((t) => t.id === user?.tenantId);

  const tabs = [
    { id: 'profile', label: 'Identity & Profile', icon: Users },
    { id: 'billing', label: 'Finance & Ledger', icon: CreditCard },
    { id: 'notifications', label: 'Alert Streams', icon: Bell },
    { id: 'security', label: 'Shield & Privacy', icon: ShieldCheck },
  ];

  if (isSuperAdmin) {
    tabs.push({ id: 'governance', label: 'Platform Governance', icon: Settings2 });
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in-fade">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {isSuperAdmin ? 'Global' : 'System'} <span className="text-gradient">Preferences</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
            {isSuperAdmin
              ? 'Institutional governance and platform-wide protocol management.'
              : 'Configure your account identity, security protocols, and operational parameters.'}
          </p>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted/30 rounded-2xl border border-border/50 w-fit animate-in-fade delay-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all duration-300",
                isActive
                  ? "bg-background text-primary shadow-sm shadow-primary/5 border border-border/50 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="animate-in-up delay-200">
        {/* Governance Settings */}
        {activeTab === 'governance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
            <Card className="glass-card p-10">
              <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Settings2 className="w-5 h-5 text-primary" /></div>
                Core Operational Protocols
              </h2>
              <div className="space-y-6">
                {[
                  { label: 'Maintenance Mode', desc: 'Lock the platform for scheduled infrastructure updates.', icon: Zap },
                  { label: 'Automatic Cloud Backup', desc: 'Sync all ledger data to hot-storage regions daily.', icon: Server },
                  { label: 'Advanced Telemetry', desc: 'Enable detailed event logging for customer support.', icon: Activity },
                  { label: 'New Tenant Sandboxing', desc: 'Restrict new signups to a preview environment initially.', icon: ShieldCheck },
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-6 p-6 rounded-[1.5rem] border border-border/50 cursor-pointer hover:bg-primary/[0.03] transition-all group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer sr-only" 
                        onChange={(e) => handleToggleFeature(item.label, e.target.checked)}
                      />
                      <div className="w-12 h-6 bg-muted rounded-full peer-checked:bg-primary/30 transition-colors" />
                      <div className="absolute left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-7 peer-checked:bg-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                  </label>
                ))}
                <div className="pt-6 border-t border-border/50 flex justify-end">
                  <Button onClick={handleCommitGovernance} className="h-12 px-8 rounded-xl font-black bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    Commit Governance Baseline
                  </Button>
                </div>
              </div>
            </Card>

            <div className="space-y-8">
              <Card className="glass-card p-8 border-emerald-500/20 bg-emerald-500/[0.02]">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4 text-emerald-500">
                  <Globe className="w-5 h-5" /> Region Deployment Status
                </h3>
                <div className="space-y-4">
                  {['IN-SOUTH-1 (Active)', 'US-EAST-2 (Replica)', 'EU-WEST-1 (Cold)'].map((reg, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                      <span>{reg}</span>
                      <span className={cn(i === 0 ? "text-emerald-500" : "text-slate-400")}>{i === 0 ? 'SYNCHRONIZED' : 'IDLE'}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="glass-card p-10 border-rose-500/20 bg-rose-500/[0.02]">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4 text-rose-500">
                  <Lock className="w-5 h-5" /> System Overrides
                </h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-6">
                  Perform a global cache purge or invalidate all active sessions across the platform. Use with extreme caution.
                </p>
                <div className="flex gap-4">
                  <Button onClick={handlePurgeCDN} variant="outline" className="flex-1 h-12 rounded-xl text-xs font-black uppercase text-rose-500 border-rose-500/20 hover:bg-rose-500/10">Purge CDN</Button>
                  <Button onClick={handleInvalSessions} variant="outline" className="flex-1 h-12 rounded-xl text-xs font-black uppercase text-rose-500 border-rose-500/20 hover:bg-rose-500/10">Inval Sessions</Button>
                </div>
              </Card>
            </div>
          </div>
        )}
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="glass-card p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <Users className="w-32 h-32" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><Users className="w-5 h-5 text-primary" /></div>
                  Personal Identification
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                        Full Legal Name
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                        Primary Email Address
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {tenant && (
                    <div className="space-y-6 pt-6 border-t border-border/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                            Enterprise Name
                          </label>
                          <Input
                            type="text"
                            defaultValue={tenant.name}
                            className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                            Mobile Contact
                          </label>
                          <Input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20"
                            placeholder="+91 ..."
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                          Registered Office Address
                        </label>
                        <Input
                          type="text"
                          defaultValue={tenant.address}
                          className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                            Jurisdiction (City)
                          </label>
                          <Input
                            type="text"
                            defaultValue={tenant.city}
                            className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                            State/Province
                          </label>
                          <Input
                            type="text"
                            defaultValue={tenant.state}
                            className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                            Zip/Pin Code
                          </label>
                          <Input
                            type="text"
                            defaultValue={tenant.pinCode}
                            className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end pt-6">
                    <Button onClick={handleSaveMetadata} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 gap-2">
                      <Save className="w-4 h-4" /> Save Metadata
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="glass-card p-8 border-primary/20 bg-primary/[0.02]">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Profile Integrity</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your identity metadata is synchronized across the enterprise grid. Updates to your corporate address will be reflected in future billing cycles.
                </p>
              </Card>

              <Card className="glass-card p-8 group">
                <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" /> Active Nodes
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-foreground">Cloud Instance: IND-WEST-1</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50 opacity-60">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-xs font-bold text-foreground">Primary Auth Service: OKTA-2</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Billing Settings */}
        {activeTab === 'billing' && (
          <div className="max-w-4xl space-y-8">
            {/* Payment Methods Section */}
            <Card className="glass-card p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><CreditCard className="w-5 h-5 text-primary" /></div>
                  Vaulted Payment Methods
                </h2>
                <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                  <Button onClick={() => setIsAddCardOpen(true)} variant="outline" className="rounded-xl h-10 px-4 font-bold border-primary/20 text-primary hover:bg-primary/5 text-xs">
                    <Plus className="w-3.5 h-3.5 mr-2" /> Add New Card
                  </Button>
                  <DialogContent className="glass-card border-border/50 max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-black">Add Payment Method</DialogTitle>
                      <DialogDescription className="font-medium">Securely vault a new card for automated billing.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cardholder Name</label>
                        <Input placeholder="Super Admin" className="h-11 rounded-xl bg-background/50 border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Card Number</label>
                        <div className="relative">
                          <Input placeholder="4242 4242 4242 4242" className="h-11 rounded-xl bg-background/50 border-border/50" />
                          <CreditCard className="absolute right-3 top-3 w-5 h-5 text-muted-foreground/30" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Expiry</label>
                          <Input placeholder="MM/YY" className="h-11 rounded-xl bg-background/50 border-border/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">CVV</label>
                          <Input placeholder="•••" type="password" className="h-11 rounded-xl bg-background/50 border-border/50" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddCardOpen(false)} className="rounded-xl font-bold h-11">Cancel</Button>
                      <Button onClick={handleAddCard} className="rounded-xl font-black h-11 bg-primary text-primary-foreground shadow-lg shadow-primary/20">Vault Card</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true, brand: 'indigo' },
                  { type: 'Mastercard', last4: '8812', expiry: '09/25', isDefault: false, brand: 'rose' },
                ].map((card, i) => (
                  <div key={i} className={cn(
                    "relative p-6 rounded-2xl border transition-all cursor-pointer group hover:shadow-lg",
                    card.isDefault ? "border-primary/30 bg-primary/[0.02]" : "border-border/50 bg-background/50"
                  )}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("w-10 h-6 rounded bg-slate-800 flex items-center justify-center text-[8px] font-black text-white italic tracking-tighter uppercase", card.brand === 'indigo' ? 'bg-indigo-600' : 'bg-rose-600')}>
                        {card.type}
                      </div>
                      {card.isDefault && (
                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase">Default</Badge>
                      )}
                    </div>
                    <p className="text-lg font-mono font-bold text-foreground tracking-widest mb-1">
                      •••• •••• •••• {card.last4}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Expires {card.expiry}</p>
                      <Button onClick={() => handleDeleteCard(card.last4)} variant="ghost" size="sm" className="h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-dashed border-border">
                  <div className="p-2 bg-background rounded-lg text-muted-foreground">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">PCI-DSS Compliant Vaulting</p>
                    <p className="text-[10px] text-muted-foreground italic">Your sensitive payment data is tokneized and never stored on our local infrastructure.</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-10">
              <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Globe className="w-5 h-5 text-primary" /></div>
                Tax & Financial Compliance
              </h2>
              <div className="space-y-8">
                {tenant ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> GSTIN (VAT ID)
                      </label>
                      <Input
                        type="text"
                        defaultValue={tenant.gstNumber}
                        className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> PAN ID
                      </label>
                      <Input
                        type="text"
                        defaultValue={tenant.panNumber}
                        className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border-2 border-dashed border-border/50 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs font-bold text-foreground">Individual Profile</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Tax identifiers are not required for individual consumer accounts.</p>
                  </div>
                )}
                <div className="pt-4 border-t border-border/50 flex items-center justify-end">
                  <Button onClick={handleSaveCompliance} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
                    <Save className="w-4 h-4 mr-2" /> Save Compliance Data
                  </Button>
                </div>
              </div>
            </Card>

            {!isCustomer && (
              <Card className="glass-card p-10 border-amber-500/20 bg-amber-500/[0.02]">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-20 h-20 bg-amber-500/10 rounded-[2rem] flex items-center justify-center text-amber-500 shrink-0">
                    <Settings2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Payment Gateway Orchestration
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Infrastructure hook for Razorpay and Stripe are awaiting Firebase initialization. Once the cloud functions are deployed, you can perform handshakes with external providers here.
                    </p>
                  </div>
                  <Button onClick={handleConfigureHooks} className="ml-auto rounded-xl hover:bg-amber-500/10 hover:text-amber-500 border-amber-500/20 text-muted-foreground font-bold">Configure Hooks</Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="max-w-4xl">
            <Card className="glass-card p-10">
              <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Bell className="w-5 h-5 text-primary" /></div>
                Intelligent Alert Streams
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Invoice clearance', description: 'Real-time notifications for payment settlements.', icon: CreditCard },
                  { label: 'Threshold reminders', description: 'Alerts when usage-based limits are approaching capacity.', icon: Zap },
                  { label: 'Lifecycle transitions', description: 'Events for plan upgrades, pauses, or terminations.', icon: Smartphone },
                  { label: 'Security heartbeats', description: 'Immediate alerts for MFA attempts or login anomalies.', icon: Lock },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-6 p-6 rounded-[1.5rem] border border-border/50 cursor-pointer hover:bg-primary/[0.03] hover:border-primary/20 transition-all group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="peer sr-only" 
                        onChange={(e) => handleToggleFeature(item.label, e.target.checked)}
                      />
                      <div className="w-12 h-6 bg-muted rounded-full peer-checked:bg-primary/30 transition-colors" />
                      <div className="absolute left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-7 peer-checked:bg-primary shadow-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <item.icon className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </label>
                ))}
                <div className="flex justify-end pt-8">
                  <Button onClick={handleCommitAlerts} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
                    <Save className="w-4 h-4 mr-2" /> Commit Alert Logic
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
            <Card className="glass-card p-10">
              <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Lock className="w-5 h-5 text-primary" /></div>
                Credential Entropy
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Current Master Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 bg-background/50 border-border/50 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Next Iteration Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 bg-background/50 border-border/50 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    Confirm Next Iteration
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 bg-background/50 border-border/50 rounded-xl"
                  />
                </div>
                <div className="flex justify-end pt-6">
                  <Button onClick={handleCycleCredentials} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 gap-2">
                    <ShieldCheck className="w-4 h-4" /> Cycle Credentials
                  </Button>
                </div>
              </div>
            </Card>

            <div className="space-y-8">
              <Card className="glass-card p-10 border-rose-500/20 bg-rose-500/[0.01]">
                <h2 className="text-xl font-bold text-rose-500 mb-6 flex items-center gap-3">
                  <LogOut className="w-5 h-5" /> Danger Protocol
                </h2>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  Initiating a session termination will invalidate all cloud tokens currently associated with this identity across all nodes.
                </p>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl text-rose-500 border-rose-500/20 hover:bg-rose-500/10 font-bold gap-2"
                    onClick={logout}
                  >
                    Log Out Everywhere <LogOut className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleDeleteData}
                    variant="ghost"
                    className="w-full h-12 rounded-xl text-muted-foreground hover:bg-rose-500/5 hover:text-rose-500 font-bold gap-2"
                  >
                    Delete Enterprise Data <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              <Card className="glass-card p-8 bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/50 text-emerald-500">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Multi-Factor Protocol</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active & Secure</p>
                  </div>
                  <Button onClick={handleVerifyHub} variant="link" className="ml-auto text-primary font-bold text-xs">Verify Hub</Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}