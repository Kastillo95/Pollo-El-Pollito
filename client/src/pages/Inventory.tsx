import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, Home } from "lucide-react";
import { useState } from "react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { calculateAge, getAgeCategory, formatAge } from "@/lib/age-calculator";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Coop, InsertCoop } from "@shared/schema";

export default function Inventory() {
  const { toast } = useToast();
  const [editingCoop, setEditingCoop] = useState<{[key: number]: {quantity: number, date: string}}>({});

  const { data: coops, isLoading } = useQuery<Coop[]>({
    queryKey: ['/api/coops'],
  });

  const updateCoopMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCoop> }) => {
      const response = await apiRequest('PUT', `/api/coops/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coops'] });
      toast({
        title: "Éxito",
        description: "Galpón actualizado correctamente",
      });
      setEditingCoop({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el galpón",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (coopId: number, field: 'quantity' | 'date', value: string | number) => {
    setEditingCoop(prev => ({
      ...prev,
      [coopId]: {
        ...prev[coopId],
        [field]: value,
      }
    }));
  };

  const handleSave = (coop: Coop) => {
    const changes = editingCoop[coop.id];
    if (!changes) return;

    const updateData: Partial<InsertCoop> = {};
    
    if (changes.quantity !== undefined && changes.quantity !== coop.quantity) {
      updateData.quantity = Number(changes.quantity);
    }
    
    if (changes.date && changes.date !== coop.entryDate.toISOString().split('T')[0]) {
      updateData.entryDate = new Date(changes.date);
    }

    if (Object.keys(updateData).length > 0) {
      updateCoopMutation.mutate({ id: coop.id, data: updateData });
    }
  };

  const getInputValue = (coop: Coop, field: 'quantity' | 'date') => {
    const editing = editingCoop[coop.id];
    if (editing && editing[field] !== undefined) {
      return editing[field];
    }
    
    if (field === 'quantity') return coop.quantity;
    if (field === 'date') {
      const date = new Date(coop.entryDate);
      return date.toISOString().split('T')[0];
    }
    return '';
  };

  if (isLoading) {
    return <div>Cargando inventario...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Home className="w-5 h-5 mr-2" />
          Gestión de Inventario
        </CardTitle>
        <p className="text-gray-600">Administre la cantidad y fechas de cada galpón</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Galpón
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Ingreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coops?.map((coop) => {
                const age = calculateAge(coop.entryDate);
                const ageCategory = getAgeCategory(age);
                const hasChanges = editingCoop[coop.id] && 
                  (editingCoop[coop.id].quantity !== coop.quantity || 
                   editingCoop[coop.id].date !== coop.entryDate.toISOString().split('T')[0]);

                return (
                  <tr key={coop.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Home className="w-4 h-4 text-[var(--pollo-orange)] mr-2" />
                        <span className="font-medium">Galpón {coop.number}</span>
                        {coop.number === 7 && (
                          <Badge className="ml-2 bg-[var(--pollo-orange)] text-white">
                            Nuevo
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="number"
                        value={getInputValue(coop, 'quantity')}
                        onChange={(e) => handleInputChange(coop.id, 'quantity', parseInt(e.target.value))}
                        className="w-20"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="date"
                        value={getInputValue(coop, 'date')}
                        onChange={(e) => handleInputChange(coop.id, 'date', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn("age-indicator", `age-${ageCategory}`)}>
                        {formatAge(age)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-green-100 text-green-800">
                        {coop.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        size="sm"
                        onClick={() => handleSave(coop)}
                        disabled={!hasChanges || updateCoopMutation.isPending}
                        className="text-[var(--pollo-orange)] hover:text-[var(--pollo-brown)] bg-transparent hover:bg-orange-50 p-1"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
