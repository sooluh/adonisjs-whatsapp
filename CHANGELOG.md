# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.5] - 2023-08-16

### Fixed

- Convert <small>`WABA_ID`</small> data-type to string - Resolve [#2](https://github.com/sooluh/adonisjs-whatsapp/issues/2)

## [0.2.4] - 2023-03-27

### Added

- Throws an error message

### Changed

- Don't validate status on http requests

### Fixed

- <small>`translateInteractive`</small> helper when no eligible params

## [0.2.3] - 2023-02-23

### Added

- Support <small>`quick_reply`</small> and <small>`url`</small> button in template message

## [0.2.2] - 2023-02-14

### Added

- Support interactive type replies

### Changed

- Optional <small>`description`</small> on <small>`RowObject`</small> options
- Rename <small>`sendReplyButtons`</small> method to <small>`sendButtons`</small>
- Rename <small>`readMessage`</small> method to <small>`markAsRead`</small>
- Parses some data sent to Events

### Fixed

- Footer options on interactive messages

## [0.2.1] - 2023-02-09

### Changed

- Complete readme - LOL why did I have to make a release for this

## [0.2.0] - 2023-02-09

### Added

- Upload media method - <small>`uploadMedia(source)`</small>
- Download media method - <small>`downloadMedia(media, [options])`</small>
- Return type in <small>`translateType`</small> helper
- Complete return type on all methods

### Changed

- Optional options in <small>`sendText`</small> method
- Increase default timeout configuration

### Fixed

- Type in contact options
- Send messages endpoint
- Send sticker method

## [0.1.1] - 2023-02-09

### Added

- Preload file

### Changed

- Using templates in <small>`package.json`</small> instead of instructions

## [0.1.0] - 2023-02-08

### Added

- Event Listener - <small>`on(event, handler)`</small>
- Callback URL
- Webhook Verify Token
- Send text method - <small>`sendText(to, text, [options])`</small>
- Send image method - <small>`sendImage(to, media, [options])`</small>
- Send document method - <small>`sendDocument(to, media, [options])`</small>
- Send audio method - <small>`sendAudio(to, media)`</small>
- Send video method - <small>`sendVideo(to, media, [options])`</small>
- Send sticker method - <small>`sendSticker(to, media)`</small>
- Send location method - <small>`sendLocation(to, coordinate, [options])`</small>
- Send template method - <small>`sendTemplate(to, template, language, components)`</small>
- Send contact method - <small>`sendContact(to, contacts)`</small>
- Send reply buttons method - <small>`sendReplyButtons(to, text, buttons, [options])`</small>
- Send list method - <small>`sendList(to, text, sections, [options])`</small>
- Send read message method - <small>`readMessage(wamid)`</small>

[unreleased]: https://github.com/sooluh/adonisjs-whatsapp/compare/v0.2.5...HEAD
[0.2.5]: https://github.com/sooluh/adonisjs-whatsapp/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/sooluh/adonisjs-whatsapp/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/sooluh/adonisjs-whatsapp/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/sooluh/adonisjs-whatsapp/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/sooluh/adonisjs-whatsapp/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/sooluh/adonisjs-whatsapp/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/sooluh/adonisjs-whatsapp/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/sooluh/adonisjs-whatsapp/releases/tag/v0.1.0
