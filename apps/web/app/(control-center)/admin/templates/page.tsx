"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea, Badge } from "@EduMind/ui";

// Mock Data
const mockTemplates = [
  {
    id: "tpl-1",
    name: "Confirmare PlatÄƒ Pachete Premium",
    event: "PAYMENT_CONFIRMED",
    subject: "Plata ta pentru {{product.name}} a fost confirmatÄƒ!",
    body: "Salut {{parent.firstName}},\n\nÃŽÈ›i mulÈ›umim pentru achiziÈ›ie. Plata de {{payment.amount}} a fost Ã®nregistratÄƒ.",
    variables: ["parent.firstName", "product.name", "payment.amount"],
    version: 3,
    status: "PUBLISHED"
  },
  {
    id: "tpl-2",
    name: "Reminder È˜edinÈ›Äƒ",
    event: "APPOINTMENT_REMINDER",
    subject: "Reminder: È˜edinÈ›a pentru {{child.firstName}} Ã®ncepe curÃ¢nd",
    body: "Salut,\nAi o È™edinÈ›Äƒ programatÄƒ la {{appointment.time}} pe data de {{appointment.date}} cu consilierul {{specialist.name}}.",
    variables: ["child.firstName", "appointment.time", "appointment.date", "specialist.name"],
    version: 1,
    status: "DRAFT"
  }
];

export default function TemplatesAdminPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof mockTemplates[0] | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Template-uri de Notificare</h1>
          <p className="text-sm text-muted-text">GestioneazÄƒ e-mailurile trimise automat cÄƒtre clienÈ›i</p>
        </div>
        <Button className="bg-forest-accent text-warm-surface hover:bg-forest-hover">
          + Template Nou
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of templates */}
        <div className="lg:col-span-1 space-y-4">
          {mockTemplates.map(tpl => (
            <Card 
              key={tpl.id} 
              className={`cursor-pointer transition-colors hover:border-forest-accent ${selectedTemplate?.id === tpl.id ? 'border-forest-accent bg-sage-surface/10' : 'bg-white border-border'}`}
              onClick={() => setSelectedTemplate(tpl)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-primary-ink text-sm">{tpl.name}</h3>
                  <Badge variant="outline" className={`text-[10px] ${tpl.status === 'PUBLISHED' ? 'text-success border-success' : 'text-muted-text'}`}>
                    v{tpl.version} {tpl.status}
                  </Badge>
                </div>
                <p className="text-xs font-mono text-muted-text">{tpl.event}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column: Editor */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <Card className="bg-white border-border shadow-sm h-full">
              <CardHeader className="border-b border-border bg-ivory-background flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Editare: {selectedTemplate.name}</CardTitle>
                  <p className="text-xs text-muted-text mt-1">
                    Variabile permise: {selectedTemplate.variables.map(v => <span key={v} className="mx-1 font-mono text-forest-accent bg-sage-surface px-1 rounded">{`{{${v}}}`}</span>)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)}>
                    {isPreview ? "ÃŽnapoi la Editor" : "Preview vizual"}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {!isPreview ? (
                  <>
                    <div className="space-y-2">
                      <Label>Subiect E-mail</Label>
                      <Input defaultValue={selectedTemplate.subject} className="font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label>ConÈ›inut (Markdown/Text)</Label>
                      <Textarea 
                        defaultValue={selectedTemplate.body} 
                        className="min-h-[250px] font-mono text-sm leading-relaxed" 
                      />
                    </div>
                    <div className="pt-4 flex justify-between border-t border-border">
                      <Button variant="outline" className="border-border text-primary-ink">
                        Trimite E-mail de Test
                      </Button>
                      <Button className="bg-forest-accent text-warm-surface hover:bg-forest-hover">
                        SalveazÄƒ Noua Versiune (v{selectedTemplate.version + 1})
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6 border border-border p-6 rounded bg-ivory-background/50">
                    <div>
                      <span className="text-xs text-muted-text font-semibold uppercase">Subiect Simulat</span>
                      <p className="text-primary-ink font-medium mt-1">
                        {selectedTemplate.subject.replace(/{{(.*?)}}/g, "[MOCK_VALUE]")}
                      </p>
                    </div>
                    <hr className="border-border" />
                    <div>
                      <span className="text-xs text-muted-text font-semibold uppercase">Corp E-mail Simulat</span>
                      <div className="mt-2 text-primary-text whitespace-pre-wrap">
                        {selectedTemplate.body.replace(/{{(.*?)}}/g, "[MOCK_VALUE]")}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-text border-2 border-dashed border-border rounded-lg bg-warm-surface">
              SelecteazÄƒ un template din stÃ¢nga pentru a-l edita.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
