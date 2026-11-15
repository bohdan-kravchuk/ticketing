import {
  Listener,
  Subjects,
  type OrderCreatedEvent,
} from '@bohdktickets/common';
import { queueGroupName } from './queue-group-name';
import type { Message } from 'node-nats-streaming';
import { Order } from '../../model/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message,
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
