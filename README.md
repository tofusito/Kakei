# KAKEI (家計)

> **Philosophy**: Stoic. Minimalist. Frictionless.
> "Wealth consists not in having great possessions, but in having few wants." — Epictetus

**Kakei** is a personal finance tracker designed for the disciplined mind. It features a brutalist, OLED-optimized True Black interface (`#000000`) and a friction-free entry system for tracking Income, Expenses, and Investments.

## Features

-   ✨ **Minimalist UI**: True black (`#000000`) design optimized for OLED displays
-   💸 **Quick Transaction Entry**: Add expenses, income, and investments in seconds
-   📊 **Smart Filtering**: Filter transactions by week, month, year, or custom date range
-   🏷️ **Expense Classification**: Categorize expenses as Vital, Useful, Treat, or Waste
-   📈 **Visual Dashboard**: Track your balance with charts and summaries
-   🔒 **Privacy-First**: Self-hosted, your data stays with you

## Architecture

Kakei is distributed as a single, self-contained **Production Pack**:
-   **Frontend**: React + Vite (Built into the pack)
-   **Backend**: ElysiaJS (Serves API + Frontend)
-   **Database**: Postgres (Dedicated container)

All traffic is handled on a single port (**3000**).

## Tech Stack

-   **Runtime**: [Bun](https://bun.sh) (All-in-one Toolkit)
-   **Backend**: [ElysiaJS](https://elysiajs.com) (High-performance framework)
-   **Frontend**: React, TailwindCSS, Lucide Icons, Recharts
-   **Database**: PostgreSQL + Drizzle ORM

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/kakei.git
    cd kakei
    ```

2.  Start the application (App + Database):
    ```bash
    docker-compose up -d --build
    ```

3.  Open **http://localhost:3000**

> **Note**: Database migrations and seeding run automatically on startup. Your data persists in a Docker volume.

## Usage

### Adding Transactions

1. Click on **Expense**, **Income**, or **Invest** buttons
2. Select a category from the dropdown
3. Enter the amount and a note
4. For expenses, classify them:
   - **Vital**: Essential needs (housing, groceries, transport)
   - **Useful**: Quality of life improvements
   - **Treat**: Pleasures and luxuries
   - **Waste**: Regrettable purchases
5. Confirm to save

### Filtering Transactions

Click the filter icon (⚡) next to "Transactions" to view:
-   **All Time**: Show all transactions
-   **This Week**: Current week's transactions
-   **This Month**: Current month's transactions
-   **This Year**: Current year's transactions
-   **Specific Time**: Custom date range

## Development

### Local Development (without Docker)

**Backend:**
```bash
cd backend
bun install
bun run dev
```

**Frontend:**
```bash
cd frontend
bun install
bun run dev
```

### Database Schema Changes

```bash
cd backend
bun run generate  # Generate migration files
```

Migrations run automatically on container startup.

## License

Kakei is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.
See the [LICENSE](LICENSE) file for details.
