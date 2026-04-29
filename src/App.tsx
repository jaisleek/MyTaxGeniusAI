import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Home from './pages/Home';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import TinRegistration from './pages/TinRegistration';
import TaxFiling from './pages/TaxFiling';
import InfoHub from './pages/InfoHub';
import TCC from './pages/TCC';
import TaxCalendar from './pages/TaxCalendar';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Pricing from './pages/Pricing';
import Calculator from './pages/Calculator';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import EInvoice from './pages/EInvoice';
import Accountants from './pages/Accountants';
import SmeOnboarding from './pages/SmeOnboarding';
import Testimonials from './pages/Testimonials';
import TaxReforms from './pages/TaxReforms';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SitemapPage from './pages/SitemapPage';

// ✅ NEW IMPORT (IMPORTANT)
import PersonalizationEngine from './pages/PersonalizationEngine';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>

          {/* Main pages */}
          <Route index element={<Home />} />
          <Route path="chat" element={<Chat />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="tin" element={<TinRegistration />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="file-tax" element={<TaxFiling />} />
          <Route path="invoice" element={<EInvoice />} />
          <Route path="info" element={<InfoHub />} />
          <Route path="reforms" element={<TaxReforms />} />
          <Route path="tcc" element={<TCC />} />
          <Route path="calendar" element={<TaxCalendar />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="accountants" element={<Accountants />} />
          <Route path="sme-onboarding" element={<SmeOnboarding />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="sitemap" element={<SitemapPage />} />

          {/* ✅ NEW PAGE ROUTE */}
          <Route path="personalization" element={<PersonalizationEngine />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}