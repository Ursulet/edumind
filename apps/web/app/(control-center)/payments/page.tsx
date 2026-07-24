import { prisma } from "@/lib/db";
import { Button, Card, CardContent } from "@educariera/ui";

export const metadata = {
  title: "Încasări și Plăți - Control Center",
};

export default async function AdminPaymentsPage() {
  const orders = await prisma.order.findMany({
    include: {
      payments: true,
      family: { include: { parents: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Încasări și Plăți</h1>
          <p className="text-sm text-muted-text">Jurnalul tuturor tranzacțiilor financiare din platformă.</p>
        </div>
        <Button variant="outline">
          Înregistrează Plată Manuală
        </Button>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card className="bg-warm-surface border-border">
            <CardContent className="p-8 text-center text-muted-text">
              Nu există comenzi înregistrate.
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => {
            const parent = order.family?.parents[0];
            return (
              <Card key={order.id} className="bg-warm-surface border-border shadow-sm">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {order.status === "PAID" ? (
                        <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-success/20">
                          {order.status}
                        </span>
                      ) : (
                        <span className="bg-warning/10 text-warning px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-warning/20">
                          {order.status}
                        </span>
                      )}
                      <span className="text-xs font-mono text-muted-text">
                        {order.publicId}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-primary-ink">
                      {order.totalAmount.toString()} {order.currency}
                    </h3>
                    <p className="text-sm text-primary-text">
                      Familie: <strong>{parent?.relationship || "Părinte"} (ID: {order.family?.publicId})</strong>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {order.status === "PENDING" && (
                      <Button variant="outline" className="w-full sm:w-auto">Aprobă Bancar</Button>
                    )}
                    {order.status === "PAID" && (
                      <Button variant="outline" className="text-danger hover:bg-danger/10 hover:text-danger w-full sm:w-auto border-danger/30">
                        Refund
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
