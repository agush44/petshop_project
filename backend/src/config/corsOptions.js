// Un Origin header nunca trae "/" al final, pero es un typo fácil de cometer
// al pegar la URL en las env vars del hosting. Se normaliza acá para no
// depender de que quede escrita exactamente igual en todos lados.
const stripTrailingSlash = (url) => url?.replace(/\/+$/, "");

const allowedOrigins = [
  stripTrailingSlash(process.env.FRONTEND_URL),
  "http://localhost:5173",
].filter(Boolean);

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(stripTrailingSlash(origin))) {
      return callback(null, true);
    }
    callback(new Error("No permitido por la política CORS"));
  },
  credentials: true,
};
