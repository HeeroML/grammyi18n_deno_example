import { State } from "../state.ts";
export class LoaderState extends State {
    constructor(input, { filename, schema, onWarning, legacy = false, json = false, listener = null, }) {
        super(schema);
        this.input = input;
        this.documents = [];
        this.lineIndent = 0;
        this.lineStart = 0;
        this.position = 0;
        this.line = 0;
        this.result = "";
        this.filename = filename;
        this.onWarning = onWarning;
        this.legacy = legacy;
        this.json = json;
        this.listener = listener;
        this.implicitTypes = this.schema.compiledImplicit;
        this.typeMap = this.schema.compiledTypeMap;
        this.length = input.length;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyX3N0YXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZGVyX3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFtQnBDLE1BQU0sT0FBTyxXQUFZLFNBQVEsS0FBSztJQXdCcEMsWUFDUyxLQUFhLEVBQ3BCLEVBQ0UsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsTUFBTSxHQUFHLEtBQUssRUFDZCxJQUFJLEdBQUcsS0FBSyxFQUNaLFFBQVEsR0FBRyxJQUFJLEdBQ0k7UUFFckIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBVlAsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQXhCZixjQUFTLEdBQVUsRUFBRSxDQUFDO1FBRXRCLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFDZixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUNiLFNBQUksR0FBRyxDQUFDLENBQUM7UUFnQlQsV0FBTSxHQUFzQixFQUFFLENBQUM7UUFjcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsSUFBSSxDQUFDLGFBQWEsR0FBSSxJQUFJLENBQUMsTUFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQztRQUM5RCxJQUFJLENBQUMsT0FBTyxHQUFJLElBQUksQ0FBQyxNQUFpQixDQUFDLGVBQWUsQ0FBQztRQUV2RCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztDQUNGIn0=