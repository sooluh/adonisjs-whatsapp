export default class Helpers {
  public static isUrl(string: string) {
    // https://stackoverflow.com/a/5717133
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i'
    )

    return !!pattern.test(string)
  }

  public static translateType(
    type: string
  ):
    | 'text'
    | 'image'
    | 'document'
    | 'audio'
    | 'video'
    | 'sticker'
    | 'location'
    | 'contacts'
    | 'button'
    | 'list' {
    const types = {
      button_reply: 'button',
      list_reply: 'list',
    }

    return types[type] || type
  }

  public static translateInteractive(message: Record<string, any>) {
    if (message.type !== 'interactive') return null

    return {
      type: message.interactive.type as string,
      data: message.interactive[message.interactive.type] as {
        id: string
        title: string
        description?: string
      },
    }
  }
}
