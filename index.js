#!/usr/bin/env node

const newID = process.argv[2];
var _ = require('lodash');
var fs = require('fs');

if (newID && newID.split('.').length < 2) {
    console.log("Please type a valid bundle id e.g. com.solidstategroup.myapp");
    return;
}

let ios;

require('./src/ios')(newID)
    .then((res) => {
        ios = res;
        console.log("")
        return require('./src/android')(newID)
    })
    .then(function (android) {
        console.log("")

        _.each(ios, (data, location) => {
            console.log("IOS Writing:", location);
            fs.writeFileSync(location, data);
        });
        console.log("");


        _.each(android, (data, location) => {
            console.log("Andrid Writing:", location);
            fs.writeFileSync(location, data);
        });

        console.log("");
    });