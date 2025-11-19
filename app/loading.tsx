export default function Loading() {
  return (
    <div className="flex-1 flex min-h-[50vh] w-full items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </div>
  )
}
