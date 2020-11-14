const fs = require("fs");
const EventEmitter = require("events");

module.exports = {
    Command: class Command extends EventEmitter {
        /**
        * @param {string} name - name of command
        * @param {Array<string>} required - parameters to run command
        * @param {Array<string>} optional = optional parameters to run the command
        * @param {Array<Permission Flag>} privileges - required privileges to run the command
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
                return false;
            }

            for (let permission of this.privileges) {
                if (!ctx.client.hasPermission(permission, true)) {
                    //if user does not have permission
                    return false;
                }
            }

            return this.emit("ran", ctx, args, this._run(), this);
        }

        async _run () {}
    },

    CommandCollection: class CommandCollection extends EventEmitter {
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
                this.addCommand(folder.name, command);
            });

            return true;
        }

        /**
         * @param {string} name - name of command
         * @param {Command} command - command to run
         * @return {Boolean} - true returned
         */
        addCommand (name, command) {
            this._commands[name] = command;
            this._commands[name].on("ran", (ctx, args, result, command) => {
                this.emit("ran", ctx, args, result, command);
            });
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
}