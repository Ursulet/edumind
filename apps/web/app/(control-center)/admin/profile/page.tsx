import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AccountSecurityManager } from '@/components/account/AccountSecurityManager';

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const user = await getUserFromToken();
  if (!user) redirect('/login');
  if (user.role !== 'SUPER_ADMIN' && user.role !== 'PLATFORM_OWNER') redirect('/dashboard');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2622]">Platform Owner Profile & Security</h1>
        <p className="text-[13px] text-[#6B746F]">Operational security control center for account settings.</p>
      </div>

      <AccountSecurityManager user={user} activeSection="profile" />
    </div>
  );
}