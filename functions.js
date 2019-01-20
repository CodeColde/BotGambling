module.exports.getWinCondition = () => {
    return Math.floor(Math.random() * 11) + 1 < 5 ? 1 : 0;
}

module.exports.validateColor = (code) => {
    let hex = code.indexOf('x') === 1 ? code.split('x')[1] : false;
    if(hex === false || hex.length !== 6){
        return 0;
    }
    if(code.length > 8 || code.indexOf(0) !== 0){
        return 0;
    }
    if(!(/^(?:[0-9a-fA-F]{3}){1,2}$/.test(hex)) && hex !== '000000'){
        return 0;
    }
    return 1;
}

module.exports.validatePrefix = (prefix) => {
    if(prefix.indexOf('!') !== 0){
        return 0;
    }
    return 1;
}