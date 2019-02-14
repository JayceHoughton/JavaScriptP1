/*This is BotIt. It is a bot that takes commands that start with ! from all users on the server
You can pretty much add any command to this bot using the format in the if statments.
It currently has an account system that you can join and make BotBucks. Nothing to currently spend them on,
just a leaderboard.*/

const WebSocket = require('ws');

//Account class that keeps track of accountname and bot bucks per account.
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

//Modues to export to the Client
module.exports = {
    
    //Only real function, enable. Everything happens inside this function since it relys on Websocket triggers
    enable(ip, port) {
        serverAddress = "ws://" + ip + ":" + port + "/?username=" + "BotIt"
        webSocketBot = new WebSocket(serverAddress)

        openingMessage = "Hello my name is BotIt! Type !BIcommands for a command list!"

        webSocketBot.onopen = () => {

            //Bank array to keep track of accounts
            Bank = []

            //Opening message when the Bot connects to the server
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
                    //List of bot commands to be listed when called
                    commandString = "Commands are: \n" +
                    "!BIlist: Get a list of the users on the server.\n" +
                    "!BIwhoami: Find out who you are.\n" +
                    "!BIroll: Roll a dice.\n" +
                    "!BIflip: Flip a coin.\n" +
                    "!BIjoinbank: join the Bot bank to start getting BotBucks!\n!BIgetcash: add 10 BotBucks to your\n" + 
                    "!BImycash: check how many BotBucks you have.\n" +
                    "!BImycash: check how many BotBucks you have.\n" +
                    "!BIlottery: lottery your money!\n" +
                    "!BIleaderboard: see who has the most cash!"
                    let messageToSend = {
                        from: "BotIt",
                        to: "all",
                        kind: "chat",
                        data: commandString
                    }
                    webSocketBot.send(JSON.stringify(messageToSend))
                }
                //BIlist to list connected users
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
                //BIwhoami is a simple whoami function
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
                //Rolls a dice from 1 to 6
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
                //Flips a heads or tails coin
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
                //Adds a new user to the Bank array. Checks if they are in the Bank
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
                //Adds 10 BotBucks to the user's account
                if(backMessage.data.match(/^!BIgetcash$/g))
                {
                    if(Bank.filter(find => find.getAccountName() === backMessage.from).length > 0)
                    {
                        index = Bank.findIndex(find => find.getAccountName() === backMessage.from)
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
                //Tells the user how much cash their account has
                if(backMessage.data.match(/^!BImycash$/g))
                {
                    if(Bank.filter(find => find.getAccountName() === backMessage.from).length > 0)
                    {
                        index = Bank.findIndex(find => find.getAccountName() === backMessage.from)
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
                //Enters user into an RNG lottery where they can gain or lose alot of BotBucks
                if(backMessage.data.match(/^!BIlottery$/g))
                {
                    if(Bank.filter(find => find.getAccountName() === backMessage.from).length > 0)
                    {
                        index = Bank.findIndex(find => find.getAccountName() === backMessage.from)
                        lottoNumber = diceRoll = Math.floor(Math.random() * 1000)
                        if(lottoNumber >= 500)
                        {
                            percentIncrease = lottoNumber/1000
                            moneyIncrease = percentIncrease * 1000
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
                            moneyDecrease = percentDecrease * 1000
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
                //Sorts and shows a leaderboard of those who have the most money
                if(backMessage.data.match(/^!BIleaderboard$/g))
                {
                    Bank.sort((first, second) => second.getBucks() - first.getBucks())
                    Leaderboard = ''
                    for(i = 0; i < Bank.length; i++)
                    {
                        j = i + 1
                        Leaderboard += j + ": " + Bank[i].getAccountName() + " has " + Bank[i].getBucks() + " "
                    }
                    let messageToSend = {
                        from: "BotIt",
                        to: "all",
                        kind: "chat",
                        data: Leaderboard
                    } 
                    webSocketBot.send(JSON.stringify(messageToSend))
                }
                //If the bot gets a userlist message from the server that means someone requested a userlist
                //so the bot sends out the userlist.
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