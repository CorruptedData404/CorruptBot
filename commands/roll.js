const { SlashCommandBuilder} = require('discord.js');

module.exports = {
  global: true,
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls a die with a specified number of sides')
    .addIntegerOption(option =>
      option
        .setName('sides')
        .setDescription('The number of sides of the die')
        .setRequired(false)
        .setMinValue(2)
        .setMaxValue(10000)
    )
    .addIntegerOption(option =>
      option
        .setName('count')
        .setDescription('The number of die to roll')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .addBooleanOption(option =>
      option
        .setName('sum')
        .setDescription('Whether to sum up the result of the rolls')
        .setRequired(false)
    ),
  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') ?? 6;
    const count = interaction.options.getInteger('count') ?? 1;
    const sum = interaction.options.getBoolean('sum') ?? false;

    const rolls = [];
    let total = 0;
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      total += roll;
    }

    let result;
    if (sum) {
      result = `You rolled ${count} dice with ${sides} sides each.\n Total:\n${total}`;
    } else {
      result = `You rolled ${count} dice with ${sides} sides each.\n Roll(s):\n${rolls.join(', ')}`;
    }
    await interaction.reply(result);
  },
};

