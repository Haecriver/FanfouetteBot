import { Message, MessageMentions, Snowflake } from "discord.js";
import Logger from "../../logger/Logger";
import ACommandModule from "../ACommandModule";

const INSULTS = [
    "Agnagnagna, je m'appelle %user et j'arrète pas de parler, gnagnagna.",
    "Gros cul",
    "Ah tutut %user, on avait dit que tu te taisais, non ?",
    "Mais qu'est ce qu'il dit lui encore ...",
    "%user ! Tu te tais maintenant !",
    "Au nom de tout le serveur, %user, ferme-la, merci.",
    "BLA BLA BLA",
    "Hé ! Hé %user, on joue au roi du silence ? Tu commences.",
    "Bon ça y est ? Tu vas te taire là %user ?",
    "Ouah j'ai une idée ! En fait tu pourrais la fermer %user, et ça serait cool !",
    "Blablablablablabla ... ",
    "Oh regardez moi ! Je suis %user et je suis chiant !",
    "Vous vous souvenez de l'époque où %user était pas là ? Bah moi non plus PARCE QU'IL LA FERME JAMAIS !"
];

export default class BullyModule extends ACommandModule {
    private usersToBully: Map<Snowflake, string[]> = new Map();

    public constructor(){
        super();
        this.addCommand('bully', (message, [rawUserId]) => {
            const match = new RegExp(MessageMentions.USERS_PATTERN).exec(rawUserId);
            if (match) {
                this.usersToBully.set(match[1], []);
                Logger.log(`bullying ${rawUserId}`);
            }
        });

        this.addCommand('unbully', (message, [rawUserId]) => {
            const match = new RegExp(MessageMentions.USERS_PATTERN).exec(rawUserId);
            if (match) {
                this.usersToBully.delete(match[1]);
                Logger.log(`unbullying ${rawUserId}`);
            }
        });
    }

    protected onSimpleMessage = (message: Message) => {
        const userId: Snowflake = message.author.id;
        if (this.usersToBully.has(userId)) {
            // refill array
            if (this.usersToBully.get(userId).length === 0) {
                this.usersToBully.set(userId, [...INSULTS]);
            }

            // Get insult
            const availableInsults = this.usersToBully.get(userId);
            const index = Math.floor(Math.random() * availableInsults.length);

            // remove it from the array
            const [insult] = availableInsults.splice(index, 1);
            this.usersToBully.set(userId, availableInsults);

            // send it
            message.channel.send(insult.replace("%user", `<@!${userId}>`));
        }
    };

}