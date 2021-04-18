import { Type } from "../type.ts";
export const seq = new Type("tag:yaml.org,2002:seq", {
    construct(data) {
        return data !== null ? data : [];
    },
    kind: "sequence",
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHbEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO0lBQ25ELFNBQVMsQ0FBQyxJQUFJO1FBQ1osT0FBTyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsSUFBSSxFQUFFLFVBQVU7Q0FDakIsQ0FBQyxDQUFDIn0=