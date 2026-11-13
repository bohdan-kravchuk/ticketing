import {
  Publisher,
  type ExpirationComplate,
  Subjects,
} from '@bohdktickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationComplate> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
