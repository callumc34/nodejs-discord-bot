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

bot = new NodeJSBot(process.env.BOT_PREFIX);

bot.once("ready", () => {
    bot.commandCollection.loadCommands();
    console.log("Bot ready...");
});

bot.commandCollection.on("ran", console.log);

bot.initialise(process.env.BOT_TOKEN);
```

Then you can run npm run dev to start the bot.

### Making your own commands

Firstly make a folder with an index.js in your commands location.
###### Note the folder name will be the name of the command!
The default is the commands folder however you can add commands from any directory using `bot.commandCollection.loadCommands(directory)`.

To make your own commands you simply need to inherit the Command class from the command folder and build on this by making your own .run() function.

There is a built in command checker in the command class called _run which checks privileges and argument length or you can make your own checker in your command class.

Once the command is ran the commandCollection will emit a "ran" event
### Example bot command
```js
const { Command } = require("..");

module.exports = class TestCommand extends Command {
                constructor () {
                        super(
                                "test",
                                  [],
                                  []);
                }

                async _run (ctx, args) {
                    ctx.channel.send("Testing...");
                }
        }
```
#### Adding the command to the bot

To load the commands simply call the {BOT_OBJECT}.commandCollection.loadCommands({optional directory}).

# Simply run the start_script and your bot will be up and running.
