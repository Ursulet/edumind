import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AccountSecurityManager } from '@/components/account/AccountSecurityManager';

export const dynamic = "force-dynamic";

export default async function SpecialistProfilePage() {
  const user = await getUserFromToken();
  if (!user) redirect('/login');
  if (!['SPECIALIST', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'PLATFORM_OWNER'].includes(user.role)) redirect('/dashboard');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2622]">Profil & Securitate Specialist</h1>
        <p className="text-[13px] text-[#6B746F]">Administrarea datelor personale și a securității contului profesional.</p>
      </div>

      <AccountSecurityManager user={user} activeSection="profile" />
    </div>
  );
}