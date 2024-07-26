import ytdl from "ytdl-core";
import ffmpeg from "fluent-ffmpeg";

import fs from "fs";
import readline from "readline";
import { join } from "path";

import {
  drawAudioQualityTable,
  drawVideoQualityTable,
  drawBasicTable,
} from "./tables";
import { Successful, Wrong } from "./logs";
import { secondstoTime, formatBytes, filtering } from "../utils/ulits";
import { IVideoObject, IAudioObject } from "./interface";

export const debug = {
  enable: false,
};

export async function linkInfomation(link: string) {
  try {
    const info = await ytdl.getInfo(link);
    drawBasicTable(info);
    drawVideoQualityTable(info.formats);
    drawAudioQualityTable(info.formats);
  } catch (err) {
    Wrong.internet(err, debug.enable);
    process.exit(1);
  }
}

export async function downloadVideo(link: string, tag: string) {
  let info: ytdl.videoInfo;
  try {
    info = await ytdl.getInfo(link);
  } catch (err) {
    Wrong.internet(err, debug.enable);
    process.exit(1);
  }
  const title = filtering(info.videoDetails.title);
  let extension = "";
  let quality = "";
  let codec = "";
  console.log("I am detecting video...");
  if (tag == "highest") {
    const highest = ytdl.chooseFormat(info.formats, {
      quality: "highestvideo",
    });
    extension = highest.container;
    quality = highest.qualityLabel;
    codec = highest.codecs;
    tag = highest.itag.toString();
  } else {
    info.formats.forEach((item) => {
      if (item.itag == +tag) {
        extension = item.container;
        quality = item.qualityLabel;
        codec = item.codecs;
      }
    });
  }
  const path = join(
    process.cwd(),
    `${title}-${quality}-${codec}-video.${extension}`
  );
  return new Promise<IVideoObject>((resolve, reject) => {
    const start = Date.now();
    ytdl(link, { filter: (format) => format.itag == +tag })
      .on("progress", (_, downloaded, total) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(
          `Downloading video: ${formatBytes(downloaded)} / ${formatBytes(
            total
          )}`
        );
      })
      .on("finish", () => {
        Successful.videoDownloaded();
        const time = `Average video download time: ${secondstoTime(
          (Date.now() - start) / 1000
        )}`;
        console.log(time);
        resolve({ path, title, extension, quality, codec });
      })
      .on("error", (err) => {
        Wrong.errorOnVideoBuffers(err, debug.enable);
        process.exit(1);
      })
      .pipe(fs.createWriteStream(path));
  });
}

export async function downloadAudio(link: string, tag: string) {
  let info: ytdl.videoInfo;
  try {
    info = await ytdl.getInfo(link);
  } catch (err) {
    Wrong.internet(err, debug.enable);
    process.exit(1);
  }
  const title = filtering(info.videoDetails.title);
  let extension = "";
  let bitrate = 0;
  let codec = "";
  let channels = 0;
  console.log("I am detecting audio...");
  if (tag == "highest") {
    const highest = ytdl.chooseFormat(info.formats, {
      quality: "highestaudio",
    });
    extension = highest.container;
    bitrate = highest.audioBitrate!;
    codec = highest.codecs;
    channels = highest.audioChannels!;
    tag = highest.itag.toString();
  } else {
    info.formats.forEach((item) => {
      if (item.itag == +tag) {
        extension = item.container;
        bitrate = item.audioBitrate!;
        codec = item.codecs;
        channels = item.audioChannels!;
      }
    });
  }
  const path = join(
    process.cwd(),
    `${title}-${bitrate}-${codec}-audio.${extension}`
  );
  return new Promise<IAudioObject>((resolve, reject) => {
    const start = Date.now();
    ytdl(link, { filter: (format) => format.itag == +tag })
      .on("progress", (_, downloaded, total) => {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(
          `Downloaging audio: ${formatBytes(downloaded)} / ${formatBytes(
            total
          )}`
        );
      })
      .on("finish", () => {
        Successful.audioDownloaded();
        const time = `Average video download time: ${secondstoTime(
          (Date.now() - start) / 1000
        )}`;
        console.log(time);
        resolve({ path, title, codec, extension, channels, bitrate });
      })
      .on("error", (err) => {
        Wrong.errorOnAudioBuffers(err, debug.enable);
        process.exit(1);
      })
      .pipe(fs.createWriteStream(path));
  });
}

export function merging(video: IVideoObject, audio: IAudioObject) {
  const outputName = `${video.title}-${video.quality}-${video.codec}.${video.extension}`;
  let totalTime: number;
  ffmpeg()
    .mergeAdd(video.path)
    .mergeAdd(audio.path)
    .save(join(process.cwd(), outputName))
    .on("codecData", (data) => {
      totalTime = parseInt(data.duration.replace(/:/g, ""));
    })
    .on("progress", (p) => {
      const time = parseInt(p.timemark.replace(/:/g, ""));
      const percent = (time / totalTime) * 100;
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`Merging video with audio - ${percent.toFixed(0)}%`);
    })
    .on("end", () => {
      console.log("\nMerging Done :D");
      fs.unlinkSync(video.path);
      fs.unlinkSync(audio.path);
    })
    .on("error", (err) => {
      Wrong.errorOnMerging(err, debug.enable);
      process.exit(1);
    });
}

export function conevrtToMp3(audio: IAudioObject) {
  const path = `${audio.title}-${audio.bitrate}kb.mp3`;
  let totalTime: number;
  return new Promise<string>((resolve, reject) => {
    ffmpeg()
      .input(audio.path)
      .format("mp3")
      .audioBitrate(audio.bitrate)
      .audioChannels(audio.channels)
      .save(join(process.cwd(), path))
      .on("codecData", (data) => {
        totalTime = parseInt(data.duration.replace(/:/g, ""));
      })
      .on("progress", (p) => {
        const time = parseInt(p.timemark.replace(/:/g, ""));
        const percent = (time / totalTime) * 100;
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Converting to mp3 - ${percent.toFixed(0)}`);
      })
      .on("end", () => {
        console.log("\nAudio converted to mp3 file :D");
        fs.unlinkSync(audio.path);
        resolve(path);
      })
      .on("error", (err) => {
        Wrong.errorOnAudioBuffers(err, debug.enable);
        process.exit(1);
      });
  });
}

export function checkLink(link: string) {
  if (!ytdl.validateURL(link)) {
    Wrong.invalidLink();
    process.exit(1);
  }
}

export async function isTagValid(link: string, tag: string) {
  let info: ytdl.videoInfo;
  try {
    info = await ytdl.getInfo(link);
  } catch (err) {
    Wrong.internet(err, debug.enable);
    process.exit(1);
  }
  for (const item of info.formats) {
    if (item.itag == +tag) {
      return true;
    }
  }
  return false;
}
