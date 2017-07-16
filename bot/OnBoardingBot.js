
 restify = require('restify');

 builder = require('botbuilder');

var Promise = require('bluebird');
var request = require('request-promise').defaults({ encoding: null });

var req = require('request');

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
        builder.Prompts.confirm( session,'Hola! Bienvenido a BotPass, ¿tiene su Carnet de Indentidad a mano?');
    },
    function (session, results) {
        if (results.response) {
            builder.Prompts.attachment(session,` Ok, Paso 1: Envianos una Foto del Reverso del Carnet de Identidad, donde se distinga claramente el código QR.`);
            
        }
        else {
            session.endDialog('Ok, vuelva a esribir cuando lo tenga a mano .Adios!');
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
        var binData = '';

        if(attachment.contentUrl){
            req.get(attachment.contentUrl,function(data,response){
           //     console.log(data);
           //     console.log(response);
                var base64data = new Buffer(response.body, 'binary').toString('base64');
                
                var URL2 = `http://fbchanneldev.chattigo.com:8080/QRtoRUTNAME/GetDataQR`;
                var datos = {
                    base64data: base64data,
          //          fileName: attachment.contentUrl.replace( /^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '' )
                };

                var options = {
                    method: 'post',
                    body: datos, // Javascript object
                    json: true, // Use,If you are sending JSON data
                    url: URL2,
                    headers: {
                        // Specify headers, If any
                    }
                };
                console.log(URL2);
                req.post(options, function(err,data,response){
                    console.log(err);
                    console.log(data);
                    console.log(response.body);
                }); 
            });
        }

/*
        fileDownload.then(
            function (response) {

                // Send reply with attachment type & size
                
                 reply = new builder.Message(session)
                    .text('Attachment of %s type and size of %s bytes received.', attachment.contentType, response.length);
                //session.send(reply);
                
                 URL2 = `http://fbchanneldev.chattigo.com:8080/QRtoRUTNAME/GetDataQR?urlImage=${attachment.contentUrl}`;
                console.log(URL2);
                req.get({url: URL2}, function(data,response){
                    console.log(data);
                    console.log(response);
                });

            }).catch(function (err) {
                console.log('Error downloading attachment:', { statusCode: err.statusCode, message: err.response.statusMessage });
            });

         //   validateFaceExists('url');
        */    
            
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