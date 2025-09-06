"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Car,
  Users,
  UserCheck,
  Lock,
  Zap,
  CheckCircle,
  Star,
} from "lucide-react";
import { IZone } from "@/services/types";

type Props = {
  zone: IZone;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
};

const ZoneCard = ({ zone, selected, disabled, onSelect }: Props) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: disabled ? 1 : 1.02,
        y: disabled ? 0 : -2,
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-300 border-2 ${
          selected
            ? "border-blue-500 shadow-lg shadow-blue-100 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"}`}
        onClick={disabled ? undefined : onSelect}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: selected ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Car className="w-5 h-5 text-blue-600" />
              </motion.div>
              <span className="text-lg">{zone.name}</span>
            </div>
            <div className="flex gap-1">
              {!zone.open && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1 ml-2 pl-2"
                  >
                    <Lock className="w-3 h-3" />
                    Closed
                  </Badge>
                </motion.div>
              )}
              {zone.specialActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge variant="warning" className="flex items-center gap-1 ml-2">
                    <Zap className="w-3 h-3" />
                    Special Rate
                  </Badge>
                </motion.div>
              )}
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Badge
                    variant="success"
                    className="flex items-center gap-1 ml-2"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Selected
                  </Badge>
                </motion.div>
              )}
            </div>
          </CardTitle>
          <div className="text-sm text-gray-500 flex items-center gap-1 ml-2">
            <span>{zone.categoryName || zone.categoryId}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              whileHover={{ backgroundColor: "#f8fafc" }}
            >
              <Car className="w-4 h-4 text-red-500" />
              <div>
                <div className="text-xs text-gray-500">Occupied</div>
                <div className="font-bold text-red-600">{zone.occupied}</div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              whileHover={{ backgroundColor: "#f8fafc" }}
            >
              <Car className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-xs text-gray-500">Free</div>
                <div className="font-bold text-green-600">{zone.free}</div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              whileHover={{ backgroundColor: "#f8fafc" }}
            >
              <UserCheck className="w-4 h-4 text-orange-500" />
              <div>
                <div className="text-xs text-gray-500">Reserved</div>
                <div className="font-bold text-orange-600">{zone.reserved}</div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              whileHover={{ backgroundColor: "#f8fafc" }}
            >
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-xs text-gray-500">Visitors</div>
                <div className="font-bold text-blue-600">
                  {zone.availableForVisitors}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              whileHover={{ backgroundColor: "#f8fafc" }}
            >
              <UserCheck className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-xs text-gray-500">Subscribers</div>
                <div className="font-bold text-purple-600">
                  {zone.availableForSubscribers}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              whileHover={{ backgroundColor: "#f8fafc" }}
            >
              <Star className="w-4 h-4 text-gray-600" />
              <div>
                <div className="text-xs text-gray-500">
                  {zone.specialActive ? "Special" : "Normal"}
                </div>
                <div className="font-bold text-gray-700">
                  {zone.specialActive ? zone.rateSpecial : zone.rateNormal}
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ZoneCard;
