import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle, Bell, Smartphone, MessageSquare } from 'lucide-react';

export default function TaxCalendar() {
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reminderType, setReminderType] = useState<'sms' | 'whatsapp'>('sms');
  const [saved, setSaved] = useState(false);

  const handleSaveReminders = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
    },
    {
      tax: 'Personal Income Tax (Direct Assessment)',
      deadline: '30th June',
      description: 'Self-employed individuals and freelancers must file their annual tax returns.',
      type: 'annual',
      icon: CalendarIcon
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-10 text-center">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Tax Compliance Calendar</h1>
        <p className="text-slate-600 mt-2">Never miss a deadline. Stay compliant with statutory FIRS timelines.</p>
      </div>

      <div className="mb-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="max-w-lg">
            <h3 className="text-xl font-bold text-slate-900 flex items-center mb-2">
              <Bell className="w-6 h-6 text-emerald-600 mr-2" />
              Automated Reminders
            </h3>
            <p className="text-slate-600 mb-4">
              Missing deadlines comes with heavy penalties. Get personalized SMS or WhatsApp alerts a few days before your specific filing deadlines.
            </p>
            
            <div className="flex items-center gap-3 mb-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={remindersEnabled}
                  onChange={(e) => setRemindersEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-3 text-sm font-bold text-slate-900">
                  {remindersEnabled ? 'Reminders Active' : 'Enable Reminders'}
                </span>
              </label>
            </div>
            
            {remindersEnabled && (
              <form onSubmit={handleSaveReminders} className="space-y-4 animate-fade-in-up">
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="reminderType" 
                      value="sms" 
                      checked={reminderType === 'sms'}
                      onChange={() => setReminderType('sms')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">SMS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="reminderType" 
                      value="whatsapp"
                      checked={reminderType === 'whatsapp'}
                      onChange={() => setReminderType('whatsapp')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">WhatsApp</span>
                  </label>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="tel"
                    placeholder="Enter phone number (e.g. 080...)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
                  >
                    {saved ? 'Saved!' : 'Save Setings'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {deadlines.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${item.type === 'monthly' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900">{item.tax}</h3>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                item.type === 'monthly' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {item.type.toUpperCase()}
              </span>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 mb-3 border border-slate-100">
              <p className="text-sm font-semibold text-rose-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" /> Deadline: {item.deadline}
              </p>
            </div>
            <p className="text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-start space-x-4">
        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-emerald-900">Penalty Avoidance Tip</h4>
          <p className="text-sm text-emerald-800 mt-1">
            Failure to file returns or remit taxes by these deadlines attracts severe penalties and interest under the Federal Inland Revenue Service (Establishment) Act. Ensure your records are prepared well in advance.
          </p>
        </div>
      </div>
    </div>
  );
}
