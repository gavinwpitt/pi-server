import { Router } from "express";
import { ON, OFF } from "../../controllers/rfremote";

const rfremoteRouter: Router = Router();

const basePath: string = "rfremote";

rfremoteRouter.post(`/${basePath}/ON`, ON);

rfremoteRouter.post(`/${basePath}/OFF`, OFF);

export default rfremoteRouter;