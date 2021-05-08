import { EmojiIdentifierResolvable, Message, MessageReaction } from "discord.js";
import Item from "../../Item";
import AMenu from "./AMenu";

export default class MenuInspectScene extends AMenu {
    public emoji: EmojiIdentifierResolvable = '🔍';
    public getDescription = () => {
        return `Objets présents ici${this.game.currentScene.hasBeenUnlocked ? " (Certains objets ne sont pas accessibles)" : ""} :`
    }

    private getAccessibleItems = () => {
        return this.game.currentScene.accessibleItems;
    }

    private getLockedItems = () => {
        return  this.game.currentScene.hasBeenUnlocked ? this.game.currentScene.lockedItems : [];
    }

    private tryToFetchAvailableItems = (messageReaction: MessageReaction) => {
        let hasReacted = false;
        let fromAccessible = true;

        // Try accessible items
        let usedItemIndex =
            this.getAccessibleItems().findIndex(({ item }) => item.emoji === messageReaction.emoji.name);

        // Else try in locked items if the scene has been unlocked
        if (usedItemIndex === -1) {
            usedItemIndex = this.getLockedItems().findIndex((item) => item.emoji === messageReaction.emoji.name);
            fromAccessible = false;
        }

        if (usedItemIndex !== -1)
        {
            let usedItem = null;
            if (fromAccessible) {
                usedItem = this.getAccessibleItems()[usedItemIndex];
                this.game.currentScene.accessibleItems.splice(usedItemIndex, 1);
            } else {
                usedItem = this.getLockedItems()[usedItemIndex];
                this.game.currentScene.accessibleItems.splice(usedItemIndex, 1);
            }

            this.game.inventory.push(usedItem);
            hasReacted = true;
        }
        return hasReacted;
    }

    // Dans l'inventaire
    private tryToUnlockScenes = (messageReaction: MessageReaction) => {
        let hasReacted = false;

        const itemToUse = this.game.inventory.find((item: Item) => item.emoji === messageReaction.emoji.name);
        if (itemToUse) {
            hasReacted = true;
            this.game.currentScene.useItem(itemToUse);
        }

        return hasReacted;
    }

    protected addMenuReaction = (message: Message) => {
        this.getAccessibleItems().forEach(({ item }) => {
            message.react(item.emoji);
        });

        this.getLockedItems().forEach((item) => {
            message.react(item.emoji);
        });
    }

    protected onMenuReaction = (messageReaction: MessageReaction) => {
        return this.tryToFetchAvailableItems(messageReaction)
            || (this.game.currentScene.hasBeenUnlocked && this.tryToUnlockScenes(messageReaction));
    };
}