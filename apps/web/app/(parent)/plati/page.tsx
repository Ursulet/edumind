import { prisma } from "@/lib/db";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@educariera/ui";

export const metadata = {
  title: "Plăți și Facturi - Portal Părinți",
};

export default async function ParentPaymentsPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      payments: true,
      child: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex-1 w-full bg-ivory-background py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-primary-ink">
              Plăți și Facturi
            </h1>
            <p className="text-sm text-primary-text">
              Istoricul comenzilor și tranzacțiilor pentru familia ta.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card className="bg-warm-surface border-border">
              <CardContent className="p-8 text-center text-muted-text">
                Nu există tranzacții înregistrate.
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => {
              const latestPayment = order.payments[order.payments.length - 1];
              return (
                <Card key={order.id} className="bg-warm-surface border-border shadow-sm">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        {order.status === "PAID" ? (
                          <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            Plătit
                          </span>
                        ) : order.status === "PENDING" ? (
                          <span className="bg-warning/10 text-warning px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            În Așteptare
                          </span>
                        ) : (
                          <span className="bg-muted-surface text-muted-text px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            {order.status}
                          </span>
                        )}
                        <span className="text-xs text-muted-text font-mono">
                          ID: {order.publicId}
                        </span>
                        <span className="text-xs text-muted-text">
                          {new Date(order.createdAt).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-primary-ink">
                        {order.items[0]?.snapshotName || "Pachet Consiliere"}
                      </h3>
                      <p className="text-sm text-primary-text">
                        Elev: <strong>{order.child?.firstName || "Nespecificat"}</strong>
                      </p>
                    </div>

                    <div className="text-left md:text-right space-y-1">
                      <div className="text-2xl font-bold text-primary-ink">
                        {order.totalAmount.toString()} {order.currency}
                      </div>
                      {latestPayment?.provider === "MANUAL_BANK_TRANSFER" && (
                        <div className="text-xs text-muted-text">Transfer Bancar</div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                      {order.status === "PENDING" && (
                        <Button className="bg-forest-accent text-warm-surface hover:bg-forest-hover w-full sm:w-auto">
                          Plătește Acum
                        </Button>
                      )}
                      {order.status === "PAID" && (
                        <Button variant="outline" className="w-full sm:w-auto">
                          Descarcă Factură
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
    </div>
  );
}
