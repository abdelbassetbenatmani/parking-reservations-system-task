import AdminAuditLog from "@/components/AdminAuditLog";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AdminAuditLog />
    </div>
  );
}