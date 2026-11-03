import { NotFoundError, requireAuth } from '@bohdktickets/common';
import express from 'express';
import type { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.status(200).send(ticket);
  },
);

export { router as showTicketRouter };
