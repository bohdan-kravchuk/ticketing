import {
  Publisher,
  type ExpirationComplateEvent,
  Subjects,
} from '@bohdktickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationComplateEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
