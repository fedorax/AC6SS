'use strict';
const fs = require('fs');
const path = require('path');

const model = [];
module.exports = (db) => {
    fs.readdirSync(path.resolve('server/app/model'), {encoding: 'utf8'}).filter((filename) => {
        return filename.endsWith('.model.js');
    }).forEach((filename) => {
        model.push(db.import (path.resolve('server/app/model/' + filename)));
    });
    return model;
};