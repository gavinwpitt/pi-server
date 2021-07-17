type SpotifyPlayRequest = {
    Type: string,
    Uri: string,    // ID when type === "track"
    DeviceId: string,
    Play: boolean,
    Volume: number,
    Shuffle: boolean
}

export default SpotifyPlayRequest;