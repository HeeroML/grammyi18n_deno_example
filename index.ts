import {Bot, Context as GrammyContext, session} from 'https://deno.land/x/grammy/mod.ts'

import * as path from "https://deno.land/std@0.93.0/path/mod.ts";
import {I18n, I18nContext, pluralize} from "https://deno.land/x/grammy_i18n@v0.2.1/source/mod.ts"
export interface Session {
    message_id: number;
}

export interface MyContext extends GrammyContext {
    readonly i18n: I18nContext;
    session: Session;
    match: RegExpExecArray | undefined;
}

//i18n Options
export const i18n = new I18n({
    directory: './locales',
    defaultLanguage: 'en',
    sessionName: 'session',
    useSession: true,
    templateData: {
        pluralize,
        uppercase: (value: string) => value.toUpperCase()
    }
})

const token = Deno.env.get("BOT_TOKEN");
// Create an instance of the `Bot` class and pass your bot token to it.
// @ts-ignore
const bot = new Bot<MyContext>(token) // <-- put your bot token between the ''
bot.use(session({
  getSessionKey: (ctx) => ctx.chat?.id.toString()
}));
bot.use(i18n.middleware())

// You can now register listeners for on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// React to /start command
bot.command('start', (ctx) => ctx.reply(ctx.i18n.t('welcome')))
bot.command('session_test', (ctx) => {console.log('Session content: ' + ctx.session)
})

bot.command('lang_test', (ctx) => {
  ctx.i18n.locale('en');
ctx.reply('succesful')
})
// Handle other messages
bot.on('message', (ctx) => {
  ctx.reply(ctx.i18n.t('message'));
  console.log('A message ' + ctx.message.text)
})

// Now that you specified how to handle messages, ou can start your bot.
// This will connect to the Telegram servers and wait for messages.
bot.catch(e => (console.log(e)))
// Start your bot
bot.start().then(r => console.log(r)).catch(e => console.log(e))