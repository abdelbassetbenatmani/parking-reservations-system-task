"use client";
import { useEffect, useState } from "react";
import { getEmployees, createEmployee } from "@/services/api";
import { Input, InputWrapper } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  User,
  Shield,
  Loader2,
  Eye,
  EyeOff,
  Crown,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

type Employee = {
  id: string;
  username: string;
  role: "employee" | "admin";
  createdAt?: string;
};

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function fetchEmployees() {
      setFetchLoading(true);
      try {
        const data = await getEmployees();
        setEmployees(data);
        setError("");
      } catch (err: any) {
        // Handle API endpoint not found error with helpful message
        if (
          err.message?.includes("404") ||
          err.message?.includes("Not Found")
        ) {
          setError(
            "⚠️ Backend API endpoint '/admin/users' is not implemented yet. Please check the backend documentation or contact the development team."
          );
        } else {
          setError(err.message || "Failed to load employees");
        }
      } finally {
        setFetchLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  async function handleCreate() {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await createEmployee({ username, password, role });
      setUsername("");
      setPassword("");
      setRole("employee");
      const data = await getEmployees();
      setEmployees(data);
    } catch (err: any) {
      if (err.message?.includes("404") || err.message?.includes("Not Found")) {
        setError(
          "⚠️ Backend API endpoint '/admin/users' is not implemented yet. Please implement the users management endpoints in the backend."
        );
      } else {
        setError(err.message || "Failed to create employee");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Employee Management
        </h2>
      </motion.div>

      {/* Create Employee Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Add New Employee
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <InputWrapper>
            <User />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </InputWrapper>

          {/* <div className="relative">
            <Input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 h-11"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div> */}

          <InputWrapper className="relative">
            <User />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform  text-gray-400 hover:text-gray-600"
              style={{ transform: "translateY(-50%)" }}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </InputWrapper>

          <Select value={role} onValueChange={setRole} disabled={loading}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Employee
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Admin
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleCreate}
            disabled={loading || !username.trim() || !password.trim()}
            variant={"primary"}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Employee
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-1">Error</h4>
              <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded border border-red-200">
                <strong>Developer Note:</strong> Implement the following
                endpoints in the backend to enable full functionality:
                <ul className="mt-1 list-disc list-inside">
                  <li>
                    <code>GET /api/v1/admin/users</code> - Get all employees
                  </li>
                  <li>
                    <code>POST /api/v1/admin/users</code> - Create new employee
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employees Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Current Employees
            </h3>
            {!fetchLoading && (
              <span className="ml-auto bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {employees.length}{" "}
                {employees.length === 1 ? "employee" : "employees"}
              </span>
            )}
          </div>
        </div>

        {fetchLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading employees...</span>
            </div>
          </div>
        ) : employees.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No employees found</p>
              <p className="text-gray-400 text-sm">
                Create your first employee above
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Role
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {employees.map((emp, index) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {emp.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {emp.username}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          emp.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {emp.role === "admin" ? (
                          <Crown className="w-3 h-3" />
                        ) : (
                          <UserCheck className="w-3 h-3" />
                        )}
                        {emp.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Active
                      </span>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </motion.div>
    </motion.div>
  );
}
