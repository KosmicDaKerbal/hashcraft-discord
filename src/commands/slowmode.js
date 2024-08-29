const process = require("process");
module.exports = {
set: async function (embed){
    if (embed.options.get("duration").value > 0){
        embed.channel.setRateLimitPerUser(embed.options.get("duration").value);
        embed.reply ("Set slowmode to " + embed.options.get("duration").value + " seconds.");
    } else {
        embed.reply ("Value must be greater than 0");
    }
}
}