"use client";
import { useGateStore } from "@/store/store";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Wifi, 
  WifiOff, 
  Clock,
  Building2
} from "lucide-react";

const GateHeader = () => {
  const { gate, connectionStatus } = useGateStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between py-6 px-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg mb-8 border border-blue-100"
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-3 bg-blue-100 rounded-xl"
        >
          <Building2 className="w-6 h-6 text-blue-600" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{gate?.name || "Gate"}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {gate?.location}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <motion.div
          animate={{ 
            scale: connectionStatus === "connected" ? 1 : [1, 1.1, 1]
          }}
          transition={{ 
            duration: connectionStatus === "connected" ? 0 : 1,
            repeat: connectionStatus === "connected" ? 0 : Infinity
          }}
        >
          <Badge 
            variant={connectionStatus === "connected" ? "success" : "destructive"}
            className="flex items-center gap-2 px-3 py-1"
          >
            {connectionStatus === "connected" ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            {connectionStatus === "connected" ? "Online" : "Offline"}
          </Badge>
        </motion.div>
        <div className="flex items-center gap-2 text-lg font-mono text-gray-700">
          <Clock className="w-5 h-5" />
          <motion.span
            key={time.getSeconds()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {time.toLocaleTimeString()}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default GateHeader;