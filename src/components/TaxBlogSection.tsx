import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TaxBlogSection() {
  const posts = [
    {
      title: "Say Bye to Multiple Taxation: What the New Tax Reforms Mean",
      category: "Breaking News",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      slug: "tax-reforms-2025"
    },
    {
      title: "How Market Women Can Pay Small Small Tax",
      category: "Small Business",
      image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d3?auto=format&fit=crop&w=600&q=80",
      slug: "market-tax"
    },
    {
      title: "Is Tax Authority Tracking My Bank Account?",
      category: "Security",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
      slug: "bank-tracking"
    }
  ];

  return (
    <section className="py-24 bg-[#FAFAFA] dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Scam Alert Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-2xl p-4 md:p-6 mb-16 flex flex-col md:flex-row items-center gap-4 md:gap-6 shadow-sm"
        >
          <div className="bg-rose-100 dark:bg-rose-900/50 p-3 rounded-full flex-shrink-0 animate-pulse">
            <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-rose-900 dark:text-rose-200 font-bold text-[15px] mb-1">NRS SCAM ALERT (2026)</h4>
            <p className="text-rose-700 dark:text-rose-400 text-sm md:text-[15px] font-medium leading-relaxed">Beware of fake agents demanding money for "TIN Activation". TIN registration is strictly free. Always use official portals or authorized gateways like MyTaxGenius.</p>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-800/50">
              <BookOpen className="w-4 h-4" />
              <span>Tax Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Stay ahead of the curve.</h2>
          </div>
          <Link to="/blog" className="inline-flex items-center text-slate-600 dark:text-slate-400 font-bold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-xl shadow-sm">
            View all insights <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase text-slate-900 dark:text-white shadow-sm border border-white/20 tracking-wider">
                  {post.category}
                </div>
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">{post.title}</h3>
                </div>
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-6 mt-auto">
                  Read Article <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
