"use strict";
var io = require('socket.io')(process.env.PORT||3001);
var shortid = require('shortid');
console.log('server connected');


var players = [];

io.on('connection',function(socket){
    
    var thisChildId = shortid.generate();
    players.push(thisChildId);
    console.log('client Connected,broadcast spawn,id:' + thisChildId);
    
    socket.broadcast.emit('spawn',{id:thisChildId});
    
    players.forEach(function(playerId){
        
        if(playerId==thisChildId)
            return;
    
        socket.emit('spawn',{id: playerId});
        console.log('sending spawn to new player for id:',playerId);
        
    })
    
    
    socket.on('move',function(data){
       data.id =thisChildId;
        console.log('client moved',JSON.stringify(data));
        socket.broadcast.emit('move',data);
    });
    
    
    socket.on('disconnect',function(){
              
        console.log('Client Disconnected',thisChildId);
        players.splice(players.indexOf(thisChildId),1);
        socket.broadcast.emit('disconnected',{ id:thisChildId });
              });
    
    
})
