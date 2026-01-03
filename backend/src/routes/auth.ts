import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { cookie } from '@elysiajs/cookie';

// Rate limiting simple en memoria
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const attempt = loginAttempts.get(ip);

    if (!attempt || now > attempt.resetTime) {
        loginAttempts.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minuto
        return true;
    }

    if (attempt.count >= 5) {
        return false; // Bloqueado
    }

    attempt.count++;
    return true;
}

export const authRoutes = new Elysia()
    .use(jwt({ 
        name: 'jwt', 
        secret: process.env.JWT_SECRET || 'supersecret',
        exp: '7d'
    }))
    .use(cookie())
    .post('/api/login', async ({ body, jwt, cookie: { auth }, set, request }) => {
        const { username, password } = body as { username: string; password: string };

        // Rate limiting por IP
        const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        
        if (!checkRateLimit(clientIP)) {
            set.status = 429;
            return { error: 'Too many login attempts. Please try again later.' };
        }

        // Obtener credenciales de variables de entorno
        const KAKEI_USER = process.env.KAKEI_USER || 'admin';
        const KAKEI_PASSWORD = process.env.KAKEI_PASSWORD || 'admin';

        // Verificar credenciales
        if (username !== KAKEI_USER || password !== KAKEI_PASSWORD) {
            set.status = 401;
            return { error: 'Invalid credentials' };
        }

        // Crear JWT
        const token = await jwt.sign({
            username: username,
            iat: Math.floor(Date.now() / 1000)
        });

        // Configurar cookie HTTPOnly (persiste 7 días)
        // ⚠️ IMPORTANTE: 
        // - Development (localhost): secure=false funciona con HTTP
        // - Production (HTTPS): secure=true SOLO funciona con HTTPS (Cloudflare Tunnel, etc.)
        const isProduction = process.env.NODE_ENV === 'production';
        
        auth.set({
            value: token,
            httpOnly: true, // No accesible desde JavaScript (anti-XSS)
            secure: false, // SIEMPRE false para funcionar en localhost Y producción sin HTTPS
            sameSite: 'lax', // Protección CSRF (lax permite recargas de página)
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7 días en segundos
        });

        return { 
            success: true,
            message: 'Login successful'
        };
    }, {
        body: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 1 })
        })
    })
    .post('/api/logout', ({ cookie: { auth }, set }) => {
        auth.remove();
        return { success: true };
    })
    .get('/api/auth/check', async ({ cookie: { auth }, jwt }) => {
        // Verificar si existe la cookie y si el JWT es válido
        if (!auth.value) {
            return { authenticated: false };
        }

        try {
            const payload = await jwt.verify(auth.value);
            if (!payload) {
                return { authenticated: false };
            }
            return { authenticated: true, user: payload };
        } catch (e) {
            return { authenticated: false };
        }
    });

