import { Message, MessageMentions, UserManager, Snowflake } from "discord.js";
import Logger from "../../logger/Logger";
import ACommandModule from "../ACommandModule";
import BotParametersSingleton from "../../singletons/BotParametersSingleton";
import { parse } from "../../tools/format";

const INSULTS = [
    "Agnagnagna, je m'appelle %user et j'arrète pas de parler, gnagnagna.",
    "Grosse merde",
    "Ah tutut %user, on avait dit que tu te taisais, non ?",
    "Mais qu'est ce qu'il dit lui encore ...",
    "%user. Tu te tais maintenant",
    "Au nom de tout le serveur, %user, ferme-la, merci.",
    "BLA BLA BLA",
    "Hé hé %user, on joue au roi du silence ? Tu commences."
];

export default class BullyModule extends ACommandModule {
    private usersToBully: Set<Snowflake> = new Set<Snowflake>();

    public constructor(){
        super();
        this.addCommand('bully', (message, [username]) => {
            const match = new RegExp(MessageMentions.USERS_PATTERN).exec(username);
            if (match) {
                this.usersToBully.add(match[1]);
            }
        });

        this.addCommand('unbully', (message, [username]) => {
            const match = new RegExp(MessageMentions.USERS_PATTERN).exec(username);
            if (match) {
                this.usersToBully.delete(match[1]);
            }
        });
    }

    protected onSimpleMessage = (message: Message) => {
        const userId: Snowflake = message.author.id;
        if (this.usersToBully.has(userId)) {
            const insult = INSULTS[Math.floor(Math.random() * INSULTS.length)];
            message.channel.send(insult.replace("%user", `<@!${userId}>`));
        }
    };

}