import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { cookie } from '@elysiajs/cookie';

export const authMiddleware = new Elysia()
    .use(cookie())
    .use(jwt({ 
        name: 'jwt', 
        secret: process.env.JWT_SECRET || 'supersecret',
        exp: '7d' // Token expira en 7 días
    }))
    .derive(async ({ jwt, cookie: { auth }, set }) => {
        // Rutas públicas que no requieren autenticación
        const publicRoutes = ['/api/login', '/login'];
        
        // Si no hay cookie de auth, no está autenticado
        if (!auth.value) {
            return { user: null };
        }

        try {
            // Verificar JWT
            const payload = await jwt.verify(auth.value);
            if (!payload) {
                auth.remove();
                return { user: null };
            }

            return { user: payload };
        } catch (e) {
            auth.remove();
            return { user: null };
        }
    })
    .onBeforeHandle(({ user, path, set }) => {
        // Rutas públicas
        const publicRoutes = ['/api/login', '/api/auth/check'];
        const publicPaths = ['/', '/login', '/manifest.json', '/favicon', '/icon-', '/apple-touch-icon'];
        
        // Permitir acceso a rutas públicas
        if (publicRoutes.includes(path) || publicPaths.some(p => path.startsWith(p))) {
            return;
        }

        // Si intenta acceder a API sin autenticación
        if (path.startsWith('/api') && !user) {
            set.status = 401;
            return { error: 'Unauthorized' };
        }

        // Si intenta acceder a assets sin autenticación, permitir
        if (path.startsWith('/assets')) {
            return;
        }

        // Para otras rutas, si no está autenticado, redirigir a login (será manejado por el frontend)
        if (!user && !path.startsWith('/assets')) {
            // El frontend manejará esto mostrando la página de login
            return;
        }
    });

