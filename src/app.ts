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
  debug,
} from "./cli/functions";
import { Wrong } from "./cli/logs";

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
  .version(`0.0.1`, "--version")
  .usage("[command]")
  .option("--debug", "simple debugger, it's a joke XD")
  .addOption(new Option("-h, --help").hideHelp());

app
  .command("get")
  .description("show youtube link details for you :3")
  .argument("<link>", "youtube link")
  .addOption(new Option("-h, --help").hideHelp())
  .addHelpText(
    "after",
    `${chalk.green("\nExamples:")}
    ${chalk.yellow("get")} youtube_link`
  )
  .action(async (link, options) => {
    if (options.debug) {
      debug.enable = true;
    }
    checkLink(link);
    linkInfomation(link);
  });

app
  .command("down")
  .description("download youtube videos/audios for you :P")
  .argument("<link>", "youtube link")
  .option("-v <tag>", "pass the video tag you got from the get command")
  .option("-a <tag>", "pass the audio tag you got from the get command")
  .option("--mp3", "this flag is only used together with -a flag")
  .addOption(new Option("-h, --help").hideHelp())
  .addHelpText(
    "after",
    `${chalk.green("\nExamples:")}
    standard download => ${chalk.yellow(
      "down"
    )} youtube_link -v tag_number -a tag_number
    ${chalk.hex("#DC84F3")(
      `In standard download, I download video and audio separately and merging them with ffmpeg`
    )}\n
    download only video => ${chalk.yellow("down")} youtube_link -v tag_number\n
    download only audio => ${chalk.yellow(
      "down"
    )} youtube_link -a tag_number --mp3
    ${chalk.hex("#DC84F3")(
      `If you use ${chalk.blue("--mp3")} with ${chalk.blue(
        "-a"
      )} flag, It will convert audio to mp3 with ffmpeg`
    )}`
  )
  .action(async (link, options) => {
    if (options.debug) {
      debug.enable = true;
    }
    checkLink(link);
    if (options.v && options.a) {
      console.log("Please wait for tag validation...");
      const isVideoTagValid = await isTagValid(link, options.v);
      const isAudioTagValid = await isTagValid(link, options.a);
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
      console.log("Please wait for tag validation...");
      const isVideoTagValid = await isTagValid(link, options.v);
      if (isVideoTagValid) {
        console.log("I will download only video...");
        downloadVideo(link, options.v);
      } else {
        Wrong.videoTagNotFound();
      }
    } else if (options.a) {
      console.log("Please wait for tag validation...");
      const isAudioTagValid = await isTagValid(link, options.a);
      if (isAudioTagValid) {
        console.log("I will download only audio...");
        const audio = await downloadAudio(link, options.a);
        if (options.mp3) {
          conevrtToMp3(audio);
        }
      } else {
        Wrong.audioTagNotFound();
      }
    }
  });

app.parse();
