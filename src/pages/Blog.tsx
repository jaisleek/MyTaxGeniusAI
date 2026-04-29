import React from 'react';
import {
  BookOpen,
  Calendar,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Download,
  Building2,
  Laptop,
  Church,
  Users,
  FileText
} from 'lucide-react';

import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';

export default function Blog() {

  const posts = [
    {
      title: "Say Bye to Multiple Taxation: What the New Tax Reforms Mean",
      excerpt: "Major tax restructuring, SME reliefs, and simplified compliance rules now in effect.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      category: "Breaking News",
      date: "April 16, 2025",
      readTime: "6 min read",
      slug: "tax-reforms-2025",
      isFeatured: true
    },
    {
      title: "Latest Tax Trends Across Africa in 2025",
      excerpt: "How Kenya, Ghana, and South Africa are reshaping digital taxation systems.",
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      category: "African Trends",
      date: "April 20, 2025",
      readTime: "8 min read",
      slug: "africa-tax-trends"
    },
    {
      title: "Nigeria's Tax Tech Boom",
      excerpt: "Digital tax filing systems are transforming compliance across SMEs and freelancers.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
      category: "Tech & Finance",
      date: "April 18, 2025",
      readTime: "5 min read",
      slug: "tax-tech-nigeria"
    },
    {
      title: "Wetin be TIN and Why You Need Am?",
      excerpt: "Simple explanation of Tax Identification Number for everyday Nigerians.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
      category: "Pidgin Guides",
      date: "April 15, 2026",
      readTime: "3 min read",
      slug: "what-is-tin"
    },
    {
      title: "How Market Women Can Pay Small Small Tax",
      excerpt: "Simple tax system designed for traders and informal businesses.",
      image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d3?auto=format&fit=crop&w=1200&q=80",
      category: "Small Business",
      date: "April 12, 2026",
      readTime: "4 min read",
      slug: "market-tax"
    },
    {
      title: "Is Tax Authority Tracking My Bank Account?",
      excerpt: "Understanding BVN, NDPR, and what data is actually accessible.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
      category: "Tax Security",
      date: "April 10, 2026",
      readTime: "5 min read",
      slug: "bank-tracking"
    }
  ];

  const downloads = [
    { name: "2026 National Tax Policy", type: "PDF", size: "2.4 MB" },
    { name: "Presumptive Tax Guidelines", type: "PDF", size: "1.1 MB" },
    { name: "NDPR Compliance Framework", type: "PDF", size: "3.5 MB" },
    { name: "VAT Exemptions List", type: "PDF", size: "800 KB" }
  ];

  const ecosystem = [
    { icon: Building2, title: "Accounting Executives", desc: "Corporate tax frameworks and compliance updates." },
    { icon: Church, title: "Places of Worship", desc: "Non-profit exemptions and donation compliance." },
    { icon: Laptop, title: "Tech & Freelancers", desc: "Remote income and digital taxation rules." },
    { icon: Users, title: "Traders & SMEs", desc: "Simple tax compliance made easy." }
  ];

  const handleDownload = (e: React.MouseEvent, docName: string) => {
    e.preventDefault();
    e.stopPropagation();

    const doc = new jsPDF();
    doc.text("MyTaxGenius Document", 20, 20);
    doc.text(docName, 20, 40);
    doc.save(`${docName}.pdf`);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20">

      {/* HERO */}
      <section className="bg-[#0F172A] py-20 px-4 mb-16">
        <div className="max-w-7xl mx-auto text-center">
          <BookOpen className="w-10 h-10 text-emerald-400 mx-auto mb-4" />

          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Tax Intelligence Hub
          </h1>

          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Africa-focused tax insights, simplified for individuals and businesses.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-20">

        {/* BLOG SECTION */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Latest Insights</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {posts.map((post, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-xl transition"
              >

                {/* IMAGE */}
                <div className="h-44 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-5">

                  {post.isFeatured && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    {post.category}
                  </p>

                  <h3 className="font-bold text-lg mt-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2">
                    {post.excerpt}
                  </p>

                  {/* INSIGHT BOX */}
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                    💡 This update may affect your tax obligations depending on income level or business type.
                  </div>

                  <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center text-emerald-600 font-semibold"
                  >
                    Read more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                </div>
              </motion.div>
            ))}

          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0F172A] text-white p-10 rounded-2xl text-center"
        >
          <h2 className="text-2xl font-bold">
            Need Help Understanding Tax?
          </h2>

          <p className="text-gray-400 mt-2">
            Chat with our AI tax assistant instantly.
          </p>

          <Link
            to="/chat"
            className="mt-6 inline-flex items-center bg-emerald-500 px-6 py-3 rounded-xl font-bold hover:bg-emerald-400 transition"
          >
            Chat Now <MessageSquare className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}