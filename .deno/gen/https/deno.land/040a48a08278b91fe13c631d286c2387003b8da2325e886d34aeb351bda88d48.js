import { Buffer } from "./buffer.ts";
import { normalizeEncoding as castEncoding, notImplemented } from "./_utils.ts";
var NotImplemented;
(function (NotImplemented) {
    NotImplemented[NotImplemented["ascii"] = 0] = "ascii";
    NotImplemented[NotImplemented["latin1"] = 1] = "latin1";
    NotImplemented[NotImplemented["utf16le"] = 2] = "utf16le";
})(NotImplemented || (NotImplemented = {}));
function normalizeEncoding(enc) {
    const encoding = castEncoding(enc ?? null);
    if (encoding && encoding in NotImplemented)
        notImplemented(encoding);
    if (!encoding && typeof enc === "string" && enc.toLowerCase() !== "raw") {
        throw new Error(`Unknown encoding: ${enc}`);
    }
    return String(encoding);
}
function utf8CheckByte(byte) {
    if (byte <= 0x7f)
        return 0;
    else if (byte >> 5 === 0x06)
        return 2;
    else if (byte >> 4 === 0x0e)
        return 3;
    else if (byte >> 3 === 0x1e)
        return 4;
    return byte >> 6 === 0x02 ? -1 : -2;
}
function utf8CheckIncomplete(self, buf, i) {
    let j = buf.length - 1;
    if (j < i)
        return 0;
    let nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0)
            self.lastNeed = nb - 1;
        return nb;
    }
    if (--j < i || nb === -2)
        return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0)
            self.lastNeed = nb - 2;
        return nb;
    }
    if (--j < i || nb === -2)
        return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) {
            if (nb === 2)
                nb = 0;
            else
                self.lastNeed = nb - 3;
        }
        return nb;
    }
    return 0;
}
function utf8CheckExtraBytes(self, buf) {
    if ((buf[0] & 0xc0) !== 0x80) {
        self.lastNeed = 0;
        return "\ufffd";
    }
    if (self.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 0xc0) !== 0x80) {
            self.lastNeed = 1;
            return "\ufffd";
        }
        if (self.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 0xc0) !== 0x80) {
                self.lastNeed = 2;
                return "\ufffd";
            }
        }
    }
}
function utf8FillLastComplete(buf) {
    const p = this.lastTotal - this.lastNeed;
    const r = utf8CheckExtraBytes(this, buf);
    if (r !== undefined)
        return r;
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
}
function utf8FillLastIncomplete(buf) {
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
}
function utf8Text(buf, i) {
    const total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed)
        return buf.toString("utf8", i);
    this.lastTotal = total;
    const end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString("utf8", i, end);
}
function utf8End(buf) {
    const r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed)
        return r + "\ufffd";
    return r;
}
function utf8Write(buf) {
    if (typeof buf === "string") {
        return buf;
    }
    if (buf.length === 0)
        return "";
    let r;
    let i;
    if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === undefined)
            return "";
        i = this.lastNeed;
        this.lastNeed = 0;
    }
    else {
        i = 0;
    }
    if (i < buf.length)
        return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || "";
}
function base64Text(buf, i) {
    const n = (buf.length - i) % 3;
    if (n === 0)
        return buf.toString("base64", i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
    }
    else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString("base64", i, buf.length - n);
}
function base64End(buf) {
    const r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) {
        return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
    }
    return r;
}
function simpleWrite(buf) {
    if (typeof buf === "string") {
        return buf;
    }
    return buf.toString(this.encoding);
}
function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : "";
}
class StringDecoderBase {
    constructor(encoding, nb) {
        this.encoding = encoding;
        this.lastNeed = 0;
        this.lastTotal = 0;
        this.lastChar = Buffer.allocUnsafe(nb);
    }
}
class Base64Decoder extends StringDecoderBase {
    constructor(encoding) {
        super(normalizeEncoding(encoding), 3);
        this.end = base64End;
        this.fillLast = utf8FillLastIncomplete;
        this.text = base64Text;
        this.write = utf8Write;
    }
}
class GenericDecoder extends StringDecoderBase {
    constructor(encoding) {
        super(normalizeEncoding(encoding), 4);
        this.end = simpleEnd;
        this.fillLast = undefined;
        this.text = utf8Text;
        this.write = simpleWrite;
    }
}
class Utf8Decoder extends StringDecoderBase {
    constructor(encoding) {
        super(normalizeEncoding(encoding), 4);
        this.end = utf8End;
        this.fillLast = utf8FillLastComplete;
        this.text = utf8Text;
        this.write = utf8Write;
    }
}
export class StringDecoder {
    constructor(encoding) {
        let decoder;
        switch (encoding) {
            case "utf8":
                decoder = new Utf8Decoder(encoding);
                break;
            case "base64":
                decoder = new Base64Decoder(encoding);
                break;
            default:
                decoder = new GenericDecoder(encoding);
        }
        this.encoding = decoder.encoding;
        this.end = decoder.end;
        this.fillLast = decoder.fillLast;
        this.lastChar = decoder.lastChar;
        this.lastNeed = decoder.lastNeed;
        this.lastTotal = decoder.lastTotal;
        this.text = decoder.text;
        this.write = decoder.write;
    }
}
export default { StringDecoder };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nX2RlY29kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdHJpbmdfZGVjb2Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFxQkEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUUsaUJBQWlCLElBQUksWUFBWSxFQUFFLGNBQWMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVoRixJQUFLLGNBSUo7QUFKRCxXQUFLLGNBQWM7SUFDakIscURBQU8sQ0FBQTtJQUNQLHVEQUFRLENBQUE7SUFDUix5REFBUyxDQUFBO0FBQ1gsQ0FBQyxFQUpJLGNBQWMsS0FBZCxjQUFjLFFBSWxCO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxHQUFZO0lBQ3JDLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUM7SUFDM0MsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJLGNBQWM7UUFBRSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckUsSUFBSSxDQUFDLFFBQVEsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssRUFBRTtRQUN2RSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQzdDO0lBQ0QsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUtELFNBQVMsYUFBYSxDQUFDLElBQVk7SUFDakMsSUFBSSxJQUFJLElBQUksSUFBSTtRQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3RCLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJO1FBQUUsT0FBTyxDQUFDLENBQUM7U0FDakMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUk7UUFBRSxPQUFPLENBQUMsQ0FBQztTQUNqQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSTtRQUFFLE9BQU8s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LENBQUMsS0FBSyxTQUFTO1FBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUU7UUFDL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2pFO0lBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLElBQUksQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUM5QixDQUFDO0FBS0QsU0FBUyxzQkFBc0IsQ0FFN0IsR0FBVztJQUVYLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO1FBQy9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNqRTtJQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RSxJQUFJLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFDOUIs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