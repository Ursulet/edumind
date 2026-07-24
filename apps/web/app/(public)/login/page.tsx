import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@EduMind/ui";
import Link from "next/link";

export const metadata = {
  title: "Autentificare | Edu-Cariera",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-ivory-background flex items-center justify-center p-4">
      
      <Card className="w-full max-w-md bg-white border-border shadow-xl">
        <CardHeader className="space-y-2 pb-6 border-b border-border">
          <div className="flex justify-center mb-4">
             <div className="w-12 h-12 rounded bg-forest-accent flex items-center justify-center">
              <svg className="w-7 h-7 text-warm-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold text-primary-ink">
            Bine ai revenit
          </CardTitle>
          <p className="text-center text-sm text-primary-text">
            Introdu datele pentru a accesa contul tÄƒu
          </p>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nume@email.com" 
                className="w-full bg-warm-surface"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">ParolÄƒ</Label>
                <Link href="#" className="text-xs font-medium text-forest-accent hover:underline">
                  Ai uitat parola?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                className="w-full bg-warm-surface"
              />
            </div>
          </div>

          {/* Quick Mock Routing Buttons for Demonstration */}
          <div className="pt-2 flex flex-col gap-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-forest-accent text-warm-surface hover:bg-forest-hover">
                Autentificare (PÄƒrinte)
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link href="/specialist">
                <Button variant="outline" className="w-full text-xs h-9 border-border text-primary-ink hover:bg-muted-surface">
                  Login Specialist
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" className="w-full text-xs h-9 border-border text-primary-ink hover:bg-muted-surface">
                  Login Admin
                </Button>
              </Link>
            </div>
          </div>
          
        </CardContent>
        
        <div className="bg-muted-surface/30 px-6 py-4 border-t border-border text-center">
          <p className="text-sm text-muted-text">
            Nu ai cont?{" "}
            <Link href="/inscriere" className="font-semibold text-forest-accent hover:underline">
              CreeazÄƒ unul acum
            </Link>
          </p>
        </div>
      </Card>
      
    </div>
  );
}
