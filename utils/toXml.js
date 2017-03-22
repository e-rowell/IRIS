const converter = require('jstoxml');

module.exports = {

    toXml: function (data, root, child) {
        'use strict';

        let json = {};
        if (!root) root = 'root';
        if (!child) child = 'child';
        json[root] = [];
        if (data.length) {
            let tempObj = {};

            for (let i = 0; i < data.length; i++) {
                tempObj[child] = data[i];
                json[root].push(tempObj);
            }
        } else {
            json[root][child] = data;
        }
        return converter.toXML(json);
    }

};