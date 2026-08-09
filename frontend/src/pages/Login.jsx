import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data);
      toast.success("¡Bienvenido de nuevo!");
      navigate(result.user?.role === "admin" ? "/admin" : "/cuenta");
    } catch (error) {
      toast.error(error.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              disabled={loading}
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">Ingresá tu correo.</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              disabled={loading}
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">Ingresá tu contraseña.</p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          ¿No tenés cuenta?{" "}
          <Link to="/registro" className="text-primary hover:underline">
            Registrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
