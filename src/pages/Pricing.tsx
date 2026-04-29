import React, { useState } from 'react';
import { Check, X, CreditCard, Building, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: string, amount: number} | null>(null);

  const plans = [
    {
      name: "Free (Basic)",
      price: "₦0",
      amount: 0,
      period: "/month",
      description: "Perfect for citizens looking for basic compliance.",
      features: [
        { name: "Tax Calculator (Unlimited)", included: true },
        { name: "TIN Registration Guide", included: true },
        { name: "AI Chat Assistant", included: "5 chats/month" },
        { name: "Statutory Filing Calendar", included: true },
        { name: "WhatsApp Alerts", included: false },
        { name: "Downloadable Tax Records", included: false },
        { name: "CITN Registered Consultant", included: false },
        { name: "Team Members", included: "1 user" },
      ],
      cta: "Get Started Free",
      ctaPath: "/calculator",
      isPopular: false,
    },
    {
      name: "Pro",
      price: "₦3,500",
      amount: 3500,
      period: "/month",
      description: "For freelancers and active professionals.",
      features: [
        { name: "Tax Calculator (Unlimited)", included: true },
        { name: "TIN Registration Guide", included: true },
        { name: "AI Chat Assistant", included: "Unlimited" },
        { name: "Statutory Filing Calendar", included: true },
        { name: "WhatsApp Alerts", included: true },
        { name: "Downloadable Tax Records", included: true },
        { name: "CITN Registered Consultant", included: false },
        { name: "Team Members", included: "1 user" },
      ],
      cta: "Upgrade to Pro",
      ctaPath: "#",
      isPopular: true,
    },
    {
      name: "SME",
      price: "₦12,000",
      amount: 12000,
      period: "/month",
      description: "Full tax health for businesses and teams.",
      features: [
        { name: "Tax Calculator (Unlimited)", included: true },
        { name: "TIN Registration Guide", included: true },
        { name: "AI Chat Assistant", included: "Unlimited" },
        { name: "Statutory Filing Calendar", included: true },
        { name: "WhatsApp Alerts", included: true },
        { name: "Downloadable Tax Records", included: true },
        { name: "CITN Registered Consultant", included: "2hrs/month" },
        { name: "Team Members", included: "Up to 3" },
      ],
      cta: "Start SME Plan",
      ctaPath: "#",
      isPopular: false,
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Start for free, then upgrade to let MyTaxGenius or our verified human accountants file for you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`rounded-3xl p-8 bg-white dark:bg-slate-900 border ${plan.isPopular ? 'border-emerald-500 dark:border-emerald-500 shadow-xl relative' : 'border-gray-200 dark:border-slate-800 shadow-sm'} flex flex-col`}
          >
            {plan.isPopular && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-xs font-bold tracking-wider uppercase py-1 px-3 rounded-full">
                Most Popular
              </span>
            )}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm h-10">{plan.description}</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-xl font-medium text-gray-500 ml-1">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  {feature.included === false ? (
                    <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                  ) : (
                    <Check className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${feature.included === false ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>
                    {typeof feature.included === 'string' ? (
                      <strong>{feature.included}</strong>
                    ) : null}
                    {typeof feature.included === 'string' ? ` ${feature.name}` : feature.name}
                  </span>
                </li>
              ))}
            </ul>

            {plan.ctaPath === "#" ? (
              <button
                onClick={() => setSelectedPlan({name: plan.name, price: plan.price, amount: plan.amount})}
                className={`w-full py-4 px-6 rounded-xl font-bold text-center transition-colors ${
                  plan.isPopular 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {plan.cta}
              </button>
            ) : (
              <Link
                to={plan.ctaPath}
                className={`w-full py-4 px-6 rounded-xl font-bold text-center transition-colors ${
                  plan.isPopular 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Paystack Checkout Modal Simulation */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-[#0ba4db] p-6 text-white relative">
              <button 
                onClick={() => setSelectedPlan(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <span className="text-white/80 text-sm font-medium">TEST MODE</span>
                <div className="text-white opacity-80 text-sm mt-2">{selectedPlan.name} Plan</div>
                <div className="text-4xl font-extrabold mt-1">{selectedPlan.price}</div>
                <div className="text-white/80 text-sm mt-1">hello@my tax genius</div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 bg-slate-50">
              <p className="text-center text-slate-500 text-sm font-medium mb-6">Choose how to pay</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    alert('This runs standard Paystack React SDK in production (`react-paystack`). Payment processing is simulated here.');
                    setSelectedPlan(null);
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#0ba4db] hover:shadow-md transition-all p-4 rounded-xl flex items-center justify-between group"
                >
                  <div className="flex items-center text-slate-700 dark:text-slate-200 font-bold group-hover:text-[#0ba4db]">
                    <CreditCard className="w-5 h-5 mr-3 text-slate-400 group-hover:text-[#0ba4db]" />
                    Pay with Card
                  </div>
                  <Check className="w-5 h-5 text-transparent group-hover:text-[#0ba4db]" />
                </button>

                <button 
                  onClick={() => {
                    alert('This triggers Paystack Bank Transfer webhook logic in production.');
                    setSelectedPlan(null);
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#0ba4db] hover:shadow-md transition-all p-4 rounded-xl flex items-center justify-between group"
                >
                  <div className="flex items-center text-slate-700 dark:text-slate-200 font-bold group-hover:text-[#0ba4db]">
                    <Building className="w-5 h-5 mr-3 text-slate-400 group-hover:text-[#0ba4db]" />
                    Pay with Bank Transfer
                  </div>
                  <Check className="w-5 h-5 text-transparent group-hover:text-[#0ba4db]" />
                </button>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-center space-x-1 text-xs text-slate-400 font-medium">
                <Lock className="w-3 h-3" />
                <span>Secured by <strong>Paystack</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
