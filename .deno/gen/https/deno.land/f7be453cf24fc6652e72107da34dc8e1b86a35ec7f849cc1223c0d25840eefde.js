export class GrammyError extends Error {
    constructor(message, info, payload) {
        super(`${message} (${info.error_code}: ${info.description})`);
        this.payload = payload;
        this.error_code = info.error_code;
        this.description = info.description;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFXQSxNQUFNLE9BQU8sV0FBWSxTQUFRLEtBQUs7SUFHbEMsWUFDSSxPQUFlLEVBQ2YsSUFBZSxFQUNDLE9BQWU7UUFFL0IsS0FBSyxDQUFDLEdBQUcsT0FBTyxLQUFLLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUE7UUFGN0MsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUcvQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUE7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFBO0lBQ3ZDLENBQUM7Q0FDSiJ9