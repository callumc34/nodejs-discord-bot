const { Client } = require("discord.js");
const { CommandCollection } = require("./commands");

module.exports = class NodeJSBot extends Client {
    /**
     * @params {string} prefix - prefix for the bot
     * @params {Object} options - options for the discord bot
     */
    constructor (prefix, options = {}) {
        super(options);

        this.commandCollection = new CommandCollection();
        this.loaded = false;
        this.prefix = prefix;
    }

    /**
     * @params {string} token = token to run the bot
     * @return {Boolean} - true if function is successful
     */
    async initialise (token) {
        await this.login(token)
        .then(() => {
            console.log("Logged in successfully...");
            this.loaded = true;
        })
        .catch((error) => {
            console.error(error);
            this.loaded = false;
        });

        this.commandCollection;

        return this.loaded;
    }

    /**
     * @params {Message} message - Discord message to interact with
     * @return {Result of run function}
     */
    async messageHandler (message) {
        if (message.author.bot || !this.loaded || !message.content.startsWith(this.prefix)) return false;

        const args = message.content.slice(this.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        const cmd = this.commandCollection.fetchCommand(command);
        
        if (!cmd) {
            //Throw error
            return false;
        }

        const runCmd = new cmd();
        return await runCmd.run(message, args);

    }
}