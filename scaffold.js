const fs = require('fs'); 
const path = require('path'); 
const folders = ['applications/new', 'applications/review', 'applications/more-info', 'applications/completed', 'cases/all', 'cases/unassigned', 'cases/by-stage', 'cases/overdue', 'cases/reassignment', 'team/specialists', 'team/workload', 'team/calendar', 'team/availability', 'sessions/today', 'sessions/upcoming', 'sessions/cancelled', 'reporting/operational', 'reporting/department', 'account/profile', 'account/security', 'account/password', 'account/sessions', 'account/deactivate']; 

folders.forEach(f => { 
  const dir = path.join('apps/web/app/(staff)/director', f); 
  fs.mkdirSync(dir, {recursive: true}); 
  const title = f.split('/').map(w => w.charAt(0).toUpperCase() + w.slice(1).replace('-', ' ')).join(' '); 
  
  const content = `import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getUserFromToken();
  if (!user) redirect('/login');
  if (!['DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'PLATFORM_OWNER'].includes(user.role)) redirect('/dashboard');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#1F2622]">${title}</h1>
        <p className="text-[13px] text-[#6B746F]">This section is currently under development.</p>
      </div>
      <div className="bg-white border border-[#E3DED3] rounded-xl p-8 shadow-sm text-center">
        <h2 className="text-lg font-bold text-[#1F2622]">Coming Soon</h2>
        <p className="text-sm text-[#6B746F] mt-2">The detailed screens for ${title} will be implemented in a future iteration.</p>
      </div>
    </div>
  );
}`;
  
  fs.writeFileSync(path.join(dir, 'page.tsx'), content, 'utf8'); 
});
console.log("Done");
