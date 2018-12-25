import { Component, OnDestroy, OnInit } from '@angular/core';
import { RxStompService} from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  public receivedMessages: string[] = [];
  private topicSubscription: Subscription;

  constructor(private rxStompService: RxStompService) { }

  ngOnInit() {
    this.topicSubscription = this.rxStompService.watch('/topic/demo').subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
    });
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
  }

  onSendMessage() {
    const message = `Message generated at ${new Date}`;
    const receipt_id = UUID.UUID();
    this.rxStompService.watchForReceipt(receipt_id, (frame) => {
      console.log('Receipt: ', frame);
    });
    this.rxStompService.publish({destination: '/topic/demo', body: message, headers: {receipt: receipt_id}});
  }
}
