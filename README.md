# webvtt-writer

> A library to create WebVTT (and SRT) files

This repo contains a library to create subtitle-files in the WebVTT and SRT formats which we created for
[audapolis](https://github.com/audapolis/audapolis).

## Installation

```shell
npm install @audapolis/webvtt-writer
```

### Usage

#### 🏗️ Construction

First, you have to create a `WebVtt`-Instance.
This represents one subtitle file.

```js
import { WebVtt } from '@audapolis/webvtt-writer';

const minimal_vtt = new WebVtt();
```

You can optionally give it a [text header](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#webvtt_body):

```js
const vtt = new WebVtt('Subtitles are cool');
```

Now you can start adding elements to you subtitle file:

##### [Comments](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#webvtt_comments)

> Comments are an optional component that can be used to add information to a WebVTT file. Comments are intended for those reading the file and are not seen by users.[^mdn_comments]
>
> [^mdn_comments]: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#webvtt_comments)

To add a comment you have to create a new VttComment instance and then add it to the WebVtt object:

```js
import { VttComment } from '@audapolis/webvtt-writer';
const myComment = new VttComment('This is a comment\nIt can even be multiline');
vtt.add(myComment);
```

#### [Cues](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#webvtt_cues)

Cues are subtitle lines.
Each cue has a start and end time and a payload -- the text that should be displayed.
It may optionally also have

- an identifier
- cue settings

##### The simplest cue

Since every cue needs a start time, an end time and a payload, this is one of the simplest cues possible:

```js
import { VttCue } from '@audapolis/webvtt-writer';
const mySimpleCue = new VttCue({
  startTime: 1,
  endTime: 2,
  payload: 'This will be shown\nincluding this second line',
});
vtt.add(mySimpleCue);
```

Start and end time are given in seconds.

##### Identifier

A cue may also have an identifier which can be used to reference this cue, for example for styling it.
They do not have to be unique, but are often numbered.

```js
const cueWithIdentifier = new VttCue({
  startTime: 3,
  endTime: 4,
  payload: 'This cue has an identifier',
  identifier: "Hey, i'm an identifier",
});
vtt.add(cueWithIdentifier);
```

##### [Cue Settings](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#cue_settings)

Cue settings are used to position the cue payload text.
There are 5 cue settings, whose meanings and possible values are described [here](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#cue_settings):

- vertical
- line
- position
- size
- align

All of them are optional but if you want to, you can specify them like this:

```js
import { VttCueSettings } from '@audapolis/webvtt-writer';

const mySettings = new VttCueSettings({ size: '50%' });
const cueWithSettings = new VttCue({
  startTime: 5,
  endTime: 120,
  payload: 'This cue has settings',
  settings: mySettings,
});
vtt.add(cueWithSettings);
```

##### Escaping and Payload Tags

The payload may not contain the characters `-` and `<` and the usage of `>` is not recommeneded. Instead their escape
sequences should be used. Because of that `webvtt-writer` automatically escapes the payload and identifier.

However this means that you cannot use a payload which contains [cue payload text tags](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#cue_payload_text_tags),
as they would be escaped as well.
If you want to use payload tags, you can set `payloadEscaped` to `true`. This will disable automatic payload escaping.
**Warning:** It is now your task to escape the payload text, so use `escapeVttString` widely.
For example:

```js
import { escapeVttString } from '@audapolis/webvtt-writer';

const cueWithoutEscaping = new VttCue({
  startTime: 130,
  endTime: 200,
  payload: `<b>${escapeVttString('This cue')}</b>${escapeVttString(' has cue text tags')}`,
  payloadEscaped: true,
});
vtt.add(cueWithoutEscaping);
```

#### ✍️ Rendering the subtitles

To get the content of the subtitle file as a string, you can use `.toString()` on you `WebVtt` object:

```js
const vttString = vtt.toString();
console.log(vttString);
```

From the examples above, you should get:

```
WEBVTT Subtitles are cool

NOTE This is a comment
It can even be multiline

00:00:01.000 --> 00:00:02.000
This will be shown
including this second line

Hey, i'm an identifier
00:00:03.000 --> 00:00:04.000
This cue has an identifier

00:00:05.000 --> 00:02:00.000 size:50%
This cue has settings

00:02:10.000 --> 00:03:20.000
<b>This cue</b> has cue text tags
```

This can now be written to a file, for example on nodejs like this:

```js
fs.writeFileSync('subtitles.vtt', vttString);
```

##### SRT

You can also export the subtitles as an SRT file, which has broader software support.
**Note:** Srt does not support some features of WebVTT. We know of at least:

- header (including header text)
- cue text tags
- cue settings
- comments

The header, cue settings and comments will simply be ignored when exporting to srt.
Since cue text tags are not handled by this library, you have to take care to not add them if you want to create an srt
file.

Knowing all this, you can render the srt version of using `.toString('srt')`:

```js
const srtString = vtt.toString('srt');
console.log(srtString);
```

This should give you:

```
00:00:01.000 --> 00:00:02.000
This will be shown
including this second line

Hey, i'm an identifier
00:00:03.000 --> 00:00:04.000
This cue has an identifier

00:00:05.000 --> 00:02:00.000
This cue has settings

00:02:10.000 --> 00:03:20.000
<b>This cue</b> has cue text tags
```
