"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ParkingCircle,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/employees",
    label: "Employees",
    icon: Users,
  },
  {
    href: "/admin/parking-state",
    label: "Parking State",
    icon: ParkingCircle,
  },
  {
    href: "/admin/control-panel",
    label: "Control Panel",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ParkingAdmin
                </h1>
                <p className="text-xs text-gray-500">Management Portal</p>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* User Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Button
                onClick={handleLogout}
                variant={"ghost"}
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                <span className="hidden sm:inline text-sm font-medium">
                  Logout
                </span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto py-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
