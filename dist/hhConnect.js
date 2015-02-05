!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.hhConnect=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(userConfig){

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
},{}]},{},[1])(1)
});