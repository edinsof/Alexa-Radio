
const Alexa = require('ask-sdk-core');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
 
var token=1
var Title='';
var Artist='';
var pochette="";

//const SpeakBreak = '                                         ,'
const SpeakBreak ='<break time="300ms"/>';
const LongSpeakBreak ='<break time="1s"/>';
function getOffsetInMilliseconds(handlerInput) {
  // Extracting offsetInMilliseconds received in the request.
  return handlerInput.requestEnvelope.request.offsetInMilliseconds;
}
  const StreamUrl="https://listen.radioking.com/radio/184318/stream/226369"

var offsetInMilliseconds=0
const headers = {
    headers: {
        "x-api-key": "L7QF50ujQm57MqDJxBB789rUGhkJ0FvB3fYOqYrl",
        
    } 
} 


const ApiUrl="https://api.radioking.io/widget/radio/voltigeradio-1/track/current"

 
//******************FONCTION PRINCIPALE*************************************************************************************/
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest' ||
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (
               handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.LoopOnIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ShuffleOnIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StartOverIntent'
            );
    },

    async handle(handlerInput) {
 
 token =getRandomInt(31)
  
            const STREAMS = [{
                "token": "1",
                "url": "",
                "metadata": {
                    "title": "Voltige Radio",
                    "subtitle":" La génération des hits",
                    "art": {
                        "sources": [{
                            "contentDescription": "logo",
                            "url": "https://radio.voltigeradio.fr/voltigeradio/logo-voltigeradio-alexa.png",
                            "widthPixels": 512,
                            "heightPixels": 512
                        }]
                    },
                    "backgroundImage": {
                        "sources": [{
                            "contentDescription": "example image",
                            "url": "https://lh3.googleusercontent.com/proxy/MgPnIvRWQ80hgAsWLlNx0-b43i6fl86IUZ46pquC6lFwLYFqmxMVUwYYmQVTcV3Uv3bEeX6djYeJg2A70d5eoh9BSfXGEtnNrF8Yp60qHn2KK1v0WNHDm3FoB8_bHSBDELXPSQlTyHY",
                            "widthPixels": 1200,
                            "heightPixels": 800
                        }]
                    }
                }
            }];

        /***** APPELLE API*********************/
await getRemoteDataH(ApiUrl)
            .then((response) => {
                const data = JSON.parse(response);
          Title=data.title
          Artist=data.artist
          pochette=data.cover
             
            })
            
            .catch((err) => {
                //set an optiotnal error message here
                //outputSpeech = err.message;
            });
        /***************************************/
            let stream = STREAMS[0];
            
            
          const StreamUrl="https://listen.radioking.com/radio/184318/stream/226369"
             stream.url = StreamUrl

          //   stream.metadata.subtitle=Title
        // stream.metadata.art.sources[0].url=pochette 
        handlerInput.responseBuilder
            
                .addAudioPlayerPlayDirective('REPLACE_ALL', stream.url, token, offsetInMilliseconds, null, stream.metadata);
        var  speechText ='Bienvenue sur Voltige Radio, la génération des hits.'+SpeakBreak+'Vous écoutez'+SpeakBreak+Title+'de'+SpeakBreak+Artist
     
        
            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse(); 

    },
};
//********************************************************************************************************************/

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'Pour relancer la diffusion dite, reprendre, pour mettre en pause dite';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.LoopOffIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ShuffleOffIntent'
            );
    },
    handle(handlerInput) {
        handlerInput.responseBuilder
        
  
            .addAudioPlayerClearQueueDirective('CLEAR_ALL')
            .addAudioPlayerStopDirective();
            
 offsetInMilliseconds=getOffsetInMilliseconds(handlerInput)
        return handlerInput.responseBuilder
            .getResponse();
    },
};

const PlaybackStoppedIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'PlaybackController.PauseCommandIssued' ||
            handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStopped';
    },
    handle(handlerInput) {
         offsetInMilliseconds=getOffsetInMilliseconds(handlerInput)
        handlerInput.responseBuilder
            .addAudioPlayerClearQueueDirective('CLEAR_ALL')
            .addAudioPlayerStopDirective();

        return handlerInput.responseBuilder
            .getResponse();
    },
};

const PlaybackStartedIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStarted';
    },
    handle(handlerInput) {
        
        handlerInput.responseBuilder
            .addAudioPlayerClearQueueDirective('CLEAR_ENQUEUED');

        return handlerInput.responseBuilder
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder
            .getResponse();
    },
};

const ExceptionEncounteredRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'System.ExceptionEncountered';
    },
    handle(handlerInput) {
        
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return true;
    },
};


const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
      
        console.log(`Error handled: ${error.message}`);
        console.log(handlerInput.requestEnvelope.request.type);
        return handlerInput.responseBuilder
            .getResponse();
    },
};
//**************************Fonction qui permet les appels API******************************************************************/
const getRemoteDataH = function(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? require('https') : require('http');
        const request = client.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed with status code: ' + response.statusCode));
            }
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => resolve(body.join('')));
        });
        request.on('error', (err) => reject(err))
    })
};
//******************************************************************************************************/


//******************************************************************************************************/


const skillBuilder = Alexa.SkillBuilders.custom();
 

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        PlaybackStartedIntentHandler,
        CancelAndStopIntentHandler,
        PlaybackStoppedIntentHandler,
        HelpIntentHandler,
        ExceptionEncounteredRequestHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();
