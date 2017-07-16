var restify = require('restify');
var builder = require('botbuilder');

var Promise = require('bluebird');
var request = require('request-promise').defaults({ encoding: null });

function validateFaceExists(url){
    var https = require('https');

    var Client = require('node-rest-client').Client;
    
    var client = new Client();
    
    // set content-type header and data as json in args parameter 
        var args = {
            data: { 
                api_key: "UrByEbGv2ByLzTphxDF-IiK1N1a6pGkh", 
                api_secret: "ztEAV0RZsSuMnmR5---s_akoMtSLmtZv", 
                image_url: "https://fbchannel.chattigo.com:8443/examples/indice.jpg" 
            },
            headers: { "Content-Type": "application/json" }
        };
        
        client.post("https://api-us.faceplusplus.com/facepp/v3/detect", args, function (data, response) {
            // parsed response body as js object 
            console.log(data);
            // raw response 
            console.log(response);
        });
}

// Levantar restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// No te preocupes por estas credenciales por ahora, luego las usaremos para conectar los canales.
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

// Ahora utilizamos un UniversalBot
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());


// Dialogos
bot.dialog('/', [
    function (session, results, next) {
        builder.Prompts.confirm( session,'Hola, Bienvenido al Bot de Registro Digital, te pediremos información y fotos de tu RUT, estas preparado?');
    },
    function (session, results) {
        if (results.response) {
            builder.Prompts.attachment(session,` Ok, Paso 1: Envianos una Foto del Anverso de tu RUT`);
            
        }
        else {
            session.endDialog('Ok, vuelva cuando tengas todos los antecedentes.Adios!');
        }
        //session.dialogData.nombre = results.response;
      //  session.send( `Envianos una Foto del Anverso de tu RUT`);
    },
    function (session, results) {
        //session.dialogData.nombre = results.response;
       // session.send('Espere un momento por favor...');
        var msg = session.message;
        if (msg.attachments && msg.attachments.length > 0) {
        var attachment = msg.attachments[0];
        console.log('Atachement URL: '+attachment.contentUrl);
        var fileDownload = request(attachment.contentUrl);

        fileDownload.then(
            function (response) {

                // Send reply with attachment type & size
                var reply = new builder.Message(session)
                    .text('Attachment of %s type and size of %s bytes received.', attachment.contentType, response.length);
                session.send(reply);

            }).catch(function (err) {
                console.log('Error downloading attachment:', { statusCode: err.statusCode, message: err.response.statusMessage });
            });

            validateFaceExists('url');
            
            session.send({
                text: "You sent:",
                attachments: [
                    {
                        contentType: attachment.contentType,
                        contentUrl: attachment.contentUrl,
                        name: attachment.name
                    }
                ]
            });
        } else {
            // Echo back users text
            session.send("You said: %s", session.message.text);
        }
        builder.Prompts.attachment(session, `Paso 2: Gracias. Ahora envianos una Foto del Reverso de tu RUT`);
    },
    function (session, results) {
       // session.dialogData.edad = results.response;
        builder.Prompts.attachment(session,`Perfecto!  Paso 3: Ahora envianos una Foto tuya, estilo selfie`);
    },
    function (session, results) {
        //session.dialogData.hora = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, 'ok, Paso 4: ahora pf indicame tu dirección o envíame tu ubicación');
    },
    function (session, results) {
       // session.dialogData.preferencia = results.response.entity;
        builder.Prompts.number(session, 'Paso 5 : dame tu numero de teléfono');
    },
    function (session, results) {
        if (results.response) {
            session.endDialog(`**Parabens! vc ja é cliente do banco **,`);
        }
        else {
            session.endDialog('Adios!');
        }
    }
]);