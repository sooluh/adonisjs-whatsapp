declare module '@ioc:Adonis/Core/Event' {
  import { WhatsAppMessageContract, WhatsAppStatusContract } from '@ioc:Adonis/Addons/WhatsApp'

  interface EventsList {
    'wa:message:text': WhatsAppMessageContract
    'wa:message:image': WhatsAppMessageContract
    'wa:message:document': WhatsAppMessageContract
    'wa:message:audio': WhatsAppMessageContract
    'wa:message:video': WhatsAppMessageContract
    'wa:message:sticker': WhatsAppMessageContract
    'wa:message:location': WhatsAppMessageContract
    'wa:message:contacts': WhatsAppMessageContract
    'wa:message:button': WhatsAppMessageContract
    'wa:message:list': WhatsAppMessageContract
    'wa:message:*': WhatsAppMessageContract

    'wa:status:sent': WhatsAppStatusContract
    'wa:status:delivered': WhatsAppStatusContract
    'wa:status:read': WhatsAppStatusContract
    'wa:status:*': WhatsAppStatusContract

    'wa:*': WhatsAppMessageContract | WhatsAppStatusContract
  }
}
