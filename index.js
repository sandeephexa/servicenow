var fs = require('fs');
var builder = require('botbuilder');
var restify = require('restify');
require('dotenv-extended').load();
var apiairecognizer = require('api-ai-recognizer');
const unhandledRejection = require("unhandled-rejection");
let rejectionEmitter = unhandledRejection({
    timeout: 20
});
rejectionEmitter.on("unhandledRejection", (error, promise) => {
    fs.writeFileSync("./data.json", JSON.stringify(error), "utf8");
});

rejectionEmitter.on("rejectionHandled", (error, promise) => {
    fs.writeFileSync("./data.json", JSON.stringify(error), "utf8");
})
var GlideRecord = require('servicenow-rest').gliderecord;
var gr = new GlideRecord('dev43073', 'x_58872_needit_needit', 'admin', 'DEUCD78YCgkJ');
gr.setReturnFields('number,short_description');
gr.addEncodedQuery('active=true');
gr.setLimit(10);
gr.query().then(function (result) { //returns promise 
    console.log(result);
})

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: 'd60f4a2a-5926-42c5-baa6-db7a8ddcd162',
    appPassword: '2uiQBbbGGAhkxnGVJDBeb9X'
});
server.post('/', connector.listen());
var bot = new builder.UniversalBot(connector);
var recognizer = new apiairecognizer('854ef36ee9ff4389baf041d8f87e40e0');
bot.recognizer(recognizer);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);
intents.matches('Welcome-message', [
    function (session, args) {
        console.log("Welcome-message Fired");
        console.log("Args : " + JSON.stringify(args));
        var responseString = "Hi, what can i do for you "
        session.send(responseString);
    }
]);//Welcome Intent Fired

intents.matches('Add user', [
    function (session, args) {
        console.log("Add user")
        console.log("Args : " + JSON.stringify(args));
        var responseString = "Sure !"
        session.send(responseString);
    }
]);

intents.onDefault(function (session) {
    session.send("Sorry...can you say that again?");
});
