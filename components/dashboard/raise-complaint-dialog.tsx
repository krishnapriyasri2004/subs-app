'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface RaiseComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (complaint: any) => void;
}

export function RaiseComplaintDialog({ open, onOpenChange, onSubmit }: RaiseComplaintDialogProps) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !category || !priority || !description || !attachment) {
      toast.error('Please fill in all required fields and attach an image.');
      return;
    }

    let base64Image = '';
    if (attachment) {
      base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality jpeg
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(attachment);
      });
    }

    onSubmit({
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      category,
      priority,
      businessType, // 'milk' or 'rice'
      description,
      hasAttachment: !!attachment,
      attachmentName: attachment?.name,
      attachmentData: base64Image,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).replace(/ /g, ' '),
    });

    setSubject('');
    setCategory('');
    setPriority('');
    setBusinessType('');
    setDescription('');
    setAttachment(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Raise a Complaint</DialogTitle>
          <DialogDescription>
            Submit your issue or request below and our team will get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[80vh] overflow-y-auto px-6 py-2">
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Select Vendor / Service</Label>
              <Select value={businessType} onValueChange={setBusinessType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Which service is this for?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="milk">Milk Delivery</SelectItem>
                  <SelectItem value="rice">Rice Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="E.g. Issue with milk delivery"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delivery">Delivery</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Account">Account</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Message Description</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment">Attach Image <span className="text-rose-500 font-bold">*</span></Label>
              <Input
                id="attachment"
                type="file"
                accept="image/*"
                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                className="cursor-pointer text-slate-500 file:cursor-pointer file:mr-4 file:py-1 text-xs file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                required
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 pb-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Submit Complaint
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
