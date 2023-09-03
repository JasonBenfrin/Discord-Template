import { config } from 'dotenv'
import termpkg from 'terminal-kit'
const { terminal } = termpkg
import { Collection, ShardingManager } from "discord.js"
import BotCommand, { CommandConfig } from './src/structures/interactions/Command.js'
import { readdirSync, statSync } from 'fs'
import deployCommands from './src/deploy-commands.js'
import startServer from './server.js'

config()

let hasDeployed = false

const manager = new ShardingManager('./src/bot.ts', {
  token: process.env.TOKEN,
  execArgv: process.execArgv,
  mode: 'process',
})

const commands: Collection<string, BotCommand<any>> = new Collection()

// Command loader
const commandsDir = './src/interactions/commands/'
readdirSync(commandsDir).forEach( folderName => {
  const commandFolderPath = commandsDir + folderName
  if (!statSync(commandFolderPath).isDirectory()) return

  readdirSync(commandFolderPath)
    .filter( fileName => fileName.endsWith('.ts'))
    .forEach( async fileName => {
      const commandConfig: CommandConfig<any> = (await import(`${commandsDir}${folderName}/${fileName}`)).default
      const command = new BotCommand({
        ...commandConfig,
        folder: folderName,
        file: fileName
      })
      commands.set(command.builder.name, command)
    })
})

manager.on('shardCreate', shard => {
  terminal.brightBlue(`Launched shard ${shard.id}\n`)
  shard.once('spawn', () => {
    shard.send(Object.fromEntries(commands))
  })
  shard.once('ready', async () => {
    if (hasDeployed) return
    hasDeployed = true
    const id = await shard.fetchClientValue('user.id')
    if (typeof id != 'string') return
    deployCommands(commands, id)
    
    startServer()
  })
})

manager.spawn({ timeout: 300_000 })