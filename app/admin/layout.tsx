import { AdminNavigation } from "@/components/AdminNavigation";
import { PageWrapper } from "@/components/PageWrapper";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavigation />
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
        <PageWrapper>
          {children}
        </PageWrapper>
      </main>
    </div>
  );
}