import { Message, MessageMentions, Snowflake, TextChannel } from "discord.js";
import Logger from "../../logger/Logger";
import ACommandModule from "../ACommandModule";
import Game from "./lib/Game";

export default class AdventureModule extends ACommandModule {
    public games: Map<Snowflake, Game> = new Map();
    public channelsInUse: Set<Snowflake> = new Set();

    public constructor(){
        super();
        this.addCommand('startAdventure', (message) => {
            this.start(message);
        });

        this.addCommand('exitAdventure', (message) => {
            this.exit(message);
        });
    }

    public start = (message: Message) => {
        const authorId = message.author.id;
        const channelId = message.channel.id;

        if (!this.games.has(authorId) && !this.channelsInUse.has(channelId)) {
            this.games.set(authorId, Game.generateGame(message.channel as TextChannel, authorId));
            this.channelsInUse.add(channelId);
        } else {
            if (this.games.has(authorId)) {
                message.author.send(`Tu es déjà en train de jouer sur <#${channelId}> ! (boloss)`);
            } else if (this.channelsInUse.has(channelId)) {
                message.author.send(`Quelqu'un joue déjà sur <#${channelId}> ! (idiot)`)
            }
        }
    }

    public exit = (message: Message) => {
        const authorId = message.author.id;

        if (this.games.has(authorId)) {
            const channelId = this.games.get(authorId).usedChannel.id;

            this.games.delete(authorId);
            this.channelsInUse.delete(channelId);

            message.channel.send('Gros lacheur 💩');
        } else {
            message.author.send(`Tu n'es pas actuellement en train de jouer `);
        }
    }

    protected onSimpleMessage = (message: Message) => null;
}