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
