import { EmojiIdentifierResolvable, Message, MessageReaction } from "discord.js";
import Game from "../../Game";
import Item from "../../Item";
import AMenu from "./AMenu";

export default class MenuInventory extends AMenu {
    public emoji: EmojiIdentifierResolvable = '🎒';
    protected description: string =
        "Utiliser un objet de l'inventaire ?"

    protected onMenuReaction = (messageReaction: MessageReaction) => {
        let hasReacted = false;

        const itemToUse = this.game.inventory.find((item: Item) => item.emoji === messageReaction.emoji.name);
        if (itemToUse) {
            hasReacted = true;
            this.game.currentScene.useItem(itemToUse);
        }

        return hasReacted;
    };


    protected addMenuReaction = (message: Message) => {
        this.game.inventory.forEach((item: Item) => {
            message.react(item.emoji);
        })
    };
}