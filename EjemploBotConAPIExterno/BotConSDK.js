// Load the libraries
const ChatBot = require("rainbow-chatbot");
const NodeSDK = require("rainbow-node-sdk");
const request = require('request');
var fs = require('fs');

// Load the bot identity
const bot = require("./bot.json");

// Load the scenario
const scenario = require("./scenario2.json");

//Constantes
const apiOpenWeather = "96ccf13a02b33ec0657d17b93e65b20d";
const codMajadahonda = "6359305";
const urlWeather = "http://api.openweathermap.org/data/2.5/weather?id=" + codMajadahonda + "&lang=es&units=metric&APPID=" + apiOpenWeather;


//Funciones

function escribir(archivo,message) { 
    
    fs.writeFile(archivo, message, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

}


// Start the SDK
nodeSDK = new NodeSDK(bot);
nodeSDK.start().then( () => {
    // Start the bot
    chatbot = new ChatBot(nodeSDK, scenario);
    return chatbot.start();
}).then( () => {
    // Do something once the chatbot has been started




   

    chatbot.onMessage((tag, step, content, from, done) => {
        // Do something when an answer is handled by the bot (i.e. change the route)
        
        console.log(tag + "\b");
        console.log(step + "\b");
        console.log(content + "\b");
        console.log(from.displayName + "\b");
        
        
        if (tag == 'tiempo')  {
     
            request(urlWeather, function(error,response,body) {
                var clima = JSON.parse(body);
                
                tiempo = (clima.main.temp) + " grados.\n";
                clima_descripcion = clima.weather[0]["description"];
                clima_descripcion = clima_descripcion.charAt(0).toUpperCase() + clima_descripcion.substr(1).toLowerCase() + "\n";
                clima_humedad = "Humedad: " + clima.main.humidity + "%"; 
                tiempo += clima_descripcion + clima_humedad;
             
                messageSent = nodeSDK.im.sendMessageToJid(tiempo, from.jid_im);
                                
            })

        
        } 

   
        done();

      
    }, this);

    chatbot.onTicket((tag, history, from, start, end, state, id) => {
        // Do something when a user has completed a scenario
   
    }, this);

});