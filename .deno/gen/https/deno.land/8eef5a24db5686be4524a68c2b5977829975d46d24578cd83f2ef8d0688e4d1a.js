import { basename } from 'https://deno.land/std@0.87.0/path/mod.ts';
export * from 'https://cdn.skypack.dev/@grammyjs/types@v2.0.2?dts';
import debug from 'https://cdn.skypack.dev/debug@^4.3.1';
export { debug };
const isDeno = typeof Deno !== 'undefined';
if (isDeno) {
    debug.useColors = () => true;
    const env = { name: 'env', variable: 'DEBUG' };
    let res = await Deno.permissions.query(env);
    if (res.state === 'prompt')
        res = await Deno.permissions.request(env);
    if (res.state === 'granted') {
        const val = Deno.env.get(env.variable);
        if (val)
            debug.enable(val);
    }
}
export { readableStreamFromAsyncIterator as itrToStream } from 'https://deno.land/std@0.87.0/io/streams.ts';
export const streamFile = isDeno
    ? (path) => Deno.open(path).then(Deno.iter)
    : (() => {
        throw new Error('Reading files by path requires a Deno environment');
    })();
export const baseFetchConfig = {};
export class InputFile {
    constructor(file, filename) {
        this.file = file;
        if (filename === undefined && typeof file === 'string')
            filename = basename(file);
        this.filename = filename;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwbGF0Zm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMENBQTBDLENBQUE7QUFFbkUsY0FBYyxvREFBb0QsQ0FBQTtBQUVsRSxPQUFPLEtBQUssTUFBTSxzQ0FBc0MsQ0FBQTtBQUN4RCxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUE7QUFFaEIsTUFBTSxNQUFNLEdBQUcsT0FBTyxJQUFJLEtBQUssV0FBVyxDQUFBO0FBRTFDLElBQUksTUFBTSxFQUFFO0lBQ1IsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUE7SUFDNUIsTUFBTSxHQUFHLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQVcsQ0FBQTtJQUN2RCxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzNDLElBQUksR0FBRyxDQUFDLEtBQUssS0FBSyxRQUFRO1FBQUUsR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDckUsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtRQUN6QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDdEMsSUFBSSxHQUFHO1lBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUM3QjtDQUNKO0FBR0QsT0FBTyxFQUFFLCtCQUErQixJQUFJLFdBQVcsRUFBRSxNQUFNLDRDQUE0QyxDQUFBO0FBRTNHLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyxNQUFNO0lBQzVCLENBQUMsQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7UUFDRixNQUFNLElBQUksS0FBSyxDQUFDLG1EQUFtRCxDQUFDLENBQUE7SUFDeEUsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtBQUdWLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUE7QUFHakMsTUFBTSxPQUFPLFNBQVM7SUFRbEIsWUFDb0IsSUFJZ0IsRUFDaEMsUUFBaUI7UUFMRCxTQUFJLEdBQUosSUFBSSxDQUlZO1FBR2hDLElBQUksUUFBUSxLQUFLLFNBQVMsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRO1lBQ2xELFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7SUFDNUIsQ0FBQztDQUNKIn0=