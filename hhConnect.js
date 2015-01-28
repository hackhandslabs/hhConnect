/*
    HackHands Cross-origin iFrame API protocol
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
*/
var hhConnect = function(userConfig){

    // If false or invalid window, return a dummy object (So it wont break apps)
    if (!userConfig.target)
    {
        console.info('[hhConnect] No target window found!');
        return { on: function(){}, emit: function(){}, call: function(){}, bind: function(){} }
    }

    // Settings for this instance
    var config = {
        target: userConfig.target,
        cbReady: userConfig.onReady || function(){},
        namespace: userConfig.namespace || 'HH',
        permission: userConfig.permission || '*',
        instance: Math.random().toString(36).substr(2, 9),
        messageID: 0
    }

    // Will store all the callbacks for this instance
    var cbs = {
        event: {},
        method: {},
        message: {},
    }

    // Store this obj
    var obj = {}

    // HELPER: Generate a new messageID for communications
    var nextMessageID = function()
    {
        return config.instance+'-'+(config.messageID+++1);
    }

    // Helper: Send the message using an RPC fashion
    var sendMessage = function(name, data, id) {
        console.log('sendMessage', [name, data, id])
        config.target.postMessage({
            namespace: config.namespace, 
            id: id || nextMessageID(), 
            name: name, 
            data: data
        }, config.permission);
    }

    // Incoming messages handler
    window.addEventListener("message", function(event){

        /*
        // Check origin policy
        if (event.origin !== '*' && event.origin !== 'null' && event.origin !== config.permission)
            return console.warn('[hhConnect] Post Forbiden: ' + event.origin + ' != ' + config.permission);
        */

        var request = event.data;

        if (request.namespace !== config.namespace)
            return;

        if (request.name == '__ready')
        {
            if (request.data == 'ping!')
                sendMessage('__ready', 'pong!')

            config.cbReady();
            return;
        }

        if (cbs.method[request.name])
            cbs.method[request.name]( request.data, function(error, data){
                sendMessage('_callback_'+request.name, {error: error, data: data}, request.id)
            })

        // Any METHOD callback for this ID? Call it and delete it
        if (cbs.message[request.id])
        {
            cbs.message[request.id](request.data.error, request.data.data)
            delete cbs.message[request.id]
        }

        // Any EVENT with this name?
        if (cbs.event[request.name])
            cbs.event[request.name](request.data);

        // Any catch-all EVENT? also send there
        if (cbs.event['*'] && request.name.indexOf('__event__') > -1)
            cbs.event['*'](request.name.substring(9), request.data);

    }, false);


    setTimeout(function() {
        sendMessage('__ready', 'ping!')
    }, 0);

    return {
        // ########  EVENTS  ########
        on: function(eventName, eventCB){
            cbs.event['__event__'+eventName] = eventCB
        },
        emit: function(eventName, eventData){
            sendMessage('__event__'+eventName, eventData)
        },
        // ########  METHODS  ########
        bind: function(methodName, methodFunction){
            cbs.method['_method_'+methodName] = methodFunction
        },      
        call: function(methodName, methodParams, methodCB){

            var messageID = nextMessageID();

            // Save this callback to call when this ID returns
            if (methodCB)
                cbs.message[messageID] = methodCB;

            sendMessage('_method_'+methodName, methodParams, messageID);
        }
    }

}