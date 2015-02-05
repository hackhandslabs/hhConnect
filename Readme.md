# HackHands Cross-origin iFrame API protocol
v2.0.0

- - - - - - - - - - - - - - - - - - - - - - - - 
//Init
var HH = hhConnect({ target: <window> })

- - - - - - - - - - - - - - - - - - - - - - - - 

// Call a Method
HH.call(<functionName>, <params>, <callback>)
HH.call('calc', 'hello', function(error, cb){

});

// Bind a Method response/logic
HH.bind(<functionName>, <callback>)
HH.bind('calc', function(params, cb){

});

- - - - - - - - - - - - - - - - - - - - - - - - 

// Listen for an event
x.on(<eventName>, <event>)

// Emit an event
x.emit(<eventName>, <params>)

- - - - - - - - - - - - - - - - - - - - - - - - 
