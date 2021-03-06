export const setTimeout = globalThis.setTimeout;
export const clearTimeout = globalThis.clearTimeout;
export const setInterval = globalThis.setInterval;
export const clearInterval = globalThis.clearInterval;
export const setImmediate = (cb, ...args) => globalThis.setTimeout(cb, 0, ...args);
export const clearImmediate = globalThis.clearTimeout;
export default {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    setImmediate,
    clearImmediate,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGltZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDO0FBQ2hELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO0FBQ3BELE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDO0FBQ2xELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDO0FBQ3RELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxDQUUxQixFQUE0QixFQUU1QixHQUFHLElBQVcsRUFDTixFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDbkQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUM7QUFFdEQsZUFBZTtJQUNiLFVBQVU7SUFDVixZQUFZO0lBQ1osV0FBVztJQUNYLGFBQWE7SUFDYixZQUFZO0lBQ1osY0FBYztDQUNmLENBQUMifQ==