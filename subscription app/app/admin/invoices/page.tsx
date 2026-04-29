import { redirect } from 'next/navigation';

export default function AdminInvoicesRedirect() {
  redirect('/dashboard/invoices');
}
