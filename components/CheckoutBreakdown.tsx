import { motion } from "framer-motion";
import { Clock, DollarSign, Calculator, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Breakdown = {
  from: string;
  to: string;
  hours: number;
  rateMode: string;
  rate: number;
  amount: number;
};

export default function CheckoutBreakdown({
  breakdown,
  duration,
  amount,
}: {
  breakdown: Breakdown[];
  duration: number;
  amount: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 text-lg font-semibold text-gray-800"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <Calculator className="w-4 h-4 text-white" />
        </div>
        Parking Breakdown
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50">
              <TableHead className="font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  From
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  To
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  Hours
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700">Rate Mode</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">
                <div className="flex items-center justify-end gap-2">
                  <DollarSign className="w-3 h-3" />
                  Rate
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">
                <div className="flex items-center justify-end gap-2">
                  <DollarSign className="w-3 h-3" />
                  Amount
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breakdown.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="hover:bg-blue-50 transition-colors duration-200"
              >
                <TableCell className="font-mono text-sm">
                  {new Date(item.from).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {new Date(item.to).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.hours}h
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.rateMode}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${item.rate.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-bold text-green-600">
                  ${item.amount.toFixed(2)}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50">
              <TableCell colSpan={4} className="font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Total Summary
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold text-gray-700">
                {duration} hours
              </TableCell>
              <TableCell className="text-right">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-md"
                >
                  <DollarSign className="w-4 h-4" />
                  {amount.toFixed(2)}
                </motion.div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Total Duration</span>
          </div>
          <div className="text-xl font-bold text-blue-800">{duration} hours</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Total Amount</span>
          </div>
          <div className="text-xl font-bold text-green-800">${amount.toFixed(2)}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}