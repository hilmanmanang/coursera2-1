import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DishDetailComments, RatingType } from '../shared/dishdetailcomments';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @ViewChild('cform') commentFormDirective;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Author is required.',
      'minlength': 'First name must be at least 2 characters long.',
    },
    'comment': {
      'required': 'Comments is required.',
      'minlength': 'Last name must be at least 2 characters long.',
    }
  };

  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  dishdetailcommentsForm: FormGroup;
  dishdetailcomments: DishDetailComments;
  rating = RatingType;

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL
  ) { 
    this.createForm();
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id']))).subscribe(dish => {
      this.dish = dish;
      this.setPrevNext(dish.id);
    },
    errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.dishdetailcommentsForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: '5',
      comment: ['', [Validators.required, Validators.minLength(2)] ],
    });

    this.dishdetailcommentsForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.dishdetailcommentsForm) {
      return;
    }
    const form = this.dishdetailcommentsForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.dishdetailcomments = this.dishdetailcommentsForm.value;
    console.log(this.dishdetailcomments);
    this.dishdetailcommentsForm.reset({
      author: '',
      rating: '5',
      comment: ''
    });
    this.commentFormDirective.resetForm();
  }
}
