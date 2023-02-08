declare module '@ioc:Adonis/Core/Application' {
  import { WhatsAppCloudApiContract } from '@ioc:Adonis/Addons/WhatsApp'

  export interface ContainerBindings {
    'Adonis/Addons/WhatsApp': WhatsAppCloudApiContract
  }
}
