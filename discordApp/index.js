require('dotenv').config()
const  { Client, GatewayIntentBits, Message } =require( 'discord.js')
const client = new Client({ 
    intents:
     [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]
     });


 client.on('messageCreate',(message) => {
    if (message.author.bot) return;
    if (message.content.startsWith('create')) {
        const url = message.content.split('create')[1]
        return message.reply (
            {
                content:"Generatinting Short ID for " + url
            }
        )
    }
        message.reply({content:'Hi from Bot'})

 })


 client.on('interactionCreate',(Intersection)=>{
  
    console.log(Intersection);
    Intersection.reply("Pong!")
    
 })


client.login(
    process.env.MY_TOKEN
);