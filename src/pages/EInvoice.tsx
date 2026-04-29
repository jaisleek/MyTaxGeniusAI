import React, { useState } from 'react';
import { Receipt, Plus, Download, Send, CheckCircle, Shield } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function EInvoice() {
  const [items, setItems] = useState<InvoiceItem[]>([{ id: '1', description: '', quantity: 1, price: 0 }]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => {
    const qty = isNaN(item.quantity) ? 0 : item.quantity;
    const price = isNaN(item.price) ? 0 : item.price;
    return sum + (qty * price);
  }, 0);
  const vat = subtotal * 0.075; // NRS 7.5% standard VAT rate
  const total = subtotal + vat;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">NRS Compliant E-Invoicing</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
          Create professional invoices that automatically calculate the mandatory 7.5% VAT. 
          Keep your business compliant without the hassle.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Invoice Builder */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">Invoice Details</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Customer / Client Name</label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="E.g. Dangote Cement Plc"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Customer Email</label>
              <input 
                type="email" 
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 transition-colors duration-300"
              />
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Line Items</h3>
            {items.map((item, index) => (
              <div key={item.id} className="flex gap-2">
                <input 
                  type="text" 
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Item description"
                  className="flex-grow px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 text-sm transition-colors duration-300"
                />
                <input 
                  type="number" 
                  value={isNaN(item.quantity) ? '' : item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                  placeholder="Qty"
                  className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 text-sm transition-colors duration-300"
                />
                <input 
                  type="number" 
                  value={isNaN(item.price) ? '' : item.price}
                  onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))}
                  placeholder="Price (₦)"
                  className="w-32 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 text-sm transition-colors duration-300"
                />
              </div>
            ))}
            <button 
              onClick={addItem}
              className="text-green-600 dark:text-green-400 font-bold text-sm flex items-center hover:text-green-800 dark:hover:text-green-300"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </button>
          </div>

          <button 
            onClick={() => setIsGenerated(true)}
            className="w-full bg-gray-900 dark:bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-gray-800 dark:hover:bg-emerald-500 transition-colors"
          >
            Generate Premium Invoice
          </button>
        </div>

        {/* Invoice Preview */}
        <div className={`transition-all duration-500 ${isGenerated ? 'opacity-100 translate-y-0' : 'opacity-50 pointer-events-none translate-y-4'}`}>
          <div className="bg-white dark:bg-slate-100 p-8 rounded-3xl shadow-xl border border-gray-200 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 font-bold text-xs rounded-bl-xl tracking-wider">
              NRS COMPLIANT VAT (7.5%)
            </div>
            
            <div className="flex justify-between items-start mb-10 pt-4">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tighter">INVOICE</h2>
                <p className="text-gray-500 text-sm mt-1">INV-{Math.floor(Math.random() * 1000000)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">Your Business Name</p>
                <p className="text-gray-500 text-sm">TIN: 23145690-0001</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Billed To:</p>
              <p className="text-lg font-bold text-gray-900">{customerName || 'Customer Name'}</p>
              <p className="text-gray-600">{customerEmail || 'email@company.com'}</p>
            </div>

            <div className="flex-grow">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-900 text-gray-900">
                    <th className="py-3 font-bold">Description</th>
                    <th className="py-3 font-bold text-center">Qty</th>
                    <th className="py-3 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => {
                    const qty = isNaN(item.quantity) ? 0 : item.quantity;
                    const price = isNaN(item.price) ? 0 : item.price;
                    return (
                      <tr key={item.id}>
                        <td className="py-3 text-gray-800">{item.description || '-'}</td>
                        <td className="py-3 text-gray-800 text-center">{qty}</td>
                        <td className="py-3 text-gray-800 text-right">₦ {(qty * price).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t-2 border-gray-100 pt-4 mt-8 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₦ {subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-green-700 font-bold">
                <span className="flex items-center">VAT (7.5%) <Shield className="w-3 h-3 ml-1" /></span>
                <span>₦ {vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-gray-900 pt-4 border-t border-gray-900">
                <span>Total Due</span>
                <span>₦ {total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button className="flex-1 bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors flex items-center justify-center">
                <Send className="w-4 h-4 mr-2" /> Send to Client
              </button>
              <button className="flex-1 bg-white text-gray-900 border-2 border-gray-200 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
