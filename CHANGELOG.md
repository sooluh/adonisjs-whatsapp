# CHANGELOG

## 0.2.5

Change `WABA_ID` to string (resolving issue #2)

## 0.2.4

Throw an error if an error occurs

## 0.2.3

Support `quick_reply` and `url` button in template message

## 0.2.2

Update README.md

## 0.2.2

- Optional `description` on `RowObject`
- Rename method:
  - `sendReplyButtons` ⇒ `sendButtons`
  - `readMessage` ⇒ `markAsRead`
- Translate messages with interactive type
- Fix footer options on interactive messages
- Fix it a bit type-safe

## 0.2.0

- Add method for media:
  - `WhatsApp.uploadMedia(source)`
  - `WhatsApp.downloadMedia(media, [options])`
- Options in `sendText` method are optional
- Type in contact options fixed
- Add return type in `translateType` helper
- Send message endpoint fixed
- Increase default timeout configuration
- `sendSticker` method fixed

## 0.1.1

Add preload file during configuration process

## 0.1.0

Initial version

- `WhatsApp.sendText(to, text, [options])`
- `WhatsApp.sendImage(to, media, [options])`
- `WhatsApp.sendDocument(to, media, [options])`
- `WhatsApp.sendAudio(to, media)`
- `WhatsApp.sendVideo(to, media, [options])`
- `WhatsApp.sendSticker(to, media)`
- `WhatsApp.sendLocation(to, coordinate, [options])`
- `WhatsApp.sendTemplate(to, template, language, components)`
- `WhatsApp.sendContact(to, contacts)`
- `WhatsApp.sendReplyButtons(to, text, buttons, [options])`
- `WhatsApp.sendList(to, text, button, sections, [options])`
- `WhatsApp.readMessage(wamid)`
- `WhatsApp.on(event, handler)`
