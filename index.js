// Set Variables
require('dotenv').config();
// require('./maintain.js');
const messages = require('./messages.js'),
    discord = require('discord.js'),
    functions = require('./functions.js'),
    poolHandlers = require('./pool.handlers'),
    infoHandlers = require('./info.handlers'),
    client = new discord.Client(),
    token = process.env.DISCORD_BOT_SECRET;


// Info Variables
const { infoPut, infoSetDate, timestamp, owner, botName, color, prefix } = infoHandlers;

// On start up
client.on('ready', () => {
  // Initialize timestamp
  if (timestamp) console.log(`last login: ${timestamp}`);
  // Set Date to current
  infoSetDate();
  // If no owner exists, set it to the client user id
  if(!owner) infoPut('owner', client.user.id);
  // if there is no botname, set one
  if(!botName){
    infoPut('botName', client.user.username);
    client.user.setUsername(botName);
  }
  // Initialize message
  console.log(`Welcome, ${client.user.username}`);
});

// On message Received
client.on('message', msg => {
  // If message is not the bot
  if(msg.author.bot) return;
  // Check if message matches prefix in the beginning
  const args = msg.content.slice('!').trim().split(/ +/g);
  const [ mainCommand, subCommand, setting ] = args;
  if(mainCommand.indexOf(prefix) !== 0) return;

  const { validatePrefix, validateColor, getWinCondition } = functions;
  const { poolSet, poolPut, poolGet, leaderboard } = poolHandlers;
  const poolSetting = poolGet(msg.author.id),
        poolAmount = poolSetting ? poolSetting.amount : 300,
        name = msg.author.username;

  // Case List
  switch (true){
    // Insufficient
    case !poolAmount && subCommand !== "reset":
      msg.channel.send(messages.insufficient());
      break;

    // All In
    case subCommand === "all":
      if(getWinCondition){
        poolPut(msg.author.id, name, poolAmount*2);
        msg.channel.send(messages.allWin(name, poolAmount));
      } else {
        poolPut(msg.author.id, name, 0);
        msg.channel.send(messages.allLose(name));
      }
      break;
    
    // Percentage
    case /^(([1-9]|[1-8][0-9]|9[0-9]|100)(,|\.\d{1,3})?)%/s.test(subCommand):
      const drops = Math.round((poolAmount*subCommand.split('%')[0])/100);
      switch(getWinCondition){
        case 1: {
          const total = poolAmount+parseInt(drops);
          poolPut(msg.author.id, name, total);
          msg.channel.send(messages.gambleSuccess(name, subCommand, total));
          break;
        }
        default: {
          const total = poolAmount - drops;
          if(total > 0) {
            poolPut(msg.author.id, name, total);
            msg.channel.send(messages.gambleFail(name, subCommand, total));
          } else {
            poolPut(msg.author.id, name, 0 );
            msg.channel.send(messages.out(name));
          }
        }
      }
      break;
    
    // Integer
    case (/\d+/s.test(subCommand) && subCommand.indexOf(0) !== 0):
      switch(getWinCondition){
        case 1: {
          const drops = poolAmount+parseInt(subCommand);
          poolPut(msg.author.id, name, drops);
          msg.channel.send(messages.gambleSuccess(name, subCommand, drops));
          break;
        }
        default: {
          const drops = poolAmount-subCommand;
          if(drops > 0) {
            poolPut(msg.author.id, name, drops);
            msg.channel.send(messages.gambleFail(name, subCommand, drops));
          } else {
            poolPut(msg.author.id, name, 0);
            msg.channel.send(messages.out(name));
          }
        }
      }
      break;

    // Leaderboard
    case subCommand === "leaderboard" || subCommand === "leaderboards":
      msg.channel.send({embed: {
        color,
        ...messages.leaderboard(leaderboard, msg.author)
      }});
      break;
    
    // Current
    case subCommand === "current":
      msg.channel.send(messages.current(poolAmount, name));
      break;

    // Help
    case subCommand === "help":
      msg.channel.send(messages.sendingHelp(msg.author));
      msg.author.send({embed: {
        color,
        ...messages.help(prefix)
      }});
      break;

    // Reset
    case subCommand === "reset":
      poolSet(msg.author.id, name);
      msg.channel.send(messages.reset(name));
      break;
    
    // Start
    case subCommand === "start":
      if(poolSetting){
        msg.channel.send(messages.alreadyBegan(prefix));
        break;
      }
      poolSet(msg.author.id, name);
      msg.channel.send({embed: {
        color,
        ...messages.start(name, prefix)
      }});
      break;
    
    // Change color
    case subCommand === "setColor":
      if(validateColor(setting) === 1){
        infoPut('color', setting);
        msg.author.send({embed: {
          color: parseInt(setting),
          ...messages.changeColor(setting)
        }});
        break;
      }
      msg.author.send(messages.invalidColor());
      break;
    
    // Change prefix
    case subCommand === "setPrefix":
      if(validatePrefix(setting) === 1){
        infoPut('prefix', setting);
        msg.author.send(messages.prefixSuccess(setting));
        break;
      }
      msg.author.send(messages.prefixFail());
      break;
    
    case subCommand === "LoveForMel":
      if(msg.author.id === '134037941893857280'){
        msg.channel.send(`${name} gambles 'the amount he loves mel' and won! ${name} now has 1000000000000000000000000000000000000000000000000000000000000000 drops in their pool! Delicious...`);
      }
      break;

    // Change Bot Name
    case subCommand === "setBotname":
      let bottitle = msg.content.split(prefix+' '+subCommand+' ')[1];
      if(bottitle !== botName){            
        let promise = client.user.setUsername(bottitle);
        
        promise.then(() => {
          infoPut('botName', bottitle);
          msg.author.send(messages.botnameSuccess(bottitle));
        });

        promise.catch(error => {
          let botNameError = messages.botnameFail(error.message);
          msg.author.send({embed: {
            color,
            title: botNameError.title,
            description: botNameError.description
          }});
        });
      }
      break;

    // Error or Fail
    default:
      msg.channel.send(messages.fail());
      break;
  }
});

client.login(token);