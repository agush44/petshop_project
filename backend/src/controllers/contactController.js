import ContactMessage from "../models/contactMessage.js";

const sendContactMessage = async (req, res) => {
  try {
    const message = new ContactMessage(req.body);
    await message.save();
    res.status(201).json({ message: "Mensaje enviado correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al enviar el mensaje" });
  }
};

const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact messages" });
  }
};

export { sendContactMessage, getContactMessages };
