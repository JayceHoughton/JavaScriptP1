const fs = require('fs')
const chalk = require('chalk')

const styles = JSON.parse(fs.readFileSync('style.json', 'utf8'))
const emotes = JSON.parse(fs.readFileSync('Emotes.json', 'utf8'))

//Link to CHALK for reference for avaiable expressions https://github.com/chalk/chalk

module.exports = {
    //Function that takes JSON file and changes a feature of a matched regex
    styleString(stringToStyle){
        for(i = 0; i < styles.length; i++)
        {
            currReg = new RegExp(styles[i].expression, 'gi')
            property = styles[i].style
            stringToStyle = stringToStyle.replace(currReg, chalk[property](currReg.exec(stringToStyle)))
        }
        return stringToStyle
    },

    emoteCheck(emoteOut){
        for(i = 0; i < emotes.length; i++)
        {
            currReg = new RegExp(emotes[i].text, 'gi')
            emoteOut = emoteOut.replace(currReg, emotes[i].emote)
        }
        return emoteOut
    }

}