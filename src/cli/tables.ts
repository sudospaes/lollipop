import { videoInfo, videoFormat } from "ytdl-core";
import table from "easy-table";
import chalk from "chalk";
import moment from "moment";

import { secondstoTime, kbToSize } from "../utils/ulits";

export function drawBasicTable(info: videoInfo) {
  const title = `${chalk.bold.inverse(" Title ")} ==> ${
    info.videoDetails.title
  }`;
  const length = secondstoTime(+info.videoDetails.lengthSeconds);
  const channelName = info.videoDetails.ownerChannelName;
  const publishDate = info.videoDetails.publishDate;

  const t = new table();
  t.cell("Video Length", length);
  t.cell("Channel name", channelName);
  t.cell("Publish date", moment(publishDate).format("YYYY-MM-DD"));
  t.newRow();

  console.log("\n" + title);
  console.log(t.toString());
}

export function drawVideoQualityTable(formats: videoFormat[]) {
  const t = new table();
  formats.forEach((i) => {
    if (i.hasVideo && i.hasAudio == false) {
      t.cell(chalk.cyan("Tag"), chalk.cyan(i.itag));
      t.cell(chalk.magenta("Quality"), chalk.magenta(i.qualityLabel));
      t.cell(chalk.blue("Format"), chalk.blue(i.container));
      t.cell(chalk.green("Codec"), chalk.green(i.videoCodec));
      t.cell(chalk.yellow("Size"), chalk.yellow(kbToSize(+i.contentLength)));
      t.sort([`${chalk.blue("Format")}|des`]);
      t.newRow();
    }
  });
  console.log("Available video qualities");
  console.log(t.toString());
}

export async function drawAudioQualityTable(formats: videoFormat[]) {
  const t = new table();
  formats.forEach((i) => {
    if (i.hasAudio) {
      t.cell(chalk.cyan("Tag"), chalk.cyan(i.itag));
      t.cell(chalk.magenta("Bitrate"), chalk.magenta(i.audioBitrate));
      t.cell(chalk.green("Codec"), chalk.green(i.audioCodec));
      t.cell(chalk.yellow("Size"), chalk.yellow(kbToSize(+i.contentLength)));
      t.sort([`${chalk.magenta("Bitrate")}|des`]);
      t.newRow();
    }
  });
  console.log("Available audio qualities");
  console.log(t.toString());
}
