# 🔐 Security Guide - Kakei

## ⚠️ Before Exposing to the Internet

**IMPORTANT:** If you plan to expose Kakei to the Internet via Cloudflare Tunnel or any other method, you **MUST** configure secure credentials.

---

## 🛡️ Implemented Security Features

### ✅ JWT Authentication
- **Signed tokens** with configurable secret
- **Automatic expiration** after 7 days
- **HTTPOnly cookies** (not accessible from JavaScript)
- **SameSite: strict** (CSRF protection)

### ✅ Rate Limiting
- **Maximum 5 login attempts per minute** per IP
- Protection against brute force attacks
- Automatic temporary blocking

### ✅ Route Protection
- **All API routes protected** by authentication middleware
- No data access without valid login
- JWT verification on every request

### ✅ Secure Cookies
- **HTTPOnly**: Not accessible from JavaScript (anti-XSS)
- **Secure**: Only transmitted over HTTPS in production
- **SameSite: strict**: CSRF protection

---

## 🔑 Credentials Configuration

### 1. Generate a Strong JWT Secret

```bash
# Generate a random 32-byte secret
openssl rand -base64 32
```

### 2. Create `.env` file

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Authentication (⚠️ CHANGE THESE VALUES ⚠️)
KAKEI_USER=your_secure_username
KAKEI_PASSWORD=YourSuperSecurePassword123!

# JWT Secret (⚠️ USE THE ONE GENERATED WITH OPENSSL ⚠️)
JWT_SECRET=your_random_secret_generated_with_openssl

# Environment
NODE_ENV=development  # Use 'production' only with HTTPS
```

**⚠️ IMPORTANT: Cookie Security Settings**

- **Development (localhost)**: `NODE_ENV=development` with `secure: false` cookies
  - Allows cookies to work over HTTP (localhost)
  - Session persists for 7 days across page reloads
  
- **Production (HTTPS)**: Change to `NODE_ENV=production` AND enable secure cookies
  - Edit `backend/src/routes/auth.ts` line 63: `secure: true`
  - **ONLY works with HTTPS** (Cloudflare Tunnel, reverse proxy, etc.)
  - Without HTTPS, secure cookies will NOT work

### 3. Environment Variables in Docker Compose

The `docker-compose.yaml` is already configured to read from `.env`:

```yaml
environment:
  - JWT_SECRET=${JWT_SECRET:-supersecret-change-in-production}
  - KAKEI_USER=${KAKEI_USER:-admin}
  - KAKEI_PASSWORD=${KAKEI_PASSWORD:-admin}
  - NODE_ENV=${NODE_ENV:-production}
```

---

## 🌐 Deployment with Cloudflare Tunnel

### Option 1: Cloudflare Tunnel (Recommended)

```bash
# Install cloudflared
brew install cloudflare/cloudflare/cloudflared

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create kakei

# Configure tunnel (cloudflared.yml)
tunnel: kakei
credentials-file: /path/to/credentials.json

ingress:
  - hostname: kakei.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

### Option 2: Reverse Proxy (Nginx/Caddy)

```nginx
# Nginx with SSL
server {
    listen 443 ssl http2;
    server_name kakei.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔒 Security Checklist

Before exposing to the Internet, verify:

- [ ] **JWT_SECRET** randomly generated (≥32 characters)
- [ ] **KAKEI_USER** changed from default "admin"
- [ ] **KAKEI_PASSWORD** strong (≥12 characters, uppercase, lowercase, numbers, symbols)
- [ ] **NODE_ENV=production** in `.env`
- [ ] **HTTPS enabled** (via Cloudflare or SSL certificate)
- [ ] **Database backup** configured
- [ ] **Firewall configured** (only necessary ports open)
- [ ] **Logs monitored** for access attempts

---

## 📊 Security Monitoring

### View Login Attempt Logs

```bash
# View container logs
docker-compose logs -f app | grep "login"

# View failed attempts
docker-compose logs app | grep "Invalid credentials"

# View rate limiting blocks
docker-compose logs app | grep "Too many login attempts"
```

### Verify Active Sessions

```bash
# Connect to database
docker-compose exec db psql -U postgres kakei

# View sessions (if you implement session table)
SELECT * FROM user_sessions;
```

---

## 🚨 In Case of Compromise

If you suspect your credentials have been compromised:

### 1. Change Credentials Immediately

```bash
# Edit .env with new credentials
vim .env

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### 2. Review Logs

```bash
# View all recent accesses
docker-compose logs app --since 24h

# Search for suspicious IPs
docker-compose logs app | grep "POST /api/login"
```

### 3. Revoke All Sessions

```bash
# Change JWT_SECRET to invalidate all tokens
# Edit .env with a new JWT_SECRET
# Restart the service
docker-compose restart app
```

---

## 🔐 Best Practices

1. **Never share** your credentials in plain text
2. **Use unique passwords** for Kakei
3. **Change credentials regularly** (every 3-6 months)
4. **Enable 2FA on Cloudflare** if using Cloudflare Tunnel
5. **Keep Docker updated** (`docker-compose pull`)
6. **Monitor logs regularly** for suspicious activity
7. **Set up automatic backups** of the database

---

## 📖 References

- [OWASP Security Best Practices](https://owasp.org/www-project-top-ten/)
- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8725)
- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

---

## 🆘 Support

If you have questions about security configuration, consult:
- GitHub Issues for the project
- ElysiaJS documentation on authentication
- Cloudflare Tunnel guides

**Remember:** Security is a continuous process, not a final state. Stay updated and monitor your installation regularly.
