import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Clock, Copy, CreditCard, ArrowRight, ShieldCheck, Smartphone, Check } from 'lucide-react';
import { Order, PaymentMethod } from '../types';
import { formatIDR } from '../utils/emailTemplates';

interface PaymentGatewayProps {
  order: Order;
  onPaymentSuccess: (orderId: string) => void;
  onClose: () => void;
}

export default function PaymentGateway({ order, onPaymentSuccess, onClose }: PaymentGatewayProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown for demo
  const [isSimulating, setIsSimulating] = useState(false);
  const [gopayPhone, setGopayPhone] = useState(order.customerPhone || '081234567890');

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsSimulating(true);
    // Simulate payment gateway API latency (1.5 seconds)
    setTimeout(() => {
      setIsSimulating(false);
      onPaymentSuccess(order.id);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4" id="payment-gateway-overlay">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in border border-slate-100 flex flex-col">
        {/* Gateway Brand Header */}
        <div className="bg-[#0B132B] p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500 rounded-lg text-slate-950 font-bold text-xs uppercase">
              Secure
            </div>
            <div>
              <h3 className="font-bold text-md text-amber-100 font-serif tracking-wide">Elizabeth Gateway</h3>
              <p className="text-[10px] text-slate-400">Integrated Local Payments Simulator</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">ID Transaksi</p>
            <p className="text-xs font-mono font-bold text-amber-400">{order.id}</p>
          </div>
        </div>

        {/* Amount Box */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 text-center space-y-1">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Pembayaran</p>
          <p className="text-3xl font-extrabold text-slate-900">{formatIDR(order.total)}</p>
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
            <Clock size={12} />
            <span>Bayar sebelum <strong className="font-bold">{formatTime(timeLeft)}</strong></span>
          </div>
        </div>

        {/* Payment Details Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 max-h-[450px]">
          {order.paymentMethod === 'QRIS' && (
            <div className="text-center space-y-4">
              <div className="inline-block p-1 bg-white border border-slate-200 rounded-xl shadow-inner">
                {/* Simulated QR Code using elements & SVG */}
                <div className="relative w-48 h-48 bg-slate-50 flex flex-col items-center justify-center p-2">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                    {/* Corner anchors */}
                    <rect x="5" y="5" width="25" height="25" fill="currentColor" rx="2" />
                    <rect x="8" y="8" width="19" height="19" fill="white" rx="1" />
                    <rect x="12" y="12" width="11" height="11" fill="currentColor" />

                    <rect x="70" y="5" width="25" height="25" fill="currentColor" rx="2" />
                    <rect x="73" y="8" width="19" height="19" fill="white" rx="1" />
                    <rect x="77" y="12" width="11" height="11" fill="currentColor" />

                    <rect x="5" y="70" width="25" height="25" fill="currentColor" rx="2" />
                    <rect x="8" y="73" width="19" height="19" fill="white" rx="1" />
                    <rect x="12" y="77" width="11" height="11" fill="currentColor" />

                    {/* QR Code Dots Mockup */}
                    <path d="M 35,10 H 45 V 20 H 35 Z M 50,5 H 60 V 15 H 50 Z M 35,25 H 40 V 30 H 35 Z" fill="currentColor" />
                    <path d="M 10,35 H 20 V 45 H 10 Z M 25,35 H 30 V 50 H 25 Z M 40,35 H 55 V 40 H 40 Z" fill="currentColor" />
                    <path d="M 5,50 H 15 V 55 H 5 Z M 20,55 H 35 V 60 H 20 Z M 40,45 H 45 V 60 H 40 Z" fill="currentColor" />
                    <path d="M 45,55 H 55 V 65 H 45 Z M 60,35 H 70 V 45 H 60 Z M 75,35 H 90 V 40 H 75 Z" fill="currentColor" />
                    <path d="M 80,45 H 85 V 60 H 80 Z M 60,50 H 75 V 55 H 60 Z M 65,60 H 70 V 70 H 65 Z" fill="currentColor" />
                    <path d="M 35,70 H 40 V 85 H 35 Z M 45,75 H 60 V 80 H 45 Z M 50,85 H 65 V 90 H 50 Z" fill="currentColor" />
                    <path d="M 70,75 H 85 V 80 H 70 Z M 75,85 H 90 V 90 H 75 Z M 80,70 H 85 V 75 H 80 Z" fill="currentColor" />
                  </svg>
                  {/* QRIS Logo badge in center */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-0.5 border border-slate-200 rounded text-[9px] font-extrabold tracking-tight text-red-600 shadow-sm">
                    QRIS
                  </div>
                </div>
              </div>
              <div className="space-y-1 px-4">
                <p className="text-xs font-bold text-slate-800">Pindai Kode QR Di Atas</p>
                <p className="text-[11px] text-slate-500">
                  Mendukung GoPay, OVO, ShopeePay, Dana, LinkAja, serta semua aplikasi m-banking berlogo QRIS (BCA, Mandiri, dll).
                </p>
              </div>
            </div>
          )}

          {order.paymentMethod.startsWith('VA_') && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white font-black text-xs px-2 py-1 rounded">
                      {order.paymentMethod === 'VA_BCA' ? 'BCA' : 'MANDIRI'}
                    </div>
                    <span className="text-xs font-bold text-slate-700">Virtual Account</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Automatic Verification</span>
                </div>
                <div className="p-5 flex items-center justify-between bg-white">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Nomor Rekening VA</p>
                    <p className="text-xl font-mono font-extrabold text-slate-900 tracking-wider">
                      {order.paymentDetails.vaNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(order.paymentDetails.vaNumber || '')}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 active:scale-95 transition flex items-center gap-1.5 text-xs font-semibold"
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="text-green-600" />
                        <span className="text-green-600">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions list */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700">Petunjuk Pembayaran Transfer VA:</h4>
                <ol className="text-xs text-slate-500 space-y-1.5 list-decimal list-inside bg-slate-50 p-4 rounded-xl">
                  <li>Buka aplikasi Mobile Banking Anda atau kunjungi ATM terdekat.</li>
                  <li>Pilih menu <strong className="text-slate-700 font-semibold">Transfer &gt; Virtual Account</strong>.</li>
                  <li>Masukkan nomor rekening Virtual Account di atas.</li>
                  <li>Pastikan nama merchant tertera <strong className="text-slate-700 font-semibold">Elizabeth Signature</strong> dengan total tagihan yang tepat.</li>
                  <li>Konfirmasi transaksi dan masukkan PIN Anda untuk menyelesaikan.</li>
                </ol>
              </div>
            </div>
          )}

          {(order.paymentMethod === 'GOPAY' || order.paymentMethod === 'OVO') && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-center space-y-3">
                <div className="inline-flex items-center gap-2 text-slate-800">
                  <Smartphone size={24} className="text-amber-600" />
                  <span className="text-sm font-extrabold uppercase">
                    E-Wallet {order.paymentMethod}
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Sistem akan mengirimkan push-notification tagihan pembayaran langsung ke aplikasi e-wallet handphone Anda.
                </p>
                <div className="max-w-xs mx-auto text-left space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Nomor HP Terdaftar</label>
                  <input
                    type="text"
                    value={gopayPhone}
                    onChange={(e) => setGopayPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#0B132B]"
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>

              {/* Loader visualizer */}
              <div className="flex items-center justify-center gap-3 p-2 text-slate-400 text-xs">
                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Menunggu persetujuan transaksi di handphone Anda...</span>
              </div>
            </div>
          )}

          {/* Secure disclaimer */}
          <div className="flex items-start gap-2.5 bg-emerald-50 text-emerald-800 p-3.5 rounded-xl text-xs">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Keamanan Terjamin</p>
              <p className="text-emerald-700 leading-normal text-[11px]">
                Sistem e-commerce Elizabeth Signature Gallery terintegrasi secara otomatis. Transaksi ini dienkripsi SSL 256-bit demi keamanan data perbankan Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions with simulation buttons */}
        <div className="bg-slate-50 p-5 border-t border-slate-100 flex flex-col gap-3">
          {/* Main Simulation Button */}
          <button
            onClick={handleSimulatePayment}
            disabled={isSimulating}
            className="w-full bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Memproses Otomatisasi Gateway...</span>
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                <span>Simulasikan Pembayaran Sukses (LUNAS)</span>
              </>
            )}
          </button>

          {/* Close / Return Button */}
          <button
            onClick={onClose}
            className="w-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold py-2 rounded-lg transition"
          >
            Kembali ke Detail Pesanan
          </button>
        </div>
      </div>
    </div>
  );
}
