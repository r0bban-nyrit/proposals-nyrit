
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FloatingActionButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/skapa-offert");
  };

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
    >
      <Plus className="h-6 w-6" />
      <span className="sr-only">Skapa ny offert</span>
    </Button>
  );
}
