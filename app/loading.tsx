export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f6f5] dark:bg-[#23150f]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  )
}
