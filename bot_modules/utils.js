const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    compareRank: function(toBeCompared, standard) {
        var rankToBeCompared = toBeCompared.highestRole.calculatedPosition;
        var rankStandard = standard.highestRole.calculatedPosition;
        return rankToBeCompared > rankStandard ? true : false;
    },
    log: function(server, title, description) {
    },
    updateFile: function(location, data) {
        if (data) {
            fs.writeFile(location, JSON.stringify(data, null, 4), (err) => {
                if (err) throw err;
                result = data;
            });
        } else {
            fs.readFile(location, (err, newData) => {
                if (err) throw err;
                result = JSON.parse(newData);
            });
        }
    }
}