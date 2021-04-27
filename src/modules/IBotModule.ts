import { Message } from "discord.js";

interface IBotModules {
    onMessage: (message: Message) => void
}

export default IBotModules;