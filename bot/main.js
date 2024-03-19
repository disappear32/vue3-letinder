import { Telegraf } from 'telegraf'

const TOKEN = '5834832230:AAHp1LjUCh1w8vx_V31FM1BLV27y7CIRxRI'
const WEB_APP_URL = "https://0b65-92-100-82-53.ngrok-free.app/vue3-letinder/";
const bot = new Telegraf(TOKEN)

bot.on("message", ctx => {
    ctx.reply("Hi there!", {
        reply_markup: {
            inline_keyboard: [
                [ { text: "Launch", web_app: { url: WEB_APP_URL } } ]
            ]
        }
    });

})

await bot.launch();
