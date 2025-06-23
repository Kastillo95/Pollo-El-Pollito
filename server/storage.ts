import { 
  type Coop, type InsertCoop,
  type Purchase, type InsertPurchase,
  type Expense, type InsertExpense,
  type Activity, type InsertActivity,
  type Invoice, type InsertInvoice,
  type Mortality, type InsertMortality
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private coops: Map<number, Coop>;
  private purchases: Map<number, Purchase>;
  private expenses: Map<number, Expense>;
  private activities: Map<number, Activity>;
  private invoices: Map<number, Invoice>;
  private mortalities: Map<number, Mortality>;
  private currentCoopId: number;
  private currentPurchaseId: number;
  private currentExpenseId: number;
  private currentActivityId: number;
  private currentInvoiceId: number;
  private currentInvoiceNumber: number;
  private currentMortalityId: number;

  constructor() {
    this.coops = new Map();
    this.purchases = new Map();
    this.expenses = new Map();
    this.activities = new Map();
    this.invoices = new Map();
    this.mortalities = new Map();
    this.currentCoopId = 1;
    this.currentPurchaseId = 1;
    this.currentExpenseId = 1;
    this.currentActivityId = 1;
    this.currentInvoiceId = 1;
    this.currentInvoiceNumber = 1;
    this.currentMortalityId = 1;
    
    // Initialize 7 coops with sample data
    this.initializeCoops();
  }

  private initializeCoops() {
    const coopsData = [
      { number: 1, quantity: 450, entryDate: new Date('2024-11-15'), status: 'active' },
      { number: 2, quantity: 380, entryDate: new Date('2024-11-10'), status: 'active' },
      { number: 3, quantity: 420, entryDate: new Date('2024-11-05'), status: 'active' },
      { number: 4, quantity: 360, entryDate: new Date('2024-10-28'), status: 'active' },
      { number: 5, quantity: 480, entryDate: new Date('2024-10-20'), status: 'active' },
      { number: 6, quantity: 390, entryDate: new Date('2024-10-15'), status: 'active' },
      { number: 7, quantity: 370, entryDate: new Date('2024-11-25'), status: 'active' },
    ];

    coopsData.forEach(coopData => {
      const coop: Coop = {
        id: this.currentCoopId++,
        ...coopData,
        entryDate: coopData.entryDate,
      };
      this.coops.set(coop.id, coop);
    });
  }

  // Coops
  async getCoops(): Promise<Coop[]> {
    return Array.from(this.coops.values()).sort((a, b) => a.number - b.number);
  }

  async getCoop(id: number): Promise<Coop | undefined> {
    return this.coops.get(id);
  }

  async updateCoop(id: number, coopUpdate: Partial<InsertCoop>): Promise<Coop> {
    const existingCoop = this.coops.get(id);
    if (!existingCoop) {
      throw new Error('Coop not found');
    }
    
    const updatedCoop: Coop = { ...existingCoop, ...coopUpdate };
    this.coops.set(id, updatedCoop);
    return updatedCoop;
  }

  // Purchases
  async getPurchases(): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createPurchase(purchaseData: InsertPurchase): Promise<Purchase> {
    const purchase: Purchase = {
      id: this.currentPurchaseId++,
      ...purchaseData,
      notes: purchaseData.notes || null,
      date: new Date(),
    };
    this.purchases.set(purchase.id, purchase);

    // If it's a chicken purchase, update coop 7 and rotate
    if (purchaseData.type === 'pollo') {
      await this.rotateCoops(purchaseData.quantity);
    }

    return purchase;
  }

  private async rotateCoops(newChickens: number) {
    const coops = await this.getCoops();
    
    // Shift all coops: 1->2, 2->3, ..., 6->7
    for (let i = 1; i <= 6; i++) {
      const currentCoop = coops.find(c => c.number === i);
      const nextCoop = coops.find(c => c.number === i + 1);
      
      if (currentCoop && nextCoop) {
        await this.updateCoop(currentCoop.id, {
          quantity: nextCoop.quantity,
          entryDate: nextCoop.entryDate,
        });
      }
    }

    // Update coop 7 with new chickens
    const coop7 = coops.find(c => c.number === 7);
    if (coop7) {
      await this.updateCoop(coop7.id, {
        quantity: newChickens,
        entryDate: new Date(),
      });
    }
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createExpense(expenseData: InsertExpense): Promise<Expense> {
    const expense: Expense = {
      id: this.currentExpenseId++,
      ...expenseData,
      date: new Date(),
    };
    this.expenses.set(expense.id, expense);
    return expense;
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values()).sort((a, b) => 
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    );
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const activity: Activity = {
      id: this.currentActivityId++,
      ...activityData,
      description: activityData.description || null,
      coopNumber: activityData.coopNumber || null,
      completed: activityData.completed || false,
      recurring: activityData.recurring || false,
    };
    this.activities.set(activity.id, activity);
    return activity;
  }

  async updateActivity(id: number, activityUpdate: Partial<InsertActivity>): Promise<Activity> {
    const existingActivity = this.activities.get(id);
    if (!existingActivity) {
      throw new Error('Activity not found');
    }
    
    const updatedActivity: Activity = { ...existingActivity, ...activityUpdate };
    this.activities.set(id, updatedActivity);
    return updatedActivity;
  }

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    const total = Number(invoiceData.pricePerPound) * Number(invoiceData.pounds);
    const invoice: Invoice = {
      id: this.currentInvoiceId++,
      invoiceNumber: `Fact-${String(this.currentInvoiceNumber++).padStart(4, '0')}`,
      ...invoiceData,
      clientPhone: invoiceData.clientPhone || null,
      status: invoiceData.status || 'paid',
      total: total.toString(),
      date: new Date(),
    };
    this.invoices.set(invoice.id, invoice);
    
    // Reduce chickens from coop 1
    const coop1 = Array.from(this.coops.values()).find(c => c.number === 1);
    if (coop1 && coop1.quantity >= invoiceData.quantity) {
      await this.updateCoop(coop1.id, {
        quantity: coop1.quantity - invoiceData.quantity
      });
    }
    
    return invoice;
  }

  async updateInvoice(id: number, invoiceUpdate: Partial<InsertInvoice>): Promise<Invoice> {
    const existingInvoice = this.invoices.get(id);
    if (!existingInvoice) {
      throw new Error('Invoice not found');
    }
    
    const updatedInvoice: Invoice = { ...existingInvoice, ...invoiceUpdate };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<void> {
    this.invoices.delete(id);
  }

  // Mortalities
  async getMortalities(): Promise<Mortality[]> {
    return Array.from(this.mortalities.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createMortality(mortalityData: InsertMortality): Promise<Mortality> {
    const mortality: Mortality = {
      id: this.currentMortalityId++,
      ...mortalityData,
      description: mortalityData.description || null,
      date: new Date(),
    };
    this.mortalities.set(mortality.id, mortality);

    // Reduce chickens from specified coop
    const coop = Array.from(this.coops.values()).find(c => c.number === mortalityData.coopNumber);
    if (coop && coop.quantity >= mortalityData.quantity) {
      await this.updateCoop(coop.id, {
        quantity: coop.quantity - mortalityData.quantity
      });
    }

    return mortality;
  }
}

export const storage = new MemStorage();
