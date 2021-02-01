import { Component, Injector} from '@angular/core';
import { Validators } from '@angular/forms'


import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { CategoryService } from '../../categories/shared/category.service';
import { Category } from '../../categories/shared/category.model';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> {
  

  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','    
  };

  constructor(
    protected entryService: EntryService,
    protected categoryService: CategoryService,
    protected injector: Injector
  ) { 
    super(injector, new Entry, entryService, Entry.fromJson)

  }

  ngOnInit(): void {   
    this.loadCategories();
    super.ngOnInit();
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        console.log('entrei no typeOptions....', value)
        return {
          text: text,
          value: value
        }
      }
    ) 
  }
   
  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
           
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      data: [null, ],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]

    });    
  }
  
  private loadCategories(){
     this.categoryService.getAll().subscribe(
       categories => this.categories = categories
     );
  }
  
  protected  editionPageTitle(): string {
    const categoryName = this.resource.name || "";
    return 'Editando lançamento: ' + categoryName ;
  }
  
  protected creationPageTitle(): string {
   return 'Cadastro novo lançamento';
  }
 
   
}
