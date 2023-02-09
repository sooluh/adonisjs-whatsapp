import axios from 'axios'
import FormData from 'form-data'
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

  public async send(data: Record<string, any>, parse = true) {
    const { timeout, phoneNumberId, graphUrl, graphVersion } = this.config

    const response = await axios({
      method: 'POST',
      url: `${graphUrl}/${graphVersion}/${phoneNumberId}/messages`,
      timeout,
      headers: this.headers,
      data: { ...this.skeleton, ...data },
      responseType: 'json',
    })

    return parse ? WhatsAppClient.parse(response.data) : response.data
  }

  public async media(media: string) {
    const { timeout, graphUrl, graphVersion } = this.config

    const response = await axios({
      method: 'GET',
      url: `${graphUrl}/${graphVersion}/${media}`,
      timeout,
      headers: this.headers,
      responseType: 'json',
    })

    return response.data
  }

  public async upload(form: FormData) {
    const { timeout, phoneNumberId, graphUrl, graphVersion } = this.config

    const response = await axios({
      method: 'POST',
      url: `${graphUrl}/${graphVersion}/${phoneNumberId}/media`,
      timeout,
      headers: { ...form.getHeaders(), ...this.headers },
      data: form,
      responseType: 'json',
    })

    return response.data
  }

  private static parse(data: WhatsAppResult): WhatsAppResultContract {
    return {
      input: Number(data.contacts[0].input),
      phone: data.contacts[0].wa_id,
      wamid: data.messages[0].id,
    }
  }
}
