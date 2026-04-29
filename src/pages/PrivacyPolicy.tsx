import React from 'react';
import { Shield, Lock, FileCheck, Server, AlertTriangle } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-10 text-center">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Privacy, Security & Legislative Compliance</h1>
        <p className="text-slate-600 mt-3 font-medium max-w-2xl mx-auto">
          Strict Adherence to the Nigeria Data Protection Act (NDPA) 2023 and Military-Grade Anti-Hacking Cyber Security Protocols.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-10">
        
        {/* NDPA SECTION */}
        <section>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-3">
              <FileCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              1. Nigeria Data Protection Act (NDPA) 2023 Compliance
            </h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            MyTaxGenius is structurally bound by the provisions of the <strong>Nigeria Data Protection Act (NDPA) 2023</strong> and the foundational NDPR. We act strictly as a Data Processor and Controller in capacities strictly outlined by Nigerian Constitutional Law. Any personal, financial, and corporate data submitted (including BVN, NIN, RC Numbers, and Turnover figures) is structurally partitioned and processed strictly with your explicit consent.
          </p>
        </section>

        {/* CYBER SECURITY SECTION */}
        <section>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mr-3">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              2. Top Notch Cyber Security & Anti-Hacking Guardrails
            </h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            To ensure zero vulnerability to hacker threats and third-party intrusions, MyTaxGenius deploys a <strong>Zero-Trust Architecture</strong>.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <strong className="text-slate-800 block mb-1">AES-256 Encryption</strong>
              <span className="text-sm text-slate-500">All data at rest is encrypted with military-grade AES-256. Financial figures and identity strings are unreadable even in the event of an infrastructure breach.</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <strong className="text-slate-800 block mb-1">TLS 1.3 Transport Security</strong>
              <span className="text-sm text-slate-500">Every byte intercepted between your device and the NRS portal is securely tunneled. Man-in-the-Middle (MitM) attacks are mathematically impossible.</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <strong className="text-slate-800 block mb-1">WAF & DDoS Mitigation</strong>
              <span className="text-sm text-slate-500">Real-time Web Application Firewalls instantly block suspicious IPs, brute-force attempts, and automated bot scrapers.</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <strong className="text-slate-800 block mb-1">No API Key Leaks</strong>
              <span className="text-sm text-slate-500">Direct integration with government registries runs strictly via server-side secure networks, bypassing client vulnerabilities.</span>
            </div>
          </div>
        </section>

        {/* LIABILITY LIMITATION (LEGAL SHIELD) */}
        <section>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              3. Limitation of Liability (Legal Indemnification)
            </h2>
          </div>
          <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 text-slate-700 leading-relaxed text-sm">
            <p className="mb-3">
              <strong>EXPRESS WAIVER OF LIABILITY:</strong> By utilizing the MyTaxGenius platform to transmit financial or identity data, the User explicitly acknowledges that while the platform utilizes state-of-the-art security, 100% security against highly advanced nation-state or quantum exploits cannot be legally guaranteed across the global internet infrastructure.
            </p>
            <p>
              In strict accordance with global SaaS jurisprudence and Nigerian digital law, MyTaxGenius, its operators, directors, and technical partners <strong>shall not be held legally or financially liable</strong> for any unauthorized access, breach, leakage, or loss of data caused by third-party infrastructure failures, user device compromise, or sophisticated adversarial attacks beyond standard preventative technological limits. <strong>Users waive all rights to corporate lawsuits, class-action litigation, or claims of damages regarding data compromise.</strong>
            </p>
          </div>
        </section>

        <section>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-3">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              4. Your NDPA Rights
            </h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            Under the NDPA 2023, you retain absolute sovereignty over your uploaded documents and tax trails. You have the right to request data portability, correction of miscalculated ledgers, and (where it does not conflict with Federal Tax statutory retention laws) the "Right to be Forgotten".
          </p>
        </section>

        <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 mt-8 flex flex-col sm:flex-row items-center justify-between text-white">
          <div>
            <p className="text-sm font-bold text-emerald-400 mb-1">NRS / NDPA Data Protection Officer</p>
            <p className="text-sm text-slate-400">For legal audits or NDPA compliance requests:</p>
          </div>
          <a href="mailto:dpo@mytaxgenius.ai" className="mt-4 sm:mt-0 bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">
            Contact DPO
          </a>
        </div>
      </div>
    </div>
  );
}
