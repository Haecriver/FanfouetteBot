class BotParameters {
    public logChannelId: string;

    toJson() {
        return JSON.stringify(this);
    }
}

export default BotParameters;