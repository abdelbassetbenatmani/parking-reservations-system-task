"use client";
import { useEffect, useState } from "react";
import { getParkingState, setZoneOpen } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  MapPin,
  Car,
  ParkingCircle,
  Users,
  UserCheck,
  Activity,
} from "lucide-react";
import Cookies from "js-cookie";
import UpdateCategoryRates from "./UpdateCategoryRates";
import AddRushHour from "./AddRushHour";
import AddVacation from "./AddVacation";
import { IParkingState } from "@/services/types";

export default function AdminControlPanel() {
  const [parkingState, setParkingStates] = useState<IParkingState[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
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
      console.log(data);
      
      setParkingStates(data);
    } catch (err: any) {
      setError(err.message || "Failed to load zones");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, [token]);

  async function handleZoneToggle(zoneId: string, open: boolean) {
    setToggleLoading(zoneId);
    setError("");
    
    try {
      await setZoneOpen(zoneId, open, token);
      await fetchState(true);
    } catch (err: any) {
      setError(err.message || "Failed to update zone");
    } finally {
      setToggleLoading(null);
    }
  }

  const getOccupancyRate = (zone: IParkingState) => {
    return zone.totalSlots > 0 ? Math.round((zone.occupied / zone.totalSlots) * 100) : 0;
  };

  const getOccupancyBadgeVariant = (rate: number) => {
    if (rate >= 90) return "destructive";
    if (rate >= 70) return "warning";
    return "success";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Control Panel</h2>
            <p className="text-gray-500 text-sm">Manage zones, rates, and schedules</p>
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

      {/* Zone Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Zone Management</h3>
            <Badge variant="primary" appearance="light" className="ml-auto">
              {parkingState.length} {parkingState.length === 1 ? 'zone' : 'zones'}
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading zones...</span>
            </div>
          </div>
        ) : parkingState.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No zones found</p>
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
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {parkingState.map((zone, index) => {
                  const occupancyRate = getOccupancyRate(zone);
                  
                  return (
                    <motion.tr
                      key={zone.zoneId}
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
                          <div>
                            <div className="font-medium">{zone.name}</div>
                            <div className="text-xs text-gray-500">ID: {zone.zoneId}</div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Badge 
                            variant={getOccupancyBadgeVariant(occupancyRate)} 
                            appearance="light" 
                            className="gap-1"
                          >
                            <Activity className="w-3 h-3" />
                            {occupancyRate}%
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {zone.occupied}/{zone.totalSlots}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Badge variant="destructive" appearance="light" className="gap-1">
                          <Car className="w-3 h-3" />
                          {zone.occupied}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Badge variant="success" appearance="light" className="gap-1">
                          <ParkingCircle className="w-3 h-3" />
                          {zone.free}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Badge variant="warning" appearance="light">
                          {zone.reserved}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Badge variant="primary" appearance="light" className="gap-1">
                          <Users className="w-3 h-3" />
                          {zone.availableForVisitors}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Badge variant="info" appearance="light" className="gap-1">
                            <UserCheck className="w-3 h-3" />
                            {zone.subscriberCount}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Avail: {zone.availableForSubscribers}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center">
                        {zone.open ? (
                          <Badge variant="success" appearance="light" className="gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Open
                          </Badge>
                        ) : (
                          <Badge variant="destructive" appearance="light" className="gap-1">
                            <XCircle className="w-3 h-3" />
                            Closed
                          </Badge>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Button
                          variant={zone.open ? "destructive" : "primary"}
                          size="sm"
                          onClick={() => handleZoneToggle(zone.zoneId, !zone.open)}
                          disabled={toggleLoading === zone.zoneId}
                          className="min-w-[80px]"
                        >
                          {toggleLoading === zone.zoneId ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : zone.open ? (
                            <>
                              <ToggleLeft className="w-3 h-3 mr-1" />
                              Close
                            </>
                          ) : (
                            <>
                              <ToggleRight className="w-3 h-3 mr-1" />
                              Open
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </motion.div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <UpdateCategoryRates />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AddRushHour />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 xl:col-span-1"
        >
          <AddVacation />
        </motion.div>
      </div>
    </motion.div>
  );
}