import { Request } from 'express'; // or 'fastify'

export interface RequestWithUser extends Request {
  user: any; // Type this more specifically if possible (e.g., UserPayload)
}
