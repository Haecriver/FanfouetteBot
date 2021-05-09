import { EmojiIdentifierResolvable, Message, MessageReaction } from "discord.js";
import Item from "../../Item";
import AMenu from "./AMenu";

export default class MenuInspectScene extends AMenu {
    public emoji: EmojiIdentifierResolvable = '🔍';
    public getDescription = () => {
        return `Objets présents ici${this.game.currentScene.hasLockedItems() ? " (Certains objets ne sont pas accessibles)" : ""} :`
    }

    protected addMenuReaction = (message: Message) => {
        this.game.currentScene.accessibleItems.forEach(({ item }) => {
            message.react(item.emoji);
        });
    }

    protected onMenuReaction = (messageReaction: MessageReaction) => {
        let hasReacted = false;
        const item = this.game.itemEmojiMap.get(messageReaction.emoji.name);
        if (item) {
            hasReacted = this.game.currentScene.useItem(item);
        }
        return hasReacted;
    };
}