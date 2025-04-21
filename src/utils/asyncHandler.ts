import { Request, Response, NextFunction} from "express";

type AsyncRequestHandler<ReqBody=any,Params=any> = (
  req: Request<Params,{},ReqBody>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler =<ReqBody=any, Params=any> (fn: AsyncRequestHandler<ReqBody,Params>) => {
  return (req: Request<Params,{},ReqBody>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};