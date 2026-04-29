import React from "react";
import { Calendar, AlertCircle, CheckCircle } from "lucide-react";

const deadlines = [
  {
    title: "VAT Filing Deadline",
    date: "Every 21st of the month",
    desc: "Monthly VAT returns must be filed to FIRS",
    link: "https://www.firs.gov.ng",
  },
  {
    title: "PAYE Remittance",
    date: "10th of every month",
    desc: "Employers must remit employee PAYE deductions",
    link: "https://taxpromax.firs.gov.ng",
  },
  {
    title: "Company Income Tax (CIT)",
    date: "Annually (6 months after financial year end)",
    desc: "Corporate tax filing for registered companies",
    link: "https://www.firs.gov.ng",
  },
  {
    title: "Annual Returns",
    date: "Every 31st December",
    desc: "All registered businesses must submit annual returns",
    link: "https://www.firs.gov.ng",
  },
];

export default function TaxCalendar() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 dark:from-slate-950 dark:to-black p-6">
      
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-emerald-500" />
          <h1 className="text-2xl font-bold">Nigeria Tax Calendar</h1>
        </div>

        <p className="text-gray-500 mb-8">
          Stay ahead of all FIRS deadlines and avoid penalties.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {deadlines.map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{item.title}</h2>
                <AlertCircle className="w-4 h-4 text-orange-500" />
              </div>

              <p className="text-sm text-gray-500 mt-2">{item.desc}</p>

              <div className="mt-3 text-sm font-medium text-emerald-600">
                📌 {item.date}
              </div>

              <a
                href={item.link}
                target="_blank"
                className="text-xs text-blue-500 mt-2 block"
              >
                Visit FIRS →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <p className="text-sm">
            Tip: Set reminders 3–5 days before each deadline to avoid penalties.
          </p>
        </div>

      </div>
    </div>
  );
}