import SpotifyArtistObject from "./SpotifyArtistObject";

export type SpotifyTrackObject = {
    name:string,
    uri:string,
    artists: SpotifyArtistObject[]
    albumName:string,
    albumUri:string,
    discNumber: number,
    trackNumber:number
}