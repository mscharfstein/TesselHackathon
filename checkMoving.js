
var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A'])
var av = require('tessel-av');
var os = require('os');
var http = require('http');
var port = 3000;
var camera = new av.Camera();
var schedule = require('node-schedule');
var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
const nodemailer = require('nodemailer');

var schedule = require('node-schedule');
var serverIsCreated = false;

//var j = schedule.scheduleJob({hour: 21, minute: 41}, function() {
  //console.log('here');
accel.on('ready', function () {
    // Stream accelerometer data
    let previous, current, difference

    var j = schedule.scheduleJob({hour: 21, minute: 52}, function() {


    accel.on('data', function(xyz){
        current = xyz;
        difference = [];

        //getting the difference between the current data packet and the previous data packet
        if (previous){
            difference.push(current[0]-previous[0]) //x channel
            difference.push(current[1]-previous[1]) //y channel
            difference.push(current[2]-previous[2]) //z channel
        } //if there's no previous, then you don't calculate anything
        previous = current;

        //returns a boolean for if or not there is movement
        if (difference.length){

            //check if there's x/y movement
            if (Math.abs(difference[0])>0.1 || Math.abs(difference[1])>0.1){

              console.log("movement!");
              //console.log(serverIsCreated);
              if (!serverIsCreated) {
                serverIsCreated = true;
                //console.log(serverIsCreated);
                 const server = http.createServer((request, response) => {
                response.writeHead(200, { "Content-Type": "image/jpg" });

                camera.capture().pipe(response);

                }).listen(port, () => {
                  console.log(`http://${os.hostname()}.local:${port}`)

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, // secure:true for port 465, secure:false for port 587
                    auth: {
                        user: 'clairepfis@gmail.com',
                        pass: 'simonrubinstein'
                    }
                });
                //console.log(transporter);
                // setup email data with unicode symbols
                let mailOptions = {
                    from: '"Tardiness Check" <clairepfis@gmail.com>', // sender address
                    to: 'howebs@yahoo.com', // list of receivers
                    subject: 'Tardy People', // Subject line
                    text: 'The person pictured at http://sanpellegrino.local:3000/ is an embarassment. They arrived after 10:00 AM', // plain text body
                    //html: '<b>Hello world ?</b>' // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                  //console.log("HELLO")
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });

                });

              }

            }
        }


    })
  })

});

accel.on('error', function(err){
  console.log('Error:', err);
});

//})
