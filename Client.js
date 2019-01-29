//Main file for Client

const WebSocket = require('ws');
const Express = require('express');
const http = require('http');
const url = require('url');

const readlineSync = require('readline-sync')
const readline = require('readline')

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
    console.log("Connected.\n")
    readLine.resume
    readLine.on('line', (message) => {
        if(message.match(/^(\\w\s)/g))
        {
            let whisperName = message.match(/(?<=\\w\s)(\w+)/g)
            let messageToSend = {
                from: username,
                to: whisperName[0],
                kind: "direct",
                data: message.substr(message.indexOf(whisperName), message.length)
            }
            webSocket.send(JSON.stringify(messageToSend))
        }
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
        messageString = backMessage.from + ': ' + backMessage.data
        console.log(messageString)
    }
}