//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var app     = express();
var eps     = require('ejs');
var got     = require('got');

var axios   = require('axios').default;
const { HTTP, CloudEvent } = require("cloudevents");

app.engine('html', require('ejs').renderFile);

app.use( '/scripts', express.static('scripts'));
app.use( '/styles', express.static('styles'));
app.use( '/images', express.static('images'));

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var broker = process.env.CEBROKERURI;

// Emit an event
app.get('/emit', function (req,res)
{
  console.log("Emitting Cloud Event");

  const cloudevent = new CloudEvent({
    type: 'message.nodeemittedevent',
    data: {
      text: 'hello world'
    },
    source: 'nodeemitter'
  });

  const message = HTTP.binary(cloudevent);

  axios({
     method: "post",
     url: broker,
     data: message.body,
     headers: message.headers,
  });

  console.log( "Emitted cloud event " + cloudevent.type );
});

// Comment for git testing again
app.get('/', function (req, res)
{
  console.log( "Request received....");
  console.log("Demo time");
  res.render('node_test.html');
});

app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);

