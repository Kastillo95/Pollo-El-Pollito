import { 
  type Coop, type InsertCoop,
  type Purchase, type InsertPurchase,
  type Expense, type InsertExpense,
  type Activity, type InsertActivity,
  type Invoice, type InsertInvoice,
  type Mortality, type InsertMortality,
  coops, purchases, expenses, activities, invoices, mortalities
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Coops
  getCoops(): Promise<Coop[]>;
  getCoop(id: number): Promise<Coop | undefined>;
  updateCoop(id: number, coop: Partial<InsertCoop>): Promise<Coop>;
  
  // Purchases
  getPurchases(): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  
  // Expenses
  getExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  
  // Activities
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity>;
  
  // Invoices
  getInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: number): Promise<void>;
  
  // Mortalities
  getMortalities(): Promise<Mortality[]>;
  createMortality(mortality: InsertMortality): Promise<Mortality>;
}

export class DatabaseStorage implements IStorage {
  private invoiceCounter: number = 1;

  constructor() {
    this.initializeCoops();
  }

  private async initializeCoops() {
    try {
      const existingCoops = await db.select().from(coops);
      if (existingCoops.length === 0) {
        const coopsData = [
          { number: 1, quantity: 450, entryDate: new Date('2024-11-15'), status: 'active' },
          { number: 2, quantity: 380, entryDate: new Date('2024-11-10'), status: 'active' },
          { number: 3, quantity: 420, entryDate: new Date('2024-11-05'), status: 'active' },
          { number: 4, quantity: 360, entryDate: new Date('2024-10-28'), status: 'active' },
          { number: 5, quantity: 480, entryDate: new Date('2024-10-20'), status: 'active' },
          { number: 6, quantity: 390, entryDate: new Date('2024-10-15'), status: 'active' },
          { number: 7, quantity: 370, entryDate: new Date('2024-11-25'), status: 'active' },
        ];

        await db.insert(coops).values(coopsData);
      }
    } catch (error) {
      console.log('Coops already initialized or error occurred:', error);
    }
  }

  // Coops
  async getCoops(): Promise<Coop[]> {
    return await db.select().from(coops).orderBy(coops.number);
  }

  async getCoop(id: number): Promise<Coop | undefined> {
    const [coop] = await db.select().from(coops).where(eq(coops.id, id));
    return coop || undefined;
  }

  async updateCoop(id: number, coopUpdate: Partial<InsertCoop>): Promise<Coop> {
    const [updatedCoop] = await db
      .update(coops)
      .set(coopUpdate)
      .where(eq(coops.id, id))
      .returning();
    
    if (!updatedCoop) {
      throw new Error('Coop not found');
    }
    
    return updatedCoop;
  }

  // Purchases
  async getPurchases(): Promise<Purchase[]> {
    return await db.select().from(purchases).orderBy(desc(purchases.date));
  }

  async createPurchase(purchaseData: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db
      .insert(purchases)
      .values({
        ...purchaseData,
        notes: purchaseData.notes || null,
      })
      .returning();

    // If it's a chicken purchase, update coop 7 and rotate
    if (purchaseData.type === 'pollo') {
      await this.rotateCoops(purchaseData.quantity);
    }

    return purchase;
  }

  private async rotateCoops(newChickens: number) {
    const allCoops = await this.getCoops();
    
    // Shift all coops: 1->2, 2->3, ..., 6->7
    for (let i = 1; i <= 6; i++) {
      const currentCoop = allCoops.find(c => c.number === i);
      const nextCoop = allCoops.find(c => c.number === i + 1);
      
      if (currentCoop && nextCoop) {
        await this.updateCoop(currentCoop.id, {
          quantity: nextCoop.quantity,
          entryDate: nextCoop.entryDate,
        });
      }
    }

    // Update coop 7 with new chickens
    const coop7 = allCoops.find(c => c.number === 7);
    if (coop7) {
      await this.updateCoop(coop7.id, {
        quantity: newChickens,
        entryDate: new Date(),
      });
    }
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses).orderBy(desc(expenses.date));
  }

  async createExpense(expenseData: InsertExpense): Promise<Expense> {
    const [expense] = await db
      .insert(expenses)
      .values(expenseData)
      .returning();
    
    return expense;
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities).orderBy(desc(activities.scheduledDate));
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values({
        ...activityData,
        description: activityData.description || null,
        coopNumber: activityData.coopNumber || null,
        completed: activityData.completed || false,
        recurring: activityData.recurring || false,
      })
      .returning();
    
    return activity;
  }

  async updateActivity(id: number, activityUpdate: Partial<InsertActivity>): Promise<Activity> {
    const [updatedActivity] = await db
      .update(activities)
      .set(activityUpdate)
      .where(eq(activities.id, id))
      .returning();
    
    if (!updatedActivity) {
      throw new Error('Activity not found');
    }
    
    return updatedActivity;
  }

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(desc(invoices.date));
  }

  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const total = Number(invoiceData.pricePerPound) * Number(invoiceData.pounds);
    
    const [invoice] = await db
      .insert(invoices)
      .values({
        ...invoiceData,
        invoiceNumber: `Fact-${String(this.invoiceCounter++).padStart(4, '0')}`,
        clientPhone: invoiceData.clientPhone || null,
        status: invoiceData.status || 'paid',
        total: total.toString(),
      })
      .returning();
    
    // Reduce chickens from coop 1
    const allCoops = await this.getCoops();
    const coop1 = allCoops.find(c => c.number === 1);
    if (coop1 && coop1.quantity >= invoiceData.quantity) {
      await this.updateCoop(coop1.id, {
        quantity: coop1.quantity - invoiceData.quantity
      });
    }
    
    return invoice;
  }

  async updateInvoice(id: number, invoiceUpdate: Partial<InsertInvoice>): Promise<Invoice> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set(invoiceUpdate)
      .where(eq(invoices.id, id))
      .returning();
    
    if (!updatedInvoice) {
      throw new Error('Invoice not found');
    }
    
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  // Mortalities
  async getMortalities(): Promise<Mortality[]> {
    return await db.select().from(mortalities).orderBy(desc(mortalities.date));
  }

  async createMortality(mortalityData: InsertMortality): Promise<Mortality> {
    const [mortality] = await db
      .insert(mortalities)
      .values({
        ...mortalityData,
        description: mortalityData.description || null,
      })
      .returning();

    // Reduce chickens from specified coop
    const allCoops = await this.getCoops();
    const coop = allCoops.find(c => c.number === mortalityData.coopNumber);
    if (coop && coop.quantity >= mortalityData.quantity) {
      await this.updateCoop(coop.id, {
        quantity: coop.quantity - mortalityData.quantity
      });
    }

    return mortality;
  }
}

export const storage = new DatabaseStorage();
