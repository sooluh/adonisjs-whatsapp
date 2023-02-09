import * as fs from 'fs'
import axios from 'axios'
import mime from 'mime-types'
import Helpers from './Helpers'
import FormData from 'form-data'
import WhatsAppClient from './WhatsAppClient'
import { EmitterContract } from '@ioc:Adonis/Core/Event'
import { DriveManagerContract } from '@ioc:Adonis/Core/Drive'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import {
  ButtonsOptions,
  ComponentOptions,
  ContactOptions,
  CoordinateOptions,
  DocumentOptions,
  DownloadOptions,
  InteractiveOptions,
  LocationOptions,
  MediaOptions,
  SectionOptions,
  TextOptions,
  WhatsAppCloudApiContract,
  WhatsAppConfig,
  WhatsAppResultContract,
} from '@ioc:Adonis/Addons/WhatsApp'

export class WhatsAppCloudApi implements WhatsAppCloudApiContract {
  private client: WhatsAppClient

  constructor(
    private config: WhatsAppConfig,
    private drive: DriveManagerContract,
    private emitter: EmitterContract
  ) {
    this.client = new WhatsAppClient(this.config)
  }

  public async sendText(
    to: number,
    text: string,
    options?: TextOptions
  ): Promise<WhatsAppResultContract> {
    return await this.client.send({
      to,
      type: 'text',
      text: {
        preview_url: options?.preview_url || false,
        body: text,
      },
    })
  }

  public async sendImage(
    to: number,
    media: string,
    options?: MediaOptions
  ): Promise<WhatsAppResultContract> {
    return await this.client.send({
      to,
      type: 'image',
      image: {
        ...(Helpers.isUrl(media) ? { link: media } : { id: media }),
        ...options,
      },
    })
  }

  public async sendDocument(
    to: number,
    media: string,
    options?: DocumentOptions
  ): Promise<WhatsAppResultContract> {
    return await this.client.send({
      to,
      type: 'document',
      document: {
        ...(Helpers.isUrl(media) ? { link: media } : { id: media }),
        ...options,
      },
    })
  }

  public async sendAudio(to: number, media: string): Promise<WhatsAppResultContract> {
    return await this.client.send({
      to,
      type: 'audio',
      audio: {
        ...(Helpers.isUrl(media) ? { link: media } : { id: media }),
      },
    })
  }

  public async sendVideo(
    to: number,
    media: string,
    options?: MediaOptions
  ): Promise<WhatsAppResultContract> {
    return await this.client.send({
      to,
      type: 'video',
      video: {
        ...(Helpers.isUrl(media) ? { link: media } : { id: media }),
        ...options,
      },
    })
  }

  public async sendSticker(to: number, media: string): Promise<WhatsAppResultContract> {
    return await this.client.send({
      to,
      type: 'sticker',
      sticker: {
        ...(Helpers.isUrl(media) ? { link: media } : { id: media }),
      },
    })
  }

  public async sendLocation(
    to: number,
    coordinate: CoordinateOptions,
    options?: LocationOptions
  ): Promise<WhatsAppResultContract> {
    return await this.client.send({
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
  ): Promise<WhatsAppResultContract> {
    return await this.client.send({
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

  public async sendContact(
    to: number,
    contacts: ContactOptions[]
  ): Promise<WhatsAppResultContract> {
    return await this.client.send({
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
  ): Promise<WhatsAppResultContract> {
    return await this.client.send({
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
  ): Promise<WhatsAppResultContract> {
    return await this.client.send({
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

  public async readMessage(wamid: string): Promise<boolean> {
    const response = await this.client.send(
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

  public async uploadMedia(source: string | MultipartFileContract): Promise<string | false> {
    source = typeof source !== 'string' ? (source.tmpPath as string) : source

    const form = new FormData()
    form.append('messaging_product', 'whatsapp')
    form.append('type', mime.contentType(source))
    form.append('file', fs.readFileSync(source), { filename: source })

    const response = await this.client.upload(form)
    return response.id || false
  }

  public async downloadMedia(media: string, options?: DownloadOptions): Promise<string | false> {
    const response = await this.client.media(media)
    if (!response.url || !response.mime_type) return false

    const ext = mime.extension(response.mime_type)
    const filename = options?.filename || media + (ext ? '.' + ext : '')
    const filepath = options?.folder ? options.folder + '/' + filename : filename

    const file = await axios({
      method: 'GET',
      url: response.url,
      headers: { Authorization: 'Bearer ' + this.config.accessToken },
      responseType: 'stream',
    })

    if (options?.disk) {
      const disk = this.drive.use(options.disk) as DriveManagerContract
      await disk.putStream(filepath, file.data)
    } else {
      await this.drive.putStream(filepath, file.data)
    }

    return filename
  }
}
