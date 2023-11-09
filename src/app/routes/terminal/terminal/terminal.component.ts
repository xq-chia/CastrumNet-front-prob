import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgTerminal } from 'ng-terminal';
import { TerminalService } from './terminal.service';
import { BehaviorSubject, Subject, elementAt, first, firstValueFrom, take } from 'rxjs';
import { Socket } from 'socket.io-client';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-terminal-terminal',
  templateUrl: './terminal.component.html'
})
export class TerminalTerminalComponent implements OnInit, AfterViewInit {
  @ViewChild('term', { static: false }) term!: NgTerminal;
  buffer$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  socket: Socket = this.socketService.io;
  messageOutput$ = new Subject<string>();

  constructor(
    private socketService: TerminalService,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.init()

    this.term.onData().subscribe(data => {
      this.socketService.execute(data);
    })

    this.socket.on('message', data => {
      this.messageOutput$.next(data)
    })

    this.messageOutput$.subscribe(data => {
      let cursorRow: number;
      let bufferLine: string;
      let bufferWithoutPrompt: string;

      this.term.write(data);

      cursorRow = this.term.underlying?.buffer.active.cursorY!;
      bufferLine = this.term.underlying?.buffer.active.getLine(cursorRow)!.translateToString()!
      bufferWithoutPrompt = bufferLine.slice(bufferLine.indexOf(' ') + 1)
      //update buffer
      this.buffer$.next(bufferWithoutPrompt);
    })

    this.buffer$.subscribe(data => {
      this.socketService.updateBuffer(data);
    })

    this.socket.on('error', msg => {
      this.notificationService.error('Execution Failed', msg)

    })
  }

  init() {
    // Ctrl+L 
    // redraw to display prompt
    this.socketService.execute('\u000c')
  }
}
