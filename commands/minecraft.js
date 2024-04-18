const { SlashCommandBuilder, Client } = require('discord.js');

// The user IDs of the allowed users to use certain subcommands
const { mcadminIds, mcStatusRole, mcServerName } = require('../config.json');
const mcutil = require('../mcutil');

module.exports = {
  global: false,
  data: new SlashCommandBuilder()
    .setName('minecraft')
    .setDescription('Manage the whitelist and execute console commands for ' + mcServerName)
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('whitelist')
        .setDescription('Manage the whitelist for ' + mcServerName)
        .addSubcommand((subcommand) =>
          subcommand
            .setName('add')
            .setDescription('Add a player to the whitelist')
            .addStringOption((option) =>
              option.setName('username').setDescription('Player username').setRequired(true)
            )
            .addBooleanOption((option) =>
              option.setName('ephemeral').setDescription('Set the response to be ephemeral')
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('remove')
            .setDescription('Remove a player from the whitelist')
            .addStringOption((option) =>
              option.setName('username').setDescription('Player username').setRequired(true)
            )
            .addBooleanOption((option) =>
              option.setName('ephemeral').setDescription('Set the response to be ephemeral')
            )
        )
        .addSubcommand((subcommand) =>
          subcommand.setName('list').setDescription('List all players on the whitelist')
            .addBooleanOption((option) =>
              option.setName('ephemeral').setDescription('Set the response to be ephemeral')
            )
        )
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('console')
        .setDescription('Run a command in the Minecraft server console')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('adminrun')
            .setDescription('Run any command in the server console')
            .addStringOption((option) =>
              option.setName('command').setDescription('The command to run').setRequired(true)
            )
            .addBooleanOption((option) =>
              option.setName('ephemeral').setDescription('Set the response to be ephemeral')
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('list')
            .setDescription('Lists players on the server')
            .addBooleanOption((option) =>
              option.setName('ephemeral').setDescription('Set the response to be ephemeral')
            )
        )
    )
    .addSubcommandGroup((subcommandGroup) =>
    subcommandGroup
      .setName('status')
      .setDescription('Check the current status of the server or subscribe for automatic status updates')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('check')
          .setDescription('Check the current status of the server')
          .addBooleanOption((option) =>
            option.setName('ephemeral').setDescription('Set the response to be ephemeral')
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('subscribe')
          .setDescription('Recieve automatic server status updates through direct messages')
      )
      .addSubcommand((subcommand) =>
      subcommand
        .setName('unsubscribe')
        .setDescription('Stop getting automatic server status updates')
      )
      .addSubcommand((subcommand) =>
      subcommand
        .setName('dmbroadcast')
        .setDescription('send a custom broadcast to all subscribed members')
        .addStringOption((option) =>
              option.setName('message').setDescription('The message you would like to send').setRequired(true)
            )
      )
  ),
  async execute(interaction) {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

    await interaction.deferReply({ephemeral: ephemeral});

      try {
        let output;
      
        if (subcommandGroup === 'whitelist') {
          if (subcommand === 'list' || mcadminIds.includes(interaction.user.id)) {

            switch (subcommand) {
              case 'add': {
                const username = interaction.options.getString('username');
                output = await mcutil.executeCommand('whitelist add ' + username);
                break;
              }
              case 'remove': {
                const username = interaction.options.getString('username');
                output = await mcutil.executeCommand('whitelist remove ' + username);
                break;
              }
              case 'list': {
                output = await mcutil.executeCommand('whitelist list');
                break;
              }
              default:
                throw new Error('Invalid subcommand');
            }

          } else {
            throw new Error('You are not authorized to use this command.');
          }
        } else if (subcommandGroup === 'console') {
          if(subcommand === 'list')
            output = await mcutil.executeCommand('list');
          else if (mcadminIds.includes(interaction.user.id)) {

            //Can add predefined admin commands in future
            switch (subcommand) {
              case 'adminrun': {
                const command = interaction.options.getString('command');
                output = await mcutil.executeCommand(command);
                break;
              }
              default:
                throw new Error('Invalid subcommand');
            }

            output = await mcutil.executeCommand(command);
          }
        } else if(subcommandGroup === 'status'){
          
          switch (subcommand) {
            case 'check': {
              const status = await mcutil.checkMCStatus();
              output = `The Minecraft server is ${status.online ? 'online' : 'offline, or another error has occured'}.`;
              break;
            }
            case 'subscribe': {
              try {
                await interaction.member.roles.add(mcStatusRole);
                output = interaction.member.displayName + ' has subscribed to server status notifications ' 
              } catch (error) {
                console.error('Error adding role:', error);
                throw new Error('Failed to add the role to ' + interaction.member.displayName + '.')
              }
              break;
            }
            case 'unsubscribe': {
              try {
                await interaction.member.roles.remove(mcStatusRole);
                output = interaction.member.displayName + ' has unsubscribed to server status notifications' 
              } catch (error) {
                console.error('Error removing role:', error);
                throw new Error('Failed to remove the role from ' + interaction.member.displayName + '.')
              }
              break;
            }
            case 'dmbroadcast': {
              if (mcadminIds.includes(interaction.user.id)){
                const message = interaction.options.getString('message');
                mcutil.sendStatusDMs(interaction.client,message)
              }
              else
                throw new Error('You are not authorized to use this command.');
              break;
            }
            default:
              throw new Error('Invalid subcommand');
          }

        }else {
          throw new Error('Invalid subcommand group');
        }
      
        await interaction.editReply({ content: output});
      } catch (error) {
        console.error(error);
        await interaction.editReply({ content: error.message});
      }      
  },
};
