"use client"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  User, 
  Settings, 
  MapPin, 
  Clock, 
  Eye,
  Filter,
} from "lucide-react";

interface AuditLogEntry {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  details?: any;
  timestamp: string;
}

export default function AdminAuditLog() {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [filter, setFilter] = useState<'all' | 'admin' | 'system'>('all');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/api/v1/ws");
    
    ws.onopen = () => {
      console.log("Admin audit WebSocket connected");
      setWsConnected(true);
      ws.send(JSON.stringify({ type: "subscribe", payload: { gateId: "gate_1" } }));
    };
    
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("Received WebSocket message:", msg);
        
        if (msg.type === "admin-update") {
          const newEntry: AuditLogEntry = {
            adminId: msg.payload.adminId || "unknown",
            action: msg.payload.action || "unknown-action",
            targetType: msg.payload.targetType || "unknown",
            targetId: msg.payload.targetId || "unknown",
            details: msg.payload.details,
            timestamp: msg.payload.timestamp || new Date().toISOString()
          };
          
          setAuditLog(prev => [...prev, newEntry].slice(-50));
        }
        
        if (msg.type === "zone-update") {
          const newEntry: AuditLogEntry = {
            adminId: "system",
            action: "zone-updated",
            targetType: "zone",
            targetId: msg.payload.id,
            details: {
              name: msg.payload.name,
              occupied: msg.payload.occupied,
              free: msg.payload.free,
              availableForVisitors: msg.payload.availableForVisitors,
              availableForSubscribers: msg.payload.availableForSubscribers
            },
            timestamp: new Date().toISOString()
          };
          
          setAuditLog(prev => [...prev, newEntry].slice(-50));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    ws.onclose = () => {
      console.log("Admin audit WebSocket disconnected");
      setWsConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsConnected(false);
    };
    
    return () => ws.close();
  }, []);

  const getActionIcon = (action: string, targetType: string) => {
    if (action === "zone-updated") return <MapPin className="w-4 h-4" />;
    if (targetType === "category") return <Settings className="w-4 h-4" />;
    if (targetType === "vacation") return <Clock className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getActionColor = (action: string, adminId: string) => {
    if (adminId === "system") return "text-blue-600 bg-blue-50";
    if (action.includes("update")) return "text-green-600 bg-green-50";
    if (action.includes("delete")) return "text-red-600 bg-red-50";
    return "text-purple-600 bg-purple-50";
  };

  const formatAction = (action: string) => {
    return action.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      time: date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }),
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    };
  };

  const filteredLogs = auditLog.filter(entry => {
    if (filter === 'admin') return entry.adminId !== 'system';
    if (filter === 'system') return entry.adminId === 'system';
    return true;
  });

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Live Audit Log</h2>
              <p className="text-sm text-gray-500">Real-time system activity monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <motion.div 
              className="flex items-center gap-2"
              animate={{ scale: wsConnected ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {wsConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                wsConnected ? 'text-green-600' : 'text-red-600'
              }`}>
                {wsConnected ? 'Connected' : 'Disconnected'}
              </span>
              <motion.div 
                className={`w-2 h-2 rounded-full ${
                  wsConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
                animate={{ opacity: wsConnected ? [1, 0.5, 1] : 1 }}
                transition={{ duration: 2, repeat: wsConnected ? Infinity : 0 }}
              />
            </motion.div>

            {/* Collapse/Expand */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              className="flex items-center gap-2 mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 mr-2">Filter:</span>
              {['all', 'admin', 'system'].map((filterType) => (
                <motion.button
                  key={filterType}
                  onClick={() => setFilter(filterType as any)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </motion.button>
              ))}
              <div className="ml-auto text-xs text-gray-500">
                {filteredLogs.length} entries
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredLogs.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No audit entries yet</p>
                <p className="text-sm text-gray-400">
                  Use the admin controls or perform check-ins to see activity logs
                </p>
              </motion.div>
            ) : (
              <div className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {filteredLogs.slice().reverse().map((entry, idx) => {
                      const { time, date } = formatTimestamp(entry.timestamp);
                      const colorClass = getActionColor(entry.action, entry.adminId);
                      
                      return (
                        <motion.div
                          key={`${entry.timestamp}-${idx}`}
                          initial={{ opacity: 0, x: -20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 20, scale: 0.95 }}
                          transition={{ 
                            duration: 0.3,
                            delay: idx * 0.05,
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
                          className="group bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <motion.div 
                              className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              {getActionIcon(entry.action, entry.targetType)}
                            </motion.div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-800 truncate">
                                  {formatAction(entry.action)}
                                </h4>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {time}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <span>on</span>
                                <span className="font-medium text-indigo-600">
                                  {entry.targetType}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                                  {entry.targetId}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <User className="w-3 h-3" />
                                  <span>by</span>
                                  <span className={`font-medium ${
                                    entry.adminId === 'system' 
                                      ? 'text-blue-600' 
                                      : 'text-purple-600'
                                  }`}>
                                    {entry.adminId}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span>{date}</span>
                                </div>
                              </div>

                              {/* Details */}
                              <AnimatePresence>
                                {entry.details && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-2 pt-2 border-t border-gray-200"
                                  >
                                    <details className="group">
                                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                                        View details
                                      </summary>
                                      <motion.pre 
                                        className="text-xs text-gray-600 mt-1 p-2 bg-gray-100 rounded overflow-x-auto"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                      >
                                        {JSON.stringify(entry.details, null, 2)}
                                      </motion.pre>
                                    </details>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}