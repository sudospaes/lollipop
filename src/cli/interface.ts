export interface IVideoObject {
  path: string;
  title: string;
  extension: string;
  quality: string;
  codec: string;
}

export interface IAudioObject {
  path: string;
  title: string;
  extension: string;
  codec: string;
  channels: number;
  bitrate: number;
}
