import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getUserFromToken();
  if (!user) redirect('/login');

  return (
    <div className="w-full py-6 md:py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2622]">Cont - Notificari</h1>
        <p className="text-[14px] text-[#6B746F] mt-1">Acest ecran este în construcție.</p>
      </div>
      <div className="bg-white border border-[#E3DED3] rounded-2xl p-10 shadow-sm text-center">
        <h2 className="text-[18px] font-bold text-[#1F2622]">În curând</h2>
        <p className="text-[14px] text-[#6B746F] mt-2">Detaliile pentru Cont - Notificari vor fi disponibile într-o actualizare viitoare.</p>
      </div>
    </div>
  );
}