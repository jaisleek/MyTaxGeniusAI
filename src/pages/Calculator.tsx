import React, { useState } from "react";
import { motion } from "framer-motion";

type UserType = "employee" | "freelancer" | "company";
type Mode = "monthly" | "yearly";

export default function Calculator() {
  const [income, setIncome] = useState<string>("");
  const [userType, setUserType] = useState<UserType>("employee");
  const [mode, setMode] = useState<Mode>("monthly");

  const amount = Number(income || 0);

  // Convert monthly → yearly if needed
  const baseAnnualIncome = mode === "monthly" ? amount * 12 : amount;

  // =========================
  // TAX LOGIC (SIMPLIFIED MODEL)
  // =========================
  let taxRate = 0;
  let pension = 0;
  let description = "";

  if (userType === "employee") {
    taxRate = 0.07;
    pension = baseAnnualIncome * 0.08;
    description = "Employee Personal Income Tax (PIT) + Pension structure";
  }

  if (userType === "freelancer") {
    taxRate = 0.1;
    pension = baseAnnualIncome * 0.02;
    description = "Freelancer self-employed tax estimate";
  }

  if (userType === "company") {
    taxRate = 0.2;
    pension = 0;
    description = "Corporate tax estimate (company based)";
  }

  const tax = baseAnnualIncome * taxRate;
  const totalDeductions = pension + tax;
  const netAnnual = baseAnnualIncome - totalDeductions;
  const netMonthly = netAnnual / 12;

  // 💡 Naira formatter (ensures consistency everywhere)
  const formatNaira = (value: number) =>
    `₦${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-8"
      >

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            ₦ Tax Intelligence Engine
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Employees • Freelancers • Companies
          </p>
        </div>

        {/* USER TYPE */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Employee (PIT)", value: "employee" },
            { label: "Freelancer", value: "freelancer" },
            { label: "Company", value: "company" }
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setUserType(t.value as UserType)}
              className={`p-2 text-xs rounded-xl font-semibold transition-all ${
                userType === t.value
                  ? "bg-emerald-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* MODE SWITCH */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("monthly")}
            className={`flex-1 p-2 rounded-xl font-semibold transition ${
              mode === "monthly"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setMode("yearly")}
            className={`flex-1 p-2 rounded-xl font-semibold transition ${
              mode === "yearly"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            Yearly
          </button>
        </div>

        {/* INPUT */}
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="Enter income"
          className="w-full p-4 rounded-2xl border bg-white shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none"
        />

        {/* DESCRIPTION */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-xl mt-4">
          💡 {description}
        </div>

        {/* RESULTS GRID */}
        <div className="grid grid-cols-2 gap-4 mt-6">

          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 shadow">
            <p className="text-xs text-gray-500">Annual Income</p>
            <p className="text-lg font-bold">
              {formatNaira(baseAnnualIncome)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50">
            <p className="text-xs text-gray-500">Personal Income Tax (PIT)</p>
            <p className="text-lg font-bold text-red-600">
              {formatNaira(tax)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50">
            <p className="text-xs text-gray-500">Pension</p>
            <p className="text-lg font-bold text-orange-600">
              {formatNaira(pension)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100">
            <p className="text-xs text-gray-500">Net Income</p>
            <p className="text-lg font-bold text-emerald-700">
              {formatNaira(netAnnual)}
            </p>
          </div>

        </div>

        {/* MONTHLY EQUIVALENT */}
        <div className="text-center text-sm text-gray-500 mt-4">
          ≈ {formatNaira(netMonthly)} monthly equivalent
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
          ⚠️ This is an estimated Personal Income Tax (PIT) model based on simplified Nigerian tax assumptions.
        </div>

      </motion.div>
    </div>
  );
}
