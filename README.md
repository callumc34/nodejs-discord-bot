# nodejs-discord-bot

This bot is designed to be easily forkable to create your own bot and setup using nodejs.

## Making your own bot

### Clone this repository

Once this repository is cloned you'll need to make a start_script.js file which will instantiate the bot.

### Example start_script.sh
```js
const dotenv = require("dotenv");
const { NodeJSBot } = require(".");

dotenv.config();

bot = new NodeJSBot(process.env.PREFIX);

bot.once("ready", () => {
    console.log("Bot ready...");
});

bot.on("message", message => {
    bot.messageHandler(message);
})

bot.initialise(process.env.BOT_TOKEN);
```

Then you can run npm run dev to start the bot.

### Making your own commands

Firstly make a folder with an index.js in your commands location.
###### Note the folder name will be the name of the command!
The default is the commands folder however you can add commands from any directory.

To make your own commands you simply need to inherit the Command class from the command folder and build on this by making your own .run() function.
There is a built in command checker in the command class called _run which checks privileges and argument length or you can make your own checker in your command class.

### Example bot command
```js
const { Command } = require("..");

module.exports = class DeletePostCommand extends Command {
                constructor () {
                        super(
                                "delete",
                                 ["id"],
                                  []);
                }

                async run (ctx, args) {
                        let runnable = await this._run(ctx, args);
                        if (!runnable) {
                                //Ensure that the command can be run
                                return false;
                        }

                        ctx.channel.send("Deleting post...");
                }
        }
```

#### Adding the command to the bot

To load the commands simply call the {BOT_OBJECT}.commandCollection.loadCommands({optional directory}).

# Simply run the start_script and your bot will be up and running.
