import { Type } from "../type.ts";
export const str = new Type("tag:yaml.org,2002:str", {
    construct(data) {
        return data !== null ? data : "";
    },
    kind: "scalar",
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFbEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO0lBQ25ELFNBQVMsQ0FBQyxJQUFJO1FBQ1osT0FBTyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsSUFBSSxFQUFFLFFBQVE7Q0FDZixDQUFDLENBQUMifQ==