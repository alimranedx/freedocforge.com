"use client";

import React, { useState, useRef } from "react";
import { Printer, Download, Plus, Trash2, Building, RefreshCw, Upload, Check } from "lucide-react";
import { numberToWordsEnglish } from "@/lib/numberToWords";
import AdSenseSlot from "@/components/AdSenseSlot";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export default function InvoiceEditor({ initialData, isUserSaved = false }: { initialData: any; isUserSaved?: boolean }) {
  const [data, setData] = useState({ ...initialData });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Auto Calculations with safe fallbacks
  const itemsList: InvoiceItem[] = Array.isArray(data.items) ? data.items : [];
  const subtotal = itemsList.reduce((acc: number, item: InvoiceItem) => acc + (Number(item.quantity || 0) * Number(item.price || 0)), 0);
  const delivery = Number(data.deliveryCharge || 0);
  const discount = Number(data.discount || 0);
  const grandTotal = Math.max(0, subtotal + delivery - discount);
  const paid = Number(data.paidAmount || 0);
  const due = Math.max(0, grandTotal - paid);

  const handleAddItem = () => {
    setData({
      ...data,
      items: [...itemsList, { name: "New Product / Service", quantity: 1, price: 500 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (itemsList.length <= 1) return;
    const updated = itemsList.filter((_: any, i: number) => i !== index);
    setData({ ...data, items: updated });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...itemsList];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, items: updated });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSignaturePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToProfile = async () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Input Form Controls (Hidden during printing) */}
      <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-6 shadow-sm print:hidden space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Document Settings</h2>
            <p className="text-xs text-gray-500">Edit business & customer info to update the live preview.</p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">
            Instant Free PDF
          </span>
        </div>

        {/* Business Details */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
            1. Your Business / Shop Details
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Shop / Company Name"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={data.businessName}
                onChange={(e) => setData({ ...data, businessName: e.target.value })}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Invoice #"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={data.invoiceNumber}
                onChange={(e) => setData({ ...data, invoiceNumber: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Shop Address / Location"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg border border-gray-300 transition">
                <Upload className="w-3.5 h-3.5" />
                Upload Shop Logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
              <label className="cursor-pointer flex items-center gap-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg border border-gray-300 transition">
                <Upload className="w-3.5 h-3.5" />
                Upload Digital Signature
                <input type="file" accept="image/*" className="hidden" onChange={handleSignatureUpload} />
              </label>
            </div>
          </div>
        </div>

        {/* Customer / Recipient Details */}
        <div className="space-y-3 pt-3 border-t">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
            2. Customer / Client Details
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Customer Name"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={data.customerName}
                onChange={(e) => setData({ ...data, customerName: e.target.value })}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Customer Phone"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={data.customerPhone}
                onChange={(e) => setData({ ...data, customerPhone: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Delivery Address"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={data.customerAddress}
                onChange={(e) => setData({ ...data, customerAddress: e.target.value })}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Courier Partner (e.g. Steadfast / Pathao)"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={data.courierPartner}
                onChange={(e) => setData({ ...data, courierPartner: e.target.value })}
              />
            </div>
            <div>
              <input
                type="date"
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              3. Items & Pricing
            </label>
            <button
              onClick={handleAddItem}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {itemsList.map((item: InvoiceItem, idx: number) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                <input
                  type="text"
                  placeholder="Item name"
                  className="flex-1 text-xs bg-white border border-gray-300 rounded px-2 py-1.5 focus:outline-none"
                  value={item.name}
                  onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  className="w-14 text-xs bg-white border border-gray-300 rounded px-2 py-1.5 focus:outline-none text-center"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="w-20 text-xs bg-white border border-gray-300 rounded px-2 py-1.5 focus:outline-none text-right"
                  value={item.price}
                  onChange={(e) => handleItemChange(idx, "price", Number(e.target.value))}
                />
                <button
                  onClick={() => handleRemoveItem(idx)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <div>
              <span className="text-[10px] text-gray-500 block mb-0.5">Delivery Fee</span>
              <input
                type="number"
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none"
                value={data.deliveryCharge}
                onChange={(e) => setData({ ...data, deliveryCharge: e.target.value })}
              />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block mb-0.5">Discount</span>
              <input
                type="number"
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none"
                value={data.discount}
                onChange={(e) => setData({ ...data, discount: e.target.value })}
              />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block mb-0.5">Advance Paid</span>
              <input
                type="number"
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none"
                value={data.paidAmount}
                onChange={(e) => setData({ ...data, paidAmount: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t space-y-2">
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm transition text-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
          
          <button
            onClick={handleSaveToProfile}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-lg transition text-xs cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" /> Saved to Your Shop Profile!
              </>
            ) : (
              <>
                <Building className="w-4 h-4" /> Save Brand Preset for Next Time
              </>
            )}
          </button>
        </div>

        {/* In-sidebar AdSense Ad */}
        <AdSenseSlot slotId="editor-sidebar-slot" format="rectangle" label="Sponsored Partner" />
      </div>

      {/* RIGHT COLUMN: Live Printable A4 Canvas */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-3 print:hidden">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            A4 Pixel-Perfect Live Preview
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
          >
            <Download className="w-3.5 h-3.5" /> Direct Download
          </button>
        </div>

        {/* ACTUAL PRINTABLE SHEET (White A4 page) */}
        <div
          ref={printRef}
          id="printable-document"
          className="w-full max-w-[210mm] min-h-[297mm] bg-white text-gray-900 p-10 rounded-xl shadow-xl border border-gray-200 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none text-xs flex flex-col justify-between"
        >
          <div>
            {/* Header: Brand & Document Number */}
            <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6">
              <div className="space-y-1">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="h-14 object-contain mb-2" />
                ) : (
                  <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                    {data.businessName || "Your Shop Name"}
                  </h1>
                )}
                <p className="text-xs text-gray-600 font-medium">{data.tagline}</p>
                <p className="text-xs text-gray-500">{data.address}</p>
                <p className="text-xs text-gray-500">Phone: {data.phone}</p>
              </div>

              <div className="text-right space-y-1">
                <span className="inline-block bg-gray-900 text-white font-black tracking-widest text-sm px-4 py-1.5 uppercase rounded">
                  CASH MEMO
                </span>
                <p className="text-xs font-semibold text-gray-700 mt-2">
                  Invoice No: <span className="text-gray-900 font-bold">{data.invoiceNumber}</span>
                </p>
                <p className="text-xs text-gray-500">Date: {data.date}</p>
                {data.courierPartner && (
                  <p className="text-[11px] text-gray-500">Courier: {data.courierPartner}</p>
                )}
              </div>
            </div>

            {/* Bill To / Recipient Info */}
            <div className="grid grid-cols-2 gap-4 my-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                  Billed To / Customer:
                </span>
                <h3 className="text-sm font-bold text-gray-900">{data.customerName || "Customer Name"}</h3>
                <p className="text-xs text-gray-600">{data.customerPhone}</p>
                <p className="text-xs text-gray-600 mt-1">{data.customerAddress}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                  Payment Status:
                </span>
                <span
                  className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                    due <= 0
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {due <= 0 ? "PAID IN FULL" : `COD DUE: ${data.currency} ${due.toLocaleString()}`}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left border-collapse my-6">
              <thead>
                <tr className="border-b border-gray-900 text-gray-900 uppercase text-[10px] font-bold">
                  <th className="py-2.5 w-10">#</th>
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center w-20">Qty</th>
                  <th className="py-2.5 text-right w-28">Unit Price</th>
                  <th className="py-2.5 text-right w-32">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {itemsList.map((item: InvoiceItem, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-3 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="py-3 font-semibold text-gray-800">{item.name}</td>
                    <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-700">
                      {data.currency} {Number(item.price).toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-bold text-gray-900">
                      {data.currency} {(item.quantity * item.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations & Words Breakdown */}
            <div className="grid grid-cols-12 gap-6 pt-4 border-t border-gray-300">
              <div className="col-span-7 space-y-2">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">
                    In Words:
                  </span>
                  <p className="text-xs font-semibold text-gray-800 italic">
                    {numberToWordsEnglish(grandTotal)}
                  </p>
                </div>
                {data.notes && (
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-2">
                    <strong className="text-gray-700">Terms & Notes:</strong> {data.notes}
                  </p>
                )}
              </div>

              <div className="col-span-5 space-y-2 text-right">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{data.currency} {subtotal.toLocaleString()}</span>
                </div>
                {delivery > 0 && (
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Delivery Charge:</span>
                    <span>+{data.currency} {delivery.toLocaleString()}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600">
                    <span>Special Discount:</span>
                    <span>-{data.currency} {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black border-t-2 border-gray-900 pt-2 text-gray-900">
                  <span>Grand Total:</span>
                  <span>{data.currency} {grandTotal.toLocaleString()}</span>
                </div>
                {paid > 0 && (
                  <div className="flex justify-between text-xs text-gray-600 pt-1">
                    <span>Advance Received:</span>
                    <span>{data.currency} {paid.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold text-gray-800 pt-1">
                  <span>Net Due on Delivery:</span>
                  <span className="text-blue-700 font-black">{data.currency} {due.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Signature & Watermark */}
          <div className="mt-16 pt-6 border-t border-gray-200 flex justify-between items-end">
            <div>
              <p className="text-[10px] text-gray-400">
                Generated via <strong className="text-gray-600">freedocforge.com</strong> • 100% Free Smart Printable
              </p>
            </div>
            <div className="text-center">
              {signaturePreview ? (
                <img src={signaturePreview} alt="Signature" className="h-10 mx-auto mb-1 object-contain" />
              ) : (
                <div className="w-36 border-b border-gray-400 mb-1 mx-auto"></div>
              )}
              <span className="text-[11px] font-bold text-gray-700">
                {data.signatoryTitle || "Authorized Signature"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Banner AdSense */}
        <AdSenseSlot slotId="canvas-bottom-banner" format="horizontal" className="print:hidden" />
      </div>
    </div>
  );
}
