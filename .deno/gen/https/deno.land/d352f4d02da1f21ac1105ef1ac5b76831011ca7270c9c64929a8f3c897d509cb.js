export function close(fd, callback) {
    setTimeout(() => {
        let error = null;
        try {
            Deno.close(fd);
        }
        catch (err) {
            error = err;
        }
        callback(error);
    }, 0);
}
export function closeSync(fd) {
    Deno.close(fd);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2ZzX2Nsb3NlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiX2ZzX2Nsb3NlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE1BQU0sVUFBVSxLQUFLLENBQUMsRUFBVSxFQUFFLFFBQTJCO0lBQzNELFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDaEI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLEtBQUssR0FBRyxHQUFHLENBQUM7U0FDYjtRQUNELFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDUixDQUFDO0FBRUQsTUFBTSxVQUFVLFNBQVMsQ0FBQyxFQUFVO0lBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDakIsQ0FBQyJ9