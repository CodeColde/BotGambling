const Storage = require('node-storage');
let info = new Storage('info.json');

const infoPut = (key, value) => {
    info.put(key, value);
}

const infoSetDate = () => {
    info.put('timestamp', new Date());
}

const gets = {
    timestamp: info.get('timestamp'),
    owner: info.get('owner'),
    botName: info.get('botName'),
    color: parseInt(info.get('color')),
    prefix: info.get('prefix')
}

module.exports = {
    infoPut,
    infoSetDate,
    ...gets
}