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
intents.matches('Default Welcome Intent', [
    function (session, args) {
        session.send("What would you like to do?\n\n1.Add User\n\n2.Add Device");
    }
]);//Welcome Intent Fired

intents.matches('add_user', [
    function (session, args) {
        var gr = new GlideRecord('dev43073', 'sys_user', 'admin', 'DEUCD78YCgkJ');
        var firstname = builder.EntityRecognizer.findEntity(args.entities, 'firstname');
        var lastname = builder.EntityRecognizer.findEntity(args.entities, 'lastname');
        var title = builder.EntityRecognizer.findEntity(args.entities, 'title');
        var emails = builder.EntityRecognizer.findEntity(args.entities, 'email');
        var username = builder.EntityRecognizer.findEntity(args.entities, 'username');
        var password = builder.EntityRecognizer.findEntity(args.entities, 'password');
        var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');
        var actionIncomplete = builder.EntityRecognizer.findEntity(args.entities, 'actionIncomplete');
     
     if(firstname.hasOwnProperty('entity'))
        {
         session.send(firstname.entity);
    
        }
     else if (fulfillment) {
         var speech = fulfillment.entity;        
         session.send(speech);
     }
     
       
    }
]);

intents.onDefault(function (session) {
    session.send("Sorry...can you say that again?");
});
