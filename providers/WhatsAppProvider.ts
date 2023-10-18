import Helpers from '../src/Helpers'
import { WhatsAppCloudApi } from '../src/WhatsAppCloudApi'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  WhatsAppConfig,
  WhatsAppMessageContract,
  WhatsAppStatusContract,
} from '@ioc:Adonis/Addons/WhatsApp'

export default class WhatsAppProvider {
  public static needsApplication = true

  private config = {
    webhookRoute: '/webhook/whatsapp',
    timeout: 60,
    phoneNumberId: null,
    accessToken: null,
    verifyToken: null,
    graphUrl: 'https://graph.facebook.com',
    graphVersion: 'v16.0',
  }

  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('Adonis/Addons/WhatsApp', () => {
      const drive = this.app.container.resolveBinding('Adonis/Core/Drive')
      const emitter = this.app.container.resolveBinding('Adonis/Core/Event')

      const config = this.app.container
        .resolveBinding('Adonis/Core/Config')
        .get('whatsapp', this.config)

      return new WhatsAppCloudApi(config, drive, emitter)
    })
  }

  public boot() {
    const Route = this.app.container.use('Adonis/Core/Route')
    const Event = this.app.container.use('Adonis/Core/Event')
    const Config = this.app.container.use('Adonis/Core/Config')
    const Logger = this.app.container.use('Adonis/Core/Logger')

    const whatsapp: WhatsAppConfig = Config.get('whatsapp', this.config)

    // webhook verifier
    Route.get(whatsapp.webhookRoute, (ctx: HttpContextContract) => {
      const payload = ctx.request.qs()

      if (!payload['hub.mode'] || !payload['hub.verify_token']) {
        return ctx.response.status(400).send({ code: 400 })
      }

      if (
        payload['hub.mode'] !== 'subscribe' ||
        payload['hub.verify_token'] !== whatsapp.verifyToken
      ) {
        return ctx.response.status(403).send({ code: 403 })
      }

      Logger.info('Webhook verified!')
      return ctx.response.status(200).send(payload['hub.challenge'])
    })

    // webhook
    Route.post(whatsapp.webhookRoute, async (ctx: HttpContextContract) => {
      const payload = ctx.request.body()

      if (!payload.object) {
        return ctx.response.status(403).send({ code: 403 })
      }

      const { value } = payload.entry[0].changes[0]
      const message = !!value.messages && value.messages[0]
      const status = !!value.statuses && value.statuses[0]
      const contact = !!value.contacts && value.contacts[0]
      const metadata = !!value.metadata && value.metadata

      if (String(metadata.phone_number_id) !== whatsapp.phoneNumberId) {
        // ignore webhook if phone number id is different
        return ctx.response.status(200).send({ code: 200 })
      }

      if (['unsupported', 'reaction', 'order', 'system'].includes(message.type)) {
        // i don't support this, you can pull request!
        return ctx.response.status(200).send({ code: 200 })
      }

      let data: WhatsAppMessageContract | WhatsAppStatusContract | null = null

      if (message) {
        const interactive = Helpers.translateInteractive(message)
        const type = Helpers.translateType(interactive?.type || message.type)

        data = {
          from: Number(contact.wa_id),
          sender: contact.profile.name,
          wamid: message.id,
          data: interactive?.data || message[message.type],
          timestamp: Number(message.timestamp),
          type,
        }

        await Event.emit('wa:message:*', data)
        await Event.emit(`wa:message:${type}`, data)
      }

      if (status) {
        data = {
          from: Number(status.recipient_id),
          wamid: status.id,
          timestamp: Number(status.timestamp),
          status: status.status,
        }

        await Event.emit(`wa:status:${status.status}`, data)
        await Event.emit('wa:status:*', data)
      }

      if (data !== null) {
        await Event.emit('wa:*', data)
      }

      return ctx.response.status(200).send({ code: 200 })
    })
  }
}
