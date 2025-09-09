import { Request, Response } from "express";
import { createPlatform, deletePlatform, getAllPlatforms, getPlatformById, updatePlatform } from "../services/Platforms.service";

const createPlatformController = async (req: Request, res: Response) => {
  const platform = req.body;
  const result = await createPlatform(platform);
  res.status(201).json({
    message: "Platform created successfully",
    data: result,
  });
};

const getAllPlatformsController = async (req: Request, res: Response) => {
  const result = await getAllPlatforms();
  res.status(200).json({
    message: "Platforms fetched successfully",
    data: result,
  });
};

const getPlatformByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getPlatformById(Number(id));
  res.status(200).json({
    message: "Platform fetched successfully",
    data: result,
  });
};

const updatePlatformController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const platform = req.body;
  const result = await updatePlatform(Number(id), platform);
  res.status(200).json({
    message: "Platform updated successfully",
    data: result,
  });
};

const deletePlatformController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deletePlatform(Number(id));
  res.status(200).json({
    message: "Platform deleted successfully",
    data: result,
  });
};

export { createPlatformController, getAllPlatformsController, getPlatformByIdController, updatePlatformController, deletePlatformController }; 