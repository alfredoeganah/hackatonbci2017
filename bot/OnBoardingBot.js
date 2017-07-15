var restify = require('restify');
var builder = require('botbuilder');

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
            session.send(` Ok, Paso 1: Envianos una Foto del Anverso de tu RUT`);
        }
        else {
            session.send('Ok, vuelva cuando tengas todos los antecedentes.Adios!');
        }
        //session.dialogData.nombre = results.response;
      //  session.send( `Envianos una Foto del Anverso de tu RUT`);
    },
    function (session, results) {
        //session.dialogData.nombre = results.response;
        session.send( `OK! Paso 2: Ahora envianos una Foto del Reverso de tu RUT`);
    },
    function (session, results) {
       // session.dialogData.edad = results.response;
        session.send( `Perfecto!  Paso 3: Ahora envianos una Foto tuya, estilo selfie`);
    },
    function (session, results) {
        //session.dialogData.hora = builder.EntityRecognizer.resolveTime([results.response]);
        session.send(session, 'ok, Paso 4: ahora pf indicame tu dirección o envíame tu ubicación');
    },
    function (session, results) {
       // session.dialogData.preferencia = results.response.entity;
        session.send(session, 'Paso 5 : dame tu numero de teléfono');
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