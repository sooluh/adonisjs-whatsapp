import axios from 'axios'
import { WhatsAppConfig, WhatsAppResultContract } from '@ioc:Adonis/Addons/WhatsApp'

type WhatsAppResult = {
  messaging_product: 'whatsapp'
  contacts: {
    input: string
    wa_id: string
  }[]
  messages: {
    id: string
  }[]
}

export default class WhatsAppClient {
  constructor(private config: WhatsAppConfig) {}

  private headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.config.accessToken,
  }

  private skeleton = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
  }

  public async send(method: 'GET' | 'POST' | 'PUT', data: Record<string, any>, parse = true) {
    const response = await axios({
      method,
      url: this.config.graphUrl + '/' + this.config.graphVersion + '/' + this.config.phoneNumberId,
      timeout: this.config.timeout,
      headers: this.headers,
      data: { ...this.skeleton, ...data },
    })

    return parse ? WhatsAppClient.parse(response.data) : response.data
  }

  private static parse(data: WhatsAppResult): WhatsAppResultContract {
    return {
      input: Number(data.contacts[0].input),
      phone: data.contacts[0].wa_id,
      wamid: data.messages[0].id,
    }
  }
}
