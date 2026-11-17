import {
  Publisher,
  Subjects,
  type TicketUpdatedEvent,
} from '@bohdktickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
