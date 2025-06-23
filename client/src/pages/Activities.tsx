import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckSquare, Droplets, Sprout, Fan } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDateTime } from "@/lib/utils";
import { insertActivitySchema, type Activity, type InsertActivity } from "@shared/schema";

export default function Activities() {
  const { toast } = useToast();

  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  const form = useForm<InsertActivity>({
    resolver: zodResolver(insertActivitySchema),
    defaultValues: {
      type: '',
      coopNumber: undefined,
      description: '',
      scheduledDate: new Date(),
      completed: false,
      recurring: false,
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: async (data: InsertActivity) => {
      const response = await apiRequest('POST', '/api/activities', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Éxito",
        description: "Actividad registrada correctamente",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo registrar la actividad",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertActivity) => {
    createActivityMutation.mutate(data);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'agua': return <Droplets className="w-5 h-5" />;
      case 'alimentacion': return <Sprout className="w-5 h-5" />;
      case 'limpieza': return <Fan className="w-5 h-5" />;
      default: return <CheckSquare className="w-5 h-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'agua': return 'border-blue-400 bg-blue-50 text-blue-800';
      case 'alimentacion': return 'border-green-400 bg-green-50 text-green-800';
      case 'limpieza': return 'border-orange-400 bg-orange-50 text-orange-800';
      case 'vacunacion': return 'border-purple-400 bg-purple-50 text-purple-800';
      case 'inspeccion': return 'border-gray-400 bg-gray-50 text-gray-800';
      default: return 'border-gray-400 bg-gray-50 text-gray-800';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'limpieza': return 'Limpieza';
      case 'alimentacion': return 'Alimentación';
      case 'agua': return 'Suministro de Agua';
      case 'vacunacion': return 'Vacunación';
      case 'inspeccion': return 'Inspección';
      default: return type;
    }
  };

  if (isLoading) {
    return <div>Cargando actividades...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* New Activity Form */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Registrar Actividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Actividad</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="limpieza">Limpieza</SelectItem>
                          <SelectItem value="alimentacion">Alimentación</SelectItem>
                          <SelectItem value="agua">Suministro de Agua</SelectItem>
                          <SelectItem value="vacunacion">Vacunación</SelectItem>
                          <SelectItem value="inspeccion">Inspección</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coopNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Galpón</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === 'all' ? undefined : parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Todos los Galpones" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">Todos los Galpones</SelectItem>
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Detalles de la actividad..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha y Hora</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Actividad recurrente</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[var(--pollo-orange)] text-white hover:bg-[var(--pollo-brown)]"
                  disabled={createActivityMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Actividad
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Quick Reminders */}
        <Card>
          <CardHeader>
            <CardTitle>Recordatorios Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between p-4 h-auto bg-blue-50 border-blue-200 hover:bg-blue-100"
            >
              <div className="text-left">
                <p className="font-medium text-blue-800">Agua - Cada 2 horas</p>
                <p className="text-sm text-blue-600">Próximo: 2:00 PM</p>
              </div>
              <Droplets className="w-5 h-5 text-blue-600" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between p-4 h-auto bg-green-50 border-green-200 hover:bg-green-100"
            >
              <div className="text-left">
                <p className="font-medium text-green-800">Alimentación - 3 veces/día</p>
                <p className="text-sm text-green-600">Próximo: 6:00 PM</p>
              </div>
              <Sprout className="w-5 h-5 text-green-600" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between p-4 h-auto bg-orange-50 border-orange-200 hover:bg-orange-100"
            >
              <div className="text-left">
                <p className="font-medium text-orange-800">Limpieza Semanal</p>
                <p className="text-sm text-orange-600">Programado: Mañana</p>
              </div>
              <Fan className="w-5 h-5 text-orange-600" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Activities Log */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckSquare className="w-5 h-5 mr-2" />
              Registro de Actividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities?.map((activity) => (
                <div
                  key={activity.id}
                  className={`border-l-4 pl-4 py-3 rounded-r-lg ${getActivityColor(activity.type)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{getActivityLabel(activity.type)}</h4>
                      <p className="text-sm">
                        {activity.coopNumber ? `Galpón ${activity.coopNumber}` : 'Todos los galpones'} - 
                        {activity.completed ? (
                          <Badge className="ml-1 bg-green-100 text-green-800">Completado</Badge>
                        ) : (
                          <Badge className="ml-1 bg-yellow-100 text-yellow-800">Pendiente</Badge>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{formatDateTime(activity.scheduledDate)}</p>
                      {activity.description && (
                        <p className="text-sm mt-1">{activity.description}</p>
                      )}
                    </div>
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
