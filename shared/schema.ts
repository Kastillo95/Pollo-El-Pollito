import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const coops = pgTable("coops", {
  id: serial("id").primaryKey(),
  number: integer("number").notNull().unique(),
  quantity: integer("quantity").notNull().default(0),
  entryDate: timestamp("entry_date").notNull().defaultNow(),
  status: text("status").notNull().default("active"), // active, inactive
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // pollo, alimento, medicamento, equipo
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  supplier: text("supplier").notNull(),
  notes: text("notes"),
  date: timestamp("date").notNull().defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // mantenimiento, servicios, transporte, salarios, otros
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // limpieza, alimentacion, agua, vacunacion, inspeccion
  coopNumber: integer("coop_number"), // null means all coops
  description: text("description"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  completed: boolean("completed").notNull().default(false),
  recurring: boolean("recurring").notNull().default(false),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone"),
  concept: text("concept").notNull(),
  quantity: integer("quantity").notNull(),
  pounds: decimal("pounds", { precision: 10, scale: 2 }).notNull(),
  pricePerPound: decimal("price_per_pound", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("paid"), // paid, pending, cancelled
  date: timestamp("date").notNull().defaultNow(),
});

export const mortalities = pgTable("mortalities", {
  id: serial("id").primaryKey(),
  coopNumber: integer("coop_number").notNull(),
  quantity: integer("quantity").notNull(),
  cause: text("cause").notNull(), // enfermedad, accidente, natural, desconocida
  description: text("description"),
  date: timestamp("date").notNull().defaultNow(),
});

// Insert schemas
export const insertCoopSchema = createInsertSchema(coops).omit({
  id: true,
}).partial();

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  date: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  date: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  invoiceNumber: true,
  total: true,
  date: true,
});

export const insertMortalitySchema = createInsertSchema(mortalities).omit({
  id: true,
  date: true,
});

// Types
export type Coop = typeof coops.$inferSelect;
export type InsertCoop = z.infer<typeof insertCoopSchema>;

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type Mortality = typeof mortalities.$inferSelect;
export type InsertMortality = z.infer<typeof insertMortalitySchema>;
