export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Logo placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <span className="text-white font-bold text-3xl tracking-tight">TM</span>
          </div>
        </div>

        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          tur<span className="text-blue-400">-</span>meet
        </h1>

        <p className="text-blue-200 text-lg mb-2 font-medium">
          MICE Booking Platform
        </p>

        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-8" />

        <p className="text-slate-400 text-base mb-10">
          Meetings · Incentives · Conferences · Exhibitions
        </p>

        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-slate-300 text-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          Yapım Aşamasında · Coming Soon
        </div>

        <p className="mt-12 text-slate-600 text-xs">
          © {new Date().getFullYear()} tur-meet.com — All rights reserved
        </p>
      </div>
    </main>
  );
}
