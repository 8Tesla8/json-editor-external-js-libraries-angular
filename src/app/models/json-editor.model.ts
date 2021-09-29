export class JsonEditorModel{
    public valid: boolean;
    public errors: JsonError[] |null;
    public json: string;
}

export class JsonError{
    public path: string;
    public property: string;
    public message: string;
}