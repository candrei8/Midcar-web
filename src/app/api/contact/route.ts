import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email destination
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'info@midcar.es'

// Create transporter
function createTransporter() {
  // If SMTP settings are configured, use them
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // Fallback: log to console in development
  if (process.env.NODE_ENV === 'development') {
    return null
  }

  throw new Error('SMTP configuration is required in production')
}

function formatCocheCartaEmail(data: Record<string, string>): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .section { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #e63946; }
    .section-title { font-weight: bold; color: #1e3a5f; margin-bottom: 10px; font-size: 16px; }
    .field { margin: 8px 0; }
    .label { color: #666; font-size: 13px; }
    .value { color: #333; font-weight: 500; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">Nueva Solicitud de Coche a la Carta</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Un cliente busca su coche ideal</p>
    </div>
    <div class="content">
      <div class="section">
        <div class="section-title">Datos del Cliente</div>
        <div class="field">
          <span class="label">Nombre:</span>
          <span class="value">${data.nombre || '-'}</span>
        </div>
        <div class="field">
          <span class="label">Teléfono:</span>
          <span class="value">${data.telefono || '-'}</span>
        </div>
        <div class="field">
          <span class="label">Email:</span>
          <span class="value">${data.email || '-'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Vehículo Deseado</div>
        <div class="field">
          <span class="label">Marca:</span>
          <span class="value">${data.marca || 'No especificada'}</span>
        </div>
        <div class="field">
          <span class="label">Modelo:</span>
          <span class="value">${data.modelo || 'No especificado'}</span>
        </div>
        <div class="field">
          <span class="label">Tipo de carrocería:</span>
          <span class="value">${data.tipoCarroceria || 'No especificado'}</span>
        </div>
        <div class="field">
          <span class="label">Combustible:</span>
          <span class="value">${data.combustible || 'No especificado'}</span>
        </div>
        <div class="field">
          <span class="label">Transmisión:</span>
          <span class="value">${data.transmision || 'No especificada'}</span>
        </div>
        <div class="field">
          <span class="label">Color preferido:</span>
          <span class="value">${data.color || 'No especificado'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Preferencias</div>
        <div class="field">
          <span class="label">Año desde:</span>
          <span class="value">${data.añoDesde || 'No especificado'}</span>
        </div>
        <div class="field">
          <span class="label">Año hasta:</span>
          <span class="value">${data.añoHasta || 'No especificado'}</span>
        </div>
        <div class="field">
          <span class="label">Presupuesto máximo:</span>
          <span class="value">${data.presupuestoMax || 'No especificado'}</span>
        </div>
        <div class="field">
          <span class="label">Kilómetros máximos:</span>
          <span class="value">${data.kmMax || 'No especificados'}</span>
        </div>
      </div>

      ${data.extras || data.comentarios ? `
      <div class="section">
        <div class="section-title">Información Adicional</div>
        ${data.extras ? `
        <div class="field">
          <span class="label">Extras deseados:</span>
          <span class="value">${data.extras}</span>
        </div>
        ` : ''}
        ${data.comentarios ? `
        <div class="field">
          <span class="label">Comentarios:</span>
          <span class="value">${data.comentarios}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>Este mensaje fue enviado desde el formulario de Coche a la Carta de www.midcar.es</p>
    </div>
  </div>
</body>
</html>
`
}

function formatContactEmail(data: Record<string, string>): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #e63946 0%, #c42836 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .section { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #1e3a5f; }
    .section-title { font-weight: bold; color: #1e3a5f; margin-bottom: 10px; font-size: 16px; }
    .field { margin: 8px 0; }
    .label { color: #666; font-size: 13px; }
    .value { color: #333; font-weight: 500; }
    .message-box { background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-top: 15px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">Nuevo Mensaje de Contacto</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Asunto: ${data.asunto || 'General'}</p>
    </div>
    <div class="content">
      <div class="section">
        <div class="section-title">Datos del Cliente</div>
        <div class="field">
          <span class="label">Nombre:</span>
          <span class="value">${data.nombre || '-'}</span>
        </div>
        <div class="field">
          <span class="label">Teléfono:</span>
          <span class="value">${data.telefono || '-'}</span>
        </div>
        <div class="field">
          <span class="label">Email:</span>
          <span class="value">${data.email || '-'}</span>
        </div>
      </div>

      <div class="message-box">
        <div class="section-title">Mensaje</div>
        <p style="white-space: pre-wrap;">${data.mensaje || '-'}</p>
      </div>
    </div>
    <div class="footer">
      <p>Este mensaje fue enviado desde el formulario de contacto de www.midcar.es</p>
    </div>
  </div>
</body>
</html>
`
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.nombre || !data.telefono || !data.email) {
      return NextResponse.json(
        { error: 'Nombre, teléfono y email son obligatorios' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const transporter = createTransporter()

    // Determine email type and format
    const isCocheCarta = data.tipo === 'coche-carta'
    const subject = isCocheCarta
      ? `Solicitud Coche a la Carta - ${data.nombre}`
      : `Nuevo contacto - ${data.asunto || 'General'} - ${data.nombre}`
    const html = isCocheCarta
      ? formatCocheCartaEmail(data)
      : formatContactEmail(data)

    if (transporter) {
      // Send email
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"MID Car Web" <${process.env.SMTP_USER}>`,
        to: CONTACT_EMAIL,
        replyTo: data.email,
        subject,
        html,
      })
    } else {
      // Development: log to console
      console.log('=== EMAIL (Development Mode) ===')
      console.log('To:', CONTACT_EMAIL)
      console.log('Subject:', subject)
      console.log('From:', data.email)
      console.log('Data:', JSON.stringify(data, null, 2))
      console.log('================================')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    )
  }
}
