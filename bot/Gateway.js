//var Promise = require('bluebird');
//var request = require('request-promise').defaults({ encoding: null });

let PORT = 50459;
let WATERMARK = undefined;
let CONVERSATION = 123457;
let contactos = [];
let req = require('request');
let headers = {
        'Authorization':`Bearer ${CONVERSATION}`,
        'Content-Type':'application/json'
    };

 //FC

let DID = '154601878382482';
let MT = 'http://chattigowrapper1247.cloudapp.net/ws/whatsapp/mt.php';
let QUE = 'http://chattigowrapper1247.cloudapp.net/ws/whatsapp/queue.php'

//WA
//let DID = '56986161642';
//let MT = 'http://gru.milk-it.cl/ws/whatsapp/mt.php';
//let QUE = 'http://gru.milk-it.cl/ws/whatsapp/queue3.php'

function getFromWatermark(){
    var URL = `http://localhost:${PORT}/v3/directline/conversations/${CONVERSATION}/activities`;
    if(WATERMARK) URL+= `?watermark=${WATERMARK}`;
    
    req.get({url: URL, headers: headers}, function (data, response) {
           //console.log(data);
            //console.log(response);
            if(response&&response.body){
                var b = JSON.parse(response.body);
                if(b==="conversation not found"){
                    req.post({url:`http://localhost:${PORT}/v3/directline/conversations`,headers:headers},function(data2,response2){
                        console.log('Conversación Iniciada: '+ CONVERSATION);
                    });
                }
                else{
                     if(b&&b.activities){
                        (b.activities).forEach(function(element) {
                            if(element.type==='message' && element.from.name==='Bot'){
                                console.log('BOT: ' + element.text);
                            }
                        }, this);
                    }
                    if(b.watermark)WATERMARK = b.watermark;
                }
            }
            setTimeout(getFromWatermark,1000);
        });
    
}
function pushToDriverWA(text){
    var URL = `${MT}?user=chattigo&pwd=12345678&did=${DID}&msisdn=56982306389&msgid=ChatBot&msgtext=${text}&tipo=texto`;
    
    req.get({url: URL, headers: headers}, function (data, response) {
            console.log(data);
            console.log(response);
        });
    
}
function pullFromDriverWA(){
   // var req = require('request');
    var URL = `${QUE}?user=chattigo&pwd=12345678&did=${DID}`;
    console.log(URL);
    req.get({url: URL}, function (data, response) {
            if(data)console.log(`pullFromDriverW->data:${JSON.stringify(data)}`);
            if(response&&response.body){
                if(response.body!='[]'){
                 //   console.log(`pullFromDriverW->response:${response.body}`);
                    (JSON.parse(response.body)).forEach(function(element) {
                        console.log(`${element.f}: ${element.m}`);
                        let body = '';
                        var URL2 = `http://localhost:${PORT}/v3/directline/conversations/${CONVERSATION}/activities`;
                        if(element.m&&element.m.startsWith('http')){
                            body = `{"type": "message","attachments": [{"contentType": "image/jpeg","contentUrl": "${element.m}",`;
                            body +=`"name": "${element.m.replace('http://attachment-wa.chattigo.com:8083/','')}"}],"from":"${element.f}","name": "User"}`;
                        }else{
                            body = `{"type":"message","text":"${element.m}","from":"${element.f}","name":"${element.f}"}`;
                        }
                          
                        console.log(body);
                        req.post({url: URL2, headers: headers,body: body}, function (data2, response2) {
                            console.log(data2);
                            if(response2&&response2.body)console.log(response2.body);
                      });
                    }, this);
                }
            }
            else console.error(`pullFromDriverW->response:${JSON.stringify(response)}`);
            setTimeout(pullFromDriverWA,1000);
        });
}
pullFromDriverWA();
getFromWatermark(); 