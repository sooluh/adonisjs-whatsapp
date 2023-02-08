import { EmitterContract } from '@ioc:Adonis/Core/Event'
import {
  ButtonsOptions,
  ComponentOptions,
  ContactOptions,
  CoordinateOptions,
  DocumentOptions,
  InteractiveOptions,
  LocationOptions,
  MediaOptions,
  SectionOptions,
  TextOptions,
  WhatsAppCloudApiContract,
  WhatsAppConfig,
} from '@ioc:Adonis/Addons/WhatsApp'
import WhatsAppClient from './WhatsAppClient'
import Helpers from './Helpers'

export class WhatsAppCloudApi implements WhatsAppCloudApiContract {
  private client: WhatsAppClient

  constructor(private config: WhatsAppConfig, private emitter: EmitterContract) {
    this.client = new WhatsAppClient(this.config)
  }

  public async sendText(to: number, text: string, options?: TextOptions) {
    return await this.client.send('POST', {
      to,
      type: 'text',
      text: {
        preview_url: options?.preview_url || false,
        body: text,
      },
    })
  }

  public async sendImage(to: number, media: string, options?: MediaOptions) {
    return await this.client.send('POST', {
      to,
      type: 'image',
      image: {
        ...(Helpers.isUrl(media) ? { link: media } : { id: media }),
        ...options,
      },
    })
  }

  public async sendDocument(to: number, media: string, options?: DocumentOptions) {
    return await this.client.send('POST', {
      to,
      type: 'document',
      document: {
        ...(Helpers.isUrl(media) ? { link: media } : { id: media }),
        ...options,
      },
    })
  }

  public async sendAudio(to: number, media: string) {
    return await this.client.send('POST', {
      to,
      type: 'audio',
      audio: {
        ...(Helpers.isUrl(media) ? { link: media } : { id: media }),
      },
    })
  }

  public async sendVideo(to: number, media: string, options?: MediaOptions) {
    return await this.client.send('POST', {
      to,
      type: 'video',
      video: {
        ...(Helpers.isUrl(media) ? { link: media } : { id: media }),
        ...options,
      },
    })
  }

  public async sendSticker(to: number, media: string) {
    return await this.client.send('POST', {
      to,
      type: 'audio',
      audio: {
        ...(Helpers.isUrl(media) ? { link: media } : { id: media }),
      },
    })
  }

  public async sendLocation(to: number, coordinate: CoordinateOptions, options?: LocationOptions) {
    return await this.client.send('POST', {
      to,
      type: 'location',
      location: {
        ...coordinate,
        ...options,
      },
    })
  }

  public async sendTemplate(
    to: number,
    template: string,
    language: string,
    components: ComponentOptions[]
  ) {
    return await this.client.send('POST', {
      to,
      type: 'template',
      template: {
        name: template,
        language: {
          code: language,
        },
        components,
      },
    })
  }

  public async sendContact(to: number, contacts: ContactOptions[]) {
    return await this.client.send('POST', {
      to,
      type: 'contacts',
      contacts,
    })
  }

  public async sendReplyButtons(
    to: number,
    text: string,
    buttons: ButtonsOptions,
    options?: InteractiveOptions
  ) {
    return await this.client.send('POST', {
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text },
        ...options,
        action: {
          buttons: Object.keys(buttons).map((key) => {
            return {
              type: 'reply',
              reply: {
                id: key,
                title: buttons[key],
              },
            }
          }),
        },
      },
    })
  }

  public async sendList(
    to: number,
    text: string,
    button: string,
    sections: SectionOptions[],
    options?: InteractiveOptions
  ) {
    return await this.client.send('POST', {
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        body: { text },
        ...options,
        action: {
          button,
          sections,
        },
      },
    })
  }

  public async readMessage(wamid: string) {
    const response = await this.client.send(
      'PUT',
      {
        status: 'read',
        message_id: wamid,
      },
      false
    )

    return response?.success || false
  }

  public on(event: string, handler: (message: any) => void) {
    this.emitter.on(`wa:${event}`, (message) => {
      handler(message)
    })
  }

  public async uploadMedia() {
    // TODO: upload file directly from ctx.request.file() to whatsapp server
  }

  public async downloadMedia() {}
}
