import termpkg from "terminal-kit"
const { terminal } = termpkg
import { Routes, REST, Collection, RESTPostAPIChatInputApplicationCommandsJSONBody, RESTPutAPIApplicationCommandsResult, RESTPostAPIContextMenuApplicationCommandsJSONBody, ApplicationCommandType } from "discord.js"
import BotCommand from "./structures/interactions/Command.js"

type CommandJSONBody = RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody
type CommandJSONBodyArray = CommandJSONBody[]

export default function deployCommands (commands: Collection<string, BotCommand<any>>, id: string) {
  const publicCommands: CommandJSONBodyArray = []
  const privateCommands = new Collection<string, CommandJSONBodyArray>()

  commands.forEach( command => {
    if (command.guild) {
      command.guild.forEach( guildId => {
        const previous = privateCommands.get(guildId) ?? []
        previous.push(command.builder.toJSON())
        privateCommands.set(guildId, previous)
      })
    } else {
      publicCommands.push(command.builder.toJSON())
    }
  })
  
  const rest = new REST().setToken(process.env.TOKEN!)

  rest.put(
    Routes.applicationCommands(id),
    {
      body: publicCommands
    }
  )
  .then(commandsResults => {
    if (convert(commandsResults))
    
    commandsResults.forEach(command => {
      const key = command.type == ApplicationCommandType.ChatInput
        ? command.name
        : command.type == ApplicationCommandType.User
          ? `context-user-${command.name}`
          : `context-message-${command.name}`
      const commandModule = commands.get(key)
      commandModule!.id = command.id
    })
    terminal
      .bgBrightGreen.black(' OK ')
      .brightBlue(` Succesfully registered ${publicCommands.length} command(s)\n`)
  })
  .catch((e) => {
    terminal
      .bgBrightRed.black(' FAIL ')
      .brightBlue(` Failed to register ${publicCommands.length} command(s)\n`)
    console.error(e)
  })
  
  privateCommands.forEach((commandsResArray, guildId) => {
    rest.put(Routes.applicationGuildCommands(id, guildId), {
      body: commandsResArray
    })
    .then(commandsResults => {
      if (convert(commandsResults))

      commandsResults.forEach(commandResult => {
        const key = commandResult.type == ApplicationCommandType.ChatInput
        ? commandResult.name
        : commandResult.type == ApplicationCommandType.User
          ? `context-user-${commandResult.name}`
          : `context-message-${commandResult.name}`
        const commandModule = commands.get(key)
        typeof commandModule?.id == 'object' ? commandModule.id[guildId] = commandResult.id : commandModule!.id =  { guildId: commandResult.id }
      })

      terminal
        .bgBrightGreen.black(' OK ')
        .brightBlue(` Succesfully registered ${commandsResArray.length} command(s) on `)
        .gray(guildId)
        ('\n')
    })
    .catch((e) => {
      terminal
        .bgBrightRed.black(' FAIL ')
        .brightBlue(` Failed to register ${commandsResArray.length} command(s) on `)
        .gray(guildId)
        ('\n')
      console.error(e)
    })
  })
}

const convert = (result: unknown): result is RESTPutAPIApplicationCommandsResult => true