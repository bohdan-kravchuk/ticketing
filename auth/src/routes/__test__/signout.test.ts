import { app } from '../../app';
import request from 'supertest';

it('clears the cookie after signing out', async () => {
  globalThis.signup();

  const response = await request(app)
    .post('/api/users/signout')
    .send()
    .expect(200);

  const cookie = response.get('Set-Cookie');
  if (!cookie) {
    throw new Error('Cookie is missing');
  }

  expect(cookie[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
  );
});
