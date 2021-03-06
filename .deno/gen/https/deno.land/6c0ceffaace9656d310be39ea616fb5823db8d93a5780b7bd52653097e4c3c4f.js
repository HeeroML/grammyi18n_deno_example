import { Schema } from "../schema.ts";
import { binary, merge, omap, pairs, set, timestamp } from "../type/mod.ts";
import { core } from "./core.ts";
export const def = new Schema({
    explicit: [binary, omap, pairs, set],
    implicit: [timestamp, merge],
    include: [core],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0EsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN0QyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBSWpDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQztJQUM1QixRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUM7SUFDcEMsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztJQUM1QixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7Q0FDaEIsQ0FBQyxDQUFDIn0=