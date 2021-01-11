import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from 'rxjs/operators';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import  toastr from 'toastr';



@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorsMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();

  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction == "new") {      
      this.createCategory();
    }  
    else {
      this.updateCategory();
    }  

  }


  //private métodos
  private setCurrentAction(){
    if (this.route.snapshot.url[0].path == "new")
       this.currentAction = "new"
    else
      this.currentAction = "edit"   
  }
   
  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }
  private loadCategory() {
    if (this.currentAction == "edit") {    
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))
      ).subscribe(
        (categ) => {
          this.category = categ;
          this.categoryForm.patchValue(categ) // binds loaded category data to CategoryFrom
        },
        (error) => alert("ocorreu em erro no servidor, tente mais tarde.")
      )
    
    }
  } 

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = 'Cadastro de nova categoria.'
    else {
      const categoryName = this.category.name || ""
      this.pageTitle = "Editando categoria: " + categoryName;

    }
  }

  private createCategory(){
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsFormError(error)
      )
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category)
    .subscribe(
      category => this.actionsForSuccess(category),
      error => this.actionsFormError(error)
    )

  }

  private actionsForSuccess(category: Category){

    console.log('oii actionsForSuccess')
    toastr.success("Solicitação processada com sucesso!");
  

    // redirect/reload component page
    this.router.navigateByUrl("categories", {skipLocationChange: true}).then(
      () => this.router.navigate(["categories", category.id, "edit"])
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
