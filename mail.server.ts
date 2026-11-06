/**
 * Correo de aviso del formulario de contacto. Es opcional: si no hay SMTP
 * configurado, el mensaje igual queda guardado y visible en /admin.
 *
 * Variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
 * (en Hostinger: el buzón de correo del dominio, host smtp.hostinger.com, puerto 465).
 */
import nodemailer from 'nodemailer';
import logger from '@/lib/logger.server';

export async function sendContactNotice(
	to: string,
	contact: { name: string; email: string; organization: string; interest: string; message: string },
) {
	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
	if (!to || !SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) return;

	try {
		const port = Number(SMTP_PORT || 465);
		const transport = nodemailer.createTransport({
			host: SMTP_HOST,
			port,
			secure: port === 465,
			auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
		});
		await transport.sendMail({
			from: SMTP_FROM || SMTP_USER,
			to,
			replyTo: contact.email,
			subject: `Nuevo mensaje de ${contact.name} (${contact.interest})`,
			text: `Nombre: ${contact.name}\nCorreo: ${contact.email}\nOrganización: ${contact.organization || '-'}\nInterés: ${contact.interest}\n\n${contact.message}`,
		});
	} catch (error) {
		logger.error('No se pudo enviar el aviso por correo:', error instanceof Error ? error.message : error);
	}
}
