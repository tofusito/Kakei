import { pgTable, serial, text, numeric, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: text('username').unique().notNull(),
    passwordHash: text('password_hash').notNull(),
});

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    icon: text('icon').notNull(), // Lucide icon name
    type: text('type', { enum: ['income', 'expense', 'investment'] }).notNull(),
    meta: text('meta'), // For ordering or colors if needed later
});

export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    categoryId: integer('category_id').references(() => categories.id),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    classification: text('classification', { enum: ['survival', 'quality', 'pleasure', 'waste'] }),
    note: text('note').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
    category: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
    user: one(users, {
        fields: [transactions.userId],
        references: [users.id],
    }),
}));
