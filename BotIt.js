const WebSocket = require('ws');
const Express = require('express');
const http = require('http');
const url = require('url');

const readlineSync = require('readline-sync')
const readline = require('readline')
const chalk = require('chalk')
const boxen = require('boxen')
const fs = require('fs')
const figlet = require('figlet')
const terminalkit = require('terminal-kit');
const wcwidth = require('wcwidth')

const functions = require('./functions')

class account {
    constructor(accountName)
    {
        this.accountName = accountName
        this.botBucks = 0
    }

    getAccountName() {
        return this.accountName
    }

    addBucks(bucks) {
        this.botBucks += bucks
    }

    removeBucks(bucks) {
        if(this.botBucks - bucks < 0)
        {
            this.botBucks = 0
        }
        else
        {
            this.botBucks -= bucks
        }
    }

    getBucks() {
        return this.botBucks
    }
}

module.exports = {
    
    enable(ip, port) {
        serverAddress = "ws://" + ip + ":" + port + "/?username=" + "BotIt"
        webSocketBot = new WebSocket(serverAddress)

        openingMessage = "Hello my name is BotIt! Type !BIcommands for a command list!"

        webSocketBot.onopen = () => {


            Bank = []

            let messageToSend = {
                from: "BotIt",
                to: "all",
                kind: "chat",
                data: openingMessage
            }
            webSocketBot.send(JSON.stringify(messageToSend))
        }

        webSocketBot.onmessage = msg => {
            let backMessage = JSON.parse(msg.data)
            if(typeof backMessage.data === "string")
            {
                if(backMessage.data.match(/^!BIcommands$/g))
                {
                    commandString = "Commands are: \n" +
                    "!BIlist: Get a list of the users on the server.\n" +
                    "!BIwhoami: Find out who you are.\n" +
                    "!BIroll: Roll a dice.\n" +
                    "!BIFlip: Flip a coin.\n" +
                    "!BIjoinbank: join the Bot bank to start getting BotBucks!\n"
                    "!BIgetcash: add 10 BotBucks to your account.\n" +
                    "!BImycash: check how many BotBucks you have.\n" +
                    "!BIlottery: lottery your money!"
                    let messageToSend = {
                        from: "BotIt",
                        to: "all",
                        kind: "chat",
                        data: commandString
                    }
                    webSocketBot.send(JSON.stringify(messageToSend))
                }
                if(backMessage.data.match(/^!BIlist$/g))
                {
                    let messageToSend = {
                        from: "BotIt",
                        to: "irrelevant",
                        kind: "userlist",
                        data: "irrelevant"
                    }
                    webSocketBot.send(JSON.stringify(messageToSend))
                }
                if(backMessage.data.match(/^!BIwhoami$/g))
                {
                    let messageToSend = {
                        from: "BotIt",
                        to: "all",
                        kind: "chat",
                        data: "You Are: " + backMessage.from
                    }
                    webSocketBot.send(JSON.stringify(messageToSend))
                }
                if(backMessage.data.match(/^!BIroll$/g))
                {
                    diceRoll = Math.floor(Math.random() * 7)
                    let messageToSend = {
                        from: "BotIt",
                        to: "all",
                        kind: "chat",
                        data: "You rolled a: " + diceRoll + "!"
                    }
                    webSocketBot.send(JSON.stringify(messageToSend))
                }
                if(backMessage.data.match(/^!BIflip$/g))
                {
                    coinFlip = Math.floor(Math.random() * 2)
                    flipMessage = "HEADS!"
                    if(coinFlip === 1)
                    {
                        flipMessage = "TAILS!"
                    }
                    let messageToSend = {
                        from: "BotIt",
                        to: "all",
                        kind: "chat",
                        data: flipMessage
                    }
                    webSocketBot.send(JSON.stringify(messageToSend))
                }
                if(backMessage.data.match(/^!BIjoinbank$/g))
                {
                    if(Bank.filter(find => find.getAccountName() === backMessage.from).length > 0)
                    {
                        let messageToSend = {
                            from: "BotIt",
                            to: "all",
                            kind: "chat",
                            data: backMessage.from + " is already a member of the Bank!"
                        } 
                        webSocketBot.send(JSON.stringify(messageToSend))
                    }
                    else
                    {
                        Bank.push(new account(backMessage.from))
                        let messageToSend = {
                            from: "BotIt",
                            to: "all",
                            kind: "chat",
                            data: backMessage.from + " has joined the bank!"
                        }
                        webSocketBot.send(JSON.stringify(messageToSend))
                    }
                }
                if(backMessage.data.match(/^!BIgetcash$/g))
                {
                    if(Bank.filter(find => find.getAccountName() === backMessage.from).length > 0)
                    {
                        index = Bank.findIndex(find => find.getAccountName())
                        Bank[index].addBucks(10)
                        let messageToSend = {
                            from: "BotIt",
                            to: "all",
                            kind: "chat",
                            data: "Added 10 BotBucks to " + backMessage.from + "'s account!"
                        } 
                        webSocketBot.send(JSON.stringify(messageToSend))
                    }
                    else
                    {
                        let messageToSend = {
                            from: "BotIt",
                            to: "all",
                            kind: "chat",
                            data: backMessage.from + " is not a member of the bank!"
                        }
                        webSocketBot.send(JSON.stringify(messageToSend))
                    }
                }
                if(backMessage.data.match(/^!BImycash$/g))
                {
                    if(Bank.filter(find => find.getAccountName() === backMessage.from).length > 0)
                    {
                        index = Bank.findIndex(find => find.getAccountName())
                        buckAmmount = Bank[index].getBucks()
                        let messageToSend = {
                            from: "BotIt",
                            to: "all",
                            kind: "chat",
                            data: backMessage.from + " has " + buckAmmount + " BotBucks!"
                        } 
                        webSocketBot.send(JSON.stringify(messageToSend))
                    }
                    else
                    {
                        let messageToSend = {
                            from: "BotIt",
                            to: "all",
                            kind: "chat",
                            data: backMessage.from + " is not a member of the bank!"
                        }
                        webSocketBot.send(JSON.stringify(messageToSend))
                    }
                }
                if(backMessage.data.match(/^!BIlottery$/g))
                {
                    if(Bank.filter(find => find.getAccountName() === backMessage.from).length > 0)
                    {
                        index = Bank.findIndex(find => find.getAccountName())
                        lottoNumber = diceRoll = Math.floor(Math.random() * 1000)
                        if(lottoNumber >= 500)
                        {
                            percentIncrease = lottoNumber/1000
                            moneyIncrease = percentIncrease * 100000
                            Bank[index].addBucks(moneyIncrease)
                            let messageToSend = {
                                from: "BotIt",
                                to: "all",
                                kind: "chat",
                                data: backMessage.from + " has won " + moneyIncrease + " BotBucks and now has " + Bank[index].getBucks() + " BotBucks! WOW!"
                            } 
                            webSocketBot.send(JSON.stringify(messageToSend))
                        }
                        else
                        {
                            percentDecrease = lottoNumber/500
                            moneyDecrease = percentDecrease * 100000
                            Bank[index].removeBucks(moneyDecrease)
                            let messageToSend = {
                                from: "BotIt",
                                to: "all",
                                kind: "chat",
                                data: backMessage.from + " has lost " + moneyDecrease + " BotBucks and now has " + Bank[index].getBucks() + " BotBucks! YIKES!"
                            } 
                            webSocketBot.send(JSON.stringify(messageToSend))
                        }
                    }
                    else
                    {
                        let messageToSend = {
                            from: "BotIt",
                            to: "all",
                            kind: "chat",
                            data: backMessage.from + " is not a member of the bank!"
                        }
                        webSocketBot.send(JSON.stringify(messageToSend))
                    }
                }
                if(backMessage.kind === "userlist")
                {
                    let messageToSend = {
                        from: "BotIt",
                        to: "all",
                        kind: "chat",
                        data: "Connected Users are: " + backMessage.data
                    }
                    webSocketBot.send(JSON.stringify(messageToSend))
                }
            }
        }
    }
}