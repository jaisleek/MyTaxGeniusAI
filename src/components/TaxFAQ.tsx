import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: "What is the current Value Added Tax (VAT) rate in Nigeria?",
    answer: "The current standard VAT rate in Nigeria is 7.5%, effective from February 2020 following the Finance Act 2019. Certain items like basic food items, medical products, and educational materials are exempted."
  },
  {
    question: "When is the deadline for filing Company Income Tax (CIT)?",
    answer: "CIT returns must be filed within six (6) months after the end of the company's accounting year. For companies newly incorporated, it is within eighteen (18) months from the date of incorporation or six (6) months after the first accounting period, whichever is earlier."
  },
  {
    question: "How is Personal Income Tax (PAYE) calculated?",
    answer: "PAYE is calculated on your taxable income, which is your gross income minus standard reliefs (like the Consolidated Relief Allowance - CRA, which is ₦200,000 or 1% of gross income whichever is higher, plus 20% of gross income) and exempt deductions (like unapproved pension, NHF, NHIS). The remaining amount is taxed at graduated rates from 7% to 24%."
  },
  {
    question: "What are the penalties for late tax filing?",
    answer: "For CIT, late filing attracts a penalty of ₦50,000 for the first month and ₦25,000 for each subsequent month of default. Late payment attracts a 10% penalty of the tax due plus interest at the commercial rate."
  },
  {
    question: "Do Small and Medium Enterprises (SMEs) pay the same tax rate?",
    answer: "No. The Finance Act introduced exemptions for small companies. Companies with a gross turnover of ₦25 million or less are completely exempted from CIT. Medium-sized companies (turnover between ₦25 million and ₦100 million) pay a reduced CIT rate of 20%, while large companies (turnover above ₦100 million) pay the standard 30%."
  }
];

export function TaxFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 py-24 relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-extrabold text-sm border border-blue-100 dark:border-blue-800/50 mb-6">
            <HelpCircle className="w-4 h-4 mr-2" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Got Questions? <span className="text-blue-600 dark:text-blue-500">We've Got Answers.</span></h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mt-4">Clear, up-to-date answers to the most common Nigerian tax inquiries.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-slate-950 border ${openIndex === index ? 'border-blue-500 dark:border-blue-500 shadow-md' : 'border-slate-200 dark:border-slate-800'} rounded-2xl overflow-hidden transition-all duration-300`}
            >
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full text-left px-6 py-6 flex justify-between items-center focus:outline-none"
              >
                <span className="font-bold text-lg text-slate-900 dark:text-white pr-8">{faq.question}</span>
                <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180 text-blue-500' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-100 dark:border-slate-800/50 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
