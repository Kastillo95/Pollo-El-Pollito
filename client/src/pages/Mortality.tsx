import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Skull, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { insertMortalitySchema, type Mortality, type InsertMortality } from "@shared/schema";

export default function Mortality() {
  const { toast } = useToast();

  const { data: mortalities, isLoading } = useQuery<Mortality[]>({
    queryKey: ['/api/mortalities'],
  });

  const form = useForm<InsertMortality>({
    resolver: zodResolver(insertMortalitySchema),
    defaultValues: {
      coopNumber: 1,
      quantity: 0,
      cause: '',
      description: '',
    },
  });

  const createMortalityMutation = useMutation({
    mutationFn: async (data: InsertMortality) => {
      const response = await apiRequest('POST', '/api/mortalities', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mortalities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/coops'] }); // Refresh coops for quantity update
      toast({
        title: "Registro creado",
        description: "Mortalidad registrada correctamente",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo registrar la mortalidad",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMortality) => {
    createMortalityMutation.mutate(data);
  };

  const getCauseColor = (cause: string) => {
    switch (cause) {
      case 'enfermedad': return 'bg-red-100 text-red-800';
      case 'accidente': return 'bg-orange-100 text-orange-800';
      case 'natural': return 'bg-green-100 text-green-800';
      case 'desconocida': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCauseLabel = (cause: string) => {
    switch (cause) {
      case 'enfermedad': return 'Enfermedad';
      case 'accidente': return 'Accidente';
      case 'natural': return 'Natural';
      case 'desconocida': return 'Desconocida';
      default: return cause;
    }
  };

  const totalMortalities = mortalities?.reduce((sum, mortality) => sum + mortality.quantity, 0) || 0;

  if (isLoading) {
    return <div>Cargando registros de mortalidad...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* New Mortality Form */}
      <div className="lg:col-span-1">
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center text-red-800">
              <Plus className="w-5 h-5 mr-2" />
              Registrar Baja
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="coopNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Galpón</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar galpón" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Galpón 1</SelectItem>
                          <SelectItem value="2">Galpón 2</SelectItem>
                          <SelectItem value="3">Galpón 3</SelectItem>
                          <SelectItem value="4">Galpón 4</SelectItem>
                          <SelectItem value="5">Galpón 5</SelectItem>
                          <SelectItem value="6">Galpón 6</SelectItem>
                          <SelectItem value="7">Galpón 7</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Número de pollitos"
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
                  name="cause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Causa</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar causa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="enfermedad">Enfermedad</SelectItem>
                          <SelectItem value="accidente">Accidente</SelectItem>
                          <SelectItem value="natural">Natural</SelectItem>
                          <SelectItem value="desconocida">Desconocida</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Detalles adicionales..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                  disabled={createMortalityMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Baja
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="mt-6 border-gray-200 shadow-lg">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center text-gray-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Resumen de Mortalidad
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{totalMortalities}</p>
              <p className="text-sm text-gray-600">Total de Bajas Registradas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mortality Records */}
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardTitle className="flex items-center">
              <Skull className="w-5 h-5 mr-2" />
              Registro de Mortalidad
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Galpón
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Causa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mortalities?.map((mortality) => (
                    <tr key={mortality.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(mortality.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className="bg-blue-100 text-blue-800">
                          Galpón {mortality.coopNumber}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        {mortality.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getCauseColor(mortality.cause)}>
                          {getCauseLabel(mortality.cause)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {mortality.description || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}