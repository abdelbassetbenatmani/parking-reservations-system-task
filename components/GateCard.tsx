import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IGate } from "@/services/types";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface GateCardProps {
  gate: IGate;
  index: number;
}

export function GateCard({ gate, index }: GateCardProps) {
  const getLocationIcon = (location: string) => {
    const iconClass = "w-4 h-4";
    switch (location.toLowerCase()) {
      case "north":
        return <MapPin className={`${iconClass} text-blue-600`} />;
      case "south":
        return <MapPin className={`${iconClass} text-green-600`} />;
      case "east":
        return <MapPin className={`${iconClass} text-orange-600`} />;
      case "west":
        return <MapPin className={`${iconClass} text-purple-600`} />;
      default:
        return <Building2 className={`${iconClass} text-gray-600`} />;
    }
  };

  const getLocationColor = (location: string) => {
    switch (location.toLowerCase()) {
      case "north":
        return "from-blue-500 to-blue-600";
      case "south":
        return "from-green-500 to-green-600";
      case "east":
        return "from-orange-500 to-orange-600";
      case "west":
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getLocationVariant = (
    location: string
  ): "primary" | "success" | "warning" | "info" => {
    switch (location.toLowerCase()) {
      case "north":
        return "primary";
      case "south":
        return "success";
      case "east":
        return "warning";
      case "west":
        return "info";
      default:
        return "primary";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-200 shadow-lg">
        {/* Card Header with colored stripe */}
        <div
          className={`h-1 bg-gradient-to-r ${getLocationColor(gate.location)}`}
        />

        <CardHeader className="py-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 bg-gradient-to-r ${getLocationColor(
                gate.location
              )} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
            >
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                {gate.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getLocationIcon(gate.location)}
                <Badge
                  variant={getLocationVariant(gate.location)}
                  appearance="light"
                  size="sm"
                  className="font-medium"
                >
                  {gate.location}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Zone Count Display */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Available Zones
              </span>
            </div>
            <Badge variant="primary" size="lg" className="font-bold">
              {gate.zoneIds?.length || 0}
            </Badge>
          </div>

          {/* Zone IDs Preview (if needed) */}
          {gate.zoneIds && gate.zoneIds.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {gate.zoneIds.slice(0, 3).map((zoneId) => (
                <Badge
                  key={zoneId}
                  variant="info"
                  appearance="light"
                  size="sm"
                  className="text-xs"
                >
                  {zoneId}
                </Badge>
              ))}
              {gate.zoneIds.length > 3 && (
                <Badge
                  variant="secondary"
                  appearance="ghost"
                  size="sm"
                  className="text-xs"
                >
                  +{gate.zoneIds.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button
            asChild
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
          >
            <Link href={`/gate/${gate.id}`}>
              <Building2 className="w-4 h-4 mr-2" />
              <span>Access Gate</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
