"use strict";
/**
 * A ping pong bot, whenever you send "ping", it replies "pong".
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Import the discord.js module
const discord_js_1 = require("discord.js");
// Create an instance of a Discord client
const client = new discord_js_1.Client();
/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    // tslint:disable-next-line no-console
    console.log('I am ready!');
});
// Create an event listener for messages
client.on('message', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
        // Send "pong" to the same channel
        message.channel.send('pong');
    }
});
// Log our bot in using the token from https://discord.com/developers/applications
client.login('MzI0NjQ4NzY0NTk1NzY1MjUw.WUGeuQ.DfAL6-NmGYiY5-JzA2pjDTlVQ28');
//# sourceMappingURL=index.js.map