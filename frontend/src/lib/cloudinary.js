const CLOUD_NAME = "dxognqhnp";
const UPLOAD_PRESET = "petshop_unsigned";

// Sube directo del navegador a Cloudinary con un upload preset "unsigned"
// (no requiere el API secret en el frontend). Devuelve la URL final de la imagen.
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error?.message || "No se pudo subir la imagen.");
  }

  const data = await response.json();
  return data.secure_url;
};
