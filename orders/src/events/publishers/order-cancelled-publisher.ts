import {
  type OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@bohdktickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
