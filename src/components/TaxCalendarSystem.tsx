import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, AlertCircle } from 'lucide-react';

export function TaxCalendarSystem() {
  const events = [
    {
      date: "10th of Every Month",
      title: "PAYE Remittance",
      desc: "Deadline for remitting deducted PAYE to the State IRS.",
      type: "urgent",
      who: "Employers, Companies"
    },
    {
      date: "21st of Every Month",
      title: "VAT Filing",
      desc: "Deadline to file Value Added Tax returns to the NRS.",
      type: "warning",
      who: "Vatable Persons, SMEs"
    },
    {
      date: "March 31st",
      title: "Annual PIT Returns",
      desc: "Deadline for individuals to file their Personal Income Tax.",
      type: "normal",
      who: "Individuals, Freelancers"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="flex-1 lg:max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-32 space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-orange-200 dark:border-orange-800/50 shadow-sm">
                <CalendarDays className="w-4 h-4" />
                <span>Compliance Calendar</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Never miss a deadline.</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Penalties are expensive. Our smart alert system syncs directly with official LIRS/NRS calendars to keep you perfectly locally and globally compliant.
              </p>
              
              <div className="p-8 bg-[#FAFAFA] dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md mt-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <h4 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2 relative z-10">Want automatic reminders?</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium relative z-10">Get WhatsApp and Email pings 3 days before any major tax deadline.</p>
                <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                  <input type="email" placeholder="Enter your email" className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 sm:py-0 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow shadow-sm" />
                  <button className="bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white px-6 py-3 sm:py-0 rounded-xl font-bold transition-colors whitespace-nowrap shadow-md">Alert Me</button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex-1">
            <div className="space-y-6">
              {events.map((event, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl shadow-sm ${
                        event.type === 'urgent' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                        event.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {event.type === 'urgent' ? <AlertCircle className="w-6 h-6" /> : <CalendarDays className="w-6 h-6" />}
                      </div>
                      <h4 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-none">{event.title}</h4>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold px-4 py-2 rounded-lg text-sm whitespace-nowrap hidden md:block">
                      {event.date}
                    </div>
                  </div>
                  
                  {/* Mobile Date */}
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold px-3 py-1.5 rounded-lg text-xs inline-block mb-3 md:hidden">
                    {event.date}
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed mb-6">
                    {event.desc}
                  </p>
                  
                  <div className="flex items-center text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800/50 inline-flex px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></div>
                    Applies to: {event.who}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
