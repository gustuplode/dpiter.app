export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F4F4F7] dark:bg-[#1a1a1d]">
      <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-4 justify-between border-b border-[#E5E7EB] dark:border-[#4a4a50]">
        <div className="w-10" />
        <h1 className="text-xl font-bold">Analytics</h1>
        <div className="w-10" />
      </header>

      <main className="container mx-auto max-w-4xl p-4 space-y-6">
        <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-6 shadow animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-4" />
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-24" />
        </div>

        <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-6 shadow animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-6 shadow animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-40 mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </main>

      {/* Replaced skeleton with simple spinner for consistency */}
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-[#8A3224]/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-[#8A3224] rounded-full animate-spin" />
          </div>
        </div>
      </div>
    </div>
  )
}
