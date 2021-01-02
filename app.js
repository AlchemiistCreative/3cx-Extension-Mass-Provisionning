const rp = require('request-promise');
const express = require('express');
const bodyparser = require('body-parser');
var tough = require('tough-cookie');
require('dotenv').config();

//Express
const app = express(); 

app.use(express.static('public'));

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {


  

      res.render('index');



})

app.post('/api', (req, res) => {

  let instance = req.body.instance
  let username = req.body.username
  let password = req.body.password
  let sourceext = req.body.sourceext
  let amount =  req.body.amount
  let startext = req.body.startext
  let callerid = req.body.callerid
  api(instance, username, password, sourceext, amount, startext, callerid)
  

  res.redirect('/')



})


app.listen('3000');

function api(instance, username, password, sourceext, amount, startext, callerid){

    const domain = instance.replace('https://','');
    const path_login = "/api/login"
    const path_copyext = "/api/copyExtension"
    const key = "keyexample"
    const value = "valueexample"

    const data = 	
        {
          "username": `${username}`,
          "password": `${password}`,
        }
    
    
    let cookie = new tough.Cookie({
        key: key.toString('base64'),
        value: value.toString('base64'),
        domain: domain,
        httpOnly: true,
        maxAge: 31536000
        });
    
    
    var cookiejar = rp.jar();
    
    cookiejar.setCookie(cookie.toString(), instance);    
        
    
    console.log(data);
  
    var options_req_login = {
      method: 'POST',
      url: instance + path_login,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'charset': 'UTF-8',
        'User-Agent': 'request'
      },
      json: data,
      jar: cookiejar
    }


    var options_res = {
        uri: instance + '/api/SystemStatus',
        jar: cookiejar
    };



  rp(options_req_login)
  .then(function (parsedBody_req_login) {

     if(parsedBody_req_login == 'AuthSuccess'){
        //console.log(parsedBody_req_login);
      var ext = startext;

      for (i = 0; i < amount; i++){

        extension = ext++
        const extprov = {"copyVoicemail":true,"copyBlf":true,"copyOptions":true,"copyRights":true,"copyForwardingRules":true,"copyExceptions":true,"sourceExtension": sourceext,"extension":extension,"firstName":'Extension' + extension,"lastName":"","email":"","outboundCallerId":callerid,"mobile":""}
        var options_req_copyext = {
          method: 'POST',
          url: instance + path_copyext,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'charset': 'UTF-8',
            'User-Agent': 'request'
          },
          json: extprov,
          jar: cookiejar
        }
        
        rp(options_req_copyext)
        .then(function (parsedBody_res) {
          
        })
        .catch(function (err) {
            console.log(err.message)
        });



      }


     }

  })
  .catch(function (err) {
    console.log(err.message);
  }); 


  //setTimeout(api, 5000);


  }

  

