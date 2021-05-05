import { EmojiIdentifierResolvable, Message, MessageReaction } from "discord.js";
import Game from "../../Game";
import AMenu from "./AMenu";

export default class MenuDirection extends AMenu {
    public emoji: EmojiIdentifierResolvable = '🧭';
    protected description: string =
        "Quelle directions prendre ? 🗺"

    protected onMenuReaction = (messageReaction: MessageReaction) => {
        let hasReacted = true;
        switch (messageReaction.emoji.name) {
            case '🔼':
                if (this.game.currentScene.north) {
                    this.game.load(this.game.currentScene.north);
                }
                break;

            case '▶':
                if (this.game.currentScene.east) {
                    this.game.load(this.game.currentScene.east);
                }
                break;

            case '🔽':
                if (this.game.currentScene.south) {
                    this.game.load(this.game.currentScene.south);
                }
                break;

            case '◀':
                if (this.game.currentScene.west) {
                    this.game.load(this.game.currentScene.west);
                }
                break;

            default:
                hasReacted = false;
                break;
        }

        return hasReacted;
    };


    protected addMenuReaction = (message: Message) => {
        if (this.game.currentScene.north) {
            message.react('🔼');
        }
        if (this.game.currentScene.east) {
            message.react('▶');
        }
        if (this.game.currentScene.south) {
            message.react('🔽');
        }
        if (this.game.currentScene.west) {
            message.react('◀');
        }
    };
}