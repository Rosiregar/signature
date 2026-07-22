import { Order, EmailNotification } from '../types';

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

export function generateEmailTemplate(order: Order, status: Order['status']): { subject: string; body: string } {
  const orderId = order.id;
  const clientName = order.customerName;
  const itemsListHTML = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 0; color: #1e293b; font-weight: 500;">
          ${item.product.name}
          <div style="font-size: 11px; color: #64748b; font-weight: 400; margin-top: 2px;">
            ${item.product.category}
          </div>
        </td>
        <td style="padding: 12px 0; text-align: center; color: #475569;">${item.quantity}x</td>
        <td style="padding: 12px 0; text-align: right; color: #0f172a; font-weight: 600;">
          ${formatIDR(item.product.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  let subject = '';
  let heading = '';
  let message = '';
  let statusBadgeColor = '';
  let statusText = '';
  let callToAction = '';

  switch (status) {
    case 'PENDING_PAYMENT':
      subject = `[Tagihan Pembayaran] Menunggu Pembayaran Pesanan #${orderId} - Elizabeth Signature Gallery`;
      heading = 'Tagihan Pembayaran Anda';
      statusBadgeColor = '#f59e0b'; // Amber
      statusText = 'Menunggu Pembayaran';
      message = `
        <p>Halo, <strong>${clientName}</strong>!</p>
        <p>Terima kasih telah berbelanja di <strong>Elizabeth Signature Gallery</strong>. Pesanan buket bunga Anda telah kami terima dan saat ini sedang menunggu penyelesaian pembayaran.</p>
        <p>Silakan selesaikan pembayaran sebelum batas waktu yang ditentukan agar pesanan Anda dapat segera masuk antrean pengerjaan florist premium kami.</p>
      `;
      callToAction = `
        <div style="background-color: #f8fafc; border-left: 4px solid #DFBA6B; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="margin: 0 0 8px 0; color: #0b132b; font-size: 14px;">Metode Pembayaran Terpilih: <strong>${order.paymentMethod.replace('_', ' ')}</strong></h4>
          <p style="margin: 0; font-size: 13px; color: #475569;">
            ${
              order.paymentMethod === 'QRIS'
                ? 'Pindai QRIS dinamis yang tertera pada layar detail transaksi Anda menggunakan aplikasi e-wallet atau m-banking Anda.'
                : order.paymentMethod.startsWith('VA_')
                ? `Nomor Virtual Account: <strong style="font-family: monospace; font-size: 16px; color: #0f172a; letter-spacing: 1px;">${order.paymentDetails.vaNumber}</strong><br/>Silakan transfer sesuai dengan nominal total pesanan.`
                : `Masukkan nomor e-wallet aktif Anda <strong style="font-family: monospace; font-size: 14px;">${order.paymentDetails.phoneNumber}</strong> untuk menerima push-notification pembayaran di aplikasi.`
            }
          </p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #ef4444; font-weight: 600;">
            Batas Waktu: ${new Date(order.paymentDetails.expiryTime).toLocaleString('id-ID')} (2 Jam)
          </p>
        </div>
      `;
      break;

    case 'PAID':
      subject = `[Pembayaran Berhasil] Terima Kasih! Pembayaran #${orderId} Telah Diverifikasi`;
      heading = 'Pembayaran Anda Berhasil Diterima!';
      statusBadgeColor = '#10b981'; // Green
      statusText = 'Lunas & Menunggu Antrean';
      message = `
        <p>Halo, <strong>${clientName}</strong>!</p>
        <p>Sistem kami telah memverifikasi pembayaran Anda secara <strong>otomatis</strong>. Status pesanan Anda saat ini telah diperbarui menjadi <strong>Lunas</strong>.</p>
        <p>Terima kasih atas kepercayaan Anda membeli rangkaian bunga di Elizabeth Signature Gallery. Kami menjamin keaslian dan kesegaran bunga yang akan kami rangkai khusus untuk Anda.</p>
      `;
      callToAction = `
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <span style="color: #15803d; font-size: 14px; font-weight: bold;">✓ Transaksi Pembayaran Selesai Otomatis</span>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #166534;">Metode Gateway: ${order.paymentMethod.replace('_', ' ')} - Status: LUNAS (PAID)</p>
        </div>
      `;
      break;

    case 'PROCESSED':
      subject = `[Dalam Pengerjaan] Pesanan #${orderId} Sedang Dirangkai oleh Florist`;
      heading = 'Buket Bunga Anda Sedang Dirangkai!';
      statusBadgeColor = '#3b82f6'; // Blue
      statusText = 'Sedang Diproses';
      message = `
        <p>Halo, <strong>${clientName}</strong>!</p>
        <p>Kabar menyenangkan! Florist premium kami di <strong>Elizabeth Signature Gallery</strong> saat ini sedang memproses dan merangkai pesanan bunga Anda secara hand-crafted.</p>
        <p>Kami memastikan detail kesegaran bunga, kerapihan wrapping, dan kecocokan kartu ucapan Anda dipersiapkan secara maksimal demi memberikan impresi terbaik.</p>
      `;
      callToAction = `
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #0369a1; text-align: center; font-weight: 500;">
            ⏳ Florist kami sedang memotong tangkai, menyusun tatanan bunga, serta mencetak kartu pesan khusus Anda.
          </p>
        </div>
      `;
      break;

    case 'SHIPPED':
      subject = `[Pengiriman] Indah! Buket Bunga #${orderId} Sedang Menuju ke Alamat Anda`;
      heading = 'Pesanan Anda Sedang Dikirim!';
      statusBadgeColor = '#8b5cf6'; // Purple
      statusText = 'Sedang Dikirim';
      message = `
        <p>Halo, <strong>${clientName}</strong>!</p>
        <p>Rangkaian bunga pesanan Anda telah selesai dikerjakan dengan sempurna, dikemas dengan pelindung air agar tetap segar, dan saat ini <strong>sedang dalam perjalanan</strong> menuju lokasi pengiriman.</p>
        <p>Kurir kami akan menghubungi nomor penerima yang tertera setibanya di lokasi tujuan.</p>
      `;
      callToAction = `
        <div style="background-color: #faf5ff; border-left: 4px solid #8b5cf6; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="margin: 0 0 5px 0; color: #4c1d95; font-size: 13px;">Informasi Pengantaran:</h4>
          <p style="margin: 0; font-size: 12px; color: #5b21b6;">
            <strong>Penerima:</strong> ${order.customerName} (${order.customerPhone})<br/>
            <strong>Alamat Tujuan:</strong> ${order.customerAddress}<br/>
            <strong>Catatan Kurir:</strong> ${order.notes || 'Tidak ada catatan'}
          </p>
        </div>
      `;
      break;

    case 'COMPLETED':
      subject = `[Selesai] Selamat! Buket Cantik #${orderId} Telah Diterima dengan Baik`;
      heading = 'Pesanan Selesai & Diterima!';
      statusBadgeColor = '#10b981'; // Green
      statusText = 'Selesai';
      message = `
        <p>Halo, <strong>${clientName}</strong>!</p>
        <p>Pesanan buket bunga spesial Anda di <strong>Elizabeth Signature Gallery</strong> telah berhasil diserahkan kepada penerima dengan selamat dan segar!</p>
        <p>Kami sangat berharap rangkaian bunga ini dapat melengkapi kebahagiaan momen berharga Anda.</p>
      `;
      callToAction = `
        <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #92400e; font-weight: 600;">Bagikan Momen Indah Anda!</p>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #b45309;">
            Unggah foto buket bunga Anda ke Instagram, tag <strong style="color: #0b132b;">@zelida00</strong> dengan tagar #ElizabethSignatureGallery untuk mendapatkan diskon khusus 10% di pembelian berikutnya!
          </p>
        </div>
      `;
      break;

    case 'CANCELLED':
      subject = `[Pembatalan] Informasi Pembatalan Pesanan #${orderId}`;
      heading = 'Pesanan Anda Dibatalkan';
      statusBadgeColor = '#ef4444'; // Red
      statusText = 'Dibatalkan';
      message = `
        <p>Halo, <strong>${clientName}</strong>!</p>
        <p>Kami ingin menginformasikan bahwa pesanan Anda dengan kode referensi <strong>#${orderId}</strong> telah dibatalkan.</p>
        <p>Jika pembatalan ini dikarenakan kelalaian sistem atau Anda telah membayar namun status dibatalkan, silakan hubungi tim layanan pelanggan kami segera melalui WhatsApp di <strong>081344780652</strong> dengan melampirkan bukti transfer.</p>
      `;
      callToAction = '';
      break;
  }

  const body = `
    <div style="padding: 10px 0; line-height: 1.6; color: #334155;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #0b132b; font-family: 'Georgia', serif;">${heading}</h2>
        <span style="background-color: ${statusBadgeColor}; color: white; padding: 4px 10px; font-size: 11px; border-radius: 50px; font-weight: bold; text-transform: uppercase;">
          ${statusText}
        </span>
      </div>

      ${message}

      ${callToAction}

      <!-- Order Details -->
      <h3 style="font-size: 14px; text-transform: uppercase; tracking: 1px; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin: 25px 0 10px 0;">
        Rincian Pesanan #${orderId}
      </h3>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #cbd5e1; text-align: left; font-size: 12px; color: #475569;">
            <th style="padding: 8px 0;">Item Buket</th>
            <th style="padding: 8px 0; text-align: center;">Jumlah</th>
            <th style="padding: 8px 0; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsListHTML}
          <tr>
            <td colspan="2" style="padding: 15px 0 5px 0; text-align: right; color: #64748b; font-weight: 500;">Subtotal:</td>
            <td style="padding: 15px 0 5px 0; text-align: right; color: #0f172a; font-weight: 600;">${formatIDR(order.total)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 5px 0; text-align: right; color: #64748b; font-weight: 500;">Biaya Pengiriman (Flat):</td>
            <td style="padding: 5px 0; text-align: right; color: #0f172a; font-weight: 600;">Layanan Gratis</td>
          </tr>
          <tr style="border-top: 1px solid #cbd5e1;">
            <td colspan="2" style="padding: 12px 0; text-align: right; font-size: 16px; font-weight: bold; color: #0b132b;">Total Akhir:</td>
            <td style="padding: 12px 0; text-align: right; font-size: 18px; font-weight: 800; color: #0b132b;">${formatIDR(order.total)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Alamat Kirim -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-top: 25px;">
        <h4 style="margin: 0 0 5px 0; color: #334155; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Tujuan Pengiriman:</h4>
        <p style="margin: 0; font-size: 13px; color: #1e293b;">
          <strong>Nama:</strong> ${order.customerName}<br/>
          <strong>Telepon:</strong> ${order.customerPhone}<br/>
          <strong>Alamat:</strong> ${order.customerAddress}
        </p>
      </div>

      <p style="margin-top: 30px; font-size: 13px; text-align: center; color: #64748b;">
        Butuh bantuan segera mengenai pesanan Anda?<br/>
        Silakan hubungi WhatsApp kami di <strong style="color: #0b132b;">081344780652</strong> atau kunjungi kami di Instagram <strong style="color: #0b132b;">@zelida00</strong>.
      </p>
    </div>
  `;

  return { subject, body };
}

export function createEmailNotification(order: Order, status: Order['status']): EmailNotification {
  const { subject, body } = generateEmailTemplate(order, status);
  return {
    id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    orderId: order.id,
    to: order.customerEmail,
    subject,
    body,
    sentAt: new Date().toISOString(),
    status
  };
}
