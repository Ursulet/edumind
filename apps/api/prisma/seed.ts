import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const PERMISSIONS = [
  // Organization
  { action: 'organization.read', namespace: 'organization', description: 'Read organization details' },
  { action: 'organization.manage', namespace: 'organization', description: 'Manage organization settings' },

  // User
  { action: 'user.read', namespace: 'user', description: 'Read users' },
  { action: 'user.manage', namespace: 'user', description: 'Manage users' },

  // Role & Permissions
  { action: 'role.read', namespace: 'role', description: 'Read roles' },
  { action: 'role.manage', namespace: 'role', description: 'Manage roles and permissions' },

  // Case & Applications
  { action: 'case.read.own', namespace: 'case', description: 'Read own family career cases' },
  { action: 'case.read.assigned', namespace: 'case', description: 'Read assigned specialist cases' },
  { action: 'case.read.department', namespace: 'case', description: 'Read department cases' },
  { action: 'case.read.all', namespace: 'case', description: 'Read all cases in organization' },
  { action: 'case.create', namespace: 'case', description: 'Create career case' },
  { action: 'case.assign', namespace: 'case', description: 'Assign specialist to case' },
  { action: 'case.close', namespace: 'case', description: 'Close career case' },

  // Application
  { action: 'application.create', namespace: 'application', description: 'Submit new application' },
  { action: 'application.review', namespace: 'application', description: 'Review & approve applications' },

  // Assessment & Reports
  { action: 'assessment.read', namespace: 'assessment', description: 'View assessment details' },
  { action: 'assessment.manage', namespace: 'assessment', description: 'Assign or manage external assessments' },
  { action: 'report.read', namespace: 'report', description: 'Read published reports' },
  { action: 'report.manage', namespace: 'report', description: 'Create & publish specialist reports' },

  // Sessions & Scheduling
  { action: 'session.read', namespace: 'session', description: 'Read session details' },
  { action: 'session.create', namespace: 'session', description: 'Book counseling sessions' },
  { action: 'session.manage', namespace: 'session', description: 'Manage and update sessions' },
  { action: 'session_note.internal.read', namespace: 'session_note', description: 'Read internal specialist notes' },
  { action: 'session_note.internal.write', namespace: 'session_note', description: 'Write internal specialist notes' },

  // Catalog & Payments
  { action: 'product.read', namespace: 'product', description: 'View catalog products' },
  { action: 'product.manage', namespace: 'product', description: 'Manage product catalog and versions' },
  { action: 'payment.read', namespace: 'payment', description: 'View payment history' },
  { action: 'payment.manage', namespace: 'payment', description: 'Manage payments & manual overrides' },

  // Audit & CMS
  { action: 'audit.read', namespace: 'audit', description: 'Read system audit logs' },
  { action: 'cms.read', namespace: 'cms', description: 'Read CMS content' },
  { action: 'cms.publish', namespace: 'cms', description: 'Publish CMS content' },
  { action: 'system.manage', namespace: 'system', description: 'Full platform management' },
];

async function main() {
  console.info('ðŸŒ± Seeding EduCarierÄƒ database...');

  // 1. Create Organization (FNPE)
  const fnpeOrg = await prisma.organization.upsert({
    where: { slug: 'fnpe' },
    update: {},
    create: {
      name: 'FundaÈ›ia NaÈ›ionalÄƒ pentru Planificarea EducaÈ›iei (FNPE)',
      slug: 'fnpe',
      defaultLocale: 'ro-RO',
      timezone: 'Europe/Bucharest',
      status: 'ACTIVE',
    },
  });
  console.info(`âœ… Created Organization: ${fnpeOrg.name}`);

  // 2. Create Permissions
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { action: perm.action },
      update: { description: perm.description },
      create: perm,
    });
  }
  console.info(`âœ… Seeded ${PERMISSIONS.length} granular permissions.`);

  // 3. Create Roles
  const roles = [
    { name: 'PLATFORM_OWNER', description: 'Technical Platform Owner master access' },
    { name: 'SUPER_ADMIN', description: 'FNPE Executive Management' },
    { name: 'DEPARTMENT_ADMIN', description: 'Director / Department Leader' },
    { name: 'SPECIALIST', description: 'Psychologist / Career Counselor' },
    { name: 'PARENT', description: 'Parent / Family Client' },
  ];

  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: { description: roleData.description },
      create: roleData,
    });
  }
  console.info('âœ… Created conceptual roles.');

  // 4. Assign permissions to Roles
  const allPermissions = await prisma.permission.findMany();
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  const platformOwnerRole = await prisma.role.findUnique({ where: { name: 'PLATFORM_OWNER' } });

  if (superAdminRole && platformOwnerRole) {
    for (const perm of allPermissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: superAdminRole.id, permissionId: perm.id },
      });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: platformOwnerRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: platformOwnerRole.id, permissionId: perm.id },
      });
    }
  }

  // 5. Create Default Super Admin Account
  const defaultPasswordHash = await argon2.hash('AdminPassword123!');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@EduMind.ro' },
    update: {},
    create: {
      email: 'admin@EduMind.ro',
      passwordHash: defaultPasswordHash,
      firstName: 'Super',
      lastName: 'Admin',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId_organizationId: {
          userId: adminUser.id,
          roleId: superAdminRole.id,
          organizationId: fnpeOrg.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: superAdminRole.id,
        organizationId: fnpeOrg.id,
      },
    });
  }

  console.info('âœ… Database seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('âŒ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
