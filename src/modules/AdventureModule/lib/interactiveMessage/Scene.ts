import { Message, MessageReaction } from "discord.js";
import Game from "../Game";
import Item from "../Item";
import AIteractiveMessage from "./AInteractiveMessage";

const NOTHING_HAPPENED_MESSAGE = "Ca ne sert à rien ...";

enum EDirection {
    NORTH,
    EAST,
    SOUTH,
    WEST,
};

export default class Scene extends AIteractiveMessage {
    public game: Game;

    public accessibleItems: { item: Item, indication?: string }[];
    public lockedItems: Item[];
    public lockedDirections: {
        directionsLocked: EDirection[],
        onUnlock: string,
        indicationNotUnlocked: string,
        item: Item,
    };

    public unlockerItems: { item: Item, unlock: Item, description: string }[];

    public north: Scene;
    public east: Scene;
    public south: Scene;
    public west: Scene;

    public hasLockedItems = () => this.unlockerItems.length !== 0;

    public onReaction = (messageReaction: MessageReaction) => {
        return this.game.onMenuEmoji(messageReaction);
    }

    protected addReactions = (message: Message) => {
        this.game.addMenuEmoji(message);
    }

    protected getAdditionnalDescription = () => {
        let toDisplay = '';
        this.accessibleItems.forEach(({ indication }) => {
            toDisplay += `\n${indication}`;
        });

        if (this.lockedDirections) {
            toDisplay += `\n${this.lockedDirections.indicationNotUnlocked}`;
        }
        return toDisplay;
    }

    public useItem(item: Item) {
        const isInInventory = this.game.inventory.some((inventoryItem: Item) => inventoryItem.emoji === item.emoji);

        const success =
            this.tryUnlockItem(item, isInInventory)
            || this.tryUnlockDirection(item, isInInventory)
            || this.tryAccessItem(item);

        if (!success) {
            // Nothing happened
            this.game.usedChannel.send(NOTHING_HAPPENED_MESSAGE);
        }

        return success;
    }

    private tryUnlockItem = (item, isInInventory) => {
        let success = false;
        const index = this.unlockerItems.findIndex((uItem) => uItem.item.key === item.key);
        const unlockerItem = this.unlockerItems[index];
        if (unlockerItem && isInInventory) {
            success = true;

            const { description, unlock } = unlockerItem;
            this.accessibleItems.push({ item: unlock });
            this.unlockerItems.splice(index, 1);

            this.game.usedChannel.send(description);
        }
        return success;
    }

    private tryUnlockDirection = (item, isInInventory) => {
        let success = false;

        if (this.lockedDirections && this.lockedDirections.item.key === item.key && isInInventory) {
            success = true;

            this.game.usedChannel.send(this.lockedDirections.onUnlock);
            this.lockedDirections = null;
        }
        return success;
    }

    private tryAccessItem = (item) => {
        let success = false;

        // Try accessible items
        const accessibleItemIndex =
            this.accessibleItems.findIndex(({ item: accessibleItem }) => accessibleItem.emoji === item.emoji);

        if (accessibleItemIndex !== -1)
        {
            success = true;

            let usedItem: Item = null;
            usedItem = this.accessibleItems[accessibleItemIndex].item;
            this.accessibleItems.splice(accessibleItemIndex, 1);
            this.game.inventory.push(usedItem);
        }
        return success;
    }

    public initiateFromJSON = (
        itemsMap: Map<string, Item>,
        {
            title,
            description,
            accessibleItems,
            lockedItems,
            unlockerItems,
            lockedDirections,
        }
    ) => {
        this.title = title;
        this.description = description;
        this.accessibleItems = accessibleItems.map((obj) => {
            if (typeof obj === "string") {
                return { item: itemsMap.get(obj) };
            } else {
                return { item: itemsMap.get(obj.item), indication: obj.indication }
            }
        });
        this.lockedItems = lockedItems.map((key) => itemsMap.get(key));
        this.unlockerItems = unlockerItems.map(
            ({ item, unlock, description: unlockingDesc }) =>
                ({
                    item: itemsMap.get(item),
                    unlock: itemsMap.get(unlock),
                    description: unlockingDesc
                })
        );

        if (lockedDirections) {
            this.lockedDirections = {
                directionsLocked: [],
                item: itemsMap.get(lockedDirections.item),
                indicationNotUnlocked: lockedDirections.indicationNotUnlocked,
                onUnlock: lockedDirections.onUnlock,
            }
        }
    }
}