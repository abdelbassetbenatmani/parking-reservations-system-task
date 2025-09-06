"use client";
import { useEffect, useState } from "react";
import { useGateStore } from "@/store/store";
import GateHeader from "@/components/GateHeader";
import ZoneCard from "@/components/ZoneCard";
import TicketModal from "@/components/TicketModal";
import {
  getGate,
  getZones,
  checkinVisitor,
  getSubscription,
  checkinSubscriber,
} from "@/services/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input, InputWrapper } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const GatePage = () => {
  const { gateId } = useParams();
  const {
    setGate,
    setZones,
    zones,
    openTicketModal,
    setConnectionStatus,
    updateZone,
  } = useGateStore();

  const [tab, setTab] = useState<"visitor" | "subscriber">("visitor");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscriber flow
  const [subscriptionId, setSubscriptionId] = useState("");
  const [subscription, setSubscription] = useState<any>(null);
  const [subError, setSubError] = useState<string | null>(null);
  const [verifyingSubscription, setVerifyingSubscription] = useState(false);

  // WebSocket
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    async function init() {
      setConnectionStatus("connecting");
      try {
        const gate = await getGate(gateId as string);
        setGate(gate);
        const zones = await getZones(gateId as string);
        setZones(zones);

        ws = new WebSocket("ws://localhost:3000/api/v1/ws");
        ws.onopen = () => {
          setConnectionStatus("connected");
          ws?.send(JSON.stringify({ type: "subscribe", payload: { gateId } }));
        };
        ws.onclose = () => {
          setConnectionStatus("disconnected");
          reconnectTimer = setTimeout(init, 3000);
        };
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.type === "zone-update") {
            updateZone(msg.payload);
          }
        };
      } catch{
        setConnectionStatus("disconnected");
        reconnectTimer = setTimeout(init, 3000);
      }
    }
    init();
    return () => {
      ws?.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [gateId, setGate, setZones, setConnectionStatus, updateZone]);

  // Visitor check-in
  async function handleVisitorCheckin() {
    if (!selectedZone) return;
    setLoading(true);
    setError(null);
    try {
      const res = await checkinVisitor(gateId as string, selectedZone);
      openTicketModal(res.ticket);
      updateZone(res.zoneState);
      setSelectedZone(null);
    } catch (err: any) {
      setError(err.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  }

  // Subscriber verify
  async function handleVerifySubscription() {
    setSubError(null);
    setSubscription(null);
    setVerifyingSubscription(true);

    if (!subscriptionId) {
      setSubError("Please enter subscription ID");
      setVerifyingSubscription(false);
      return;
    }

    try {
      const sub = await getSubscription(subscriptionId);
      if (!sub.active) {
        setSubError("Subscription is not active");
        setVerifyingSubscription(false);
        return;
      }
      setSubscription(sub);
    } catch (err: any) {
      setSubError(err.message || "Subscription not found");
    } finally {
      setVerifyingSubscription(false);
    }
  }

  // Subscriber check-in
  async function handleSubscriberCheckin() {
    if (!selectedZone || !subscription) return;
    setLoading(true);
    setError(null);
    try {
      const res = await checkinSubscriber(
        gateId as string,
        selectedZone,
        subscriptionId
      );
      openTicketModal(res.ticket);
      updateZone(res.zoneState);
      setSelectedZone(null);
      setSubscription(null);
      setSubscriptionId("");
    } catch (err: any) {
      setError(err.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  }

  const filteredZones =
    tab === "visitor"
      ? zones
      : zones.filter(
          (zone) =>
            zone.open &&
            zone.availableForSubscribers > 0 &&
            (!subscription || zone.categoryId === subscription.category)
        );

  return (
    <motion.div
      className="max-w-6xl mx-auto py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <GateHeader />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as any)}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="visitor"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Users className="w-4 h-4" />
              Visitor
            </TabsTrigger>
            <TabsTrigger
              value="subscriber"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <UserCheck className="w-4 h-4" />
              Subscriber
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visitor" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <AnimatePresence>
                  {filteredZones.map((zone, index) => (
                    <motion.div
                      key={zone.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ZoneCard
                        zone={zone}
                        selected={selectedZone === zone.id}
                        disabled={!zone.open || zone.availableForVisitors <= 0}
                        onSelect={() => setSelectedZone(zone.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant={"primary"}
                  className="w-full h-12 text-lg font-semibold"
                  disabled={!selectedZone || loading}
                  onClick={handleVisitorCheckin}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Checking in...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Check In
                    </>
                  )}
                </Button>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 text-red-600 text-sm text-center mt-4 p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          <TabsContent value="subscriber" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="flex gap-2">
                  <InputWrapper>
                    <Search />
                    <Input
                      type="text"
                      value={subscriptionId}
                      onChange={(e) => setSubscriptionId(e.target.value)}
                      placeholder="Enter subscription ID"
                    />
                  </InputWrapper>
                  <Button
                    onClick={handleVerifySubscription}
                    disabled={
                      loading || !subscriptionId || verifyingSubscription
                    }
                    variant="outline"
                    className=" px-6"
                  >
                    {verifyingSubscription ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {subError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-2 text-red-600 text-sm mt-3 p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {subError}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {subscription && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                        <CheckCircle className="w-5 h-5" />
                        Subscription Verified
                      </div>
                      <div className="text-sm text-green-600">
                        Active for category:{" "}
                        <span className="font-bold">
                          {subscription.category}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <AnimatePresence>
                        {filteredZones.map((zone, index) => (
                          <motion.div
                            key={zone.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <ZoneCard
                              zone={zone}
                              selected={selectedZone === zone.id}
                              disabled={false}
                              onSelect={() => setSelectedZone(zone.id)}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <Button
                      variant={"primary"}
                      disabled={!selectedZone || loading}
                      onClick={handleSubscriberCheckin}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Checking in...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Check In
                        </>
                      )}
                    </Button>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center gap-2 text-red-600 text-sm text-center mt-4 p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <TicketModal />
    </motion.div>
  );
};

export default GatePage;
