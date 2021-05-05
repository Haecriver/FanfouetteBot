import { EmojiIdentifierResolvable } from "discord.js";

export default class Item {
    public description: string;
    public name: string;
    public key: string;
    public emoji: EmojiIdentifierResolvable;

    public initiateFromJSON = ({ name, description, key, emoji }) => {
        this.name = name;
        this.description = description;
        this.key = key;
        this.emoji = emoji;
    }
}