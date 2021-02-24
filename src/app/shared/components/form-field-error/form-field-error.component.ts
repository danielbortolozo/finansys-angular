import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

  public get errorMessage(): string | null {
     if (this.mustShowErrorMessage() )
        return this.getErrorMessage();
      else
         return null; 
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched 
  }

  private getErrorMessage(): string | null {
    console.log('cheguie no metodo');
    if ( this.formControl.errors.required )
       return "Campo obrigatório xxxx.";
    
      if (this.formControl.errors.email){
         return `E-mail inválido.`; 
      } 
      if (this.formControl.errors.minlength){
        console.log('passeiii aquiiiiii ,', this.formControl.errors.minlength.requiredLength)
          const requiredLength = this.formControl.errors.minlength.requiredLength;
          console.log('minímo caracter :', requiredLength)
          return `Deve ter no mínimo ${requiredLength} caracteres.`; 
      } 
      if (this.formControl.errors.maxlength){
         const requiredLength = this.formControl.errors.maxlenght.requiredLength;
         return `Deve ter no mínimo ${requiredLength} caracteres.`; 
      }
      console.log('sai getErrorMessage no metodo');      
  }


  }


