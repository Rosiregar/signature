import React, { useState, useEffect } from 'react';
import { initialProducts } from './data/initialProducts';
import { Product, Order, CartItem, EmailNotification, OrderStatus, PaymentMethod } from './types';
import UserStorefront from './components/UserStorefront';
import AdminLogin2FA from './components/AdminLogin2FA';
import AdminDashboard from './components/AdminDashboard';
import PaymentGateway from './components/PaymentGateway';
import EmailSimulator from './components/EmailSimulator';
import { createEmailNotification } from './utils/emailTemplates';
import { Sparkles, Mail, Check, AlertCircle } from 'lucide-react';

export default function App() {
  // --- Persistent States from LocalStorage with Initial Seeding ---
  
  // 0. Email Simulator Role & Open State
  const [isEmailsOpen, setIsEmailsOpen] = useState(false);
  const [emailSimulatorRole, setEmailSimulatorRole] = useState<'ADMIN' | 'USER'>('USER');

  // 1. Categories State
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('elizabeth_categories');
    return saved ? JSON.parse(saved) : [
      'Classic Rose Collection',
      'Premium Hand Bouquets',
      'Graduation & Special Events',
      'Bloom Boxes & Arrangements',
      'Dried & Preserved Flowers'
    ];
  });

  useEffect(() => {
    localStorage.setItem('elizabeth_categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (catName: string) => {
    const trimmed = catName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
      triggerToast('Kategori Ditambahkan', `Kategori "${trimmed}" berhasil dibuat.`);
    }
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;

    setCategories((prev) => prev.map((c) => (c === oldName ? trimmed : c)));
    setProducts((prevProds) =>
      prevProds.map((p) => (p.category === oldName ? { ...p, category: trimmed } : p))
    );
    triggerToast('Kategori Diperbarui', `Kategori "${oldName}" diubah menjadi "${trimmed}".`);
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (categories.length <= 1) {
      triggerToast('Gagal Hapus', 'Minimal harus ada 1 kategori aktif.');
      return;
    }
    const nextCategories = categories.filter((c) => c !== catToDelete);
    const fallbackCategory = nextCategories[0];

    setCategories(nextCategories);
    setProducts((prevProds) =>
      prevProds.map((p) => (p.category === catToDelete ? { ...p, category: fallbackCategory } : p))
    );
    triggerToast('Kategori Dihapus', `Kategori "${catToDelete}" dihapus. Produk terkait dipindahkan ke "${fallbackCategory}".`);
  };

  // 1. Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('elizabeth_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // 2. Orders State (with beautiful seed historical orders for analytic charts)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('elizabeth_orders');
    if (saved) return JSON.parse(saved);

    // Initial historical orders seed
    const dayAgo = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() - days);
      return d.toISOString();
    };

    const seeds: Order[] = [
      {
        id: 'ESG-1001',
        customerName: 'Budi Santoso',
        customerEmail: 'budi.santoso@gmail.com',
        customerPhone: '08122334455',
        customerAddress: 'Apartemen Sudirman Tower, Lantai 15, Jakarta Pusat',
        items: [{ product: initialProducts[0], quantity: 2 }], // 2x Red Rose (900.000)
        total: 900000,
        status: 'COMPLETED',
        paymentMethod: 'QRIS',
        paymentDetails: { expiryTime: dayAgo(4) },
        createdAt: dayAgo(4)
      },
      {
        id: 'ESG-1002',
        customerName: 'Siti Aminah',
        customerEmail: 'siti.aminah@yahoo.com',
        customerPhone: '08571122334',
        customerAddress: 'Jalan Gandaria Tengah III No. 42, Jakarta Selatan',
        items: [{ product: initialProducts[7], quantity: 1 }], // 1x Carnation (350.000)
        total: 350000,
        status: 'COMPLETED',
        paymentMethod: 'VA_BCA',
        paymentDetails: { vaNumber: '883018571122334', expiryTime: dayAgo(3) },
        createdAt: dayAgo(3)
      },
      {
        id: 'ESG-1003',
        customerName: 'Michael Hartono',
        customerEmail: 'michael.hart@outlook.com',
        customerPhone: '08139988776',
        customerAddress: 'Cluster Lavender, No. B-8, Gading Serpong, Tangerang Selatan',
        items: [
          { product: initialProducts[1], quantity: 1 }, // 1x Lily Rose (520.000)
          { product: initialProducts[2], quantity: 1 }  // 1x Sunflower (320.000)
        ],
        total: 840000,
        status: 'PAID',
        paymentMethod: 'GOPAY',
        paymentDetails: { phoneNumber: '08139988776', expiryTime: dayAgo(1) },
        createdAt: dayAgo(1)
      },
      {
        id: 'ESG-1004',
        customerName: 'Dewi Lestari',
        customerEmail: 'dewi.lest@gmail.com',
        customerPhone: '08124455667',
        customerAddress: 'Kebayoran Heights No. 12, Sektor 7 Bintaro, Tangerang Selatan',
        items: [{ product: initialProducts[4], quantity: 1 }], // 1x White Tulips (680.000)
        total: 680000,
        status: 'PENDING_PAYMENT',
        paymentMethod: 'VA_MANDIRI',
        paymentDetails: { vaNumber: '883028124455667', expiryTime: dayAgo(0) },
        createdAt: new Date().toISOString()
      }
    ];
    return seeds;
  });

  // 3. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('elizabeth_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const handleClearOrders = () => {
    setOrders([]);
    localStorage.setItem('elizabeth_orders', JSON.stringify([]));
    triggerToast('Data Pesanan Direset', 'Seluruh data pesanan pengujian berhasil dibersihkan.');
  };

  // 4. SMTP Emails log state
  const [notifications, setNotifications] = useState<EmailNotification[]>(() => {
    const saved = localStorage.getItem('elizabeth_notifications');
    if (saved) return JSON.parse(saved);

    // Initial email notifications seeds based on seeded orders
    const seeds: EmailNotification[] = [];
    return seeds;
  });

  // --- App View / Navigation Routing ---
  const [view, setView] = useState<'STORE' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD'>(() => {
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    if (
      hash === '#/admin' || 
      hash === '#admin' || 
      search.includes('admin') || 
      pathname === '/admin' || 
      pathname.endsWith('/admin')
    ) {
      return 'ADMIN_LOGIN';
    }
    return 'STORE';
  });

  // Listen to URL hash or query changes for routing
  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (
        hash === '#/admin' || 
        hash === '#admin' || 
        search.includes('admin') || 
        pathname === '/admin' || 
        pathname.endsWith('/admin')
      ) {
        setView((current) => (current === 'STORE' ? 'ADMIN_LOGIN' : current));
      } else if (hash === '#/' || hash === '' || hash === '#store') {
        setView((current) => (current !== 'STORE' ? 'STORE' : current));
      }
    };

    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  const handleExitAdmin = () => {
    try {
      let newUrl = window.location.origin + window.location.pathname;
      if (newUrl.endsWith('/admin')) {
        newUrl = newUrl.slice(0, -6);
      }
      window.history.pushState({}, '', newUrl || '/');
    } catch (e) {
      window.location.hash = '';
    }
    setView('STORE');
  };

  // Active transaction gateway overlay state
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);

  // Success Notification banner overlay
  const [successToast, setSuccessToast] = useState<{ title: string; desc: string } | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('elizabeth_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('elizabeth_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('elizabeth_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('elizabeth_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Helper trigger custom beautiful visual notifications
  const triggerToast = (title: string, desc: string) => {
    setSuccessToast({ title, desc });
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  const handleSendCustomRequest = (customerName: string, customerEmail: string, details: string) => {
    const mockEmail: EmailNotification = {
      id: `EMAIL-CUST-${Date.now()}`,
      orderId: 'CUSTOM-ORDER',
      to: 'admin@elizabethsignature.com',
      subject: `✨ Permintaan Desain Kustom Baru dari ${customerName}`,
      body: `Halo Admin Elizabeth Signature,\n\nAda permintaan pesanan buket kustom baru dari pelanggan:\n\nNama: ${customerName}\nEmail: ${customerEmail}\n\nDetail Desain:\n${details}\n\nHubungi pelanggan segera untuk koordinasi lebih lanjut!`,
      sentAt: new Date().toISOString(),
      status: 'PENDING_PAYMENT'
    };
    setNotifications((prev) => [mockEmail, ...prev]);
    triggerToast('Permintaan Terkirim!', 'Desain kustom Anda telah kami terima. Admin akan segera menghubungi Anda.');
  };

  // --- CORE CALLBACK ACTIONS ---

  // 1. Add item to Shopping Cart
  const handleAddToCart = (product: Product) => {
    // Check if stock is available
    if (product.stock <= 0) {
      triggerToast('Stok Habis!', `Maaf, buket bunga "${product.name}" sedang habis terjual.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          triggerToast('Batas Stok Terlampaui!', `Maaf, stok mawar/lily segar yang tersisa hanya ${product.stock} pcs.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      triggerToast('Ditambahkan ke Keranjang', `${product.name} telah dimasukkan.`);
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // 2. Adjust Cart Item quantities
  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    const prodObj = products.find((p) => p.id === productId);
    if (prodObj && quantity > prodObj.stock) {
      triggerToast('Stok Terbatas', `Maaf, batas maksimum pemesanan buket ini adalah ${prodObj.stock} pcs.`);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // 3. Delete from cart
  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  // 4. Checkout - Place Order (Creates order as PENDING_PAYMENT)
  const handleCheckout = (details: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => {
    // Generate order ID
    const nextNum = orders.length > 0 
      ? Math.max(...orders.map(o => parseInt(o.id.replace('ESG-', '')))) + 1 
      : 1001;
    const orderId = `ESG-${nextNum}`;

    // Determine simulated details based on selected gateway
    const vaNum = details.paymentMethod.startsWith('VA_') 
      ? `88301${details.customerPhone.slice(-10)}` 
      : undefined;

    const newOrder: Order = {
      id: orderId,
      customerName: details.customerName,
      customerEmail: details.customerEmail,
      customerPhone: details.customerPhone,
      customerAddress: details.customerAddress,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      status: 'PENDING_PAYMENT',
      paymentMethod: details.paymentMethod,
      paymentDetails: {
        vaNumber: vaNum,
        phoneNumber: details.paymentMethod === 'GOPAY' || details.paymentMethod === 'OVO' ? details.customerPhone : undefined,
        expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
      },
      createdAt: new Date().toISOString(),
      notes: details.notes
    };

    // Update orders list
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart
    setCart([]);

    // Trigger SMTP email automatically for PENDING_PAYMENT
    const initialEmail = createEmailNotification(newOrder, 'PENDING_PAYMENT');
    setNotifications((prev) => [initialEmail, ...prev]);

    // Active order set & Open gateway terminal
    setActiveOrder(newOrder);
    setIsGatewayOpen(true);

    triggerToast(
      'Pesanan Dibuat!',
      `Nomor #${orderId} menunggu penyelesaian pembayaran otomatis. Email tagihan terkirim.`
    );
  };

  // 5. Payment verified successfully (Lunas)
  const handlePaymentSuccess = (orderId: string) => {
    const existingOrder = orders.find((o) => o.id === orderId);
    if (!existingOrder) return;

    const updatedOrder: Order = { ...existingOrder, status: 'PAID' };

    // Update order status in list
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? updatedOrder : o))
    );

    // Automatically deduct product inventory and increase sales counts if coming from pending
    if (existingOrder.status === 'PENDING_PAYMENT') {
      setProducts((prevProds) =>
        prevProds.map((prod) => {
          const orderedItem = existingOrder.items.find((it) => it.product.id === prod.id);
          if (orderedItem) {
            const newStock = Math.max(0, prod.stock - orderedItem.quantity);
            const newSales = prod.salesCount + orderedItem.quantity;
            return { ...prod, stock: newStock, salesCount: newSales };
          }
          return prod;
        })
      );
    }

    // Automatically send 1 success notification email!
    const successEmail = createEmailNotification(updatedOrder, 'PAID');
    setNotifications((prevNotif) => [successEmail, ...prevNotif]);

    // Update active order copy if still focused
    if (activeOrder?.id === orderId) {
      setActiveOrder(updatedOrder);
    }

    triggerToast(
      'Pembayaran Sukses!',
      `Sistem mendeteksi transfer lunas pesanan #${orderId}. Email tanda terima terkirim otomatis.`
    );

    // Close payment gateway modal after success
    setIsGatewayOpen(false);
  };

  // 6. Update order status manually (Admin Panel Action)
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Prevent duplicate notification if status is unchanged
    if (targetOrder.status === status) return;

    const updatedOrder: Order = { ...targetOrder, status };

    // Update orders list
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? updatedOrder : o))
    );

    // If transition to PAID (and it was pending), do stock deduction and sales update
    if (status === 'PAID' && targetOrder.status === 'PENDING_PAYMENT') {
      setProducts((prevProds) =>
        prevProds.map((prod) => {
          const orderedItem = targetOrder.items.find((it) => it.product.id === prod.id);
          if (orderedItem) {
            const newStock = Math.max(0, prod.stock - orderedItem.quantity);
            const newSales = prod.salesCount + orderedItem.quantity;
            return { ...prod, stock: newStock, salesCount: newSales };
          }
          return prod;
        })
      );
    }

    // Automatically trigger status-based email notification ONCE!
    const statusEmail = createEmailNotification(updatedOrder, status);
    setNotifications((prevNotif) => [statusEmail, ...prevNotif]);

    if (activeOrder?.id === orderId) {
      setActiveOrder(updatedOrder);
    }

    triggerToast(
      'Status Diperbarui',
      `Pesanan #${orderId} kini berstatus: ${status.replace('_', ' ')}. Notifikasi email terkirim.`
    );
  };

  // 7. Admin Product Management Actions
  const handleAddProduct = (newProd: Omit<Product, 'id' | 'salesCount' | 'rating'>) => {
    const nextId = `prod-${products.length + 1}-${Math.floor(Math.random() * 100)}`;
    const productToAdd: Product = {
      ...newProd,
      id: nextId,
      salesCount: 0,
      rating: 5.0
    };
    setProducts((prev) => [productToAdd, ...prev]);
    triggerToast('Produk Ditambahkan', `Buket "${productToAdd.name}" telah aktif diterbitkan.`);
  };

  const handleEditProduct = (editedProd: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === editedProd.id ? editedProd : p))
    );
    triggerToast('Produk Diperbarui', `Buket "${editedProd.name}" berhasil di-update.`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    triggerToast('Produk Dihapus', 'Listing buket bunga dihapus dari katalog.');
  };

  // --- RENDER ---

  return (
    <div className="relative font-sans antialiased bg-slate-50 min-h-screen" id="elizabeth-main-app-node">
      
      {/* Dynamic View Routing Render */}
      {view === 'STORE' && (
        <UserStorefront
          products={products}
          orders={orders}
          cart={cart}
          categories={categories}
          onAddToCart={handleAddToCart}
          onUpdateCartQty={handleUpdateCartQty}
          onRemoveFromCart={handleRemoveFromCart}
          onCheckout={handleCheckout}
          activeOrder={activeOrder}
          onOpenGateway={() => setIsGatewayOpen(true)}
          onCloseActiveOrder={() => setActiveOrder(null)}
          onGoToAdmin={() => setView('ADMIN_LOGIN')}
          onOpenEmails={() => {
            setEmailSimulatorRole('USER');
            setIsEmailsOpen(true);
          }}
          onSendCustomRequest={handleSendCustomRequest}
        />
      )}

      {view === 'ADMIN_LOGIN' && (
        <AdminLogin2FA
          onLoginSuccess={() => setView('ADMIN_DASHBOARD')}
          onBackToStore={handleExitAdmin}
        />
      )}

      {view === 'ADMIN_DASHBOARD' && (
        <AdminDashboard
          products={products}
          orders={orders}
          notifications={notifications}
          categories={categories}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onClearOrders={handleClearOrders}
          onLogout={handleExitAdmin}
          onOpenEmails={() => {
            setEmailSimulatorRole('ADMIN');
            setIsEmailsOpen(true);
          }}
        />
      )}

      {/* AUTOMATED PAYMENT GATEWAY MODAL */}
      {isGatewayOpen && activeOrder && (
        <PaymentGateway
          order={activeOrder}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setIsGatewayOpen(false)}
        />
      )}

      {/* DEDICATED IN-APP SMTP EMAIL NOTIFICATION HUB */}
      <EmailSimulator
        notifications={notifications}
        activeRole={emailSimulatorRole}
        onClearAll={() => setNotifications([])}
        isOpen={isEmailsOpen}
        onClose={() => setIsEmailsOpen(false)}
      />

      {/* FLOATING SUCCESS TOAST BANNER */}
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-[#0B132B] text-white p-4 rounded-2xl shadow-2xl z-50 flex items-start gap-3 w-80 animate-slide-in border border-[#C5A059]/30" id="floating-success-toast">
          <div className="p-1.5 bg-[#C5A059] text-slate-950 rounded-lg shrink-0 mt-0.5">
            <Sparkles size={14} className="animate-spin" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-bold font-serif text-amber-200">{successToast.title}</h4>
            <p className="text-[11px] text-slate-300 leading-normal">{successToast.desc}</p>
          </div>
          <button 
            onClick={() => setSuccessToast(null)}
            className="text-slate-500 hover:text-slate-300 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* QUICK INBOX NOTIFICATION FLOATING ACCESS KEY */}
      <button
        onClick={() => setIsEmailsOpen(true)}
        className="fixed bottom-6 left-6 bg-slate-900 text-white p-3.5 rounded-full shadow-2xl z-40 border border-slate-800 hover:bg-slate-800 transition duration-300 flex items-center gap-2 group cursor-pointer"
        title="Lihat Email Notifikasi Masuk"
      >
        <Mail size={18} className="text-amber-400 group-hover:scale-110 transition" />
        <span className="text-xs font-bold hidden group-hover:inline-block animate-fade-in pr-1">
          SMTP Inbox ({notifications.length})
        </span>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
            {notifications.length}
          </span>
        )}
      </button>

    </div>
  );
}
