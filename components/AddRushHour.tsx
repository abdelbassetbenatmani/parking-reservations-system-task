"use client";
import { useState } from "react";
import { addRushHour } from "@/services/api";
import { Input, InputWrapper } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Cookies from "js-cookie";
import { Label } from "./ui/label";

const WEEKDAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function AddRushHour() {
  const [weekDay, setWeekDay] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("token") || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!weekDay || !fromTime || !toTime) {
      setError("All fields are required");
      return;
    }

    if (fromTime >= toTime) {
      setError("End time must be after start time");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await addRushHour(
        {
          weekDay: parseInt(weekDay),
          from: fromTime,
          to: toTime,
        },
        token
      );
      setSuccess(true);
      setWeekDay("");
      setFromTime("");
      setToTime("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add rush hour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Add Rush Hour</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="block text-xs font-medium text-gray-700 mb-1">
            Day of Week
          </Label>
          <Select value={weekDay} onValueChange={setWeekDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {WEEKDAYS.map((day) => (
                <SelectItem key={day.value} value={day.value.toString()}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {day.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block text-xs font-medium text-gray-700 mb-1">
            From Time
          </Label>
          <InputWrapper>
            <Clock />
            <Input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="pl-10"
            />
          </InputWrapper>
        </div>

        <div>
          <Label className="block text-xs font-medium text-gray-700 mb-1">
            To Time
          </Label>
          <InputWrapper>
            <Clock />
            <Input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="pl-10"
            />
          </InputWrapper>
        </div>

        <Button
          type="submit"
          disabled={loading || !weekDay || !fromTime || !toTime}
          className="w-full flex items-center justify-center"
          variant={"primary"}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 mr-2" />
              Add Rush Hour
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
              Rush hour added successfully!
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
