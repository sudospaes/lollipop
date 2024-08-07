import chalk from "chalk";
import { Command, Option } from "commander";

import {
  downloadVideo,
  linkInfomation,
  checkLink,
  isTagValid,
  downloadAudio,
  merging,
  conevrtToMp3,
} from "./cli/functions";
import { Wrong } from "./cli/logs";

import "./preload";

const app = new Command();

app
  .name("lollipop")
  .description(
    `A ${chalk.cyan.bold.underline("friendly")} and ${chalk
      .hex("#F075AA")
      .bold.underline("lovely")} cli youtube downloader for you ${chalk.hex(
      "#D04848"
    )("<3")}`
  )
  .version("0.0.10", "--version")
  .usage("[command]")
  .addOption(new Option("-h, --help").hideHelp());

app
  .command("get")
  .description("show youtube link details")
  .argument("<link>", "youtube link")
  .addOption(new Option("-h, --help").hideHelp())
  .action(async (link, options) => {
    checkLink(link);
    linkInfomation(link);
  });

app
  .command("down")
  .description("download youtube video/audio")
  .argument("<link>", "youtube link")
  .option("-v <tag>", "pass the video tag you got from the get command")
  .option("-a <tag>", "pass the audio tag you got from the get command")
  .option("--mp3", "this flag is only used together with -a flag")
  .addOption(new Option("-h, --help").hideHelp())
  .action(async (link, options) => {
    checkLink(link);
    let isVideoTagValid,
      isAudioTagValid = true;
    if (options.v && options.a) {
      if (options.v != "highest") {
        isVideoTagValid = await isTagValid(link, options.v);
      }
      if (options.a != "highest") {
        isAudioTagValid = await isTagValid(link, options.a);
      }
      if (isVideoTagValid && isAudioTagValid) {
        const video = await downloadVideo(link, options.v);
        const audio = await downloadAudio(link, options.a);
        if (options.mp3) {
          audio.path = await conevrtToMp3(audio);
        }
        merging(video, audio);
      } else {
        if (!isVideoTagValid) {
          Wrong.videoTagNotFound();
        } else if (!isAudioTagValid) {
          Wrong.audioTagNotFound();
        }
      }
    } else if (options.v) {
      if (options.v != "highest") {
        isVideoTagValid = await isTagValid(link, options.a);
      }
      if (isVideoTagValid) {
        console.log("I will download only video...");
        downloadVideo(link, options.v);
      } else {
        Wrong.videoTagNotFound();
      }
    } else if (options.a) {
      if (options.a != "highest") {
        isAudioTagValid = await isTagValid(link, options.a);
      }
      if (isAudioTagValid) {
        console.log("I will download only audio...");
        const audio = await downloadAudio(link, options.a);
        if (options.mp3) {
          conevrtToMp3(audio);
        }
      } else {
        Wrong.audioTagNotFound();
      }
    } else {
      console.log("Let's go for highest quality...");
      const video = await downloadVideo(link, "highest");
      const audio = await downloadAudio(link, "highest");
      if (options.mp3) {
        audio.path = await conevrtToMp3(audio);
      }
      merging(video, audio);
    }
  });

app.parse();
