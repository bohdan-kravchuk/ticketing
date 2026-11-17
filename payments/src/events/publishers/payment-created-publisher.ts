import {
  Publisher,
  Subjects,
  type PaymentCreatedEvent,
} from '@bohdktickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
