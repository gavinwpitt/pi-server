import { Response, Request } from "express";

type rfrequest = {
    switchNumbers:number[]
}

const ON = async (req: Request, res: Response) : Promise<void> => {
    try {
        let rfRemote = req.app.get('rfRemote');
        let body:rfrequest = req.body;

        rfRemote.switch(true, body.switchNumbers);

        res.status(200);
        res.end('yes');
    } catch (err) {
        throw err;
    }
}

const OFF = async (req: Request, res: Response) : Promise<void> => {
    try {
        let rfRemote = req.app.get('rfRemote');
        let body:rfrequest = req.body;

        rfRemote.switch(false, body.switchNumbers);

        res.status(200);
        res.end('yes');
    } catch (err) {
        throw err;
    }
}

export { ON, OFF }