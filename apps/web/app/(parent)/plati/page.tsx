export const dynamic = "force-dynamic";

import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@edumind/ui";

export const metadata = {
  title: "Plăți și Facturi - Portal Părinți",
};

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

export default async function ParentPaymentsPage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  const authHeaders = await getAuthHeaders();

  // Fetch orders scoped to the authenticated user via the API
  // The API /orders endpoint filters by organizationId from the JWT token
  const orders = await fetchWithAuth(`/api/v1/orders`, authHeaders) ?? [];

  const orderList = Array.isArray(orders) ? orders : [];

  return (
    <div className="flex-1 w-full bg-ivory-background py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">

        <div className="flex items-start justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-primary-ink">
              Plăți și Facturi
            </h1>
            <p className="text-sm text-muted-text">
              Istoricul comenzilor și tranzacțiilor pentru familia ta.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {orderList.length === 0 ? (
            <Card className="bg-warm-surface border-border">
              <CardContent className="p-8 text-center text-muted-text">
                Nu există tranzacții înregistrate pentru familia ta.
              </CardContent>
            </Card>
          ) : (
            orderList.map((order: any) => {
              const latestPayment = order.payments?.[order.payments.length - 1];
              return (
                <Card key={order.id} className="bg-warm-surface border-border shadow-sm">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        {order.status === "PAID" ? (
                          <span className="bg-[#EDF4F0] text-[#2F7A55] px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            Plătit
                          </span>
                        ) : order.status === "PENDING" ? (
                          <span className="bg-[#FEF3C7] text-[#B7791F] px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            În Așteptare
                          </span>
                        ) : (
                          <span className="bg-[#F1EEE7] text-[#6B746F] px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            {order.status}
                          </span>
                        )}
                        <span className="text-xs text-muted-text font-mono">
                          ID: {order.publicId || order.id?.slice(0, 8)}
                        </span>
                        <span className="text-xs text-muted-text">
                          {new Date(order.createdAt).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-primary-ink">
                        {order.items?.[0]?.snapshotName || "Pachet Consiliere"}
                      </h3>
                      {order.child?.firstName && (
                        <p className="text-sm text-muted-text">
                          Elev: <strong className="text-primary-ink">{order.child.firstName}</strong>
                        </p>
                      )}
                    </div>

                    <div className="text-left md:text-right space-y-1">
                      <div className="text-2xl font-bold text-primary-ink">
                        {order.totalAmount?.toString()} {order.currency}
                      </div>
                      {latestPayment?.provider === "MANUAL_BANK_TRANSFER" && (
                        <div className="text-xs text-muted-text">Transfer Bancar</div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      {order.status === "PENDING" && (
                        <div className="text-sm text-center text-[#6B746F] border border-[#E3DED3] p-3 rounded bg-[#F7F5F0] w-full">
                          Plata online — în curând disponibilă
                        </div>
                      )}
                      {order.status === "PAID" && (
                        <div className="text-sm text-center text-[#6B746F] border border-[#E3DED3] p-3 rounded bg-[#F7F5F0] w-full">
                          Factură — în curând disponibilă
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
