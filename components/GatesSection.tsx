"use client";
import { useQuery } from "@tanstack/react-query";
import { getGates } from "@/services/api";
import { motion } from "framer-motion";
import { AlertTriangle, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { IGate } from "@/services/types";
import { GateCard } from "./GateCard";

export function GatesSection() {
  const {
    data: gates,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["gates"],
    queryFn: getGates,
  });

  return (
    <section id="gates-section" className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Gates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our available parking gates to access different zones
            and areas
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-2 bg-gray-200" />
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-xl" />
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div>
                  <div className="font-semibold mb-1">Failed to load gates</div>
                  <div className="text-sm">Please try refreshing the page</div>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Gates Grid */}
        {gates && gates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {gates.map((gate: IGate, index: number) => (
              <GateCard key={gate.id} gate={gate} index={index} />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {gates && gates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <CardTitle className="text-lg text-gray-600 mb-2">
                  No Gates Available
                </CardTitle>
                <p className="text-gray-500 text-sm">
                  There are currently no parking gates configured
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}
