"use strict"
const request = require("request-promise-native");
const parse_community = require("./parse_community");

module.exports = (context, callback) => {
    request("https://raw.githubusercontent.com/openfaas/faas/master/community.md")
    .then(async response => {
        try {
            const events = await parse_community(response);
            // console.log(JSON.stringify(events, null, 2))
            callback(undefined, events);
        }
        catch(e) {
            callback(e, undefined);
        }
    })
}
