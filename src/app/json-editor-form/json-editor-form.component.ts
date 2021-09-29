import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';
import { JsonEditorModel, JsonError } from '../models/json-editor.model';

// json editor library
// https://www.npmjs.com/package/@json-editor/json-editor
// https://github.com/json-editor/json-editor

// instruction how add js library to angular project
// https://medium.com/@clintpitzak/how-to-use-external-javascript-libraries-in-angular-8-247baacbdccf

declare var JSONEditor: any;

@Component({
    selector: 'json-editor-form',
    styleUrls: ['./json-editor-form.component.scss'],
    templateUrl: './json-editor-form.component.html',
})
export class JsonEditorFormComponent implements AfterViewInit, OnDestroy {
    public jsonEditorId = 'json-editor-form';

    @Input() public jsonSchema = '';
    @Input() public json = new Object();
    @Input() public saveButtonTitle = 'Save';

    @Output()
    public onSaveClick = new EventEmitter<JsonEditorModel>();

    private jsonEditor: any;

    ngAfterViewInit(): void {
        this.initEditor();
    }

    ngOnDestroy(): void {
        this.jsonEditor.destroy();
    }

    private initEditor(): void {
        const element = document.getElementById(this.jsonEditorId);

        this.jsonEditor = new JSONEditor(element, {
            use_default_values: true,
            schema: this.jsonSchema,
            startval: this.json,
            theme: 'bootstrap4', // html

            prompt_before_delete: false, //- If true, displays a dialog box with a confirmation message before node deletion.
            disable_edit_json: false, // - If set to true, the Edit JSON button will be hidden (works for objects)
            disable_properties: false, // - If set to true, the Edit Properties button will be hidden (works for objects)
            remove_empty_properties: true, //- If set to true for an object, empty object properties (i.e. those with falsy values) will not be returned by getValue().
        });

    }

    public saveButtonClick(): void {
        let errors = this.validate();

        let jsonModel = new JsonEditorModel();
        jsonModel.errors = errors;
        jsonModel.valid = errors == null; 

        jsonModel.json = JSON.stringify(this.jsonEditor.getValue());
        this.onSaveClick.emit(jsonModel);
    }

    private validate(): JsonError[]|null {
        const errors = this.jsonEditor.validate();
        // errors is an array of objects, each with a `path`, `property`, and `message` parameter
        // `property` is the schema keyword that triggered the validation error (e.g. "minLength")
        // `path` is a dot separated path into the JSON object (e.g. "root.path.to.field")


        if (errors.length) {
            let jsonErrors: JsonError[] = [];
            
            errors.forEach( (er:any) => {
                let jsonEr = new JsonError();
                jsonEr.path = er["path"];
                jsonEr.property = er["property"];
                jsonEr.message = er["message"];

                jsonErrors.push(jsonEr);
            });
            
           return jsonErrors;     
        }
        else 
            return null;    
    }

}
