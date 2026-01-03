# KAKEI (家計)

> **Philosophy**: Stoic. Minimalist. Frictionless.
> "Wealth consists not in having great possessions, but in having few wants." — Epictetus

**Kakei** is a personal finance tracker designed for the disciplined mind. It features a brutalist, OLED-optimized True Black interface (`#000000`) and a friction-free entry system for tracking Income, Expenses, and Investments.

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

3.  Initialize the Database (Run from the app container):
    ```bash
    # Run Migrations & Seed Data
    docker-compose exec app bun run database/migrate.ts
    docker-compose exec app bun run database/seed.ts
    ```

4.  Open **http://localhost:3000**

## License

Kakei is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.
See the [LICENSE](LICENSE) file for details.
