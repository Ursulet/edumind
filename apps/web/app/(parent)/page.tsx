import { Button, Card, CardContent, CardHeader, CardTitle } from "@educariera/ui";

export const metadata = {
  title: "Dashboard - Portal Părinți",
};

export default function ParentDashboard() {
  return (
    <div className="flex-1 w-full bg-ivory-background py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        
        {/* Context Header */}
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-primary-ink">
              Bun venit, Ion!
            </h1>
            <p className="text-sm text-primary-text">
              Portal activ pentru <strong>Andrei Popescu</strong> (Clasa a 10-a)
            </p>
          </div>
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sage-surface text-forest-accent border border-border">
              Stadiu: Evaluare Inițială
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Dominant Next Action Card */}
            <Card className="border-l-4 border-l-forest-accent bg-warm-surface shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
              <CardContent className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 text-forest-accent mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span className="text-sm font-bold uppercase tracking-wider">Acțiune Necesară</span>
                </div>
                <h2 className="text-2xl font-bold text-primary-ink">
                  Completează Chestionarul Inițial
                </h2>
                <p className="text-primary-text leading-relaxed">
                  Pentru a putea aloca un specialist potrivit, te rugăm să completezi chestionarul de interese și aptitudini al copilului tău. Acesta durează aproximativ 15 minute.
                </p>
                <div className="pt-4">
                  <Button className="bg-forest-accent text-warm-surface hover:bg-forest-hover" size="lg">
                    Începe Evaluarea
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Journey Stepper */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-ink">Parcurs Educațional</h3>
              <div className="bg-warm-surface border border-border rounded-xl p-6">
                <div className="flex justify-between relative">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-border -z-10" />
                  
                  {/* Step 1: Completed */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-forest-accent text-warm-surface flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-xs font-medium text-primary-ink">Înscriere</span>
                  </div>

                  {/* Step 2: Active */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-sage-surface border-2 border-forest-accent text-forest-accent flex items-center justify-center font-bold">
                      2
                    </div>
                    <span className="text-xs font-medium text-forest-accent">Evaluare</span>
                  </div>

                  {/* Step 3: Upcoming */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted-surface border border-border text-muted-text flex items-center justify-center font-bold">
                      3
                    </div>
                    <span className="text-xs font-medium text-muted-text">Consiliere</span>
                  </div>

                  {/* Step 4: Upcoming */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted-surface border border-border text-muted-text flex items-center justify-center font-bold">
                      4
                    </div>
                    <span className="text-xs font-medium text-muted-text">Plan</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Upcoming Session */}
            <Card className="bg-warm-surface border-border">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-semibold">Următoarea Ședință</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-center">
                <p className="text-sm text-muted-text mb-4">Nicio ședință programată momentan.</p>
                <Button variant="outline" className="w-full text-xs">Solicită Programare</Button>
              </CardContent>
            </Card>

            {/* Reports */}
            <Card className="bg-warm-surface border-border">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-semibold">Documente & Rapoarte</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted-surface cursor-pointer border border-transparent hover:border-border transition-all">
                  <span className="text-sm text-primary-text flex items-center gap-2">
                    <svg className="w-4 h-4 text-muted-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Acord GDPR
                  </span>
                  <span className="text-xs text-muted-text">PDF</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
