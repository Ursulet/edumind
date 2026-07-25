import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getUserFromToken();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'PLATFORM_OWNER')) redirect('/login');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2622]">Children</h1>
          <p className="text-sm text-[#6B746F]">Administrare modul Children</p>
        </div>
      </div>
      <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-10 shadow-sm text-center">
        <h2 className="text-[18px] font-bold text-[#1F2622]">În curând</h2>
        <p className="text-[14px] text-[#6B746F] mt-2">Acest ecran face parte din suita Super Admin și va fi activat într-un build viitor.</p>
      </div>
    </div>
  );
}