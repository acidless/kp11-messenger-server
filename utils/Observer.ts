export interface Subscriber {
  onEvent(event: string, ...args: any): any;
}

export class Subject {
  protected subscribers: Array<Subscriber> = [];

  protected subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }

  protected unsubscribe(subscriber: Subscriber) {
    const sub = this.subscribers.indexOf(subscriber);
    if (sub !== -1) {
      this.subscribers.splice(sub);
    }
  }

  protected async notify(event: string, ...args) {
    for (const subscriber of this.subscribers) {
      await subscriber.onEvent(event, ...args);
    }
  }
}
