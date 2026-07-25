export const metadata = {
  title: "Resetare Parolă - EduMind",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F5F0] p-4 font-sans">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E3DED3] p-8">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#2F6B57] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#2F6B57]/20">
            EM
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-[#1F2622] text-center mb-2 tracking-tight">
          Resetare Parolă
        </h1>
        <p className="text-[#6B746F] text-center text-sm mb-8">
          Introdu adresa de email pentru a primi instrucțiunile de resetare a parolei.
        </p>

        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#1F2622] block">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full rounded-xl border border-[#E3DED3] bg-white px-4 py-3 text-[#1F2622] transition-colors focus:border-[#2F6B57] focus:outline-none focus:ring-1 focus:ring-[#2F6B57] placeholder:text-[#A0ABA5]"
              placeholder="nume@exemplu.ro"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#2F6B57] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#275B4A] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2F6B57] focus:ring-offset-2 mt-2"
          >
            Trimite Instrucțiuni
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm font-semibold text-[#2F6B57] hover:text-[#275B4A] transition-colors">
            Înapoi la Autentificare
          </a>
        </div>
      </div>
    </div>
  );
}
