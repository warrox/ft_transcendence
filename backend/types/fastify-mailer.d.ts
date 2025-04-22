import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    mailer: import('nodemailer').Transporter
  }
}
