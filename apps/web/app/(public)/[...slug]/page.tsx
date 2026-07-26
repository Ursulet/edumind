import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/cms/SectionRenderer";

export const dynamic = "force-dynamic";

export default async function DynamicCmsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  if (!slug || slug.length === 0) return notFound();
  
  const path = `/${slug.join("/")}`;

  try {
    const page = await prisma.cmsPage.findUnique({
      where: { slug: path },
      include: { sections: { orderBy: { order: "asc" } } },
    });

    if (!page || page.status !== "PUBLISHED") {
      return notFound();
    }

    return (
      <main className="flex-1 w-full">
        {page.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>
    );
  } catch {
    return notFound();
  }
}

export const generateMetadata = async ({ params }: { params: Promise<{ slug?: string[] }> }) => {
  const { slug } = await params;
  if (!slug || slug.length === 0) return { title: "EduCarieră" };

  const path = `/${slug.join("/")}`;

  try {
    const page = await prisma.cmsPage.findUnique({
      where: { slug: path },
      include: { seo: true },
    });

    if (!page || !page.seo) return { title: "EduCarieră" };

    return {
      title: page.seo.title,
      description: page.seo.description,
    };
  } catch {
    return { title: "EduCarieră" };
  }
};
