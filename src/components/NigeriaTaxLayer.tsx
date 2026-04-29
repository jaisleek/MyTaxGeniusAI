import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function NigeriaTaxLayer() {
  const data = [
    { year: '2022', federal: 12, lagos: 15, abuja: 16 },
    { year: '2023', federal: 13, lagos: 16, abuja: 16 },
    { year: '2024', federal: 14, lagos: 17, abuja: 17 },
    { year: '2025', federal: 15, lagos: 18, abuja: 18 },
    { year: '2026', federal: 16, lagos: 19, abuja: 18 },
  ];

  return (
    <section className="py-24 bg-[#0F172A] relative overflow-hidden isolate">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-br from-emerald-600/20 to-green-600/20 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 relative z-10"
          >
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20 backdrop-blur-md">
              <MapPin className="w-4 h-4 mr-1" />
              State & Federal Intelligence
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Don't just think Federal. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Master all 36 States.</span>
            </h2>
            
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-lg">
              Most platforms only look at the general Federal level. MyTaxGenius monitors changing Presumptive Tax schemas, Local Government Levies, and State IRS policies across Lagos, Abuja, Kano, and beyond, so your business stays perfectly compliant anywhere in Nigeria.
            </p>

            <ul className="space-y-5">
              {[
                "Comparative Presumptive Tax rates across States",
                "NRS vs State IRS jurisdictional clarity",
                "Local Government levies tracking"
              ].map((item, i) => (
                <li key={i} className="flex items-center text-slate-200 font-medium text-lg">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-4 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-white font-bold text-xl md:text-2xl mb-1">State Compliance Score</h3>
                  <p className="text-slate-400 text-sm font-medium">Relative automation metrics</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center shadow-lg">
                  Live Data <div className="w-2 h-2 bg-emerald-400 rounded-full ml-2 animate-pulse"></div>
                </div>
              </div>

              <div className="h-[250px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLagos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAbuja" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dx={-10} />
                    <Tooltip cursor={{stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', fontWeight: 600}} />
                    <Area type="monotone" dataKey="lagos" name="Lagos LIRS %" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorLagos)" />
                    <Area type="monotone" dataKey="abuja" name="Abuja FCT-IRS %" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorAbuja)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Decorative floaters */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-2 md:-right-8 top-10 bg-slate-800/90 border border-slate-600/50 p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4 backdrop-blur-md"
            >
               <div className="bg-emerald-500/20 p-2.5 rounded-xl">
                 <MapPin className="w-6 h-6 text-emerald-400" />
               </div>
               <div>
                 <p className="text-white font-extrabold text-sm leading-none">Lagos e-Tax</p>
                 <p className="text-emerald-400 text-xs font-bold mt-1.5">Full Automation</p>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
