import { RegistrationWizard } from "@/components/registration/RegistrationWizard";

export const metadata = {
  title: "Înscriere - EduCarieră",
  description: "Începe călătoria educațională a copilului tău.",
};

export default function RegistrationPage() {
  return (
    <div className="flex-1 w-full bg-ivory-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-ink">
            Aplicație de Evaluare
          </h1>
          <p className="text-lg text-primary-text/80">
            Completează detaliile de mai jos pentru a începe parcursul de consiliere. Un specialist va prelua cazul tău în scurt timp.
          </p>
        </div>
        
        <RegistrationWizard />
      </div>
    </div>
  );
}
