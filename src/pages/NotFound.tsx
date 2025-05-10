
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: Användaren försökte komma åt en sida som inte finns:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-6xl font-bold text-brand-800">404</h1>
        <p className="mt-4 text-xl text-gray-600">
          Sidan du söker kunde inte hittas
        </p>
        <p className="mt-2 text-gray-500">
          Kontrollera webbadressen eller gå tillbaka till startsidan
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="mt-6"
        >
          Tillbaka till startsidan
        </Button>
      </div>
    </div>
  );
}
