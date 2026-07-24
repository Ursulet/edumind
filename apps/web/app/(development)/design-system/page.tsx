import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Label, Badge } from "@edumind/ui";

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto p-8 space-y-12 pb-20">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight text-primary-ink">Design System</h1>
        <p className="text-muted-text">EduCarieră Component Library and Design Tokens</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-border pb-2">Typography</h2>
        <div className="space-y-6">
          <div>
            <span className="text-xs text-muted-text uppercase font-semibold">Hero Heading</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-primary-text">The quick brown fox jumps</h1>
          </div>
          <div>
            <span className="text-xs text-muted-text uppercase font-semibold">Section Heading</span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary-text">The quick brown fox jumps</h2>
          </div>
          <div>
            <span className="text-xs text-muted-text uppercase font-semibold">Dashboard Heading</span>
            <h3 className="text-2xl font-semibold tracking-tight text-primary-text">The quick brown fox jumps</h3>
          </div>
          <div>
            <span className="text-xs text-muted-text uppercase font-semibold">Body</span>
            <p className="text-[15px] leading-6 text-primary-text">The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-border pb-2">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Primary Ink", var: "bg-primary-ink" },
            { name: "Deep Graphite", var: "bg-deep-graphite" },
            { name: "Primary Text", var: "bg-primary-text" },
            { name: "Forest Accent", var: "bg-forest-accent" },
            { name: "Forest Hover", var: "bg-forest-hover" },
            { name: "Soft Sage", var: "bg-soft-sage" },
            { name: "Sage Surface", var: "bg-sage-surface", border: true },
            { name: "Ivory Background", var: "bg-ivory-background", border: true },
            { name: "Warm Surface", var: "bg-warm-surface", border: true },
            { name: "Muted Surface", var: "bg-muted-surface" },
            { name: "Border", var: "bg-border" },
            { name: "Muted Text", var: "bg-muted-text" },
            { name: "Success", var: "bg-success" },
            { name: "Warning", var: "bg-warning" },
            { name: "Danger", var: "bg-danger" },
            { name: "Info Neutral", var: "bg-info-neutral" },
            { name: "Premium Accent", var: "bg-premium-accent" },
          ].map((color) => (
            <div key={color.name} className="flex flex-col space-y-1">
              <div className={`h-16 rounded-md ${color.var} ${color.border ? 'border border-border' : ''}`}></div>
              <span className="text-sm font-medium">{color.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-border pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="default">Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
          <Button variant="danger">Danger Button</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <span className="sr-only">Icon</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8 4.5V7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H8V10.5C8 10.7761 7.77614 11 7.5 11C7.22386 11 7 10.7761 7 10.5V8H4.5C4.22386 8 4 7.77614 4 7.5C4 7.22386 4.22386 7 4.5 7H7V4.5C7 4.22386 7.22386 4 7.5 4C7.77614 4 8 4.22386 8 4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-border pb-2">Inputs & Form Controls</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled">Disabled Input</Label>
            <Input id="disabled" disabled placeholder="Not editable" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-border pb-2">Badges</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b border-border pb-2">Cards</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Orientation</CardTitle>
              <CardDescription>Start your journey to discover the best career path.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary-text">Complete the initial assessment to unlock personalized recommendations based on your skills and interests.</p>
            </CardContent>
            <CardFooter>
              <Button>Start Assessment</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

    </div>
  );
}

