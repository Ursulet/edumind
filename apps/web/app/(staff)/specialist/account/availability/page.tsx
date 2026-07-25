import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getUserFromToken();
  if (!user) redirect('/login');
  if (!['SPECIALIST', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'PLATFORM_OWNER'].includes(user.role)) redirect('/dashboard');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#1F2622]">Account Availability</h1>
        <p className="text-[13px] text-[#6B746F]">This section is currently under development.</p>
      </div>
      <div className="bg-white border border-[#E3DED3] rounded-xl p-8 shadow-sm text-center">
        <h2 className="text-lg font-bold text-[#1F2622]">Coming Soon</h2>
        <p className="text-sm text-[#6B746F] mt-2">The detailed screens for Account Availability will be implemented in a future iteration.</p>
      </div>
    </div>
  );
}