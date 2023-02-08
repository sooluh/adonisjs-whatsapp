import { join } from 'path'
import * as sinkStatic from '@adonisjs/sink'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

function getStub(...relativePaths: string[]) {
  return join(__dirname, 'templates', ...relativePaths)
}

export default async function instructions(
  projectRoot: string,
  app: ApplicationContract,
  sink: typeof sinkStatic
) {
  // configuration file
  const configPath = app.configPath('whatsapp.ts')
  const whatsappConfig = new sink.files.TemplateLiteralFile(
    projectRoot,
    configPath,
    getStub('config', 'whatsapp.txt')
  )
  whatsappConfig.apply().commit()
  const configDir = app.directoriesMap.get('config') || 'config'
  sink.logger.action('create').succeeded(`${configDir}/whatsapp.ts`)

  // update .env
  const env = new sink.files.EnvFile(projectRoot)
  env.set('WABA_ID', '')
  env.set('WABA_TOKEN', '')
  env.set('WABA_VERIFY', '')
  env.commit()
  sink.logger.action('update').succeeded('.env,.env.example')
}
