import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from 'rxjs/operators';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

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
      name: [null, Validators.required, Validators.minLength(2)],
      description: [null]
    })
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
      this.pageTitle = "Editando categoria.: " + categoryName;

    }
  }


}
