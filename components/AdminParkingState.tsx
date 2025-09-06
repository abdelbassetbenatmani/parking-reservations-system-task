"use client";
import { useEffect, useState } from "react";
import { getParkingState } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  ParkingCircle,
  Car,
  Users,
  UserCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Loader2,
  MapPin,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

type Zone = {
  id: string;
  name: string;
  occupied: number;
  free: number;
  reserved: number;
  availableForVisitors: number;
  availableForSubscribers: number;
  subscriberCount: number;
  open: boolean;
  capacity?: number;
};

export default function AdminParkingState() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = Cookies.get("token") || "";

  const fetchState = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError("");
    
    try {
      const data = await getParkingState(token);
      setZones(data);
    } catch (err: any) {
      setError(err.message || "Failed to load parking state");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, [token]);

  const getOccupancyRate = (zone: Zone) => {
    const total = zone.capacity || (zone.occupied + zone.free);
    return total > 0 ? Math.round((zone.occupied / total) * 100) : 0;
  };

  const getOccupancyBadgeVariant = (rate: number): "success" | "warning" | "destructive" => {
    if (rate >= 90) return "destructive";
    if (rate >= 70) return "warning";
    return "success";
  };

  const getStatusBadge = (isOpen: boolean) => {
    return isOpen ? (
      <Badge variant="success" appearance="light" className="gap-1">
        <CheckCircle className="w-3 h-3" />
        Open
      </Badge>
    ) : (
      <Badge variant="destructive" appearance="light" className="gap-1">
        <XCircle className="w-3 h-3" />
        Closed
      </Badge>
    );
  };

  const getTotalStats = () => {
    return zones.reduce((acc, zone) => ({
      totalOccupied: acc.totalOccupied + zone.occupied,
      totalFree: acc.totalFree + zone.free,
      totalVisitors: acc.totalVisitors + zone.availableForVisitors,
      totalSubscribers: acc.totalSubscribers + zone.subscriberCount,
    }), { totalOccupied: 0, totalFree: 0, totalVisitors: 0, totalSubscribers: 0 });
  };

  const stats = getTotalStats();

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
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Parking State</h2>
            <p className="text-gray-500 text-sm">Real-time parking zone overview</p>
          </div>
        </div>
        
        <Button
          onClick={() => fetchState(true)}
          disabled={refreshing}
          variant="outline"
          className="h-10"
        >
          {refreshing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-red-600 mb-1">
            <Car className="w-4 h-4" />
            <span className="text-sm font-medium">Occupied</span>
          </div>
          <div className="text-2xl font-bold text-red-700">{stats.totalOccupied}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <ParkingCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Available</span>
          </div>
          <div className="text-2xl font-bold text-green-700">{stats.totalFree}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Visitors</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{stats.totalVisitors}</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <UserCheck className="w-4 h-4" />
            <span className="text-sm font-medium">Subscribers</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">{stats.totalSubscribers}</div>
        </div>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-1">Error</h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parking Zones Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Zone Details</h3>
            <Badge variant="primary" appearance="light" className="ml-auto">
              {zones.length} {zones.length === 1 ? 'zone' : 'zones'}
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading parking state...</span>
            </div>
          </div>
        ) : zones.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <ParkingCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No parking zones found</p>
              <p className="text-gray-400 text-sm">Check your configuration</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Zone
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4" />
                    Occupancy
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Car className="w-4 h-4" />
                    Occupied
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-center">
                  <div className="flex items-center justify-center gap-2">
                    <ParkingCircle className="w-4 h-4" />
                    Free
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-center">Reserved</TableHead>
                <TableHead className="font-semibold text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Visitors
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-center">
                  <div className="flex items-center justify-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Subscribers
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {zones.map((zone, index) => {
                  const occupancyRate = getOccupancyRate(zone);
                  
                  return (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {zone.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {zone.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={getOccupancyBadgeVariant(occupancyRate)} 
                          appearance="light" 
                          className="gap-1"
                        >
                          <Activity className="w-3 h-3" />
                          {occupancyRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive" appearance="light">
                          {zone.occupied}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="success" appearance="light">
                          {zone.free}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="warning" appearance="light">
                          {zone.reserved}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="primary" appearance="light">
                          {zone.availableForVisitors}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="info" appearance="light">
                          {zone.subscriberCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(zone.open)}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </motion.div>
    </motion.div>
  );
}