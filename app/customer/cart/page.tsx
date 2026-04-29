'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Dialog,
    DialogContent
} from '@/components/ui/dialog';
import { 
    ChevronLeft, 
    Trash2, 
    Plus, 
    Minus, 
    Calendar, 
    Clock, 
    CheckCircle2, 
    Wallet,
    ArrowRight
} from 'lucide-react';
import { useProducts } from '@/lib/products-context';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { PaymentDialog } from '@/components/payment/payment-dialog';

export default function CartPage() {
    const router = useRouter();
    const { products, cart, updateCart, clearCart } = useProducts();
    const { user } = useAuth();
    const [isPaying, setIsPaying] = React.useState(false);
    const [paymentType, setPaymentType] = React.useState<'full' | 'advance'>('full');

    const cartItems = Object.entries(cart).map(([id, qty]) => {
        const product = products.find(p => p.id === id);
        return { product, qty };
    }).filter(item => item.product !== undefined);

    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.product?.plans?.[0]?.price || 60;
        return acc + (price * item.qty);
    }, 0);

    const handleCheckout = async () => {
        toast.loading("Activating your subscription...", { id: 'activate' });
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.dismiss('activate');
        
        // Clear cart in background
        clearCart();
    };

    // Debugging logic to see what's actually in the cart keys
    const rawCartKeys = Object.keys(cart);
    console.log("Cart contents:", cart);
    console.log("Available products:", products.length);

    if (cartItems.length === 0 && !isPaying) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans text-slate-900">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8 border border-slate-100">
                    <Trash2 className="w-10 h-10 text-slate-300" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2">Cart is empty</h1>
                <p className="text-slate-500 mb-4 max-w-xs">Looks like you haven't added anything to your daily delivery yet.</p>
                {rawCartKeys.length > 0 ? (
                    <div className="mb-8 p-4 bg-amber-50 rounded-xl border border-amber-100 text-[10px] items-start flex flex-col gap-1 text-amber-900 font-mono">
                        <p className="font-bold uppercase tracking-wider mb-1">Debug Info:</p>
                        <p>Cart state has {rawCartKeys.length} items but products list (length: {products.length}) doesn't match them.</p>
                        <p>Cart IDs: {rawCartKeys.join(', ')}</p>
                    </div>
                ) : (
                    <div className="mb-8 p-4 bg-slate-100 rounded-xl border border-slate-200 text-[10px] items-start flex flex-col gap-1 text-slate-500 font-mono max-w-[280px] overflow-hidden truncate">
                        <p className="font-bold uppercase tracking-wider mb-1">Storage Status:</p>
                        <p>LocalStorage 'customer_cart': {typeof window !== 'undefined' ? localStorage.getItem('customer_cart') || 'EMPTY' : 'N/A'}</p>
                    </div>
                )}
                <Button 
                    onClick={() => router.push('/vendor/customer-products')}
                    className="h-14 px-10 bg-black hover:bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95 px-12"
                >
                    Browse Products
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF] font-sans text-slate-900 pb-32">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-slate-100/60 sticky top-0 z-50">
                <div className="px-6 py-6 flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="w-11 h-11 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 active:scale-90 transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">Your Cart</h1>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{cartItems.length} items for subscription</p>
                    </div>
                </div>
            </div>

            <div className="px-6 pt-8 space-y-6 max-w-lg mx-auto">
                {/* Product List */}
                <div className="space-y-4">
                    {cartItems.map(({ product, qty }) => {
                        const price = product?.plans?.[0]?.price || 60;
                        return (
                            <Card key={product?.id} className="p-5 border-none rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white group hover:shadow-lg transition-all border border-slate-100/50">
                                <div className="flex gap-5">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center p-2 relative">
                                        {product?.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                                        ) : (
                                            <span className="text-2xl">{product?.category === 'Grains' ? '🌾' : '🥛'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-black text-[15px] text-slate-900 leading-tight">{product?.name}</h3>
                                            <button 
                                                onClick={() => updateCart(product!.id, 0)}
                                                className="text-slate-300 hover:text-red-400 transition-colors"
                                            >
                                                <XIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{product?.size || '500 ml'} • DAILY</p>
                                        
                                        <div className="flex items-center justify-between">
                                            <p className="font-black text-slate-900">₹{price * qty}</p>
                                            <div className="flex items-center gap-4 bg-slate-50 rounded-xl px-1 py-1 border border-slate-100/50">
                                                <button 
                                                    onClick={() => updateCart(product!.id, qty - 1)}
                                                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 active:scale-90 transition-all font-bold"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-black text-slate-900 tabular-nums min-w-[12px] text-center">{qty}</span>
                                                <button 
                                                    onClick={() => updateCart(product!.id, qty + 1)}
                                                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 active:scale-90 transition-all font-bold"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>


                {/* Payment Breakdown */}
                <div className="pt-4 pb-12 space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Order Summary</h3>
                    
                    {/* Advance Payment Toggle */}
                    <div className="p-1">
                        <div className="grid grid-cols-2 gap-3 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
                            <button 
                                onClick={() => setPaymentType('full')}
                                className={cn(
                                    "py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    paymentType === 'full' ? "bg-white text-slate-900 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                Full Payment
                            </button>
                            <button 
                                onClick={() => setPaymentType('advance')}
                                className={cn(
                                    "py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    paymentType === 'advance' ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                50% Advance
                            </button>
                        </div>
                    </div>

                    <div className="p-1 space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-slate-500">Order Total</span>
                            <span className="text-slate-900 font-black">₹{subtotal.toFixed(2)}</span>
                        </div>
                        {paymentType === 'advance' && (
                            <div className="flex justify-between text-sm font-medium text-indigo-600">
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                    </div>
                                    Advance Discount (50%)
                                </span>
                                <span className="font-black">- ₹{(subtotal / 2).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-slate-500">Delivery Fee</span>
                            <span className="text-emerald-600 font-black">FREE</span>
                        </div>
                        <div className="pt-3 mt-1 border-t border-slate-100 flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">
                                    {paymentType === 'advance' ? 'Advance Amount' : 'Total Payable'}
                                </span>
                                <span className="text-3xl font-black text-[#151921]">
                                    ₹{(paymentType === 'advance' ? subtotal / 2 : subtotal).toFixed(2)}
                                </span>
                            </div>
                            {paymentType === 'advance' && (
                                <p className="text-[9px] font-bold text-slate-400 text-right max-w-[120px] mb-1">
                                    Remaining ₹{(subtotal / 2).toFixed(2)} will be due on delivery
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Finalization Area - Fixed Bottom Bar with Shorter Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-center z-50">
                <Button 
                    onClick={() => setIsPaying(true)}
                    className="w-full max-w-[320px] h-14 bg-[#151921] hover:bg-black text-white font-black rounded-2xl flex items-center justify-between px-6 shadow-2xl shadow-slate-200 active:scale-95 transition-all border-none"
                >
                    <div className="flex flex-col items-start leading-tight">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-0.5">Checkout</span>
                        <span className="text-base tracking-tight">Pay Now</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-black tracking-tighter">
                            ₹{(paymentType === 'advance' ? subtotal / 2 : subtotal).toFixed(2)}
                        </span>
                        <ArrowRight className="w-5 h-5 opacity-50" />
                    </div>
                </Button>
            </div>

            {/* Payment Dialog */}
            <PaymentDialog 
                open={isPaying}
                onOpenChange={setIsPaying}
                amount={paymentType === 'advance' ? subtotal / 2 : subtotal}
                productName={cartItems.length === 1 ? cartItems[0].product!.name : `${cartItems.length} Products`}
                onSuccess={handleCheckout}
                onDone={() => router.push('/vendor/customer-products')}
            />
        </div>
    );
}

// Fallback skeleton to show during success transition or empty states
function CartSkeleton() {
    return (
        <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
    )
}
