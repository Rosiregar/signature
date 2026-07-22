import React, { useState, useMemo } from 'react';
import { Mail, ArrowRight, Clock, Trash2, X, RefreshCw, Filter, User, Shield } from 'lucide-react';
import { EmailNotification, Order } from '../types';

interface EmailSimulatorProps {
  notifications: EmailNotification[];
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
  activeRole?: 'ADMIN' | 'USER';
}

export default function EmailSimulator({ notifications, onClearAll, isOpen, onClose, activeRole = 'USER' }: EmailSimulatorProps) {
  const [filterRecipient, setFilterRecipient] = useState<string>('ALL');

  // Filter notifications based on role or selected recipient
  const filteredNotifications = useMemo(() => {
    if (filterRecipient === 'ALL') {
      return notifications;
    }
    return notifications.filter((n) => n.to.toLowerCase().includes(filterRecipient.toLowerCase()));
  }, [notifications, filterRecipient]);

  // Extract unique recipient emails for quick dropdown filter
  const uniqueRecipients = useMemo(() => {
    const list = Array.from(new Set(notifications.map((n) => n.to)));
    return list;
  }, [notifications]);

  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(
    filteredNotifications.length > 0 ? filteredNotifications[0] : null
  );

  // Auto select first filtered email when list updates
  React.useEffect(() => {
    if (filteredNotifications.length > 0) {
      if (!selectedEmail || !filteredNotifications.some((n) => n.id === selectedEmail.id)) {
        setSelectedEmail(filteredNotifications[0]);
      }
    } else {
      setSelectedEmail(null);
    }
  }, [filteredNotifications]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end" id="email-simulator-modal">
      <div className="w-full max-w-4xl bg-slate-50 h-full shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-lg">
              <Mail size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Elizabeth SMTP Email Simulator</h2>
              <p className="text-xs text-slate-400">Notifikasi otomatis untuk pelanggan & admin toko</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <button 
                onClick={onClearAll}
                className="text-xs bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 py-1.5 px-3 rounded-md transition duration-200 flex items-center gap-1"
                title="Hapus semua log email"
              >
                <Trash2 size={13} />
                <span>Reset Inbox</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Panel: Email List */}
          <div className="w-1/3 border-r border-slate-200 bg-white overflow-y-auto flex flex-col">
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 space-y-2">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  {activeRole === 'ADMIN' ? (
                    <>
                      <Shield size={12} className="text-amber-500" />
                      <span>Mode Admin ({notifications.length})</span>
                    </>
                  ) : (
                    <>
                      <User size={12} className="text-emerald-500" />
                      <span>Kotak Email Pelanggan</span>
                    </>
                  )}
                </span>
              </div>

              {/* Email Recipient Filter */}
              {uniqueRecipients.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1">
                  <Filter size={11} className="text-slate-400 shrink-0" />
                  <select
                    value={filterRecipient}
                    onChange={(e) => setFilterRecipient(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2 text-[11px] font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="ALL">📬 Semua Penerima Email ({notifications.length})</option>
                    {uniqueRecipients.map((email) => (
                      <option key={email} value={email}>
                        👤 {email}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {filteredNotifications.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <Mail size={40} className="stroke-1 mb-2 text-slate-300" />
                <p className="text-sm font-medium">Kotak Masuk Kosong</p>
                <p className="text-xs px-4 mt-1">
                  {filterRecipient !== 'ALL' 
                    ? `Tidak ada email untuk alamat ${filterRecipient}. Pilih 'Semua Penerima' untuk melihat log email lain.`
                    : 'Buat pesanan baru atau perbarui status pembayaran untuk memicu email otomatis.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredNotifications.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  return (
                    <button
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`w-full text-left p-4 transition duration-150 flex flex-col gap-1.5 border-l-4 ${
                        isSelected 
                          ? 'bg-amber-50/50 border-amber-500' 
                          : 'hover:bg-slate-50 border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase">
                          {email.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(email.sentAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-800 text-xs line-clamp-1">
                        {email.subject}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Ke: {email.to}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Email Reader Body */}
          <div className="flex-1 bg-slate-100 p-6 overflow-y-auto flex flex-col">
            {selectedEmail ? (
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col flex-1">
                {/* Email Metadata */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 space-y-1">
                  <div>
                    <span className="font-semibold text-slate-400 w-16 inline-block">Pengirim:</span> 
                    <span className="text-slate-800 font-medium">Elizabeth Signature Gallery &lt;noreply@elizabethsignature.id&gt;</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 w-16 inline-block">Penerima:</span> 
                    <span className="text-slate-800 font-medium font-mono">{selectedEmail.to}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 w-16 inline-block">Subjek:</span> 
                    <span className="text-slate-900 font-bold">{selectedEmail.subject}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Dikirim pada: {new Date(selectedEmail.sentAt).toLocaleString('id-ID')}
                  </div>
                </div>

                {/* Simulated Email Body Content */}
                <div className="p-6 flex-1 bg-white overflow-y-auto">
                  {/* Real-looking E-Commerce Email Wrapper */}
                  <div className="max-w-2xl mx-auto border border-slate-100 rounded-lg overflow-hidden font-sans">
                    {/* Brand Banner */}
                    <div className="bg-[#0B132B] p-6 text-center border-b-4 border-[#C5A059]">
                      <div className="inline-block text-amber-400 font-serif text-2xl italic font-bold tracking-tight">
                        Elizabeth Signature Gallery
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                        Premium Bouquet Specialist
                      </div>
                    </div>

                    {/* Email Message Content */}
                    <div 
                      className="p-6 text-slate-800 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                    />

                    {/* Email Footer */}
                    <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-400 space-y-1">
                      <p className="font-bold text-slate-600">Elizabeth Signature Gallery</p>
                      <p>Ruko Golden Boulevard, Blok C-12, Tangerang Selatan</p>
                      <p>WhatsApp: 081344780652 | Instagram: @zelida00</p>
                      <p className="text-[10px] pt-2 text-slate-400">
                        Ini adalah email otomatis. Harap tidak membalas langsung ke alamat ini.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
                <Mail size={60} className="stroke-1 text-slate-300 mb-2" />
                <p className="text-lg font-medium">Buka Email untuk Melihat Rincian</p>
                <p className="text-sm max-w-sm mt-1">
                  Pilih salah satu log email di bilah kiri untuk membaca konten notifikasi HTML interaktif lengkap.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
