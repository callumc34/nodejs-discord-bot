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