import {Component} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

const SAMPLE_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent convallis sodales ante, sodales fringilla urna. Ut semper turpis quis interdum ultrices. Proin bibendum posuere mauris id suscipit. Integer pulvinar nunc posuere justo eleifend, eu eleifend tortor lobortis. Quisque eu erat sed ante euismod tempor. Aliquam blandit sem at velit faucibus tempor. Etiam sapien est, semper non facilisis nec, cursus in lorem. Fusce felis lacus, volutpat ac orci id, euismod vestibulum purus.';


@Component({
  selector: "create-course-step-1",
  templateUrl:"create-course-step-1.component.html",
  styleUrls: ["create-course-step-1.component.scss"]
})
export class CreateCourseStep1Component {

  form = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60)
    ]],
    releasedAt: [new Date(), Validators.required],
    category: ['BEGINNER', Validators.required],
    courseType: ['premium', Validators.required],
    downloadsAllowed: [false, Validators.requiredTrue],
    longDescription: [SAMPLE_TEXT, [Validators.required, Validators.minLength(3)]]
  });

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const date = cellDate.getDate();

    if (view === 'month') {
      return (date === 1) ? 'highlight-date': '';
    }
    return '';
  };

  constructor(private fb: UntypedFormBuilder) {

  }

  get courseTitle() {
    return this.form.controls['title'];
  }

}
