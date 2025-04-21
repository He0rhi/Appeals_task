import { Request, Response } from "express";
import { Between, LessThan, MoreThanOrEqual } from "typeorm";
import { Appeal } from "../entities/Appeal";
import { CreateAppealDto } from "../dto/create-appeal.dto";
import { UpdateAppealDto } from "../dto/update-appeal.dto";
import { cancelAllInProgressDto } from "../dto/cancel-all-in-progress.dto";
import { CompleteAppealDto } from "../dto/complete-appeal.dto";
import { AppDataSource } from "../config/database";

export const createAppeal = async (req: Request<{},{},CreateAppealDto>, res: Response): Promise<void> => {
  try {
    const { theme, text } = req.body;
    
    if (!theme || !text) {
      res.status(400).json({ error: "Theme and text are required" });
      return;
    }

    const appeal = await AppDataSource.getRepository(Appeal).save({ theme, text });
    res.status(201).json(appeal);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const startAppeal = async (req: Request<{ id: string }, {}, {}>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appealRepo = AppDataSource.getRepository(Appeal);
    const appeal = await appealRepo.findOne({ where: { id: Number(id) } });
    
    if (!appeal) {
      res.status(404).json({ error: "Appeal not found" });
      return;
    }
    
    if (appeal.status !== "new") {
      res.status(400).json({ error: "Appeal must be in 'new' status to start" });
      return;
    }
    
    appeal.status = "in_progress";
    await appealRepo.save(appeal);
    res.json(appeal);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const completeAppeal = async (req: Request<{ id: string }, {}, CompleteAppealDto>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    const appealRepo = AppDataSource.getRepository(Appeal);
    
    const appeal = await appealRepo.findOne({ where: { id: Number(id) } });
    
    if (!appeal) {
      res.status(404).json({ error: "Appeal not found" });
      return;
    }
    
    if (appeal.status !== "in_progress") {
      res.status(400).json({ error: "Appeal must be in 'in_progress' status to complete" });
      return;
    }
    
    appeal.status = "completed";
    appeal.resolution = resolution || null;
    await appealRepo.save(appeal);
    
    res.json(appeal);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelAppeal = async (req: Request<{ id: string }, {}, UpdateAppealDto>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const appealRepo = AppDataSource.getRepository(Appeal);
    
    const appeal = await appealRepo.findOne({ where: { id: Number(id) } });
    
    if (!appeal) {
      res.status(404).json({ error: "Appeal not found" });
      return;
    }
    
    if (appeal.status === "completed") {
      res.status(400).json({ error: "Completed appeal cannot be canceled" });
      return;
    }
    
    appeal.status = "canceled";
    appeal.cancellationReason = cancellationReason;
    await appealRepo.save(appeal);
    
    res.json(appeal);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, startDate, endDate } = req.query;
    const appealRepo = AppDataSource.getRepository(Appeal);
    const end = new Date(endDate as string);
    const start = new Date(startDate as string);

    let where: any = {};
    
    if (date) {
      const targetDate = new Date(date as string);
      const nextDay = new Date(targetDate);
      nextDay.setDate(targetDate.getDate()+1)
      where.createdAt=Between(
        targetDate,nextDay      );
    }
    
    if (startDate && endDate) {
    end.setDate(end.getDate()+1);

    where.createdAt = Between(start, end)
    }
    else if(startDate){

      where.createdAt = MoreThanOrEqual(start);
    }
    else if(endDate){
      const end = new Date(endDate as string)
      end.setDate(end.getDate()+1);
      
      where.createdAt = LessThan(end);
    }
    
    const appeals = await appealRepo.find({ where });
    res.json(appeals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelAllInProgress = async (req: Request<{},{},cancelAllInProgressDto>, res: Response): Promise<void> => {
  try {
    const { cancellationReason } = req.body;
    const appealRepo = AppDataSource.getRepository(Appeal);
    
    if (!cancellationReason) {
      res.status(400).json({ error: "Cancellation reason is required" });
      return; 
    }

    const result = await appealRepo.update(
      { status: "in_progress" },
      { 
        status: "canceled",
        cancellationReason: cancellationReason 
      }
    );
    
    if (result.affected === 0) {
      res.json({ message: "No in-progress appeals found to cancel" });
      return;
    }
    
    res.json({ 
      message: `Successfully canceled ${result.affected} in-progress appeals`,
      count: result.affected
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};