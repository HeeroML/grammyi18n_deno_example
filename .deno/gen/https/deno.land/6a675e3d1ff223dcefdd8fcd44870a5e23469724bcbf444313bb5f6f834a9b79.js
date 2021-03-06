import { createHash } from "../../hash/mod.ts";
import { Buffer } from "../buffer.ts";
import { MAX_ALLOC } from "./constants.ts";
function createHasher(alg) {
    let normalizedAlg;
    if (alg === "rmd160") {
        normalizedAlg = "ripemd160";
    }
    else {
        normalizedAlg = alg;
    }
    return (value) => Buffer.from(createHash(normalizedAlg).update(value).digest());
}
function getZeroes(zeros) {
    return Buffer.alloc(zeros);
}
const sizes = {
    md5: 16,
    sha1: 20,
    sha224: 28,
    sha256: 32,
    sha384: 48,
    sha512: 64,
    rmd160: 20,
    ripemd160: 20,
};
function toBuffer(bufferable) {
    if (bufferable instanceof Uint8Array || typeof bufferable === "string") {
        return Buffer.from(bufferable);
    }
    else {
        return Buffer.from(bufferable.buffer);
    }
}
class Hmac {
    constructor(alg, key, saltLen) {
        this.hash = createHasher(alg);
        const blocksize = (alg === "sha512" || alg === "sha384") ? 128 : 64;
        if (key.length > blocksize) {
            key = this.hash(key);
        }
        else if (key.length < blocksize) {
            key = Buffer.concat([key, getZeroes(blocksize - key.length)], blocksize);
        }
        const ipad = Buffer.allocUnsafe(blocksize + sizes[alg]);
        const opad = Buffer.allocUnsafe(blocksize + sizes[alg]);
        for (let i = 0; i < blocksize; i++) {
            ipad[i] = key[i] ^ 0x36;
            opad[i] = key[i] ^ 0x5C;
        }
        const ipad1 = Buffer.allocUnsafe(blocksize + saltLen + 4);
        ipad.copy(ipad1, 0, 0, blocksize);
        this.ipad1 = ipad1;
        this.ipad2 = ipad;
        this.opad = opad;
        this.alg = alg;
        this.blocksize = blocksize;
        this.size = sizes[alg];
    }
    run(data, ipad) {
        data.copy(ipad, this.blocksize);
        const h = this.hash(ipad);
        h.copy(this.opad, this.blocksize);
        return this.hash(this.opad);
    }
}
export function pbkdf2Sync(password, salt, iterations, keylen, digest = "sha1") {
    if (typeof iterations !== "number" || iterations < 0) {
        throw new TypeError("Bad iterations");
    }
    if (typeof keylen !== "number" || keylen < 0 || keylen > MAX_ALLOC) {
        throw new TypeError("Bad key length");
    }
    const bufferedPassword = toBuffer(password);
    const bufferedSalt = toBuffer(salt);
    const hmac = new Hmac(digest, bufferedPassword, bufferedSalt.length);
    const DK = Buffer.allocUnsafe(keylen);
    const block1 = Buffer.allocUnsafe(bufferedSalt.length + 4);
    bufferedSalt.copy(block1, 0, 0, bufferedSalt.length);
    let destPos = 0;
    const hLen = sizes[digest];
    const l = Math.ceil(keylen / hLen);
    for (let i = 1; i <= l; i++) {
        block1.writeUInt32BE(i, bufferedSalt.length);
        const T = hmac.run(block1, hmac.ipad1);
        let U = T;
        for (let j = 1; j < iterations; j++) {
            U = hmac.run(U, hmac.ipad2);
            for (let k = 0; k < hLen; k++)
                T[k] ^= U[k];
        }
        T.copy(DK, destPos);
        destPos += hLen;
    }
    return DK;
}
export function pbkdf2(password, salt, iterations, keylen, digest = "sha1", callback) {
    setTimeout(() => {
        let err = null, res;
        try {
            res = pbkdf2Sync(password, salt, iterations, keylen, digest);
        }
        catch (e) {
            err = e;
        }
        if (err) {
            callback(err);
        }
        else {
            callback(null, res);
        }
    }, 0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGJrZGYyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGJrZGYyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQXNCM0MsU0FBUyxZQUFZLENBQUMsR0FBZTtJQUNuQyxJQUFJLGFBQW1DLENBQUM7SUFDeEMsSUFBSSxHQUFHLEtBQUssUUFBUSxFQUFFO1FBQ3BCLGFBQWEsR0FBRyxXQUFXLENBQUM7S0FDN0I7U0FBTTtRQUNMLGFBQWEsR0FBRyxHQUFHLENBQUM7S0FDckI7SUFDRCxPQUFPLENBQUMsS0FBaUIsRUFBRSxFQUFFLENBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxLQUFhO0lBQzlCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QixDQUFDO0FBQ0QsTUFBTSxLQUFLLEdBQUc7SUFDWixHQUFHLEVBQUUsRUFBRTtJQUNQLElBQUksRUFBRSxFQUFFO0lBQ1IsTUFBTSxFQUFFLEVBQUU7SUFDVixNQUFNLEVBQUUsRUFBRTtJQUNWLE1BQU0sRUFBRSxFQUFFO0lBQ1YsTUFBTSxFQUFFLEVBQUU7SUFDVixNQUFNLEVBQUUsRUFBRTtJQUNWLFNBQVMsRUFBRSxFQUFFO0NBQ2QsQ0FBQztBQUVGLFNBQVMsUUFBUSxDQUFDLFVBQXFCO0lBQ3JDLElBQUksVUFBVSxZQUFZLFVBQVUsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDdEUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXdCLENBQUMsQ0FBQztLQUM5QztTQUFNO1FBQ0wsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN2QztBQUNILENBQUM7QUFFRCxNQUFNLElBQUk7SUFTUixZQUFZLEdBQWUsRUFBRSxHQUFXLEVBQUUsT0FBZTtRQUN2RCxJQUFJLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU5QixNQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUVwRSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsU0FBUyxFQUFFO1lBQzFCLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3RCO2FBQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLFNBQVMsRUFBRTtZQUNqQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQzFFO1FBRUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNsQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUN4QixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUN6QjtRQUVELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRWxDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELEdBQUcsQ0FBQyxJQUFZLEVBQUUsSUFBWTtRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztDQUNGO0FBT0QsTUFBTSxVQUFVLFVBQVUsQ0FDeEIsUUFBbUIsRUFDbkIsSUFBZSxFQUNmLFVBQWtCLEVBQ2xCLE1BQWMsRUFDZCxTQUFxQixNQUFNO0lBRTNCLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7UUFDcEQsTUFBTSxJQUFJLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxHQUFHLENBQUMsSUFBSSxNQUFNLEdBQUcsU0FBUyxFQUFFO1FBQ2xFLE1BQU0sSUFBSSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUN2QztJQUVELE1BQU0sZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVwQyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXJFLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNELFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXJELElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNoQixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFbkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQixNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0MsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVWLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRTtnQkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdDO1FBRUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEIsT0FBTyxJQUFJLElBQUksQ0FBQztLQUNqQjtJQUVELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQztBQU9ELE1BQU0sVUFBVSxNQUFNLENBQ3BCLFFBQW1CLEVBQ25CLElBQWUsRUFDZixVQUFrQixFQUNsQixNQUFjLEVBQ2QsU0FBcUIsTUFBTSxFQUMzQixRQUE0RDtJQUU1RCxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsSUFBSSxHQUFHLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQztRQUNwQixJQUFJO1lBQ0YsR0FBRyxHQUFHLFVBQVUsQ0FDZCxRQUFRLEVBQ1IsSUFBSSxFQUNKLFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxDQUNQLENBQUM7U0FDSDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUNUO1FBQ0QsSUFBSSxHQUFHLEVBQUU7WUFDUCxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDZjthQUFNO1lBQ0wsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNyQjtJQUNILENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNSLENBQUMifQ==