import * as hex from "../encoding/hex.ts";
import * as base64 from "../encoding/base64.ts";
import { normalizeEncoding, notImplemented } from "./_utils.ts";
const notImplementedEncodings = [
    "ascii",
    "binary",
    "latin1",
    "ucs2",
    "utf16le",
];
function checkEncoding(encoding = "utf8", strict = true) {
    if (typeof encoding !== "string" || (strict && encoding === "")) {
        if (!strict)
            return "utf8";
        throw new TypeError(`Unkown encoding: ${encoding}`);
    }
    const normalized = normalizeEncoding(encoding);
    if (normalized === undefined) {
        throw new TypeError(`Unkown encoding: ${encoding}`);
    }
    if (notImplementedEncodings.includes(encoding)) {
        notImplemented(`"${encoding}" encoding`);
    }
    return normalized;
}
const encodingOps = {
    utf8: {
        byteLength: (string) => new TextEncoder().encode(string).byteLength,
    },
    ucs2: {
        byteLength: (string) => string.length * 2,
    },
    utf16le: {
        byteLength: (string) => string.length * 2,
    },
    latin1: {
        byteLength: (string) => string.length,
    },
    ascii: {
        byteLength: (string) => string.length,
    },
    base64: {
        byteLength: (string) => base64ByteLength(string, string.length),
    },
    hex: {
        byteLength: (string) => string.length >>> 1,
    },
};
function base64ByteLength(str, bytes) {
    if (str.charCodeAt(bytes - 1) === 0x3d)
        bytes--;
    if (bytes > 1 && str.charCodeAt(bytes - 1) === 0x3d)
        bytes--;
    return (bytes * 3) >>> 2;
}
export class Buffer extends Uint8Array {
    static alloc(size, fill, encoding = "utf8") {
        if (typeof size !== "number") {
            throw new TypeError(`The "size" argument must be of type number. Received type ${typeof size}`);
        }
        const buf = new Buffer(size);
        if (size === 0)
            return buf;
        let bufFill;
        if (typeof fill === "string") {
            const clearEncoding = checkEncoding(encoding);
            if (typeof fill === "string" &&
                fill.length === 1 &&
                clearEncoding === "utf8") {
                buf.fill(fill.charCodeAt(0));
            }
            else
                bufFill = Buffer.from(fill, clearEncoding);
        }
        else if (typeof fill === "number") {
            buf.fill(fill);
        }
        else if (fill instanceof Uint8Array) {
            if (fill.length === 0) {
                throw new TypeError(`The argument "value" is invalid. Received ${fill.constructor.name} []`);
            }
            bufFill = fill;
        }
        if (bufFill) {
            if (bufFill.length > buf.length) {
                bufFill = bufFill.subarray(0, buf.length);
            }
            let offset = 0;
            while (offset < size) {
                buf.set(bufFill, offset);
                offset += bufFill.length;
                if (offset + bufFill.length >= size)
                    break;
            }
            if (offset !== size) {
                buf.set(bufFill.subarray(0, size - offset), offset);
            }
        }
        return buf;
    }
    static allocUnsafe(size) {
        return new Buffer(size);
    }
    static byteLength(string, encoding = "utf8") {
        if (typeof string != "string")
            return string.byteLength;
        encoding = normalizeEncoding(encoding) || "utf8";
        return encodingOps[encoding].byteLength(string);
    }
    static concat(list, totalLength) {
        if (totalLength == undefined) {
            totalLength = 0;
            for (const buf of list) {
                totalLength += buf.length;
            }
        }
        const buffer = Buffer.allocUnsafe(totalLength);
        let pos = 0;
        for (const item of list) {
            let buf;
            if (!(item instanceof Buffer)) {
                buf = Buffer.from(item);
            }
            else {
                buf = item;
            }
            buf.copy(buffer, pos);
            pos += buf.length;
        }
        return buffer;
    }
    static from(value, offsetOrEncoding, length) {
        const offset = typeof offsetOrEncoding === "string"
            ? undefined
            : offsetOrEncoding;
        let encoding = typeof offsetOrEncoding === "string"
            ? offsetOrEncoding
            : undefined;
        if (typeof value == "string") {
            encoding = checkEncoding(encoding, false);
            if (encoding === "hex")
                return new Buffer(hex.decodeString(value).buffer);
            if (encoding === "base64")
                return new Buffer(base64.decode(value).buffer);
            return new Buffer(new TextEncoder().encode(value).buffer);
        }
        return new Buffer(value, offset, length);
    }
    static isBuffer(obj) {
        return obj instanceof Buffer;
    }
    static isEncoding(encoding) {
        return (typeof encoding === "string" &&
            encoding.length !== 0 &&
            normalizeEncoding(encoding) !== undefined);
    }
    copy(targetBuffer, targetStart = 0, sourceStart = 0, sourceEnd = this.length) {
        const sourceBuffer = this
            .subarray(sourceStart, sourceEnd)
            .subarray(0, Math.max(0, targetBuffer.length - targetStart));
        if (sourceBuffer.length === 0)
            return 0;
        targetBuffer.set(sourceBuffer, targetStart);
        return sourceBuffer.length;
    }
    equals(otherBuffer) {
        if (!(otherBuffer instanceof Uint8Array)) {
            throw new TypeError(`The "otherBuffer" argument must be an instance of Buffer or Uint8Array. Received type ${typeof otherBuffer}`);
        }
        if (this === otherBuffer)
            return true;
        if (this.byteLength !== otherBuffer.byteLength)
            return false;
        for (let i = 0; i < this.length; i++) {
            if (this[i] !== otherBuffer[i])
                return false;
        }
        return true;
    }
    readBigInt64BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigInt64(offset);
    }
    readBigInt64LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigInt64(offset, true);
    }
    readBigUInt64BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigUint64(offset);
    }
    readBigUInt64LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigUint64(offset, true);
    }
    readDoubleBE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat64(offset);
    }
    readDoubleLE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat64(offset, true);
    }
    readFloatBE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat32(offset);
    }
    readFloatLE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat32(offset, true);
    }
    readInt8(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt8(offset);
    }
    readInt16BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt16(offset);
    }
    readInt16LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt16(offset, true);
    }
    readInt32BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt32(offset);
    }
    readInt32LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt32(offset, true);
    }
    readUInt8(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint8(offset);
    }
    readUInt16BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint16(offset);
    }
    readUInt16LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint16(offset, true);
    }
    readUInt32BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint32(offset);
    }
    readUInt32LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint32(offset, true);
    }
    slice(begin = 0, end = this.length) {
        return this.subarray(begin, end);
    }
    toJSON() {
        return { type: "Buffer", data: Array.from(this) };
    }
    toString(encoding = "utf8", start = 0, end = this.length) {
        encoding = checkEncoding(encoding);
        const b = this.subarray(start, end);
        if (encoding === "hex")
            return hex.encodeToString(b);
        if (encoding === "base64")
            return base64.encode(b.buffer);
        return new TextDecoder(encoding).decode(b);
    }
    write(string, offset = 0, length = this.length) {
        return new TextEncoder().encodeInto(string, this.subarray(offset, offset + length)).written;
    }
    writeBigInt64BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigInt64(offset, value);
        return offset + 4;
    }
    writeBigInt64LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigInt64(offset, value, true);
        return offset + 4;
    }
    writeBigUInt64BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigUint64(offset, value);
        return offset + 4;
    }
    writeBigUInt64LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigUint64(offset, value, true);
        return offset + 4;
    }
    writeDoubleBE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat64(offset, value);
        return offset + 8;
    }
    writeDoubleLE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat64(offset, value, true);
        return offset + 8;
    }
    writeFloatBE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat32(offset, value);
        return offset + 4;
    }
    writeFloatLE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat32(offset, value, true);
        return offset + 4;
    }
    writeInt8(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt8(offset, value);
        return offset + 1;
    }
    writeInt16BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt16(offset, value);
        return offset + 2;
    }
    writeInt16LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt16(offset, value, true);
        return offset + 2;
    }
    writeInt32BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value);
        return offset + 4;
    }
    writeInt32LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt32(offset, value, true);
        return offset + 4;
    }
    writeUInt8(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint8(offset, value);
        return offset + 1;
    }
    writeUInt16BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint16(offset, value);
        return offset + 2;
    }
    writeUInt16LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint16(offset, value, true);
        return offset + 2;
    }
    writeUInt32BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value);
        return offset + 4;
    }
    writeUInt32LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value, true);
        return offset + 4;
    }
}
export default { Buffer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVmZmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sS0FBSyxHQUFHLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxLQUFLLE1BQU0sTUFBTSx1QkFBdUIsQ0FBQztBQUNoRCxPQUFPLEVBQWEsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRTNFLE1BQU0sdUJBQXVCLEdBQUc7SUFDOUIsT0FBTztJQUNQLFFBQVE7SUFDUixRQUFRO0lBQ1IsTUFBTTtJQUNOLFNBQVM7Q0FDVixDQUFDO0FBRUYsU0FBUyxhQUFhLENBQUMsUUFBUSxHQUFHLE1BQU0sRUFBRSxNQUFNLEdBQUcsSUFBSTtJQUNyRCxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRLEtBQUssRUFBRSxDQUFDLEVBQUU7UUFDL0QsSUFBSSxDQUFDLE1BQU07WUFBRSxPQUFPLE1BQU0sQ0FBQztRQUMzQixNQUFNLElBQUksU0FBUyxDQUFDLG9CQUFvQixRQUFRLEVBQUUsQ0FBQyxDQUFDO0tBQ3JEO0lBRUQsTUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFL0MsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO1FBQzVCLE1BQU0sSUFBSSxTQUFTLENBQUMsb0JBQW9CLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDckQ7SUFFRCxJQUFJLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUM5QyxjQUFjLENBQUMsSUFBSSxRQUFRLFlBQVksQ0FBQyxDQUFDO0tBQzFDO0lBRUQsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQU9ELE1BQU0sV0FBVyxHQUFrQztJQUNqRCxJQUFJLEVBQUU7UUFDSixVQUFVLEVBQUUsQ0FBQyxNQUFjLEVBQVUsRUFBRSxDQUNyQyxJQUFJLFdBQVcsRUFBRSxDQUFDLE1B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