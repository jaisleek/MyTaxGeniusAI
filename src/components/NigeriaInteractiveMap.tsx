import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, ExternalLink, Building2, Phone, Mail, Landmark } from 'lucide-react';

const NIGERIAN_STATES = [
  { id: 'FC', name: 'Federal Capital Territory', authority: 'FCT-IRS', website: 'fctirs.gov.ng', phone: '0800 123 4567', x: 50, y: 48, zone: 'NC', type: 'Federal' },
  { id: 'LA', name: 'Lagos', authority: 'LIRS', website: 'lirs.gov.ng', phone: '0700 2255 5477', x: 22, y: 82, zone: 'SW', type: 'State' },
  { id: 'KN', name: 'Kano', authority: 'KDIRS', website: 'kano.irs.gov.ng', phone: '0800 5266 477', x: 55, y: 15, zone: 'NW', type: 'State' },
  { id: 'RV', name: 'Rivers', authority: 'RIRS', website: 'riversbirs.gov.ng', phone: '0800 7477 477', x: 45, y: 88, zone: 'SS', type: 'State' },
  { id: 'EN', name: 'Enugu', authority: 'ESIRS', website: 'irs.enugu.gov.ng', phone: '0800 36848 477', x: 55, y: 76, zone: 'SE', type: 'State' },
  { id: 'KD', name: 'Kaduna', authority: 'KADIRS', website: 'kadirs.gov.ng', phone: '0800 5234 477', x: 48, y: 32, zone: 'NW', type: 'State' },
  { id: 'OY', name: 'Oyo', authority: 'OYSIRS', website: 'oysirs.gov.ng', phone: '0800 696 477', x: 26, y: 65, zone: 'SW', type: 'State' },
  { id: 'OG', name: 'Ogun', authority: 'OGIRS', website: 'ogunstate.gov.ng', phone: '0800 6486 477', x: 24, y: 74, zone: 'SW', type: 'State' },
  { id: 'DT', name: 'Delta', authority: 'DSIRS', website: 'delta.irs.gov.ng', phone: '0800 33582 477', x: 38, y: 82, zone: 'SS', type: 'State' },
  { id: 'AK', name: 'Akwa Ibom', authority: 'AKIRS', website: 'akirs.gov.ng', phone: '0800 25477 477', x: 53, y: 90, zone: 'SS', type: 'State' },
  { id: 'ED', name: 'Edo', authority: 'EIRS', website: 'eirs.gov.ng', phone: '0800 336 477', x: 40, y: 72, zone: 'SS', type: 'State' },
  { id: 'BO', name: 'Borno', authority: 'BOIRS', website: 'bornoirs.gov.ng', phone: '0800 26766 477', x: 82, y: 22, zone: 'NE', type: 'State' },
  { id: 'SO', name: 'Sokoto', authority: 'SOIRS', website: 'sokotoirs.gov.ng', phone: '0800 76568 477', x: 28, y: 12, zone: 'NW', type: 'State' },
  { id: 'CR', name: 'Cross River', authority: 'CRIRS', website: 'crirs.gov.ng', phone: '0800 27477 477', x: 60, y: 85, zone: 'SS', type: 'State' },
  { id: 'AN', name: 'Anambra', authority: 'AIRS', website: 'airs.gov.ng', phone: '0800 26262 477', x: 50, y: 78, zone: 'SE', type: 'State' },
  { id: 'PL', name: 'Plateau', authority: 'PSIRS', website: 'psirs.gov.ng', phone: '0800 75283 477', x: 62, y: 45, zone: 'NC', type: 'State' },
];

export function NigeriaInteractiveMap() {
  const [activeState, setActiveState] = useState<typeof NIGERIAN_STATES[0] | null>(null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-10 relative overflow-hidden shadow-2xl">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="grid lg:grid-cols-5 gap-8 items-center relative z-10">
        
        {/* Left Side: Interactive SVG Map */}
        <div className="lg:col-span-3 relative bg-slate-950/50 rounded-2xl border border-slate-800/50 backdrop-blur-sm p-4 aspect-[4/3] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full max-w-lg drop-shadow-lg" preserveAspectRatio="xMidYMid meet">
            {/* Abstract Nigeria Outline for Context */}
            <path 
              d="M 30,10 C 50,8 70,10 85,20 C 95,35 90,55 80,60 C 70,70 65,85 60,90 C 50,95 40,95 35,90 C 20,85 10,85 15,60 C 20,50 15,30 30,10 Z" 
              fill="rgba(30, 41, 59, 0.4)" 
              stroke="rgba(51, 65, 85, 0.8)" 
              strokeWidth="0.5" 
              strokeDasharray="2 1"
            />
            
            {/* Connection Lines (Abstract Network) */}
            <g stroke="rgba(16, 185, 129, 0.15)" strokeWidth="0.2">
              <line x1="50" y1="48" x2="22" y2="82" />
              <line x1="50" y1="48" x2="55" y2="15" />
              <line x1="50" y1="48" x2="45" y2="88" />
              <line x1="50" y1="48" x2="55" y2="76" />
              <line x1="22" y1="82" x2="24" y2="74" />
              <line x1="24" y1="74" x2="26" y2="65" />
              <line x1="45" y1="88" x2="38" y2="82" />
              <line x1="45" y1="88" x2="53" y2="90" />
            </g>

            {/* State Nodes */}
            {NIGERIAN_STATES.map((state) => (
              <g 
                key={state.id} 
                className="cursor-pointer group"
                onMouseEnter={() => setActiveState(state)}
                onClick={() => setActiveState(state)}
              >
                {/* Ping animation backing */}
                {activeState?.id === state.id && (
                  <circle cx={state.x} cy={state.y} r="3" fill="none" stroke="#10b981" strokeWidth="0.5" className="animate-ping opacity-75" />
                )}
                
                {/* Node */}
                <circle 
                  cx={state.x} 
                  cy={state.y} 
                  r={activeState?.id === state.id ? "2.5" : "1.8"} 
                  fill={activeState?.id === state.id ? "#10b981" : state.type === 'Federal' ? '#3b82f6' : '#94a3b8'} 
                  className={`transition-all duration-300 ${activeState?.id === state.id ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : ''}`}
                />
                
                {/* State Label */}
                <text 
                  x={state.x + 5} 
                  y={state.y + 1} 
                  fontSize="3" 
                  fontWeight="800" 
                  fill={activeState?.id === state.id ? "#10b981" : "#94a3b8"} 
                  className="pointer-events-none transition-colors duration-200 opacity-100"
                >
                  {state.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Quick instructions floating */}
          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/50 flex items-center text-xs text-slate-400 font-medium">
             <MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Hover or click nodes to view authority.
          </div>
        </div>

        {/* Right Side: Authority Details Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {activeState ? (
              <motion.div
                key={activeState.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50"
              >
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-4 xl:mb-6">
                  {activeState.type} Level
                </div>
                
                <h3 className="text-3xl font-black text-white mb-2">{activeState.name}</h3>
                
                <div className="space-y-5 mt-6">
                  <div className="flex items-start">
                    <div className="bg-slate-700/50 p-2 rounded-lg mr-4 border border-slate-600/50">
                      <Landmark className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-bold mb-0.5">Tax Authority</p>
                      <p className="text-lg text-white font-extrabold">{activeState.authority}</p>
                    </div>
                  </div>

                  <div className="flex items-start border-t border-slate-700/50 pt-5">
                    <div className="bg-slate-700/50 p-2 rounded-lg mr-4 border border-slate-600/50">
                      <ExternalLink className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-bold mb-0.5">Official Portal</p>
                      <a href={`https://${activeState.website}`} target="_blank" rel="noopener noreferrer" className="text-base text-emerald-400 hover:text-emerald-300 transition-colors font-bold flex items-center">
                        {activeState.website} <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start border-t border-slate-700/50 pt-5">
                    <div className="bg-slate-700/50 p-2 rounded-lg mr-4 border border-slate-600/50">
                      <Phone className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-bold mb-0.5">Contact Helpdesk</p>
                      <p className="text-base text-white font-bold">{activeState.phone}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[300px] border-2 border-dashed border-slate-700/50 rounded-2xl flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="bg-slate-800/50 p-4 rounded-full mb-4">
                  <Building2 className="w-8 h-8 text-slate-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-300 mb-2">Select a Regional Node</h4>
                <p className="text-sm text-slate-500 font-medium">Click on any state node from the abstract map to view dedicated State Internal Revenue Service details.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
