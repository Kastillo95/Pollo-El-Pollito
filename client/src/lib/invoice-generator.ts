export interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  clientPhone?: string;
  quantity: number;
  unitPrice: number;
  pricePerPound: number;
  concept: string;
  total: number;
  date: Date;
}

export function generateWhatsAppMessage(invoice: InvoiceData): string {
  const message = `🐣 *Pollo Fresco El Pollito*
"Quien sabe de calidad compra el Pollito"

📋 *Factura:* ${invoice.invoiceNumber}
👤 *Cliente:* ${invoice.clientName}
📅 *Fecha:* ${invoice.date.toLocaleDateString('es-HN')}

📦 *Detalle:*
- Cantidad: ${invoice.quantity} pollitos
- Concepto: ${invoice.concept}
- Precio unitario: L. ${invoice.unitPrice.toFixed(2)}
- Precio por libra: L. ${invoice.pricePerPound.toFixed(2)}

💰 *Total: L. ${invoice.total.toFixed(2)}*

📍 Peña Blanca, Cortés
📞 97164446 - 97550488

¡Gracias por tu compra! 🙏`;

  return encodeURIComponent(message);
}

export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  // Remove any non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${message}`;
}
