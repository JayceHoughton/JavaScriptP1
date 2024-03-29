//Main file for Client and all primary client functions. General functions are in functions.js

const WebSocket = require('ws');

const readlineSync = require('readline-sync')
const readline = require('readline')
const chalk = require('chalk')
const boxen = require('boxen')
const wcwidth = require('wcwidth')

const functions = require('./functions')
const BotIt = require('./BotIt')

console.log(boxen(chalk.green("Welcome to the GAB Client!"), {padding: 1}))

//Asks for username and loops until username meets requirments
while(true) {
    username = readlineSync.question("Enter username: ")
    if(username.length > 10 || username.length < 3)
    {
        console.log("Username is too long.")
        continue
    }
    else if(!username.match(/^[a-zA-Z0-9]/))
    {
        console.log("Username contains invalid characters.")
        continue
    }
    else
        break
}

ip = readlineSync.question("Enter server ip: ")
port = readlineSync.question("Enter server port: ")

serverAddress = "ws://" + ip + ":" + port + "/?username=" + username

//Connecting to the Websocket
webSocket = new WebSocket(serverAddress)

//Sets up readline interface for use later
const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

readLine.setPrompt("Send: ")

webSocket.onopen = () => {
    //Server connections message boxed in
    console.log(boxen(`Welcome to the Server ${username}!\n` +
    `Available Commands:\n` + 
    `(\\w + username): Whisper user with username.\n` + 
    `(\\i): Ask the server what your username is.\n` + 
    `(\\u): Get a list of server users.\n` + 
    `(\\l): Leave the server.\n` +
    `(\\e): Emote List.\n` +
    `(\\b): Enable BotIt.`, {padding: 0}))

    readLine.on('line', (message) => {
        //Clears readline after message is sent to get rid of clutter
        readline.moveCursor(process.stdout, 0, -1)
        //Whsiper command
        if(message.match(/^(\\w\s)/g))
        {
            //Regex to get everything after \w and a space
            let whisperName = message.match(/(?<=\\w\s)(\w+)/g)
            let messageToSend = {
                from: username,
                to: whisperName[0],
                kind: "direct",
                data: functions.emoteCheck(message.substr(message.indexOf(whisperName) + whisperName[0].length, message.length))
            }
            readline.cursorTo(process.stdout, 0)
            console.log(`(Whispering ${whisperName[0]}): ${message.substr(message.indexOf(whisperName) + whisperName[0].length, message.length)}`)
            readLine.prompt(true)
            webSocket.send(JSON.stringify(messageToSend))
        }
        //Userlist command
        else if(message.match(/^(\\u)/g))
        {
            let messageToSend = {
                from: username,
                to: 'irrelevant',
                kind: "userlist",
                data: 'irrelevant'
            }
            webSocket.send(JSON.stringify(messageToSend))
        }
        //WhoAmI command
        else if(message.match(/^(\\i)/g))
        {
            let messageToSend = {
                from: username,
                to: 'irrelevant',
                kind: "whoami",
                data: 'irrelevant'
            }
            webSocket.send(JSON.stringify(messageToSend)) 
        }
        //Leave the server
        else if(message.match(/^(\\l)/g))
        {
            console.log(chalk.bgMagenta("Leaving server..."))
            webSocket.close()
            readLine.close
            process.exit(0)
        }
        //Emote List command
        else if(message.match(/^(\\e)/g))
        {
            readline.cursorTo(process.stdout, 0)
            console.log(boxen(chalk.green("Emote List: \n") +
            ":shades1: = ( •_•)>⌐■-■\n" +
            ":shades2: = (⌐■_■)\n" +
            ":shades3: = ■-■¬<(•_• )\n" +
            ":ok: = ( •_•)\n" +
            ":no: = ಠ_ಠ\n" +
            ":yes: = ಠ⌣ಠ\n" +
            ":strong: = ᕙ(⇀‸↼‶)ᕗ\n" +
            ":shrug: = ¯\\_(ツ)_/¯\n" +
            ":flip: = (╯•□•）╯︵ ┻━┻\n" +
            ":place: = ┬──┬ ノ( •-•ノ)\n" +
            ":bear: = ʕ•ᴥ•ʔ\n" +
            ":smile: = ◕‿◕", {padding: 1}))
            readLine.prompt(true)
        }
        else if((message.match(/^(\\b)/g)))
        {
            BotIt.enable(ip, port)
        }
        //Default normal message to the server
        else
        {
            let messageToSend = {
                from: username,
                to: "all",
                kind: "chat",
                data: functions.emoteCheck(message)
            }
            webSocket.send(JSON.stringify(messageToSend))
        } 
    })

    //Things that the Client should do when it recieves a message from the server
    webSocket.onmessage = msg => {
        let backMessage = JSON.parse(msg.data);
        //If its a direct message the Client has special formatting for how it displays the message
        if(backMessage.kind === "direct")
        {
            if(typeof backMessage.data === "string")
            {
                readline.cursorTo(process.stdout, 0)
                console.log(`(Whisper From ${backMessage.from}): ${functions.styleString(functions.emoteCheck(backMessage.data))}`)
                readLine.prompt(true)
            }
            else
            {
                readline.cursorTo(process.stdout, 0)
                console.log(`(Whisper From ${backMessage.from}): ${backMessage.data}`)
            }
        }
        //If the message if from the GABServer it is either an error or a server wide message
        //the message is highlighted in red or blue respectively
        else if(backMessage.from === "GABServer")
        {
            if(backMessage.kind === "error")
            {
                readline.cursorTo(process.stdout, 0)
                console.log(chalk.bgRed(`ERROR: ${backMessage.data}`))
                readLine.prompt(true)
            }
            else
            {
                readline.cursorTo(process.stdout, 0)
                if(wcwidth(backMessage.data) < process.stdout.columns)
                console.log(chalk.bgBlue(backMessage.data.padEnd(process.stdout.columns - wcwidth(backMessage.data))))
                else
                console.log(chalk.bgBlue(backMessage.data))
                readLine.prompt(true)
            }
        }
        //Else the message is a normal message and should be printed to the console with some conditions
        else
        {
            //If the message is not of type string the message should just be printed to the console without
            //using the string formatting functions, as using these functions on non-strings will crash the Client
            //Stops junk being sent from the server from crashing the client
            if(typeof backMessage.data !== "string")
            {
                readline.cursorTo(process.stdout, 0)
                console.log(backMessage.data)
                readLine.prompt(true) 
            }
            //Else formats the string using emoteCheck and styleString functions that make use of the JSONs
            else
            {
                messageString = "[" + backMessage.from + ']: ' + functions.styleString(functions.emoteCheck(backMessage.data))
                readline.cursorTo(process.stdout,0)
                if(wcwidth(messageString) < process.stdout.columns)
                console.log(messageString.padEnd(process.stdout.columns - wcwidth(messageString)))
                else
                console.log(messageString)
                readLine.prompt(true)
            }
        }
    }
}

