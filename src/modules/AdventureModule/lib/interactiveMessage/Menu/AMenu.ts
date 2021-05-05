import { EmojiIdentifierResolvable, Message, MessageReaction } from "discord.js";
import AIteractiveMessage from "../AInteractiveMessage";

const RETURN_EMOJI: EmojiIdentifierResolvable = '🚫';

export default abstract class AMenu extends AIteractiveMessage {
    public emoji: EmojiIdentifierResolvable;

    public onReaction = (messageReaction: MessageReaction) => {
        let hasReacted = false;
        if (messageReaction.emoji.name === RETURN_EMOJI) {
            hasReacted = true;
        }

        if (!hasReacted) {
            hasReacted = this.onMenuReaction(messageReaction);
        }

        if (hasReacted) {
            // We have to unload the menu
            this.game.reloadCurrentScene();
        }

        return hasReacted;
    }

    public addReactions = (message: Message) => {
        this.addMenuReaction(message);
        message.react(RETURN_EMOJI);
    };

    protected onMenuReaction: (messageReaction: MessageReaction) => boolean;
    protected addMenuReaction: (message: Message) => void;
}