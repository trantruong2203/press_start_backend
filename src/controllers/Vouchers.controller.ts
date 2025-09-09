import { Request, Response } from "express";
import { createVoucher, deleteVoucher, getAllVouchers, getVoucherById, updateVoucher } from "../services/Vouchers.service";

const createVoucherController = async (req: Request, res: Response) => {
  const voucher = req.body;
  const result = await createVoucher(voucher);
  res.status(201).json({ message: "Voucher created successfully", data: result });
};

const getAllVouchersController = async (req: Request, res: Response) => {
  const result = await getAllVouchers();
  res.status(200).json({ message: "Vouchers fetched successfully", data: result });
};

const getVoucherByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getVoucherById(Number(id));
  res.status(200).json({ message: "Voucher fetched successfully", data: result });
};

const updateVoucherController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const voucher = req.body;
  const result = await updateVoucher(Number(id), voucher);
  res.status(200).json({ message: "Voucher updated successfully", data: result });
};

const deleteVoucherController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteVoucher(Number(id));
  res.status(200).json({ message: "Voucher deleted successfully", data: result });
};

export { createVoucherController, getAllVouchersController, getVoucherByIdController, updateVoucherController, deleteVoucherController }; 