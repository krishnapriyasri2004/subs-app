'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, Check, CheckCheck } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';

interface Message {
    id: string;
    sender: 'user' | 'admin';
    text: string;
    timestamp: string;
    status?: 'sent' | 'delivered' | 'read';
}

interface MessageDialogProps {
    isOpen: boolean;
    onClose: () => void;
    customerName: string;
    initialMessage: string;
}

export function MessageDialog({ isOpen, onClose, customerName, initialMessage }: MessageDialogProps) {
    const [replyText, setReplyText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    // Reset messages when opening a new chat
    React.useEffect(() => {
        if (isOpen && initialMessage) {
            setMessages([
                { id: '1', sender: 'user', text: initialMessage, timestamp: '10:30 AM', status: 'read' }
            ]);
        }
    }, [isOpen, initialMessage]);

    const handleSend = () => {
        if (!replyText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'admin',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        setMessages([...messages, newMessage]);
        setReplyText('');
        
        toast.success(`Message sent to ${customerName}`);
        
        // Simulating a response for "Support Team" or others if wanted
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m));
        }, 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 border-slate-100 shadow-2xl overflow-hidden rounded-[2rem]">
                <DialogHeader className="p-6 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            {customerName === 'Support Team' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">{customerName}</DialogTitle>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Online • Active Support Session
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="h-[400px] p-6 bg-white">
                    <div className="flex flex-col gap-6">
                        {messages.map((m) => (
                            <div 
                                key={m.id} 
                                className={`flex flex-col ${m.sender === 'admin' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm font-medium ${
                                    m.sender === 'admin' 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                                }`}>
                                    {m.text}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 px-1">
                                    <span className="text-[10px] font-bold text-slate-400">{m.timestamp}</span>
                                    {m.sender === 'admin' && (
                                        m.status === 'read' 
                                        ? <CheckCheck className="w-3 h-3 text-blue-500" /> 
                                        : <Check className="w-3 h-3 text-slate-300" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                    <div className="relative flex items-center gap-3">
                        <Input
                            placeholder="Type your response..."
                            className="h-14 pl-6 pr-14 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-2xl text-sm font-medium bg-white"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <Button 
                            size="icon" 
                            className="absolute right-2 w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                            onClick={handleSend}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
