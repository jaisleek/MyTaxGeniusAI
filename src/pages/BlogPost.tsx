import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  TrendingUp,
  Globe,
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
  const isLatestPost = slug === "new-nrs-tax-reforms-2025";

  const [comments, setComments] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [aiResult, setAiResult] = useState("");

  const chartData = [
    { country: "Nigeria", vat: 7.5, corp: 30 },
    { country: "Kenya", vat: 16, corp: 30 },
    { country: "Ghana", vat: 15, corp: 25 },
    { country: "SA", vat: 15, corp: 27 },
  ];

  const addComment = () => {
    if (!text.trim()) return;
    setComments([text, ...comments]);
    setText("");
  };

  const explainArticle = () => {
    setAiResult(
      "This article breaks down tax reforms in Nigeria and Africa, focusing on VAT adjustments, SME relief, and digital tax systems aimed at simplifying compliance."
    );
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
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* BACK */}
        <Link
          to="/blog"
          className="inline-flex items-center text-green-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {isLatestPost ? (
          <motion.div initial="hidden" animate="show">

            {/* HERO */}
            <div className="relative rounded-3xl overflow-hidden h-[45vh] md:h-[65vh]">
              <img
                src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e"
                className="w-full h-full object-cover scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 flex items-end p-6">
                <div className="text-white">
                  <h1 className="text-2xl md:text-4xl font-bold">
                    Africa Tax Intelligence Dashboard
                  </h1>
                  <p className="text-sm opacity-80">
                    Live insights & reforms tracking
                  </p>
                </div>
              </div>
            </div>

            {/* HEADER */}
            <div className="mt-6">
              <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live Tax Report
              </span>

              <h2 className="text-2xl md:text-4xl font-bold mt-4">
                Understanding Tax Reforms Across Africa
              </h2>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" /> 2026 Update
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> 6 min read
                </span>
                <span className="flex items-center text-green-700">
                  <Globe className="w-4 h-4 mr-1" /> Africa Insight Hub
                </span>
              </div>
            </div>

            {/* INTRO */}
            <p className="mt-6 text-gray-600 text-lg">
              A simplified breakdown of tax reforms across Nigeria and Africa,
              focusing on VAT, SME relief, and digital taxation systems.
            </p>

            {/* INFOGRAPHICS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
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
                  className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
                >
                  <img
                    src={item.img}
                    className="h-40 w-full object-cover hover:scale-110 transition duration-500"
                    loading="lazy"
                  />
                  <div className="p-3 font-semibold">{item.title}</div>
                </motion.div>
              ))}
            </div>

            {/* CHART (FIXED) */}
            <div className="mt-10 bg-white p-4 rounded-2xl shadow">
              <h3 className="font-bold mb-4">
                Africa Tax Comparison
              </h3>

              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vat" fill="#22c55e" />
                    <Bar dataKey="corp" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI EXPLAIN */}
            <div className="mt-10">
              <button
                onClick={explainArticle}
                className="bg-black text-white px-4 py-2 rounded-xl"
              >
                🧠 Explain this article
              </button>

              {aiResult && (
                <div className="mt-3 p-3 bg-gray-100 rounded-xl text-sm">
                  {aiResult}
                </div>
              )}
            </div>

            {/* LIVE NEWS */}
            <div className="mt-10">
              <h3 className="font-bold text-xl mb-3">
                Live Tax Updates
              </h3>

              {[
                "Nigeria: Tax harmonization policy expanding",
                "Kenya: Digital VAT enforcement growing",
                "South Africa: Corporate tax reforms in review",
              ].map((n, i) => (
                <div
                  key={i}
                  className="p-3 mb-2 bg-white border rounded-xl hover:bg-green-50"
                >
                  {n}
                </div>
              ))}
            </div>

            {/* COMMENTS */}
            <div className="mt-10">
              <h3 className="font-bold text-xl mb-3">
                Community Discussion
              </h3>

              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="border p-2 flex-1 rounded-lg"
                  placeholder="Write a comment..."
                />
                <button
                  onClick={addComment}
                  className="bg-green-700 text-white px-4 rounded-lg"
                >
                  Post
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {comments.map((c, i) => (
                  <div key={i} className="p-3 bg-gray-100 rounded-lg">
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* SHARE */}
            <div className="mt-10 flex justify-between items-center border-t pt-4">
              <p className="text-sm text-gray-500">
                Share this insight
              </p>
              <button className="bg-green-700 text-white px-4 py-2 rounded-xl flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>

          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            Coming soon...
          </div>
        )}
      </div>
    </div>
  );
}