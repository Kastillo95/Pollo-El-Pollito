import logoPath from "@assets/1000040291_1750690924846.png";

export default function LoadingScreen() {
  return (
    <div className="loading-screen fixed inset-0 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 bg-white rounded-full p-6 shadow-2xl glow-effect">
          <img 
            src={logoPath} 
            alt="Pollo Fresco El Pollito" 
            className="w-32 h-32 mx-auto"
          />
        </div>
        <div className="text-white">
          <h1 className="text-3xl font-bold mb-2">Pollo Fresco El Pollito</h1>
          <p className="text-lg opacity-90">Sistema de Gestión Avícola</p>
          <div className="mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
