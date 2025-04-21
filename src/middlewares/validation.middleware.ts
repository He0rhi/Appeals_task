import { validate } from "class-validator"; 
import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";

export const validateDTO =<T extends object> (dtoClass:new()=>T)=>{
return async (req:Request, res:Response, next:NextFunction)=>{
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto);

    if(errors.length>0){
        res.status(400).json({errors:errors.map(e=>({field: e.property, constraints: e.constraints}))})
        return;
    }
    req.body = dto;
    next()
}
}