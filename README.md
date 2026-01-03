# KAKEI (家計)

> **Philosophy**: Stoic. Minimalist. Frictionless.  
> *"Wealth consists not in having great possessions, but in having few wants."* — Epictetus

**Kakei** is a personal finance tracker designed for the disciplined mind. It features a brutalist, OLED-optimized interface with True Black (`#000000`) and Dark Mode themes, and a friction-free entry system for tracking Income, Expenses, and Investments.

---

## ✨ Features

### 🎨 **Elegant UI**
- **Dual Theme Support**: True Black (OLED-optimized) and Light Mode
- **Minimalist Design**: Clean, distraction-free interface
- **Responsive**: Optimized for mobile and desktop
- **Smooth Animations**: Delightful micro-interactions

### 💸 **Quick Transaction Entry**
- **One-Click Access**: Large, accessible buttons for Expense, Income, and Investment
- **Category Selection**: Visual grid of 10 expense categories, 3 income sources, and investment options
- **Smart Classification**: Categorize expenses as:
  - 🟢 **Vital**: Essential needs (survival)
  - 🔵 **Useful**: Quality of life improvements
  - 🟡 **Treat**: Pleasures and luxuries
  - 🔴 **Waste**: Regrettable purchases

### 📊 **Visual Dashboard**
- **Balance Overview**: Real-time balance with income, expenses, and investments
- **Expense Ring**: Interactive donut chart showing expense distribution by classification
- **Trend Chart**: Visual representation of daily spending patterns
- **Smart Breakdown**: Click the expense ring to see detailed classification breakdown

### 🔍 **Advanced Filtering**
- **All Time**: View complete transaction history
- **This Week**: Current week's transactions
- **This Month**: Current month's transactions
- **This Year**: Current year's transactions
- **Custom Range**: Specific date range selection

### 🔒 **Privacy-First**
- **Self-Hosted**: Your data stays with you
- **No Tracking**: No analytics, no telemetry
- **Docker-Based**: Easy deployment and data persistence

---

## 🏗️ Architecture

Kakei is distributed as a single, self-contained **Production Pack**:

```
┌─────────────────────────────────────┐
│         Docker Container            │
│  ┌───────────────────────────────┐  │
│  │   ElysiaJS Backend (Bun)      │  │
│  │   - API Routes                │  │
│  │   - Static File Serving       │  │
│  │   - Built React Frontend      │  │
│  └───────────────────────────────┘  │
│                ↓                     │
│  ┌───────────────────────────────┐  │
│  │   PostgreSQL Database         │  │
│  │   - Drizzle ORM               │  │
│  │   - Persistent Volume         │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
         Port 3000 (HTTP)
```

All traffic is handled on a single port (**3000**).

---

## 🛠️ Tech Stack

### Runtime & Framework
- **[Bun](https://bun.sh)**: All-in-one JavaScript runtime and toolkit
- **[ElysiaJS](https://elysiajs.com)**: High-performance backend framework

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful, consistent icons
- **Recharts**: Composable charting library
- **Axios**: HTTP client
- **clsx**: Conditional className utility

### Backend & Database
- **PostgreSQL 15**: Relational database
- **Drizzle ORM**: Type-safe database toolkit
- **JWT**: Authentication tokens

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

## 📱 Usage Guide

### 1. Dashboard Overview

The dashboard displays:
- **Balance Card**: Current balance with income, expenses, and investments
- **Expense Ring**: Interactive visualization of expense classifications (click to expand)
- **Quick Actions**: Three large buttons for adding transactions
- **Transaction List**: Recent transactions with filtering options

### 2. Adding Transactions

#### Adding an Expense
1. Click the **EXPENSE** button (red with down arrow)
2. Select a category from the grid:
   - Housing, Groceries, Transport, Subscriptions, Services
   - Health, Leisure, Shopping, Gifts Given, Other
3. Enter the amount (e.g., `50.00`)
4. Add a note (e.g., "Weekly groceries")
5. **Classify the expense**:
   - 🟢 **Vital**: For essentials (rent, food, utilities)
   - 🔵 **Useful**: For quality improvements (gym, courses)
   - 🟡 **Treat**: For pleasures (dining out, entertainment)
   - 🔴 **Waste**: For regrettable purchases
6. Click **CONFIRM**

#### Adding Income
1. Click the **INCOME** button (green with up arrow)
2. Select a source:
   - Salary, Gifts Received, Refunds
3. Enter the amount and note
4. Click **CONFIRM**

#### Adding an Investment
1. Click the **INVEST** button (blue with trending arrow)
2. Select investment type
3. Enter the amount and note
4. Click **CONFIRM**

### 3. Viewing Expense Breakdown

Click the **colored ring** next to "STATUS" in the balance card to open a detailed modal showing:
- Percentage and amount for each classification
- Visual progress bars
- Total breakdown

### 4. Filtering Transactions

Click the **filter icon** (⚡) next to "TRANSACTIONS" to filter by:
- **All Time**: Complete history
- **This Week**: Monday to Sunday of current week
- **This Month**: Current calendar month
- **This Year**: January to December of current year
- **Specific Time**: Custom date range (coming soon)

### 5. Theme Switching

Click the **settings icon** (⚙️) in the top-right corner to toggle between:
- 🌙 **Dark Mode**: True black OLED-optimized theme
- ☀️ **Light Mode**: Clean, bright theme

Your theme preference is saved automatically.

---

## 🔧 Development

### Local Development (without Docker)

#### Backend Setup
```bash
cd backend
bun install
bun run dev
```
Backend runs on `http://localhost:3000`

#### Frontend Setup
```bash
cd frontend
bun install
bun run dev
```
Frontend runs on `http://localhost:5173` (with proxy to backend)

### Database Management

#### Generate Migration
```bash
cd backend
bun run generate
```

#### Apply Migrations Manually
```bash
cd backend
bun run migrate
```

> Migrations run automatically on container startup in production.

### Project Structure

```
kakei/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Main server file
│   │   ├── db.ts              # Database connection
│   │   └── routes/            # API routes
│   │       ├── dashboard.ts   # Dashboard endpoints
│   │       ├── transactions.ts # Transaction CRUD
│   │       └── settings.ts    # User settings
│   ├── database/
│   │   ├── schema.ts          # Drizzle schema
│   │   ├── migrate.ts         # Migration runner
│   │   ├── seed.ts            # Seed data
│   │   └── drizzle/           # Generated migrations
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main component
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities
│   │   └── types/             # TypeScript types
│   └── package.json
├── docker-compose.yaml
├── Dockerfile
└── README.md
```

---

## 🎯 Roadmap

- [ ] **Budget Goals**: Set monthly budgets per category
- [ ] **Recurring Transactions**: Auto-add subscriptions and salaries
- [ ] **Export Data**: CSV/JSON export functionality
- [ ] **Multi-Currency**: Support for multiple currencies
- [ ] **Reports**: Monthly/yearly financial reports
- [ ] **Mobile App**: Native mobile application
- [ ] **Backup/Restore**: Easy data backup and restoration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Kakei is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

This means:
- ✅ You can use, modify, and distribute this software
- ✅ You can use it for commercial purposes
- ⚠️ You must disclose the source code of any modifications
- ⚠️ If you run a modified version as a service, you must make the source available

See the [LICENSE](LICENSE) file for full details.

---

## 🙏 Acknowledgments

- **Epictetus** for the philosophical foundation
- **Bun Team** for the amazing runtime
- **ElysiaJS Team** for the elegant framework
- **Tailwind Labs** for the utility-first CSS framework

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation above

---

<div align="center">

**Built with ❤️ and discipline**

*Track your wealth. Master your wants.*

</div>
