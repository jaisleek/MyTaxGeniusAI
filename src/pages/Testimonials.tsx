import React, { useState } from 'react';
import { Quote, Star, MessageSquare } from 'lucide-react';

export default function Testimonials() {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const testimonials = [
    {
      name: "Tunde Afolabi",
      role: "SME Owner, Lagos",
      testimony: "Before MyTaxGenius, I used to pay agents ridiculous amounts just to calculate my VAT. The AI correctly identified my exemptions and registered me for my TIN in less than a day. Highly trustworthy!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=faces"
    },
    {
      name: "Josh E.",
      role: "Freelance Developer",
      testimony: "I had no idea how foreign income was taxed in Nigeria. I jumped into the chat, asked the AI, and it explained the NDPR compliance and tech exemptions perfectly. It's like having a top accountant in your pocket.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1579038773867-044c48829161?w=150&h=150&fit=crop&crop=faces"
    },
    {
      name: "Pastor David",
      role: "Church Administrator",
      testimony: "Filing PAYE for our church staff was a nightmare before this. The specific library tailored to Places of Worship made everything incredibly simple.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=150&h=150&fit=crop&crop=faces"
    },
    {
      name: "Aisha M.",
      role: "Market Trader",
      testimony: "I don't know much about big tax laws, but the presumptive tax guide helped me calculate exactly what I owe the local government without being extorted.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=150&h=150&fit=crop&crop=faces"
    }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-[#0F172A] py-20 px-4 mb-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-white/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
            <Quote className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Success Stories</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium mb-8">
            See how Nigerians and local businesses use MyTaxGenius to simplify their compliance and avoid extortion securely.
          </p>
          <button 
            onClick={() => setShowSubmitModal(true)}
            className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-extrabold shadow-lg hover:bg-emerald-500 transition-colors inline-flex items-center"
          >
            <MessageSquare className="w-5 h-5 mr-2" /> Share Your Testimony
          </button>
        </div>
      </section>

      {/* Testimonial Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 transition-colors duration-300 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:shadow-xl">
              <Quote className="w-12 h-12 text-emerald-100 absolute top-6 right-6 group-hover:text-emerald-200 transition-colors" />
              <div className="flex space-x-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-lg leading-relaxed mb-8 italic">"{item.testimony}"</p>
              <div className="flex items-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-emerald-100" />
                ) : (
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg mr-4">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-slate-500 text-sm font-medium">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative animate-in zoom-in duration-200 border border-slate-200 dark:border-slate-800 text-left">
            <button 
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Share Your Story</h2>
            <p className="text-slate-500 mb-6">Help others see how easy tax compliance can be.</p>
            
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              alert("Testimony submitted securely. It will be reviewed by our team before going live.");
              setShowSubmitModal(false);
            }}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name / Alias</label>
                <input required type="text" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="E.g., Chidi Okafor" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Business Type or Role</label>
                <input required type="text" className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="E.g., Plumber in Abuja" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Your Testimony</label>
                <textarea required rows={4} className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Tell us how MyTaxGenius helped..."></textarea>
              </div>
              <button className="w-full bg-emerald-600 text-white font-extrabold py-4 rounded-xl hover:bg-emerald-700 transition-colors">
                Submit securely
              </button>
              <p className="text-xs text-center text-slate-400 mt-2">By submitting, you agree to our NDPA Data guidelines.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
