import { Request, Response } from "express";
import { createPayment, deletePayment, getAllPayments, getPaymentById, updatePayment } from "../services/Payments.service";
import { createPaymentLink } from "../config/payOs";

const createPaymentController = async (req: Request, res: Response) => {
  const p = req.body;
  const result = await createPayment(p);
  res.status(201).json({ message: "Payment created successfully", data: result });
};

const getAllPaymentsController = async (req: Request, res: Response) => {
  const result = await getAllPayments();
  res.status(200).json({ message: "Payments fetched successfully", data: result });
};

const getPaymentByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getPaymentById(Number(id));
  res.status(200).json({ message: "Payment fetched successfully", data: result });
};

const updatePaymentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const p = req.body;
  const result = await updatePayment(Number(id), p);
  res.status(200).json({ message: "Payment updated successfully", data: result });
};

const deletePaymentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deletePayment(Number(id));
  res.status(200).json({ message: "Payment deleted successfully", data: result });
};

const createPayOSCheckoutLinkController = async (req: Request, res: Response) => {
  const { orderCode, amount, description, returnUrl, cancelUrl } = req.body ?? {};

  if (!orderCode || !amount || !description || !returnUrl || !cancelUrl) {
    return res.status(400).json({ message: "Missing required fields: orderCode, amount, description, returnUrl, cancelUrl" });
  }

  try {
    const link = await createPaymentLink({
      orderCode: Number(orderCode),
      amount: Number(amount),
      description,
      returnUrl,
      cancelUrl,
    });
    return res.status(200).json({ message: "Checkout link created", data: link });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to create checkout link", error: error?.message ?? String(error) });
  }
};

export { createPaymentController, getAllPaymentsController, getPaymentByIdController, updatePaymentController, deletePaymentController, createPayOSCheckoutLinkController }; 