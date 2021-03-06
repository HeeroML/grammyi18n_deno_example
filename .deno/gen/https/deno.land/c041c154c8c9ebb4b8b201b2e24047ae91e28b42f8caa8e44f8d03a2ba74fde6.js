import { fromFileUrl } from "../path.ts";
export function rename(oldPath, newPath, callback) {
    oldPath = oldPath instanceof URL ? fromFileUrl(oldPath) : oldPath;
    newPath = newPath instanceof URL ? fromFileUrl(newPath) : newPath;
    if (!callback)
        throw new Error("No callback function supplied");
    Deno.rename(oldPath, newPath).then((_) => callback(), callback);
}
export function renameSync(oldPath, newPath) {
    oldPath = oldPath instanceof URL ? fromFileUrl(oldPath) : oldPath;
    newPath = newPath instanceof URL ? fromFileUrl(newPath) : newPath;
    Deno.renameSync(oldPath, newPath);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2ZzX3JlbmFtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIl9mc19yZW5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUV6QyxNQUFNLFVBQVUsTUFBTSxDQUNwQixPQUFxQixFQUNyQixPQUFxQixFQUNyQixRQUErQjtJQUUvQixPQUFPLEdBQUcsT0FBTyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDbEUsT0FBTyxHQUFHLE9BQU8sWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBRWxFLElBQUksQ0FBQyxRQUFRO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBRWhFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUVELE1BQU0sVUFBVSxVQUFVLENBQUMsT0FBcUIsRUFBRSxPQUFxQjtJQUNyRSxPQUFPLEdBQUcsT0FBTyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDbEUsT0FBTyxHQUFHLE9BQU8sWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBRWxFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3BDLENBQUMifQ==