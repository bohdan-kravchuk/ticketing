import { jest } from '@jest/globals';
import os from 'node:os';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.unstable_mockModule('../nats-wrapper', () => ({
  natsWrapper: {
    client: {
      publish: jest
        .fn()
        .mockImplementation(
          (_subject: string, _data: string, callback: () => void) => {
            callback();
          },
        ),
    },
  },
}));

jest.unstable_mockModule('../stripe', () => ({
  stripe: {
    charges: {
      create: jest.fn().mockResolvedValue({ id: 'id' }),
    },
  },
}));

declare global {
  var signin: (id?: string) => string[];
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create();

  await mongoose.connect(mongo.getUri(), {
    serverSelectionTimeoutMS: 5000,
    runtimeAdapters: { os },
  });

  console.log('Mongoose connected');
}, 30000);

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
}, 15000);

globalThis.signin = (id?: string) => {
  const payload = {
    id: id ?? new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
