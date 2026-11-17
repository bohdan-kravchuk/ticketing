import type { TicketUpdatedEvent } from '@bohdktickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import type { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { jest } from '@jest/globals';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
  });
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 1000,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
