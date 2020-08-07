require('dotenv').config();

const hash = require('../build/src/helper/hashing');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question(`Input desired password to hash:`, (password) => {
    const hashedPwd = hash.hashPassword(`${password}`);

    console.log(hashedPwd);

    readline.close();
});
