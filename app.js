
const district = [
        {
            "district_id": 301,
            "district_name": "Alappuzha"
        },
        {
            "district_id": 307,
            "district_name": "Ernakulam"
        },
        {
            "district_id": 306,
            "district_name": "Idukki"
        },
        {
            "district_id": 297,
            "district_name": "Kannur"
        },
        {
            "district_id": 295,
            "district_name": "Kasaragod"
        },
        {
            "district_id": 298,
            "district_name": "Kollam"
        },
        {
            "district_id": 304,
            "district_name": "Kottayam"
        },
        {
            "district_id": 305,
            "district_name": "Kozhikode"
        },
        {
            "district_id": 302,
            "district_name": "Malappuram"
        },
        {
            "district_id": 308,
            "district_name": "Palakkad"
        },
        {
            "district_id": 300,
            "district_name": "Pathanamthitta"
        },
        {
            "district_id": 296,
            "district_name": "Thiruvananthapuram"
        },
        {
            "district_id": 303,
            "district_name": "Thrissur"
        },
        {
            "district_id": 299,
            "district_name": "Wayanad"
        }
    ];
// Require discord.js package
const Discord = require("discord.js");
const fetch = require("node-fetch");
const { TOKEN_123} = require("./tkn.json");
const axios = require('axios').default;


// create new client
 const client =  new Discord.Client();

 

 client.on( "ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);

});
 
// check  for new message
client.on("message",msg => {
    
if (msg.content === "!hello"){
    msg.reply("Hi,👨‍⚕️ Dr.Bot at your service. How can I help you?");
}
else if (msg.content === "!thankyou dr.Bot"){
    msg.react("❤️");
}
// help command
else if (msg.content === "!help"){
    msg.reply("Hey there ,how can I help you ? please use these command words --[!about getting the vaccine]---,--[!vaccine registration]--,---[!available vaccine slots]--,---[!covid symptoms]--")
}
// user should type in this format to get the details so we just give some instructions to user
else if (msg.content === "!available vaccine slots"){
    msg.reply("Please enter the details in this format DD-MM-YYYY<SPACE>District_Name [eg;31-03-2021 Thrissur]");
}   
else if (msg.content === "!vaccine registration"){
        msg.reply("https://selfregistration.cowin.gov.in/");
}
else if (msg.content === "!covid symptoms"){
    msg.reply("📍Most common symptoms ▪️fever  ▪️dry cough  ▪️tiredness  📍Less common symptoms: ▪️aches and pains");
}
else{
//  if (msg.content === "vacccine slot"){
//      msg.reply("DD-MM-YYYY District_Name");
     //msg.content    =   "DD-MM-YYYY District_Name"
     try {
        let date = msg.content.split(" ")[0];
        let districtName = msg.content.split(" ")[1];
   
        let districtID = district[district.map(id=>id.district_name).indexOf(districtName)].district_id;
        console.log(date)
        console.log(districtID)
        axios({
           method: 'get',
           url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtID}&date=${date}`,
           headers : {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',//this browser becz we couldnt call the api crrtly sometimes
          }
       })
       .then(async response=>{
           //   response;
           console.log(response.data);
           let str  =   "";//we made responses as strings
           for (let index = 0; index < response.data.sessions.length; index++) {
               const element = response.data.sessions[index];
            //    str+=    
            msg.reply(
                `AVAILABLE VACCINE SLOTS💉
                --------------------------
                 name :-  ${element.name}
                 pincode:- ${element.pincode}
                 date :-  ${element.date}
                 minimum age limit :-${element.min_age_limit}
                 fee_type :-${element.fee_type}
                 vaccine :-${element.vaccine}
                 slot :-  ${element.slots}
               `)
           }

        //    let msgDisplay  =    response.data.sessions.map(id=>{
        //        return   `\n"center_id":${id["center_id"]},
        //                   "name":${id["name"]},\n"address":${id["address"]},\n"district_name":${id["district_name"]},\n"block_name":${id["block_name"]},\n"pincode":${id["pincode"]},\n"from":${id["from"]},\n"to":${id["to"]},\n"fee_type": ${id["fee_type"]},\n"min_age_limit":${id["min_age_limit"]},\n"vaccine":${id["vaccine"]},\n"slots":${id["slots"]},\n`
        //      })
        //      msgDisplay =   msgDisplay.join(" ");
           
           
         
         //JSON.stringify(msgDisplay))
       })
       .catch(err =>{    
          console.log(err); 
          msg.reply("Not wrking")  
    });
     
} catch (error) {
         //console.log(error)
        //msg.reply("Reply Invalid")
     }
     
}


});
 // login your bot using token
 client.login(TOKEN_123);
