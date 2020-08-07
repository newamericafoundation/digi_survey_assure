require('dotenv').config();

const hash = require('../build/src/helper/hashing');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question(`Input desired password to hash:`, (password) => {
    const hashedPwd = hash.sha256Hex(`${process.env.APP_SECRET}${password}`);

    console.log(hashedPwd);

    readline.close();
});
