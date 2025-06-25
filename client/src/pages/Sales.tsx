import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, FilePlus, Eye, Trash2, Ban } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import InvoicePreview from "@/components/InvoicePreview";
import { insertInvoiceSchema, type Invoice, type InsertInvoice } from "@shared/schema";

export default function Sales() {
  const { toast } = useToast();
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
  });

  const form = useForm<InsertInvoice>({
    resolver: zodResolver(insertInvoiceSchema),
    defaultValues: {
      clientName: '',
      clientPhone: '',
      concept: '',
      quantity: 0,
      pounds: '0',
      pricePerPound: '0',
      status: 'paid',
    },
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: InsertInvoice) => {
      const response = await apiRequest('POST', '/api/invoices', data);
      return response.json();
    },
    onSuccess: (newInvoice) => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: "Éxito",
        description: "Factura generada correctamente",
      });
      setPreviewInvoice(newInvoice);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo generar la factura",
        variant: "destructive",
      });
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/invoices/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: "Éxito",
        description: "Factura eliminada correctamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la factura",
        variant: "destructive",
      });
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertInvoice> }) => {
      const response = await apiRequest('PUT', `/api/invoices/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: "Éxito",
        description: "Factura actualizada correctamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la factura",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInvoice) => {
    createInvoiceMutation.mutate(data);
  };

  const handleDeleteInvoice = (id: number) => {
    if (confirm('¿Está seguro que desea eliminar esta factura?')) {
      deleteInvoiceMutation.mutate(id);
    }
  };

  const handleCancelInvoice = (invoice: Invoice) => {
    if (confirm('¿Está seguro que desea cancelar esta factura?')) {
      updateInvoiceMutation.mutate({
        id: invoice.id,
        data: { status: 'cancelled' }
      });
    }
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
  };

  const generatePreview = () => {
    const formData = form.getValues();
    if (formData.clientName && formData.concept && formData.quantity && formData.pounds && formData.pricePerPound) {
      const total = Number(formData.pounds) * Number(formData.pricePerPound);
      const previewInvoice: Invoice = {
        id: 0,
        invoiceNumber: 'PREV-' + Date.now().toString().slice(-4),
        clientName: formData.clientName,
        clientPhone: formData.clientPhone || '',
        concept: formData.concept,
        quantity: Number(formData.quantity),
        pounds: formData.pounds,
        pricePerPound: formData.pricePerPound,
        total: total.toString(),
        status: formData.status || 'paid',
        date: new Date(),
      };
      setPreviewInvoice(previewInvoice);
    } else {
      toast({
        title: "Datos incompletos",
        description: "Complete todos los campos requeridos para generar la vista previa",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const dailyTotal = invoices?.reduce((sum, invoice) => {
    const invoiceDate = new Date(invoice.date);
    const today = new Date();
    
    if (invoiceDate.toDateString() === today.toDateString() && invoice.status === 'paid') {
      return sum + Number(invoice.total);
    }
    return sum;
  }, 0) || 0;

  const monthlyTotal = invoices?.reduce((sum, invoice) => {
    const invoiceDate = new Date(invoice.date);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    if (invoiceDate.getMonth() === currentMonth && 
        invoiceDate.getFullYear() === currentYear && 
        invoice.status === 'paid') {
      return sum + Number(invoice.total);
    }
    return sum;
  }, 0) || 0;

  if (isLoading) {
    return <div>Cargando ventas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Invoice Generation */}
        <div className="space-y-6">
          {/* New Sale Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FilePlus className="w-5 h-5 mr-2" />
                Generar Factura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cliente</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del cliente" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Teléfono" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="concept"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concepto</FormLabel>
                        <FormControl>
                          <Input placeholder="Descripción del producto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad de Pollitos</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Cantidad"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pounds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Libras</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricePerPound"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio por Libra</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Total: {
                      form.watch('pounds') && form.watch('pricePerPound') 
                        ? formatCurrency(Number(form.watch('pounds')) * Number(form.watch('pricePerPound')))
                        : formatCurrency(0)
                    }</p>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      onClick={generatePreview}
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Vista Previa
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[var(--pollo-orange)] text-white hover:bg-[var(--pollo-brown)]"
                      disabled={createInvoiceMutation.isPending}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Generar Factura
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Sales Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Ventas Hoy</p>
                  <p className="text-2xl font-bold text-green-800">{formatCurrency(dailyTotal)}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Ventas del Mes</p>
                  <p className="text-2xl font-bold text-blue-800">{formatCurrency(monthlyTotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa de Factura</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <InvoicePreview invoice={previewInvoice} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Registry */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices?.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {formatCurrency(Number(invoice.total))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePreviewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {invoice.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCancelInvoice(invoice)}
                          className="text-gray-600 hover:text-gray-800 p-1"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
