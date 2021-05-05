import { EmojiIdentifierResolvable, Message, MessageReaction, ReactionCollector, TextChannel } from "discord.js";
import Item from "./Item";
import Scene from "./interactiveMessage/Scene";
import AMenu from "./interactiveMessage/Menu/AMenu";
import MenuDirection from "./interactiveMessage/Menu/MenuDirections";
import MenuInspectScene from "./interactiveMessage/Menu/MenuInspectScene";
import MenuInventory from "./interactiveMessage/Menu/MenuInventory";
import itemsJSON from "../rsc/items.json";
import scenesJSON from "../rsc/scenes.json";
import AIteractiveMessage from "./interactiveMessage/AInteractiveMessage";


export default class Game {
    public usedChannel: TextChannel;

    private initialScene: Scene;
    public currentScene: Scene;
    public currentInteractiveMessage: AIteractiveMessage;
    public inventory: Item[] = [];
    private menuMap: Map<EmojiIdentifierResolvable, AMenu> = new Map();

    public constructor(channel: TextChannel) {
        this.usedChannel = channel;

        const itemMap = new Map();
        itemsJSON.forEach((itemJSON) => {
            const item = new Item();
            item.initiateFromJSON(itemJSON as any);
            itemMap.set(item.key, item);
        });

        const scenes = scenesJSON.map((sceneJSON) => {
            const scene = new Scene(this);
            scene.initiateFromJSON(itemMap, sceneJSON as any);
            return scene;
        });

        // Put generator here
        this.initialScene = scenes[0];

        const menuList = [
            new MenuDirection(this),
            new MenuInspectScene(this),
            new MenuInventory(this),
        ];

        menuList.forEach(menu => {
            this.menuMap.set(menu.emoji, menu);
        });
    }

    public static generateGame = (channel: TextChannel) => {
        const newGame = new Game(channel);

        newGame.load(newGame.initialScene);
        return newGame;
    }

    public getIsWon = () => {
        return false;
    }

    public load = (interactiveMessage: AIteractiveMessage) => {
        if (this.currentInteractiveMessage) {
            this.currentInteractiveMessage.unload();
        }

        // Store scene if this is one
        if (interactiveMessage instanceof Scene) {
            this.currentScene = interactiveMessage as Scene;
        }

        this.currentInteractiveMessage = interactiveMessage;
        interactiveMessage.load();
    }

    public reloadCurrentScene = () => {
        this.load(this.currentScene);
    }

    public addMenuEmoji = (message: Message) => {
        this.menuMap.forEach((menu, emoji) => {
            message.react(emoji);
        });
    }

    public onMenuEmoji = (messageReaction: MessageReaction) => {
        const hasReacted = this.menuMap.has(messageReaction.emoji.name);
        if (hasReacted) {
            this.menuMap.get(messageReaction.emoji.name).load();
        }
        return hasReacted;
    }
}