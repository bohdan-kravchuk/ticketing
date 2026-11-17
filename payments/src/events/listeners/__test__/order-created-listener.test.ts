import { OrderStatus, type OrderCreatedEvent } from '@bohdktickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { Order } from '../../../model/order';
import type { Message } from 'node-nats-streaming';
import { jest } from '@jest/globals';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const orderEvent: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: new Date().toISOString(),
    status: OrderStatus.Created,
    userId: 'asdf',
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data: orderEvent, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
