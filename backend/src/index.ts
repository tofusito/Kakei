import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { staticPlugin } from '@elysiajs/static';
import { runMigrations } from '../database/migrate';
import { runSeed } from '../database/seed';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { dashboardRoutes } from './routes/dashboard';
import { transactionRoutes } from './routes/transactions';
import { settingsRoutes } from './routes/settings';

const app = new Elysia()
    .use(cors())
    .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET || 'secret' }))
    .onStart(async () => {
        try {
            console.log('🔄 Running Startup Database Init...');
            await runMigrations();
            await runSeed();
            console.log('✅ Startup Database Init Completed');
        } catch (e) {
            console.error('❌ Startup DB Init failed:', e);
        }

        // Ensure admin user exists
        const adminUser = process.env.ADMIN_USER || 'admin';
        const adminPass = process.env.ADMIN_PASS || 'admin';
        const hashedPassword = await Bun.password.hash(adminPass);

        const existing = await db.select().from(users).where(eq(users.username, adminUser));

        if (existing.length === 0) {
            await db.insert(users).values({ username: adminUser, passwordHash: hashedPassword });
        } else {
            await db.update(users).set({ passwordHash: hashedPassword }).where(eq(users.username, adminUser));
        }
    })
    // 1. API Routes
    .use(dashboardRoutes)
    .use(transactionRoutes)
    .use(settingsRoutes)
    // 2. Static Files - Icons and Assets
    .get('/apple-touch-icon.png', () => Bun.file('public/apple-touch-icon.png'))
    .get('/favicon.png', () => Bun.file('public/favicon.png'))
    .get('/favicon.ico', () => Bun.file('public/favicon.ico'))
    .get('/icon-192.png', () => Bun.file('public/icon-192.png'))
    .get('/icon-512.png', () => Bun.file('public/icon-512.png'))
    .get('/manifest.json', () => Bun.file('public/manifest.json'))
    .get('/assets/*', async ({ params }) => {
        const filePath = `public/assets/${params['*']}`;
        return Bun.file(filePath);
    })
    // 3. SPA Routes - serve index.html for all other routes
    .get('*', async ({ path, set }) => {
        if (path.startsWith('/api')) {
            set.status = 404;
            return { error: 'Not Found' };
        }
        set.headers['Content-Type'] = 'text/html; charset=utf-8';
        return Bun.file('public/index.html');
    })
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
