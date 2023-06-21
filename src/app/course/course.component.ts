import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import { debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize } from 'rxjs/operators';
import { merge, fromEvent } from "rxjs";
import { Lesson } from '../model/lesson';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {

  course: Course;

  // lessons = [
  //    {
  //     id: 120,
  //     'description': 'Introduction to Angular Material',
  //     'duration': '4:17',
  //     'seqNo': 1,
  //     courseId: 11
  //   },
  //   {
  //     id: 121,
  //     'description': 'Navigation and Containers',
  //     'duration': '6:37',
  //     'seqNo': 2,
  //     courseId: 11
  //   },
  //   {
  //     id: 122,
  //     'description': 'Data Tables',
  //     'duration': '8:03',
  //     'seqNo': 3,
  //     courseId: 11
  //   },
  //   {
  //     id: 123,
  //     'description': 'Dialogs and Overlays',
  //     'duration': '11:46',
  //     'seqNo': 4,
  //     courseId: 11
  //   },
  //   {
  //     id: 124,
  //     'description': 'Commonly used Form Controls',
  //     'duration': '7:17',
  //     'seqNo': 5,
  //     courseId: 11
  //   },
  //   {
  //     id: 125,
  //     'description': 'Drag and Drop',
  //     'duration': '8:16',
  //     'seqNo': 6,
  //     courseId: 11
  //   },
  //   {
  //     id: 126,
  //     'description': 'Responsive Design',
  //     'duration': '7:28',
  //     'seqNo': 7,
  //     courseId: 11
  //   },
  //   {
  //     id: 127,
  //     'description': 'Tree Component',
  //     'duration': '11:09',
  //     'seqNo': 8,
  //     courseId: 11
  //   },
  //   {
  //     id: 128,
  //     'description': 'Virtual Scrolling',
  //     'duration': '3:44',
  //     'seqNo': 9,
  //     courseId: 11
  //   },
  //   {
  //     id: 129,
  //     'description': 'Custom Themes',
  //     'duration': '8:55',
  //     'seqNo': 10,
  //     courseId: 11
  //   },
  //   {
  //     id: 130,
  //     'description': 'Changing Theme at Runtime',
  //     'duration': '12:37',
  //     'seqNo': 11,
  //     courseId: 11
  //   }
  // ];

  lessons: Lesson[];

  displayedColumns = ['select', 'seqNo', 'description', 'duration'];

  loading = false;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  expandedLesson: Lesson = null;

  selection = new SelectionModel<Lesson>(true, []);

  constructor(private route: ActivatedRoute,
    private coursesService: CoursesService) {

  }

  ngOnInit() {

    this.course = this.route.snapshot.data["course"];

    this.loadLessonsPage();


  }

  ngAfterViewInit() {

    // this.paginator.page
    //   .pipe(
    //     tap(() => this.loadLessonsPage())
    //   )
    //   .subscribe();

    // this.sort.sortChange
    //   .pipe(
    //     tap(() => this.loadLessonsPage())
    //   )
    //   .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge( // emits a new value when one of the observables emits
      this.paginator.page,
      this.sort.sortChange,
    )
    .pipe(
      tap(() => this.loadLessonsPage()),
    )
    .subscribe();

  }

  loadLessonsPage() {
    this.loading = true;
    this.coursesService.findLessons(
      this.course.id,
      this.sort?.direction ?? 'asc',
      this.paginator?.pageIndex ?? 0,
      this.paginator?.pageSize ?? 3,
      this.sort?.active ?? 'seqNo'
    )
      .pipe(
        tap((lessons: Lesson[]) => (this.lessons = lessons)),
        catchError(err => {
          console.log(err);
          alert('Error loading lessons');
          return err;
        }),
        finalize(() => this.loading = false),
      )
      .subscribe()
  }

  onToggleLesson(lesson: Lesson) {
    if (lesson === this.expandedLesson) {
      this.expandedLesson = null;
    } else {
      this.expandedLesson = lesson;
    }
  }

  onLessonToggled(lesson: Lesson) {

    this.selection.toggle(lesson);

  }

  isAllSelected() {
    return this.selection.selected?.length == this.lessons?.length;
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.lessons);
    }
  }

}
