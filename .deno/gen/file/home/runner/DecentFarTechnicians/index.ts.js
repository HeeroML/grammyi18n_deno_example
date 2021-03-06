import { Bot, session } from 'https://deno.land/x/grammy/mod.ts';
import { I18n, pluralize } from "https://deno.land/x/grammy_i18n@v0.2.1/source/mod.ts";
export const i18n = new I18n({
    directory: './locales',
    defaultLanguage: 'en',
    sessionName: 'session',
    useSession: true,
    templateData: {
        pluralize,
        uppercase: (value) => value.toUpperCase()
    }
});
const token = Deno.env.get("BOT_TOKEN");
const bot = new Bot(token);
bot.use(session({
    getSessionKey: (ctx) => ctx.chat?.id.toString()
}));
bot.use(i18n.middleware());
bot.command('start', (ctx) => ctx.reply(ctx.i18n.t('welcome')));
bot.command('session_test', (ctx) => {
    console.log('Session content: ' + ctx.session);
});
bot.command('lang_test', (ctx) => {
    ctx.i18n.locale('en');
    ctx.reply('succesful');
});
bot.on('message', (ctx) => {
    ctx.reply(ctx.i18n.t('message'));
    console.log('A message ' + ctx.message.text);
});
bot.catch(e => (console.log(e)));
bot.start().then(r => console.log(r)).catch(e => console.log(e));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsR0FBRyxFQUE0QixPQUFPLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQTtBQUd4RixPQUFPLEVBQUMsSUFBSSxFQUFlLFNBQVMsRUFBQyxNQUFNLHNEQUFzRCxDQUFBO0FBYWpHLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQztJQUN6QixTQUFTLEVBQUUsV0FBVztJQUN0QixlQUFlLEVBQUUsSUFBSTtJQUNyQixXQUFXLEVBQUUsU0FBUztJQUN0QixVQUFVLEVBQUUsSUFBSTtJQUNoQixZQUFZLEVBQUU7UUFDVixTQUFTO1FBQ1QsU0FBUyxFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO0tBQ3BEO0NBQ0osQ0FBQyxDQUFBO0FBRUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFHeEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQVksS0FBSyxDQUFDLENBQUE7QUFDckMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7SUFDZCxhQUFhLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRTtDQUNoRCxDQUFDLENBQUMsQ0FBQztBQUNKLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFNMUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9ELEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwRixDQUFDLENBQUMsQ0FBQTtBQUVGLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUN0QixDQUFDLENBQUMsQ0FBQTtBQUVGLEdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDeEIsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDOUMsQ0FBQyxDQUFDLENBQUE7QUFJRixHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUVoQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQSJ9