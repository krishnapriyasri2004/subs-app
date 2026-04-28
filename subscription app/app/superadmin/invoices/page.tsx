import { redirect } from 'next/navigation';

export default function SuperadminInvoicesRedirect() {
  redirect('/dashboard/invoices');
}
