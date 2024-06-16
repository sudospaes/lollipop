# lollipop 🍭

A friendly and lovely cli youtube downloader written in typescript for Linux, MacOS, Windows.

![preview](preview.png)

## Features
- Download video and audio separately
- Auto merging you download video and audio together
- Convert audios to mp3

## Requirement
- Lollipop use [ffmpeg](https://ffmpeg.org/), so you should installed that

## How to run
- Download latest version from [release](https://github.com/sudospaes/lollipop/releases)
- Rename downloaded file to `lollipop`
- Open terminal or cmd and run lollipop:
  <br>
  Linux/MacOS
    ```bash
  chmod +x lollipop
  ./lollipop
  ```
  Windows
    ```ps
  lollipop.exe
  ```
  Lollipop has a built-in guide. Type these commands to find out what the commands and them flags do:
  <br>
  Linux/MacOS
    ```bash
  ./lollipop help get
  ./lollipop help down
  ```
  Windows
    ```ps
  lollipop.exe help get
  lollipop.exe help down
  ```
  ## How to use (example)
  Lollipop uses tags to download from YouTube. You have to provide it your desired video tag and audio tag, for example, the command below:
  ```bash
  ./lollipop down youtube_link -v tag_number -a tag_number
  ```
   <span>If you won't do that. It's be fine. just type ```./lollipop down youtube_link``` to lollipop downloading highest qualities for you :3</span>
   
  Lollipop has not left you alone to get the number tag. You can get the information with using get command, see this example:
  ```bash
  ./lollipop get https://youtu.be/-dYB0xfE7qs?si=29PqrPHpJ2Xd1lah
  ```
  You will get this output from lollipop:
  <br>
  ![get-command](https://github.com/sudospaes/lollipop/assets/79229394/37a55976-b14b-4a29-8926-fa74d3cca977)
  <br>
  Now you know video tag and audio tag. so, run this command to download them and auto-merging with lollipop:
  ```bash
  ./lollipop down https://youtu.be/-dYB0xfE7qs?si=29PqrPHpJ2Xd1lah -v 137 -a 251
  ```
