"use client";
import { useState, useEffect } from "react";
import { getCategories, updateCategoryRates } from "@/services/api";
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
  DollarSign,
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Cookies from "js-cookie";
import { Label } from "./ui/label";

type Category = {
  id: string;
  name: string;
  rateNormal: number;
  rateSpecial: number;
};

export default function UpdateCategoryRates() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [rateNormal, setRateNormal] = useState("");
  const [rateSpecial, setRateSpecial] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("token") || "";

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError("Failed to load categories");
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find((c) => c.id === selectedCategoryId);
      if (category) {
        setRateNormal(category.rateNormal.toString());
        setRateSpecial(category.rateSpecial.toString());
      }
    }
  }, [selectedCategoryId, categories]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCategoryId || !rateNormal || !rateSpecial) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await updateCategoryRates(
        selectedCategoryId,
        {
          rateNormal: parseFloat(rateNormal),
          rateSpecial: parseFloat(rateSpecial),
        },
        token
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update rates");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Update Category Rates
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </Label>
          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block text-xs font-medium text-gray-700 mb-1">
            Normal Rate
          </Label>
          <InputWrapper>
            <DollarSign />
            <Input
              type="number"
              step="0.01"
              min="0"
              value={rateNormal}
              onChange={(e) => setRateNormal(e.target.value)}
              className="pl-10"
              placeholder="0.00"
            />
          </InputWrapper>
        </div>

        <div>
          <Label className="block text-xs font-medium text-gray-700 mb-1">
            Special Rate
          </Label>
          <InputWrapper>
            <TrendingUp />
            <Input
              type="number"
              step="0.01"
              min="0"
              value={rateSpecial}
              onChange={(e) => setRateSpecial(e.target.value)}
              className="pl-10"
              placeholder="0.00"
            />
          </InputWrapper>
        </div>

        <Button
          type="submit"
          disabled={
            loading || !selectedCategoryId || !rateNormal || !rateSpecial
          }
          variant="primary"
          className="w-full flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Update Rates
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
              Rates updated successfully!
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
