const fs = require('fs');
const path = require('path');

const folders = [
  'parcurs', 'profil-copil', 'evaluare', 'plan-cariera', 
  'sedinte', 'program-activ', 'documente', 
  'cont/profil', 'cont/notificari', 'cont/securitate', 'cont/parola', 'cont/sesiuni', 'cont/ajutor', 'cont/stergere'
];

folders.forEach(f => { 
  const dir = path.join('apps/web/app/(parent)', f); 
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true}); 
  }
  const title = f.split('/').map(w => w.charAt(0).toUpperCase() + w.slice(1).replace('-', ' ')).join(' - '); 
  
  const content = `import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getUserFromToken();
  if (!user) redirect('/login');

  return (
    <div className="w-full py-6 md:py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2622]">${title}</h1>
        <p className="text-[14px] text-[#6B746F] mt-1">Acest ecran este în construcție.</p>
      </div>
      <div className="bg-white border border-[#E3DED3] rounded-2xl p-10 shadow-sm text-center">
        <h2 className="text-[18px] font-bold text-[#1F2622]">În curând</h2>
        <p className="text-[14px] text-[#6B746F] mt-2">Detaliile pentru ${title} vor fi disponibile într-o actualizare viitoare.</p>
      </div>
    </div>
  );
}`;
  
  fs.writeFileSync(path.join(dir, 'page.tsx'), content, 'utf8'); 
});
console.log("Done scaffolding Parent screens");
