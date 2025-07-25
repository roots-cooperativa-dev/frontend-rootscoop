import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { contactName, email, phone, interests } = req.body;

  if (!contactName || !email || !phone) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "rootscooperativedev@gmail.com",
        pass: "wabunxqdksiypgln",
      },
    });

    await transporter.sendMail({
      from: '"ROOTS Comunidad" <rootscooperativedev@gmail.com>',
      to: "rootscooperativedev@gmail.com",
      subject: "Nuevo mensaje de contacto",
      html: `
        <h2>Nuevo mensaje recibido</h2>
        <p><strong>Nombre:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Motivo de la consulta:</strong> ${interests || "No especificado"}</p>
      `,
    });

    return res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return res.status(500).json({ message: "Error al enviar el correo" });
  }
}
