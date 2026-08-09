import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="font-heading text-3xl font-bold">404</h1>
      <p className="text-muted-foreground">No encontramos la página que buscás.</p>
      <Button render={<Link to="/" />}>Volver al inicio</Button>
    </div>
  );
}
