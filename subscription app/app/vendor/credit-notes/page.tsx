import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CreditNotesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Credit Notes</h1>
                    <p className="text-sm text-slate-500">Manage refunds and account credits</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Credit Note
                </Button>
            </div>

            <Card className="p-12 text-center border-dashed border-2 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Credit Notes Yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    Credit notes allow you to refund or apply credit balance to your customers. Once issued, they'll appear here.
                </p>
            </Card>
        </div>
    );
}
