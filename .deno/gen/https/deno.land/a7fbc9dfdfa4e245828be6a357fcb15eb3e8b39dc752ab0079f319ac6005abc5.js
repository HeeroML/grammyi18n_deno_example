import { fmtFileSize, trimPath, fileExt, isStr } from './utils.ts';
const encoder = new TextEncoder();
export async function findFile({ path, collect, exclude, ignore, hasInfo, isFirst }) {
    let rs;
    try {
        rs = Deno.readDirSync(path);
    }
    catch (e) {
        await Deno.stderr.write(encoder.encode('NotFound: No such file or directory\n'));
        Deno.exit(-1);
    }
    path = trimPath(path);
    if (exclude && exclude.length) {
        let flag = false;
        exclude.some(i => {
            if (trimPath(i) === path) {
                flag = true;
                return true;
            }
        });
        if (flag)
            return;
    }
    for (const item of rs) {
        let _path = `${path}/${item.name}`;
        _path = trimPath(_path);
        if (item.isDirectory) {
            findFile({ path: _path, collect, exclude, ignore, hasInfo, isFirst: false });
        }
        else {
            const fExt = fileExt(item.name);
            let flag = false;
            if (ignore && ignore.length) {
                ignore.some(i => {
                    const regRule = (/^\*\./.test(i) && isFirst) || /\*\*\/\*\./.test(i);
                    if ((regRule && fExt && fExt === fileExt(i)) || trimPath(i) === _path) {
                        flag = true;
                        return true;
                    }
                });
            }
            let fileInfo = null;
            if (hasInfo) {
                const info = Deno.statSync(_path);
                fileInfo = {
                    ...info,
                    fmtSize: fmtFileSize(info.size),
                };
            }
            !flag && collect.push({
                path: _path,
                name: item.name,
                ext: fExt,
                realPath: Deno.realPathSync(_path),
                info: fileInfo,
            });
        }
    }
}
export function getFiles(opts) {
    const files = [];
    if (isStr(opts)) {
        findFile({ path: opts, collect: files });
    }
    else {
        const { root, include, exclude, ignore, hasInfo } = opts;
        if (root && include === undefined) {
            findFile({ path: root, collect: files, exclude, ignore, hasInfo, isFirst: true });
        }
        if (include && include.length === 0)
            return [];
        if (include) {
            include.forEach(dir => findFile({ path: dir, collect: files, ignore, exclude, hasInfo, isFirst: true }));
        }
    }
    return files;
}
export default getFiles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBR25FLE1BQU0sT0FBTyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7QUFFbEMsTUFBTSxDQUFDLEtBQUssVUFBVSxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBbUI7SUFDbEcsSUFBSSxFQUFFLENBQUM7SUFDUCxJQUFJO1FBQ0YsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0I7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLENBQUE7UUFDaEYsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2Y7SUFFRCxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXRCLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDN0IsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDZixJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ3hCLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ1osT0FBTyxJQUFJLENBQUM7YUFDYjtRQUNILENBQUMsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxJQUFJO1lBQUUsT0FBTztLQUNsQjtJQUVELEtBQUssTUFBTSxJQUFJLElBQUksRUFBRSxFQUFFO1FBQ3JCLElBQUksS0FBSyxHQUFHLEdB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