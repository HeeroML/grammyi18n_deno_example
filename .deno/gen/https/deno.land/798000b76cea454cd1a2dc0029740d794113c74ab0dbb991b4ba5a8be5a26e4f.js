import { Type } from "../type.ts";
export const map = new Type("tag:yaml.org,2002:map", {
    construct(data) {
        return data !== null ? data : {};
    },
    kind: "mapping",
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHbEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO0lBQ25ELFNBQVMsQ0FBQyxJQUFJO1FBQ1osT0FBTyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsSUFBSSxFQUFFLFNBQVM7Q0FDaEIsQ0FBQyxDQUFDIn0=