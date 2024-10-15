require('dotenv').config({ path: require('find-config')('transfer.env') });
const mysql = require("mysql");
const process = require("process");
var brk = 0;
const dayjs = require('dayjs');
const target = mysql.createPool({
    multipleStatements: true,
    host: process.env.TARGET_MYSQL_HOST,
    user: process.env.TARGET_MYSQL_USER,
    password: process.env.TARGET_MYSQL_ROOT_PASSWORD,
    database: process.env.TARGET_MYSQL_DATABASE,
    port: process.env.TARGET_MYSQL_PORT
});
const parent = mysql.createPool({
    multipleStatements: true,
    host: process.env.PARENT_MYSQL_HOST,
    user: process.env.PARENT_MYSQL_USER,
    password: process.env.PARENT_MYSQL_ROOT_PASSWORD,
    database: process.env.PARENT_MYSQL_DATABASE,
    port: process.env.PARENT_MYSQL_PORT
});
parent.getConnection(async function (err, copy) {
    if (err) {
        console.log("Error Connecting to parent DB");
    } else {
        console.log("Connected to Parent DB");
        copy.query(
            `select * from Faucet`,
            async function (err, result) {
                if (err) {
                    console.log("Error Querying to parent DB");
                } else {
                    console.log("Retrieved Parent DB Data");
                    target.getConnection(async function (err, paste) {
                        if (err) {
                            console.log("Error Connecting to target DB");
                        } else {
                            for (i = 0; i < result.length; i++) {
                                const loc = i;
                                const time = dayjs(result[loc].last_used);
                                var convert = time.format("YYYY-MM-DD");
                                if (convert == 'Invalid Date'){
                                    convert = null;
                                } else {
                                    convert = `'${convert}'`;
                                }
                                if (result[loc].wallet_name != null){
                                    result[loc].wallet_name = `'${result[loc].wallet_name}'`
                                }
                                console.log(`${result[loc].userid}, ${result[loc].wallet_name}, ${convert}, ${result[loc].claims}, ${result[loc].streak}, ${result[loc].mdu_bal}`);
                                paste.query(
                                    `insert into Faucet (userid, wallet_name, last_used, claims, streak, mdu_bal) values (${BigInt(result[loc].userid)}, ${result[loc].wallet_name}, ${convert}, ${result[loc].claims}, ${result[loc].streak}, ${result[loc].mdu_bal}) on duplicate key update userid = ${result[loc].userid};`,
                                    async function (err) {
                                        if (err){
                                            console.log("Error Querying to target DB");
                                            console.log(err);
                                        } else {
                                            console.log(`Copying ${Math.round((loc/result.length)*100)}%`);
                                        }
                                    });
                            }
                            paste.release();
                        }
                    });
                }
            });
        copy.release();
    }
});