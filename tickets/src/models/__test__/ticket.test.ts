import { Ticket } from '../ticket';

it('implements optimistic consurrency control', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error('should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  ticket.price = 10;
  await ticket.save();
  expect(ticket.version).toEqual(0);
  ticket.price = 5;
  await ticket.save();
  expect(ticket.version).toEqual(1);
  ticket.price = 10;
  await ticket.save();
  expect(ticket.version).toEqual(2);  
})