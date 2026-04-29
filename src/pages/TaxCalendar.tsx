import React from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TaxCalendar() {
  const deadlines = [
    {
      tax: 'Value Added Tax (VAT)',
      deadline: '21st of every month',
      description: 'Remittance of VAT collected in the previous month.',
      type: 'monthly',
      icon: Clock
    },
    {
      tax: 'Withholding Tax (WHT)',
      deadline: '21st of every month',
      description: 'Remittance of WHT deducted from vendors in the previous month.',
      type: 'monthly',
      icon: Clock
    },
    {
      tax: 'Pay-As-You-Earn (PAYE)',
      deadline: '10th of every month',
      description: 'Remittance of personal income tax deducted from employees\' salaries.',
      type: 'monthly',
      icon: Clock
    },
    {
      tax: 'Company Income Tax (CIT)',
      deadline: '6 months after Accounting Year End',
      description: 'Filing of annual corporate tax returns and payment of CIT.',
      type: 'annual',
      icon: CalendarIcon
    },
    {
      tax: 'Education Tax (TETFund)',
      deadline: '6 months after Accounting Year End',
      description: 'Payable alongside CIT for companies with turnover above ₦100m.',
      type: 'annual',
      icon: CalendarIcon
    },
    {
      tax: 'Annual PAYE Returns',
      deadline: '31st January',
      description: 'Employers must file returns of all PAYE deducted in the preceding year.',
      type: 'annual',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-10 text-center">
        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Tax Compliance Calendar</h1>
        <p className="text-gray-600 mt-2">Never miss a deadline. Stay compliant with statutory NRS timelines.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {deadlines.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-green-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${item.type === 'monthly' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">{item.tax}</h3>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                item.type === 'monthly' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {item.type.toUpperCase()}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100">
              <p className="text-sm font-semibold text-red-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" /> Deadline: {item.deadline}
              </p>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 flex items-start space-x-4">
        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-green-900">Penalty Avoidance Tip</h4>
          <p className="text-sm text-green-800 mt-1">
            Failure to file returns or remit taxes by these deadlines attracts severe penalties and interest under the Federal Inland Revenue Service (Establishment) Act. Ensure your records are prepared well in advance.
          </p>
        </div>
      </div>
    </div>
  );
}
