import React, { useState } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Phone,
  Instagram,
  Clock,
  Gift,
  Heart,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Product, CartItem, Order, PaymentMethod, OrderStatus } from "../types";
import Logo from "./Logo";
import { formatIDR } from "../utils/emailTemplates";

interface UserStorefrontProps {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  categories?: string[];
  onAddToCart: (product: Product) => void;
  onUpdateCartQty: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckout: (checkoutDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => void;
  activeOrder: Order | null;
  onOpenGateway: () => void;
  onCloseActiveOrder: () => void;
  onGoToAdmin: () => void;
  onOpenEmails: () => void;
  onSendCustomRequest: (
    customerName: string,
    customerEmail: string,
    details: string,
  ) => void;
}

export default function UserStorefront({
  products,
  orders,
  cart,
  categories = [
    "Classic Rose Collection",
    "Premium Hand Bouquets",
    "Graduation & Special Events",
    "Bloom Boxes & Arrangements",
    "Dried & Preserved Flowers",
  ],
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onCheckout,
  activeOrder,
  onOpenGateway,
  onCloseActiveOrder,
  onGoToAdmin,
  onOpenEmails,
  onSendCustomRequest,
}: UserStorefrontProps) {
  // Navigation & Filtering States
  const [activeTab, setActiveTab] = useState<"SHOP" | "TRACK">("SHOP");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"POPULAR" | "PRICE_LOW" | "PRICE_HIGH">(
    "POPULAR",
  );

  // Tracking search state
  const [trackOrderId, setTrackOrderId] = useState("");
  const [searchedTrackOrder, setSearchedTrackOrder] = useState<Order | null>(
    null,
  );
  const [trackError, setTrackError] = useState("");

  // Forgotten Order ID Lookup state
  const [forgotContactQuery, setForgotContactQuery] = useState("");

  // Cart Drawer State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Custom Design Request Form State
  const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  const [customDetails, setCustomDetails] = useState("");
  const [customBudget, setCustomBudget] = useState("500000");
  const [customOccasion, setCustomOccasion] = useState("Pernikahan / Wedding");

  const handleCustomRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const detailsText = `Momen Spesial: ${customOccasion}\nBudget: ${formatIDR(Number(customBudget))}\nNo. WA: ${customPhone}\nDetail Kustom:\n${customDetails}`;
    onSendCustomRequest(customName, customEmail, detailsText);

    // reset states
    setCustomName("");
    setCustomEmail("");
    setCustomPhone("");
    setCustomDetails("");
    setCustomBudget("500000");
    setIsCustomRequestOpen(false);
  };

  // Checkout Form States
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("QRIS");
  const [cardMessage, setCardMessage] = useState("");

  // Calculate cart total & count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  // Filter and sort products
  const processedProducts = React.useMemo(() => {
    let result = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        categoryFilter === "ALL" || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    });

    if (sortBy === "PRICE_LOW") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "PRICE_HIGH") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // POPULAR
      result.sort((a, b) => b.salesCount - a.salesCount);
    }

    return result;
  }, [products, searchQuery, categoryFilter, sortBy]);

  // Handle placing the order (Checkout submit)
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    onCheckout({
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: custPhone,
      customerAddress: custAddress,
      paymentMethod: payMethod,
      notes: cardMessage,
    });

    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    // Active order overlay will now automatically be active in parent App.tsx
  };

  // Track Order in-app search
  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError("");
    setSearchedTrackOrder(null);

    const cleanId = trackOrderId.trim().replace("#", "");
    const found = orders.find(
      (o) => o.id.toLowerCase() === cleanId.toLowerCase(),
    );

    if (found) {
      setSearchedTrackOrder(found);
    } else {
      setTrackError(
        "ID Pesanan tidak ditemukan! Pastikan Anda memasukkan kode ID yang benar (contoh: ESG-1001).",
      );
    }
  };

  const fillDemoTracker = (id: string) => {
    setTrackOrderId(id);
    const found = orders.find((o) => o.id === id);
    if (found) setSearchedTrackOrder(found);
  };

  return (
    <div
      className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans"
      id="user-storefront-layout"
    >
      {/* Top Banner Contact bar */}
      <div className="bg-[#5B745C] text-stone-100 text-[11px] py-2 px-6 flex justify-between items-center border-b border-stone-200">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Phone size={11} className="text-[#D4A373]" />
            <span>081344780652</span>
          </span>
          <span className="flex items-center gap-1">
            <Instagram size={11} className="text-[#D4A373]" />
            <span>@zelida00</span>
          </span>
        </div>
      </div>

      {/* Main Brand Navbar */}
      <header className="sticky top-0 bg-[#FDFBF7]/95 backdrop-blur-md shadow-xs z-30 border-b border-stone-200 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="sm" showDetails={false} />
          <div>
            <span className="font-serif italic font-extrabold text-lg text-stone-900 block tracking-tight leading-none">
              Elizabeth Signature
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#D4A373] font-bold">
              Gallery
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-stone-600">
          <button
            onClick={() => {
              setActiveTab("SHOP");
            }}
            className={`hover:text-stone-900 transition ${activeTab === "SHOP" ? "text-[#D4A373] border-b-2 border-[#D4A373] pb-1" : ""}`}
          >
            Katalog Buket
          </button>
          <button
            onClick={() => {
              setActiveTab("TRACK");
            }}
            className={`hover:text-stone-900 transition ${activeTab === "TRACK" ? "text-[#D4A373] border-b-2 border-[#D4A373] pb-1" : ""}`}
          >
            Lacak Pesanan Anda
          </button>
        </nav>

        {/* Cart & Actions */}
        <div className="flex items-center gap-3">
          {/* Email notifications log shortcut */}
          <button
            onClick={onOpenEmails}
            className="p-2 relative bg-stone-100 hover:bg-stone-200 rounded-full text-stone-600 transition border border-stone-200"
            title="Lihat email masuk Anda"
          >
            <Clock size={16} />
            <span className="absolute -top-1 -right-1 bg-[#D4A373] text-stone-950 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              📧
            </span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-[#5B745C] hover:bg-[#4d634e] active:scale-95 text-white px-4 py-2 rounded-full flex items-center gap-2 transition shadow-md cursor-pointer"
          >
            <ShoppingCart size={16} className="text-[#D4A373]" />
            <span className="text-xs font-extrabold">{cartCount}</span>
          </button>
        </div>
      </header>

      {/* Track Orders Notification Banner */}
      {activeOrder && (
        <div className="bg-[#F8F5F2] border-y border-stone-200 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-900">
          <p className="font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#5B745C] rounded-full animate-ping"></span>
            <span>
              Pesanan Anda saat ini sedang dalam proses pembayaran:{" "}
              <strong>#{activeOrder.id}</strong> ({formatIDR(activeOrder.total)}
              )
            </span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={onOpenGateway}
              className="bg-[#5B745C] hover:bg-[#4d634e] text-white font-bold px-3 py-1 rounded-lg transition"
            >
              Bayar Sekarang
            </button>
            <button
              onClick={onCloseActiveOrder}
              className="text-stone-400 hover:text-stone-700 font-bold p-1"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Rendering */}
      <main className="min-h-[500px]">
        {activeTab === "SHOP" ? (
          <div className="animate-fade-in space-y-12">
            {/* Elegant Hero Section */}
            <section
              className="relative bg-[#5B745C] text-white py-20 px-8 text-center overflow-hidden border-b-8 border-[#D4A373]"
              id="storefront-hero"
            >
              {/* Blur Backdrops */}
              <div className="absolute top-[-20%] left-[-10%] w-80 h-80 rounded-full bg-[#D4A373]/10 blur-3xl"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 rounded-full bg-[#F8F5F2]/10 blur-3xl"></div>

              <div className="max-w-3xl mx-auto space-y-6 relative z-10">
                <Logo size="lg" showDetails={false} className="mb-2" />
                <div className="space-y-2">
                  <span className="text-xs text-stone-100 font-bold tracking-widest uppercase font-mono">
                    ✦ Rangkaian Bunga Eksklusif & Florist Premium ✦
                  </span>
                  <h1 className="text-3xl md:text-5xl font-serif italic font-medium leading-tight">
                    Ungkapkan Rasa Kasih Anda dengan Kemewahan Sempurna
                  </h1>
                </div>
                <p className="text-xs md:text-sm text-stone-100 max-w-xl mx-auto leading-relaxed">
                  Elizabeth Signature Gallery merangkai mawar segar pilihan,
                  lily, dan tulip import dengan sentuhan seni tingkat tinggi.
                  Sempurna untuk romansa, hari wisuda, pernikahan, maupun kado
                  ulang tahun premium.
                </p>
                <div className="pt-2">
                  <a
                    href="#catalog-container"
                    className="bg-[#D4A373] hover:bg-[#c29363] active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-full shadow-lg transition duration-200 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Mulai Belanja Buket</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </section>

            {/* Catalog Container */}
            <section
              className="max-w-7xl mx-auto px-6 py-8 space-y-8"
              id="catalog-container"
            >
              {/* Filter Toolbar */}
              <div className="bg-[#F8F5F2] border border-stone-200 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Categories Pills */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setCategoryFilter("ALL")}
                    className={`text-xs px-4 py-2 rounded-full border transition font-semibold ${
                      categoryFilter === "ALL"
                        ? "bg-[#5B745C] border-[#5B745C] text-white shadow-sm"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    Semua Koleksi
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`text-xs px-4 py-2 rounded-full border transition font-semibold ${
                        categoryFilter === cat
                          ? "bg-[#5B745C] border-[#5B745C] text-white shadow-sm"
                          : "bg-white border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search & Sort controls */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <div className="relative w-full md:w-48">
                    <Search
                      size={14}
                      className="absolute left-3 top-3 text-stone-400"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari mawar/lily..."
                      className="w-full bg-white border border-stone-200 rounded-xl py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-[#D4A373]"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-stone-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#D4A373] font-bold text-stone-700"
                  >
                    <option value="POPULAR">Terpopuler</option>
                    <option value="PRICE_LOW">Harga Terendah</option>
                    <option value="PRICE_HIGH">Harga Tertinggi</option>
                  </select>
                </div>
              </div>

              {/* Products List Grid */}
              {processedProducts.length === 0 ? (
                <div className="text-center py-20 bg-[#F8F5F2] border border-stone-200 rounded-3xl space-y-3">
                  <ShoppingBag
                    size={48}
                    className="mx-auto text-stone-300 stroke-1 animate-bounce"
                  />
                  <p className="text-stone-800 font-bold">
                    Produk Tidak Ditemukan
                  </p>
                  <p className="text-xs text-stone-500">
                    Coba kata kunci pencarian yang lain atau ganti kategori.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {processedProducts.map((p) => {
                    const isOutOfStock = p.stock === 0;
                    return (
                      <div
                        key={p.id}
                        className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                        id={`product-card-${p.id}`}
                      >
                        {/* Image Frame */}
                        <div className="relative aspect-square overflow-hidden bg-stone-50">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          {/* Stock badge overlay */}
                          {isOutOfStock ? (
                            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
                              <span className="bg-red-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md">
                                HABIS (SOLD OUT)
                              </span>
                            </div>
                          ) : p.stock <= 5 ? (
                            <div className="absolute top-3 left-3 bg-red-600 text-white font-extrabold text-[9px] px-2 py-1 rounded-md shadow-xs uppercase tracking-wider">
                              Stok Terbatas: {p.stock} Pcs
                            </div>
                          ) : null}

                          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#D4A373] font-bold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-0.5 border border-stone-100">
                            ★ {p.rating.toFixed(1)}
                          </div>
                        </div>

                        {/* Description Body */}
                        <div className="p-5 flex-1 flex flex-col space-y-2">
                          <span className="text-[10px] font-bold text-[#D4A373] uppercase tracking-wider">
                            {p.category}
                          </span>
                          <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2">
                            {p.name}
                          </h3>
                          <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed flex-1">
                            {p.description}
                          </p>

                          <div className="pt-3 border-t border-stone-150 flex items-center justify-between">
                            <span className="font-extrabold text-stone-900 font-mono text-sm">
                              {formatIDR(p.price)}
                            </span>

                            <button
                              disabled={isOutOfStock}
                              onClick={() => onAddToCart(p)}
                              className={`text-xs font-bold py-1.5 px-3 rounded-lg transition duration-200 cursor-pointer ${
                                isOutOfStock
                                  ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                                  : "bg-[#5B745C] hover:bg-[#D4A373] hover:text-white text-white"
                              }`}
                            >
                              Tambah
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Custom Order CTA & Info Section */}
            <section
              className="max-w-7xl mx-auto px-6 py-6"
              id="custom-design-section"
            >
              <div className="bg-gradient-to-br from-[#5B745C] to-[#4d634e] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-[#D4A373]">
                <div className="absolute top-[-30%] right-[-10%] w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
                <div className="space-y-4 max-w-2xl relative z-10 text-left">
                  <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-xs py-1 px-3 rounded-full text-[10px] font-bold tracking-wider uppercase text-[#F8F5F2]">
                    ✨ 100% Custom Request & Artificial Premium ✨
                  </div>
                  <h2 className="text-2xl md:text-4xl font-serif italic font-medium leading-tight text-white">
                    Ingin Desain Buket Custom Sesuai Pilihan Anda?
                  </h2>
                  <p className="text-xs md:text-sm text-stone-100 leading-relaxed">
                    Setiap momen wisuda, ulang tahun, lamaran, atau pernikahan
                    adalah cerita unik. Elizabeth Signature menyediakan{" "}
                    <strong>Buket Bunga Artificial / Imitasi Premium</strong>{" "}
                    (satin, felt, soap, dried, latex) yang tetap cantik
                    selamanya tanpa layu. Anda bebas memilih kombinasi warna
                    mawar, bahan kertas pembungkus (wrapping), hingga
                    menyesuaikan budget impian Anda!
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-stone-100/90 pt-1 text-left">
                    <span className="flex items-center gap-1.5 bg-stone-900/10 py-1 px-2.5 rounded-lg border border-white/10">
                      ✓ Kelopak Sutra & Latex Real-Touch
                    </span>
                    <span className="flex items-center gap-1.5 bg-stone-900/10 py-1 px-2.5 rounded-lg border border-white/10">
                      ✓ Custom Warna & Wrap
                    </span>
                    <span className="flex items-center gap-1.5 bg-stone-900/10 py-1 px-2.5 rounded-lg border border-white/10">
                      ✓ Tahan Selamanya
                    </span>
                  </div>
                </div>
                <div className="relative z-10 shrink-0 w-full md:w-auto text-left md:text-right">
                  <button
                    onClick={() => setIsCustomRequestOpen(true)}
                    className="w-full md:w-auto bg-[#D4A373] hover:bg-[#c29363] text-white font-extrabold text-xs px-8 py-4 rounded-full shadow-lg transition duration-200 uppercase tracking-wider cursor-pointer"
                  >
                    Kirim Request Desain (Kustom)
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* TAB 2: LIVE ORDER TRACKING PANEL */
          <div
            className="max-w-3xl mx-auto px-6 py-12 animate-fade-in space-y-8"
            id="track-order-tab"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif italic font-bold text-stone-900">
                Lacak Status Pesanan Anda
              </h2>
              <p className="text-xs text-stone-500">
                Ketikkan nomor ID Pesanan unik Anda untuk memantau status secara
                live.
              </p>
            </div>

            {/* Tracking Search Input */}
            <form
              onSubmit={handleTrackSearch}
              className="bg-[#F8F5F2] p-6 rounded-3xl border border-stone-200/80 flex items-center gap-3"
            >
              <input
                type="text"
                required
                value={trackOrderId}
                onChange={(e) => setTrackOrderId(e.target.value)}
                placeholder="Masukkan ID Pesanan (contoh: ESG-1001)"
                className="flex-1 bg-white border border-stone-200 rounded-2xl py-3 px-4 text-sm font-mono font-bold focus:outline-none focus:border-[#5B745C] focus:ring-1 focus:ring-[#5B745C] uppercase"
              />
              <button
                type="submit"
                className="bg-[#5B745C] hover:bg-[#D4A373] hover:text-white text-white font-bold py-3 px-6 rounded-2xl text-xs transition cursor-pointer shrink-0 shadow-md"
              >
                Cari Pesanan
              </button>
            </form>

            {/* Error state */}
            {trackError && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs text-red-600">
                {trackError}
              </div>
            )}

            {/* Tracking detail block */}
            {searchedTrackOrder ? (
              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-md animate-zoom-in space-y-6 p-6">
                {/* Header & Back Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchedTrackOrder(null);
                        setTrackError("");
                      }}
                      className="bg-stone-100 hover:bg-[#5B745C] hover:text-white text-stone-700 font-bold py-2 px-3 rounded-xl text-xs transition duration-200 flex items-center gap-1 cursor-pointer shrink-0 border border-stone-200"
                      title="Kembali ke pencarian ID"
                    >
                      <span>← Kembali</span>
                    </button>
                    <div>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase font-mono">
                        Kode Pesanan
                      </span>
                      <h3 className="text-lg font-mono font-extrabold text-[#D4A373]">
                        #{searchedTrackOrder.id}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 font-semibold uppercase block">
                      Waktu Dibuat
                    </span>
                    <span className="text-xs text-stone-700 font-bold">
                      {new Date(searchedTrackOrder.createdAt).toLocaleString(
                        "id-ID",
                      )}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress timeline */}
                <div className="py-4 space-y-6">
                  <h4 className="text-xs font-bold text-[#5B745C] uppercase tracking-wider">
                    Status Pengantaran Live:
                  </h4>

                  {/* Timeline bar */}
                  <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-1 before:bg-stone-250">
                    {/* Status 1: Created */}
                    <div className="relative">
                      <div
                        className={`absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                          searchedTrackOrder.status !== "CANCELLED"
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-red-500 border-red-500 text-white"
                        }`}
                      >
                        ✓
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">
                          Pesanan Masuk
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {searchedTrackOrder.status === "CANCELLED"
                            ? "Pesanan dibatalkan"
                            : "Menunggu pemrosesan pembayaran otomatis."}
                        </p>
                      </div>
                    </div>

                    {/* Status 2: PAID */}
                    <div className="relative">
                      <div
                        className={`absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                          [
                            "PAID",
                            "PROCESSED",
                            "SHIPPED",
                            "COMPLETED",
                          ].includes(searchedTrackOrder.status)
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-stone-300 text-stone-400"
                        }`}
                      >
                        {["PAID", "PROCESSED", "SHIPPED", "COMPLETED"].includes(
                          searchedTrackOrder.status,
                        )
                          ? "✓"
                          : "2"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">
                          Pembayaran Terverifikasi (Lunas)
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {[
                            "PAID",
                            "PROCESSED",
                            "SHIPPED",
                            "COMPLETED",
                          ].includes(searchedTrackOrder.status)
                            ? "Pembayaran berhasil dikonfirmasi oleh gateway secara otomatis."
                            : "Pembayaran belum tuntas."}
                        </p>
                      </div>
                    </div>

                    {/* Status 3: PROCESSED */}
                    <div className="relative">
                      <div
                        className={`absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                          ["PROCESSED", "SHIPPED", "COMPLETED"].includes(
                            searchedTrackOrder.status,
                          )
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-stone-300 text-stone-400"
                        }`}
                      >
                        {["PROCESSED", "SHIPPED", "COMPLETED"].includes(
                          searchedTrackOrder.status,
                        )
                          ? "✓"
                          : "3"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">
                          Sedang Dirangkai oleh Florist
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {["PROCESSED", "SHIPPED", "COMPLETED"].includes(
                            searchedTrackOrder.status,
                          )
                            ? "Bunga segar mawar/lily dipotong dan dirangkai khusus hand-crafted."
                            : "Menunggu rangkaian diproses."}
                        </p>
                      </div>
                    </div>

                    {/* Status 4: SHIPPED */}
                    <div className="relative">
                      <div
                        className={`absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                          ["SHIPPED", "COMPLETED"].includes(
                            searchedTrackOrder.status,
                          )
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-stone-300 text-stone-400"
                        }`}
                      >
                        {["SHIPPED", "COMPLETED"].includes(
                          searchedTrackOrder.status,
                        )
                          ? "✓"
                          : "4"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">
                          Sedang Dikirim oleh Kurir
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {["SHIPPED", "COMPLETED"].includes(
                            searchedTrackOrder.status,
                          )
                            ? "Buket bunga terlindungi air sedang dalam perjalanan kurir Elizabeth."
                            : "Belum dikirim."}
                        </p>
                      </div>
                    </div>

                    {/* Status 5: COMPLETED */}
                    <div className="relative">
                      <div
                        className={`absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold ${
                          searchedTrackOrder.status === "COMPLETED"
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-white border-stone-300 text-stone-400"
                        }`}
                      >
                        {searchedTrackOrder.status === "COMPLETED" ? "✓" : "5"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900">
                          Pesanan Selesai (Diterima)
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {searchedTrackOrder.status === "COMPLETED"
                            ? "Buket bunga cantik sukses diserahkan kepada penerima dengan segar."
                            : "Buket bunga belum diserahterimakan."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items & Address Details */}
                <div className="border-t border-stone-100 pt-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600">
                    <div className="bg-[#F8F5F2] p-4 rounded-2xl border border-stone-200">
                      <p className="font-bold text-stone-800 uppercase text-[10px] mb-2 tracking-wider">
                        Item Buket:
                      </p>
                      {searchedTrackOrder.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-1 border-b border-stone-200/50"
                        >
                          <span>
                            {it.quantity}x {it.product.name}
                          </span>
                          <span className="font-bold text-stone-900 font-mono">
                            {formatIDR(it.product.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center font-bold text-[#5B745C] pt-3 text-sm">
                        <span>Total Terbayar:</span>
                        <span className="font-extrabold font-mono text-stone-950">
                          {formatIDR(searchedTrackOrder.total)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#F8F5F2] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <p className="font-bold text-stone-800 uppercase text-[10px] tracking-wider">
                        Lokasi Pengantaran:
                      </p>
                      <p>
                        <strong>Nama:</strong> {searchedTrackOrder.customerName}
                      </p>
                      <p>
                        <strong>No. HP:</strong>{" "}
                        {searchedTrackOrder.customerPhone}
                      </p>
                      <p>
                        <strong>Alamat:</strong>{" "}
                        {searchedTrackOrder.customerAddress}
                      </p>
                      <p>
                        <strong>Pesan Kartu:</strong>{" "}
                        <span className="italic">
                          "{searchedTrackOrder.notes || "Tidak ada pesan"}"
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#F8F5F2] p-6 rounded-3xl text-center space-y-4 border border-stone-200">
                  <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">
                    💡 Demo Shortcut - Lacak Pesanan Pengujian:
                  </p>
                  {orders.length === 0 ? (
                    <p className="text-xs text-stone-400">
                      Belum ada pesanan terdaftar di sistem. Silakan berbelanja
                      di katalog dulu!
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2.5 justify-center">
                      {orders.slice(0, 4).map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => fillDemoTracker(o.id)}
                          className="bg-white hover:bg-stone-200 border border-stone-300 py-1.5 px-3 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer text-[#D4A373] shadow-xs"
                        >
                          <span>Lacak #{o.id}</span>
                          <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 uppercase">
                            {o.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Forgotten Order ID Helper Card */}
                <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-[#5B745C]">
                    <HelpCircle size={18} />
                    <h3 className="font-bold text-sm text-stone-900">
                      Lupa Kode Pesanan (ID Pesanan) Anda?
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Jangan khawatir! Masukkan alamat <strong>Email</strong> atau{" "}
                    <strong>Nomor WhatsApp / HP</strong> yang Anda gunakan saat
                    memesan untuk menemukan kode pesanan Anda secara otomatis:
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={forgotContactQuery}
                      onChange={(e) => setForgotContactQuery(e.target.value)}
                      placeholder="Cari email (misal: budi@gmail.com) atau HP (0812...)"
                      className="flex-1 bg-[#F8F5F2] border border-stone-200 rounded-2xl py-2.5 px-4 text-xs focus:outline-none focus:border-[#5B745C]"
                    />
                    {forgotContactQuery && (
                      <button
                        type="button"
                        onClick={() => setForgotContactQuery("")}
                        className="text-stone-400 hover:text-stone-600 p-2 text-xs font-bold"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Results list for forgotten ID */}
                  {forgotContactQuery.trim() !== "" && (
                    <div className="space-y-3 pt-2">
                      <p className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                        Hasil Pencarian Pesanan:
                      </p>
                      {(() => {
                        const q = forgotContactQuery.toLowerCase().trim();
                        const matches = orders.filter(
                          (o) =>
                            o.customerEmail.toLowerCase().includes(q) ||
                            o.customerPhone.includes(q) ||
                            o.customerName.toLowerCase().includes(q),
                        );

                        if (matches.length === 0) {
                          return (
                            <p className="text-xs text-stone-400 italic bg-[#F8F5F2] p-4 rounded-2xl text-center">
                              Tidak ditemukan pesanan yang cocok dengan kontak "
                              {forgotContactQuery}". Silakan periksa kembali
                              email atau nomor HP Anda.
                            </p>
                          );
                        }

                        return (
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {matches.map((o) => (
                              <div
                                key={o.id}
                                className="bg-[#F8F5F2] p-3 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-[#D4A373]">
                                      #{o.id}
                                    </span>
                                    <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded text-stone-700 font-bold uppercase">
                                      {o.status}
                                    </span>
                                  </div>
                                  <p className="text-stone-700 font-medium">
                                    An. {o.customerName} ({o.customerPhone})
                                  </p>
                                  <p className="text-[10px] text-stone-400">
                                    {new Date(o.createdAt).toLocaleString(
                                      "id-ID",
                                    )}{" "}
                                    • Total {formatIDR(o.total)}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => fillDemoTracker(o.id)}
                                  className="bg-[#5B745C] hover:bg-[#D4A373] text-white font-bold py-1.5 px-3 rounded-xl text-[11px] shrink-0 transition"
                                >
                                  Lacak ID Ini
                                </button>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Elegant Footer */}
      <footer
        className="bg-[#5B745C] text-stone-100 border-t-4 border-[#D4A373] py-12 px-6 mt-16 text-xs"
        id="storefront-footer"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo size="sm" showDetails={false} />
              <span className="font-serif italic font-extrabold text-[#D4A373] text-lg">
                Elizabeth Signature
              </span>
            </div>
            <p className="text-stone-100/90 leading-relaxed text-[11px]">
              Toko e-commerce buket bunga terkemuka di Indonesia yang memadukan
              keindahan premium, bunga segar pilihan, dan kemudahan pembayaran
              otomatis.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#D4A373] uppercase tracking-widest text-[10px]">
              Layanan & Koleksi
            </h4>
            <ul className="space-y-2 text-stone-200">
              <li>Classic Rose Collection</li>
              <li>Premium Hand Bouquets</li>
              <li>Bloom Boxes & Arrangements</li>
              <li>Graduation & Corporate Special</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#D4A373] uppercase tracking-widest text-[10px]">
              Kontak Toko
            </h4>
            <ul className="space-y-2 text-stone-200 font-mono">
              <li>WhatsApp: 081344780652</li>
              <li>Instagram: @zelida00</li>
              <li>Alamat: BTN Ariyau, Jl. Ebabu, Hawai, Sentani</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#D4A373] uppercase tracking-widest text-[10px]">
              Otomatisasi WooCommerce
            </h4>
            <p className="text-stone-200 text-[11px] leading-relaxed">
              Sistem ini mendemonstrasikan integrasi payment gateway lokal
              (QRIS, VA Transfer), auto-deduction stock, sinkronisasi dasbor
              analitik admin, dan trigger SMTP email otomatis.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[#D4A373]/30 mt-10 pt-6 text-center text-stone-200/75 flex justify-center items-center">
          <p>
            © 2026 Elizabeth Signature Gallery. Crafted elegantly with deep
            local Indonesian integration.
          </p>
        </div>
      </footer>

      {/* CART DRAWER BACKDROP AND ELEMENT */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end"
          id="cart-drawer-overlay"
        >
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            {/* Header */}
            <div className="bg-[#0B132B] text-white px-6 py-5 flex items-center justify-between border-b border-[#C5A059]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-amber-400" size={18} />
                <h3 className="font-bold font-serif italic text-md text-amber-100">
                  Keranjang Belanja Anda
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                  <ShoppingCart
                    size={48}
                    className="stroke-1 mb-2 text-slate-300"
                  />
                  <p className="text-sm font-bold">
                    Keranjang Anda Masih Kosong
                  </p>
                  <p className="text-xs px-6 mt-1">
                    Tambahkan buket bunga cantik dari katalog toko untuk
                    melanjutkan pemesanan.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-4 flex gap-3 first:pt-0"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">
                          {item.product.category}
                        </p>
                        <p className="text-xs font-extrabold text-slate-950 font-mono">
                          {formatIDR(item.product.price)}
                        </p>

                        {/* Qty selectors */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-slate-200 rounded-lg">
                            <button
                              onClick={() =>
                                onUpdateCartQty(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="p-1 text-slate-500 hover:bg-slate-100 rounded-l-lg"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateCartQty(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="p-1 text-slate-500 hover:bg-slate-100 rounded-r-lg"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveFromCart(item.product.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Hapus item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="bg-slate-50 p-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-slate-800">
                  <span className="text-xs font-bold uppercase text-slate-500">
                    Subtotal Belanja:
                  </span>
                  <span className="text-xl font-extrabold font-mono text-slate-950">
                    {formatIDR(cartSubtotal)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 leading-normal bg-white p-2.5 rounded-lg border border-slate-200/60">
                  🎁 Flat Rate Shipping: Kami menyediakan layanan pengantaran
                  GRATIS (Gratis Ongkir) ke seluruh wilayah Kota Tangerang &
                  Jakarta Selatan.
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-extrabold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                >
                  <span>Lanjutkan ke Pengisian Alamat</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT OVERLAY MODAL FORM */}
      {isCheckoutOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          id="checkout-modal-form"
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-zoom-in border border-slate-100">
            <div className="bg-[#0B132B] p-5 text-white flex items-center justify-between border-b border-[#C5A059]">
              <h3 className="font-bold text-md font-serif italic text-amber-100">
                Form Pemesanan & Alamat Pengiriman
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handlePlaceOrder}
              className="p-6 space-y-4 max-h-[500px] overflow-y-auto text-xs text-slate-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Nama Pemesan / Pembeli
                  </label>
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                    placeholder="Contoh: Ronal Siregar"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Email Aktif (Notifikasi Otomatis)
                  </label>
                  <input
                    type="email"
                    required
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                    placeholder="Contoh: ronaulisrgr@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    No. WhatsApp Aktif
                  </label>
                  <input
                    type="text"
                    required
                    value={custPhone}
                    onChange={(e) =>
                      setCustPhone(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono"
                    placeholder="Contoh: 081234567890"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">
                    Metode Pembayaran Gateway
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) =>
                      setPayMethod(e.target.value as PaymentMethod)
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-bold text-slate-800"
                  >
                    <option value="QRIS">
                      QRIS Otomatis (Dana, OVO, GoPay, LinkAja)
                    </option>
                    <option value="VA_BCA">
                      Virtual Account BCA (Verifikasi Otomatis)
                    </option>
                    <option value="VA_MANDIRI">
                      Virtual Account Mandiri (Verifikasi Otomatis)
                    </option>
                    <option value="GOPAY">GoPay Push Notification</option>
                    <option value="OVO">OVO Push Notification</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Alamat Lengkap Pengiriman Buket
                </label>
                <textarea
                  rows={2}
                  required
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  placeholder="Isikan alamat kirim rumah / gedung / florist drop-off..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">
                  Pesan Khusus di Kartu Ucapan (Gift Card Message)
                </label>
                <textarea
                  rows={2}
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 italic font-medium"
                  placeholder="Tuliskan ucapan Anda di sini... (Contoh: Happy Birthday rona! Semoga bahagia selalu.)"
                />
              </div>

              {/* Order summary review inside checkout */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <p className="font-bold text-slate-800 uppercase text-[9px] tracking-wider">
                  Ringkasan Tagihan:
                </p>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Total Harga Bunga:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {formatIDR(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Biaya Pengiriman Flat:</span>
                  <span className="text-emerald-600 font-bold">GRATIS</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Jumlah Tagihan Akhir:</span>
                  <span className="font-extrabold font-mono text-slate-950">
                    {formatIDR(cartSubtotal)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0B132B] hover:bg-[#1E2B4B] text-white text-xs font-extrabold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CreditCard size={14} className="text-amber-400" />
                  <span>Kirim Pesanan & Bayar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DESIGN REQUEST MODAL OVERLAY */}
      {isCustomRequestOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          id="custom-request-modal"
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in border border-stone-200">
            <div className="bg-[#5B745C] p-5 text-white flex items-center justify-between border-b-4 border-[#D4A373]">
              <div>
                <h3 className="font-bold text-md font-serif italic text-stone-100 flex items-center gap-1.5">
                  <span>✨ Request Desain Buket Custom</span>
                </h3>
                <p className="text-[10px] text-stone-200 uppercase tracking-widest mt-0.5">
                  Bunga Artificial & Material Premium
                </p>
              </div>
              <button
                onClick={() => setIsCustomRequestOpen(false)}
                className="text-stone-300 hover:text-white p-1 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCustomRequestSubmit}
              className="p-6 space-y-4 max-h-[480px] overflow-y-auto text-xs text-stone-700 text-left"
            >
              <div className="bg-[#F8F5F2] p-4 rounded-2xl border border-stone-200 text-[11px] leading-relaxed text-stone-600 mb-2">
                <strong>💡 Catatan Kustomisasi:</strong> Anda bebas meminta
                desain model apa saja, perpaduan bunga artificial
                (satin/latex/silk/dried), warna kertas pembungkus, aksen pita,
                hingga penulisan kartu ucapan khusus sesuai selera.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-bold uppercase">
                    Nama Anda
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5B745C]"
                    placeholder="Contoh: Ronal Siregar"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-bold uppercase">
                    Email Aktif
                  </label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5B745C]"
                    placeholder="Contoh: ronaulisrgr@gmail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-bold uppercase">
                    No. WhatsApp Aktif
                  </label>
                  <input
                    type="text"
                    required
                    value={customPhone}
                    onChange={(e) =>
                      setCustomPhone(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5B745C] font-mono"
                    placeholder="Contoh: 081234567890"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-400 font-bold uppercase">
                    Acara / Momen Spesial
                  </label>
                  <select
                    value={customOccasion}
                    onChange={(e) => setCustomOccasion(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5B745C] font-semibold text-stone-800"
                  >
                    <option value="Pernikahan / Wedding">
                      Pernikahan / Wedding
                    </option>
                    <option value="Wisuda / Graduation">
                      Wisuda / Graduation
                    </option>
                    <option value="Ulang Tahun / Birthday">
                      Ulang Tahun / Birthday
                    </option>
                    <option value="Lamaran / Proposal">
                      Lamaran / Proposal
                    </option>
                    <option value="Hari Ibu / Mother's Day">
                      Hari Ibu / Mother's Day
                    </option>
                    <option value="Lainnya">Lainnya (Kustom Bebas)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-stone-400 font-bold uppercase">
                  Anggaran / Target Budget (IDR)
                </label>
                <select
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5B745C] font-semibold text-stone-800"
                >
                  <option value="150000">Rp 150.000 (Minimalis Elegan)</option>
                  <option value="300000">Rp 300.000 (Medium Deluxe)</option>
                  <option value="500000">Rp 500.000 (Premium Signature)</option>
                  <option value="800000">
                    Rp 800.000 (Royal Lux Exclusive)
                  </option>
                  <option value="1500000">
                    Rp 1.500.000+ (Grand Masterpiece)
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-stone-400 font-bold uppercase">
                  Deskripsi Ide Desain Pilihan Anda
                </label>
                <textarea
                  rows={4}
                  required
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5B745C]"
                  placeholder="Deskripsikan keinginan Anda (contoh: 'Ingin mawar satin pink dipadu lily latex putih, dibungkus kertas wrapping warna nude beige pastel dengan pita satin gold lebar')"
                />
              </div>

              <div className="pt-3 border-t border-stone-150 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustomRequestOpen(false)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold py-2.5 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#5B745C] hover:bg-[#4d634e] text-white text-xs font-extrabold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Kirim Request Kustom</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
