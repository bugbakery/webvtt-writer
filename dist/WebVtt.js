export class VttCueSettings {
    constructor({ vertical, size, line, align, }) {
        this.vertical = vertical;
        this.line = line;
        this.size = size;
        this.align = align;
    }
    toString(format) {
        if (format == 'srt') {
            return '';
        }
        return Object.entries(this)
            .filter(([_, v]) => v !== undefined)
            .map(([k, v]) => `${k}:${v}`)
            .join(' ');
    }
}
export function formattedTime(sec) {
    const subseconds = Math.floor((sec % 1) * 1000)
        .toString()
        .padStart(3, '0');
    const seconds = Math.floor(sec % 60)
        .toString()
        .padStart(2, '0');
    const minutes = Math.floor((sec / 60) % 60)
        .toString()
        .padStart(2, '0');
    const hours = Math.floor(sec / 60 / 60)
        .toString()
        .padStart(2, '0');
    return `${hours}:${minutes}:${seconds}.${subseconds}`;
}
export class VttCue {
    constructor({ startTime, endTime, payload, payloadEscaped, identifier, identifierEscaped, settings, }) {
        if (this.startTime >= this.endTime) {
            throw Error('Cue end time must be greater than cue start time');
        }
        this.startTime = startTime;
        this.endTime = endTime;
        if (!payloadEscaped) {
            payload = escapeVttString(payload);
        }
        this.payload = payload;
        if (identifier && !identifierEscaped) {
            identifier = escapeVttString(identifier);
        }
        this.identifier = identifier;
        this.settings = settings;
    }
    toString(format) {
        var _a;
        return ((this.identifier ? `${this.identifier}\n` : '') +
            `${formattedTime(this.startTime)} --> ${formattedTime(this.endTime)} ${((_a = this.settings) === null || _a === void 0 ? void 0 : _a.toString(format)) || ''}`.trim() +
            '\n' +
            this.payload);
    }
}
export class VttComment {
    constructor(text, escaped = false) {
        if (!escaped) {
            text = escapeVttString(text);
        }
        if (text.includes('-->')) {
            throw Error('WebVTT comments MUST NOT contain -->');
        }
        this.commentText = text;
    }
    toString(format) {
        if (format != 'vtt') {
            return '';
        }
        return `NOTE ${this.commentText}`;
    }
}
export function escapeVttString(text) {
    const escape_map = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
    return text.replace(/[&<>]/, (x) => escape_map[x]);
}
class VttHeader {
    constructor(text, escaped = false) {
        if (!escaped) {
            text = escapeVttString(text);
        }
        if (text.includes('-->')) {
            throw Error('WebVTT text header MUST NOT contain -->');
        }
        if (text.includes('\n')) {
            throw Error('WebVTT text header MUST NOT contain newlines');
        }
        this.headerText = text;
    }
    toString(format) {
        if (format != 'vtt') {
            return '';
        }
        return `WEBVTT ${this.headerText}`;
    }
}
export class WebVtt {
    constructor(header = '') {
        this.elements = [new VttHeader(header)];
    }
    add(element) {
        this.elements.push(element);
    }
    toString(format = 'vtt') {
        return this.elements
            .map((x) => x.toString(format))
            .filter((x) => x)
            .join('\n\n');
    }
}
//# sourceMappingURL=WebVtt.js.map
