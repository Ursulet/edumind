import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AccountSecurityManager } from '@/components/account/AccountSecurityManager';

export const dynamic = "force-dynamic";

export default async function ParentSecurityPage() {
  const user = await getUserFromToken();
  if (!user) redirect('/login');

  return (
    <div className="w-full py-6 md:py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2622]">Securitate & Autentificare</h1>
        <p className="text-[14px] text-[#6B746F] mt-1">Sesiuni active și protecția datelor.</p>
      </div>

      <AccountSecurityManager user={user} activeSection="sessions" />
    </div>
  );
}