import { BaseInteraction, Events } from "discord.js";
import BotClient from "../structures/Client.js";
import BotEvent from "../structures/Event.js";

export default new BotEvent({
  name: Events.InteractionCreate,
  async execute (interaction: BaseInteraction) {
    const client: BotClient = interaction.client
    if (interaction.isChatInputCommand()) {
      const command = client.commands!.get(interaction.commandName)

      if(!command) return;
  
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      }
    } else if (interaction.isButton()) {
      const button = client.buttons?.get(interaction.customId)

      if (!button) return

      try {
        await button.execute(interaction)
      } catch (error) {
        console.error(error)
      }
    } else if (interaction.isModalSubmit()) {
      const modal = client.modals?.get(interaction.customId)

      if (!modal) return

      try {
        await modal.execute(interaction)
      } catch (error) {
        console.log(error)
      }
    } else if (interaction.isContextMenuCommand()) {
      const isUserContext = interaction.isUserContextMenuCommand()
      const commandKey = `context-${ isUserContext ? 'user' : 'message'}-${interaction.commandName}`
      
      const command = client.commands!.get(commandKey)
      
      if (!command) return;

      try {
        await command.execute(interaction)
      } catch (error) {
        console.error(error)
        return interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      }
    } else if (interaction.isAutocomplete()) {
      const command =  client.commands!.get(interaction.commandName)

      if (!command) return;

      try {
        if (command.autocomplete)
          await command.autocomplete(interaction)
      } catch (e) {
        console.error(e)
      }
    }
  },
})