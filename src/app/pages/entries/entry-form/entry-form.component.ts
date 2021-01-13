import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from 'rxjs/operators';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import  toastr from 'toastr';



@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorsMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked() {
    this.setPageTitle();

  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == "new") {      
      this.createEntry();
    }  
    else {
      this.updateEntry();
    }  

  }


  //private métodos
  private setCurrentAction(){
    if (this.route.snapshot.url[0].path == "new")
       this.currentAction = "new"
    else
      this.currentAction = "edit"   
  }
   
  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      data: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]


    });
  }
  private loadEntry() {
    if (this.currentAction == "edit") {    
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get("id")))
      ).subscribe(
        (categ) => {
          this.entry = categ;
          this.entryForm.patchValue(categ) // binds loaded entry data to EntryFrom
        },
        (error) => alert("ocorreu em erro no servidor, tente mais tarde.")
      )
    
    }
  } 

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = 'Cadastro de novo lançamento.'
    else {
      const entryName = this.entry.name || ""
      this.pageTitle = "Editando lançamento: " + entryName;

    }
  }

  private createEntry(){
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsFormError(error)
      )
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsFormError(error)
    )

  }

  private actionsForSuccess(entry: Entry){

    console.log('oii actionsForSuccess')
    toastr.success("Solicitação processada com sucesso!");
  

    // redirect/reload component page
    this.router.navigateByUrl("entries", {skipLocationChange: true}).then(
      () => this.router.navigate(["entries", entry.id, "edit"])
    )
  }
  
  private actionsFormError(error) {
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorsMessages = JSON.parse(error._body).errors;
    else {
      this.serverErrorsMessages = [ "Falha na comunicação com servidor. Por favor, tente mais tarde."]
    }  
  }

 
}
