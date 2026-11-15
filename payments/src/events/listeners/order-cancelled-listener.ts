import {
  Listener,
  OrderStatus,
  Subjects,
  type OrderCancelledEvent,
} from '@bohdktickets/common';
import { queueGroupName } from './queue-group-name';
import type { Message } from 'node-nats-streaming';
import { Order } from '../../model/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message,
  ): Promise<void> {
    const order = await Order.findOneAndUpdate(
      { _id: data.id, version: data.version - 1 },
      {
        status: OrderStatus.Cancelled,
        version: data.version,
      },
    );

    if (!order) {
      throw new Error('Order not found');
    }

    msg.ack();
  }
}
