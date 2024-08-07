import chalk from "chalk";

export class Wrong {
  static internet(err: any) {
    const output = `${chalk.hex("#F3B95F")(
      "T~T"
    )} Something wrong. check your ${chalk
      .hex("#EE4E4E")
      .underline("internet")} connection`;
    console.log(output);
    console.log(err);
  }
  static errorOnMerging(err: any) {
    const output = `${chalk.red(
      "Something wrong"
    )} in merging to a file ${chalk.cyan("T~T")}`;
    console.log(output);
    console.log(err);
  }
  static errorOnAudioBuffers(err: any) {
    const output = `${chalk.red(
      "Something wrong"
    )} in write audio buffers in file ${chalk.cyan("T~T")}`;
    console.log(output);
    console.log(err);
  }
  static errorOnVideoBuffers(err: any) {
    const output = `${chalk.red(
      "Something wrong"
    )} in write video buffer in file ${chalk.cyan("T~T")}`;
    console.log(output);
    console.log(err);
  }
  static invalidLink() {
    const output = `${chalk.blue("T~T")} Honey, it seems you given me an ${chalk
      .hex("#F3B95F")
      .underline("invalid link")}`;
    console.log(output);
  }
  static audioTagNotFound() {
    const output = `${chalk.hex("#9BABB8")(
      "T~T"
    )} I can't find this audio tag. Please use ${chalk.yellow.underline(
      "get"
    )} command to see available tags`;
    console.log(output);
  }
  static videoTagNotFound() {
    const output = `${chalk.hex("#9BABB8")(
      "T~T"
    )} I can't find this video tag. Please use ${chalk.yellow.underline(
      "get"
    )} command to see available tags`;
    console.log(output);
  }
}

export class Successful {
  static audioDownloaded() {
    const output = `\n${chalk.green("YES!")} ${chalk.hex("#FF9B9B")(
      ":D"
    )} audio download has been done`;
    console.log(output);
  }
  static videoDownloaded() {
    const output = `\n${chalk.green("YES!")} ${chalk.hex("#FF9B9B")(
      ":D"
    )} video download has been done`;
    console.log(output);
  }
}
