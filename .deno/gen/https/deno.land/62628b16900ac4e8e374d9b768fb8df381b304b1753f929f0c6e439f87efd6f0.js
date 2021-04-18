import { constants as fsConstants } from "./fs.ts";
import { constants as osConstants } from "./os.ts";
export default {
    ...fsConstants,
    ...osConstants.dlopen,
    ...osConstants.errno,
    ...osConstants.signals,
    ...osConstants.priority,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sRUFBRSxTQUFTLElBQUksV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxTQUFTLElBQUksV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRW5ELGVBQWU7SUFDYixHQUFHLFdBQVc7SUFDZCxHQUFHLFdBQVcsQ0FBQyxNQUFNO0lBQ3JCLEdBQUcsV0FBVyxDQUFDLEtBQUs7SUFDcEIsR0FBRyxXQUFXLENBQUMsT0FBTztJQUN0QixHQUFHLFdBQVcsQ0FBQyxRQUFRO0NBQ3hCLENBQUMifQ==