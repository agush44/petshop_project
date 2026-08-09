// Filtro personalizado para el middleware de compresión HTTP.

const compressionFilter = (req, res) => {
  if (req.headers["x-no-compression"]) return false;
  const contentType = res.getHeader("Content-Type") || "";
  return !/^(image|video|audio)/i.test(contentType);
};

export default compressionFilter;
