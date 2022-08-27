import { VttComment, VttCue, VttCueSettings, WebVtt, escapeVttString } from './WebVtt';

test('empty cue settings produce empty string', () => {
  const settings = new VttCueSettings({});
  expect(settings.toString('vtt')).toBe('');
});

test('partially filled cue settings produce correct string', () => {
  let settings = new VttCueSettings({ vertical: 'lr' });
  expect(settings.toString('vtt')).toBe('vertical:lr');

  settings = new VttCueSettings({ vertical: 'lr' });
  expect(settings.toString('vtt')).toBe('vertical:lr');
});

test('updating the cue settings object', () => {
  const settings = new VttCueSettings({ vertical: 'lr' });
  expect(settings.toString('vtt')).toBe('vertical:lr');
  settings.vertical = 'rl';
  settings.size = '10';
  expect(settings.toString('vtt')).toBe('vertical:rl size:10');
});

test('generating a valid webvtt', () => {
  const vtt = new WebVtt('- Translation of that film I like');
  vtt.add(
    new VttComment(
      'This translation was done by Kyle so that\nsome friends can watch it with their parents.'
    )
  );
  vtt.add(
    new VttCue({
      startTime: 135,
      endTime: 150,
      payload: '- Ta en kopp >varmt te.\n- Det är inte varmt.',
      identifier: '1',
    })
  );
  vtt.add(
    new VttCue({
      startTime: 165,
      endTime: 180,
      payload: '- Har en kopp te.\n- Det smakar som te.',
      identifier: '2',
    })
  );
  vtt.add(new VttComment('This last line may not translate well.'));
  vtt.add(new VttCue({ startTime: 185, endTime: 210, payload: '- Ta en kopp', identifier: '3' }));

  expect(vtt.toString()).toBe(
    'WEBVTT - Translation of that film I like\n' +
      '\n' +
      'NOTE This translation was done by Kyle so that\n' +
      'some friends can watch it with their parents.\n' +
      '\n' +
      '1\n' +
      '00:02:15.000 --> 00:02:30.000\n' +
      '- Ta en kopp &gt;varmt te.\n' +
      '- Det är inte varmt.\n' +
      '\n' +
      '2\n' +
      '00:02:45.000 --> 00:03:00.000\n' +
      '- Har en kopp te.\n' +
      '- Det smakar som te.\n' +
      '\n' +
      'NOTE This last line may not translate well.\n' +
      '\n' +
      '3\n' +
      '00:03:05.000 --> 00:03:30.000\n' +
      '- Ta en kopp\n'
  );
});

test('generating a valid srt', () => {
  const vtt = new WebVtt('- Translation of that film I like');
  vtt.add(
    new VttComment(
      'This translation was done by Kyle so that\nsome friends can watch it with their parents.'
    )
  );
  vtt.add(
    new VttCue({
      startTime: 135,
      endTime: 150,
      payload: '- Ta en kopp >varmt te.\n- Det är inte varmt.',
      identifier: '1',
    })
  );
  vtt.add(
    new VttCue({
      startTime: 165,
      endTime: 180,
      payload: '- Har en kopp te.\n- Det smakar som te.',
      identifier: '2',
    })
  );
  vtt.add(new VttComment('This last line may not translate well.'));
  vtt.add(new VttCue({ startTime: 185, endTime: 210, payload: '- Ta en kopp', identifier: '3' }));

  expect(vtt.toString('srt')).toBe(
    '1\n' +
      '00:02:15.000 --> 00:02:30.000\n' +
      '- Ta en kopp &gt;varmt te.\n' +
      '- Det är inte varmt.\n' +
      '\n' +
      '2\n' +
      '00:02:45.000 --> 00:03:00.000\n' +
      '- Har en kopp te.\n' +
      '- Det smakar som te.\n' +
      '\n' +
      '3\n' +
      '00:03:05.000 --> 00:03:30.000\n' +
      '- Ta en kopp\n'
  );
});

test('exampleFromReadme', () => {
  const _minimal_vtt = new WebVtt();

  const vtt = new WebVtt('Subtitles are cool');

  const myComment = new VttComment('This is a comment\nIt can even be multiline');
  vtt.add(myComment);

  const mySimpleCue = new VttCue({
    startTime: 1,
    endTime: 2,
    payload: 'This will be shown\nincluding this second line',
  });
  vtt.add(mySimpleCue);

  const cueWithIdentifier = new VttCue({
    startTime: 3,
    endTime: 4,
    payload: 'This cue has an identifier',
    identifier: "Hey, i'm an identifier",
  });
  vtt.add(cueWithIdentifier);

  const mySettings = new VttCueSettings({ size: '50%' });
  const cueWithSettings = new VttCue({
    startTime: 5,
    endTime: 120,
    payload: 'This cue has settings',
    settings: mySettings,
  });
  vtt.add(cueWithSettings);

  const cueWithoutEscaping = new VttCue({
    startTime: 130,
    endTime: 200,
    payload: `<b>${escapeVttString('This cue')}</b>${escapeVttString(' has cue text tags')}`,
    payloadEscaped: true,
  });
  vtt.add(cueWithoutEscaping);

  const vttString = vtt.toString();
  expect(vttString).toBe(
    'WEBVTT Subtitles are cool\n' +
      '\n' +
      'NOTE This is a comment\n' +
      'It can even be multiline\n' +
      '\n' +
      '00:00:01.000 --> 00:00:02.000\n' +
      'This will be shown\n' +
      'including this second line\n' +
      '\n' +
      "Hey, i'm an identifier\n" +
      '00:00:03.000 --> 00:00:04.000\n' +
      'This cue has an identifier\n' +
      '\n' +
      '00:00:05.000 --> 00:02:00.000 size:50%\n' +
      'This cue has settings\n' +
      '\n' +
      '00:02:10.000 --> 00:03:20.000\n' +
      '<b>This cue</b> has cue text tags\n'
  );

  const srtString = vtt.toString('srt');
  expect(srtString).toBe(
    '00:00:01.000 --> 00:00:02.000\n' +
      'This will be shown\n' +
      'including this second line\n' +
      '\n' +
      "Hey, i'm an identifier\n" +
      '00:00:03.000 --> 00:00:04.000\n' +
      'This cue has an identifier\n' +
      '\n' +
      '00:00:05.000 --> 00:02:00.000\n' +
      'This cue has settings\n' +
      '\n' +
      '00:02:10.000 --> 00:03:20.000\n' +
      '<b>This cue</b> has cue text tags\n'
  );
});
