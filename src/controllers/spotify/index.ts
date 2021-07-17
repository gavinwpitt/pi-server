import { Response, Request } from "express";
import SpotifyPlayRequest from "../../types/spotify/SpotifyPlayRequest";

const GetAuthUrl = async (req: Request, res: Response) : Promise<void> => {
    try {
        let spotifyApiWrapper = req.app.get('spotifyApiWrapper');

        let data = await spotifyApiWrapper.generateAuthUrl();

        res.status(200)
        res.end(data);
    } catch (err) {
        console.log("ERROR - ", err);
        res.status(500).json(err);
    }
}

const GetMyPlaylists = async (req: Request, res: Response) : Promise<void> => {
    try {
        let spotifyApiWrapper = req.app.get('spotifyApiWrapper');

        let data = await spotifyApiWrapper.getPlaylists();

        res.status(200);
        res.json(data);
    } catch (err) {
        console.log("ERROR - ", err);
        res.status(500).json(err);
    }
}

const Authenticate = async (req: Request, res: Response) : Promise<void> => {
    try {
        let spotifyApiWrapper = req.app.get('spotifyApiWrapper');

        let data = await spotifyApiWrapper.authenticate(req.query.code);

        res.status(200);
        res.end("SUCCESS");
    } catch (err) {
        console.log("ERROR - ", err);
        res.status(500).json(err);
    }
}

const GetMyDevices = async (req: Request, res: Response) : Promise<void> => {
    try {
        let spotifyApiWrapper = req.app.get('spotifyApiWrapper');

        let data = await spotifyApiWrapper.getMyDevices();

        res.type('json');
        res.status(200).json(data);
    } catch (err) {
        console.log("ERROR - ", err);
        res.status(500).json(err);
    }
}

const Play = async (req: Request, res: Response) : Promise<void> => {
    try {
        let spotifyApiWrapper = req.app.get('spotifyApiWrapper');
        let playRequest:SpotifyPlayRequest = req.body;
        console.log(playRequest);

        await spotifyApiWrapper.playOnDevice(
            playRequest.DeviceId,
            playRequest.Uri,
            playRequest.Shuffle,
            playRequest.Play,
            playRequest.Volume
        );

        res.status(200);
        res.end('OK');
    } catch (err) {
        console.log("ERROR - ", err);
        res.status(500).json(err);
    }
}

const Search = async (req: Request, res: Response) : Promise<void> => {
    try {
        let spotifyApiWrapper = req.app.get('spotifyApiWrapper');
        let keyword = req.body.keyword;
        let data = await spotifyApiWrapper.search(keyword);

        res.type('json');
        res.status(200).json(data);
    } catch (err) {
        console.log("ERROR - ", err);
        res.status(500).json(err);
    }
}

export { GetAuthUrl, Authenticate, GetMyDevices, GetMyPlaylists, Play, Search }