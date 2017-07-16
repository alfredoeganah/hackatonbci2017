//var Promise = require('bluebird');
//var request = require('request-promise').defaults({ encoding: null });

let PORT = 63974;
let WORKING = false;
let WATERMARK = undefined;
let CONVERSATIONWA = 12345

function getFromWatermark(){
    if(WORKING)return;
    WORKING = true;
   // console.log('getFromWatermark()->');
   // var https = require('https');
    var req = require('request');
    var URL = `http://localhost:${PORT}/v3/directline/conversations/${CONVERSATIONWA}/activities`;
    if(WATERMARK) URL+= `?watermark=${WATERMARK}`;
    var headers = { 
        'Authorization': `Bearer ${CONVERSATIONWA}`,
        'Content-Type' : 'application/json' 
    };
    req.get({url: URL, headers: headers}, function (data, response) {
           //console.log(data);
            //console.log(response);
            if(response.body){
                var b = JSON.parse(response.body);
                if(b==="conversation not found"){
                 //   var urlConversation = `
                    req.post({url:`http://localhost:${PORT}/v3/directline/conversations`,headers:headers},function(response){
                        console.log('Conversacion Iniciada: '+ CONVERSATIONWA);
                    });
                }
                else{
                     if(b&&b.activities){
                        (b.activities).forEach(function(element) {
                            if(element.type==='message' && element.from.name==='Bot'){
                                console.log('MENSAJE RECIBIDO DEL BOT: ' + element.text);
                            }
                        }, this);
                    }
                    if(b.watermark)WATERMARK = b.watermark;
                }
            }
            WORKING = false;
        });
    
}
function getFromDriver(){
    if(WORKING)return;
    WORKING = true;
    //console.log('getFromWatermark()->');
   // var https = require('https');
    var req = require('request');
    var URL = `http://localhost:${PORT}/v3/directline/conversations/${CONVERSATION}/activities`;
    if(WATERMARK) URL+= `?watermark=${WATERMARK}`;
    var headers = { 
        'Authorization': 'Bearer 12345',
        'Content-Type' : 'application/json' 
    };
    req.get({url: URL, headers: headers}, function (data, response) {
           // console.log(data);
            //console.log(response);
            if(response.body){
                var b = JSON.parse(response.body);
                if(b&&b.activities){
                    (b.activities).forEach(function(element) {
                        if(element.type==='message' && element.from.name==='Bot'){
                            console.log('MENSAJE RECIBIDO DEL BOT: ' + element.text);
                        }
                    }, this);
                }
                if(b.watermark)WATERMARK = b.watermark;
            }
            WORKING = false;
        });
    
}

let interval = setInterval(getFromWatermark,1000);