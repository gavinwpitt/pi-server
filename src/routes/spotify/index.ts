import { Router } from "express";
import { GetAuthUrl, Authenticate, GetMyDevices, GetMyPlaylists, Play, Search } from "../../controllers/spotify";

const spotifyRouter: Router = Router();

const basePath: string = "spotify";

spotifyRouter.get(`/${basePath}/GetAuthUrl`, GetAuthUrl);

spotifyRouter.get(`/${basePath}/callback`, Authenticate);

spotifyRouter.get(`/${basePath}/Devices`, GetMyDevices);

spotifyRouter.get(`/${basePath}/Playlists`, GetMyPlaylists);

spotifyRouter.post(`/${basePath}/Play`, Play);

spotifyRouter.post(`/${basePath}/Search`, Search);

export default spotifyRouter;