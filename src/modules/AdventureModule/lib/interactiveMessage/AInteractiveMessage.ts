import { Message, MessageReaction, ReactionCollector } from "discord.js";
import Game from "../Game";

export default abstract class AIteractiveMessage {
    public title: string;
    protected description: string | string[];

    private collector: ReactionCollector;

    protected game: Game;
    public constructor(game: Game) {
        this.game = game;
    }

    public getDescription = () => {
        let toSend = this.description;
        if (Array.isArray(this.description)) {
            toSend = "";
            this.description.forEach(str => {
                toSend += `${str}\n`;
            });
        }
        toSend += this.getAdditionnalDescription();
        return toSend;
    }

    protected getAdditionnalDescription = () => '';

    private setCollector(message: Message) {
        this.stopCollector();
        this.collector = message.createReactionCollector((reaction, user) => user.id === this.game.currentUserId);
        this.collector.on('collect', collected  => {
            if (!this.onReaction(collected)) {
                // If this reaction was could not be used
                // We remove it
                collected.remove();
            }
        })
    }

    private stopCollector() {
        if (this.collector) {
            this.collector.stop();
        }
    }

    public load = () => {
        this.game.usedChannel.send(this.getDescription())
            .then((message: Message) => {
                this.addReactions(message);
                this.setCollector(message);
            });
    };

    public unload = () => {
        this.stopCollector();
    }

    protected abstract addReactions: (message: Message) => void;
    protected abstract onReaction: (messageReaction: MessageReaction) => boolean;
}