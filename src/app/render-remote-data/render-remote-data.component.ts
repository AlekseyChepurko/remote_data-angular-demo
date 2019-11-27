import {Component, Input, OnInit} from '@angular/core';
import {fold as foldRd, initial, RemoteData} from '@devexperts/remote-data-ts';
import {Observable} from 'rxjs';
import {map as mapStream} from 'rxjs/operators';

@Component({
  selector: 'app-render-remote-data',
  templateUrl: './render-remote-data.component.html',
})
class RenderRemoteDataComponent implements OnInit{
  @Input() remoteData$: Observable<RemoteData<string, string>>;

  textToRender$: Observable<string>;

  ngOnInit() {
    this.textToRender$ = this.remoteData$.pipe(
      mapStream(foldRd(
        () => 'initial',
        () => 'pending...',
        () => 'error',
        (data) => data,
      ))
    );
  }

}

export {RenderRemoteDataComponent};
