import { Message, MessageMentions, Snowflake } from "discord.js";
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
    private usersToBully: Map<Snowflake, { availableInsults: string[], infinite: boolean }> = new Map();

    public constructor(){
        super();
        this.addCommand('bully', (message, [username, infinite]) => {
            const match = new RegExp(MessageMentions.USERS_PATTERN).exec(username);
            if (match) {
                this.usersToBully.set(match[1], {
                    availableInsults: [...INSULTS],
                    infinite: !infinite || infinite === "true"
                });
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
            const { availableInsults, infinite } = this.usersToBully.get(userId);

            // Get insult
            const index = Math.floor(Math.random() * availableInsults.length);

            // remove it from the array
            const [insult] = availableInsults.splice(index, 1);
            this.usersToBully.set(userId, { availableInsults, infinite });

            // send it
            message.channel.send(insult.replace("%user", `<@!${userId}>`));

            // refill array if needed
            if (availableInsults.length === 0 && infinite) {
                this.usersToBully.set(userId,  { availableInsults: [...INSULTS], infinite });
            }
        }
    };

}