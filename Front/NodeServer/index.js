require("dotenv").config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors')

 // cool now everything is handled!

const app = express().use(bodyParser.json());
//function to detect 
/*function authKey(req,res,next){
    const api_token = req.headers['authorization'];
    if(api_token !== process.env.APP_API_TOKEN){
        res.status(403).send({ error: { code: 403, message: "UNAUTHORIZED!!" } });
        return;
    }
    next();
}*/
app.use(cors())
app.listen(3000,() => console.log('Is this thing on?'));

app.get('/',(req,res) =>{
    res.status(200).send({ data: { message: 'This thing on?' } });
});

app.post('/slackStatus', async (req, res) => {
    const slack_status = req.body['slack_status'];
    const emoji = req.body['emoji'];
    try {
        const slackEndPoint = 'https://slack.com/api/users.profile.set'; 
        const payload = {
          profile: {
            status_text: slack_status,
            status_emoji: emoji
          }
          
        };
        console.log(payload);
        const slackauthToken = process.env.SLACK_API_TOKEN; 
        const response = await axios.post(slackEndPoint, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${slackauthToken}`
          }
        }); 
    
        console.log(response.data); 
        res.status(200).send('Success!');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error reaching endpoint');
      }
    });
    
    app.post('/frontStatus', async (req, res) => {
        const front_teammate_id = req.body['id'];
        const front_status = req.body['front_status'];
          try{
            const frontEndPoint = `https://api2.frontapp.com/teammates/${front_teammate_id}`;
            const payload = {
                "is_available": front_status
            };
            const frontauthToken = process.env.FRONT_API_TOKEN;
            const response = await axios.patch(frontEndPoint,payload,{ 
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${frontauthToken}`
                }
            });
            console.log(response.data);
            res.status(200).send('Success!');
          } catch(error){
            console.error(error);
            res.status(500).send('Error reaching endpoint');
          }
     });
        


