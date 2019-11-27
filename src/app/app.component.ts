import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {catchError, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';
import {map as mapStream} from 'rxjs/operators';
import {RemoteData, pending, failure, success, map as mapRd} from '@devexperts/remote-data-ts';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  private destroy$ = new Subject();
  private endpoint$ = new Subject<string>();
  private data$: Observable<RemoteData<any, any>>;

 constructor(
   private fb: FormBuilder,
   private readonly cdr: ChangeDetectorRef,
   private httpService: HttpClient
 ) {
   this.formGroup.valueChanges
     .pipe(takeUntil(this.destroy$))
     .subscribe(() => this.cdr.detectChanges());

   this.data$ = this.endpoint$.pipe(
     switchMap(
       (endpoint) =>
         this.httpService.get(endpoint)
           .pipe(
             mapStream(success),
             mapStream(mapRd(JSON.stringify)),
             catchError(()  => of(failure('wrong'))),
             startWith(pending)
           )
     ),
   );
 }

  formGroup = this.fb.group({
    endpoint: this.fb.control('', Validators.required)
  });

 ngOnInit() {
 }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  processSubmit() {
    if (this.formGroup.valid) {
      this.endpoint$.next(this.formGroup.value.endpoint);
    }
  }
}
