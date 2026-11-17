import {
  OrderStatus,
  type OrderCancelledEvent,
  type OrderCreatedEvent,
} from '@bohdktickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { Order } from '../../../model/order';
import type { Message } from 'node-nats-streaming';
import { jest } from '@jest/globals';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdf',
    price: 20,
  });
  await order.save();

  const orderEvent: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data: orderEvent, msg };
};

it('udpates order status to cancelled', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.status).toEqual(OrderStatus.Cancelled);
  expect(order!.version).toEqual(1);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
