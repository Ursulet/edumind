import { prisma } from "@/lib/db";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@edumind/ui";
import { notFound } from "next/navigation";

export default async function CmsPageEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let page = null;
  if (id !== "new") {
    page = await prisma.cmsPage.findUnique({
      where: { id },
      include: { seo: true, sections: { orderBy: { order: 'asc' } } },
    });
    if (!page) return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary-ink">
          {page ? `Edit: ${page.title}` : "New Page"}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button variant="default">Publish</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Internal Title</Label>
                <Input id="title" defaultValue={page?.title} placeholder="e.g. Homepage" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" defaultValue={page?.slug} placeholder="e.g. /" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {page?.sections.length === 0 ? (
                <div className="text-sm text-muted-text text-center py-4">No sections added yet.</div>
              ) : (
                <div className="space-y-2">
                  {page?.sections.map((section) => (
                    <div key={section.id} className="p-3 border border-border rounded-lg bg-muted-surface flex justify-between items-center">
                      <span className="font-medium text-sm">{section.type}</span>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full">Add Section</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo-title">Meta Title</Label>
                <Input id="seo-title" defaultValue={page?.seo?.title || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-desc">Meta Description</Label>
                <Input id="seo-desc" defaultValue={page?.seo?.description || ""} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
