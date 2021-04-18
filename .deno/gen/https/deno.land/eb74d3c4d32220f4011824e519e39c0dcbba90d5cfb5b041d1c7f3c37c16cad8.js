import { join } from 'https://x.nest.land/std@0.73.0/path/mod.ts';
export default function (meta) {
    const iURL = meta.url, fileStartRegex = /(^(file:)((\/\/)?))/, __dirname = join(iURL, '../')
        .replace(fileStartRegex, '')
        .replace(/(\/$)/, ''), __filename = iURL.replace(fileStartRegex, '');
    return { __dirname, __filename };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQTtBQUdqRSxNQUFNLENBQUMsT0FBTyxXQUFXLElBQVc7SUFDbEMsTUFDRSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFDZixjQUFjLEdBQUcscUJBQXFCLEVBQ3RDLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztTQUNkLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDO1NBQzNCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQ25DLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUUvQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxDQUFBO0FBQ2xDLENBQUMifQ==