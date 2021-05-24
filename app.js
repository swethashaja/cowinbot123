// Require discord.js package
const Discord = require("discord.js");
const fetch = require("node-fetch");
const cron = require('node-cron');
const express = require('express');
const { TOKEN_123} = require("./tkn.json");
const axios = require('axios').default;
app = express();


const district = [   // the details in APIs are made to array for the easy use
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




// create new client
const client =  new Discord.Client();

const resolveDistrictID = (districtName) => {
    return district[district.map(d => d.district_name).indexOf(districtName)].district_id;
};// conveted the district name to district ID

const cronJob = (msg, isSubscribe) => {

    let date = msg.content.split(" ")[1];

    let districtName = msg.content.split(" ")[2];

    let districtID = resolveDistrictID(districtName);


    axios({
        method: 'get',
        url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtID}&date=${date}`,
        headers : { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10116) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',}
    })
        .then( response => {
            //   response;
            console.log(response);
            if (response.data.sessions.length === 0) {
                msg.reply(`Sorry! No vaccination slot available.`);
                (!isSubscribe) ? msg.channel.send(`If you want an hourly update, Please use the command`):null;
                (!isSubscribe) ? msg.channel.send(`**!subscribe ${date} ${districtName}**`):null;
            }
            let str  =   "";//we made responses as strings
            let isNoneAvailable = true;
            for (let index = 0; index < response.data.sessions.length; index++) {
                if (response.data.sessions[index].available_capacity !== 0) {
                    isNoneAvailable = false;
                    const element = response.data.sessions[index];
                        const slotInfo =  `\n**AVAILABLE VACCINE SLOTS**💉\n--------------------------\n\nname :-  ${element.name}\npincode:- ${element.pincode}\ndate :-  ${element.date}\nminimum age limit :-${element.min_age_limit}\nfee_type :-${element.fee_type}\nvaccine :-${element.vaccine}\nslot :-  ${element.slots}\n\n`;
                        str += slotInfo;
                }
            }
            if (isNoneAvailable) {
                msg.reply(`Sorry! No vaccination slot available.`);
                (!isSubscribe) ? msg.channel.send(`If you want an hourly update, Please use the command`):null;
                (!isSubscribe) ? msg.channel.send(`**!subscribe ${date} ${districtName}**`):null;
            }
            else {
                msg.reply(str);
            }
        })
        .catch (err => {
            console.log(err);
            msg.reply("Not working,⚠️Try again")
        });

    return null;
}


client.on( "ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// check  for new message
client.on("message", msg => {

    if (msg.content === "!hello"){
        msg.reply("Hi, 👨‍⚕️ Dr.Bot at your service.\n[USE 👉 **!help**  for further commands]");
    }

    else if (msg.content === "!about vaccine"){
        msg.reply("\n🩸 **Covishield Vaccine** is 6 to 8 weeks, \n🩸 **Covaxin** can be taken after 28 days,Gap between first two doses of 🩸 **Sputnik** is 21 days-3 months");
    }

// help command
    else if (msg.content === "!help"){
        msg.reply("Hey there👋, please use these commands \n👉**!about vaccine**,\n👉**!vaccine registration**,\n👉**!available vaccine slots**,\n👉**!covid symptoms**")
    }

// user should type in this format to get the details so we just give some instructions to user
    else if (msg.content === "!available vaccine slots") {
        msg.reply("Please enter the details in this format-👉--!vaccine_schedule<SPACE>DD-MM-YYYY<SPACE>District_Name---[eg;!vaccine_schedule 31-03-2021 Thrissur]");
    }

    else if (msg.content === "!vaccine registration"){
        msg.reply("https://selfregistration.cowin.gov.in/");
    }

    else if (msg.content === "!covid symptoms"){
        msg.reply("\n**📍Most common symptoms:**\nfever , dry cough , tiredness.\n\n**📍Less common symptoms:**\naches and pains, sore throat,diarrhoea,conjunctivitis,\nheadache,loss of taste or smell,\n\n**📍Serious symptoms:**\ndifficulty breathing,chest pain");
        }

    else if(msg.content.split(' ')[0] === "!vaccine_schedule") {
        if (msg.content.split(' ').length !== 3) {
            msg.reply("I didn't understand");
        }
        cronJob(msg, isSubscribe=false);
    }// this cron job schedule the updates in every hour in a day

    else if(msg.content.split(" ")[0] === "!subscribe") {
        cron.schedule("0 * * * *",() => cronJob(msg, isSubscribe=true));
    }
});

app.listen(3000);
// login your bot using token


client.login(TOKEN_123);
