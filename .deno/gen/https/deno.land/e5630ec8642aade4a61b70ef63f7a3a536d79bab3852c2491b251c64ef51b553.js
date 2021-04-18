import { createRawApi, } from './client.ts';
export class Api {
    constructor(token, config, webhookReplyEnvelope) {
        const { raw, use, installedTransformers } = createRawApi(token, config, webhookReplyEnvelope);
        this.raw = raw;
        this.config = {
            use,
            installedTransformers: () => [...installedTransformers],
        };
    }
    getUpdates(other, signal) {
        return this.raw.getUpdates({ ...other }, signal);
    }
    setWebhook(url, other, signal) {
        return this.raw.setWebhook({ url, ...other }, signal);
    }
    deleteWebhook(other, signal) {
        return this.raw.deleteWebhook({ ...other }, signal);
    }
    getWebhookInfo(signal) {
        return this.raw.getWebhookInfo(signal);
    }
    getMe(signal) {
        return this.raw.getMe(signal);
    }
    logOut(signal) {
        return this.raw.logOut(signal);
    }
    close(signal) {
        return this.raw.close(signal);
    }
    sendMessage(chat_id, text, other, signal) {
        return this.raw.sendMessage({ chat_id, text, ...other }, signal);
    }
    forwardMessage(chat_id, from_chat_id, message_id, other, signal) {
        return this.raw.forwardMessage({
            chat_id,
            from_chat_id,
            message_id,
            ...other,
        }, signal);
    }
    copyMessage(chat_id, from_chat_id, message_id, other, signal) {
        return this.raw.copyMessage({
            chat_id,
            from_chat_id,
            message_id,
            ...other,
        }, signal);
    }
    sendPhoto(chat_id, photo, other, signal) {
        return this.raw.sendPhoto({ chat_id, photo, ...other }, signal);
    }
    sendAudio(chat_id, audio, other, signal) {
        return this.raw.sendAudio({ chat_id, audio, ...other }, signal);
    }
    sendDocument(chat_id, document, other, signal) {
        return this.raw.sendDocument({ chat_id, document, ...other }, signal);
    }
    sendVideo(chat_id, video, other, signal) {
        return this.raw.sendVideo({ chat_id, video, ...other }, signal);
    }
    sendAnimation(chat_id, animation, other, signal) {
        return this.raw.sendAnimation({ chat_id, animation, ...other }, signal);
    }
    sendVoice(chat_id, voice, other, signal) {
        return this.raw.sendVoice({ chat_id, voice, ...other }, signal);
    }
    sendVideoNote(chat_id, video_note, other, signal) {
        return this.raw.sendVideoNote({ chat_id, video_note, ...other }, signal);
    }
    sendMediaGroup(chat_id, media, other, signal) {
        return this.raw.sendMediaGroup({ chat_id, media, ...other }, signal);
    }
    sendLocation(chat_id, latitude, longitude, other, signal) {
        return this.raw.sendLocation({ chat_id, latitude, longitude, ...other }, signal);
    }
    editMessageLiveLocation(chat_id, message_id, latitude, longitude, other, signal) {
        return this.raw.editMessageLiveLocation({
            chat_id,
            message_id,
            latitude,
            longitude,
            ...other,
        }, signal);
    }
    editMessageLiveLocationInline(inline_message_id, latitude, longitude, other, signal) {
        return this.raw.editMessageLiveLocation({
            inline_message_id,
            latitude,
            longitude,
            ...other,
        }, signal);
    }
    stopMessageLiveLocation(chat_id, message_id, other, signal) {
        return this.raw.stopMessageLiveLocation({
            chat_id,
            message_id,
            ...other,
        }, signal);
    }
    stopMessageLiveLocationInline(inline_message_id, other, signal) {
        return this.raw.stopMessageLiveLocation({ inline_message_id, ...other }, signal);
    }
    sendVenue(chat_id, latitude, longitude, title, address, other, signal) {
        return this.raw.sendVenue({
            chat_id,
            latitude,
            longitude,
            title,
            address,
            ...other,
        }, signal);
    }
    sendContact(chat_id, phone_number, first_name, other, signal) {
        return this.raw.sendContact({
            chat_id,
            phone_number,
            first_name,
            ...other,
        }, signal);
    }
    sendPoll(chat_id, question, options, other, signal) {
        return this.raw.sendPoll({ chat_id, question, options, ...other }, signal);
    }
    sendDice(chat_id, emoji, other, signal) {
        return this.raw.sendDice({ chat_id, emoji, ...other }, signal);
    }
    sendChatAction(chat_id, action, signal) {
        return this.raw.sendChatAction({ chat_id, action }, signal);
    }
    getUserProfilePhotos(user_id, other, signal) {
        return this.raw.getUserProfilePhotos({ user_id, ...other }, signal);
    }
    getFile(file_id, signal) {
        return this.raw.getFile({ file_id }, signal);
    }
    kickChatMember(chat_id, user_id, other, signal) {
        return this.raw.kickChatMember({ chat_id, user_id, ...other }, signal);
    }
    unbanChatMember(chat_id, user_id, other, signal) {
        return this.raw.unbanChatMember({ chat_id, user_id, ...other }, signal);
    }
    restrictChatMember(chat_id, user_id, permissions, other, signal) {
        return this.raw.restrictChatMember({
            chat_id,
            user_id,
            permissions,
            ...other,
        }, signal);
    }
    promoteChatMember(chat_id, user_id, other, signal) {
        return this.raw.promoteChatMember({ chat_id, user_id, ...other }, signal);
    }
    setChatAdministratorCustomTitle(chat_id, user_id, custom_title, signal) {
        return this.raw.setChatAdministratorCustomTitle({
            chat_id,
            user_id,
            custom_title,
        }, signal);
    }
    setChatPermissions(chat_id, permissions, signal) {
        return this.raw.setChatPermissions({ chat_id, permissions }, signal);
    }
    exportChatInviteLink(chat_id, signal) {
        return this.raw.exportChatInviteLink({ chat_id }, signal);
    }
    createChatInviteLink(chat_id, other, signal) {
        return this.raw.createChatInviteLink({ chat_id, ...other }, signal);
    }
    editChatInviteLink(chat_id, invite_link, other, signal) {
        return this.raw.editChatInviteLink({ chat_id, invite_link, ...other }, signal);
    }
    revokeChatInviteLink(chat_id, invite_link, signal) {
        return this.raw.revokeChatInviteLink({ chat_id, invite_link }, signal);
    }
    setChatPhoto(chat_id, photo, signal) {
        return this.raw.setChatPhoto({ chat_id, photo }, signal);
    }
    deleteChatPhoto(chat_id, signal) {
        return this.raw.deleteChatPhoto({ chat_id }, signal);
    }
    setChatTitle(chat_id, title, signal) {
        return this.raw.setChatTitle({ chat_id, title }, signal);
    }
    setChatDescription(chat_id, description, signal) {
        return this.raw.setChatDescription({ chat_id, description }, signal);
    }
    pinChatMessage(chat_id, message_id, other, signal) {
        return this.raw.pinChatMessage({ chat_id, message_id, ...other }, signal);
    }
    unpinChatMessage(chat_id, message_id, signal) {
        return this.raw.unpinChatMessage({ chat_id, message_id }, signal);
    }
    unpinAllChatMessages(chat_id, signal) {
        return this.raw.unpinAllChatMessages({ chat_id }, signal);
    }
    leaveChat(chat_id, signal) {
        return this.raw.leaveChat({ chat_id }, signal);
    }
    getChat(chat_id, signal) {
        return this.raw.getChat({ chat_id }, signal);
    }
    getChatAdministrators(chat_id, signal) {
        return this.raw.getChatAdministrators({ chat_id }, signal);
    }
    getChatMembersCount(chat_id, signal) {
        return this.raw.getChatMembersCount({ chat_id }, signal);
    }
    getChatMember(chat_id, user_id, signal) {
        return this.raw.getChatMember({ chat_id, user_id }, signal);
    }
    setChatStickerSet(chat_id, sticker_set_name, signal) {
        return this.raw.setChatStickerSet({
            chat_id,
            sticker_set_name,
        }, signal);
    }
    deleteChatStickerSet(chat_id, signal) {
        return this.raw.deleteChatStickerSet({ chat_id }, signal);
    }
    answerCallbackQuery(callback_query_id, other, signal) {
        return this.raw.answerCallbackQuery({ callback_query_id, ...other }, signal);
    }
    setMyCommands(commands, signal) {
        return this.raw.setMyCommands({ commands }, signal);
    }
    getMyCommands(signal) {
        return this.raw.getMyCommands(signal);
    }
    editMessageText(chat_id, message_id, text, other, signal) {
        return this.raw.editMessageText({ chat_id, message_id, text, ...other }, signal);
    }
    editMessageTextInline(inline_message_id, text, other, signal) {
        return this.raw.editMessageText({ inline_message_id, text, ...other }, signal);
    }
    editMessageCaption(chat_id, message_id, other, signal) {
        return this.raw.editMessageCaption({ chat_id, message_id, ...other }, signal);
    }
    editMessageCaptionInline(inline_message_id, other, signal) {
        return this.raw.editMessageCaption({ inline_message_id, ...other }, signal);
    }
    editMessageMedia(chat_id, message_id, media, other, signal) {
        return this.raw.editMessageMedia({
            chat_id,
            message_id,
            media,
            ...other,
        }, signal);
    }
    editMessageMediaInline(inline_message_id, media, other, signal) {
        return this.raw.editMessageMedia({ inline_message_id, media, ...other }, signal);
    }
    editMessageReplyMarkup(chat_id, message_id, other, signal) {
        return this.raw.editMessageReplyMarkup({
            chat_id,
            message_id,
            ...other,
        }, signal);
    }
    editMessageReplyMarkupInline(inline_message_id, other, signal) {
        return this.raw.editMessageReplyMarkup({ inline_message_id, ...other }, signal);
    }
    stopPoll(chat_id, message_id, other, signal) {
        return this.raw.stopPoll({ chat_id, message_id, ...other }, signal);
    }
    deleteMessage(chat_id, message_id, signal) {
        return this.raw.deleteMessage({ chat_id, message_id }, signal);
    }
    sendSticker(chat_id, sticker, other, signal) {
        return this.raw.sendSticker({ chat_id, sticker, ...other }, signal);
    }
    getStickerSet(name, signal) {
        return this.raw.getStickerSet({ name }, signal);
    }
    uploadStickerFile(user_id, png_sticker, signal) {
        return this.raw.uploadStickerFile({ user_id, png_sticker }, signal);
    }
    createNewStickerSet(user_id, name, title, emojis, other, signal) {
        return this.raw.createNewStickerSet({
            user_id,
            name,
            title,
            emojis,
            ...other,
        }, signal);
    }
    addStickerToSet(user_id, name, emojis, other, signal) {
        return this.raw.addStickerToSet({ user_id, name, emojis, ...other }, signal);
    }
    setStickerPositionInSet(sticker, position, signal) {
        return this.raw.setStickerPositionInSet({ sticker, position }, signal);
    }
    deleteStickerFromSet(sticker, signal) {
        return this.raw.deleteStickerFromSet({ sticker }, signal);
    }
    setStickerSetThumb(name, user_id, thumb, signal) {
        return this.raw.setStickerSetThumb({ name, user_id, thumb }, signal);
    }
    answerInlineQuery(inline_query_id, results, other, signal) {
        return this.raw.answerInlineQuery({
            inline_query_id,
            results,
            ...other,
        }, signal);
    }
    sendInvoice(chat_id, title, description, payload, provider_token, start_parameter, currency, prices, other, signal) {
        return this.raw.sendInvoice({
            chat_id,
            title,
            description,
            payload,
            provider_token,
            start_parameter,
            currency,
            prices,
            ...other,
        }, signal);
    }
    answerShippingQuery(shipping_query_id, ok, other, signal) {
        return this.raw.answerShippingQuery({ shipping_query_id, ok, ...other }, signal);
    }
    answerPreCheckoutQuery(pre_checkout_query_id, ok, other, signal) {
        return this.raw.answerPreCheckoutQuery({
            pre_checkout_query_id,
            ok,
            ...other,
        }, signal);
    }
    setPassportDataErrors(user_id, errors, signal) {
        return this.raw.setPassportDataErrors({ user_id, errors }, signal);
    }
    sendGame(chat_id, game_short_name, other, signal) {
        return this.raw.sendGame({ chat_id, game_short_name, ...other }, signal);
    }
    setGameScore(chat_id, message_id, user_id, score, other, signal) {
        return this.raw.setGameScore({
            chat_id,
            message_id,
            user_id,
            score,
            ...other,
        }, signal);
    }
    setGameScoreInline(inline_message_id, user_id, score, other, signal) {
        return this.raw.setGameScore({
            inline_message_id,
            user_id,
            score,
            ...other,
        }, signal);
    }
    getGameHighScores(chat_id, message_id, user_id, signal) {
        return this.raw.getGameHighScores({
            chat_id,
            message_id,
            user_id,
        }, signal);
    }
    getGameHighScoresInline(inline_message_id, user_id, signal) {
        return this.raw.getGameHighScores({
            inline_message_id,
            user_id,
        }, signal);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWVBLE9BQU8sRUFDSCxZQUFZLEdBTWYsTUFBTSxhQUFhLENBQUE7QUE2QnBCLE1BQU0sT0FBTyxHQUFHO0lBc0NaLFlBQ0ksS0FBYSxFQUNiLE1BQXlCLEVBQ3pCLG9CQUEyQztRQUUzQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxxQkFBcUIsRUFBRSxHQUFHLFlBQVksQ0FDcEQsS0FBSyxFQUNMLE1BQU0sRUFDTixvQkFBb0IsQ0FDdkIsQ0FBQTtRQUNELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNWLEdBQUc7WUFDSCxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcscUJBQXFCLENBQUM7U0FDMUQsQ0FBQTtJQUNMLENBQUM7SUFjRCxVQUFVLENBQUMsS0FBMkIsRUFBRSxNQUFvQjtRQUN4RCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0lBb0JELFVBQVUsQ0FDTixHQUFXLEVBQ1gsS0FBa0MsRUFDbEMsTUFBb0I7UUFFcEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQ3pELENBQUM7SUFVRCxhQUFhLENBQUMsS0FBOEIsRUFBRSxNQUFvQjtRQUM5RCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsR0FBRyxLQUFLLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUN2RCxDQUFDO0lBU0QsY0FBYyxDQUFDLE1BQW9CO1FBQy9CLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsTUFBTSxD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