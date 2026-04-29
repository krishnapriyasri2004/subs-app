import { Card } from '@/components/ui/card';

export default function EventsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Event Logs</h1>
                <p className="text-sm text-slate-500">Audit trail of all system activities</p>
            </div>

            <Card className="p-12 text-center border-dashed border-2 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Coming Soon</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    The event log system is currently being indexed. Once complete, you'll be able to view a detailed audit trail here.
                </p>
            </Card>
        </div>
    );
}
