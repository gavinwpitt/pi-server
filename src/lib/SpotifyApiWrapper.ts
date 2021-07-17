import SpotifyWebApi from 'spotify-web-api-node';
import { setIntervalAsync } from 'set-interval-async/dynamic'
import { SpotifyTrackObject } from '../types/spotify/SpotifyTrackObject'
import SpotifyArtistObject from '../types/spotify/SpotifyArtistObject'

enum PlayType {
    Track,
    Album,
    Artist,
    Playlist
}

type SpotifyPlaylistObject = {
    name:string,
    description:string,
    uri:string,
    owner:string,
    trackCount:number
}

// NO ERROR HANDLING - CALLERS ARE RESPONSIBLE FOR CATCHING ERRORS
class SpotifyApiWrapper {    
    private spotifyApi:SpotifyWebApi;

    constructor(clientIdStr:string, clientSecretString:string) {

        this.spotifyApi = new SpotifyWebApi({
            clientId: clientIdStr,
            clientSecret: clientSecretString,
            redirectUri: "http://192.168.1.69:4001/spotify/callback"
        });
    }

    public async generateAuthUrl() {
        var scopes = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'app-remote-control', 'user-library-read'];
        return await this.spotifyApi.createAuthorizeURL(scopes, "");
    }

    public async authenticate(code:string) {
        let data = await this.spotifyApi.authorizationCodeGrant(code);

        await this.spotifyApi.setAccessToken(data.body.access_token);
        await this.spotifyApi.setRefreshToken(data.body.refresh_token);

        // Set timeout to auto refresh token
        setIntervalAsync(async () => {
            let data = await this.spotifyApi.refreshAccessToken();
            this.spotifyApi.setAccessToken(data.body.access_token);
        }, (data.body.expires_in * 1000) - 1000) // expires_in is in seconds, so multiply by 1000. Then subtract by 1 second
    }

    // TODO: Use regex
    // spotify:[track|playlist|...]/ID
    private getIdFromUri(uri:string) {
        return uri.split(":")[2];
    }

    private getTypeFromUri(uri:string) {
        // TODO: improve this with regex or something
        if (uri.includes("track")) {
            return PlayType.Track;
        } else if (uri.includes("artist")) {
            return PlayType.Artist;
        } else if (uri.includes("playlist")) {
            return PlayType.Playlist;
        } else if (uri.includes("album")) {
            return PlayType.Album;
        } else {
            throw new Error("UNKNOWN PLAY TYPE DERRIVED FROM URI: " + uri);
        }
    }

    public async playOnDevice(deviceId:string, uri:string, shuffle:boolean = false, play:boolean = true, volume:number = 15) {
        let playOptions = {};
        let type = this.getTypeFromUri(uri);

        if (type === PlayType.Track) {
            let trackObj = await this.getTrack(uri);
            playOptions = {
                device_id: deviceId,
                context_uri: trackObj.albumUri,
                offset: {
                    position: trackObj.trackNumber - 1
                }
            };
        } else {
            playOptions = {
                device_id: deviceId,
                context_uri: uri,
                offset: {
                    position: 0 // TODO: Add way for Shuffle to start Shuffle Randomly (get len of album/playlist)
                }
            };
        }

        console.log(playOptions);


        // Play song on device
        await this.spotifyApi.play(playOptions);
        // Set volume
        await this.spotifyApi.setVolume(volume, { device_id: deviceId });
        // Set shuffle
        await this.spotifyApi.setShuffle(shuffle);
    }

    // TODO: Set this up to go by userId as well
    public async getPlaylists(userId:string = "") {
        let response =  await this.spotifyApi.getUserPlaylists();

        let playlists:SpotifyPlaylistObject[] = response.body.items.map(item => {
            let playlistObj:SpotifyPlaylistObject = {
                name: item.name,
                description: "",
                uri: item.uri,
                owner: item.owner.id,
                trackCount: item.tracks.total
            }

            return playlistObj;
        });

        return playlists;
    }

    public async getCurrentDevice() : Promise<any> {
        let devices = await this.getMyDevices();
        let device = devices.find((device) => device.is_active);
        console.log(device);
        return device;
    }

    public async getMyDevices() {
        let req = await this.spotifyApi.getMyDevices()
        return req.body.devices;
    }

    public async setPlaybackDevice(deviceId:string) {
        await this.spotifyApi.transferMyPlayback([deviceId]);
    }

    public async isPlaying() {
        let response = await this.spotifyApi.getMyCurrentPlaybackState();
        console.log("IS PLAYING ", response.body.is_playing);
        return response.body.is_playing;
    }

    public async getTrack(trackUri:string):Promise<SpotifyTrackObject> {
        let trackId = this.getIdFromUri(trackUri);
        let response = await this.spotifyApi.getTrack(trackId);
        let track = response.body;
        let trackObject = {
            name: track.name,
            uri: track.uri,
            artists: [], // TODO
            albumName: track.album.name,
            albumUri: track.album.uri,
            discNumber: track.disc_number,
            trackNumber: track.track_number
        };

        return trackObject;
    }

    public async searchTracks(keyword:string):Promise<SpotifyTrackObject[]> {
        let searchResponse = await this.spotifyApi.searchTracks(keyword);
        let trackList = searchResponse?.body?.tracks?.items.map((track: any) => {
            return {
                name: track.name,
                uri: track.uri,
                artists: track.artists.map((artist: any) => { return {name: artist.name, uri: artist.uri }}),
                albumName: track.album.name,
                albumUri: track.album.uri,
                discNumber: track.album.discNumber,
                trackNumber: track.album.trackNumber
            };
        });

        return trackList ?? [];
    }

    
    public async searchArtists(keyword:string):Promise<SpotifyArtistObject[]> {
        let searchResponse = await this.spotifyApi.searchArtists(keyword);

        let artists = searchResponse?.body?.artists?.items.map((artist: any) => {
            return {
                name: artist.name,
                uri: artist.uri
            }
        });

        return artists ?? [];
    }

    public async searchPlaylists(keyword:string) {
        let searchResponse = await this.spotifyApi.searchPlaylists(keyword);
        return searchResponse.body;
    }

    public async search(keyword:string) {
        let trackResults = await this.searchTracks(keyword);
        let artistsResults = await this.searchArtists(keyword);
        let playlistResults = await this.searchPlaylists(keyword);

        return {
            trackResults: trackResults,
            artistsResults: artistsResults,
            playlistResults: playlistResults
        }
    }
}

export default SpotifyApiWrapper 