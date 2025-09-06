"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGateStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ticket, 
  MapPin, 
  Clock, 
  DoorOpen,
  CheckCircle,
  Printer,
  QrCode
} from "lucide-react";

const TicketModal = () => {
  const { ticket, ticketModalOpen, closeTicketModal, gate } = useGateStore();

  if (!ticket) return null;

  return (
    <AnimatePresence>
      {ticketModalOpen && (
        <Dialog open={ticketModalOpen} onOpenChange={closeTicketModal}>
          <DialogContent className="max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Check-in Successful
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Ticket Info Card */}
                <motion.div 
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Parking Ticket</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ticket ID:</span>
                      <span className="font-mono font-bold text-blue-600">{ticket.id}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Gate:
                      </span>
                      <span className="font-semibold">{gate?.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Zone:</span>
                      <span className="font-semibold">{ticket.zoneId}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Check-in:
                      </span>
                      <span className="font-semibold">
                        {new Date(ticket.checkinAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* QR Code Placeholder */}
                <motion.div
                  className="flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300">
                    <QrCode className="w-20 h-20 text-gray-400" />
                    <div className="text-xs text-center text-gray-500 mt-2">QR Code</div>
                  </div>
                </motion.div>

                {/* Gate Animation */}
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 4px 20px rgba(34, 197, 94, 0.3)",
                          "0 8px 30px rgba(34, 197, 94, 0.5)",
                          "0 4px 20px rgba(34, 197, 94, 0.3)"
                        ]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <DoorOpen className="w-8 h-8" />
                    </motion.div>
                    <motion.div
                      className="text-green-600 font-semibold"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Gate Opening...
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex gap-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    variant="outline" 
                    className="flex-1 flex items-center gap-2"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700" 
                    onClick={closeTicketModal}
                  >
                    Continue
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default TicketModal;