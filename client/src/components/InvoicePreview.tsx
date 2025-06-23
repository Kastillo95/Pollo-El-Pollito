import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Printer } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { generateWhatsAppMessage, getWhatsAppUrl } from "@/lib/invoice-generator";
import logoPath from "@assets/1000040291_1750690924846.png";
import type { Invoice } from "@shared/schema";

interface InvoicePreviewProps {
  invoice: Invoice | null;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  if (!invoice) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <p>Genere una factura para ver la vista previa</p>
        </CardContent>
      </Card>
    );
  }

  const handleWhatsAppShare = () => {
    const message = generateWhatsAppMessage({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      clientPhone: invoice.clientPhone || '',
      quantity: invoice.quantity,
      unitPrice: Number(invoice.unitPrice),
      pricePerPound: Number(invoice.pricePerPound),
      concept: invoice.concept,
      total: Number(invoice.total),
      date: new Date(invoice.date),
    });

    if (invoice.clientPhone) {
      const whatsappUrl = getWhatsAppUrl(invoice.clientPhone, message);
      window.open(whatsappUrl, '_blank');
    } else {
      // Open WhatsApp with just the message if no phone number
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Factura ${invoice.invoiceNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .invoice-paper { max-width: 800px; margin: 0 auto; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .text-center { text-align: center; }
                .text-right { text-right; }
                .font-bold { font-weight: bold; }
                .mb-4 { margin-bottom: 16px; }
                .mb-6 { margin-bottom: 24px; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div id="invoice-content" className="invoice-paper p-6 rounded-lg">
          {/* Invoice Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img 
                src={logoPath}
                alt="Pollo Fresco El Pollito" 
                className="w-16 h-16 mr-4"
              />
              <div>
                <h2 className="text-xl font-bold text-[var(--pollo-brown)]">
                  Pollo Fresco El Pollito
                </h2>
                <p className="text-sm text-gray-600 italic">
                  "Quien sabe de calidad compra el Pollito"
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Factura</p>
              <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* Company Info */}
          <div className="mb-6 text-sm text-gray-600">
            <p>Peña Blanca, Cortés</p>
            <p>Tel: 97164446 - 97550488 (WhatsApp)</p>
          </div>

          {/* Client Info */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Cliente:</p>
                <p className="font-medium">{invoice.clientName}</p>
                {invoice.clientPhone && (
                  <>
                    <p className="text-sm text-gray-600">Teléfono:</p>
                    <p className="font-medium">{invoice.clientPhone}</p>
                  </>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha:</p>
                <p className="font-medium">{formatDate(invoice.date)}</p>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="mb-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Cantidad</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Concepto</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">P. Unitario</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">P. Libra</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{invoice.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">{invoice.concept}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatCurrency(Number(invoice.unitPrice))}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatCurrency(Number(invoice.pricePerPound))}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    {formatCurrency(Number(invoice.total))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="text-right mb-6">
            <p className="text-xl font-bold">
              Total: {formatCurrency(Number(invoice.total))}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-[var(--pollo-brown)] border-t pt-4">
            <p className="font-semibold">¡Gracias por tu compra!</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <Button 
            className="flex-1 bg-green-600 text-white hover:bg-green-700"
            onClick={handleWhatsAppShare}
          >
            <Share className="w-4 h-4 mr-2" />
            Compartir por WhatsApp
          </Button>
          <Button 
            className="flex-1 bg-gray-600 text-white hover:bg-gray-700"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
