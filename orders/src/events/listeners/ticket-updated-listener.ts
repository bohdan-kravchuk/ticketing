import {
  Listener,
  Subjects,
  type TicketUpdatedEvent,
} from '@bohdktickets/common';
import { queueGroupName } from './queue-group-name';
import type { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const result = await Ticket.updateOne(
      { _id: data.id, version: data.version - 1 },
      {
        $set: {
          title: data.title,
          price: data.price,
          version: data.version,
        },
      },
      { runValidators: true },
    );

    if (result.matchedCount !== 1) {
      throw new Error('Ticket not found or version mismatch');
    }

    msg.ack();
  }
}
