import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PriceListsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Price Lists</h1>
                    <p className="text-sm text-slate-500">Manage custom pricing for different customer segments</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Price List
                </Button>
            </div>

            <Card className="p-12 text-center border-dashed border-2 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Coming Soon</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    We're building advanced price list management to let you configure custom product pricing per customer tier!
                </p>
            </Card>
        </div>
    );
}
