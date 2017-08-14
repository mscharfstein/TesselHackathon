// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
Create a server that responds to every request by taking a picture and piping it directly to the browser.
*********************************************/
'use strict';

var av = require('tessel-av');
var os = require('os');
var http = require('http');
var port = 8000;
var camera = new av.Camera();
var schedule = require('node-schedule');
var fs = require('fs');
var path = require('path');


// hour: 14, minute: 10
var j = schedule.scheduleJob({hour: 20, minute: 25}, function() {

  const server = http.createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "image/jpg" });

    camera.capture().pipe(response);

  }).listen(port, () => console.log(`http://${os.hostname()}.local:${port}`));

})


