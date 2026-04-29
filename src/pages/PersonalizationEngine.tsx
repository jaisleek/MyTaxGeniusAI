import React, { useState } from "react";
import { User, Briefcase, Laptop } from "lucide-react";

type UserType = "salary" | "freelancer" | "business";

export default function PersonalizationEngine() {
  const [type, setType] = useState<UserType>("salary");

  const content = {
    salary: {
      title: "Salary Earner (PAYE)",
      desc:
        "Your employer deducts PAYE automatically. Focus on allowances & reliefs.",
      tips: [
        "Check monthly PAYE deductions",
        "Ensure employer remits to FIRS",
        "Claim tax reliefs (NHF, Pension)",
      ],
    },
    freelancer: {
      title: "Freelancer / Self-employed",
      desc:
        "You are responsible for filing your own tax returns (self-assessment).",
      tips: [
        "Register for TIN via FIRS",
        "Track all income streams",
        "File annual returns",
      ],
    },
    business: {
      title: "Business Owner",
      desc:
        "You are liable for VAT, CIT and PAYE (if you have staff).",
      tips: [
        "Register business with CAC",
        "File VAT monthly",
        "Maintain proper bookkeeping",
      ],
    },
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-white to-slate-100 dark:from-slate-950 dark:to-black">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          Personal Tax Assistant Mode
        </h1>

        {/* MODE SELECT */}
        <div className="flex gap-3 mb-8">
          <button onClick={() => setType("salary")}
            className={`p-3 rounded-lg border ${type==="salary" && "bg-emerald-500 text-white"}`}>
            <User className="w-4 h-4 inline" /> Salary
          </button>

          <button onClick={() => setType("freelancer")}
            className={`p-3 rounded-lg border ${type==="freelancer" && "bg-emerald-500 text-white"}`}>
            <Laptop className="w-4 h-4 inline" /> Freelancer
          </button>

          <button onClick={() => setType("business")}
            className={`p-3 rounded-lg border ${type==="business" && "bg-emerald-500 text-white"}`}>
            <Briefcase className="w-4 h-4 inline" /> Business
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">
            {content[type].title}
          </h2>

          <p className="text-gray-500 mb-4">
            {content[type].desc}
          </p>

          <ul className="space-y-2">
            {content[type].tips.map((t, i) => (
              <li key={i} className="text-sm">
                • {t}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}