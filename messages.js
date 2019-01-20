module.exports = {
    current: (amount, author) => (
        `${author} currently has ${amount} drops in their bloodpool.`
    ),

    allWin: (author, current) => (
        `${author} gambled all their drops and won! They doubled their drops and now have ${current*1.5} drops in their pool!`
    ),
    allLose: (author) => (
        `${author} gambled all their drops and lost. The disappointing vampie now has nothing left. Puny.`
    ),

    leaderboard: (leaderboard, user) => {
        let title = `Top 20 Gamblers: \n`,
            inTop = false,
            position, 
            description = '';
        for(let i = 0; i < leaderboard.length; i++){
            for(let key in leaderboard[i]){
                if(key === user.id){
                    position = i+1;
                    if(i <= 20){
                        inTop = true;
                        description += `${i+1}. ${user} : ${leaderboard[i][key].amount}\n`
                    }
                } else {
                    if(i <= 20){
                        description += `${i+1}. ${leaderboard[i][key].name} : ${leaderboard[i][key].amount}\n`
                    }
                }

            }
        }
        if(!inTop){
            for(let key in leaderboard[position-1]){
                description += `\n${position}. ${user} : ${leaderboard[position-1][key].amount}\n`
            }
        }

        return {
            title,
            description
        };
    },

    sendingHelp: (user) => (
        `I've sent you a DM, ${user}.`
    ),
    help: (prefix) => ({
        title: "You called for some assistance?",
        description: 'Below is a list of things to interact with.',
        fields: [
            {
                name: 'Gambling',
                value: `${prefix} <percentage> (gambles a percentage of your current pool, rounding up to the nearest whole)
                ${prefix} <integer> (gambles a fixed number, rounding up to the nearest whole)
                ${prefix} all (gambles entire pool)`
        
            },
            {
                name: 'Stats',
                value: `${prefix} current (view current pool)
                ${prefix} leaderboard/leaderboards (view leaderboards)`
            },
            {
                name: 'Additional Commands',
                value: `${prefix} help (view this command list)
                ${prefix} reset / ${prefix} start (resets user's current pool back to default amount)`
            }
        ]
    }),

    percentage: (subCommand) => (
        `${subCommand} was the percentage and was permitted`
    ),

    gambleSuccess: (author, amount, total) => (
        `${author} gambles ${amount} drops and won! ${author} now has ${total} drops in their pool! Delicious...`
    ),
    gambleFail: (author, amount, total) => (
        `${author} gambles ${amount} drops, but lost. ${author} now has just ${total} drops left. Pathetic...`
    ),

    fail: () => (
        `Sorry... that command doesn't exist. See '!gamble help' for a full list of commands!`
    ),

    reset: (author) => (
        `${author} has emptied their pool, and begged to start over. As I'm a merciful devil, this vamp now has 300 drops in their pool. No more weakness.`
    ),
    start: (author, prefix) => ({
        title: `Welcome, ${author}.`,
        description:  `You're about to begin your vampire experience.
        Compete against your fellow vamps and collect the most amount of blood droplets in your pool.
        To get started, type in ${prefix} help. I've granted you 300 drops to start off with.
        Best of luck, newbie.`
    }),
    alreadyBegan: (prefix) => (
        `Hey, you already started! To start over, use the ${prefix} reset command!`
    ),

    outOfBlood: (author) => (
        `${author} gambled and lost... and now ${author} is out of blood. Better that way, no one likes the weak. Bet you want to start over now, huh... Pathetic.`
    ),

    insufficient: () => (
        `Whoops, looks like you're out of drops! Use the command !gamble reset to fill up your pool!`
    ),

    changeColor: (color) => ({
        title: 'Success!',
        description: `You've set the default message color to ${color}.`
    }),
    invalidColor: () => (
        `That color format is invalid. Please use 0x<hexcode> to set the color.`
    ),

    prefixSuccess: (prefix) => (
        `You've set the default prefix to ${prefix}.`
    ),
    prefixFail: () => (
        `That prefix format is invalid. Please try to adhere to !<prefix>.`
    ),

    botnameSuccess: (bottitle) => (
        `You've changed my name to ${bottitle}.`
    ),
    botnameFail: (error) => ({
        title: `You can't do that!`,
        description: error
    })
}