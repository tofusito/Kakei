<div align="center">

# KAKEI (家計)

> **Philosophy**: Stoic. Minimalist. Frictionless.  
> *"Wealth consists not in having great possessions, but in having few wants."* — Epictetus

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![ElysiaJS](https://img.shields.io/badge/ElysiaJS-EB5757?style=for-the-badge&logo=elysia&logoColor=white)](https://elysiajs.com)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/agpl-3.0)

<a href="https://www.buymeacoffee.com/tofusito" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

</div>

---

**Kakei** is a personal finance tracker designed for the disciplined mind. It features a brutalist, OLED-optimized interface with **True Black** (`#000000`) and **Light Mode** themes, ensuring a friction-free experience for tracking Income, Expenses, and Investments.

## ✨ Features

### 🎨 **Elegant & Adaptive UI**
- **Dual Theme Support**: Toggle between **True Black** (OLED-optimized) and **Light Mode**. Theme preference is persisted automatically.
- **Internationalization (i18n)**: Fully localized in **English** 🇺🇸 and **Spanish** 🇪🇸.
- **Responsive Design**: Flawless experience on both mobile and desktop.
- **Smooth Animations**: Glassmorphism effects and delightful micro-interactions.

### 💸 **Transaction Management**
- **Frictionless Entry**: Large, accessible buttons for **Expense**, **Income**, and **Investment**.
- **Smart Categorization**: Visual grid with translated categories (e.g., Housing/Vivienda, Salary/Salario).
- **Edit & Delete**: Full control over your history - modify details or remove entries effortlessly.
- **Classification**: Categorize expenses by necessity:
  - 🟢 **Vital**: Survival needs
  - 🔵 **Useful**: Quality of life
  - 🟡 **Treat**: Pleasures
  - 🔴 **Waste**: Regrettable spending

### 📊 **Visual Dashboard**
- **Real-time Balance**: Instant overview of your financial health.
- **Expense Ring**: Interactive donut chart showing spending distribution.
- **Detailed History**: Paginated transaction list with advanced filtering by **Time** (Week, Month, Year) and **Type**.

### 🔒 **Privacy-First Architecture**
- **Self-Hosted**: Your data lives on your machine.
- **No Tracking**: Zero analytics, zero telemetry.
- **Dockerized**: Single-container deployment with persistent storage.

---

## 📸 Gallery

<div align="center">
  <img src="https://github.com/user-attachments/assets/placeholder-light.png" alt="Light Mode" width="45%">
  <img src="https://github.com/user-attachments/assets/placeholder-dark.png" alt="Dark Mode" width="45%">
</div>

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/kakei.git
   cd kakei
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d --build
   ```

3. **Open your browser**:
   ```
   http://localhost:3000
   ```

> **Note**: Database migrations and seeding run automatically on startup. Your data persists in a Docker volume (`kakei_data`).

### Stopping the Application

```bash
docker-compose down
```

To remove all data (including the database):
```bash
docker-compose down -v
```

---

## 🛠️ Tech Stack

### Runtime & Framework
- **[Bun](https://bun.sh)**: Ultra-fast JavaScript runtime.
- **[ElysiaJS](https://elysiajs.com)**: High-performance backend framework.

### Frontend
- **React 18**: Component-based UI.
- **Vite**: Next-generation frontend tooling.
- **TailwindCSS**: Utility-first styling.
- **Lucide Icons**: Crisp, consistent iconography.
- **i18next**: Robust internationalization framework.

### Backend & Database
- **PostgreSQL 15**: Reliable relational database.
- **Drizzle ORM**: TypeScript-first ORM for type safety.
- **Docker**: Containerization for consistent deployment.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **AGPL-3.0** License. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ and discipline**

*Track your wealth. Master your wants.*

</div>
