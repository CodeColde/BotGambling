const Storage = require('node-storage');
let pool = new Storage('pool.json');

module.exports.poolPut = (id, name, amount) => {
    pool.put(id, {name, amount});
}

module.exports.poolGet = (value) => (
    pool.get(value)
)

module.exports.poolSet = (id, username) => {
    pool.put(id, {name: username, amount: 300});
}

module.exports.leaderboard = () => {
    let array = [];

    // put data in array
    Object.keys(pool.store).forEach((key) => {
        let obj = {};
        obj[key] = pool.store[key]
        array.push(obj);
    });  

    // Sort leaderboard by the object's subobject's amount value, highest placed earlier
    array.sort((a, b) => {
        let i, j;
        for(let key in a){ i = a[key].amount; }
        for(let key in b){ j = b[key].amount; }
        return j-i; 
    });

    return array;
}