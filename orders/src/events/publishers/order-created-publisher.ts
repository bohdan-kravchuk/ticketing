import { Publisher, type OrderCreatedEvent, Subjects,  } from "@bohdktickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}