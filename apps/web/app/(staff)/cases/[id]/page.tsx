import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { CaseDetailWorkspace } from "@/components/cases/CaseDetailWorkspace";

export const dynamic = "force-dynamic";

const API = process.env.INTERNAL_API_URL || "http://api:4000";

async function fetchWithAuth(path: string, headers: Record<string, string>) {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { ...headers, "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function StaffCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  if (!["SPECIALIST", "DEPARTMENT_ADMIN", "SUPER_ADMIN", "PLATFORM_OWNER"].includes(user.role)) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const authHeaders = await getAuthHeaders();

  const [careerCase, catalogProducts] = await Promise.all([
    fetchWithAuth(`/api/v1/cases/${id}`, authHeaders),
    fetchWithAuth(`/api/v1/catalog`, authHeaders),
  ]);

  if (!careerCase) return notFound();

  const backHref = user.role === "DEPARTMENT_ADMIN" ? "/director/cases/all" : "/specialist/work/cases";

  return (
    <CaseDetailWorkspace
      careerCase={careerCase}
      userRole={user.role}
      catalogProducts={Array.isArray(catalogProducts) ? catalogProducts : []}
      backHref={backHref}
    />
  );
}
