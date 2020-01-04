const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    comparerank: function(toBeCompared, standard) {
        var rankToBeCompared = toBeCompared.highestRole.calculatedPosition;
        var rankStandard = standard.highestRole.calculatedPosition;
        return rankToBeCompared > rankStandard ? true : false;
    },
    log: function(server, title, description) {
    }
}