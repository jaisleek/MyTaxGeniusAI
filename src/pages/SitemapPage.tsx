import React from 'react';
import { Link } from 'react-router-dom';

export default function SitemapPage() {
  const routes = [
    { path: '/', name: 'Home' },
    { path: '/calculator', name: 'Tax Calculator' },
    { path: '/chat', name: 'MyTaxGenius AI Chatbot' },
    { path: '/tin', name: 'TIN Registration' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/file-tax', name: 'File Tax Returns' },
    { path: '/invoice', name: 'E-Invoicing' },
    { path: '/info', name: 'Information Hub' },
    { path: '/reforms', name: '2026 NRS Tax Reforms' },
    { path: '/tcc', name: 'Tax Clearance Certificate (TCC)' },
    { path: '/calendar', name: 'Tax Calendar' },
    { path: '/privacy', name: 'Privacy Policy' },
    { path: '/blog', name: 'Blog' },
    { path: '/accountants', name: 'Hire an Accountant' },
    { path: '/sme-onboarding', name: 'SME Premium Onboarding' },
    { path: '/testimonials', name: 'Testimonials' },
  ];

  return (
    <div className="pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
        Sitemap
      </h1>
      <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg max-w-2xl">
        A complete overview of all the pages and resources available on MyTaxGenius.
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <li key={route.path}>
            <Link 
              to={route.path} 
              className="text-[#184890] dark:text-[#48d5cb] hover:underline font-semibold flex items-center"
            >
              <div className="w-2 h-2 rounded-full bg-[#48d5cb] mr-3"></div>
              {route.name}
            </Link>
          </li>
        ))}
        <li>
          <Link to="/login" className="text-[#184890] dark:text-[#48d5cb] hover:underline font-semibold flex items-center">
            <div className="w-2 h-2 rounded-full bg-[#48d5cb] mr-3"></div>
            Login
          </Link>
        </li>
        <li>
          <Link to="/signup" className="text-[#184890] dark:text-[#48d5cb] hover:underline font-semibold flex items-center">
            <div className="w-2 h-2 rounded-full bg-[#48d5cb] mr-3"></div>
            Sign Up
          </Link>
        </li>
      </ul>
    </div>
  );
}
