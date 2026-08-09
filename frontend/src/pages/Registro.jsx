import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registerUser } from "@/lib/authApi";

export default function Registro() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success("¡Cuenta creada! Ahora podés iniciar sesión.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Crear cuenta</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              className="h-11 text-base"
              disabled={loading}
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">Ingresá un correo válido.</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              className="h-11 text-base"
              disabled={loading}
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">Mínimo 6 caracteres.</p>
            )}
          </div>
          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
