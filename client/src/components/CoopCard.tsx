import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { calculateAge, getAgeCategory, formatAge } from "@/lib/age-calculator";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Coop } from "@shared/schema";

interface CoopCardProps {
  coop: Coop;
  onEdit: (coop: Coop) => void;
}

export default function CoopCard({ coop, onEdit }: CoopCardProps) {
  const age = calculateAge(coop.entryDate);
  const ageCategory = getAgeCategory(age);
  
  // Broiler chicken images - only chickens
  const imageUrls = [
    "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    "https://images.unsplash.com/photo-1616404891008-3cb00f2b0321?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    "https://images.unsplash.com/photo-1518899139663-b6b8b0b3a1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
  ];
  
  const imageUrl = imageUrls[(coop.number - 1) % imageUrls.length];

  return (
    <Card className="overflow-hidden">
      <div className="pollo-gradient p-4">
        <h3 className="text-white font-semibold text-lg">Galpón {coop.number}</h3>
        <p className="text-[var(--pollo-beige)] text-sm">
          {coop.number === 7 ? "Nuevo Lote" : "Activo"}
        </p>
      </div>
      <CardContent className="p-4">
        <img 
          src={imageUrl}
          alt="Interior de galpón con pollitos" 
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Cantidad:</span>
            <span className="font-semibold">{coop.quantity}</span>
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
          className="w-full mt-4 bg-[var(--pollo-orange)] text-white hover:bg-[var(--pollo-brown)] transition-colors"
          onClick={() => onEdit(coop)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Editar
        </Button>
      </CardContent>
    </Card>
  );
}
