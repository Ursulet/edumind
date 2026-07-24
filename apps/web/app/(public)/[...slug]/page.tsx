import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/cms/SectionRenderer";

export default async function DynamicCmsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const path = slug ? `/${slug.join("/")}` : "/";

  const page = await prisma.cmsPage.findUnique({
    where: { slug: path },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  // If no page is found in DB, return 404
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
}

// Temporary fallback for root if [...slug] doesn't catch it
export const generateMetadata = async ({ params }: { params: Promise<{ slug?: string[] }> }) => {
  const { slug } = await params;
  const path = slug ? `/${slug.join("/")}` : "/";
  
  const page = await prisma.cmsPage.findUnique({
    where: { slug: path },
    include: { seo: true },
  });

  if (!page || !page.seo) return { title: "EduCarieră" };

  return {
    title: page.seo.title,
    description: page.seo.description,
  };
};
