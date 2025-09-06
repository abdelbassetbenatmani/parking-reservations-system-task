import { motion, AnimatePresence } from "framer-motion";
import { Car, Palette } from "lucide-react";

type Car = {
  plate: string;
  brand: string;
  model: string;
  color: string;
};

export default function SubscriptionCarList({ cars }: { cars: Car[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <AnimatePresence>
        {cars.map((car, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ 
              duration: 0.3, 
              delay: i * 0.1,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
            }}
            className="border-2 border-gray-200 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white hover:border-blue-300 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <motion.div 
                className="font-mono text-lg font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-md"
                whileHover={{ scale: 1.05 }}
              >
                {car.plate}
              </motion.div>
              <Car className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{car.brand} {car.model}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Palette className="w-3 h-3 text-gray-400" />
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: getColorBackground(car.color),
                    color: getColorText(car.color)
                  }}
                >
                  {car.color}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Helper functions for color styling
function getColorBackground(color: string): string {
  const colorMap: { [key: string]: string } = {
    'red': '#fee2e2',
    'blue': '#dbeafe',
    'green': '#dcfce7',
    'yellow': '#fef3c7',
    'black': '#f3f4f6',
    'white': '#f9fafb',
    'gray': '#f3f4f6',
    'silver': '#e5e7eb'
  };
  return colorMap[color.toLowerCase()] || '#f3f4f6';
}

function getColorText(color: string): string {
  const colorMap: { [key: string]: string } = {
    'red': '#dc2626',
    'blue': '#2563eb',
    'green': '#16a34a',
    'yellow': '#d97706',
    'black': '#374151',
    'white': '#6b7280',
    'gray': '#6b7280',
    'silver': '#6b7280'
  };
  return colorMap[color.toLowerCase()] || '#6b7280';
}