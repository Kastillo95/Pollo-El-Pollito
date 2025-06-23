import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Bird, DollarSign } from "lucide-react";
import DashboardCoopCard from "@/components/DashboardCoopCard";
import { formatCurrency } from "@/lib/utils";
import type { Coop } from "@shared/schema";

export default function Dashboard() {
  const { data: coops, isLoading } = useQuery<Coop[]>({
    queryKey: ['/api/coops'],
  });

  const totalChickens = coops?.reduce((sum, coop) => sum + coop.quantity, 0) || 0;

  const handleViewCoop = (coop: Coop) => {
    // View-only functionality for dashboard
    console.log('View coop:', coop);
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Notifications Panel */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
            <Home className="w-5 h-5 mr-2" />
            Recordatorios Activos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">Agua - Galpón 3</p>
              <p className="text-xs text-gray-600">Próximo: 2:00 PM</p>
            </div>
            <div className="bg-white p-3 rounded border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">Limpieza - Galpón 1</p>
              <p className="text-xs text-gray-600">Programado: Mañana</p>
            </div>
            <div className="bg-white p-3 rounded border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">Alimento - Todos</p>
              <p className="text-xs text-gray-600">Próximo: 6:00 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farm Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Home className="w-6 h-6 text-[var(--pollo-brown)]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Galpones</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Bird className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pollitos</p>
                <p className="text-2xl font-bold text-gray-900">{totalChickens.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ventas del Mes</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(85420)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chicken Coops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {coops?.map((coop) => (
          <DashboardCoopCard key={coop.id} coop={coop} onView={handleViewCoop} />
        ))}
      </div>
    </div>
  );
}
