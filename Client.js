//Main file for Client

const WebSocket = require('ws');
const Express = require('express');
const http = require('http');
const url = require('url');

const readlineSync = require('readline-sync')
const readline = require('readline')
const chalk = require('chalk')
const boxen = require('boxen')
const fs = require('fs')

const styles = JSON.parse(fs.readFileSync('style.json', 'utf8'))

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

webSocket = new WebSocket(serverAddress)

//Sets up readline interface for use later
const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

//Pauses readline until we want to use it
readLine.pause

webSocket.onopen = () => {
    //Server connections message boxed in
    console.log(boxen(`Welcome to the Server ${username}!\nAvailable Commands:\n(\\w + username): Whisper user with username.\n(\\i): Ask the server what your username is.\n(\\u): Get a list of server users.\n(\\l): Leave the server.`, {padding: 0}))
    readLine.resume
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
                data: message.substr(message.indexOf(whisperName), message.length)
            }
            console.log(`(Whispering ${whisperName[0]}): ${message.substr(message.indexOf(whisperName), message.length)}`)
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
            process.exit(1)
        }
        //Default normal message to the server
        else
        {
            let messageToSend = {
                from: username,
                to: "all",
                kind: "chat",
                data: message
            }
            webSocket.send(JSON.stringify(messageToSend))
        } 
    })

    webSocket.onmessage = msg => {
        let backMessage = JSON.parse(msg.data)
        if(backMessage.kind === "direct")
        {
            console.log(`(Whisper From ${backMessage.from}): ${backMessage.data}`)
        }
        else if(backMessage.from === "GABServer")
        {
            if(backMessage.kind === "error")
            {
                console.log(chalk.bgRed(`ERROR: ${backMessage.data}`))
            }
            else
            {
                console.log(chalk.bgBlue(backMessage.data))
            }
        }
        else
        {
            messageString = backMessage.from + ': ' + backMessage.data
            console.log(messageString)
        }
    }
}