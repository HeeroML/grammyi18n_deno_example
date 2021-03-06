export class Keyboard {
    constructor() {
        this.keyboard = [[]];
    }
    add(...buttons) {
        this.keyboard[this.keyboard.length - 1]?.push(...buttons);
        return this;
    }
    row(...buttons) {
        this.keyboard.push(buttons);
        return this;
    }
    text(text) {
        return this.add({ text });
    }
    requestContact(text) {
        return this.add({ text, request_contact: true });
    }
    requestLocation(text) {
        return this.add({ text, request_location: true });
    }
    requestPoll(text, type) {
        return this.add({ text, request_poll: { type } });
    }
    build() {
        return this.keyboard;
    }
}
export class InlineKeyboard {
    constructor() {
        this.inline_keyboard = [[]];
    }
    add(...buttons) {
        this.inline_keyboard[this.inline_keyboard.length - 1]?.push(...buttons);
        return this;
    }
    row(...buttons) {
        this.inline_keyboard.push(buttons);
        return this;
    }
    url(text, url) {
        return this.add({ text, url });
    }
    login(text, loginUrl) {
        return this.add({
            text,
            login_url: typeof loginUrl === 'string' ? { url: loginUrl } : loginUrl,
        });
    }
    text(text, data = text) {
        return this.add({ text, callback_data: data });
    }
    switchInline(text, query = '') {
        return this.add({ text, switch_inline_query: query });
    }
    switchInlineCurrent(text, query = '') {
        return this.add({ text, switch_inline_query_current_chat: query });
    }
    game(text) {
        return this.add({ text, callback_game: {} });
    }
    pay(text) {
        return this.add({ text, pay: true });
    }
    build() {
        return this.inline_keyboard;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrZXlib2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF5QkEsTUFBTSxPQUFPLFFBQVE7SUFBckI7UUFLb0IsYUFBUSxHQUF1QixDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBd0V2RCxDQUFDO0lBL0RHLEdBQUcsQ0FBQyxHQUFHLE9BQXlCO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUE7UUFDekQsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBV0QsR0FBRyxDQUFDLEdBQUcsT0FBeUI7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDM0IsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBT0QsSUFBSSxDQUFDLElBQVk7UUFDYixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQzdCLENBQUM7SUFPRCxjQUFjLENBQUMsSUFBWTtRQUN2QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDcEQsQ0FBQztJQU9ELGVBQWUsQ0FBQyxJQUFZO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQ3JELENBQUM7SUFTRCxXQUFXLENBQUMsSUFBWSxFQUFFLElBQXlCO1FBQy9DLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDckQsQ0FBQztJQUtELEtBQUs7UUFDRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7SUFDeEIsQ0FBQztDQUNKO0FBMEJELE1BQU0sT0FBTyxjQUFjO0lBQTNCO1FBS29CLG9CQUFlLEdBQTZCLENBQUMsRUFBRSxDQUFDLENBQUE7SUFvSXBFLENBQUM7SUEzSEcsR0FBRyxDQUFDLEdBQUcsT0FBK0I7UUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQTtRQUN2RSxPQUFPLElBQUksQ0FBQTtJQUNmLENBQUM7SUFXRCxHQUFHLENBQUMsR0FBRyxPQUErQjtRQUNsQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNsQyxPQUFPLElBQUksQ0FBQTtJQUNmLENBQUM7SUFRRCxHQUFHLENBQUMsSUFBWSxFQUFFLEdBQVc7UUFDekIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQVNELEtBQUssQ0FBQyxJQUFZLEVBQUUsUUFBMkI7UUFDM0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ1osSUFBSTtZQUNKLFNBQVMsRUFDTCxPQUFPLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRO1NBQ2xFLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFnQkQsSUFBSSxDQUFDLElBQVksRUFBRSxJQUFJLEdBQUcsSUFBSTtRQUMxQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDbEQsQ0FBQztJQWdCRCxZQUFZLENBQUMsSUFBWSxFQUFFLEtBQUssR0FBRyxFQUFFO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQ3pELENBQUM7SUFlRCxtQkFBbUIsQ0FBQyxJQUFZLEVBQUUsS0FBSyxHQUFHLEVBQUU7UUFDeEMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLGdDQUFnQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDdEUsQ0FBQztJQVFELElBQUksQ0FBQyxJQUFZO1FBQ2IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQ2hELENBQUM7SUFRRCxHQUFHLENBQUMsSUFBWTtRQUNaLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0lBS0QsS0FBSztRQUNELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQTtJQUMvQixDQUFDO0NBQ0oifQ==