"use client";
import { useState } from "react";
import { addVacation } from "@/services/api";
import { Input, InputWrapper } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palmtree,
  Calendar,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Cookies from "js-cookie";
import { Label } from "./ui/label";

export default function AddVacation() {
  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("token") || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !fromDate || !toDate) {
      setError("All fields are required");
      return;
    }

    if (fromDate >= toDate) {
      setError("End date must be after start date");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await addVacation(
        {
          name,
          from: fromDate,
          to: toDate,
        },
        token
      );
      setSuccess(true);
      setName("");
      setFromDate("");
      setToDate("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add vacation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
          <Palmtree className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Add Vacation Period
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="block text-xs font-medium text-gray-700 mb-1">
            Vacation Name
          </Label>
          <InputWrapper>
            <Palmtree />
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              placeholder="e.g., Summer Break"
            />
          </InputWrapper>
        </div>

        <div>
          <Label className="block text-xs font-medium text-gray-700 mb-1">
            Start Date
          </Label>
          <InputWrapper>
            <Calendar />
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="pl-10"
            />
          </InputWrapper>
        </div>

        <div>
          <Label className="block text-xs font-medium text-gray-700 mb-1">
            End Date
          </Label>
          <InputWrapper>
            <Calendar />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="pl-10"
            />
          </InputWrapper>
        </div>

        <Button
          type="submit"
          disabled={loading || !name || !fromDate || !toDate}
          variant={"primary"}
          className="w-full flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Palmtree className="w-4 h-4 mr-2" />
              Add Vacation
            </>
          )}
        </Button>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="flex items-center gap-2 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Vacation period added successfully!
            </span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
