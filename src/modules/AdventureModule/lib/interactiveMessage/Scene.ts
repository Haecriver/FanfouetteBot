import { Message, MessageReaction } from "discord.js";
import Game from "../Game";
import Item from "../Item";
import AIteractiveMessage from "./AInteractiveMessage";

const NOTHING_HAPPENED_MESSAGE = "Ca ne sert à rien ...";

export default class Scene extends AIteractiveMessage {
    public game: Game;
    public hasBeenUnlocked: boolean = false;

    public accessibleItems: Item[];
    public lockedItems: Item[];

    public unlockerItems: { item: Item, description: string }[];

    public north: Scene;
    public east: Scene;
    public south: Scene;
    public west: Scene;

    public onReaction = (messageReaction: MessageReaction) => {
       return this.game.onMenuEmoji(messageReaction);
    }

    protected addReactions = (message: Message) => {
        this.game.addMenuEmoji(message);
    };

    public useItem(item: Item) {
        const unlockerItem = this.unlockerItems.find((uItem) => uItem.item.key === item.key);
        if (unlockerItem) {
            const { description } = unlockerItem;
            this.game.usedChannel.send(description);
            this.hasBeenUnlocked = true;
        } else {
            this.game.usedChannel.send(NOTHING_HAPPENED_MESSAGE);
        }
    }

    public initiateFromJSON = (
        itemsMap: Map<string, Item>,
        {
            title,
            description,
            accessibleItems,
            lockedItems,
            unlockerItems,
        }
    ) => {
        this.title = title;
        this.description = description;
        this.accessibleItems = accessibleItems.map((key) => itemsMap.get(key));
        this.lockedItems = lockedItems.map((key) => itemsMap.get(key));
        this.unlockerItems = unlockerItems.map(
            ({ item: key, description: unlockingDesc }) =>
                ({ item: itemsMap.get(key), description: unlockingDesc })
        );
    }
}