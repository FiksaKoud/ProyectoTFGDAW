import { DashboardNav } from "@/components/layout/DashboardNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col gap-6 px-4 pb-24 pt-6 sm:px-6 md:flex-row md:pb-6">
      <aside className="md:w-52 md:shrink-0">
        <DashboardNav />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
