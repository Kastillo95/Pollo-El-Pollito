import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPurchaseSchema, insertExpenseSchema, insertActivitySchema, insertInvoiceSchema, insertCoopSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Coops routes
  app.get("/api/coops", async (req, res) => {
    try {
      const coops = await storage.getCoops();
      res.json(coops);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coops" });
    }
  });

  app.put("/api/coops/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertCoopSchema.parse(req.body);
      const updatedCoop = await storage.updateCoop(id, updateData);
      res.json(updatedCoop);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update coop" });
    }
  });

  // Purchases routes
  app.get("/api/purchases", async (req, res) => {
    try {
      const purchases = await storage.getPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });

  app.post("/api/purchases", async (req, res) => {
    try {
      const purchaseData = insertPurchaseSchema.parse(req.body);
      const purchase = await storage.createPurchase(purchaseData);
      res.json(purchase);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create purchase" });
    }
  });

  // Expenses routes
  app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await storage.getExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const expenseData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(expenseData);
      res.json(expense);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create expense" });
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.json(activity);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create activity" });
    }
  });

  app.put("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedActivity = await storage.updateActivity(id, updateData);
      res.json(updatedActivity);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update activity" });
    }
  });

  // Invoices routes
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(invoiceData);
      res.json(invoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create invoice" });
    }
  });

  app.put("/api/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedInvoice = await storage.updateInvoice(id, updateData);
      res.json(updatedInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update invoice" });
    }
  });

  app.delete("/api/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteInvoice(id);
      res.json({ message: "Invoice deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to delete invoice" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
