import { parse as parseYaml } from "https://deno.land/std@0.63.0/encoding/yaml.ts";
export class YamlLoader {
    constructor() {
        this.decoder = new TextDecoder("utf-8");
    }
    async parseFile(filePath) {
        const yamlFile = await Deno.readFile(filePath);
        const yamlText = this.decoder.decode(yamlFile);
        return await parseYaml(yamlText);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFtbF9sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ5YW1sX2xvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsS0FBSyxJQUFJLFNBQVMsRUFBRSxNQUFNLCtDQUErQyxDQUFDO0FBTW5GLE1BQU0sT0FBTyxVQUFVO0lBQXZCO1FBS1UsWUFBTyxHQUFHLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBbUI3QyxDQUFDO0lBVkMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFnQjtRQUU5QixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFHL0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFHL0MsT0FBTyxNQUFNLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0YifQ==