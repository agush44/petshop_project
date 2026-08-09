import { Button } from "@/components/ui/button";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-heading text-xl font-semibold">Algo salió mal</h1>
      <p className="text-sm text-muted-foreground max-w-md">{error?.message}</p>
      <Button onClick={resetErrorBoundary}>Reintentar</Button>
    </div>
  );
}
