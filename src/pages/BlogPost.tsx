import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  TrendingUp,
  Globe,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const [comments, setComments] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [aiResult, setAiResult] = useState("");

  const chartData = [
    { country: "Nigeria", vat: 7.5, corp: 30 },
    { country: "Kenya", vat: 16, corp: 30 },
    { country: "Ghana", vat: 15, corp: 25 },
    { country: "SA", vat: 15, corp: 27 },
  ];

  const postContent: Record<string, any> = {
    "tax-reforms-2025": {
      title: "Understanding Tax Reforms Across Africa",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
      tag: "Live Tax Report",
      duration: "6 min read",
      intro: "A simplified breakdown of tax reforms across Nigeria and Africa, focusing on VAT, SME relief, and digital taxation systems. Navigating the new landscape can save your business thousands in compliance costs and avoidable penalties.",
      content: "As governments across Africa modernize their tax collection frameworks, businesses are facing tighter compliance requirements. This article covers the latest shifts in VAT rates, new digital service taxes, and corporate restructuring guidelines designed to harmonize tax bases across the continent."
    },
    "new-nrs-tax-reforms-2025": {
      title: "Understanding Tax Reforms Across Africa",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
      tag: "Live Tax Report",
      duration: "6 min read",
      intro: "A simplified breakdown of tax reforms across Nigeria and Africa, focusing on VAT, SME relief, and digital taxation systems. Navigating the new landscape can save your business thousands in compliance costs and avoidable penalties.",
      content: "As governments across Africa modernize their tax collection frameworks, businesses are facing tighter compliance requirements. This article covers the latest shifts in VAT rates, new digital service taxes, and corporate restructuring guidelines designed to harmonize tax bases across the continent."
    },
    "africa-tax-trends": {
      title: "Latest Tax Trends Across Africa in 2025",
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
      tag: "African Trends",
      duration: "8 min read",
      intro: "How Kenya, Ghana, and South Africa are reshaping digital taxation systems and what it means for multinational startups.",
      content: "As remote work and digital services proliferate, African countries are updating their tax codes to capture revenue from digital nomads and SaaS businesses. Learn what you need to know about the Digital Services Tax (DST) implementations in Kenya and Ghana, and how it impacts your bottom line."
    },
    "tax-tech-nigeria": {
      title: "Nigeria's Tax Tech Boom",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
      tag: "Tech & Finance",
      duration: "5 min read",
      intro: "Digital tax filing systems are transforming compliance across SMEs and freelancers in Nigeria, reducing wait times and middleman fees.",
      content: "For decades, filing taxes in Nigeria meant wrestling with paperwork and navigating bureaucratic hurdles. Today, innovations from the NRS and State Revenue Services are digitizing the entire process. Tools like TaxPro Max and integrated tax software are enabling businesses to file returns and obtain Tax Clearance Certificates (TCC) from their smartphones."
    },
    "what-is-tin": {
      title: "Wetin be TIN and Why You Need Am?",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
      tag: "Pidgin Guides",
      duration: "3 min read",
      intro: "A simple, straightforward breakdown of what a Tax Identification Number (TIN) is, how to get one, and why it's essential for your business.",
      content: "TIN just means Tax Identification Number. It's like your BVN but for tax. Whether you are opening a corporate bank account, applying for a government loan, or importing goods, you cannot escape showing your TIN. The best part? Getting it is completely free online through the official JTB portal."
    },
    "market-tax": {
      title: "How Market Women Can Pay Small Small Tax",
      image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d3",
      tag: "Small Business",
      duration: "4 min read",
      intro: "A guide to the presumptive tax system designed specifically for traders and informal businesses in Nigeria.",
      content: "The Presumptive Tax Regime is built to make tax collection easy for people without formal accounting records. For market traders, artisans, and micro-businesses, you don't need complex audits. The system allows you to pay a fixed, affordable amount based on your business size or trade association category, protecting you from sudden arbitrary assessments."
    },
    "bank-tracking": {
      title: "Is Tax Authority Tracking My Bank Account?",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
      tag: "Tax Security",
      duration: "5 min read",
      intro: "Understanding the relationship between your BVN, NDPR compliance, and what data the tax authorities can actually access.",
      content: "A common fear among growing businesses is that tax bodies have unfettered access to their bank accounts. While the integration of BVN and NIN with tax profiles has improved data sharing, strict data protection laws (NDPR) prevent arbitrary snooping. However, financial institutions are mandated to report certain threshold transactions, so it's always best to keep accurate transparent records."
    }
  };

  const currentPost = slug ? postContent[slug] : null;

  const addComment = () => {
    if (!text.trim()) return;
    setComments([text, ...comments]);
    setText("");
  };

  const explainArticle = () => {
    if (currentPost) {
      setAiResult(`AI Summary: ${currentPost.intro} This article highlights key compliance information and updates you on essential regulations.`);
    }
  };

  const fade = {
    hidden: { opacity: 0, y: 20 },
    show: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-20 md:pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* BACK */}
        <Link
          to="/blog"
          className="inline-flex items-center text-green-700 mb-6 font-medium bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {currentPost ? (
          <motion.div initial="hidden" animate="show">

            {/* HERO */}
            <div className="relative rounded-3xl overflow-hidden h-[45vh] md:h-[65vh]">
              <img
                src={currentPost.image}
                className="w-full h-full object-cover scale-110"
                loading="lazy"
                alt="Dashboard"
              />
              <div className="absolute inset-0 bg-black/50 flex items-end p-6 md:p-12">
                <div className="text-white">
                  <h1 className="text-3xl md:text-5xl font-bold mb-2">
                    {currentPost.title}
                  </h1>
                  <p className="text-lg opacity-90 font-medium">
                    {currentPost.tag}
                  </p>
                </div>
              </div>
            </div>

            {/* HEADER */}
            <div className="mt-8">
              <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-4">
                <TrendingUp className="w-3 h-3 mr-1" />
                {currentPost.tag}
              </span>

              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                {currentPost.title}
              </h2>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-6 border-y border-gray-100 py-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> 2026 Update
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" /> {currentPost.duration}
                </span>
                <span className="flex items-center text-green-700 font-medium">
                  <Globe className="w-4 h-4 mr-2" /> Africa Insight Hub
                </span>
              </div>
            </div>

            {/* INTRO */}
            <p className="mt-8 text-gray-600 text-xl leading-relaxed">
              {currentPost.intro}
            </p>
            
            {/* CONTENT */}
            <p className="mt-6 text-gray-800 text-lg leading-relaxed">
              {currentPost.content}
            </p>

            {/* INFOGRAPHICS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[
                {
                  title: "VAT Reform",
                  img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
                },
                {
                  title: "SME Relief",
                  img: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
                },
                {
                  title: "Digital Tax",
                  img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fade}
                  custom={i + 1}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition group"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.img}
                      className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                      loading="lazy"
                      alt={item.title}
                    />
                  </div>
                  <div className="p-4 font-bold text-center text-slate-800">{item.title}</div>
                </motion.div>
              ))}
            </div>

            {/* CHART (FIXED) */}
            <div className="mt-16 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-extrabold text-2xl mb-8 text-slate-900 border-b pb-4">
                Africa Tax Comparison (VAT & Corporate)
              </h3>

              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="country" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 14, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 14}} dx={-10} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}
                    />
                    <Bar dataKey="vat" name="VAT %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="corp" name="Corporate Tax %" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI EXPLAIN */}
            <div className="mt-16 bg-emerald-50 p-6 md:p-8 rounded-3xl border border-emerald-100">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-bold text-emerald-900 text-lg">Too long to read?</h3>
                  <p className="text-emerald-700 text-sm mt-1">Let MyTaxGenius AI summarize the core insights for you.</p>
                </div>
                <button
                  onClick={explainArticle}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-colors shadow-[0_4px_15px_rgba(5,150,105,0.3)]"
                >
                  🧠 Explain this article
                </button>
              </div>

              {aiResult && (
                <motion.div 
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  className="mt-6 p-5 bg-white rounded-2xl shadow-sm border border-emerald-100 text-slate-700 leading-relaxed font-medium"
                >
                  {aiResult}
                </motion.div>
              )}
            </div>

            {/* LIVE NEWS */}
            <div className="mt-16">
              <h3 className="font-bold text-2xl mb-6 text-slate-900 border-b pb-4">
                Live Tax Updates
              </h3>

              <div className="space-y-3">
                {[
                  "Nigeria: Tax harmonization policy expanding",
                  "Kenya: Digital VAT enforcement growing",
                  "South Africa: Corporate tax reforms in review",
                ].map((n, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white border border-gray-100 rounded-xl hover:border-emerald-200 hover:shadow-md transition cursor-pointer flex items-center text-slate-700 font-medium"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-4"></div>
                    {n}
                  </div>
                ))}
              </div>
            </div>

            {/* COMMENTS */}
            <div className="mt-16">
              <h3 className="font-bold text-2xl mb-6 text-slate-900 border-b pb-4">
                Community Discussion
              </h3>

              <div className="flex gap-3 mt-6">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="border border-gray-200 p-4 flex-1 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition bg-gray-50/50"
                  placeholder="Share your thoughts or ask a question..."
                />
                <button
                  onClick={addComment}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 font-bold rounded-xl transition"
                >
                  Post
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {comments.map((c, i) => (
                  <motion.div 
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    key={i} 
                    className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl text-slate-700 leading-relaxed"
                  >
                    <div className="flex items-center mb-2">
                       <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold mr-3">G</div>
                       <span className="font-bold text-sm text-slate-900">Guest User</span>
                       <span className="text-xs text-gray-400 ml-3">Just now</span>
                    </div>
                    <p className="ml-11">{c}</p>
                  </motion.div>
                ))}
                {comments.length === 0 && (
                   <p className="text-gray-400 italic text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">No comments yet. Be the first to start the discussion!</p>
                )}
              </div>
            </div>

            {/* SHARE */}
            <div className="mt-16 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="font-bold text-slate-900">Share this insight</p>
                <p className="text-sm text-gray-500 mt-1">Help others stay compliant</p>
              </div>
              <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-6 py-3 rounded-xl flex items-center font-bold transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </button>
            </div>

          </motion.div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Article Not Found</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">The tax insight you are looking for does not exist or has been moved.</p>
          </div>
        )}
      </div>
    </div>
  );
}
