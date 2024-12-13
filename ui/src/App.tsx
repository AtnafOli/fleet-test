import { VehiclePage } from "./pages/vehicle_page";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="p-6 space-y-6">
      <VehiclePage />
      <Toaster />
    </div>
  );
}

export default App;
