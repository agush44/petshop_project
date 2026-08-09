import NewsletterSubscriber from "../models/newsletterSubscriber.js";

const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    await NewsletterSubscriber.updateOne(
      { email },
      { $setOnInsert: { email } },
      { upsert: true }
    );
    res.status(201).json({ message: "Suscripción exitosa." });
  } catch (error) {
    res.status(500).json({ message: "Error al suscribirse" });
  }
};

export { subscribeNewsletter };
