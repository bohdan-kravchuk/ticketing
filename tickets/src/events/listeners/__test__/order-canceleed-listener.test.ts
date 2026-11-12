import { type OrderCancelledEvent } from '@bohdktickets/common';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });
  ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it('updates the ticket, publishes an event and acks the message', async () => {
  const { data, listener, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();

  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
