const Docker = require('dockerode');
const net = require('net');
const { minecraftServerIP, minecraftServerPort, mcServerContainer, guildIds, mcDMStatusRole, mcPingStatusRole, mcStatusChannel } = require('./config.json');

let mcServerStatus = false;

module.exports = {
  // Function to execute a command in the Minecraft server console
  async executeCommand(command) {
    const mcContainer = new Docker().getContainer(mcServerContainer);
    // Execute the provided command within the mc server container
    const exec = await mcContainer.exec({
      Cmd: ['rcon-cli', command],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start();
    let output = '';

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => {
        output += chunk.toString();
      });

      stream.on('end', () => {

        //Not perfect but honestly good enough
        const pattern = /^(?:.*?)([A-Z].*?)(?:\s*\x1b\[0m)?(?:\n|$)/gm;
        const sanitizedOutput = output.replace(pattern, '$1').trim();
        resolve(sanitizedOutput);
      });

      stream.on('error', (error) => {
        reject(new Error(`An error occurred while running the command: ${error.message}`));
      });
    });
  },

// Function to check if the Minecraft server is online
async checkMCStatus(timeoutMs = 5000) {
  return new Promise((resolve) => {
    console.log('Attempting to check server status.')
    const client = net.createConnection(minecraftServerPort, minecraftServerIP);

    // Set a timeout for the connection attempt
    const timeout = setTimeout(() => {
      client.end(); // Close the connection
      console.log('Connection attempt timed out.');
      resolve({ online: false }); // Server is offline or connection timed out
    }, timeoutMs);

    client.on('connect', () => {
      clearTimeout(timeout); // Clear the timeout
      client.end(); // Close the connection
      console.log('Server is online.')
      resolve({ online: true }); // Server is online
    });

    client.on('error', (error) => {
      clearTimeout(timeout); // Clear the timeout
      console.log('Server is offline or another error occurred: ' + error);
      resolve({ online: false }); // Server is offline
    });
  });
},


async sendStatusDMs(client, message) {
  let finalMessage = '';

  if (typeof message === 'boolean') {
    if(message !== mcServerStatus)
      mcServerStatus = message;
    else
      return;

      finalMessage = mcServerStatus ? 'The Server is now up!' : 'The Server is now down!';
  } else if (typeof message === 'string') {
    // Use the provided string as-is
    finalMessage = message;
  } else {
    throw new Error('Message must be a string or a boolean.');
  }

  if (!finalMessage.trim()) {
    throw new Error('Message is empty or contains only whitespace.');
  }

  const guild = client.guilds.cache.get(guildIds[1]);
  const membersDM = guild.roles.cache.get(mcDMStatusRole).members;

  const statusChannel = client.channels.cache.get(mcStatusChannel);
  const pingRoleMention = `<@&${mcPingStatusRole}>`;

  //send status channel message

  statusChannel.send(pingRoleMention + '\n' + finalMessage);

  //send status DMs
  membersDM.forEach((member) => {
    member.send(finalMessage)
      .then(() => {
        console.log(`status DM sent successfully to user ${member.user.tag}`);
      })
      .catch((error) => {
        console.error(`Failed to send status DM to user ${member.user.tag}:`, error);
      });
  });
  
}
};
