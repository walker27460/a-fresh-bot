"use strict";
exports.__esModule = true;
var Discord = require("discord.js");
var express = require("express");
var urllib = require("urllib");
var fs = require("fs");
var app = express();
var client = new Discord.Client();
var discordtoken = process.env.DISCORD_KEY;
var xboxtoken = "cbddf965d064e72bc9ff663e6d7a136819aa44d6";
var prefix = '!';
// When the bot is ready, this'll run.
client.on('ready', function () {
    console.log('Ready!');
    console.log("Logged in as " + client.user.tag);
});
// When the bot hears a message in a server it's in,
// it'll call this function, passing the mesasge to it.
// https://discord.js.org/#/docs/main/stable/class/Message
client.on('message', function (message) {
    // Ignore messages from other bots.
    if (message.author.bot)
        return;
    // Ignore messages if they don't start with the prefix;
    if (!message.content.startsWith(prefix))
        return;
    // Let args be an array of strings passed to the bot.
    var args = message.content.substr(prefix.length).split(/ +/);
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var i = args_1[_i];
        console.log(args[i]);
    }
    // A quick and dirty command list.
    // With switch/case statements, creating aliases becomes super simple.
    // https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=reply
    switch (args[0]) {
        case 'hello':
            message.reply("Hello <@" + message.author.id + ">!");
            break;
        case 'chgpfx':
            if (args[1].match(/a-zA-Z0-9+/)) {
                message.reply("ERROR: You can't set " + args[1] + " as prefix!");
                break;
            }
            else if (typeof args[1] == 'undefined') {
                return;
            }
            else if (args[1].length !== 1) {
                message.reply("ERROR: Multiple symbol detected. You can set only 1 symbol as prefix.");
                break;
            }
            else {
                prefix = args[1];
                message.reply("Prefix changed to " + prefix + ".");
                break;
            }
        case 'disconnect':
            message.reply("Destroyed connection with Discord.");
            client.destroy();
            break;
        case 'addgt':
            var options = {
                method: "GET",
                headers: {
                    "X-AUTH": xboxtoken
                }
            };
            urllib.request("https://xapi.us/v2/xuid/" + args[1], function (err, data1, res) {
                if (err)
                    console.error(err.message);
                else {
                    if (typeof (data1) === "string") {
                        fs.readFile("./xuid.json", function (err, data) {
                            if (err)
                                console.error(err.message);
                            else {
                                var jsonobj = JSON.parse(data.toString());
                                var obj = {
                                    name: args[1],
                                    xuid: data1
                                };
                                jsonobj[jsonobj.length + 1] = obj;
                                fs.writeFile("./xuid.json", JSON.stringify(jsonobj), function (err) {
                                    if (err)
                                        console.error(err.message);
                                });
                            }
                        });
                    }
                }
            });
            // message.author.id
            message.reply("Under construction.");
        case 'help':
            message.reply(prefix + "help: This message\n" + prefix + "chgpfx: Change prefix to your favourite symbol.\n" + prefix + "addgt: Add Xbox GT to <@576725450861314049>'s Minecraft server\n" + prefix + "hello: just hello.");
            break;
    }
});
client.login(discordtoken);
var port = Number(process.env.PORT) | 80;
app.get('/', function (req, res) {
    res.status(200).send();
});
app.listen(port, function () {
    console.log("Listening on port " + port);
});
