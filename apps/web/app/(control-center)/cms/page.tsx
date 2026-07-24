import { prisma } from "@/lib/db";
import { Button } from "@educariera/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CmsPageList() {
  const pages = await prisma.cmsPage.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { seo: true },
  }).catch(() => []);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary-ink">Pages</h1>
        <Button asChild>
          <Link href="/cms/new">Create Page</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-warm-surface shadow-[0_1px_2px_rgba(31,38,34,0.05)] overflow-hidden">
        <table className="w-full text-left text-sm text-primary-text">
          <thead className="bg-muted-surface border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-text">
                  No pages found.
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={page.id} className="hover:bg-muted-surface/50">
                  <td className="px-4 py-3 font-medium">{page.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-text">{page.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      page.status === 'PUBLISHED' ? 'bg-success/10 text-success' : 'bg-muted-surface text-muted-text'
                    }`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/cms/${page.id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
