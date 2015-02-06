# HackHands Connect (beta)
HTML5 PostMessage library for effective cross-domain communication.


## Features
- Lightweight
- Callback Support
- Events Support
- Bidirectional communication
- Based on JSON-RPC 2.0 Standard
- Same code on both ends


## API
#### hhConnect( options )
Initializes a new connection to a *window* object (can be an iFrame or a popup)

Options:

- *target* (Required) - window object to connect (can be an iFrame or a popup)
- namespace - Namespace for this connection (usefull if you have multiple instances)
- cbReady - Callback when the connection is established (or restored)


#### HH.bind( functionName, [callback] )
Bind/Expose a new method

#### HH.call( functionName, [params], [callback] )
Call an already defined method

#### HH.on( eventName, [callback] )
Listen for an event

#### HH.emit( eventName, [params] )
Emit/Fire some event


## Example

```js
var HH = hhConnect({ 
	target: document.getElementById('myIframe').contentWindow,
	onReady: function(){
		alert('Connection ready!');
	
		HH.call('sumNumbers', {x:1, y:5}, function(error, data){
			alert(data)
		});
	}
})

HH.on('myEventName', function(data){
	console.log(data)
})
```



## License 

(The MIT License)

Copyright (c) 2015, HackHands.com Dev Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.