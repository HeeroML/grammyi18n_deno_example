export class YAMLError extends Error {
    constructor(message = "(unknown reason)", mark = "") {
        super(`${message} ${mark}`);
        this.mark = mark;
        this.name = this.constructor.name;
    }
    toString(_compact) {
        return `${this.name}: ${this.message} ${this.mark}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxNQUFNLE9BQU8sU0FBVSxTQUFRLEtBQUs7SUFDbEMsWUFDRSxPQUFPLEdBQUcsa0JBQWtCLEVBQ2xCLE9BQXNCLEVBQUU7UUFFbEMsS0FBSyxDQUFDLEdBQUcsT0FBTyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7UUFGbEIsU0FBSSxHQUFKLElBQUksQ0FBb0I7UUFHbEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUNwQyxDQUFDO0lBRU0sUUFBUSxDQUFDLFFBQWlCO1FBQy9CLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RELENBQUM7Q0FDRiJ9