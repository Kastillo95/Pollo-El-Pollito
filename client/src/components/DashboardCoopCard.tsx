import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { calculateAge, getAgeCategory, formatAge } from "@/lib/age-calculator";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Coop } from "@shared/schema";

interface DashboardCoopCardProps {
  coop: Coop;
  onView: (coop: Coop) => void;
}

export default function DashboardCoopCard({ coop, onView }: DashboardCoopCardProps) {
  const age = calculateAge(coop.entryDate);
  const ageCategory = getAgeCategory(age);
  
  // Broiler chicken images
  const imageUrls = [
    "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
  ];
  
  const imageUrl = imageUrls[(coop.number - 1) % imageUrls.length];

  return (
    <Card className="overflow-hidden card-hover">
      <div className="pollo-gradient p-4">
        <h3 className="text-white font-semibold text-lg">{coop.number === 7 ? "Galpón 7 (Nuevo)" : `Galpón ${coop.number}`}</h3>
        <p className="text-[var(--pollo-beige)] text-sm">
          {coop.number === 7 ? "Último Lote" : "Activo"}
        </p>
      </div>
      <CardContent className="p-4">
        <img 
          src={imageUrl}
          alt="Galpón con pollitos de engorde" 
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Cantidad:</span>
            <span className="font-semibold text-[var(--pollo-brown)]">{coop.quantity}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Fecha Ingreso:</span>
            <span className="text-sm">{formatDate(coop.entryDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Edad:</span>
            <span className={cn("age-indicator", `age-${ageCategory}`)}>
              {formatAge(age)}
            </span>
          </div>
        </div>
        <Button 
          className="w-full mt-4 bg-[var(--pollo-accent)] text-white hover:bg-[var(--pollo-orange)] transition-colors"
          onClick={() => onView(coop)}
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  );
}