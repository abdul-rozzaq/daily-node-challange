import { Request, Response } from 'express';




export default function pageMiddleware(req: Request, res: Response) {
    console.log(req.params);

    return req.next!();
}



