import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import prisma from '../src/config/prisma.js';

const app = createApp();

describe('ReserveHub REST API Integration Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('ReserveHub API');
  });

  it('POST /api/auth/login should authenticate seeded admin user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@reservehub.com',
        password: 'Admin123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('ADMIN');
  });

  it('POST /api/auth/login with wrong password should fail with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@reservehub.com',
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/spaces should return active spaces', async () => {
    const res = await request(app).get('/api/spaces');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/reservations/my without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/reservations/my');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('RN-06 Rule: should reject reservation if startTime >= endTime', async () => {
    // Login as user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jonathan@reservehub.com',
        password: 'User123!',
      });
    const token = loginRes.body.data.token;

    // Get a space
    const spacesRes = await request(app).get('/api/spaces');
    const spaceId = spacesRes.body.data[0].id;

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        spaceId,
        reservationDate: '2026-12-01',
        startTime: '14:00',
        endTime: '12:00', // invalid: start >= end
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
