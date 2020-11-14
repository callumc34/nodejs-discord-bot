const fs = require("fs");

module.exports = {
    Command: class Command {
        /**
        * @param {string} name - name of command
        * @param {Array<string>} required - parameters to run command
        * @param {Array<string>} optional = optional parameters to run the command
        * @param {Array<Permission Flag>} privileges - required privileges to run the command
        */
        constructor (name, required, privileges, optional = []) {
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
        async _run (ctx, args) {
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

            return true;
        }

        async run () {}
    },

    CommandCollection: class CommandCollection {
        constructor () {
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