import { Elysia, t } from 'elysia';
import { db } from '../db';
import { users, userSettings } from '../../database/schema';
import { eq } from 'drizzle-orm';

export const settingsRoutes = new Elysia({ prefix: '/api' })
    .get('/settings', async () => {
        // Get first user (for now, single-user app)
        const [user] = await db.select().from(users).limit(1);
        if (!user) return { theme: 'dark', language: 'en' };

        const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id));

        if (!settings) {
            // Create default settings
            const [newSettings] = await db.insert(userSettings).values({
                userId: user.id,
                theme: 'dark',
                language: 'en'
            }).returning();
            return newSettings;
        }

        return settings;
    })
    .post('/settings', async ({ body }) => {
        const { theme, language } = body;

        // Get first user
        const [user] = await db.select().from(users).limit(1);
        if (!user) throw new Error('No user found');

        const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id));

        if (!settings) {
            await db.insert(userSettings).values({
                userId: user.id,
                theme: theme as 'light' | 'dark',
                language: language as 'en' | 'es'
            });
        } else {
            await db.update(userSettings)
                .set({
                    theme: theme as 'light' | 'dark',
                    language: language as 'en' | 'es',
                    updatedAt: new Date()
                })
                .where(eq(userSettings.userId, user.id));
        }

        return { success: true, theme, language };
    }, {
        body: t.Object({
            theme: t.String(),
            language: t.String()
        })
    });
