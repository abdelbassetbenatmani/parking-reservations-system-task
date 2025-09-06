"use client";
import { useState } from "react";
import { Input, InputWrapper } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { checkoutTicket, getTicket, getSubscription } from "@/services/api";
import SubscriptionCarList from "./SubscriptionCarList";
import CheckoutBreakdown from "./CheckoutBreakdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Car,
  RefreshCw,
  LogOut,
  UserMinus,
  Loader2,
} from "lucide-react";

type Ticket = {
  id: string;
  type: string;
  zoneId: string;
  gateId: string;
  checkinAt: string;
  subscriptionId?: string;
};

type CheckoutResult = {
  ticketId: string;
  checkinAt: string;
  checkoutAt: string;
  durationHours: number;
  breakdown: {
    from: string;
    to: string;
    hours: number;
    rateMode: string;
    rate: number;
    amount: number;
  }[];
  amount: number;
  zoneState: any;
};

export default function CheckpointCheckoutPanel() {
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [checkout, setCheckout] = useState<CheckoutResult | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleCheckout(forceConvertToVisitor = false) {
    setLoading(true);
    setError("");
    setCheckout(null);
    setSubscription(null);
    try {
      // Optionally fetch ticket info first
      const ticketInfo = await getTicket(ticketId);
      setTicket(ticketInfo);
      // If subscriber, fetch subscription info
      if (ticketInfo.type === "subscriber" && ticketInfo.subscriptionId) {
        const sub = await getSubscription(ticketInfo.subscriptionId);
        setSubscription(sub);
      }

      // Checkout
      const result = await checkoutTicket(ticketId, forceConvertToVisitor);
      setCheckout(result);
    } catch (err: any) {
      setError(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setTicketId("");
    setTicket(null);
    setCheckout(null);
    setSubscription(null);
    setError("");
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-xl p-6 border border-gray-100"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <LogOut className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Ticket Check-out</h2>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <InputWrapper>
          <QrCode />
          <Input
            type="email"
            placeholder="Scan or enter ticket ID"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            disabled={loading}
          />
        </InputWrapper>

        <div className="flex gap-2">
          <Button
            onClick={() => handleCheckout(false)}
            disabled={!ticketId || loading}
            variant={"primary"}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Checkout
              </>
            )}
          </Button>

          {(ticket || checkout) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                onClick={resetForm}
                size={"icon"} 
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="flex items-center gap-2 text-red-600 text-sm mt-4 p-3 bg-red-50 rounded-lg border border-red-200"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ticket && ticket.type === "subscriber" && subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="flex items-center gap-2 font-semibold mb-3 text-gray-700">
              <Car className="w-4 h-4" />
              Subscription Cars (compare plate):
            </div>
            <SubscriptionCarList cars={subscription.cars} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mt-6 space-y-4"
          >
            <CheckoutBreakdown
              breakdown={checkout.breakdown}
              duration={checkout.durationHours}
              amount={checkout.amount}
            />

            {ticket?.type === "subscriber" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="destructive"
                  onClick={() => handleCheckout(true)}
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  <UserMinus className="w-4 h-4 mr-2" />
                  Convert to Visitor
                </Button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 text-green-700 font-semibold p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0],
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
              >
                <CheckCircle className="w-5 h-5" />
              </motion.div>
              Checkout successful!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
