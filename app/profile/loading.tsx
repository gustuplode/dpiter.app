export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center pb-24">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-[#8A3224]/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-[#8A3224] rounded-full animate-spin" />
      </div>
    </div>
  )
}
