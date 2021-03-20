const fs = require("fs");
const EventEmitter = require("events");

const Command = class Command extends EventEmitter {
        /**
        * @param {string} name - name of command
        * @param {Array<string>} required - parameters to run command
        * @param {Array<string>} optional = optional parameters to run the command
        * @param {Array<Permission Flag>} privileges - required privileges to run the command
        * Privilege flags can be found at - https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
        */
        constructor (name, required, privileges, optional = []) {
            super();
            this.name = name;
            this.required = required;
            this.privileges = privileges;
            this.optional = optional;
        }


        /**
         * @param {Message} ctx - Message that triggered it
         * @param {Array>string>} args - Arguments passed
         * @return {Boolean} - true if successful
         */
        async run (ctx, args) {
            if (args.length < this.required.length) {
                //Throw error here
                return this.emit("argError", ctx, args, this);
            }

            for (let permission of this.privileges) {
                if (!ctx.member.hasPermission(permission, true)) {
                    //if user does not have permission
                    return this.emit("permissionError", ctx, args, this);
                }
            }

            return this.emit("ran", ctx, args, await this._run(ctx, args), this);
        }

        async _run () {}
    }

const CommandCollection = class CommandCollection extends EventEmitter {
        /**
         * Instantiates the event emitter and creates a new object of commands
         */
        constructor () {
            super();
            this._commands = {}
        }

        /**
         * Loads commands.
         *
         * @param      {string}   [default command directory]  The directory
         * @return     {boolean}  { true if successful }
         */
        loadCommands (directory = process.cwd()+"/commands") {
            const folders = fs.readdirSync(directory, {withFileTypes: true});
            
            folders.filter(folder => !folder.isFile())
            .forEach((folder) => {
                const command = require(directory + "/" + folder.name);
                this.addCommand(folder.name, new command());
            });

            return true;
        }

        /**
         * @param {Command} command - command to run
         * @return {Boolean} - true returned
         */
        addCommand (name, command) {
            if (!Command.isPrototypeOf(command.constructor)) {
                //Check that class inherits from Command
                return false;
            }
            command.on("ran", (ctx, args, result, command) => {
                this.emit("ran", ctx, args, result, command);
            });
            this._commands[name] = command;
            return true;
        }

        /**
         * @param {string} name - name of command
         * @return {Object} - returns the class of the command
         */
        fetchCommand (name) {
            let result = this._commands[name];
            return result ? result : false;
        }

        /**
         * @param {string} name - name of command
         * @return {Boolean} - returns the result of deletion
         */
        removeCommand (name) {
            return delete this._commands[name];
        }
    }

module.exports = {
    Command,
    CommandCollection,
}