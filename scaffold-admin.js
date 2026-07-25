const fs = require('fs');
const path = require('path');

const folders = [
  'applications', 'appointments', 'payments', 
  'products', 'product-versions', 'prices', 'offers', 'entitlements', 'recommendations', 'analytics', 
  'workflows', 'workflow-versions', 'session-types', 'appointment-types', 'report-templates', 'notifications', 'email-templates', 
  'parents', 'children', 'specialists', 'directors', 'departments', 'roles-permissions', 
  'integrations', 'feature-flags', 'security', 'health', 'organizations', 
  'profile', 'account-security', 'password', 'active-sessions', 'deactivate'
];

folders.forEach(f => { 
  const dir = path.join('apps/web/app/(control-center)/admin', f); 
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true}); 
  }
  const title = f.split('/').map(w => w.charAt(0).toUpperCase() + w.slice(1).replace('-', ' ')).join(' - '); 
  
  const content = `import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getUserFromToken();
  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'PLATFORM_OWNER')) redirect('/login');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2622]">${title}</h1>
          <p className="text-sm text-[#6B746F]">Administrare modul ${title}</p>
        </div>
      </div>
      <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-10 shadow-sm text-center">
        <h2 className="text-[18px] font-bold text-[#1F2622]">În curând</h2>
        <p className="text-[14px] text-[#6B746F] mt-2">Acest ecran face parte din suita Super Admin și va fi activat într-un build viitor.</p>
      </div>
    </div>
  );
}`;
  
  const filePath = path.join(dir, 'page.tsx');
  if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8'); 
  }
});
console.log("Done scaffolding Admin screens");
