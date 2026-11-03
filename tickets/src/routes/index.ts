import express from 'express';
import type { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { requireAuth } from '@bohdktickets/common';

const router = express.Router();

router.get('/api/tickets', requireAuth, async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.send(tickets);
});

export { router as indexTicketRouter };
