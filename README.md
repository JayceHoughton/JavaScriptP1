# Project Title

GAB (Gift of Asynchronous Babble) Server

## Getting Started

Everything that is needed to run the server (aside from the dependencies)

## Installing and Use

`npm install`
`node .`

To use specific host/port number 
`node . \[port\] \[host\]`

Example of a server running on port 4931 and address 10.226.9.220
`node . 4931 10.226.9.220`

## Built With

* [ws](https://github.com/websockets/ws) - Simple to use, blazing fast and thoroughly tested WebSocket client and server for Node.js
* [Express](https://github.com/expressjs/express) - Fast, unopinionated, minimalist web framework for node.

## Versioning

The version of this server provided is purely for test purposes. The instructor reserves the right to make small updates to this server for bugfixes. 

## The Client

Welcome to Jayce Houghton's Console Websocket Client.
This client uses a Websocket server built by William Orphello Ph.D

Steps to connect:
1. Launch the client by running node Client.js
2. There will be a prompt asking for a user name. Enter a name of length less that 10 characters that are alphanumeric. Press Enter
3. Next you will be asked to enter the server IP. This can also be the websocket address. Everything but the port number. Press Enter
4. Finally you can enter the port number. Press Enter
5. You should now be connected to the server. A box with avaiable commands will be displayed.
6. To send messages just type your message and press enter.

## Modifying the style.json file

To change different text colors you can modify the words and colors/styles of the style.json file.
Please reference this link for avaiable styles: https://github.com/chalk/chalk


## Bot It

The primary additional feature of this client is a Bot called bot it.
To make BotIt join the server you simply have to type the command \b, then Bot it will join.
To see the commands that BotIt can do simply type !BIcommands and it will list all other avaiable commands.
These commands are avaiable to everyone in the server, not just you, and BotIt will send all messages to the entire server.
If there is a BotIt already on the server, then a second one cannot join.

To leave the server simply type \l and you and the bot will leave.

## Known Issues

1. If someone is for some reason sending non-string data to the server, the client will simply output that data
instead of doing any kind of string formatting. As a result certain messages might look different depending on if
someone on the server is doing this.

2. Due to the way that keepin the cursor at the bottom works, sending messages larger then the size of your client will
sometimes display part of the sent message above the server message.

3. Padding is slightly janky. The padding attempts to make each message fill and entire line so that messages won't display
over other messages. This works the majority of the time, but certain length messages will sometimes break the padding.

4. Resizing the terminal will cause messages above your current position to look odd due to the padding. All messages recieved
and sent after this will not have any due to the scaling I do with the padding and such in the program. But I could not make the 
messages above adapt to the terminal size changing in the current iteration of the client.
