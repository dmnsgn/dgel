import { g as getDefaultExportFromCjs, r as require$$0, b as browser$1, B as Buffer, a as require$$1, c as require$$0$1 } from './_chunks/polyfills-D44XStKB.js';

var fileExtension$1 = {exports: {}};

(function(module, exports) {
    (function(m) {
        {
            module.exports = m();
        }
    })(function() {
        return function fileExtension(filename, opts) {
            if (!opts) opts = {};
            if (!filename) return "";
            var ext = (/[^./\\]*$/.exec(filename) || [
                ""
            ])[0];
            return opts.preserveCase ? ext : ext.toLowerCase();
        };
    });
})(fileExtension$1);
var fileExtensionExports = fileExtension$1.exports;
var fileExtension = /*@__PURE__*/ getDefaultExportFromCjs(fileExtensionExports);

let link$1 = null;
/**
 * Get the mimetype
 *
 * @private
 * @param {string} filename
 * @returns {string}
 */ function getType(filename) {
    const ext = fileExtension(filename);
    return [
        "jpg",
        "jpeg"
    ].includes(ext) ? "image/jpeg" : "image/png";
}
/**
 * Take a screenshot.
 * Setting `options.useBlob` to `true` will consequently make the module async and return the latter.
 * @alias module:canvasScreenshot
 * @param {HTMLCanvasElement} canvas The canvas element
 * @param {import("./types.js").CanvasScreenshotOptions} [options={}]
 * @returns {string | Promise<Blob>} A `DOMString` or a `Promise` resolving with a `Blob`.
 *
 * Type is inferred from the filename extension (jpg/jpeg) for `"image/jpeg"` and default to `"image/png"`.
 */ function canvasScreenshot(canvas, options) {
    if (options === void 0) options = {};
    const date = new Date();
    const { filename = `Screen Shot ${date.toISOString().slice(0, 10)} at ${date.toTimeString().slice(0, 8).replace(/:/g, ".")}.png`, quality = 1, useBlob, download = true } = {
        ...options
    };
    if (download) {
        link$1 = link$1 || document.createElement("a");
        link$1.download = filename;
    }
    if (useBlob) {
        return new Promise((resolve)=>{
            canvas.toBlob((blob)=>{
                if (download) {
                    const url = URL.createObjectURL(blob);
                    link$1.href = url;
                    const event = new MouseEvent("click");
                    link$1.dispatchEvent(event);
                    setTimeout(()=>{
                        URL.revokeObjectURL(url);
                    }, 1);
                }
                resolve(blob);
            }, getType(filename), quality);
        });
    }
    const dataURL = canvas.toDataURL(`${getType(filename)};base64`, quality);
    if (download) {
        link$1.href = dataURL;
        const event = new MouseEvent("click");
        link$1.dispatchEvent(event);
    }
    return dataURL;
}

var __accessCheck$1 = (obj, member, msg)=>{
    if (!member.has(obj)) throw TypeError("Cannot " + msg);
};
var __privateGet$1 = (obj, member, getter)=>{
    __accessCheck$1(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd$1 = (obj, member, value)=>{
    if (member.has(obj)) throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet$1 = (obj, member, value, setter)=>{
    __accessCheck$1(obj, member, "write to private field");
    member.set(obj, value);
    return value;
};
var __privateMethod$1 = (obj, member, method)=>{
    __accessCheck$1(obj, member, "access private method");
    return method;
};
// src/misc.ts
var bytes = new Uint8Array(8);
var view = new DataView(bytes.buffer);
var u8 = (value)=>{
    return [
        (value % 256 + 256) % 256
    ];
};
var u16 = (value)=>{
    view.setUint16(0, value, false);
    return [
        bytes[0],
        bytes[1]
    ];
};
var i16 = (value)=>{
    view.setInt16(0, value, false);
    return [
        bytes[0],
        bytes[1]
    ];
};
var u24 = (value)=>{
    view.setUint32(0, value, false);
    return [
        bytes[1],
        bytes[2],
        bytes[3]
    ];
};
var u32 = (value)=>{
    view.setUint32(0, value, false);
    return [
        bytes[0],
        bytes[1],
        bytes[2],
        bytes[3]
    ];
};
var u64 = (value)=>{
    view.setUint32(0, Math.floor(value / 2 ** 32), false);
    view.setUint32(4, value, false);
    return [
        bytes[0],
        bytes[1],
        bytes[2],
        bytes[3],
        bytes[4],
        bytes[5],
        bytes[6],
        bytes[7]
    ];
};
var fixed_8_8 = (value)=>{
    view.setInt16(0, 2 ** 8 * value, false);
    return [
        bytes[0],
        bytes[1]
    ];
};
var fixed_16_16 = (value)=>{
    view.setInt32(0, 2 ** 16 * value, false);
    return [
        bytes[0],
        bytes[1],
        bytes[2],
        bytes[3]
    ];
};
var fixed_2_30 = (value)=>{
    view.setInt32(0, 2 ** 30 * value, false);
    return [
        bytes[0],
        bytes[1],
        bytes[2],
        bytes[3]
    ];
};
var ascii = (text, nullTerminated)=>{
    if (nullTerminated === void 0) nullTerminated = false;
    let bytes2 = Array(text.length).fill(null).map((_, i)=>text.charCodeAt(i));
    if (nullTerminated) bytes2.push(0);
    return bytes2;
};
var last = (arr)=>{
    return arr && arr[arr.length - 1];
};
var intoTimescale = (timeInSeconds, timescale, round)=>{
    if (round === void 0) round = true;
    let value = timeInSeconds * timescale;
    return round ? Math.round(value) : value;
};
var rotationMatrix = (rotationInDegrees)=>{
    let theta = rotationInDegrees * (Math.PI / 180);
    let cosTheta = Math.cos(theta);
    let sinTheta = Math.sin(theta);
    return [
        cosTheta,
        sinTheta,
        0,
        -sinTheta,
        cosTheta,
        0,
        0,
        0,
        1
    ];
};
var IDENTITY_MATRIX = rotationMatrix(0);
var matrixToBytes = (matrix)=>{
    return [
        fixed_16_16(matrix[0]),
        fixed_16_16(matrix[1]),
        fixed_2_30(matrix[2]),
        fixed_16_16(matrix[3]),
        fixed_16_16(matrix[4]),
        fixed_2_30(matrix[5]),
        fixed_16_16(matrix[6]),
        fixed_16_16(matrix[7]),
        fixed_2_30(matrix[8])
    ];
};
var deepClone = (x)=>{
    if (!x) return x;
    if (typeof x !== "object") return x;
    if (Array.isArray(x)) return x.map(deepClone);
    return Object.fromEntries(Object.entries(x).map((param)=>{
        let [key, value] = param;
        return [
            key,
            deepClone(value)
        ];
    }));
};
// src/box.ts
var box = (type, contents, children)=>({
        type,
        contents: contents && new Uint8Array(contents.flat(10)),
        children
    });
var fullBox = (type, version, flags, contents, children)=>box(type, [
        u8(version),
        u24(flags),
        contents ?? []
    ], children);
var ftyp = (holdsHevc)=>{
    if (holdsHevc) return box("ftyp", [
        ascii("isom"),
        // Major brand
        u32(0),
        // Minor version
        ascii("iso4"),
        // Compatible brand 1
        ascii("hvc1")
    ]);
    return box("ftyp", [
        ascii("isom"),
        // Major brand
        u32(0),
        // Minor version
        ascii("isom"),
        // Compatible brand 1
        ascii("avc1"),
        // Compatible brand 2
        ascii("mp41")
    ]);
};
var mdat = (reserveLargeSize)=>({
        type: "mdat",
        largeSize: reserveLargeSize
    });
var free = (size)=>({
        type: "free",
        size
    });
var moov = (tracks, creationTime)=>box("moov", null, [
        mvhd(creationTime, tracks),
        ...tracks.map((x)=>trak(x, creationTime))
    ]);
var mvhd = (creationTime, tracks)=>{
    let duration = intoTimescale(Math.max(0, ...tracks.filter((x)=>x.samples.length > 0).map((x)=>last(x.samples).timestamp + last(x.samples).duration)), GLOBAL_TIMESCALE);
    let nextTrackId = Math.max(...tracks.map((x)=>x.id)) + 1;
    return fullBox("mvhd", 0, 0, [
        u32(creationTime),
        // Creation time
        u32(creationTime),
        // Modification time
        u32(GLOBAL_TIMESCALE),
        // Timescale
        u32(duration),
        // Duration
        fixed_16_16(1),
        // Preferred rate
        fixed_8_8(1),
        // Preferred volume
        Array(10).fill(0),
        // Reserved
        matrixToBytes(IDENTITY_MATRIX),
        // Matrix
        Array(24).fill(0),
        // Pre-defined
        u32(nextTrackId)
    ]);
};
var trak = (track, creationTime)=>box("trak", null, [
        tkhd(track, creationTime),
        mdia(track, creationTime)
    ]);
var tkhd = (track, creationTime)=>{
    let lastSample = last(track.samples);
    let durationInGlobalTimescale = intoTimescale(lastSample ? lastSample.timestamp + lastSample.duration : 0, GLOBAL_TIMESCALE);
    return fullBox("tkhd", 0, 3, [
        u32(creationTime),
        // Creation time
        u32(creationTime),
        // Modification time
        u32(track.id),
        // Track ID
        u32(0),
        // Reserved
        u32(durationInGlobalTimescale),
        // Duration
        Array(8).fill(0),
        // Reserved
        u16(0),
        // Layer
        u16(0),
        // Alternate group
        fixed_8_8(track.info.type === "audio" ? 1 : 0),
        // Volume
        u16(0),
        // Reserved
        matrixToBytes(rotationMatrix(track.info.type === "video" ? track.info.rotation : 0)),
        // Matrix
        fixed_16_16(track.info.type === "video" ? track.info.width : 0),
        // Track width
        fixed_16_16(track.info.type === "video" ? track.info.height : 0)
    ]);
};
var mdia = (track, creationTime)=>box("mdia", null, [
        mdhd(track, creationTime),
        hdlr(track.info.type === "video" ? "vide" : "soun"),
        minf(track)
    ]);
var mdhd = (track, creationTime)=>{
    let lastSample = last(track.samples);
    let localDuration = intoTimescale(lastSample ? lastSample.timestamp + lastSample.duration : 0, track.timescale);
    return fullBox("mdhd", 0, 0, [
        u32(creationTime),
        // Creation time
        u32(creationTime),
        // Modification time
        u32(track.timescale),
        // Timescale
        u32(localDuration),
        // Duration
        u16(21956),
        // Language ("und", undetermined)
        u16(0)
    ]);
};
var hdlr = (componentSubtype)=>fullBox("hdlr", 0, 0, [
        ascii("mhlr"),
        // Component type
        ascii(componentSubtype),
        // Component subtype
        u32(0),
        // Component manufacturer
        u32(0),
        // Component flags
        u32(0),
        // Component flags mask
        ascii("mp4-muxer-hdlr")
    ]);
var minf = (track)=>box("minf", null, [
        track.info.type === "video" ? vmhd() : smhd(),
        dinf(),
        stbl(track)
    ]);
var vmhd = ()=>fullBox("vmhd", 0, 1, [
        u16(0),
        // Graphics mode
        u16(0),
        // Opcolor R
        u16(0),
        // Opcolor G
        u16(0)
    ]);
var smhd = ()=>fullBox("smhd", 0, 0, [
        u16(0),
        // Balance
        u16(0)
    ]);
var dinf = ()=>box("dinf", null, [
        dref()
    ]);
var dref = ()=>fullBox("dref", 0, 0, [
        u32(1)
    ], [
        url()
    ]);
var url = ()=>fullBox("url ", 0, 1);
var stbl = (track)=>box("stbl", null, [
        stsd(track),
        stts(track),
        stss(track),
        stsc(track),
        stsz(track),
        stco(track)
    ]);
var stsd = (track)=>fullBox("stsd", 0, 0, [
        u32(1)
    ], [
        track.info.type === "video" ? videoSampleDescription(VIDEO_CODEC_TO_BOX_NAME[track.info.codec], track) : soundSampleDescription(AUDIO_CODEC_TO_BOX_NAME[track.info.codec], track)
    ]);
var videoSampleDescription = (compressionType, track)=>box(compressionType, [
        Array(6).fill(0),
        // Reserved
        u16(1),
        // Data reference index
        u16(0),
        // Pre-defined
        u16(0),
        // Reserved
        Array(12).fill(0),
        // Pre-defined
        u16(track.info.width),
        // Width
        u16(track.info.height),
        // Height
        u32(4718592),
        // Horizontal resolution
        u32(4718592),
        // Vertical resolution
        u32(0),
        // Reserved
        u16(1),
        // Frame count
        Array(32).fill(0),
        // Compressor name
        u16(24),
        // Depth
        i16(65535)
    ], [
        VIDEO_CODEC_TO_CONFIGURATION_BOX[track.info.codec](track)
    ]);
var avcC = (track)=>track.codecPrivate && box("avcC", [
        ...track.codecPrivate
    ]);
var hvcC = (track)=>track.codecPrivate && box("hvcC", [
        ...track.codecPrivate
    ]);
var vpcC = (track)=>track.codecPrivate && box("vpcC", [
        ...track.codecPrivate
    ]);
var av1C = (track)=>track.codecPrivate && box("av1C", [
        ...track.codecPrivate
    ]);
var soundSampleDescription = (compressionType, track)=>box(compressionType, [
        Array(6).fill(0),
        // Reserved
        u16(1),
        // Data reference index
        u16(0),
        // Version
        u16(0),
        // Revision level
        u32(0),
        // Vendor
        u16(track.info.numberOfChannels),
        // Number of channels
        u16(16),
        // Sample size (bits)
        u16(0),
        // Compression ID
        u16(0),
        // Packet size
        fixed_16_16(track.info.sampleRate)
    ], [
        AUDIO_CODEC_TO_CONFIGURATION_BOX[track.info.codec](track)
    ]);
var esds = (track)=>fullBox("esds", 0, 0, [
        // https://stackoverflow.com/a/54803118
        u32(58753152),
        // TAG(3) = Object Descriptor ([2])
        u8(32 + track.codecPrivate.byteLength),
        // length of this OD (which includes the next 2 tags)
        u16(1),
        // ES_ID = 1
        u8(0),
        // flags etc = 0
        u32(75530368),
        // TAG(4) = ES Descriptor ([2]) embedded in above OD
        u8(18 + track.codecPrivate.byteLength),
        // length of this ESD
        u8(64),
        // MPEG-4 Audio
        u8(21),
        // stream type(6bits)=5 audio, flags(2bits)=1
        u24(0),
        // 24bit buffer size
        u32(130071),
        // max bitrate
        u32(130071),
        // avg bitrate
        u32(92307584),
        // TAG(5) = ASC ([2],[3]) embedded in above OD
        u8(track.codecPrivate.byteLength),
        // length
        ...track.codecPrivate,
        u32(109084800),
        // TAG(6)
        u8(1),
        // length
        u8(2)
    ]);
var dOps = (track)=>box("dOps", [
        u8(0),
        // Version
        u8(track.info.numberOfChannels),
        // OutputChannelCount
        u16(3840),
        // PreSkip, should be at least 80 milliseconds worth of playback, measured in 48000 Hz samples
        u32(track.info.sampleRate),
        // InputSampleRate
        fixed_8_8(0),
        // OutputGain
        u8(0)
    ]);
var stts = (track)=>{
    return fullBox("stts", 0, 0, [
        u32(track.timeToSampleTable.length),
        // Number of entries
        track.timeToSampleTable.map((x)=>[
                // Time-to-sample table
                u32(x.sampleCount),
                // Sample count
                u32(x.sampleDelta)
            ])
    ]);
};
var stss = (track)=>{
    if (track.samples.every((x)=>x.type === "key")) return null;
    let keySamples = [
        ...track.samples.entries()
    ].filter((param)=>{
        let [, sample] = param;
        return sample.type === "key";
    });
    return fullBox("stss", 0, 0, [
        u32(keySamples.length),
        // Number of entries
        keySamples.map((param)=>{
            let [index] = param;
            return u32(index + 1);
        })
    ]);
};
var stsc = (track)=>{
    return fullBox("stsc", 0, 0, [
        u32(track.compactlyCodedChunkTable.length),
        // Number of entries
        track.compactlyCodedChunkTable.map((x)=>[
                // Sample-to-chunk table
                u32(x.firstChunk),
                // First chunk
                u32(x.samplesPerChunk),
                // Samples per chunk
                u32(1)
            ])
    ]);
};
var stsz = (track)=>fullBox("stsz", 0, 0, [
        u32(0),
        // Sample size (0 means non-constant size)
        u32(track.samples.length),
        // Number of entries
        track.samples.map((x)=>u32(x.size))
    ]);
var stco = (track)=>{
    if (track.finalizedChunks.length > 0 && last(track.finalizedChunks).offset >= 2 ** 32) {
        return fullBox("co64", 0, 0, [
            u32(track.finalizedChunks.length),
            // Number of entries
            track.finalizedChunks.map((x)=>u64(x.offset))
        ]);
    }
    return fullBox("stco", 0, 0, [
        u32(track.finalizedChunks.length),
        // Number of entries
        track.finalizedChunks.map((x)=>u32(x.offset))
    ]);
};
var VIDEO_CODEC_TO_BOX_NAME = {
    "avc": "avc1",
    "hevc": "hvc1",
    "vp9": "vp09",
    "av1": "av01"
};
var VIDEO_CODEC_TO_CONFIGURATION_BOX = {
    "avc": avcC,
    "hevc": hvcC,
    "vp9": vpcC,
    "av1": av1C
};
var AUDIO_CODEC_TO_BOX_NAME = {
    "aac": "mp4a",
    "opus": "Opus"
};
var AUDIO_CODEC_TO_CONFIGURATION_BOX = {
    "aac": esds,
    "opus": dOps
};
// src/target.ts
var ArrayBufferTarget$1 = class ArrayBufferTarget {
    constructor(){
        this.buffer = null;
    }
};
var StreamTarget$1 = class StreamTarget {
    constructor(onData, onDone, options){
        this.onData = onData;
        this.onDone = onDone;
        this.options = options;
    }
};
var FileSystemWritableFileStreamTarget$1 = class FileSystemWritableFileStreamTarget {
    constructor(stream, options){
        this.stream = stream;
        this.options = options;
    }
};
// src/writer.ts
var _helper$1, _helperView$1;
var Writer$1 = class Writer {
    constructor(){
        this.pos = 0;
        __privateAdd$1(this, _helper$1, new Uint8Array(8));
        __privateAdd$1(this, _helperView$1, new DataView(__privateGet$1(this, _helper$1).buffer));
        /**
     * Stores the position from the start of the file to where boxes elements have been written. This is used to
     * rewrite/edit elements that were already added before, and to measure sizes of things.
     */ this.offsets = /* @__PURE__ */ new WeakMap();
    }
    /** Sets the current position for future writes to a new one. */ seek(newPos) {
        this.pos = newPos;
    }
    writeU32(value) {
        __privateGet$1(this, _helperView$1).setUint32(0, value, false);
        this.write(__privateGet$1(this, _helper$1).subarray(0, 4));
    }
    writeU64(value) {
        __privateGet$1(this, _helperView$1).setUint32(0, Math.floor(value / 2 ** 32), false);
        __privateGet$1(this, _helperView$1).setUint32(4, value, false);
        this.write(__privateGet$1(this, _helper$1).subarray(0, 8));
    }
    writeAscii(text) {
        for(let i = 0; i < text.length; i++){
            __privateGet$1(this, _helperView$1).setUint8(i % 8, text.charCodeAt(i));
            if (i % 8 === 7) this.write(__privateGet$1(this, _helper$1));
        }
        if (text.length % 8 !== 0) {
            this.write(__privateGet$1(this, _helper$1).subarray(0, text.length % 8));
        }
    }
    writeBox(box2) {
        this.offsets.set(box2, this.pos);
        if (box2.contents && !box2.children) {
            this.writeBoxHeader(box2, box2.size ?? box2.contents.byteLength + 8);
            this.write(box2.contents);
        } else {
            let startPos = this.pos;
            this.writeBoxHeader(box2, 0);
            if (box2.contents) this.write(box2.contents);
            if (box2.children) {
                for (let child of box2.children)if (child) this.writeBox(child);
            }
            let endPos = this.pos;
            let size = box2.size ?? endPos - startPos;
            this.seek(startPos);
            this.writeBoxHeader(box2, size);
            this.seek(endPos);
        }
    }
    writeBoxHeader(box2, size) {
        this.writeU32(box2.largeSize ? 1 : size);
        this.writeAscii(box2.type);
        if (box2.largeSize) this.writeU64(size);
    }
    measureBoxHeader(box2) {
        return 8 + (box2.largeSize ? 8 : 0);
    }
    patchBox(box2) {
        let endPos = this.pos;
        this.seek(this.offsets.get(box2));
        this.writeBox(box2);
        this.seek(endPos);
    }
    measureBox(box2) {
        if (box2.contents && !box2.children) {
            let headerSize = this.measureBoxHeader(box2);
            return headerSize + box2.contents.byteLength;
        } else {
            let result = this.measureBoxHeader(box2);
            if (box2.contents) result += box2.contents.byteLength;
            if (box2.children) {
                for (let child of box2.children)if (child) result += this.measureBox(child);
            }
            return result;
        }
    }
};
_helper$1 = new WeakMap();
_helperView$1 = new WeakMap();
var _target$1, _buffer$1, _bytes$1, _maxPos, _ensureSize$1, ensureSize_fn$1;
var ArrayBufferTargetWriter$1 = class ArrayBufferTargetWriter extends Writer$1 {
    constructor(target){
        super();
        __privateAdd$1(this, _ensureSize$1);
        __privateAdd$1(this, _target$1, void 0);
        __privateAdd$1(this, _buffer$1, new ArrayBuffer(2 ** 16));
        __privateAdd$1(this, _bytes$1, new Uint8Array(__privateGet$1(this, _buffer$1)));
        __privateAdd$1(this, _maxPos, 0);
        __privateSet$1(this, _target$1, target);
    }
    write(data) {
        __privateMethod$1(this, _ensureSize$1, ensureSize_fn$1).call(this, this.pos + data.byteLength);
        __privateGet$1(this, _bytes$1).set(data, this.pos);
        this.pos += data.byteLength;
        __privateSet$1(this, _maxPos, Math.max(__privateGet$1(this, _maxPos), this.pos));
    }
    finalize() {
        __privateMethod$1(this, _ensureSize$1, ensureSize_fn$1).call(this, this.pos);
        __privateGet$1(this, _target$1).buffer = __privateGet$1(this, _buffer$1).slice(0, Math.max(__privateGet$1(this, _maxPos), this.pos));
    }
};
_target$1 = new WeakMap();
_buffer$1 = new WeakMap();
_bytes$1 = new WeakMap();
_maxPos = new WeakMap();
_ensureSize$1 = new WeakSet();
ensureSize_fn$1 = function(size) {
    let newLength = __privateGet$1(this, _buffer$1).byteLength;
    while(newLength < size)newLength *= 2;
    if (newLength === __privateGet$1(this, _buffer$1).byteLength) return;
    let newBuffer = new ArrayBuffer(newLength);
    let newBytes = new Uint8Array(newBuffer);
    newBytes.set(__privateGet$1(this, _bytes$1), 0);
    __privateSet$1(this, _buffer$1, newBuffer);
    __privateSet$1(this, _bytes$1, newBytes);
};
var _target2$1, _sections$1;
var StreamTargetWriter$1 = class StreamTargetWriter extends Writer$1 {
    constructor(target){
        super();
        __privateAdd$1(this, _target2$1, void 0);
        __privateAdd$1(this, _sections$1, []);
        __privateSet$1(this, _target2$1, target);
    }
    write(data) {
        __privateGet$1(this, _sections$1).push({
            data: data.slice(),
            start: this.pos
        });
        this.pos += data.byteLength;
    }
    flush() {
        if (__privateGet$1(this, _sections$1).length === 0) return;
        let chunks = [];
        let sorted = [
            ...__privateGet$1(this, _sections$1)
        ].sort((a, b)=>a.start - b.start);
        chunks.push({
            start: sorted[0].start,
            size: sorted[0].data.byteLength
        });
        for(let i = 1; i < sorted.length; i++){
            let lastChunk = chunks[chunks.length - 1];
            let section = sorted[i];
            if (section.start <= lastChunk.start + lastChunk.size) {
                lastChunk.size = Math.max(lastChunk.size, section.start + section.data.byteLength - lastChunk.start);
            } else {
                chunks.push({
                    start: section.start,
                    size: section.data.byteLength
                });
            }
        }
        for (let chunk of chunks){
            chunk.data = new Uint8Array(chunk.size);
            for (let section of __privateGet$1(this, _sections$1)){
                if (chunk.start <= section.start && section.start < chunk.start + chunk.size) {
                    chunk.data.set(section.data, section.start - chunk.start);
                }
            }
            __privateGet$1(this, _target2$1).onData(chunk.data, chunk.start);
        }
        __privateGet$1(this, _sections$1).length = 0;
    }
    finalize() {
        var __privateGet_onDone, __privateGet1;
        (__privateGet_onDone = (__privateGet1 = __privateGet$1(this, _target2$1)).onDone) == null ? void 0 : __privateGet_onDone.call(__privateGet1);
    }
};
_target2$1 = new WeakMap();
_sections$1 = new WeakMap();
var DEFAULT_CHUNK_SIZE$1 = 2 ** 24;
var MAX_CHUNKS_AT_ONCE$1 = 2;
var _target3$1, _chunkSize$1, _chunks$1, _writeDataIntoChunks$1, writeDataIntoChunks_fn$1, _insertSectionIntoChunk$1, insertSectionIntoChunk_fn$1, _createChunk$1, createChunk_fn$1, _flushChunks$1, flushChunks_fn$1;
var ChunkedStreamTargetWriter$1 = class ChunkedStreamTargetWriter extends Writer$1 {
    constructor(target){
        var _target_options;
        super();
        __privateAdd$1(this, _writeDataIntoChunks$1);
        __privateAdd$1(this, _insertSectionIntoChunk$1);
        __privateAdd$1(this, _createChunk$1);
        __privateAdd$1(this, _flushChunks$1);
        __privateAdd$1(this, _target3$1, void 0);
        __privateAdd$1(this, _chunkSize$1, void 0);
        /**
     * The data is divided up into fixed-size chunks, whose contents are first filled in RAM and then flushed out.
     * A chunk is flushed if all of its contents have been written.
     */ __privateAdd$1(this, _chunks$1, []);
        __privateSet$1(this, _target3$1, target);
        __privateSet$1(this, _chunkSize$1, ((_target_options = target.options) == null ? void 0 : _target_options.chunkSize) ?? DEFAULT_CHUNK_SIZE$1);
        if (!Number.isInteger(__privateGet$1(this, _chunkSize$1)) || __privateGet$1(this, _chunkSize$1) < 2 ** 10) {
            throw new Error("Invalid StreamTarget options: chunkSize must be an integer not smaller than 1024.");
        }
    }
    write(data) {
        __privateMethod$1(this, _writeDataIntoChunks$1, writeDataIntoChunks_fn$1).call(this, data, this.pos);
        __privateMethod$1(this, _flushChunks$1, flushChunks_fn$1).call(this);
        this.pos += data.byteLength;
    }
    finalize() {
        var __privateGet_onDone, __privateGet1;
        __privateMethod$1(this, _flushChunks$1, flushChunks_fn$1).call(this, true);
        (__privateGet_onDone = (__privateGet1 = __privateGet$1(this, _target3$1)).onDone) == null ? void 0 : __privateGet_onDone.call(__privateGet1);
    }
};
_target3$1 = new WeakMap();
_chunkSize$1 = new WeakMap();
_chunks$1 = new WeakMap();
_writeDataIntoChunks$1 = new WeakSet();
writeDataIntoChunks_fn$1 = function(data, position) {
    let chunkIndex = __privateGet$1(this, _chunks$1).findIndex((x)=>x.start <= position && position < x.start + __privateGet$1(this, _chunkSize$1));
    if (chunkIndex === -1) chunkIndex = __privateMethod$1(this, _createChunk$1, createChunk_fn$1).call(this, position);
    let chunk = __privateGet$1(this, _chunks$1)[chunkIndex];
    let relativePosition = position - chunk.start;
    let toWrite = data.subarray(0, Math.min(__privateGet$1(this, _chunkSize$1) - relativePosition, data.byteLength));
    chunk.data.set(toWrite, relativePosition);
    let section = {
        start: relativePosition,
        end: relativePosition + toWrite.byteLength
    };
    __privateMethod$1(this, _insertSectionIntoChunk$1, insertSectionIntoChunk_fn$1).call(this, chunk, section);
    if (chunk.written[0].start === 0 && chunk.written[0].end === __privateGet$1(this, _chunkSize$1)) {
        chunk.shouldFlush = true;
    }
    if (__privateGet$1(this, _chunks$1).length > MAX_CHUNKS_AT_ONCE$1) {
        for(let i = 0; i < __privateGet$1(this, _chunks$1).length - 1; i++){
            __privateGet$1(this, _chunks$1)[i].shouldFlush = true;
        }
        __privateMethod$1(this, _flushChunks$1, flushChunks_fn$1).call(this);
    }
    if (toWrite.byteLength < data.byteLength) {
        __privateMethod$1(this, _writeDataIntoChunks$1, writeDataIntoChunks_fn$1).call(this, data.subarray(toWrite.byteLength), position + toWrite.byteLength);
    }
};
_insertSectionIntoChunk$1 = new WeakSet();
insertSectionIntoChunk_fn$1 = function(chunk, section) {
    let low = 0;
    let high = chunk.written.length - 1;
    let index = -1;
    while(low <= high){
        let mid = Math.floor(low + (high - low + 1) / 2);
        if (chunk.written[mid].start <= section.start) {
            low = mid + 1;
            index = mid;
        } else {
            high = mid - 1;
        }
    }
    chunk.written.splice(index + 1, 0, section);
    if (index === -1 || chunk.written[index].end < section.start) index++;
    while(index < chunk.written.length - 1 && chunk.written[index].end >= chunk.written[index + 1].start){
        chunk.written[index].end = Math.max(chunk.written[index].end, chunk.written[index + 1].end);
        chunk.written.splice(index + 1, 1);
    }
};
_createChunk$1 = new WeakSet();
createChunk_fn$1 = function(includesPosition) {
    let start = Math.floor(includesPosition / __privateGet$1(this, _chunkSize$1)) * __privateGet$1(this, _chunkSize$1);
    let chunk = {
        start,
        data: new Uint8Array(__privateGet$1(this, _chunkSize$1)),
        written: [],
        shouldFlush: false
    };
    __privateGet$1(this, _chunks$1).push(chunk);
    __privateGet$1(this, _chunks$1).sort((a, b)=>a.start - b.start);
    return __privateGet$1(this, _chunks$1).indexOf(chunk);
};
_flushChunks$1 = new WeakSet();
flushChunks_fn$1 = function(force) {
    if (force === void 0) force = false;
    for(let i = 0; i < __privateGet$1(this, _chunks$1).length; i++){
        let chunk = __privateGet$1(this, _chunks$1)[i];
        if (!chunk.shouldFlush && !force) continue;
        for (let section of chunk.written){
            __privateGet$1(this, _target3$1).onData(chunk.data.subarray(section.start, section.end), chunk.start + section.start);
        }
        __privateGet$1(this, _chunks$1).splice(i--, 1);
    }
};
var FileSystemWritableFileStreamTargetWriter$1 = class FileSystemWritableFileStreamTargetWriter extends ChunkedStreamTargetWriter$1 {
    constructor(target){
        var _target_options;
        super(new StreamTarget$1((data, position)=>target.stream.write({
                type: "write",
                data,
                position
            }), void 0, {
            chunkSize: (_target_options = target.options) == null ? void 0 : _target_options.chunkSize
        }));
    }
};
// src/muxer.ts
var GLOBAL_TIMESCALE = 1e3;
var SUPPORTED_VIDEO_CODECS2 = [
    "avc",
    "hevc",
    "vp9",
    "av1"
];
var SUPPORTED_AUDIO_CODECS2 = [
    "aac",
    "opus"
];
var TIMESTAMP_OFFSET = 2082844800;
var MAX_CHUNK_DURATION = 0.5;
var FIRST_TIMESTAMP_BEHAVIORS$1 = [
    "strict",
    "offset"
];
var _options$1, _writer$1, _ftypSize, _mdat, _videoTrack, _audioTrack, _creationTime, _finalizedChunks, _finalized$1, _validateOptions$1, validateOptions_fn$1, _writeHeader, writeHeader_fn, _computeMoovSizeUpperBound, computeMoovSizeUpperBound_fn, _prepareTracks, prepareTracks_fn, _generateMpeg4AudioSpecificConfig, generateMpeg4AudioSpecificConfig_fn, _addSampleToTrack, addSampleToTrack_fn, _validateTimestamp$1, validateTimestamp_fn$1, _finalizeCurrentChunk, finalizeCurrentChunk_fn, _maybeFlushStreamingTargetWriter$1, maybeFlushStreamingTargetWriter_fn$1, _ensureNotFinalized$1, ensureNotFinalized_fn$1;
var Muxer$1 = class Muxer {
    constructor(options){
        __privateAdd$1(this, _validateOptions$1);
        __privateAdd$1(this, _writeHeader);
        __privateAdd$1(this, _computeMoovSizeUpperBound);
        __privateAdd$1(this, _prepareTracks);
        // https://wiki.multimedia.cx/index.php/MPEG-4_Audio
        __privateAdd$1(this, _generateMpeg4AudioSpecificConfig);
        __privateAdd$1(this, _addSampleToTrack);
        __privateAdd$1(this, _validateTimestamp$1);
        __privateAdd$1(this, _finalizeCurrentChunk);
        __privateAdd$1(this, _maybeFlushStreamingTargetWriter$1);
        __privateAdd$1(this, _ensureNotFinalized$1);
        __privateAdd$1(this, _options$1, void 0);
        __privateAdd$1(this, _writer$1, void 0);
        __privateAdd$1(this, _ftypSize, void 0);
        __privateAdd$1(this, _mdat, void 0);
        __privateAdd$1(this, _videoTrack, null);
        __privateAdd$1(this, _audioTrack, null);
        __privateAdd$1(this, _creationTime, Math.floor(Date.now() / 1e3) + TIMESTAMP_OFFSET);
        __privateAdd$1(this, _finalizedChunks, []);
        __privateAdd$1(this, _finalized$1, false);
        __privateMethod$1(this, _validateOptions$1, validateOptions_fn$1).call(this, options);
        options.video = deepClone(options.video);
        options.audio = deepClone(options.audio);
        options.fastStart = deepClone(options.fastStart);
        this.target = options.target;
        __privateSet$1(this, _options$1, {
            firstTimestampBehavior: "strict",
            ...options
        });
        if (options.target instanceof ArrayBufferTarget$1) {
            __privateSet$1(this, _writer$1, new ArrayBufferTargetWriter$1(options.target));
        } else if (options.target instanceof StreamTarget$1) {
            var _options_target_options;
            __privateSet$1(this, _writer$1, ((_options_target_options = options.target.options) == null ? void 0 : _options_target_options.chunked) ? new ChunkedStreamTargetWriter$1(options.target) : new StreamTargetWriter$1(options.target));
        } else if (options.target instanceof FileSystemWritableFileStreamTarget$1) {
            __privateSet$1(this, _writer$1, new FileSystemWritableFileStreamTargetWriter$1(options.target));
        } else {
            throw new Error(`Invalid target: ${options.target}`);
        }
        __privateMethod$1(this, _writeHeader, writeHeader_fn).call(this);
        __privateMethod$1(this, _prepareTracks, prepareTracks_fn).call(this);
    }
    addVideoChunk(sample, meta, timestamp) {
        let data = new Uint8Array(sample.byteLength);
        sample.copyTo(data);
        this.addVideoChunkRaw(data, sample.type, timestamp ?? sample.timestamp, sample.duration, meta);
    }
    addVideoChunkRaw(data, type, timestamp, duration, meta) {
        __privateMethod$1(this, _ensureNotFinalized$1, ensureNotFinalized_fn$1).call(this);
        if (!__privateGet$1(this, _options$1).video) throw new Error("No video track declared.");
        if (typeof __privateGet$1(this, _options$1).fastStart === "object" && __privateGet$1(this, _videoTrack).samples.length === __privateGet$1(this, _options$1).fastStart.expectedVideoChunks) {
            throw new Error(`Cannot add more video chunks than specified in 'fastStart' (${__privateGet$1(this, _options$1).fastStart.expectedVideoChunks}).`);
        }
        __privateMethod$1(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet$1(this, _videoTrack), data, type, timestamp, duration, meta);
    }
    addAudioChunk(sample, meta, timestamp) {
        let data = new Uint8Array(sample.byteLength);
        sample.copyTo(data);
        this.addAudioChunkRaw(data, sample.type, timestamp ?? sample.timestamp, sample.duration, meta);
    }
    addAudioChunkRaw(data, type, timestamp, duration, meta) {
        __privateMethod$1(this, _ensureNotFinalized$1, ensureNotFinalized_fn$1).call(this);
        if (!__privateGet$1(this, _options$1).audio) throw new Error("No audio track declared.");
        if (typeof __privateGet$1(this, _options$1).fastStart === "object" && __privateGet$1(this, _audioTrack).samples.length === __privateGet$1(this, _options$1).fastStart.expectedAudioChunks) {
            throw new Error(`Cannot add more audio chunks than specified in 'fastStart' (${__privateGet$1(this, _options$1).fastStart.expectedAudioChunks}).`);
        }
        __privateMethod$1(this, _addSampleToTrack, addSampleToTrack_fn).call(this, __privateGet$1(this, _audioTrack), data, type, timestamp, duration, meta);
    }
    /** Finalizes the file, making it ready for use. Must be called after all video and audio chunks have been added. */ finalize() {
        if (__privateGet$1(this, _finalized$1)) {
            throw new Error("Cannot finalize a muxer more than once.");
        }
        if (__privateGet$1(this, _videoTrack)) __privateMethod$1(this, _finalizeCurrentChunk, finalizeCurrentChunk_fn).call(this, __privateGet$1(this, _videoTrack));
        if (__privateGet$1(this, _audioTrack)) __privateMethod$1(this, _finalizeCurrentChunk, finalizeCurrentChunk_fn).call(this, __privateGet$1(this, _audioTrack));
        let tracks = [
            __privateGet$1(this, _videoTrack),
            __privateGet$1(this, _audioTrack)
        ].filter(Boolean);
        if (__privateGet$1(this, _options$1).fastStart === "in-memory") {
            let mdatSize;
            for(let i = 0; i < 2; i++){
                let movieBox2 = moov(tracks, __privateGet$1(this, _creationTime));
                let movieBoxSize = __privateGet$1(this, _writer$1).measureBox(movieBox2);
                mdatSize = __privateGet$1(this, _writer$1).measureBox(__privateGet$1(this, _mdat));
                let currentChunkPos = __privateGet$1(this, _writer$1).pos + movieBoxSize + mdatSize;
                for (let chunk of __privateGet$1(this, _finalizedChunks)){
                    chunk.offset = currentChunkPos;
                    for (let bytes2 of chunk.sampleData){
                        currentChunkPos += bytes2.byteLength;
                        mdatSize += bytes2.byteLength;
                    }
                }
                if (currentChunkPos < 2 ** 32) break;
                if (mdatSize >= 2 ** 32) __privateGet$1(this, _mdat).largeSize = true;
            }
            let movieBox = moov(tracks, __privateGet$1(this, _creationTime));
            __privateGet$1(this, _writer$1).writeBox(movieBox);
            __privateGet$1(this, _mdat).size = mdatSize;
            __privateGet$1(this, _writer$1).writeBox(__privateGet$1(this, _mdat));
            for (let chunk of __privateGet$1(this, _finalizedChunks)){
                for (let bytes2 of chunk.sampleData)__privateGet$1(this, _writer$1).write(bytes2);
                chunk.sampleData = null;
            }
        } else {
            let mdatPos = __privateGet$1(this, _writer$1).offsets.get(__privateGet$1(this, _mdat));
            let mdatSize = __privateGet$1(this, _writer$1).pos - mdatPos;
            __privateGet$1(this, _mdat).size = mdatSize;
            __privateGet$1(this, _mdat).largeSize = mdatSize >= 2 ** 32;
            __privateGet$1(this, _writer$1).patchBox(__privateGet$1(this, _mdat));
            let movieBox = moov(tracks, __privateGet$1(this, _creationTime));
            if (typeof __privateGet$1(this, _options$1).fastStart === "object") {
                __privateGet$1(this, _writer$1).seek(__privateGet$1(this, _ftypSize));
                __privateGet$1(this, _writer$1).writeBox(movieBox);
                let remainingBytes = mdatPos - __privateGet$1(this, _writer$1).pos;
                __privateGet$1(this, _writer$1).writeBox(free(remainingBytes));
            } else {
                __privateGet$1(this, _writer$1).writeBox(movieBox);
            }
        }
        __privateMethod$1(this, _maybeFlushStreamingTargetWriter$1, maybeFlushStreamingTargetWriter_fn$1).call(this);
        __privateGet$1(this, _writer$1).finalize();
        __privateSet$1(this, _finalized$1, true);
    }
};
_options$1 = new WeakMap();
_writer$1 = new WeakMap();
_ftypSize = new WeakMap();
_mdat = new WeakMap();
_videoTrack = new WeakMap();
_audioTrack = new WeakMap();
_creationTime = new WeakMap();
_finalizedChunks = new WeakMap();
_finalized$1 = new WeakMap();
_validateOptions$1 = new WeakSet();
validateOptions_fn$1 = function(options) {
    if (options.video) {
        if (!SUPPORTED_VIDEO_CODECS2.includes(options.video.codec)) {
            throw new Error(`Unsupported video codec: ${options.video.codec}`);
        }
        if (options.video.rotation !== void 0 && ![
            0,
            90,
            180,
            270
        ].includes(options.video.rotation)) {
            throw new Error(`Invalid video rotation: ${options.video.rotation}. Has to be 0, 90, 180 or 270.`);
        }
    }
    if (options.audio && !SUPPORTED_AUDIO_CODECS2.includes(options.audio.codec)) {
        throw new Error(`Unsupported audio codec: ${options.audio.codec}`);
    }
    if (options.firstTimestampBehavior && !FIRST_TIMESTAMP_BEHAVIORS$1.includes(options.firstTimestampBehavior)) {
        throw new Error(`Invalid first timestamp behavior: ${options.firstTimestampBehavior}`);
    }
    if (typeof options.fastStart === "object") {
        if (options.video && options.fastStart.expectedVideoChunks === void 0) {
            throw new Error(`'fastStart' is an object but is missing property 'expectedVideoChunks'.`);
        }
        if (options.audio && options.fastStart.expectedAudioChunks === void 0) {
            throw new Error(`'fastStart' is an object but is missing property 'expectedAudioChunks'.`);
        }
    } else if (![
        false,
        "in-memory"
    ].includes(options.fastStart)) {
        throw new Error(`'fastStart' option must be false, 'in-memory' or an object.`);
    }
};
_writeHeader = new WeakSet();
writeHeader_fn = function() {
    var __privateGet_video;
    let holdsHevc = ((__privateGet_video = __privateGet$1(this, _options$1).video) == null ? void 0 : __privateGet_video.codec) === "hevc";
    __privateGet$1(this, _writer$1).writeBox(ftyp(holdsHevc));
    __privateSet$1(this, _ftypSize, __privateGet$1(this, _writer$1).pos);
    if (__privateGet$1(this, _options$1).fastStart === "in-memory") {
        __privateSet$1(this, _mdat, mdat(false));
    } else {
        if (typeof __privateGet$1(this, _options$1).fastStart === "object") {
            let moovSizeUpperBound = __privateMethod$1(this, _computeMoovSizeUpperBound, computeMoovSizeUpperBound_fn).call(this);
            __privateGet$1(this, _writer$1).seek(__privateGet$1(this, _writer$1).pos + moovSizeUpperBound);
        }
        __privateSet$1(this, _mdat, mdat(true));
        __privateGet$1(this, _writer$1).writeBox(__privateGet$1(this, _mdat));
    }
    __privateMethod$1(this, _maybeFlushStreamingTargetWriter$1, maybeFlushStreamingTargetWriter_fn$1).call(this);
};
_computeMoovSizeUpperBound = new WeakSet();
computeMoovSizeUpperBound_fn = function() {
    if (typeof __privateGet$1(this, _options$1).fastStart !== "object") return;
    let upperBound = 0;
    let sampleCounts = [
        __privateGet$1(this, _options$1).fastStart.expectedVideoChunks,
        __privateGet$1(this, _options$1).fastStart.expectedAudioChunks
    ];
    for (let n of sampleCounts){
        if (!n) continue;
        upperBound += (4 + 4) * Math.ceil(2 / 3 * n);
        upperBound += 4 * n;
        upperBound += (4 + 4 + 4) * Math.ceil(2 / 3 * n);
        upperBound += 4 * n;
        upperBound += 8 * n;
    }
    upperBound += 4096;
    return upperBound;
};
_prepareTracks = new WeakSet();
prepareTracks_fn = function() {
    if (__privateGet$1(this, _options$1).video) {
        __privateSet$1(this, _videoTrack, {
            id: 1,
            info: {
                type: "video",
                codec: __privateGet$1(this, _options$1).video.codec,
                width: __privateGet$1(this, _options$1).video.width,
                height: __privateGet$1(this, _options$1).video.height,
                rotation: __privateGet$1(this, _options$1).video.rotation ?? 0
            },
            timescale: 720,
            // = lcm(24, 30, 60, 120, 144, 240, 360), so should fit with many framerates
            codecPrivate: new Uint8Array(0),
            samples: [],
            finalizedChunks: [],
            currentChunk: null,
            firstTimestamp: void 0,
            lastTimestamp: -1,
            timeToSampleTable: [],
            lastTimescaleUnits: null,
            compactlyCodedChunkTable: []
        });
    }
    if (__privateGet$1(this, _options$1).audio) {
        let guessedCodecPrivate = __privateMethod$1(this, _generateMpeg4AudioSpecificConfig, generateMpeg4AudioSpecificConfig_fn).call(this, 2, // Object type for AAC-LC, since it's the most common
        __privateGet$1(this, _options$1).audio.sampleRate, __privateGet$1(this, _options$1).audio.numberOfChannels);
        __privateSet$1(this, _audioTrack, {
            id: __privateGet$1(this, _options$1).video ? 2 : 1,
            info: {
                type: "audio",
                codec: __privateGet$1(this, _options$1).audio.codec,
                numberOfChannels: __privateGet$1(this, _options$1).audio.numberOfChannels,
                sampleRate: __privateGet$1(this, _options$1).audio.sampleRate
            },
            timescale: __privateGet$1(this, _options$1).audio.sampleRate,
            codecPrivate: guessedCodecPrivate,
            samples: [],
            finalizedChunks: [],
            currentChunk: null,
            firstTimestamp: void 0,
            lastTimestamp: -1,
            timeToSampleTable: [],
            lastTimescaleUnits: null,
            compactlyCodedChunkTable: []
        });
    }
};
_generateMpeg4AudioSpecificConfig = new WeakSet();
generateMpeg4AudioSpecificConfig_fn = function(objectType, sampleRate, numberOfChannels) {
    let frequencyIndices = [
        96e3,
        88200,
        64e3,
        48e3,
        44100,
        32e3,
        24e3,
        22050,
        16e3,
        12e3,
        11025,
        8e3,
        7350
    ];
    let frequencyIndex = frequencyIndices.indexOf(sampleRate);
    let channelConfig = numberOfChannels;
    let configBits = "";
    configBits += objectType.toString(2).padStart(5, "0");
    configBits += frequencyIndex.toString(2).padStart(4, "0");
    if (frequencyIndex === 15) configBits += sampleRate.toString(2).padStart(24, "0");
    configBits += channelConfig.toString(2).padStart(4, "0");
    let paddingLength = Math.ceil(configBits.length / 8) * 8;
    configBits = configBits.padEnd(paddingLength, "0");
    let configBytes = new Uint8Array(configBits.length / 8);
    for(let i = 0; i < configBits.length; i += 8){
        configBytes[i / 8] = parseInt(configBits.slice(i, i + 8), 2);
    }
    return configBytes;
};
_addSampleToTrack = new WeakSet();
addSampleToTrack_fn = function(track, data, type, timestamp, duration, meta) {
    var _meta_decoderConfig;
    let timestampInSeconds = timestamp / 1e6;
    let durationInSeconds = duration / 1e6;
    if (track.firstTimestamp === void 0) track.firstTimestamp = timestampInSeconds;
    timestampInSeconds = __privateMethod$1(this, _validateTimestamp$1, validateTimestamp_fn$1).call(this, timestampInSeconds, track);
    track.lastTimestamp = timestampInSeconds;
    if (!track.currentChunk || timestampInSeconds - track.currentChunk.startTimestamp >= MAX_CHUNK_DURATION) {
        if (track.currentChunk) __privateMethod$1(this, _finalizeCurrentChunk, finalizeCurrentChunk_fn).call(this, track);
        track.currentChunk = {
            startTimestamp: timestampInSeconds,
            sampleData: [],
            sampleCount: 0
        };
    }
    track.currentChunk.sampleData.push(data);
    track.currentChunk.sampleCount++;
    if (meta == null ? void 0 : (_meta_decoderConfig = meta.decoderConfig) == null ? void 0 : _meta_decoderConfig.description) {
        track.codecPrivate = new Uint8Array(meta.decoderConfig.description);
    }
    track.samples.push({
        timestamp: timestampInSeconds,
        duration: durationInSeconds,
        size: data.byteLength,
        type
    });
    if (track.lastTimescaleUnits !== null) {
        let timescaleUnits = intoTimescale(timestampInSeconds, track.timescale, false);
        let delta = Math.round(timescaleUnits - track.lastTimescaleUnits);
        track.lastTimescaleUnits += delta;
        let lastTableEntry = last(track.timeToSampleTable);
        if (lastTableEntry.sampleCount === 1) {
            lastTableEntry.sampleDelta = delta;
            lastTableEntry.sampleCount++;
        } else if (lastTableEntry.sampleDelta === delta) {
            lastTableEntry.sampleCount++;
        } else {
            lastTableEntry.sampleCount--;
            track.timeToSampleTable.push({
                sampleCount: 2,
                sampleDelta: delta
            });
        }
    } else {
        track.lastTimescaleUnits = 0;
        track.timeToSampleTable.push({
            sampleCount: 1,
            sampleDelta: intoTimescale(durationInSeconds, track.timescale)
        });
    }
};
_validateTimestamp$1 = new WeakSet();
validateTimestamp_fn$1 = function(timestamp, track) {
    if (__privateGet$1(this, _options$1).firstTimestampBehavior === "strict" && track.lastTimestamp === -1 && timestamp !== 0) {
        throw new Error(`The first chunk for your media track must have a timestamp of 0 (received ${timestamp}). Non-zero first timestamps are often caused by directly piping frames or audio data from a MediaStreamTrack into the encoder. Their timestamps are typically relative to the age of the document, which is probably what you want.

If you want to offset all timestamps of a track such that the first one is zero, set firstTimestampBehavior: 'offset' in the options.
`);
    } else if (__privateGet$1(this, _options$1).firstTimestampBehavior === "offset") {
        timestamp -= track.firstTimestamp;
    }
    if (timestamp < track.lastTimestamp) {
        throw new Error(`Timestamps must be monotonically increasing (went from ${track.lastTimestamp * 1e6} to ${timestamp * 1e6}).`);
    }
    return timestamp;
};
_finalizeCurrentChunk = new WeakSet();
finalizeCurrentChunk_fn = function(track) {
    if (!track.currentChunk) return;
    if (track.compactlyCodedChunkTable.length === 0 || last(track.compactlyCodedChunkTable).samplesPerChunk !== track.currentChunk.sampleCount) {
        track.compactlyCodedChunkTable.push({
            firstChunk: track.finalizedChunks.length + 1,
            // 1-indexed
            samplesPerChunk: track.currentChunk.sampleCount
        });
    }
    track.finalizedChunks.push(track.currentChunk);
    __privateGet$1(this, _finalizedChunks).push(track.currentChunk);
    if (__privateGet$1(this, _options$1).fastStart === "in-memory") {
        track.currentChunk.offset = 0;
        return;
    }
    track.currentChunk.offset = __privateGet$1(this, _writer$1).pos;
    for (let bytes2 of track.currentChunk.sampleData)__privateGet$1(this, _writer$1).write(bytes2);
    track.currentChunk.sampleData = null;
    __privateMethod$1(this, _maybeFlushStreamingTargetWriter$1, maybeFlushStreamingTargetWriter_fn$1).call(this);
};
_maybeFlushStreamingTargetWriter$1 = new WeakSet();
maybeFlushStreamingTargetWriter_fn$1 = function() {
    if (__privateGet$1(this, _writer$1) instanceof StreamTargetWriter$1) {
        __privateGet$1(this, _writer$1).flush();
    }
};
_ensureNotFinalized$1 = new WeakSet();
ensureNotFinalized_fn$1 = function() {
    if (__privateGet$1(this, _finalized$1)) {
        throw new Error("Cannot add new video or audio chunks after the file has been finalized.");
    }
};

var MP4Muxer = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ArrayBufferTarget: ArrayBufferTarget$1,
  FileSystemWritableFileStreamTarget: FileSystemWritableFileStreamTarget$1,
  Muxer: Muxer$1,
  StreamTarget: StreamTarget$1
});

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __pow = Math.pow;
var __defNormalProp = (obj, key, value)=>key in obj ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value
    }) : obj[key] = value;
var __spreadValues = (a, b)=>{
    for(var prop in b ||= {})if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)){
        if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
    return a;
};
var __accessCheck = (obj, member, msg)=>{
    if (!member.has(obj)) throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter)=>{
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value)=>{
    if (member.has(obj)) throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter)=>{
    __accessCheck(obj, member, "write to private field");
    member.set(obj, value);
    return value;
};
var __privateMethod = (obj, member, method)=>{
    __accessCheck(obj, member, "access private method");
    return method;
};
// src/ebml.ts
var EBMLFloat32 = class {
    constructor(value){
        this.value = value;
    }
};
var EBMLFloat64 = class {
    constructor(value){
        this.value = value;
    }
};
var measureUnsignedInt = (value)=>{
    if (value < 1 << 8) {
        return 1;
    } else if (value < 1 << 16) {
        return 2;
    } else if (value < 1 << 24) {
        return 3;
    } else if (value < __pow(2, 32)) {
        return 4;
    } else if (value < __pow(2, 40)) {
        return 5;
    } else {
        return 6;
    }
};
var measureEBMLVarInt = (value)=>{
    if (value < (1 << 7) - 1) {
        return 1;
    } else if (value < (1 << 14) - 1) {
        return 2;
    } else if (value < (1 << 21) - 1) {
        return 3;
    } else if (value < (1 << 28) - 1) {
        return 4;
    } else if (value < __pow(2, 35) - 1) {
        return 5;
    } else if (value < __pow(2, 42) - 1) {
        return 6;
    } else {
        throw new Error("EBML VINT size not supported " + value);
    }
};
// src/misc.ts
var readBits = (bytes, start, end)=>{
    let result = 0;
    for(let i = start; i < end; i++){
        let byteIndex = Math.floor(i / 8);
        let byte = bytes[byteIndex];
        let bitIndex = 7 - (i & 7);
        let bit = (byte & 1 << bitIndex) >> bitIndex;
        result <<= 1;
        result |= bit;
    }
    return result;
};
var writeBits = (bytes, start, end, value)=>{
    for(let i = start; i < end; i++){
        let byteIndex = Math.floor(i / 8);
        let byte = bytes[byteIndex];
        let bitIndex = 7 - (i & 7);
        byte &= ~(1 << bitIndex);
        byte |= (value & 1 << end - i - 1) >> end - i - 1 << bitIndex;
        bytes[byteIndex] = byte;
    }
};
// src/target.ts
var ArrayBufferTarget = class {
    constructor(){
        this.buffer = null;
    }
};
var StreamTarget = class {
    constructor(onData, onDone, options){
        this.onData = onData;
        this.onDone = onDone;
        this.options = options;
    }
};
var FileSystemWritableFileStreamTarget = class {
    constructor(stream, options){
        this.stream = stream;
        this.options = options;
    }
};
// src/writer.ts
var _helper, _helperView, _writeByte, writeByte_fn, _writeFloat32, writeFloat32_fn, _writeFloat64, writeFloat64_fn, _writeUnsignedInt, writeUnsignedInt_fn, _writeString, writeString_fn;
var Writer = class {
    constructor(){
        __privateAdd(this, _writeByte);
        __privateAdd(this, _writeFloat32);
        __privateAdd(this, _writeFloat64);
        __privateAdd(this, _writeUnsignedInt);
        __privateAdd(this, _writeString);
        this.pos = 0;
        __privateAdd(this, _helper, new Uint8Array(8));
        __privateAdd(this, _helperView, new DataView(__privateGet(this, _helper).buffer));
        this.offsets = /* @__PURE__ */ new WeakMap();
        this.dataOffsets = /* @__PURE__ */ new WeakMap();
    }
    seek(newPos) {
        this.pos = newPos;
    }
    writeEBMLVarInt(value, width) {
        if (width === void 0) width = measureEBMLVarInt(value);
        let pos = 0;
        switch(width){
            case 1:
                __privateGet(this, _helperView).setUint8(pos++, 1 << 7 | value);
                break;
            case 2:
                __privateGet(this, _helperView).setUint8(pos++, 1 << 6 | value >> 8);
                __privateGet(this, _helperView).setUint8(pos++, value);
                break;
            case 3:
                __privateGet(this, _helperView).setUint8(pos++, 1 << 5 | value >> 16);
                __privateGet(this, _helperView).setUint8(pos++, value >> 8);
                __privateGet(this, _helperView).setUint8(pos++, value);
                break;
            case 4:
                __privateGet(this, _helperView).setUint8(pos++, 1 << 4 | value >> 24);
                __privateGet(this, _helperView).setUint8(pos++, value >> 16);
                __privateGet(this, _helperView).setUint8(pos++, value >> 8);
                __privateGet(this, _helperView).setUint8(pos++, value);
                break;
            case 5:
                __privateGet(this, _helperView).setUint8(pos++, 1 << 3 | value / __pow(2, 32) & 7);
                __privateGet(this, _helperView).setUint8(pos++, value >> 24);
                __privateGet(this, _helperView).setUint8(pos++, value >> 16);
                __privateGet(this, _helperView).setUint8(pos++, value >> 8);
                __privateGet(this, _helperView).setUint8(pos++, value);
                break;
            case 6:
                __privateGet(this, _helperView).setUint8(pos++, 1 << 2 | value / __pow(2, 40) & 3);
                __privateGet(this, _helperView).setUint8(pos++, value / __pow(2, 32) | 0);
                __privateGet(this, _helperView).setUint8(pos++, value >> 24);
                __privateGet(this, _helperView).setUint8(pos++, value >> 16);
                __privateGet(this, _helperView).setUint8(pos++, value >> 8);
                __privateGet(this, _helperView).setUint8(pos++, value);
                break;
            default:
                throw new Error("Bad EBML VINT size " + width);
        }
        this.write(__privateGet(this, _helper).subarray(0, pos));
    }
    writeEBML(data) {
        var _a, _b;
        if (data === null) return;
        if (data instanceof Uint8Array) {
            this.write(data);
        } else if (Array.isArray(data)) {
            for (let elem of data){
                this.writeEBML(elem);
            }
        } else {
            this.offsets.set(data, this.pos);
            __privateMethod(this, _writeUnsignedInt, writeUnsignedInt_fn).call(this, data.id);
            if (Array.isArray(data.data)) {
                let sizePos = this.pos;
                let sizeSize = data.size === -1 ? 1 : (_a = data.size) != null ? _a : 4;
                if (data.size === -1) {
                    __privateMethod(this, _writeByte, writeByte_fn).call(this, 255);
                } else {
                    this.seek(this.pos + sizeSize);
                }
                let startPos = this.pos;
                this.dataOffsets.set(data, startPos);
                this.writeEBML(data.data);
                if (data.size !== -1) {
                    let size = this.pos - startPos;
                    let endPos = this.pos;
                    this.seek(sizePos);
                    this.writeEBMLVarInt(size, sizeSize);
                    this.seek(endPos);
                }
            } else if (typeof data.data === "number") {
                let size = (_b = data.size) != null ? _b : measureUnsignedInt(data.data);
                this.writeEBMLVarInt(size);
                __privateMethod(this, _writeUnsignedInt, writeUnsignedInt_fn).call(this, data.data, size);
            } else if (typeof data.data === "string") {
                this.writeEBMLVarInt(data.data.length);
                __privateMethod(this, _writeString, writeString_fn).call(this, data.data);
            } else if (data.data instanceof Uint8Array) {
                this.writeEBMLVarInt(data.data.byteLength, data.size);
                this.write(data.data);
            } else if (data.data instanceof EBMLFloat32) {
                this.writeEBMLVarInt(4);
                __privateMethod(this, _writeFloat32, writeFloat32_fn).call(this, data.data.value);
            } else if (data.data instanceof EBMLFloat64) {
                this.writeEBMLVarInt(8);
                __privateMethod(this, _writeFloat64, writeFloat64_fn).call(this, data.data.value);
            }
        }
    }
};
_helper = new WeakMap();
_helperView = new WeakMap();
_writeByte = new WeakSet();
writeByte_fn = function(value) {
    __privateGet(this, _helperView).setUint8(0, value);
    this.write(__privateGet(this, _helper).subarray(0, 1));
};
_writeFloat32 = new WeakSet();
writeFloat32_fn = function(value) {
    __privateGet(this, _helperView).setFloat32(0, value, false);
    this.write(__privateGet(this, _helper).subarray(0, 4));
};
_writeFloat64 = new WeakSet();
writeFloat64_fn = function(value) {
    __privateGet(this, _helperView).setFloat64(0, value, false);
    this.write(__privateGet(this, _helper));
};
_writeUnsignedInt = new WeakSet();
writeUnsignedInt_fn = function(value, width) {
    if (width === void 0) width = measureUnsignedInt(value);
    let pos = 0;
    switch(width){
        case 6:
            __privateGet(this, _helperView).setUint8(pos++, value / __pow(2, 40) | 0);
        case 5:
            __privateGet(this, _helperView).setUint8(pos++, value / __pow(2, 32) | 0);
        case 4:
            __privateGet(this, _helperView).setUint8(pos++, value >> 24);
        case 3:
            __privateGet(this, _helperView).setUint8(pos++, value >> 16);
        case 2:
            __privateGet(this, _helperView).setUint8(pos++, value >> 8);
        case 1:
            __privateGet(this, _helperView).setUint8(pos++, value);
            break;
        default:
            throw new Error("Bad UINT size " + width);
    }
    this.write(__privateGet(this, _helper).subarray(0, pos));
};
_writeString = new WeakSet();
writeString_fn = function(str) {
    this.write(new Uint8Array(str.split("").map((x)=>x.charCodeAt(0))));
};
var _target, _buffer, _bytes, _ensureSize, ensureSize_fn;
var ArrayBufferTargetWriter = class extends Writer {
    constructor(target){
        super();
        __privateAdd(this, _ensureSize);
        __privateAdd(this, _target, void 0);
        __privateAdd(this, _buffer, new ArrayBuffer(__pow(2, 16)));
        __privateAdd(this, _bytes, new Uint8Array(__privateGet(this, _buffer)));
        __privateSet(this, _target, target);
    }
    write(data) {
        __privateMethod(this, _ensureSize, ensureSize_fn).call(this, this.pos + data.byteLength);
        __privateGet(this, _bytes).set(data, this.pos);
        this.pos += data.byteLength;
    }
    finalize() {
        __privateMethod(this, _ensureSize, ensureSize_fn).call(this, this.pos);
        __privateGet(this, _target).buffer = __privateGet(this, _buffer).slice(0, this.pos);
    }
};
_target = new WeakMap();
_buffer = new WeakMap();
_bytes = new WeakMap();
_ensureSize = new WeakSet();
ensureSize_fn = function(size) {
    let newLength = __privateGet(this, _buffer).byteLength;
    while(newLength < size)newLength *= 2;
    if (newLength === __privateGet(this, _buffer).byteLength) return;
    let newBuffer = new ArrayBuffer(newLength);
    let newBytes = new Uint8Array(newBuffer);
    newBytes.set(__privateGet(this, _bytes), 0);
    __privateSet(this, _buffer, newBuffer);
    __privateSet(this, _bytes, newBytes);
};
var _target2, _sections, _lastFlushEnd, _ensureMonotonicity;
var StreamTargetWriter = class extends Writer {
    constructor(target, ensureMonotonicity){
        super();
        __privateAdd(this, _target2, void 0);
        __privateAdd(this, _sections, []);
        __privateAdd(this, _lastFlushEnd, 0);
        __privateAdd(this, _ensureMonotonicity, void 0);
        __privateSet(this, _target2, target);
        __privateSet(this, _ensureMonotonicity, ensureMonotonicity);
    }
    write(data) {
        __privateGet(this, _sections).push({
            data: data.slice(),
            start: this.pos
        });
        this.pos += data.byteLength;
    }
    flush() {
        if (__privateGet(this, _sections).length === 0) return;
        let chunks = [];
        let sorted = [
            ...__privateGet(this, _sections)
        ].sort((a, b)=>a.start - b.start);
        chunks.push({
            start: sorted[0].start,
            size: sorted[0].data.byteLength
        });
        for(let i = 1; i < sorted.length; i++){
            let lastChunk = chunks[chunks.length - 1];
            let section = sorted[i];
            if (section.start <= lastChunk.start + lastChunk.size) {
                lastChunk.size = Math.max(lastChunk.size, section.start + section.data.byteLength - lastChunk.start);
            } else {
                chunks.push({
                    start: section.start,
                    size: section.data.byteLength
                });
            }
        }
        for (let chunk of chunks){
            chunk.data = new Uint8Array(chunk.size);
            for (let section of __privateGet(this, _sections)){
                if (chunk.start <= section.start && section.start < chunk.start + chunk.size) {
                    chunk.data.set(section.data, section.start - chunk.start);
                }
            }
            if (__privateGet(this, _ensureMonotonicity) && chunk.start < __privateGet(this, _lastFlushEnd)) {
                throw new Error("Internal error: Monotonicity violation.");
            }
            __privateGet(this, _target2).onData(chunk.data, chunk.start);
            __privateSet(this, _lastFlushEnd, chunk.start + chunk.data.byteLength);
        }
        __privateGet(this, _sections).length = 0;
    }
    finalize() {
        var _a, _b;
        (_b = (_a = __privateGet(this, _target2)).onDone) == null ? void 0 : _b.call(_a);
    }
};
_target2 = new WeakMap();
_sections = new WeakMap();
_lastFlushEnd = new WeakMap();
_ensureMonotonicity = new WeakMap();
var DEFAULT_CHUNK_SIZE = __pow(2, 24);
var MAX_CHUNKS_AT_ONCE = 2;
var _target3, _chunkSize, _chunks, _lastFlushEnd2, _ensureMonotonicity2, _writeDataIntoChunks, writeDataIntoChunks_fn, _insertSectionIntoChunk, insertSectionIntoChunk_fn, _createChunk, createChunk_fn, _flushChunks, flushChunks_fn;
var ChunkedStreamTargetWriter = class extends Writer {
    constructor(target, ensureMonotonicity){
        var _a, _b;
        super();
        __privateAdd(this, _writeDataIntoChunks);
        __privateAdd(this, _insertSectionIntoChunk);
        __privateAdd(this, _createChunk);
        __privateAdd(this, _flushChunks);
        __privateAdd(this, _target3, void 0);
        __privateAdd(this, _chunkSize, void 0);
        __privateAdd(this, _chunks, []);
        __privateAdd(this, _lastFlushEnd2, 0);
        __privateAdd(this, _ensureMonotonicity2, void 0);
        __privateSet(this, _target3, target);
        __privateSet(this, _chunkSize, (_b = (_a = target.options) == null ? void 0 : _a.chunkSize) != null ? _b : DEFAULT_CHUNK_SIZE);
        __privateSet(this, _ensureMonotonicity2, ensureMonotonicity);
        if (!Number.isInteger(__privateGet(this, _chunkSize)) || __privateGet(this, _chunkSize) < __pow(2, 10)) {
            throw new Error("Invalid StreamTarget options: chunkSize must be an integer not smaller than 1024.");
        }
    }
    write(data) {
        __privateMethod(this, _writeDataIntoChunks, writeDataIntoChunks_fn).call(this, data, this.pos);
        __privateMethod(this, _flushChunks, flushChunks_fn).call(this);
        this.pos += data.byteLength;
    }
    finalize() {
        var _a, _b;
        __privateMethod(this, _flushChunks, flushChunks_fn).call(this, true);
        (_b = (_a = __privateGet(this, _target3)).onDone) == null ? void 0 : _b.call(_a);
    }
};
_target3 = new WeakMap();
_chunkSize = new WeakMap();
_chunks = new WeakMap();
_lastFlushEnd2 = new WeakMap();
_ensureMonotonicity2 = new WeakMap();
_writeDataIntoChunks = new WeakSet();
writeDataIntoChunks_fn = function(data, position) {
    let chunkIndex = __privateGet(this, _chunks).findIndex((x)=>x.start <= position && position < x.start + __privateGet(this, _chunkSize));
    if (chunkIndex === -1) chunkIndex = __privateMethod(this, _createChunk, createChunk_fn).call(this, position);
    let chunk = __privateGet(this, _chunks)[chunkIndex];
    let relativePosition = position - chunk.start;
    let toWrite = data.subarray(0, Math.min(__privateGet(this, _chunkSize) - relativePosition, data.byteLength));
    chunk.data.set(toWrite, relativePosition);
    let section = {
        start: relativePosition,
        end: relativePosition + toWrite.byteLength
    };
    __privateMethod(this, _insertSectionIntoChunk, insertSectionIntoChunk_fn).call(this, chunk, section);
    if (chunk.written[0].start === 0 && chunk.written[0].end === __privateGet(this, _chunkSize)) {
        chunk.shouldFlush = true;
    }
    if (__privateGet(this, _chunks).length > MAX_CHUNKS_AT_ONCE) {
        for(let i = 0; i < __privateGet(this, _chunks).length - 1; i++){
            __privateGet(this, _chunks)[i].shouldFlush = true;
        }
        __privateMethod(this, _flushChunks, flushChunks_fn).call(this);
    }
    if (toWrite.byteLength < data.byteLength) {
        __privateMethod(this, _writeDataIntoChunks, writeDataIntoChunks_fn).call(this, data.subarray(toWrite.byteLength), position + toWrite.byteLength);
    }
};
_insertSectionIntoChunk = new WeakSet();
insertSectionIntoChunk_fn = function(chunk, section) {
    let low = 0;
    let high = chunk.written.length - 1;
    let index = -1;
    while(low <= high){
        let mid = Math.floor(low + (high - low + 1) / 2);
        if (chunk.written[mid].start <= section.start) {
            low = mid + 1;
            index = mid;
        } else {
            high = mid - 1;
        }
    }
    chunk.written.splice(index + 1, 0, section);
    if (index === -1 || chunk.written[index].end < section.start) index++;
    while(index < chunk.written.length - 1 && chunk.written[index].end >= chunk.written[index + 1].start){
        chunk.written[index].end = Math.max(chunk.written[index].end, chunk.written[index + 1].end);
        chunk.written.splice(index + 1, 1);
    }
};
_createChunk = new WeakSet();
createChunk_fn = function(includesPosition) {
    let start = Math.floor(includesPosition / __privateGet(this, _chunkSize)) * __privateGet(this, _chunkSize);
    let chunk = {
        start,
        data: new Uint8Array(__privateGet(this, _chunkSize)),
        written: [],
        shouldFlush: false
    };
    __privateGet(this, _chunks).push(chunk);
    __privateGet(this, _chunks).sort((a, b)=>a.start - b.start);
    return __privateGet(this, _chunks).indexOf(chunk);
};
_flushChunks = new WeakSet();
flushChunks_fn = function(force) {
    if (force === void 0) force = false;
    for(let i = 0; i < __privateGet(this, _chunks).length; i++){
        let chunk = __privateGet(this, _chunks)[i];
        if (!chunk.shouldFlush && !force) continue;
        for (let section of chunk.written){
            if (__privateGet(this, _ensureMonotonicity2) && chunk.start + section.start < __privateGet(this, _lastFlushEnd2)) {
                throw new Error("Internal error: Monotonicity violation.");
            }
            __privateGet(this, _target3).onData(chunk.data.subarray(section.start, section.end), chunk.start + section.start);
            __privateSet(this, _lastFlushEnd2, chunk.start + section.end);
        }
        __privateGet(this, _chunks).splice(i--, 1);
    }
};
var FileSystemWritableFileStreamTargetWriter = class extends ChunkedStreamTargetWriter {
    constructor(target, ensureMonotonicity){
        var _a;
        super(new StreamTarget((data, position)=>target.stream.write({
                type: "write",
                data,
                position
            }), void 0, {
            chunkSize: (_a = target.options) == null ? void 0 : _a.chunkSize
        }), ensureMonotonicity);
    }
};
// src/muxer.ts
var VIDEO_TRACK_NUMBER = 1;
var AUDIO_TRACK_NUMBER = 2;
var SUBTITLE_TRACK_NUMBER = 3;
var VIDEO_TRACK_TYPE = 1;
var AUDIO_TRACK_TYPE = 2;
var SUBTITLE_TRACK_TYPE = 17;
var MAX_CHUNK_LENGTH_MS = __pow(2, 15);
var CODEC_PRIVATE_MAX_SIZE = __pow(2, 12);
var APP_NAME = "https://github.com/Vanilagy/webm-muxer";
var SEGMENT_SIZE_BYTES = 6;
var CLUSTER_SIZE_BYTES = 5;
var FIRST_TIMESTAMP_BEHAVIORS = [
    "strict",
    "offset",
    "permissive"
];
var _options, _writer, _segment, _segmentInfo, _seekHead, _tracksElement, _segmentDuration, _colourElement, _videoCodecPrivate, _audioCodecPrivate, _subtitleCodecPrivate, _cues, _currentCluster, _currentClusterTimestamp, _duration, _videoChunkQueue, _audioChunkQueue, _subtitleChunkQueue, _firstVideoTimestamp, _firstAudioTimestamp, _lastVideoTimestamp, _lastAudioTimestamp, _lastSubtitleTimestamp, _colorSpace, _finalized, _validateOptions, validateOptions_fn, _createFileHeader, createFileHeader_fn, _writeEBMLHeader, writeEBMLHeader_fn, _createCodecPrivatePlaceholders, createCodecPrivatePlaceholders_fn, _createColourElement, createColourElement_fn, _createSeekHead, createSeekHead_fn, _createSegmentInfo, createSegmentInfo_fn, _createTracks, createTracks_fn, _createSegment, createSegment_fn, _createCues, createCues_fn, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn, _segmentDataOffset, segmentDataOffset_get, _writeVideoDecoderConfig, writeVideoDecoderConfig_fn, _fixVP9ColorSpace, fixVP9ColorSpace_fn, _writeSubtitleChunks, writeSubtitleChunks_fn, _createInternalChunk, createInternalChunk_fn, _validateTimestamp, validateTimestamp_fn, _writeBlock, writeBlock_fn, _createCodecPrivateElement, createCodecPrivateElement_fn, _writeCodecPrivate, writeCodecPrivate_fn, _createNewCluster, createNewCluster_fn, _finalizeCurrentCluster, finalizeCurrentCluster_fn, _ensureNotFinalized, ensureNotFinalized_fn;
var Muxer = class {
    constructor(options){
        __privateAdd(this, _validateOptions);
        __privateAdd(this, _createFileHeader);
        __privateAdd(this, _writeEBMLHeader);
        __privateAdd(this, _createCodecPrivatePlaceholders);
        __privateAdd(this, _createColourElement);
        __privateAdd(this, _createSeekHead);
        __privateAdd(this, _createSegmentInfo);
        __privateAdd(this, _createTracks);
        __privateAdd(this, _createSegment);
        __privateAdd(this, _createCues);
        __privateAdd(this, _maybeFlushStreamingTargetWriter);
        __privateAdd(this, _segmentDataOffset);
        __privateAdd(this, _writeVideoDecoderConfig);
        __privateAdd(this, _fixVP9ColorSpace);
        __privateAdd(this, _writeSubtitleChunks);
        __privateAdd(this, _createInternalChunk);
        __privateAdd(this, _validateTimestamp);
        __privateAdd(this, _writeBlock);
        __privateAdd(this, _createCodecPrivateElement);
        __privateAdd(this, _writeCodecPrivate);
        __privateAdd(this, _createNewCluster);
        __privateAdd(this, _finalizeCurrentCluster);
        __privateAdd(this, _ensureNotFinalized);
        __privateAdd(this, _options, void 0);
        __privateAdd(this, _writer, void 0);
        __privateAdd(this, _segment, void 0);
        __privateAdd(this, _segmentInfo, void 0);
        __privateAdd(this, _seekHead, void 0);
        __privateAdd(this, _tracksElement, void 0);
        __privateAdd(this, _segmentDuration, void 0);
        __privateAdd(this, _colourElement, void 0);
        __privateAdd(this, _videoCodecPrivate, void 0);
        __privateAdd(this, _audioCodecPrivate, void 0);
        __privateAdd(this, _subtitleCodecPrivate, void 0);
        __privateAdd(this, _cues, void 0);
        __privateAdd(this, _currentCluster, void 0);
        __privateAdd(this, _currentClusterTimestamp, void 0);
        __privateAdd(this, _duration, 0);
        __privateAdd(this, _videoChunkQueue, []);
        __privateAdd(this, _audioChunkQueue, []);
        __privateAdd(this, _subtitleChunkQueue, []);
        __privateAdd(this, _firstVideoTimestamp, void 0);
        __privateAdd(this, _firstAudioTimestamp, void 0);
        __privateAdd(this, _lastVideoTimestamp, -1);
        __privateAdd(this, _lastAudioTimestamp, -1);
        __privateAdd(this, _lastSubtitleTimestamp, -1);
        __privateAdd(this, _colorSpace, void 0);
        __privateAdd(this, _finalized, false);
        var _a;
        __privateMethod(this, _validateOptions, validateOptions_fn).call(this, options);
        __privateSet(this, _options, __spreadValues({
            type: "webm",
            firstTimestampBehavior: "strict"
        }, options));
        this.target = options.target;
        let ensureMonotonicity = !!__privateGet(this, _options).streaming;
        if (options.target instanceof ArrayBufferTarget) {
            __privateSet(this, _writer, new ArrayBufferTargetWriter(options.target));
        } else if (options.target instanceof StreamTarget) {
            __privateSet(this, _writer, ((_a = options.target.options) == null ? void 0 : _a.chunked) ? new ChunkedStreamTargetWriter(options.target, ensureMonotonicity) : new StreamTargetWriter(options.target, ensureMonotonicity));
        } else if (options.target instanceof FileSystemWritableFileStreamTarget) {
            __privateSet(this, _writer, new FileSystemWritableFileStreamTargetWriter(options.target, ensureMonotonicity));
        } else {
            throw new Error(`Invalid target: ${options.target}`);
        }
        __privateMethod(this, _createFileHeader, createFileHeader_fn).call(this);
    }
    addVideoChunk(chunk, meta, timestamp) {
        let data = new Uint8Array(chunk.byteLength);
        chunk.copyTo(data);
        this.addVideoChunkRaw(data, chunk.type, timestamp != null ? timestamp : chunk.timestamp, meta);
    }
    addVideoChunkRaw(data, type, timestamp, meta) {
        __privateMethod(this, _ensureNotFinalized, ensureNotFinalized_fn).call(this);
        if (!__privateGet(this, _options).video) throw new Error("No video track declared.");
        if (__privateGet(this, _firstVideoTimestamp) === void 0) __privateSet(this, _firstVideoTimestamp, timestamp);
        if (meta) __privateMethod(this, _writeVideoDecoderConfig, writeVideoDecoderConfig_fn).call(this, meta);
        let videoChunk = __privateMethod(this, _createInternalChunk, createInternalChunk_fn).call(this, data, type, timestamp, VIDEO_TRACK_NUMBER);
        if (__privateGet(this, _options).video.codec === "V_VP9") __privateMethod(this, _fixVP9ColorSpace, fixVP9ColorSpace_fn).call(this, videoChunk);
        __privateSet(this, _lastVideoTimestamp, videoChunk.timestamp);
        while(__privateGet(this, _audioChunkQueue).length > 0 && __privateGet(this, _audioChunkQueue)[0].timestamp <= videoChunk.timestamp){
            let audioChunk = __privateGet(this, _audioChunkQueue).shift();
            __privateMethod(this, _writeBlock, writeBlock_fn).call(this, audioChunk, false);
        }
        if (!__privateGet(this, _options).audio || videoChunk.timestamp <= __privateGet(this, _lastAudioTimestamp)) {
            __privateMethod(this, _writeBlock, writeBlock_fn).call(this, videoChunk, true);
        } else {
            __privateGet(this, _videoChunkQueue).push(videoChunk);
        }
        __privateMethod(this, _writeSubtitleChunks, writeSubtitleChunks_fn).call(this);
        __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
    }
    addAudioChunk(chunk, meta, timestamp) {
        let data = new Uint8Array(chunk.byteLength);
        chunk.copyTo(data);
        this.addAudioChunkRaw(data, chunk.type, timestamp != null ? timestamp : chunk.timestamp, meta);
    }
    addAudioChunkRaw(data, type, timestamp, meta) {
        __privateMethod(this, _ensureNotFinalized, ensureNotFinalized_fn).call(this);
        if (!__privateGet(this, _options).audio) throw new Error("No audio track declared.");
        if (__privateGet(this, _firstAudioTimestamp) === void 0) __privateSet(this, _firstAudioTimestamp, timestamp);
        if (meta == null ? void 0 : meta.decoderConfig) {
            if (__privateGet(this, _options).streaming) {
                __privateSet(this, _audioCodecPrivate, __privateMethod(this, _createCodecPrivateElement, createCodecPrivateElement_fn).call(this, meta.decoderConfig.description));
            } else {
                __privateMethod(this, _writeCodecPrivate, writeCodecPrivate_fn).call(this, __privateGet(this, _audioCodecPrivate), meta.decoderConfig.description);
            }
        }
        let audioChunk = __privateMethod(this, _createInternalChunk, createInternalChunk_fn).call(this, data, type, timestamp, AUDIO_TRACK_NUMBER);
        __privateSet(this, _lastAudioTimestamp, audioChunk.timestamp);
        while(__privateGet(this, _videoChunkQueue).length > 0 && __privateGet(this, _videoChunkQueue)[0].timestamp <= audioChunk.timestamp){
            let videoChunk = __privateGet(this, _videoChunkQueue).shift();
            __privateMethod(this, _writeBlock, writeBlock_fn).call(this, videoChunk, true);
        }
        if (!__privateGet(this, _options).video || audioChunk.timestamp <= __privateGet(this, _lastVideoTimestamp)) {
            __privateMethod(this, _writeBlock, writeBlock_fn).call(this, audioChunk, !__privateGet(this, _options).video);
        } else {
            __privateGet(this, _audioChunkQueue).push(audioChunk);
        }
        __privateMethod(this, _writeSubtitleChunks, writeSubtitleChunks_fn).call(this);
        __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
    }
    addSubtitleChunk(chunk, meta, timestamp) {
        __privateMethod(this, _ensureNotFinalized, ensureNotFinalized_fn).call(this);
        if (!__privateGet(this, _options).subtitles) throw new Error("No subtitle track declared.");
        if (meta == null ? void 0 : meta.decoderConfig) {
            if (__privateGet(this, _options).streaming) {
                __privateSet(this, _subtitleCodecPrivate, __privateMethod(this, _createCodecPrivateElement, createCodecPrivateElement_fn).call(this, meta.decoderConfig.description));
            } else {
                __privateMethod(this, _writeCodecPrivate, writeCodecPrivate_fn).call(this, __privateGet(this, _subtitleCodecPrivate), meta.decoderConfig.description);
            }
        }
        let subtitleChunk = __privateMethod(this, _createInternalChunk, createInternalChunk_fn).call(this, chunk.body, "key", timestamp != null ? timestamp : chunk.timestamp, SUBTITLE_TRACK_NUMBER, chunk.duration, chunk.additions);
        __privateSet(this, _lastSubtitleTimestamp, subtitleChunk.timestamp);
        __privateGet(this, _subtitleChunkQueue).push(subtitleChunk);
        __privateMethod(this, _writeSubtitleChunks, writeSubtitleChunks_fn).call(this);
        __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
    }
    finalize() {
        while(__privateGet(this, _videoChunkQueue).length > 0)__privateMethod(this, _writeBlock, writeBlock_fn).call(this, __privateGet(this, _videoChunkQueue).shift(), true);
        while(__privateGet(this, _audioChunkQueue).length > 0)__privateMethod(this, _writeBlock, writeBlock_fn).call(this, __privateGet(this, _audioChunkQueue).shift(), true);
        while(__privateGet(this, _subtitleChunkQueue).length > 0 && __privateGet(this, _subtitleChunkQueue)[0].timestamp <= __privateGet(this, _duration)){
            __privateMethod(this, _writeBlock, writeBlock_fn).call(this, __privateGet(this, _subtitleChunkQueue).shift(), false);
        }
        if (!__privateGet(this, _options).streaming) {
            __privateMethod(this, _finalizeCurrentCluster, finalizeCurrentCluster_fn).call(this);
        }
        __privateGet(this, _writer).writeEBML(__privateGet(this, _cues));
        if (!__privateGet(this, _options).streaming) {
            let endPos = __privateGet(this, _writer).pos;
            let segmentSize = __privateGet(this, _writer).pos - __privateGet(this, _segmentDataOffset, segmentDataOffset_get);
            __privateGet(this, _writer).seek(__privateGet(this, _writer).offsets.get(__privateGet(this, _segment)) + 4);
            __privateGet(this, _writer).writeEBMLVarInt(segmentSize, SEGMENT_SIZE_BYTES);
            __privateGet(this, _segmentDuration).data = new EBMLFloat64(__privateGet(this, _duration));
            __privateGet(this, _writer).seek(__privateGet(this, _writer).offsets.get(__privateGet(this, _segmentDuration)));
            __privateGet(this, _writer).writeEBML(__privateGet(this, _segmentDuration));
            __privateGet(this, _seekHead).data[0].data[1].data = __privateGet(this, _writer).offsets.get(__privateGet(this, _cues)) - __privateGet(this, _segmentDataOffset, segmentDataOffset_get);
            __privateGet(this, _seekHead).data[1].data[1].data = __privateGet(this, _writer).offsets.get(__privateGet(this, _segmentInfo)) - __privateGet(this, _segmentDataOffset, segmentDataOffset_get);
            __privateGet(this, _seekHead).data[2].data[1].data = __privateGet(this, _writer).offsets.get(__privateGet(this, _tracksElement)) - __privateGet(this, _segmentDataOffset, segmentDataOffset_get);
            __privateGet(this, _writer).seek(__privateGet(this, _writer).offsets.get(__privateGet(this, _seekHead)));
            __privateGet(this, _writer).writeEBML(__privateGet(this, _seekHead));
            __privateGet(this, _writer).seek(endPos);
        }
        __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
        __privateGet(this, _writer).finalize();
        __privateSet(this, _finalized, true);
    }
};
_options = new WeakMap();
_writer = new WeakMap();
_segment = new WeakMap();
_segmentInfo = new WeakMap();
_seekHead = new WeakMap();
_tracksElement = new WeakMap();
_segmentDuration = new WeakMap();
_colourElement = new WeakMap();
_videoCodecPrivate = new WeakMap();
_audioCodecPrivate = new WeakMap();
_subtitleCodecPrivate = new WeakMap();
_cues = new WeakMap();
_currentCluster = new WeakMap();
_currentClusterTimestamp = new WeakMap();
_duration = new WeakMap();
_videoChunkQueue = new WeakMap();
_audioChunkQueue = new WeakMap();
_subtitleChunkQueue = new WeakMap();
_firstVideoTimestamp = new WeakMap();
_firstAudioTimestamp = new WeakMap();
_lastVideoTimestamp = new WeakMap();
_lastAudioTimestamp = new WeakMap();
_lastSubtitleTimestamp = new WeakMap();
_colorSpace = new WeakMap();
_finalized = new WeakMap();
_validateOptions = new WeakSet();
validateOptions_fn = function(options) {
    if (options.type && options.type !== "webm" && options.type !== "matroska") {
        throw new Error(`Invalid type: ${options.type}`);
    }
    if (options.firstTimestampBehavior && !FIRST_TIMESTAMP_BEHAVIORS.includes(options.firstTimestampBehavior)) {
        throw new Error(`Invalid first timestamp behavior: ${options.firstTimestampBehavior}`);
    }
};
_createFileHeader = new WeakSet();
createFileHeader_fn = function() {
    __privateMethod(this, _writeEBMLHeader, writeEBMLHeader_fn).call(this);
    if (!__privateGet(this, _options).streaming) {
        __privateMethod(this, _createSeekHead, createSeekHead_fn).call(this);
    }
    __privateMethod(this, _createSegmentInfo, createSegmentInfo_fn).call(this);
    __privateMethod(this, _createCodecPrivatePlaceholders, createCodecPrivatePlaceholders_fn).call(this);
    __privateMethod(this, _createColourElement, createColourElement_fn).call(this);
    if (!__privateGet(this, _options).streaming) {
        __privateMethod(this, _createTracks, createTracks_fn).call(this);
        __privateMethod(this, _createSegment, createSegment_fn).call(this);
    }
    __privateMethod(this, _createCues, createCues_fn).call(this);
    __privateMethod(this, _maybeFlushStreamingTargetWriter, maybeFlushStreamingTargetWriter_fn).call(this);
};
_writeEBMLHeader = new WeakSet();
writeEBMLHeader_fn = function() {
    var _a;
    let ebmlHeader = {
        id: 440786851 /* EBML */ ,
        data: [
            {
                id: 17030 /* EBMLVersion */ ,
                data: 1
            },
            {
                id: 17143 /* EBMLReadVersion */ ,
                data: 1
            },
            {
                id: 17138 /* EBMLMaxIDLength */ ,
                data: 4
            },
            {
                id: 17139 /* EBMLMaxSizeLength */ ,
                data: 8
            },
            {
                id: 17026 /* DocType */ ,
                data: (_a = __privateGet(this, _options).type) != null ? _a : "webm"
            },
            {
                id: 17031 /* DocTypeVersion */ ,
                data: 2
            },
            {
                id: 17029 /* DocTypeReadVersion */ ,
                data: 2
            }
        ]
    };
    __privateGet(this, _writer).writeEBML(ebmlHeader);
};
_createCodecPrivatePlaceholders = new WeakSet();
createCodecPrivatePlaceholders_fn = function() {
    __privateSet(this, _videoCodecPrivate, {
        id: 236 /* Void */ ,
        size: 4,
        data: new Uint8Array(CODEC_PRIVATE_MAX_SIZE)
    });
    __privateSet(this, _audioCodecPrivate, {
        id: 236 /* Void */ ,
        size: 4,
        data: new Uint8Array(CODEC_PRIVATE_MAX_SIZE)
    });
    __privateSet(this, _subtitleCodecPrivate, {
        id: 236 /* Void */ ,
        size: 4,
        data: new Uint8Array(CODEC_PRIVATE_MAX_SIZE)
    });
};
_createColourElement = new WeakSet();
createColourElement_fn = function() {
    __privateSet(this, _colourElement, {
        id: 21936 /* Colour */ ,
        data: [
            {
                id: 21937 /* MatrixCoefficients */ ,
                data: 2
            },
            {
                id: 21946 /* TransferCharacteristics */ ,
                data: 2
            },
            {
                id: 21947 /* Primaries */ ,
                data: 2
            },
            {
                id: 21945 /* Range */ ,
                data: 0
            }
        ]
    });
};
_createSeekHead = new WeakSet();
createSeekHead_fn = function() {
    const kaxCues = new Uint8Array([
        28,
        83,
        187,
        107
    ]);
    const kaxInfo = new Uint8Array([
        21,
        73,
        169,
        102
    ]);
    const kaxTracks = new Uint8Array([
        22,
        84,
        174,
        107
    ]);
    let seekHead = {
        id: 290298740 /* SeekHead */ ,
        data: [
            {
                id: 19899 /* Seek */ ,
                data: [
                    {
                        id: 21419 /* SeekID */ ,
                        data: kaxCues
                    },
                    {
                        id: 21420 /* SeekPosition */ ,
                        size: 5,
                        data: 0
                    }
                ]
            },
            {
                id: 19899 /* Seek */ ,
                data: [
                    {
                        id: 21419 /* SeekID */ ,
                        data: kaxInfo
                    },
                    {
                        id: 21420 /* SeekPosition */ ,
                        size: 5,
                        data: 0
                    }
                ]
            },
            {
                id: 19899 /* Seek */ ,
                data: [
                    {
                        id: 21419 /* SeekID */ ,
                        data: kaxTracks
                    },
                    {
                        id: 21420 /* SeekPosition */ ,
                        size: 5,
                        data: 0
                    }
                ]
            }
        ]
    };
    __privateSet(this, _seekHead, seekHead);
};
_createSegmentInfo = new WeakSet();
createSegmentInfo_fn = function() {
    let segmentDuration = {
        id: 17545 /* Duration */ ,
        data: new EBMLFloat64(0)
    };
    __privateSet(this, _segmentDuration, segmentDuration);
    let segmentInfo = {
        id: 357149030 /* Info */ ,
        data: [
            {
                id: 2807729 /* TimestampScale */ ,
                data: 1e6
            },
            {
                id: 19840 /* MuxingApp */ ,
                data: APP_NAME
            },
            {
                id: 22337 /* WritingApp */ ,
                data: APP_NAME
            },
            !__privateGet(this, _options).streaming ? segmentDuration : null
        ]
    };
    __privateSet(this, _segmentInfo, segmentInfo);
};
_createTracks = new WeakSet();
createTracks_fn = function() {
    let tracksElement = {
        id: 374648427 /* Tracks */ ,
        data: []
    };
    __privateSet(this, _tracksElement, tracksElement);
    if (__privateGet(this, _options).video) {
        tracksElement.data.push({
            id: 174 /* TrackEntry */ ,
            data: [
                {
                    id: 215 /* TrackNumber */ ,
                    data: VIDEO_TRACK_NUMBER
                },
                {
                    id: 29637 /* TrackUID */ ,
                    data: VIDEO_TRACK_NUMBER
                },
                {
                    id: 131 /* TrackType */ ,
                    data: VIDEO_TRACK_TYPE
                },
                {
                    id: 134 /* CodecID */ ,
                    data: __privateGet(this, _options).video.codec
                },
                __privateGet(this, _videoCodecPrivate),
                __privateGet(this, _options).video.frameRate ? {
                    id: 2352003 /* DefaultDuration */ ,
                    data: 1e9 / __privateGet(this, _options).video.frameRate
                } : null,
                {
                    id: 224 /* Video */ ,
                    data: [
                        {
                            id: 176 /* PixelWidth */ ,
                            data: __privateGet(this, _options).video.width
                        },
                        {
                            id: 186 /* PixelHeight */ ,
                            data: __privateGet(this, _options).video.height
                        },
                        __privateGet(this, _options).video.alpha ? {
                            id: 21440 /* AlphaMode */ ,
                            data: 1
                        } : null,
                        __privateGet(this, _colourElement)
                    ]
                }
            ]
        });
    }
    if (__privateGet(this, _options).audio) {
        __privateSet(this, _audioCodecPrivate, __privateGet(this, _options).streaming ? __privateGet(this, _audioCodecPrivate) || null : {
            id: 236 /* Void */ ,
            size: 4,
            data: new Uint8Array(CODEC_PRIVATE_MAX_SIZE)
        });
        tracksElement.data.push({
            id: 174 /* TrackEntry */ ,
            data: [
                {
                    id: 215 /* TrackNumber */ ,
                    data: AUDIO_TRACK_NUMBER
                },
                {
                    id: 29637 /* TrackUID */ ,
                    data: AUDIO_TRACK_NUMBER
                },
                {
                    id: 131 /* TrackType */ ,
                    data: AUDIO_TRACK_TYPE
                },
                {
                    id: 134 /* CodecID */ ,
                    data: __privateGet(this, _options).audio.codec
                },
                __privateGet(this, _audioCodecPrivate),
                {
                    id: 225 /* Audio */ ,
                    data: [
                        {
                            id: 181 /* SamplingFrequency */ ,
                            data: new EBMLFloat32(__privateGet(this, _options).audio.sampleRate)
                        },
                        {
                            id: 159 /* Channels */ ,
                            data: __privateGet(this, _options).audio.numberOfChannels
                        },
                        __privateGet(this, _options).audio.bitDepth ? {
                            id: 25188 /* BitDepth */ ,
                            data: __privateGet(this, _options).audio.bitDepth
                        } : null
                    ]
                }
            ]
        });
    }
    if (__privateGet(this, _options).subtitles) {
        tracksElement.data.push({
            id: 174 /* TrackEntry */ ,
            data: [
                {
                    id: 215 /* TrackNumber */ ,
                    data: SUBTITLE_TRACK_NUMBER
                },
                {
                    id: 29637 /* TrackUID */ ,
                    data: SUBTITLE_TRACK_NUMBER
                },
                {
                    id: 131 /* TrackType */ ,
                    data: SUBTITLE_TRACK_TYPE
                },
                {
                    id: 134 /* CodecID */ ,
                    data: __privateGet(this, _options).subtitles.codec
                },
                __privateGet(this, _subtitleCodecPrivate)
            ]
        });
    }
};
_createSegment = new WeakSet();
createSegment_fn = function() {
    let segment = {
        id: 408125543 /* Segment */ ,
        size: __privateGet(this, _options).streaming ? -1 : SEGMENT_SIZE_BYTES,
        data: [
            !__privateGet(this, _options).streaming ? __privateGet(this, _seekHead) : null,
            __privateGet(this, _segmentInfo),
            __privateGet(this, _tracksElement)
        ]
    };
    __privateSet(this, _segment, segment);
    __privateGet(this, _writer).writeEBML(segment);
};
_createCues = new WeakSet();
createCues_fn = function() {
    __privateSet(this, _cues, {
        id: 475249515 /* Cues */ ,
        data: []
    });
};
_maybeFlushStreamingTargetWriter = new WeakSet();
maybeFlushStreamingTargetWriter_fn = function() {
    if (__privateGet(this, _writer) instanceof StreamTargetWriter) {
        __privateGet(this, _writer).flush();
    }
};
_segmentDataOffset = new WeakSet();
segmentDataOffset_get = function() {
    return __privateGet(this, _writer).dataOffsets.get(__privateGet(this, _segment));
};
_writeVideoDecoderConfig = new WeakSet();
writeVideoDecoderConfig_fn = function(meta) {
    if (!meta.decoderConfig) return;
    if (meta.decoderConfig.colorSpace) {
        let colorSpace = meta.decoderConfig.colorSpace;
        __privateSet(this, _colorSpace, colorSpace);
        __privateGet(this, _colourElement).data = [
            {
                id: 21937 /* MatrixCoefficients */ ,
                data: {
                    "rgb": 1,
                    "bt709": 1,
                    "bt470bg": 5,
                    "smpte170m": 6
                }[colorSpace.matrix]
            },
            {
                id: 21946 /* TransferCharacteristics */ ,
                data: {
                    "bt709": 1,
                    "smpte170m": 6,
                    "iec61966-2-1": 13
                }[colorSpace.transfer]
            },
            {
                id: 21947 /* Primaries */ ,
                data: {
                    "bt709": 1,
                    "bt470bg": 5,
                    "smpte170m": 6
                }[colorSpace.primaries]
            },
            {
                id: 21945 /* Range */ ,
                data: [
                    1,
                    2
                ][Number(colorSpace.fullRange)]
            }
        ];
        if (!__privateGet(this, _options).streaming) {
            let endPos = __privateGet(this, _writer).pos;
            __privateGet(this, _writer).seek(__privateGet(this, _writer).offsets.get(__privateGet(this, _colourElement)));
            __privateGet(this, _writer).writeEBML(__privateGet(this, _colourElement));
            __privateGet(this, _writer).seek(endPos);
        }
    }
    if (meta.decoderConfig.description) {
        if (__privateGet(this, _options).streaming) {
            __privateSet(this, _videoCodecPrivate, __privateMethod(this, _createCodecPrivateElement, createCodecPrivateElement_fn).call(this, meta.decoderConfig.description));
        } else {
            __privateMethod(this, _writeCodecPrivate, writeCodecPrivate_fn).call(this, __privateGet(this, _videoCodecPrivate), meta.decoderConfig.description);
        }
    }
};
_fixVP9ColorSpace = new WeakSet();
fixVP9ColorSpace_fn = function(chunk) {
    if (chunk.type !== "key") return;
    if (!__privateGet(this, _colorSpace)) return;
    let i = 0;
    if (readBits(chunk.data, 0, 2) !== 2) return;
    i += 2;
    let profile = (readBits(chunk.data, i + 1, i + 2) << 1) + readBits(chunk.data, i + 0, i + 1);
    i += 2;
    if (profile === 3) i++;
    let showExistingFrame = readBits(chunk.data, i + 0, i + 1);
    i++;
    if (showExistingFrame) return;
    let frameType = readBits(chunk.data, i + 0, i + 1);
    i++;
    if (frameType !== 0) return;
    i += 2;
    let syncCode = readBits(chunk.data, i + 0, i + 24);
    i += 24;
    if (syncCode !== 4817730) return;
    if (profile >= 2) i++;
    let colorSpaceID = {
        "rgb": 7,
        "bt709": 2,
        "bt470bg": 1,
        "smpte170m": 3
    }[__privateGet(this, _colorSpace).matrix];
    writeBits(chunk.data, i + 0, i + 3, colorSpaceID);
};
_writeSubtitleChunks = new WeakSet();
writeSubtitleChunks_fn = function() {
    let lastWrittenMediaTimestamp = Math.min(__privateGet(this, _options).video ? __privateGet(this, _lastVideoTimestamp) : Infinity, __privateGet(this, _options).audio ? __privateGet(this, _lastAudioTimestamp) : Infinity);
    let queue = __privateGet(this, _subtitleChunkQueue);
    while(queue.length > 0 && queue[0].timestamp <= lastWrittenMediaTimestamp){
        __privateMethod(this, _writeBlock, writeBlock_fn).call(this, queue.shift(), !__privateGet(this, _options).video && !__privateGet(this, _options).audio);
    }
};
_createInternalChunk = new WeakSet();
createInternalChunk_fn = function(data, type, timestamp, trackNumber, duration, additions) {
    let adjustedTimestamp = __privateMethod(this, _validateTimestamp, validateTimestamp_fn).call(this, timestamp, trackNumber);
    let internalChunk = {
        data,
        additions,
        type,
        timestamp: adjustedTimestamp,
        duration,
        trackNumber
    };
    return internalChunk;
};
_validateTimestamp = new WeakSet();
validateTimestamp_fn = function(timestamp, trackNumber) {
    let lastTimestamp = trackNumber === VIDEO_TRACK_NUMBER ? __privateGet(this, _lastVideoTimestamp) : trackNumber === AUDIO_TRACK_NUMBER ? __privateGet(this, _lastAudioTimestamp) : __privateGet(this, _lastSubtitleTimestamp);
    if (trackNumber !== SUBTITLE_TRACK_NUMBER) {
        let firstTimestamp = trackNumber === VIDEO_TRACK_NUMBER ? __privateGet(this, _firstVideoTimestamp) : __privateGet(this, _firstAudioTimestamp);
        if (__privateGet(this, _options).firstTimestampBehavior === "strict" && lastTimestamp === -1 && timestamp !== 0) {
            throw new Error(`The first chunk for your media track must have a timestamp of 0 (received ${timestamp}). Non-zero first timestamps are often caused by directly piping frames or audio data from a MediaStreamTrack into the encoder. Their timestamps are typically relative to the age of the document, which is probably what you want.

If you want to offset all timestamps of a track such that the first one is zero, set firstTimestampBehavior: 'offset' in the options.
If you want to allow non-zero first timestamps, set firstTimestampBehavior: 'permissive'.
`);
        } else if (__privateGet(this, _options).firstTimestampBehavior === "offset") {
            timestamp -= firstTimestamp;
        }
    }
    if (timestamp < lastTimestamp) {
        throw new Error(`Timestamps must be monotonically increasing (went from ${lastTimestamp} to ${timestamp}).`);
    }
    if (timestamp < 0) {
        throw new Error(`Timestamps must be non-negative (received ${timestamp}).`);
    }
    return timestamp;
};
_writeBlock = new WeakSet();
writeBlock_fn = function(chunk, canCreateNewCluster) {
    if (__privateGet(this, _options).streaming && !__privateGet(this, _tracksElement)) {
        __privateMethod(this, _createTracks, createTracks_fn).call(this);
        __privateMethod(this, _createSegment, createSegment_fn).call(this);
    }
    let msTimestamp = Math.floor(chunk.timestamp / 1e3);
    let shouldCreateNewClusterFromKeyFrame = canCreateNewCluster && chunk.type === "key" && msTimestamp - __privateGet(this, _currentClusterTimestamp) >= 1e3;
    if (!__privateGet(this, _currentCluster) || shouldCreateNewClusterFromKeyFrame) {
        __privateMethod(this, _createNewCluster, createNewCluster_fn).call(this, msTimestamp);
    }
    let relativeTimestamp = msTimestamp - __privateGet(this, _currentClusterTimestamp);
    if (relativeTimestamp < 0) {
        return;
    }
    let clusterIsTooLong = relativeTimestamp >= MAX_CHUNK_LENGTH_MS;
    if (clusterIsTooLong) {
        throw new Error(`Current Matroska cluster exceeded its maximum allowed length of ${MAX_CHUNK_LENGTH_MS} milliseconds. In order to produce a correct WebM file, you must pass in a key frame at least every ${MAX_CHUNK_LENGTH_MS} milliseconds.`);
    }
    let prelude = new Uint8Array(4);
    let view = new DataView(prelude.buffer);
    view.setUint8(0, 128 | chunk.trackNumber);
    view.setInt16(1, relativeTimestamp, false);
    if (chunk.duration === void 0 && !chunk.additions) {
        view.setUint8(3, Number(chunk.type === "key") << 7);
        let simpleBlock = {
            id: 163 /* SimpleBlock */ ,
            data: [
                prelude,
                chunk.data
            ]
        };
        __privateGet(this, _writer).writeEBML(simpleBlock);
    } else {
        let msDuration = Math.floor(chunk.duration / 1e3);
        let blockGroup = {
            id: 160 /* BlockGroup */ ,
            data: [
                {
                    id: 161 /* Block */ ,
                    data: [
                        prelude,
                        chunk.data
                    ]
                },
                chunk.duration !== void 0 ? {
                    id: 155 /* BlockDuration */ ,
                    data: msDuration
                } : null,
                chunk.additions ? {
                    id: 30113 /* BlockAdditions */ ,
                    data: chunk.additions
                } : null
            ]
        };
        __privateGet(this, _writer).writeEBML(blockGroup);
    }
    __privateSet(this, _duration, Math.max(__privateGet(this, _duration), msTimestamp));
};
_createCodecPrivateElement = new WeakSet();
createCodecPrivateElement_fn = function(data) {
    return {
        id: 25506 /* CodecPrivate */ ,
        size: 4,
        data: new Uint8Array(data)
    };
};
_writeCodecPrivate = new WeakSet();
writeCodecPrivate_fn = function(element, data) {
    let endPos = __privateGet(this, _writer).pos;
    __privateGet(this, _writer).seek(__privateGet(this, _writer).offsets.get(element));
    let codecPrivateElementSize = 2 + 4 + data.byteLength;
    let voidDataSize = CODEC_PRIVATE_MAX_SIZE - codecPrivateElementSize;
    if (voidDataSize < 0) {
        let newByteLength = data.byteLength + voidDataSize;
        if (data instanceof ArrayBuffer) {
            data = data.slice(0, newByteLength);
        } else {
            data = data.buffer.slice(0, newByteLength);
        }
        voidDataSize = 0;
    }
    element = [
        __privateMethod(this, _createCodecPrivateElement, createCodecPrivateElement_fn).call(this, data),
        {
            id: 236 /* Void */ ,
            size: 4,
            data: new Uint8Array(voidDataSize)
        }
    ];
    __privateGet(this, _writer).writeEBML(element);
    __privateGet(this, _writer).seek(endPos);
};
_createNewCluster = new WeakSet();
createNewCluster_fn = function(timestamp) {
    if (__privateGet(this, _currentCluster) && !__privateGet(this, _options).streaming) {
        __privateMethod(this, _finalizeCurrentCluster, finalizeCurrentCluster_fn).call(this);
    }
    __privateSet(this, _currentCluster, {
        id: 524531317 /* Cluster */ ,
        size: __privateGet(this, _options).streaming ? -1 : CLUSTER_SIZE_BYTES,
        data: [
            {
                id: 231 /* Timestamp */ ,
                data: timestamp
            }
        ]
    });
    __privateGet(this, _writer).writeEBML(__privateGet(this, _currentCluster));
    __privateSet(this, _currentClusterTimestamp, timestamp);
    let clusterOffsetFromSegment = __privateGet(this, _writer).offsets.get(__privateGet(this, _currentCluster)) - __privateGet(this, _segmentDataOffset, segmentDataOffset_get);
    __privateGet(this, _cues).data.push({
        id: 187 /* CuePoint */ ,
        data: [
            {
                id: 179 /* CueTime */ ,
                data: timestamp
            },
            __privateGet(this, _options).video ? {
                id: 183 /* CueTrackPositions */ ,
                data: [
                    {
                        id: 247 /* CueTrack */ ,
                        data: VIDEO_TRACK_NUMBER
                    },
                    {
                        id: 241 /* CueClusterPosition */ ,
                        data: clusterOffsetFromSegment
                    }
                ]
            } : null,
            __privateGet(this, _options).audio ? {
                id: 183 /* CueTrackPositions */ ,
                data: [
                    {
                        id: 247 /* CueTrack */ ,
                        data: AUDIO_TRACK_NUMBER
                    },
                    {
                        id: 241 /* CueClusterPosition */ ,
                        data: clusterOffsetFromSegment
                    }
                ]
            } : null
        ]
    });
};
_finalizeCurrentCluster = new WeakSet();
finalizeCurrentCluster_fn = function() {
    let clusterSize = __privateGet(this, _writer).pos - __privateGet(this, _writer).dataOffsets.get(__privateGet(this, _currentCluster));
    let endPos = __privateGet(this, _writer).pos;
    __privateGet(this, _writer).seek(__privateGet(this, _writer).offsets.get(__privateGet(this, _currentCluster)) + 4);
    __privateGet(this, _writer).writeEBMLVarInt(clusterSize, CLUSTER_SIZE_BYTES);
    __privateGet(this, _writer).seek(endPos);
};
_ensureNotFinalized = new WeakSet();
ensureNotFinalized_fn = function() {
    if (__privateGet(this, _finalized)) {
        throw new Error("Cannot add new video or audio chunks after the file has been finalized.");
    }
};
// src/subtitles.ts
var cueBlockHeaderRegex = /(?:(.+?)\n)?((?:\d{2}:)?\d{2}:\d{2}.\d{3})\s+-->\s+((?:\d{2}:)?\d{2}:\d{2}.\d{3})/g;
var preambleStartRegex = /^WEBVTT.*?\n{2}/;
var timestampRegex = /(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})/;
var inlineTimestampRegex = /<(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})>/g;
var textEncoder = new TextEncoder();
var _options2, _config, _preambleSeen, _preambleBytes, _preambleEmitted, _parseTimestamp, parseTimestamp_fn, _formatTimestamp, formatTimestamp_fn;
var SubtitleEncoder = class {
    constructor(options){
        __privateAdd(this, _parseTimestamp);
        __privateAdd(this, _formatTimestamp);
        __privateAdd(this, _options2, void 0);
        __privateAdd(this, _config, void 0);
        __privateAdd(this, _preambleSeen, false);
        __privateAdd(this, _preambleBytes, void 0);
        __privateAdd(this, _preambleEmitted, false);
        __privateSet(this, _options2, options);
    }
    configure(config) {
        if (config.codec !== "webvtt") {
            throw new Error("Codec must be 'webvtt'.");
        }
        __privateSet(this, _config, config);
    }
    encode(text) {
        var _a;
        if (!__privateGet(this, _config)) {
            throw new Error("Encoder not configured.");
        }
        text = text.replace("\r\n", "\n").replace("\r", "\n");
        cueBlockHeaderRegex.lastIndex = 0;
        let match;
        if (!__privateGet(this, _preambleSeen)) {
            if (!preambleStartRegex.test(text)) {
                let error = new Error("WebVTT preamble incorrect.");
                __privateGet(this, _options2).error(error);
                throw error;
            }
            match = cueBlockHeaderRegex.exec(text);
            let preamble = text.slice(0, (_a = match == null ? void 0 : match.index) != null ? _a : text.length).trimEnd();
            if (!preamble) {
                let error = new Error("No WebVTT preamble provided.");
                __privateGet(this, _options2).error(error);
                throw error;
            }
            __privateSet(this, _preambleBytes, textEncoder.encode(preamble));
            __privateSet(this, _preambleSeen, true);
            if (match) {
                text = text.slice(match.index);
                cueBlockHeaderRegex.lastIndex = 0;
            }
        }
        while(match = cueBlockHeaderRegex.exec(text)){
            let notes = text.slice(0, match.index);
            let cueIdentifier = match[1] || "";
            let matchEnd = match.index + match[0].length;
            let bodyStart = text.indexOf("\n", matchEnd) + 1;
            let cueSettings = text.slice(matchEnd, bodyStart).trim();
            let bodyEnd = text.indexOf("\n\n", matchEnd);
            if (bodyEnd === -1) bodyEnd = text.length;
            let startTime = __privateMethod(this, _parseTimestamp, parseTimestamp_fn).call(this, match[2]);
            let endTime = __privateMethod(this, _parseTimestamp, parseTimestamp_fn).call(this, match[3]);
            let duration = endTime - startTime;
            let body = text.slice(bodyStart, bodyEnd);
            let additions = `${cueSettings}
${cueIdentifier}
${notes}`;
            inlineTimestampRegex.lastIndex = 0;
            body = body.replace(inlineTimestampRegex, (match2)=>{
                let time = __privateMethod(this, _parseTimestamp, parseTimestamp_fn).call(this, match2.slice(1, -1));
                let offsetTime = time - startTime;
                return `<${__privateMethod(this, _formatTimestamp, formatTimestamp_fn).call(this, offsetTime)}>`;
            });
            text = text.slice(bodyEnd).trimStart();
            cueBlockHeaderRegex.lastIndex = 0;
            let chunk = {
                body: textEncoder.encode(body),
                additions: additions.trim() === "" ? void 0 : textEncoder.encode(additions),
                timestamp: startTime * 1e3,
                duration: duration * 1e3
            };
            let meta = {};
            if (!__privateGet(this, _preambleEmitted)) {
                meta.decoderConfig = {
                    description: __privateGet(this, _preambleBytes)
                };
                __privateSet(this, _preambleEmitted, true);
            }
            __privateGet(this, _options2).output(chunk, meta);
        }
    }
};
_options2 = new WeakMap();
_config = new WeakMap();
_preambleSeen = new WeakMap();
_preambleBytes = new WeakMap();
_preambleEmitted = new WeakMap();
_parseTimestamp = new WeakSet();
parseTimestamp_fn = function(string) {
    let match = timestampRegex.exec(string);
    if (!match) throw new Error("Expected match.");
    return 60 * 60 * 1e3 * Number(match[1] || "0") + 60 * 1e3 * Number(match[2]) + 1e3 * Number(match[3]) + Number(match[4]);
};
_formatTimestamp = new WeakSet();
formatTimestamp_fn = function(timestamp) {
    let hours = Math.floor(timestamp / (60 * 60 * 1e3));
    let minutes = Math.floor(timestamp % (60 * 60 * 1e3) / (60 * 1e3));
    let seconds = Math.floor(timestamp % (60 * 1e3) / 1e3);
    let milliseconds = timestamp % 1e3;
    return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0") + "." + milliseconds.toString().padStart(3, "0");
};

var WebMMuxer = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ArrayBufferTarget: ArrayBufferTarget,
  FileSystemWritableFileStreamTarget: FileSystemWritableFileStreamTarget,
  Muxer: Muxer,
  StreamTarget: StreamTarget,
  SubtitleEncoder: SubtitleEncoder
});

/** @module vp */ /**
 * List of codecs
 * @constant {import("../types.js").CodecItem[]}
 */ const VP_CODECS = [
    {
        name: "VP8",
        cccc: "vp08"
    },
    {
        name: "VP9",
        cccc: "vp09"
    }
];
/**
 * List of VP profiles numbers
 * @constant {number[]}
 */ const VP_PROFILES = [
    0,
    1,
    2,
    3
];
/**
 * VP Levels
 * @constant {number[]}
 * @see [webmproject.org]{@link https://www.webmproject.org/vp9/mp4/}
 */ // prettier-ignore
const VP_LEVELS = [
    "1",
    "1.1",
    "2",
    "2.1",
    "3",
    "3.1",
    "4",
    "4.1",
    "5",
    "5.1",
    "5.2",
    "6",
    "6.1",
    "6.2"
];
/**
 * List of supported bit depth
 * @constant {number[]}
 */ const VP_BIT_DEPTH = [
    8,
    10,
    12
];
/** @private  */ const formatProfile = (profile)=>String(profile).padStart(2, "0");
/** @private  */ const formatLevel$1 = (level)=>String(parseFloat(level) * 10).padStart(2, "0");
/** @private  */ const formatBitDepth = (bitDepth)=>String(bitDepth).padStart(2, "0");
/** @private  */ const formatCodec$1 = (cccc, PP, LL, DD)=>`${cccc}.${PP}.${LL}.${DD}`;
/**
 * Get a codec parameter string
 * @param {import("../types.js").VPCodecOptions} options
 * @returns {string}
 */ const getCodec$1 = (param)=>{
    let { name, profile, level, bitDepth } = param;
    const codec = VP_CODECS.find((codec)=>codec.name === name);
    if (!codec) throw new Error(`Unknown VP Codec "${name}"`);
    if (!VP_PROFILES.includes(profile)) {
        throw new Error(`Unknown VP Profile "${profile}"`);
    }
    if (!VP_LEVELS.includes(level)) {
        throw new Error(`Unknown VP Level "${level}"`);
    }
    if (!VP_BIT_DEPTH.includes(bitDepth)) {
        throw new Error(`Unknown VP BitDepth "${bitDepth}"`);
    }
    return formatCodec$1(codec.cccc, formatProfile(profile), formatLevel$1(level), formatBitDepth(bitDepth));
};

/** @module avc */ /**
 * List of profiles with their profile numbers (PP) and the constraints component (CC).
 * @constant {import("../types.js").VCProfileItem[]}
 */ const AVC_PROFILES = [
    {
        name: "Constrained Baseline",
        PP: "42",
        CC: "40"
    },
    {
        name: "Baseline",
        PP: "42",
        CC: "00"
    },
    {
        name: "Extended",
        PP: "58",
        CC: "00"
    },
    {
        name: "Main",
        PP: "4d",
        CC: "00"
    },
    {
        name: "High",
        PP: "64",
        CC: "00"
    },
    {
        name: "Progressive High",
        PP: "64",
        CC: "08"
    },
    {
        name: "Constrained High",
        PP: "64",
        CC: "0c"
    },
    {
        name: "High 10",
        PP: "6e",
        CC: "00"
    },
    {
        name: "High 4:2:2",
        PP: "7a",
        CC: "00"
    },
    {
        name: "High 4:4:4 Predictive",
        PP: "f4",
        CC: "00"
    },
    {
        name: "High 10 Intra",
        PP: "6e",
        CC: "10"
    },
    {
        name: "High 4:2:2 Intra",
        PP: "7a",
        CC: "10"
    },
    {
        name: "High 4:4:4 Intra",
        PP: "f4",
        CC: "10"
    },
    {
        name: "CAVLC 4:4:4 Intra",
        PP: "44",
        CC: "00"
    },
    {
        name: "Scalable Baseline",
        PP: "53",
        CC: "00"
    },
    {
        name: "Scalable Constrained Baseline",
        PP: "53",
        CC: "04"
    },
    {
        name: "Scalable High",
        PP: "56",
        CC: "00"
    },
    {
        name: "Scalable Constrained High",
        PP: "56",
        CC: "04"
    },
    {
        name: "Scalable High Intra",
        PP: "56",
        CC: "20"
    },
    {
        name: "Stereo High",
        PP: "80",
        CC: "00"
    },
    {
        name: "Multiview High",
        PP: "76",
        CC: "00"
    },
    {
        name: "Multiview Depth High",
        PP: "8a",
        CC: "00"
    }
];
const cccc = "avc1";
/**
 * AVC Levels
 * @constant {number[]}
 * @see [wikipedia.org]{@link https://en.wikipedia.org/wiki/Advanced_Video_Coding#Levels}
 */ // prettier-ignore
const AVC_LEVELS = [
    "1",
    "1.1",
    "1.2",
    "1.3",
    "2",
    "2.1",
    "2.2",
    "3",
    "3.1",
    "3.2",
    "4",
    "4.1",
    "4.2",
    "5",
    "5.1",
    "5.2",
    "6",
    "6.1",
    "6.2"
];
/** @private */ const formatLevel = (level)=>(parseFloat(level) * 10).toString(16).padStart(2, "0");
/** @private */ const formatCodec = (cccc, param, LL)=>{
    let { PP, CC } = param;
    return `${cccc}.${PP}${CC}${LL}`;
};
/**
 * Get a codec parameter string
 * @param {import("../types.js").AVCCodecOptions} options
 * @returns {string}
 */ const getCodec = (param)=>{
    let { profile: profileName, level } = param;
    if (!AVC_LEVELS.includes(level)) throw new Error(`Unknown AVC Level "${level}"`);
    const profile = AVC_PROFILES.find((profile)=>profile.name === profileName);
    if (!profile) throw new Error(`Unknown AVC Profile "${profileName}"`);
    return formatCodec(cccc, profile, formatLevel(level));
};

/**
 * @typedef {"mp4" | "webm" | "png" | "jpg" | "gif" | "mkv"} EncoderExtensions
 */ /**
 * @typedef {"in-browser" | "file-system"} EncoderTarget
 */ class Encoder {
    static #_ = /**
   * The extension the encoder supports
   * @type {Extensions[]}
   */ this.supportedExtensions = [
        "mp4",
        "webm"
    ];
    static #_2 = /**
   * The target to download the file to.
   * @type {EncoderTarget[]}
   */ this.supportedTargets = [
        "in-browser"
    ];
    static #_3 = this.defaultOptions = {
        frameMethod: "blob",
        extension: Encoder.supportedExtensions[0],
        target: Encoder.supportedTargets[0]
    };
    /**
   * Base Encoder class. All Encoders extend it and its method are called by the Recorder.
   * @class Encoder
   * @param {object} options
   *
   * @property {EncoderTarget} target
   * @property {EncoderExtensions} extension
   * @property {object} [encoderOptions]
   * @property {object} [muxerOptions]
   */ constructor(options){
        Object.assign(this, options);
    }
    /**
   * Setup the encoder: load binary, instantiate muxers, setup file system target...
   * @param {object} options
   */ async init(options) {
        Object.assign(this, options);
    }
    // File System API
    async getDirectory() {
        if (!("showDirectoryPicker" in window)) return;
        return await window.showDirectoryPicker();
    }
    async getDirectoryHandle(directory, name) {
        return await directory.getDirectoryHandle(name, {
            create: true
        });
    }
    async getFileHandle(name, options) {
        if (this.directoryHandle) {
            return await this.directoryHandle.getFileHandle(name, {
                create: true
            });
        }
        if (!("showSaveFilePicker" in window)) return;
        return await window.showSaveFilePicker({
            suggestedName: name,
            ...options
        });
    }
    async getWritableFileStream(fileHandle) {
        if (await fileHandle.queryPermission({
            mode: "readwrite"
        }) === "granted") {
            return await fileHandle.createWritable();
        }
    }
    // Override methods
    /**
   * Encode a single frame. The frameNumber is usually used for GOP (Group Of Pictures).
   * @param {number} frame
   * @param {number} [frameNumber]
   */ async encode() {}
    /**
   * Stop the encoding process and cleanup the temporary data.
   * @returns {(ArrayBuffer|Uint8Array|Blob[]|undefined)}
   */ async stop() {}
    /**
   * Clean up the encoder
   */ dispose() {}
}
var Encoder$1 = Encoder;

/**
 * Check for WebCodecs support on the current platform.
 * @type {boolean}
 */ const isWebCodecsSupported = typeof window !== "undefined" && typeof window.VideoEncoder === "function";
let link;
const downloadBlob = (filename, blobPart, mimeType)=>{
    link ||= document.createElement("a");
    link.download = filename;
    const blob = new Blob(blobPart, {
        type: mimeType
    });
    const url = URL.createObjectURL(blob);
    link.href = url;
    const event = new MouseEvent("click");
    link.dispatchEvent(event);
    setTimeout(()=>{
        URL.revokeObjectURL(url);
    }, 1);
};
const formatDate = (date)=>date.toISOString().replace(/:/g, "-").replace("T", "@").replace("Z", "");
const formatSeconds = (seconds)=>{
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds - minutes * 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};
const nextMultiple = (x, n)=>{
    if (n === void 0) n = 2;
    return Math.ceil(x / n) * n;
};
class Deferred {
    constructor(){
        this.resolve = null;
        this.reject = null;
        this.promise = new Promise((resolve, reject)=>{
            this.resolve = resolve;
            this.reject = reject;
        });
        Object.freeze(this);
    }
}
/**
 * Estimate the bit rate of a video rounded to nearest megabit.
 * Based on "H.264 for the rest of us" by Kush Amerasinghe.
 *
 * @example
 * ```js
 * // Full HD (1080p)
 * const bitRate = estimateBitRate(1920, 1080, 30, "variable");
 * const bitRateMbps = bitRate * 1_000_000; // => 13 Mbps
 * ```
 *
 * @param {number} width
 * @param {number} height
 * @param {number} frameRate
 * @param {number} motionRank A factor of 1, 2 or 4
 * @param {"variable" | "constant"} bitrateMode
 * @returns {number} A bitrate value in bits per second
 */ const estimateBitRate = (width, height, frameRate, motionRank, bitrateMode)=>{
    if (frameRate === void 0) frameRate = 30;
    if (motionRank === void 0) motionRank = 4;
    if (bitrateMode === void 0) bitrateMode = "variable";
    return Math.round(width * height * frameRate * motionRank * 0.07 * (bitrateMode === "variable" ? 0.75 : 1) / 1000000) * 1000000;
};

/**
 * @typedef {object} WebCodecsEncoderOptions
 * @property {number} [groupOfPictures=20]
 * @property {number} [flushFrequency=10]
 * @property {WebCodecsEncoderEncoderOptions} [encoderOptions={}]
 */ /**
 * @typedef {VideoEncoderConfig} WebCodecsEncoderEncoderOptions
 * @see [VideoEncoder.configure]{@link https://developer.mozilla.org/en-US/docs/Web/API/VideoEncoder/configure#config}
 */ /**
 * @typedef {MuxerOptions} WebCodecsMuxerOptions
 * @see [Mp4.MuxerOptions]{@link https://github.com/Vanilagy/mp4-muxer/#usage}
 * @see [WebM.MuxerOptions]{@link https://github.com/Vanilagy/webm-muxer/#usage}
 */ class WebCodecsEncoder extends Encoder$1 {
    static #_ = this.supportedExtensions = [
        "mp4",
        "webm",
        "mkv"
    ];
    static #_2 = this.supportedTargets = [
        "in-browser",
        "file-system"
    ];
    static #_3 = this.defaultOptions = {
        extension: WebCodecsEncoder.supportedExtensions[0],
        groupOfPictures: 20,
        flushFrequency: 10
    };
    get frameMethod() {
        return "videoFrame";
    }
    /**
   * @param {WebCodecsEncoderOptions} [options]
   */ constructor(options){
        super({
            ...WebCodecsEncoder.defaultOptions,
            ...options
        });
    }
    async init(options) {
        var _this_encoderOptions;
        super.init(options);
        if (this.target === "file-system") {
            const fileHandle = await this.getFileHandle(this.filename, {
                types: [
                    {
                        description: "Video File",
                        accept: {
                            [this.mimeType]: [
                                `.${this.extension}`
                            ]
                        }
                    }
                ]
            });
            this.writableFileStream = await this.getWritableFileStream(fileHandle);
        }
        const codec = ((_this_encoderOptions = this.encoderOptions) == null ? void 0 : _this_encoderOptions.codec) || (this.extension === "mp4" ? getCodec({
            profile: "High",
            level: "5.2"
        }) // avc1.640034
         : getCodec$1({
            name: "VP9",
            profile: 0,
            level: "1",
            bitDepth: 8
        })); // vp09.00.10.08
        const CCCC = codec.split(".")[0];
        const muxer = this.extension === "mp4" ? MP4Muxer : WebMMuxer;
        this.muxer = new muxer.Muxer({
            target: this.writableFileStream ? new muxer.FileSystemWritableFileStreamTarget(this.writableFileStream) : new muxer.ArrayBufferTarget(),
            type: this.extension === "mkv" ? "matroska" : "webm",
            video: {
                codec: this.extension === "mp4" ? CCCC.startsWith("hev") || CCCC.startsWith("hvc") // https://www.w3.org/TR/webcodecs-hevc-codec-registration/#fully-qualified-codec-strings
                 ? "hevc" : "avc" : `V_${CCCC.startsWith("av01") ? "AV1" : VP_CODECS.find((codec)=>codec.cccc === CCCC).name}`,
                width: this.width,
                height: this.height
            },
            firstTimestampBehavior: "offset",
            fastStart: this.writableFileStream ? false : "in-memory",
            ...this.muxerOptions
        });
        this.encoder = new VideoEncoder({
            output: (chunk, meta)=>this.muxer.addVideoChunk(chunk, meta),
            error: (e)=>console.error(e)
        });
        const config = {
            width: this.width,
            height: this.height,
            framerate: this.frameRate,
            bitrate: estimateBitRate(this.width, this.height, this.frameRate, this.encoderOptions.bitrateMode),
            // bitrate: 1e6,
            // alpha: "discard", // "keep"
            // bitrateMode: "variable", // "constant"
            // latencyMode: "quality", // "realtime" (faster encoding)
            // hardwareAcceleration: "no-preference", // "prefer-hardware" "prefer-software"
            ...this.encoderOptions,
            codec
        };
        this.encoder.configure(config);
        if (!(await VideoEncoder.isConfigSupported(config)).supported) {
            throw new Error(`canvas-record: Unsupported VideoEncoder config\n ${JSON.stringify(config)}`);
        }
    }
    async encode(frame, number) {
        const keyFrame = number % this.groupOfPictures === 0;
        this.encoder.encode(frame, {
            keyFrame
        });
        frame.close();
        if (this.flushFrequency && (number + 1) % this.flushFrequency === 0) {
            await this.encoder.flush();
        }
    }
    async stop() {
        var _this_muxer_target;
        await this.encoder.flush();
        this.muxer.finalize();
        const buffer = (_this_muxer_target = this.muxer.target) == null ? void 0 : _this_muxer_target.buffer;
        if (this.writableFileStream) await this.writableFileStream.close();
        return buffer;
    }
    async dispose() {
        this.encoder = null;
    }
}
var WebCodecsEncoder$1 = WebCodecsEncoder;

var h264Mp4Encoder_node = function(A) {
    var B = {};
    function Q(I) {
        if (B[I]) return B[I].exports;
        var g = B[I] = {
            i: I,
            l: !1,
            exports: {}
        };
        return A[I].call(g.exports, g, g.exports, Q), g.l = !0, g.exports;
    }
    return Q.m = A, Q.c = B, Q.d = function(A, B, I) {
        Q.o(A, B) || Object.defineProperty(A, B, {
            enumerable: !0,
            get: I
        });
    }, Q.r = function(A) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(A, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(A, "__esModule", {
            value: !0
        });
    }, Q.t = function(A, B) {
        if (1 & B && (A = Q(A)), 8 & B) return A;
        if (4 & B && "object" == typeof A && A && A.__esModule) return A;
        var I = Object.create(null);
        if (Q.r(I), Object.defineProperty(I, "default", {
            enumerable: !0,
            value: A
        }), 2 & B && "string" != typeof A) for(var g in A)Q.d(I, g, (function(B) {
            return A[B];
        }).bind(null, g));
        return I;
    }, Q.n = function(A) {
        var B = A && A.__esModule ? function() {
            return A.default;
        } : function() {
            return A;
        };
        return Q.d(B, "a", B), B;
    }, Q.o = function(A, B) {
        return Object.prototype.hasOwnProperty.call(A, B);
    }, Q.p = "", Q(Q.s = 2);
}([
    function(A, B) {
        A.exports = require$$0;
    },
    function(A, B, Q) {
        (function(B, I) {
            var g, E = (g = (g = "undefined" != typeof document && document.currentScript ? document.currentScript.src : void 0) || B, function(A) {
                var B;
                A = A || {}, B || (B = void 0 !== A ? A : {});
                var E, C = {};
                for(E in B)B.hasOwnProperty(E) && (C[E] = B[E]);
                var D, i, y, F, U = "./this.program";
                D = "object" == typeof window, i = "function" == typeof importScripts, y = "object" == typeof browser$1 && "object" == typeof browser$1.versions && "string" == typeof browser$1.versions.node, F = !D && !y && !i;
                var c, N, H, G, o = "";
                y ? (o = i ? Q(0).dirname(o) + "/" : I + "/", c = function(A, B) {
                    var I = _B(A);
                    return I ? B ? I : I.toString() : (H || (H = Q(3)), G || (G = Q(0)), A = G.normalize(A), H.readFileSync(A, B ? null : "utf8"));
                }, N = function(A) {
                    return (A = c(A, !0)).buffer || (A = new Uint8Array(A)), a(A.buffer), A;
                }, 1 < browser$1.argv.length && (U = browser$1.argv[1].replace(/\\/g, "/")), browser$1.on("uncaughtException", function(A) {
                    throw A;
                }), browser$1.on("unhandledRejection", FA), B.inspect = function() {
                    return "[Emscripten Module object]";
                }) : F ? ("undefined" != typeof read && (c = function(A) {
                    var B = _B(A);
                    return B ? TB(B) : read(A);
                }), N = function(A) {
                    var B;
                    return (B = _B(A)) ? B : "function" == typeof readbuffer ? new Uint8Array(readbuffer(A)) : (a("object" == typeof (B = read(A, "binary"))), B);
                }, "undefined" != typeof print && ("undefined" == typeof console && (console = {}), console.log = print, console.warn = console.error = "undefined" != typeof printErr ? printErr : print)) : (D || i) && (i ? o = self.location.href : document.currentScript && (o = document.currentScript.src), g && (o = g), o = 0 !== o.indexOf("blob:") ? o.substr(0, o.lastIndexOf("/") + 1) : "", c = function(A) {
                    try {
                        var B = new XMLHttpRequest;
                        return B.open("GET", A, !1), B.send(null), B.responseText;
                    } catch (B) {
                        if (A = _B(A)) return TB(A);
                        throw B;
                    }
                }, i && (N = function(A) {
                    try {
                        var B = new XMLHttpRequest;
                        return B.open("GET", A, !1), B.responseType = "arraybuffer", B.send(null), new Uint8Array(B.response);
                    } catch (B) {
                        if (A = _B(A)) return A;
                        throw B;
                    }
                }));
                var w = B.print || console.log.bind(console), Y = B.printErr || console.warn.bind(console);
                for(E in C)C.hasOwnProperty(E) && (B[E] = C[E]);
                C = null, B.thisProgram && (U = B.thisProgram);
                var s, L = 0;
                B.wasmBinary && (s = B.wasmBinary), B.noExitRuntime && B.noExitRuntime, "object" != typeof WebAssembly && Y("no native wasm support detected");
                var R, h = new WebAssembly.Table({
                    initial: 1182,
                    maximum: 1182,
                    element: "anyfunc"
                }), k = !1;
                function a(A, B) {
                    A || FA("Assertion failed: " + B);
                }
                var S = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
                function M(A, B, Q) {
                    var I = B + Q;
                    for(Q = B; A[Q] && !(Q >= I);)++Q;
                    if (16 < Q - B && A.subarray && S) return S.decode(A.subarray(B, Q));
                    for(I = ""; B < Q;){
                        var g = A[B++];
                        if (128 & g) {
                            var E = 63 & A[B++];
                            if (192 == (224 & g)) I += String.fromCharCode((31 & g) << 6 | E);
                            else {
                                var C = 63 & A[B++];
                                65536 > (g = 224 == (240 & g) ? (15 & g) << 12 | E << 6 | C : (7 & g) << 18 | E << 12 | C << 6 | 63 & A[B++]) ? I += String.fromCharCode(g) : (g -= 65536, I += String.fromCharCode(55296 | g >> 10, 56320 | 1023 & g));
                            }
                        } else I += String.fromCharCode(g);
                    }
                    return I;
                }
                function J(A) {
                    return A ? M(d, A, void 0) : "";
                }
                function V(A, B, Q, I) {
                    if (!(0 < I)) return 0;
                    var g = Q;
                    I = Q + I - 1;
                    for(var E = 0; E < A.length; ++E){
                        var C = A.charCodeAt(E);
                        if (55296 <= C && 57343 >= C && (C = 65536 + ((1023 & C) << 10) | 1023 & A.charCodeAt(++E)), 127 >= C) {
                            if (Q >= I) break;
                            B[Q++] = C;
                        } else {
                            if (2047 >= C) {
                                if (Q + 1 >= I) break;
                                B[Q++] = 192 | C >> 6;
                            } else {
                                if (65535 >= C) {
                                    if (Q + 2 >= I) break;
                                    B[Q++] = 224 | C >> 12;
                                } else {
                                    if (Q + 3 >= I) break;
                                    B[Q++] = 240 | C >> 18, B[Q++] = 128 | C >> 12 & 63;
                                }
                                B[Q++] = 128 | C >> 6 & 63;
                            }
                            B[Q++] = 128 | 63 & C;
                        }
                    }
                    return B[Q] = 0, Q - g;
                }
                function K(A) {
                    for(var B = 0, Q = 0; Q < A.length; ++Q){
                        var I = A.charCodeAt(Q);
                        55296 <= I && 57343 >= I && (I = 65536 + ((1023 & I) << 10) | 1023 & A.charCodeAt(++Q)), 127 >= I ? ++B : B = 2047 >= I ? B + 2 : 65535 >= I ? B + 3 : B + 4;
                    }
                    return B;
                }
                var t, n, d, r, e, l, x, Z, f, b = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0;
                function p(A) {
                    var B;
                    for(B = A >> 1; r[B];)++B;
                    if (32 < (B <<= 1) - A && b) return b.decode(d.subarray(A, B));
                    B = 0;
                    for(var Q = "";;){
                        var I = r[A + 2 * B >> 1];
                        if (0 == I) return Q;
                        ++B, Q += String.fromCharCode(I);
                    }
                }
                function q(A, B, Q) {
                    if (void 0 === Q && (Q = 2147483647), 2 > Q) return 0;
                    var I = B;
                    Q = (Q -= 2) < 2 * A.length ? Q / 2 : A.length;
                    for(var g = 0; g < Q; ++g)r[B >> 1] = A.charCodeAt(g), B += 2;
                    return r[B >> 1] = 0, B - I;
                }
                function u(A) {
                    return 2 * A.length;
                }
                function O(A) {
                    for(var B = 0, Q = "";;){
                        var I = l[A + 4 * B >> 2];
                        if (0 == I) return Q;
                        ++B, 65536 <= I ? (I -= 65536, Q += String.fromCharCode(55296 | I >> 10, 56320 | 1023 & I)) : Q += String.fromCharCode(I);
                    }
                }
                function m(A, B, Q) {
                    if (void 0 === Q && (Q = 2147483647), 4 > Q) return 0;
                    var I = B;
                    Q = I + Q - 4;
                    for(var g = 0; g < A.length; ++g){
                        var E = A.charCodeAt(g);
                        if (55296 <= E && 57343 >= E && (E = 65536 + ((1023 & E) << 10) | 1023 & A.charCodeAt(++g)), l[B >> 2] = E, (B += 4) + 4 > Q) break;
                    }
                    return l[B >> 2] = 0, B - I;
                }
                function W(A) {
                    for(var B = 0, Q = 0; Q < A.length; ++Q){
                        var I = A.charCodeAt(Q);
                        55296 <= I && 57343 >= I && ++Q, B += 4;
                    }
                    return B;
                }
                function X(A) {
                    t = A, B.HEAP8 = n = new Int8Array(A), B.HEAP16 = r = new Int16Array(A), B.HEAP32 = l = new Int32Array(A), B.HEAPU8 = d = new Uint8Array(A), B.HEAPU16 = e = new Uint16Array(A), B.HEAPU32 = x = new Uint32Array(A), B.HEAPF32 = Z = new Float32Array(A), B.HEAPF64 = f = new Float64Array(A);
                }
                var j = B.INITIAL_MEMORY || 16777216;
                function z(A) {
                    for(; 0 < A.length;){
                        var Q = A.shift();
                        if ("function" == typeof Q) Q(B);
                        else {
                            var I = Q.ob;
                            "number" == typeof I ? void 0 === Q.ua ? B.dynCall_v(I) : B.dynCall_vi(I, Q.ua) : I(void 0 === Q.ua ? null : Q.ua);
                        }
                    }
                }
                (R = B.wasmMemory ? B.wasmMemory : new WebAssembly.Memory({
                    initial: j / 65536,
                    maximum: 32768
                })) && (t = R.buffer), j = t.byteLength, X(t), l[22752] = 5334064;
                var v = [], T = [], P = [], $ = [];
                function AA() {
                    var A = B.preRun.shift();
                    v.unshift(A);
                }
                var BA = Math.abs, QA = Math.ceil, IA = Math.floor, gA = Math.min, EA = 0, DA = null;
                function iA() {
                    EA++, B.monitorRunDependencies && B.monitorRunDependencies(EA);
                }
                function yA() {
                    if (EA--, B.monitorRunDependencies && B.monitorRunDependencies(EA), 0 == EA && (DA)) {
                        var A = DA;
                        DA = null, A();
                    }
                }
                function FA(A) {
                    throw B.onAbort && B.onAbort(A), w(A), Y(A), k = !0, new WebAssembly.RuntimeError("abort(" + A + "). Build with -s ASSERTIONS=1 for more info.");
                }
                function UA(A, B) {
                    return String.prototype.startsWith ? A.startsWith(B) : 0 === A.indexOf(B);
                }
                B.preloadedImages = {}, B.preloadedAudios = {};
                if (!UA(GA, HA)) {
                    var oA = GA;
                    GA = B.locateFile ? B.locateFile(oA, o) : o + oA;
                }
                function wA() {
                    try {
                        if (s) return new Uint8Array(s);
                        var A = _B(GA);
                        if (A) return A;
                        if (N) return N(GA);
                        throw "both async and sync fetching of the wasm failed";
                    } catch (A) {
                        FA(A);
                    }
                }
                T.push({
                    ob: function() {
                        BQ();
                    }
                });
                var YA = {}, sA = [];
                function LA(A) {
                    if (!A || YA[A]) return A;
                    for(var B in YA)for(var Q = +B, I = YA[Q].ha, g = I.length, E = 0; E < g; E++)if (I[E] === A) return Q;
                    return A;
                }
                var RA = 0;
                function hA(A) {
                    try {
                        return IQ(A);
                    } catch (A) {}
                }
                function kA(A) {
                    return l[gQ() >> 2] = A;
                }
                function aA(A, B) {
                    for(var Q = 0, I = A.length - 1; 0 <= I; I--){
                        var g = A[I];
                        "." === g ? A.splice(I, 1) : ".." === g ? (A.splice(I, 1), Q++) : Q && (A.splice(I, 1), Q--);
                    }
                    if (B) for(; Q; Q--)A.unshift("..");
                    return A;
                }
                function SA(A) {
                    var B = "/" === A.charAt(0), Q = "/" === A.substr(-1);
                    return (A = aA(A.split("/").filter(function(A) {
                        return !!A;
                    }), !B).join("/")) || B || (A = "."), A && Q && (A += "/"), (B ? "/" : "") + A;
                }
                function MA(A) {
                    var B = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(A).slice(1);
                    return A = B[0], B = B[1], A || B ? (B && (B = B.substr(0, B.length - 1)), A + B) : ".";
                }
                function JA(A) {
                    if ("/" === A) return "/";
                    var B = A.lastIndexOf("/");
                    return -1 === B ? A : A.substr(B + 1);
                }
                function VA() {
                    var A = Array.prototype.slice.call(arguments, 0);
                    return SA(A.join("/"));
                }
                function KA(A, B) {
                    return SA(A + "/" + B);
                }
                function tA() {
                    for(var A = "", B = !1, Q = arguments.length - 1; -1 <= Q && !B; Q--){
                        if ("string" != typeof (B = 0 <= Q ? arguments[Q] : fA.cwd())) throw new TypeError("Arguments to path.resolve must be strings");
                        if (!B) return "";
                        A = B + "/" + A, B = "/" === B.charAt(0);
                    }
                    return (B ? "/" : "") + (A = aA(A.split("/").filter(function(A) {
                        return !!A;
                    }), !B).join("/")) || ".";
                }
                function nA(A, B) {
                    function Q(A) {
                        for(var B = 0; B < A.length && "" === A[B]; B++);
                        for(var Q = A.length - 1; 0 <= Q && "" === A[Q]; Q--);
                        return B > Q ? [] : A.slice(B, Q - B + 1);
                    }
                    A = tA(A).substr(1), B = tA(B).substr(1), A = Q(A.split("/")), B = Q(B.split("/"));
                    for(var I = Math.min(A.length, B.length), g = I, E = 0; E < I; E++)if (A[E] !== B[E]) {
                        g = E;
                        break;
                    }
                    for(I = [], E = g; E < A.length; E++)I.push("..");
                    return (I = I.concat(B.slice(g))).join("/");
                }
                var dA = [];
                function rA(A, B) {
                    dA[A] = {
                        input: [],
                        output: [],
                        ea: B
                    }, fA.$a(A, eA);
                }
                var eA = {
                    open: function(A) {
                        var B = dA[A.node.rdev];
                        if (!B) throw new fA.b(43);
                        A.tty = B, A.seekable = !1;
                    },
                    close: function(A) {
                        A.tty.ea.flush(A.tty);
                    },
                    flush: function(A) {
                        A.tty.ea.flush(A.tty);
                    },
                    read: function(A, B, Q, I) {
                        if (!A.tty || !A.tty.ea.qb) throw new fA.b(60);
                        for(var g = 0, E = 0; E < I; E++){
                            try {
                                var C = A.tty.ea.qb(A.tty);
                            } catch (A) {
                                throw new fA.b(29);
                            }
                            if (void 0 === C && 0 === g) throw new fA.b(6);
                            if (null == C) break;
                            g++, B[Q + E] = C;
                        }
                        return g && (A.node.timestamp = Date.now()), g;
                    },
                    write: function(A, B, Q, I) {
                        if (!A.tty || !A.tty.ea.Xa) throw new fA.b(60);
                        try {
                            for(var g = 0; g < I; g++)A.tty.ea.Xa(A.tty, B[Q + g]);
                        } catch (A) {
                            throw new fA.b(29);
                        }
                        return I && (A.node.timestamp = Date.now()), g;
                    }
                }, lA = {
                    qb: function(A) {
                        if (!A.input.length) {
                            var B = null;
                            if (y) {
                                var Q = Buffer.S ? Buffer.S(256) : new Buffer(256), I = 0;
                                try {
                                    I = H.readSync(browser$1.stdin.fd, Q, 0, 256, null);
                                } catch (A) {
                                    if (-1 == A.toString().indexOf("EOF")) throw A;
                                    I = 0;
                                }
                                B = 0 < I ? Q.slice(0, I).toString("utf-8") : null;
                            } else "undefined" != typeof window && "function" == typeof window.prompt ? null !== (B = window.prompt("Input: ")) && (B += "\n") : "function" == typeof readline && null !== (B = readline()) && (B += "\n");
                            if (!B) return null;
                            A.input = vB(B, !0);
                        }
                        return A.input.shift();
                    },
                    Xa: function(A, B) {
                        null === B || 10 === B ? (w(M(A.output, 0)), A.output = []) : 0 != B && A.output.push(B);
                    },
                    flush: function(A) {
                        A.output && 0 < A.output.length && (w(M(A.output, 0)), A.output = []);
                    }
                }, xA = {
                    Xa: function(A, B) {
                        null === B || 10 === B ? (Y(M(A.output, 0)), A.output = []) : 0 != B && A.output.push(B);
                    },
                    flush: function(A) {
                        A.output && 0 < A.output.length && (Y(M(A.output, 0)), A.output = []);
                    }
                }, ZA = {
                    M: null,
                    s: function() {
                        return ZA.createNode(null, "/", 16895, 0);
                    },
                    createNode: function(A, B, Q, I) {
                        if (fA.$b(Q) || fA.isFIFO(Q)) throw new fA.b(63);
                        return ZA.M || (ZA.M = {
                            dir: {
                                node: {
                                    J: ZA.g.J,
                                    A: ZA.g.A,
                                    lookup: ZA.g.lookup,
                                    R: ZA.g.R,
                                    rename: ZA.g.rename,
                                    unlink: ZA.g.unlink,
                                    rmdir: ZA.g.rmdir,
                                    readdir: ZA.g.readdir,
                                    symlink: ZA.g.symlink
                                },
                                stream: {
                                    K: ZA.h.K
                                }
                            },
                            file: {
                                node: {
                                    J: ZA.g.J,
                                    A: ZA.g.A
                                },
                                stream: {
                                    K: ZA.h.K,
                                    read: ZA.h.read,
                                    write: ZA.h.write,
                                    ia: ZA.h.ia,
                                    na: ZA.h.na,
                                    da: ZA.h.da
                                }
                            },
                            link: {
                                node: {
                                    J: ZA.g.J,
                                    A: ZA.g.A,
                                    readlink: ZA.g.readlink
                                },
                                stream: {}
                            },
                            gb: {
                                node: {
                                    J: ZA.g.J,
                                    A: ZA.g.A
                                },
                                stream: fA.Kb
                            }
                        }), Q = fA.createNode(A, B, Q, I), fA.v(Q.mode) ? (Q.g = ZA.M.dir.node, Q.h = ZA.M.dir.stream, Q.f = {}) : fA.isFile(Q.mode) ? (Q.g = ZA.M.file.node, Q.h = ZA.M.file.stream, Q.l = 0, Q.f = null) : fA.ma(Q.mode) ? (Q.g = ZA.M.link.node, Q.h = ZA.M.link.stream) : fA.ya(Q.mode) && (Q.g = ZA.M.gb.node, Q.h = ZA.M.gb.stream), Q.timestamp = Date.now(), A && (A.f[B] = Q), Q;
                    },
                    Gc: function(A) {
                        if (A.f && A.f.subarray) {
                            for(var B = [], Q = 0; Q < A.l; ++Q)B.push(A.f[Q]);
                            return B;
                        }
                        return A.f;
                    },
                    Hc: function(A) {
                        return A.f ? A.f.subarray ? A.f.subarray(0, A.l) : new Uint8Array(A.f) : new Uint8Array(0);
                    },
                    lb: function(A, B) {
                        var Q = A.f ? A.f.length : 0;
                        Q >= B || (B = Math.max(B, Q * (1048576 > Q ? 2 : 1.125) >>> 0), 0 != Q && (B = Math.max(B, 256)), Q = A.f, A.f = new Uint8Array(B), 0 < A.l && A.f.set(Q.subarray(0, A.l), 0));
                    },
                    oc: function(A, B) {
                        if (A.l != B) if (0 == B) A.f = null, A.l = 0;
                        else {
                            if (!A.f || A.f.subarray) {
                                var Q = A.f;
                                A.f = new Uint8Array(B), Q && A.f.set(Q.subarray(0, Math.min(B, A.l)));
                            } else if (A.f || (A.f = []), A.f.length > B) A.f.length = B;
                            else for(; A.f.length < B;)A.f.push(0);
                            A.l = B;
                        }
                    },
                    g: {
                        J: function(A) {
                            var B = {};
                            return B.dev = fA.ya(A.mode) ? A.id : 1, B.ino = A.id, B.mode = A.mode, B.nlink = 1, B.uid = 0, B.gid = 0, B.rdev = A.rdev, fA.v(A.mode) ? B.size = 4096 : fA.isFile(A.mode) ? B.size = A.l : fA.ma(A.mode) ? B.size = A.link.length : B.size = 0, B.atime = new Date(A.timestamp), B.mtime = new Date(A.timestamp), B.ctime = new Date(A.timestamp), B.Hb = 4096, B.blocks = Math.ceil(B.size / B.Hb), B;
                        },
                        A: function(A, B) {
                            void 0 !== B.mode && (A.mode = B.mode), void 0 !== B.timestamp && (A.timestamp = B.timestamp), void 0 !== B.size && ZA.oc(A, B.size);
                        },
                        lookup: function() {
                            throw fA.Na[44];
                        },
                        R: function(A, B, Q, I) {
                            return ZA.createNode(A, B, Q, I);
                        },
                        rename: function(A, B, Q) {
                            if (fA.v(A.mode)) {
                                try {
                                    var I = fA.P(B, Q);
                                } catch (A) {}
                                if (I) for(var g in I.f)throw new fA.b(55);
                            }
                            delete A.parent.f[A.name], A.name = Q, B.f[Q] = A, A.parent = B;
                        },
                        unlink: function(A, B) {
                            delete A.f[B];
                        },
                        rmdir: function(A, B) {
                            var Q, I = fA.P(A, B);
                            for(Q in I.f)throw new fA.b(55);
                            delete A.f[B];
                        },
                        readdir: function(A) {
                            var B, Q = [
                                ".",
                                ".."
                            ];
                            for(B in A.f)A.f.hasOwnProperty(B) && Q.push(B);
                            return Q;
                        },
                        symlink: function(A, B, Q) {
                            return (A = ZA.createNode(A, B, 41471, 0)).link = Q, A;
                        },
                        readlink: function(A) {
                            if (!fA.ma(A.mode)) throw new fA.b(28);
                            return A.link;
                        }
                    },
                    h: {
                        read: function(A, B, Q, I, g) {
                            var E = A.node.f;
                            if (g >= A.node.l) return 0;
                            if (8 < (A = Math.min(A.node.l - g, I)) && E.subarray) B.set(E.subarray(g, g + A), Q);
                            else for(I = 0; I < A; I++)B[Q + I] = E[g + I];
                            return A;
                        },
                        write: function(A, B, Q, I, g, E) {
                            if (B.buffer === n.buffer && (E = !1), !I) return 0;
                            if ((A = A.node).timestamp = Date.now(), B.subarray && (!A.f || A.f.subarray)) {
                                if (E) return A.f = B.subarray(Q, Q + I), A.l = I;
                                if (0 === A.l && 0 === g) return A.f = B.slice(Q, Q + I), A.l = I;
                                if (g + I <= A.l) return A.f.set(B.subarray(Q, Q + I), g), I;
                            }
                            if (ZA.lb(A, g + I), A.f.subarray && B.subarray) A.f.set(B.subarray(Q, Q + I), g);
                            else for(E = 0; E < I; E++)A.f[g + E] = B[Q + E];
                            return A.l = Math.max(A.l, g + I), I;
                        },
                        K: function(A, B, Q) {
                            if (1 === Q ? B += A.position : 2 === Q && fA.isFile(A.node.mode) && (B += A.node.l), 0 > B) throw new fA.b(28);
                            return B;
                        },
                        ia: function(A, B, Q) {
                            ZA.lb(A.node, B + Q), A.node.l = Math.max(A.node.l, B + Q);
                        },
                        na: function(A, B, Q, I, g, E, C) {
                            if (!fA.isFile(A.node.mode)) throw new fA.b(43);
                            if (A = A.node.f, 2 & C || A.buffer !== B.buffer) {
                                if ((0 < g || g + I < A.length) && (A = A.subarray ? A.subarray(g, g + I) : Array.prototype.slice.call(A, g, g + I)), g = !0, C = B.buffer == n.buffer, !(I = QQ(I))) throw new fA.b(48);
                                (C ? n : B).set(A, I);
                            } else g = !1, I = A.byteOffset;
                            return {
                                j: I,
                                Gb: g
                            };
                        },
                        da: function(A, B, Q, I, g) {
                            if (!fA.isFile(A.node.mode)) throw new fA.b(43);
                            return 2 & g || ZA.h.write(A, B, 0, I, Q, !1), 0;
                        }
                    }
                }, fA = {
                    root: null,
                    pa: [],
                    jb: {},
                    streams: [],
                    ec: 1,
                    L: null,
                    ib: "/",
                    Qa: !1,
                    ub: !0,
                    u: {},
                    zb: {
                        wb: {
                            Cb: 1,
                            Db: 2
                        }
                    },
                    b: null,
                    Na: {},
                    Ub: null,
                    Fa: 0,
                    Ic: function(A) {
                        if (!(A instanceof fA.b)) {
                            A: {
                                var Q = Error();
                                if (!Q.stack) {
                                    try {
                                        throw Error();
                                    } catch (A) {
                                        Q = A;
                                    }
                                    if (!Q.stack) {
                                        Q = "(no stack trace available)";
                                        break A;
                                    }
                                }
                                Q = Q.stack.toString();
                            }
                            throw B.extraStackTrace && (Q += "\n" + B.extraStackTrace()), Q = function(A) {
                                return A.replace(/\b_Z[\w\d_]+/g, function(A) {
                                    return A == A ? A : A + " [" + A + "]";
                                });
                            }(Q), A + " : " + Q;
                        }
                        return kA(A.B);
                    },
                    m: function(A, B) {
                        if (B = B || {}, !(A = tA(fA.cwd(), A))) return {
                            path: "",
                            node: null
                        };
                        var Q, I = {
                            Ma: !0,
                            Za: 0
                        };
                        for(Q in I)void 0 === B[Q] && (B[Q] = I[Q]);
                        if (8 < B.Za) throw new fA.b(32);
                        A = aA(A.split("/").filter(function(A) {
                            return !!A;
                        }), !1);
                        var g = fA.root;
                        for(I = "/", Q = 0; Q < A.length; Q++){
                            var E = Q === A.length - 1;
                            if (E && B.parent) break;
                            if (g = fA.P(g, A[Q]), I = KA(I, A[Q]), fA.W(g) && (!E || E && B.Ma) && (g = g.oa.root), !E || B.H) {
                                for(E = 0; fA.ma(g.mode);)if (g = fA.readlink(I), I = tA(MA(I), g), g = fA.m(I, {
                                    Za: B.Za
                                }).node, 40 < E++) throw new fA.b(32);
                            }
                        }
                        return {
                            path: I,
                            node: g
                        };
                    },
                    I: function(A) {
                        for(var B;;){
                            if (fA.Aa(A)) return A = A.s.vb, B ? "/" !== A[A.length - 1] ? A + "/" + B : A + B : A;
                            B = B ? A.name + "/" + B : A.name, A = A.parent;
                        }
                    },
                    Pa: function(A, B) {
                        for(var Q = 0, I = 0; I < B.length; I++)Q = (Q << 5) - Q + B.charCodeAt(I) | 0;
                        return (A + Q >>> 0) % fA.L.length;
                    },
                    sb: function(A) {
                        var B = fA.Pa(A.parent.id, A.name);
                        A.Y = fA.L[B], fA.L[B] = A;
                    },
                    tb: function(A) {
                        var B = fA.Pa(A.parent.id, A.name);
                        if (fA.L[B] === A) fA.L[B] = A.Y;
                        else for(B = fA.L[B]; B;){
                            if (B.Y === A) {
                                B.Y = A.Y;
                                break;
                            }
                            B = B.Y;
                        }
                    },
                    P: function(A, B) {
                        var Q = fA.bc(A);
                        if (Q) throw new fA.b(Q, A);
                        for(Q = fA.L[fA.Pa(A.id, B)]; Q; Q = Q.Y){
                            var I = Q.name;
                            if (Q.parent.id === A.id && I === B) return Q;
                        }
                        return fA.lookup(A, B);
                    },
                    createNode: function(A, B, Q, I) {
                        return A = new fA.Ab(A, B, Q, I), fA.sb(A), A;
                    },
                    La: function(A) {
                        fA.tb(A);
                    },
                    Aa: function(A) {
                        return A === A.parent;
                    },
                    W: function(A) {
                        return !!A.oa;
                    },
                    isFile: function(A) {
                        return 32768 == (61440 & A);
                    },
                    v: function(A) {
                        return 16384 == (61440 & A);
                    },
                    ma: function(A) {
                        return 40960 == (61440 & A);
                    },
                    ya: function(A) {
                        return 8192 == (61440 & A);
                    },
                    $b: function(A) {
                        return 24576 == (61440 & A);
                    },
                    isFIFO: function(A) {
                        return 4096 == (61440 & A);
                    },
                    isSocket: function(A) {
                        return 49152 == (49152 & A);
                    },
                    Vb: {
                        r: 0,
                        rs: 1052672,
                        "r+": 2,
                        w: 577,
                        wx: 705,
                        xw: 705,
                        "w+": 578,
                        "wx+": 706,
                        "xw+": 706,
                        a: 1089,
                        ax: 1217,
                        xa: 1217,
                        "a+": 1090,
                        "ax+": 1218,
                        "xa+": 1218
                    },
                    dc: function(A) {
                        var B = fA.Vb[A];
                        if (void 0 === B) throw Error("Unknown file open mode: " + A);
                        return B;
                    },
                    mb: function(A) {
                        var B = [
                            "r",
                            "w",
                            "rw"
                        ][3 & A];
                        return 512 & A && (B += "w"), B;
                    },
                    Z: function(A, B) {
                        return fA.ub || (-1 === B.indexOf("r") || 292 & A.mode) && (-1 === B.indexOf("w") || 146 & A.mode) && (-1 === B.indexOf("x") || 73 & A.mode) ? 0 : 2;
                    },
                    bc: function(A) {
                        var B = fA.Z(A, "x");
                        return B || (A.g.lookup ? 0 : 2);
                    },
                    Wa: function(A, B) {
                        try {
                            return fA.P(A, B), 20;
                        } catch (A) {}
                        return fA.Z(A, "wx");
                    },
                    Ca: function(A, B, Q) {
                        try {
                            var I = fA.P(A, B);
                        } catch (A) {
                            return A.B;
                        }
                        if (A = fA.Z(A, "wx")) return A;
                        if (Q) {
                            if (!fA.v(I.mode)) return 54;
                            if (fA.Aa(I) || fA.I(I) === fA.cwd()) return 10;
                        } else if (fA.v(I.mode)) return 31;
                        return 0;
                    },
                    cc: function(A, B) {
                        return A ? fA.ma(A.mode) ? 32 : fA.v(A.mode) && ("r" !== fA.mb(B) || 512 & B) ? 31 : fA.Z(A, fA.mb(B)) : 44;
                    },
                    Bb: 4096,
                    fc: function(A, B) {
                        for(B = B || fA.Bb, A = A || 0; A <= B; A++)if (!fA.streams[A]) return A;
                        throw new fA.b(33);
                    },
                    ba: function(A) {
                        return fA.streams[A];
                    },
                    Sb: function(A, B, Q) {
                        fA.Ja || (fA.Ja = function() {}, fA.Ja.prototype = {
                            object: {
                                get: function() {
                                    return this.node;
                                },
                                set: function(A) {
                                    this.node = A;
                                }
                            }
                        });
                        var I, g = new fA.Ja;
                        for(I in A)g[I] = A[I];
                        return A = g, B = fA.fc(B, Q), A.fd = B, fA.streams[B] = A;
                    },
                    Lb: function(A) {
                        fA.streams[A] = null;
                    },
                    Kb: {
                        open: function(A) {
                            A.h = fA.Xb(A.node.rdev).h, A.h.open && A.h.open(A);
                        },
                        K: function() {
                            throw new fA.b(70);
                        }
                    },
                    Va: function(A) {
                        return A >> 8;
                    },
                    Oc: function(A) {
                        return 255 & A;
                    },
                    X: function(A, B) {
                        return A << 8 | B;
                    },
                    $a: function(A, B) {
                        fA.jb[A] = {
                            h: B
                        };
                    },
                    Xb: function(A) {
                        return fA.jb[A];
                    },
                    pb: function(A) {
                        var B = [];
                        for(A = [
                            A
                        ]; A.length;){
                            var Q = A.pop();
                            B.push(Q), A.push.apply(A, Q.pa);
                        }
                        return B;
                    },
                    yb: function(A, B) {
                        function Q(A) {
                            return fA.Fa--, B(A);
                        }
                        function I(A) {
                            if (A) {
                                if (!I.S) return I.S = !0, Q(A);
                            } else ++E >= g.length && Q(null);
                        }
                        "function" == typeof A && (B = A, A = !1), fA.Fa++, 1 < fA.Fa && Y("warning: " + fA.Fa + " FS.syncfs operations in flight at once, probably just doing extra work");
                        var g = fA.pb(fA.root.s), E = 0;
                        g.forEach(function(B) {
                            if (!B.type.yb) return I(null);
                            B.type.yb(B, A, I);
                        });
                    },
                    s: function(A, B, Q) {
                        var I = "/" === Q, g = !Q;
                        if (I && fA.root) throw new fA.b(10);
                        if (!I && !g) {
                            var E = fA.m(Q, {
                                Ma: !1
                            });
                            if (Q = E.path, E = E.node, fA.W(E)) throw new fA.b(10);
                            if (!fA.v(E.mode)) throw new fA.b(54);
                        }
                        return B = {
                            type: A,
                            Rc: B,
                            vb: Q,
                            pa: []
                        }, (A = A.s(B)).s = B, B.root = A, I ? fA.root = A : E && (E.oa = B, E.s && E.s.pa.push(B)), A;
                    },
                    Wc: function(A) {
                        if (A = fA.m(A, {
                            Ma: !1
                        }), !fA.W(A.node)) throw new fA.b(28);
                        var B = (A = A.node).oa, Q = fA.pb(B);
                        Object.keys(fA.L).forEach(function(A) {
                            for(A = fA.L[A]; A;){
                                var B = A.Y;
                                -1 !== Q.indexOf(A.s) && fA.La(A), A = B;
                            }
                        }), A.oa = null, A.s.pa.splice(A.s.pa.indexOf(B), 1);
                    },
                    lookup: function(A, B) {
                        return A.g.lookup(A, B);
                    },
                    R: function(A, B, Q) {
                        var I = fA.m(A, {
                            parent: !0
                        }).node;
                        if (!(A = JA(A)) || "." === A || ".." === A) throw new fA.b(28);
                        var g = fA.Wa(I, A);
                        if (g) throw new fA.b(g);
                        if (!I.g.R) throw new fA.b(63);
                        return I.g.R(I, A, B, Q);
                    },
                    create: function(A, B) {
                        return fA.R(A, 4095 & (void 0 !== B ? B : 438) | 32768, 0);
                    },
                    mkdir: function(A, B) {
                        return fA.R(A, 1023 & (void 0 !== B ? B : 511) | 16384, 0);
                    },
                    Pc: function(A, B) {
                        A = A.split("/");
                        for(var Q = "", I = 0; I < A.length; ++I)if (A[I]) {
                            Q += "/" + A[I];
                            try {
                                fA.mkdir(Q, B);
                            } catch (A) {
                                if (20 != A.B) throw A;
                            }
                        }
                    },
                    Da: function(A, B, Q) {
                        return void 0 === Q && (Q = B, B = 438), fA.R(A, 8192 | B, Q);
                    },
                    symlink: function(A, B) {
                        if (!tA(A)) throw new fA.b(44);
                        var Q = fA.m(B, {
                            parent: !0
                        }).node;
                        if (!Q) throw new fA.b(44);
                        B = JA(B);
                        var I = fA.Wa(Q, B);
                        if (I) throw new fA.b(I);
                        if (!Q.g.symlink) throw new fA.b(63);
                        return Q.g.symlink(Q, B, A);
                    },
                    rename: function(A, B) {
                        var Q = MA(A), I = MA(B), g = JA(A), E = JA(B);
                        try {
                            var C = fA.m(A, {
                                parent: !0
                            }), D = C.node, i = (C = fA.m(B, {
                                parent: !0
                            })).node;
                        } catch (A) {
                            throw new fA.b(10);
                        }
                        if (!D || !i) throw new fA.b(44);
                        if (D.s !== i.s) throw new fA.b(75);
                        if (C = fA.P(D, g), "." !== (I = nA(A, I)).charAt(0)) throw new fA.b(28);
                        if ("." !== (I = nA(B, Q)).charAt(0)) throw new fA.b(55);
                        try {
                            var y = fA.P(i, E);
                        } catch (A) {}
                        if (C !== y) {
                            if (Q = fA.v(C.mode), g = fA.Ca(D, g, Q)) throw new fA.b(g);
                            if (g = y ? fA.Ca(i, E, Q) : fA.Wa(i, E)) throw new fA.b(g);
                            if (!D.g.rename) throw new fA.b(63);
                            if (fA.W(C) || y && fA.W(y)) throw new fA.b(10);
                            if (i !== D && (g = fA.Z(D, "w"))) throw new fA.b(g);
                            try {
                                fA.u.willMovePath && fA.u.willMovePath(A, B);
                            } catch (Q) {
                                Y("FS.trackingDelegate['willMovePath']('" + A + "', '" + B + "') threw an exception: " + Q.message);
                            }
                            fA.tb(C);
                            try {
                                D.g.rename(C, i, E);
                            } catch (A) {
                                throw A;
                            } finally{
                                fA.sb(C);
                            }
                            try {
                                fA.u.onMovePath && fA.u.onMovePath(A, B);
                            } catch (Q) {
                                Y("FS.trackingDelegate['onMovePath']('" + A + "', '" + B + "') threw an exception: " + Q.message);
                            }
                        }
                    },
                    rmdir: function(A) {
                        var B = fA.m(A, {
                            parent: !0
                        }).node, Q = JA(A), I = fA.P(B, Q), g = fA.Ca(B, Q, !0);
                        if (g) throw new fA.b(g);
                        if (!B.g.rmdir) throw new fA.b(63);
                        if (fA.W(I)) throw new fA.b(10);
                        try {
                            fA.u.willDeletePath && fA.u.willDeletePath(A);
                        } catch (B) {
                            Y("FS.trackingDelegate['willDeletePath']('" + A + "') threw an exception: " + B.message);
                        }
                        B.g.rmdir(B, Q), fA.La(I);
                        try {
                            fA.u.onDeletePath && fA.u.onDeletePath(A);
                        } catch (B) {
                            Y("FS.trackingDelegate['onDeletePath']('" + A + "') threw an exception: " + B.message);
                        }
                    },
                    readdir: function(A) {
                        if (!(A = fA.m(A, {
                            H: !0
                        }).node).g.readdir) throw new fA.b(54);
                        return A.g.readdir(A);
                    },
                    unlink: function(A) {
                        var B = fA.m(A, {
                            parent: !0
                        }).node, Q = JA(A), I = fA.P(B, Q), g = fA.Ca(B, Q, !1);
                        if (g) throw new fA.b(g);
                        if (!B.g.unlink) throw new fA.b(63);
                        if (fA.W(I)) throw new fA.b(10);
                        try {
                            fA.u.willDeletePath && fA.u.willDeletePath(A);
                        } catch (B) {
                            Y("FS.trackingDelegate['willDeletePath']('" + A + "') threw an exception: " + B.message);
                        }
                        B.g.unlink(B, Q), fA.La(I);
                        try {
                            fA.u.onDeletePath && fA.u.onDeletePath(A);
                        } catch (B) {
                            Y("FS.trackingDelegate['onDeletePath']('" + A + "') threw an exception: " + B.message);
                        }
                    },
                    readlink: function(A) {
                        if (!(A = fA.m(A).node)) throw new fA.b(44);
                        if (!A.g.readlink) throw new fA.b(28);
                        return tA(fA.I(A.parent), A.g.readlink(A));
                    },
                    stat: function(A, B) {
                        if (!(A = fA.m(A, {
                            H: !B
                        }).node)) throw new fA.b(44);
                        if (!A.g.J) throw new fA.b(63);
                        return A.g.J(A);
                    },
                    lstat: function(A) {
                        return fA.stat(A, !0);
                    },
                    chmod: function(A, B, Q) {
                        var I;
                        if (!(I = "string" == typeof A ? fA.m(A, {
                            H: !Q
                        }).node : A).g.A) throw new fA.b(63);
                        I.g.A(I, {
                            mode: 4095 & B | -4096 & I.mode,
                            timestamp: Date.now()
                        });
                    },
                    lchmod: function(A, B) {
                        fA.chmod(A, B, !0);
                    },
                    fchmod: function(A, B) {
                        if (!(A = fA.ba(A))) throw new fA.b(8);
                        fA.chmod(A.node, B);
                    },
                    chown: function(A, B, Q, I) {
                        var g;
                        if (!(g = "string" == typeof A ? fA.m(A, {
                            H: !I
                        }).node : A).g.A) throw new fA.b(63);
                        g.g.A(g, {
                            timestamp: Date.now()
                        });
                    },
                    lchown: function(A, B, Q) {
                        fA.chown(A, B, Q, !0);
                    },
                    fchown: function(A, B, Q) {
                        if (!(A = fA.ba(A))) throw new fA.b(8);
                        fA.chown(A.node, B, Q);
                    },
                    truncate: function(A, B) {
                        if (0 > B) throw new fA.b(28);
                        var Q;
                        if (!(Q = "string" == typeof A ? fA.m(A, {
                            H: !0
                        }).node : A).g.A) throw new fA.b(63);
                        if (fA.v(Q.mode)) throw new fA.b(31);
                        if (!fA.isFile(Q.mode)) throw new fA.b(28);
                        if (A = fA.Z(Q, "w")) throw new fA.b(A);
                        Q.g.A(Q, {
                            size: B,
                            timestamp: Date.now()
                        });
                    },
                    Fc: function(A, B) {
                        if (!(A = fA.ba(A))) throw new fA.b(8);
                        if (0 == (2097155 & A.flags)) throw new fA.b(28);
                        fA.truncate(A.node, B);
                    },
                    Xc: function(A, B, Q) {
                        (A = fA.m(A, {
                            H: !0
                        }).node).g.A(A, {
                            timestamp: Math.max(B, Q)
                        });
                    },
                    open: function(A, Q, I, g, E) {
                        if ("" === A) throw new fA.b(44);
                        if (I = 64 & (Q = "string" == typeof Q ? fA.dc(Q) : Q) ? 4095 & (void 0 === I ? 438 : I) | 32768 : 0, "object" == typeof A) var C = A;
                        else {
                            A = SA(A);
                            try {
                                C = fA.m(A, {
                                    H: !(131072 & Q)
                                }).node;
                            } catch (A) {}
                        }
                        var D = !1;
                        if (64 & Q) if (C) {
                            if (128 & Q) throw new fA.b(20);
                        } else C = fA.R(A, I, 0), D = !0;
                        if (!C) throw new fA.b(44);
                        if (fA.ya(C.mode) && (Q &= -513), 65536 & Q && !fA.v(C.mode)) throw new fA.b(54);
                        if (!D && (I = fA.cc(C, Q))) throw new fA.b(I);
                        512 & Q && fA.truncate(C, 0), Q &= -131713, (g = fA.Sb({
                            node: C,
                            path: fA.I(C),
                            flags: Q,
                            seekable: !0,
                            position: 0,
                            h: C.h,
                            wc: [],
                            error: !1
                        }, g, E)).h.open && g.h.open(g), !B.logReadFiles || 1 & Q || (fA.Ya || (fA.Ya = {}), A in fA.Ya || (fA.Ya[A] = 1, Y("FS.trackingDelegate error on read file: " + A)));
                        try {
                            fA.u.onOpenFile && (E = 0, 1 != (2097155 & Q) && (E |= fA.zb.wb.Cb), 0 != (2097155 & Q) && (E |= fA.zb.wb.Db), fA.u.onOpenFile(A, E));
                        } catch (B) {
                            Y("FS.trackingDelegate['onOpenFile']('" + A + "', flags) threw an exception: " + B.message);
                        }
                        return g;
                    },
                    close: function(A) {
                        if (fA.la(A)) throw new fA.b(8);
                        A.Oa && (A.Oa = null);
                        try {
                            A.h.close && A.h.close(A);
                        } catch (A) {
                            throw A;
                        } finally{
                            fA.Lb(A.fd);
                        }
                        A.fd = null;
                    },
                    la: function(A) {
                        return null === A.fd;
                    },
                    K: function(A, B, Q) {
                        if (fA.la(A)) throw new fA.b(8);
                        if (!A.seekable || !A.h.K) throw new fA.b(70);
                        if (0 != Q && 1 != Q && 2 != Q) throw new fA.b(28);
                        return A.position = A.h.K(A, B, Q), A.wc = [], A.position;
                    },
                    read: function(A, B, Q, I, g) {
                        if (0 > I || 0 > g) throw new fA.b(28);
                        if (fA.la(A)) throw new fA.b(8);
                        if (1 == (2097155 & A.flags)) throw new fA.b(8);
                        if (fA.v(A.node.mode)) throw new fA.b(31);
                        if (!A.h.read) throw new fA.b(28);
                        var E = void 0 !== g;
                        if (E) {
                            if (!A.seekable) throw new fA.b(70);
                        } else g = A.position;
                        return B = A.h.read(A, B, Q, I, g), E || (A.position += B), B;
                    },
                    write: function(A, B, Q, I, g, E) {
                        if (0 > I || 0 > g) throw new fA.b(28);
                        if (fA.la(A)) throw new fA.b(8);
                        if (0 == (2097155 & A.flags)) throw new fA.b(8);
                        if (fA.v(A.node.mode)) throw new fA.b(31);
                        if (!A.h.write) throw new fA.b(28);
                        A.seekable && 1024 & A.flags && fA.K(A, 0, 2);
                        var C = void 0 !== g;
                        if (C) {
                            if (!A.seekable) throw new fA.b(70);
                        } else g = A.position;
                        B = A.h.write(A, B, Q, I, g, E), C || (A.position += B);
                        try {
                            A.path && fA.u.onWriteToFile && fA.u.onWriteToFile(A.path);
                        } catch (B) {
                            Y("FS.trackingDelegate['onWriteToFile']('" + A.path + "') threw an exception: " + B.message);
                        }
                        return B;
                    },
                    ia: function(A, B, Q) {
                        if (fA.la(A)) throw new fA.b(8);
                        if (0 > B || 0 >= Q) throw new fA.b(28);
                        if (0 == (2097155 & A.flags)) throw new fA.b(8);
                        if (!fA.isFile(A.node.mode) && !fA.v(A.node.mode)) throw new fA.b(43);
                        if (!A.h.ia) throw new fA.b(138);
                        A.h.ia(A, B, Q);
                    },
                    na: function(A, B, Q, I, g, E, C) {
                        if (0 != (2 & E) && 0 == (2 & C) && 2 != (2097155 & A.flags)) throw new fA.b(2);
                        if (1 == (2097155 & A.flags)) throw new fA.b(2);
                        if (!A.h.na) throw new fA.b(43);
                        return A.h.na(A, B, Q, I, g, E, C);
                    },
                    da: function(A, B, Q, I, g) {
                        return A && A.h.da ? A.h.da(A, B, Q, I, g) : 0;
                    },
                    Qc: function() {
                        return 0;
                    },
                    Ra: function(A, B, Q) {
                        if (!A.h.Ra) throw new fA.b(59);
                        return A.h.Ra(A, B, Q);
                    },
                    readFile: function(A, B) {
                        if ((B = B || {}).flags = B.flags || "r", B.encoding = B.encoding || "binary", "utf8" !== B.encoding && "binary" !== B.encoding) throw Error('Invalid encoding type "' + B.encoding + '"');
                        var Q, I = fA.open(A, B.flags);
                        A = fA.stat(A).size;
                        var g = new Uint8Array(A);
                        return fA.read(I, g, 0, A, 0), "utf8" === B.encoding ? Q = M(g, 0) : "binary" === B.encoding && (Q = g), fA.close(I), Q;
                    },
                    writeFile: function(A, B, Q) {
                        if ((Q = Q || {}).flags = Q.flags || "w", A = fA.open(A, Q.flags, Q.mode), "string" == typeof B) {
                            var I = new Uint8Array(K(B) + 1);
                            B = V(B, I, 0, I.length), fA.write(A, I, 0, B, void 0, Q.Jb);
                        } else {
                            if (!ArrayBuffer.isView(B)) throw Error("Unsupported data type");
                            fA.write(A, B, 0, B.byteLength, void 0, Q.Jb);
                        }
                        fA.close(A);
                    },
                    cwd: function() {
                        return fA.ib;
                    },
                    chdir: function(A) {
                        if (null === (A = fA.m(A, {
                            H: !0
                        })).node) throw new fA.b(44);
                        if (!fA.v(A.node.mode)) throw new fA.b(54);
                        var B = fA.Z(A.node, "x");
                        if (B) throw new fA.b(B);
                        fA.ib = A.path;
                    },
                    Ob: function() {
                        fA.mkdir("/tmp"), fA.mkdir("/home"), fA.mkdir("/home/web_user");
                    },
                    Nb: function() {
                        if (fA.mkdir("/dev"), fA.$a(fA.X(1, 3), {
                            read: function() {
                                return 0;
                            },
                            write: function(A, B, Q, I) {
                                return I;
                            }
                        }), fA.Da("/dev/null", fA.X(1, 3)), rA(fA.X(5, 0), lA), rA(fA.X(6, 0), xA), fA.Da("/dev/tty", fA.X(5, 0)), fA.Da("/dev/tty1", fA.X(6, 0)), "object" == typeof crypto && "function" == typeof crypto.getRandomValues) var A = new Uint8Array(1), B = function() {
                            return crypto.getRandomValues(A), A[0];
                        };
                        else if (y) try {
                            var I = Q(4);
                            B = function() {
                                return I.randomBytes(1)[0];
                            };
                        } catch (A) {}
                        B || (B = function() {
                            FA("random_device");
                        }), fA.T("/dev", "random", B), fA.T("/dev", "urandom", B), fA.mkdir("/dev/shm"), fA.mkdir("/dev/shm/tmp");
                    },
                    Qb: function() {
                        fA.mkdir("/proc"), fA.mkdir("/proc/self"), fA.mkdir("/proc/self/fd"), fA.s({
                            s: function() {
                                var A = fA.createNode("/proc/self", "fd", 16895, 73);
                                return A.g = {
                                    lookup: function(A, B) {
                                        var Q = fA.ba(+B);
                                        if (!Q) throw new fA.b(8);
                                        return (A = {
                                            parent: null,
                                            s: {
                                                vb: "fake"
                                            },
                                            g: {
                                                readlink: function() {
                                                    return Q.path;
                                                }
                                            }
                                        }).parent = A;
                                    }
                                }, A;
                            }
                        }, {}, "/proc/self/fd");
                    },
                    Rb: function() {
                        B.stdin ? fA.T("/dev", "stdin", B.stdin) : fA.symlink("/dev/tty", "/dev/stdin"), B.stdout ? fA.T("/dev", "stdout", null, B.stdout) : fA.symlink("/dev/tty", "/dev/stdout"), B.stderr ? fA.T("/dev", "stderr", null, B.stderr) : fA.symlink("/dev/tty1", "/dev/stderr"), fA.open("/dev/stdin", "r"), fA.open("/dev/stdout", "w"), fA.open("/dev/stderr", "w");
                    },
                    kb: function() {
                        fA.b || (fA.b = function(A, B) {
                            this.node = B, this.pc = function(A) {
                                this.B = A;
                            }, this.pc(A), this.message = "FS error";
                        }, fA.b.prototype = Error(), fA.b.prototype.constructor = fA.b, [
                            44
                        ].forEach(function(A) {
                            fA.Na[A] = new fA.b(A), fA.Na[A].stack = "<generic error, no stack>";
                        }));
                    },
                    rc: function() {
                        fA.kb(), fA.L = Array(4096), fA.s(ZA, {}, "/"), fA.Ob(), fA.Nb(), fA.Qb(), fA.Ub = {
                            MEMFS: ZA
                        };
                    },
                    ka: function(A, Q, I) {
                        fA.ka.Qa = !0, fA.kb(), B.stdin = A || B.stdin, B.stdout = Q || B.stdout, B.stderr = I || B.stderr, fA.Rb();
                    },
                    quit: function() {
                        fA.ka.Qa = !1;
                        var A = B._fflush;
                        for(A && A(0), A = 0; A < fA.streams.length; A++){
                            var Q = fA.streams[A];
                            Q && fA.close(Q);
                        }
                    },
                    wa: function(A, B) {
                        var Q = 0;
                        return A && (Q |= 365), B && (Q |= 146), Q;
                    },
                    Kc: function(A, B) {
                        return A = VA.apply(null, A), B && "/" == A[0] && (A = A.substr(1)), A;
                    },
                    xc: function(A, B) {
                        return tA(B, A);
                    },
                    Uc: function(A) {
                        return SA(A);
                    },
                    Ec: function(A, B) {
                        return (A = fA.Ka(A, B)).exists ? A.object : (kA(A.error), null);
                    },
                    Ka: function(A, B) {
                        try {
                            var Q = fA.m(A, {
                                H: !B
                            });
                            A = Q.path;
                        } catch (A) {}
                        var I = {
                            Aa: !1,
                            exists: !1,
                            error: 0,
                            name: null,
                            path: null,
                            object: null,
                            hc: !1,
                            jc: null,
                            ic: null
                        };
                        try {
                            Q = fA.m(A, {
                                parent: !0
                            }), I.hc = !0, I.jc = Q.path, I.ic = Q.node, I.name = JA(A), Q = fA.m(A, {
                                H: !B
                            }), I.exists = !0, I.path = Q.path, I.object = Q.node, I.name = Q.node.name, I.Aa = "/" === Q.path;
                        } catch (A) {
                            I.error = A.B;
                        }
                        return I;
                    },
                    zc: function(A, B, Q, I) {
                        return A = KA("string" == typeof A ? A : fA.I(A), B), fA.mkdir(A, fA.wa(Q, I));
                    },
                    Cc: function(A, B) {
                        for(A = "string" == typeof A ? A : fA.I(A), B = B.split("/").reverse(); B.length;){
                            var Q = B.pop();
                            if (Q) {
                                var I = KA(A, Q);
                                try {
                                    fA.mkdir(I);
                                } catch (A) {}
                                A = I;
                            }
                        }
                        return I;
                    },
                    Pb: function(A, B, Q, I, g) {
                        return A = KA("string" == typeof A ? A : fA.I(A), B), fA.create(A, fA.wa(I, g));
                    },
                    hb: function(A, B, Q, I, g, E) {
                        if (A = B ? KA("string" == typeof A ? A : fA.I(A), B) : A, I = fA.wa(I, g), g = fA.create(A, I), Q) {
                            if ("string" == typeof Q) {
                                A = Array(Q.length), B = 0;
                                for(var C = Q.length; B < C; ++B)A[B] = Q.charCodeAt(B);
                                Q = A;
                            }
                            fA.chmod(g, 146 | I), A = fA.open(g, "w"), fA.write(A, Q, 0, Q.length, 0, E), fA.close(A), fA.chmod(g, I);
                        }
                        return g;
                    },
                    T: function(A, B, Q, I) {
                        A = KA("string" == typeof A ? A : fA.I(A), B), B = fA.wa(!!Q, !!I), fA.T.Va || (fA.T.Va = 64);
                        var g = fA.X(fA.T.Va++, 0);
                        return fA.$a(g, {
                            open: function(A) {
                                A.seekable = !1;
                            },
                            close: function() {
                                I && I.buffer && I.buffer.length && I(10);
                            },
                            read: function(A, B, I, g) {
                                for(var E = 0, C = 0; C < g; C++){
                                    try {
                                        var D = Q();
                                    } catch (A) {
                                        throw new fA.b(29);
                                    }
                                    if (void 0 === D && 0 === E) throw new fA.b(6);
                                    if (null == D) break;
                                    E++, B[I + C] = D;
                                }
                                return E && (A.node.timestamp = Date.now()), E;
                            },
                            write: function(A, B, Q, g) {
                                for(var E = 0; E < g; E++)try {
                                    I(B[Q + E]);
                                } catch (A) {
                                    throw new fA.b(29);
                                }
                                return g && (A.node.timestamp = Date.now()), E;
                            }
                        }), fA.Da(A, B, g);
                    },
                    Bc: function(A, B, Q) {
                        return A = KA("string" == typeof A ? A : fA.I(A), B), fA.symlink(Q, A);
                    },
                    nb: function(A) {
                        if (A.Sa || A.ac || A.link || A.f) return !0;
                        var B = !0;
                        if ("undefined" != typeof XMLHttpRequest) throw Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
                        if (!c) throw Error("Cannot load without read() or XMLHttpRequest.");
                        try {
                            A.f = vB(c(A.url), !0), A.l = A.f.length;
                        } catch (A) {
                            B = !1;
                        }
                        return B || kA(29), B;
                    },
                    Ac: function(A, B, Q, I, g) {
                        function E() {
                            this.Ua = !1, this.S = [];
                        }
                        if (E.prototype.get = function(A) {
                            if (!(A > this.length - 1 || 0 > A)) {
                                var B = A % this.chunkSize;
                                return this.rb(A / this.chunkSize | 0)[B];
                            }
                        }, E.prototype.Ib = function(A) {
                            this.rb = A;
                        }, E.prototype.eb = function() {
                            var A = new XMLHttpRequest;
                            if (A.open("HEAD", Q, !1), A.send(null), !(200 <= A.status && 300 > A.status || 304 === A.status)) throw Error("Couldn't load " + Q + ". Status: " + A.status);
                            var B, I = Number(A.getResponseHeader("Content-length")), g = (B = A.getResponseHeader("Accept-Ranges")) && "bytes" === B;
                            A = (B = A.getResponseHeader("Content-Encoding")) && "gzip" === B;
                            var E = 1048576;
                            g || (E = I);
                            var C = this;
                            C.Ib(function(A) {
                                var B = A * E, g = (A + 1) * E - 1;
                                if (g = Math.min(g, I - 1), void 0 === C.S[A]) {
                                    var D = C.S;
                                    if (B > g) throw Error("invalid range (" + B + ", " + g + ") or no bytes requested!");
                                    if (g > I - 1) throw Error("only " + I + " bytes available! programmer error!");
                                    var i = new XMLHttpRequest;
                                    if (i.open("GET", Q, !1), I !== E && i.setRequestHeader("Range", "bytes=" + B + "-" + g), "undefined" != typeof Uint8Array && (i.responseType = "arraybuffer"), i.overrideMimeType && i.overrideMimeType("text/plain; charset=x-user-defined"), i.send(null), !(200 <= i.status && 300 > i.status || 304 === i.status)) throw Error("Couldn't load " + Q + ". Status: " + i.status);
                                    B = void 0 !== i.response ? new Uint8Array(i.response || []) : vB(i.responseText || "", !0), D[A] = B;
                                }
                                if (void 0 === C.S[A]) throw Error("doXHR failed!");
                                return C.S[A];
                            }), !A && I || (E = I = 1, E = I = this.rb(0).length, w("LazyFiles on gzip forces download of the whole file when length is accessed")), this.Fb = I, this.Eb = E, this.Ua = !0;
                        }, "undefined" != typeof XMLHttpRequest) {
                            if (!i) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                            var C = new E;
                            Object.defineProperties(C, {
                                length: {
                                    get: function() {
                                        return this.Ua || this.eb(), this.Fb;
                                    }
                                },
                                chunkSize: {
                                    get: function() {
                                        return this.Ua || this.eb(), this.Eb;
                                    }
                                }
                            }), C = {
                                Sa: !1,
                                f: C
                            };
                        } else C = {
                            Sa: !1,
                            url: Q
                        };
                        var D = fA.Pb(A, B, C, I, g);
                        C.f ? D.f = C.f : C.url && (D.f = null, D.url = C.url), Object.defineProperties(D, {
                            l: {
                                get: function() {
                                    return this.f.length;
                                }
                            }
                        });
                        var y = {};
                        return Object.keys(D.h).forEach(function(A) {
                            var B = D.h[A];
                            y[A] = function() {
                                if (!fA.nb(D)) throw new fA.b(29);
                                return B.apply(null, arguments);
                            };
                        }), y.read = function(A, B, Q, I, g) {
                            if (!fA.nb(D)) throw new fA.b(29);
                            if (g >= (A = A.node.f).length) return 0;
                            if (I = Math.min(A.length - g, I), A.slice) for(var E = 0; E < I; E++)B[Q + E] = A[g + E];
                            else for(E = 0; E < I; E++)B[Q + E] = A.get(g + E);
                            return I;
                        }, D.h = y, D;
                    },
                    Dc: function(A, Q, I, g, E, C, D, i, y, F) {
                        function U(I) {
                            function U(B) {
                                F && F(), i || fA.hb(A, Q, B, g, E, y), C && C(), yA();
                            }
                            var N = !1;
                            B.preloadPlugins.forEach(function(A) {
                                !N && A.canHandle(c) && (A.handle(I, c, U, function() {
                                    D && D(), yA();
                                }), N = !0);
                            }), N || U(I);
                        }
                        (void 0).ka();
                        var c = Q ? tA(KA(A, Q)) : A;
                        iA(), "string" == typeof I ? (void 0).yc(I, function(A) {
                            U(A);
                        }, D) : U(I);
                    },
                    indexedDB: function() {
                        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                    },
                    bb: function() {
                        return "EM_FS_" + window.location.pathname;
                    },
                    cb: 20,
                    ga: "FILE_DATA",
                    Tc: function(A, B, Q) {
                        B = B || function() {}, Q = Q || function() {};
                        var I = fA.indexedDB();
                        try {
                            var g = I.open(fA.bb(), fA.cb);
                        } catch (A) {
                            return Q(A);
                        }
                        g.onupgradeneeded = function() {
                            w("creating db"), g.result.createObjectStore(fA.ga);
                        }, g.onsuccess = function() {
                            var I = g.result.transaction([
                                fA.ga
                            ], "readwrite"), E = I.objectStore(fA.ga), C = 0, D = 0, i = A.length;
                            A.forEach(function(A) {
                                (A = E.put(fA.Ka(A).object.f, A)).onsuccess = function() {
                                    ++C + D == i && (0 == D ? B() : Q());
                                }, A.onerror = function() {
                                    D++, C + D == i && (0 == D ? B() : Q());
                                };
                            }), I.onerror = Q;
                        }, g.onerror = Q;
                    },
                    Mc: function(A, B, Q) {
                        B = B || function() {}, Q = Q || function() {};
                        var I = fA.indexedDB();
                        try {
                            var g = I.open(fA.bb(), fA.cb);
                        } catch (A) {
                            return Q(A);
                        }
                        g.onupgradeneeded = Q, g.onsuccess = function() {
                            var I = g.result;
                            try {
                                var E = I.transaction([
                                    fA.ga
                                ], "readonly");
                            } catch (A) {
                                return void Q(A);
                            }
                            var C = E.objectStore(fA.ga), D = 0, i = 0, y = A.length;
                            A.forEach(function(A) {
                                var I = C.get(A);
                                I.onsuccess = function() {
                                    fA.Ka(A).exists && fA.unlink(A), fA.hb(MA(A), JA(A), I.result, !0, !0, !0), ++D + i == y && (0 == i ? B() : Q());
                                }, I.onerror = function() {
                                    i++, D + i == y && (0 == i ? B() : Q());
                                };
                            }), E.onerror = Q;
                        }, g.onerror = Q;
                    }
                }, bA = {}, pA = void 0;
                function qA() {
                    return l[(pA += 4) - 4 >> 2];
                }
                function uA(A) {
                    if (!(A = fA.ba(A))) throw new fA.b(8);
                    return A;
                }
                function OA(A) {
                    switch(A){
                        case 1:
                            return 0;
                        case 2:
                            return 1;
                        case 4:
                            return 2;
                        case 8:
                            return 3;
                        default:
                            throw new TypeError("Unknown type size: " + A);
                    }
                }
                var mA = void 0;
                function WA(A) {
                    for(var B = ""; d[A];)B += mA[d[A++]];
                    return B;
                }
                var XA = {}, jA = {}, zA = {};
                function vA(A) {
                    if (void 0 === A) return "_unknown";
                    var B = (A = A.replace(/[^a-zA-Z0-9_]/g, "$")).charCodeAt(0);
                    return 48 <= B && 57 >= B ? "_" + A : A;
                }
                function TA(A, B) {
                    return A = vA(A), new Function("body", "return function " + A + '() {\n    "use strict";    return body.apply(this, arguments);\n};\n')(B);
                }
                function PA(A) {
                    var B = Error, Q = TA(A, function(B) {
                        this.name = A, this.message = B, void 0 !== (B = Error(B).stack) && (this.stack = this.toString() + "\n" + B.replace(/^Error(:[^\n]*)?\n/, ""));
                    });
                    return Q.prototype = Object.create(B.prototype), Q.prototype.constructor = Q, Q.prototype.toString = function() {
                        return void 0 === this.message ? this.name : this.name + ": " + this.message;
                    }, Q;
                }
                var _A = void 0;
                function $A(A) {
                    throw new _A(A);
                }
                var AB = void 0;
                function BB(A) {
                    throw new AB(A);
                }
                function QB(A, B, Q) {
                    function I(B) {
                        (B = Q(B)).length !== A.length && BB("Mismatched type converter count");
                        for(var I = 0; I < A.length; ++I)IB(A[I], B[I]);
                    }
                    A.forEach(function(A) {
                        zA[A] = B;
                    });
                    var g = Array(B.length), E = [], C = 0;
                    B.forEach(function(A, B) {
                        jA.hasOwnProperty(A) ? g[B] = jA[A] : (E.push(A), XA.hasOwnProperty(A) || (XA[A] = []), XA[A].push(function() {
                            g[B] = jA[A], ++C === E.length && I(g);
                        }));
                    }), 0 === E.length && I(g);
                }
                function IB(A, B, Q) {
                    if (Q = Q || {}, !("argPackAdvance" in B)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
                    var I = B.name;
                    if (A || $A('type "' + I + '" must have a positive integer typeid pointer'), jA.hasOwnProperty(A)) {
                        if (Q.Zb) return;
                        $A("Cannot register type '" + I + "' twice");
                    }
                    jA[A] = B, delete zA[A], XA.hasOwnProperty(A) && (B = XA[A], delete XA[A], B.forEach(function(A) {
                        A();
                    }));
                }
                function gB(A) {
                    return {
                        count: A.count,
                        aa: A.aa,
                        qa: A.qa,
                        j: A.j,
                        o: A.o,
                        D: A.D,
                        F: A.F
                    };
                }
                function EB(A) {
                    $A(A.c.o.i.name + " instance already deleted");
                }
                var CB = !1;
                function DB() {}
                function iB(A) {
                    --A.count.value, 0 === A.count.value && (A.D ? A.F.$(A.D) : A.o.i.$(A.j));
                }
                function yB(A) {
                    return "undefined" == typeof FinalizationGroup ? (yB = function(A) {
                        return A;
                    }, A) : (CB = new FinalizationGroup(function(A) {
                        for(var B = A.next(); !B.done; B = A.next())(B = B.value).j ? iB(B) : console.warn("object already deleted: " + B.j);
                    }), DB = function(A) {
                        CB.unregister(A.c);
                    }, (yB = function(A) {
                        return CB.register(A, A.c, A.c), A;
                    })(A));
                }
                var FB = void 0, UB = [];
                function cB() {
                    for(; UB.length;){
                        var A = UB.pop();
                        A.c.aa = !1, A.delete();
                    }
                }
                function NB() {}
                var HB = {};
                function GB(A, B, Q) {
                    if (void 0 === A[B].N) {
                        var I = A[B];
                        A[B] = function() {
                            return A[B].N.hasOwnProperty(arguments.length) || $A("Function '" + Q + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + A[B].N + ")!"), A[B].N[arguments.length].apply(this, arguments);
                        }, A[B].N = [], A[B].N[I.va] = I;
                    }
                }
                function oB(A, B, Q, I, g, E, C, D) {
                    this.name = A, this.constructor = B, this.U = Q, this.$ = I, this.G = g, this.Wb = E, this.ta = C, this.Tb = D, this.lc = [];
                }
                function wB(A, B, Q) {
                    for(; B !== Q;)B.ta || $A("Expected null or instance of " + Q.name + ", got an instance of " + B.name), A = B.ta(A), B = B.G;
                    return A;
                }
                function YB(A, B) {
                    return null === B ? (this.Ta && $A("null is not a valid " + this.name), 0) : (B.c || $A('Cannot pass "' + lB(B) + '" as a ' + this.name), B.c.j || $A("Cannot pass deleted object as a pointer of type " + this.name), wB(B.c.j, B.c.o.i, this.i));
                }
                function sB(A, B) {
                    if (null === B) {
                        if (this.Ta && $A("null is not a valid " + this.name), this.Ba) {
                            var Q = this.mc();
                            return null !== A && A.push(this.$, Q), Q;
                        }
                        return 0;
                    }
                    if (B.c || $A('Cannot pass "' + lB(B) + '" as a ' + this.name), B.c.j || $A("Cannot pass deleted object as a pointer of type " + this.name), !this.za && B.c.o.za && $A("Cannot convert argument of type " + (B.c.F ? B.c.F.name : B.c.o.name) + " to parameter type " + this.name), Q = wB(B.c.j, B.c.o.i, this.i), this.Ba) switch(void 0 === B.c.D && $A("Passing raw pointer to smart pointer is illegal"), this.qc){
                        case 0:
                            B.c.F === this ? Q = B.c.D : $A("Cannot convert argument of type " + (B.c.F ? B.c.F.name : B.c.o.name) + " to parameter type " + this.name);
                            break;
                        case 1:
                            Q = B.c.D;
                            break;
                        case 2:
                            if (B.c.F === this) Q = B.c.D;
                            else {
                                var I = B.clone();
                                Q = this.nc(Q, eB(function() {
                                    I.delete();
                                })), null !== A && A.push(this.$, Q);
                            }
                            break;
                        default:
                            $A("Unsupporting sharing policy");
                    }
                    return Q;
                }
                function LB(A, B) {
                    return null === B ? (this.Ta && $A("null is not a valid " + this.name), 0) : (B.c || $A('Cannot pass "' + lB(B) + '" as a ' + this.name), B.c.j || $A("Cannot pass deleted object as a pointer of type " + this.name), B.c.o.za && $A("Cannot convert argument of type " + B.c.o.name + " to parameter type " + this.name), wB(B.c.j, B.c.o.i, this.i));
                }
                function RB(A) {
                    return this.fromWireType(x[A >> 2]);
                }
                var hB = {};
                function kB(A, B) {
                    return B.o && B.j || BB("makeClassHandle requires ptr and ptrType"), !!B.F != !!B.D && BB("Both smartPtrType and smartPtr must be specified"), B.count = {
                        value: 1
                    }, yB(Object.create(A, {
                        c: {
                            value: B
                        }
                    }));
                }
                function aB(A, B, Q, I) {
                    this.name = A, this.i = B, this.Ta = Q, this.za = I, this.Ba = !1, this.$ = this.nc = this.mc = this.xb = this.qc = this.kc = void 0, void 0 !== B.G ? this.toWireType = sB : (this.toWireType = I ? YB : LB, this.O = null);
                }
                function SB(A, Q) {
                    A = WA(A);
                    for(var I = B["dynCall_" + A], g = [], E = 1; E < A.length; ++E)g.push("a" + E);
                    return E = "return function dynCall_" + A + "_" + Q + "(" + g.join(", ") + ") {\n", E += "    return dynCall(rawFunction" + (g.length ? ", " : "") + g.join(", ") + ");\n", "function" != typeof (I = new Function("dynCall", "rawFunction", E + "};\n")(I, Q)) && $A("unknown function pointer with signature " + A + ": " + Q), I;
                }
                var MB = void 0;
                function JB(A) {
                    var B = WA(A = yQ(A));
                    return IQ(A), B;
                }
                function VB(A, B) {
                    var Q = [], I = {};
                    throw B.forEach(function A(B) {
                        I[B] || jA[B] || (zA[B] ? zA[B].forEach(A) : (Q.push(B), I[B] = !0));
                    }), new MB(A + ": " + Q.map(JB).join([
                        ", "
                    ]));
                }
                function KB(A, B) {
                    for(var Q = [], I = 0; I < A; I++)Q.push(l[(B >> 2) + I]);
                    return Q;
                }
                function tB(A) {
                    for(; A.length;){
                        var B = A.pop();
                        A.pop()(B);
                    }
                }
                function nB(A, B, Q) {
                    return A instanceof Object || $A(Q + ' with invalid "this": ' + A), A instanceof B.i.constructor || $A(Q + ' incompatible with "this" of type ' + A.constructor.name), A.c.j || $A("cannot call emscripten binding method " + Q + " on deleted object"), wB(A.c.j, A.c.o.i, B.i);
                }
                var dB = [], rB = [
                    {},
                    {
                        value: void 0
                    },
                    {
                        value: null
                    },
                    {
                        value: !0
                    },
                    {
                        value: !1
                    }
                ];
                function eB(A) {
                    switch(A){
                        case void 0:
                            return 1;
                        case null:
                            return 2;
                        case !0:
                            return 3;
                        case !1:
                            return 4;
                        default:
                            var B = dB.length ? dB.pop() : rB.length;
                            return rB[B] = {
                                ra: 1,
                                value: A
                            }, B;
                    }
                }
                function lB(A) {
                    if (null === A) return "null";
                    var B = typeof A;
                    return "object" === B || "array" === B || "function" === B ? A.toString() : "" + A;
                }
                function xB(A, B) {
                    switch(B){
                        case 2:
                            return function(A) {
                                return this.fromWireType(Z[A >> 2]);
                            };
                        case 3:
                            return function(A) {
                                return this.fromWireType(f[A >> 3]);
                            };
                        default:
                            throw new TypeError("Unknown float type: " + A);
                    }
                }
                function ZB(A, B, Q) {
                    switch(B){
                        case 0:
                            return Q ? function(A) {
                                return n[A];
                            } : function(A) {
                                return d[A];
                            };
                        case 1:
                            return Q ? function(A) {
                                return r[A >> 1];
                            } : function(A) {
                                return e[A >> 1];
                            };
                        case 2:
                            return Q ? function(A) {
                                return l[A >> 2];
                            } : function(A) {
                                return x[A >> 2];
                            };
                        default:
                            throw new TypeError("Unknown integer type: " + A);
                    }
                }
                var fB, bB = {};
                function pB() {
                    if (!fB) {
                        var A, B = {
                            USER: "web_user",
                            LOGNAME: "web_user",
                            PATH: "/",
                            PWD: "/",
                            HOME: "/home/web_user",
                            LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
                            _: U || "./this.program"
                        };
                        for(A in bB)B[A] = bB[A];
                        var Q = [];
                        for(A in B)Q.push(A + "=" + B[A]);
                        fB = Q;
                    }
                    return fB;
                }
                function qB(A) {
                    return 0 == A % 4 && (0 != A % 100 || 0 == A % 400);
                }
                function uB(A, B) {
                    for(var Q = 0, I = 0; I <= B; Q += A[I++]);
                    return Q;
                }
                var OB = [
                    31,
                    29,
                    31,
                    30,
                    31,
                    30,
                    31,
                    31,
                    30,
                    31,
                    30,
                    31
                ], mB = [
                    31,
                    28,
                    31,
                    30,
                    31,
                    30,
                    31,
                    31,
                    30,
                    31,
                    30,
                    31
                ];
                function WB(A, B) {
                    for(A = new Date(A.getTime()); 0 < B;){
                        var Q = A.getMonth(), I = (qB(A.getFullYear()) ? OB : mB)[Q];
                        if (!(B > I - A.getDate())) {
                            A.setDate(A.getDate() + B);
                            break;
                        }
                        B -= I - A.getDate() + 1, A.setDate(1), 11 > Q ? A.setMonth(Q + 1) : (A.setMonth(0), A.setFullYear(A.getFullYear() + 1));
                    }
                    return A;
                }
                function XB(A, B, Q, I) {
                    A || (A = this), this.parent = A, this.s = A.s, this.oa = null, this.id = fA.ec++, this.name = B, this.mode = Q, this.g = {}, this.h = {}, this.rdev = I;
                }
                Object.defineProperties(XB.prototype, {
                    read: {
                        get: function() {
                            return 365 == (365 & this.mode);
                        },
                        set: function(A) {
                            A ? this.mode |= 365 : this.mode &= -366;
                        }
                    },
                    write: {
                        get: function() {
                            return 146 == (146 & this.mode);
                        },
                        set: function(A) {
                            A ? this.mode |= 146 : this.mode &= -147;
                        }
                    },
                    ac: {
                        get: function() {
                            return fA.v(this.mode);
                        }
                    },
                    Sa: {
                        get: function() {
                            return fA.ya(this.mode);
                        }
                    }
                }), fA.Ab = XB, fA.rc();
                for(var jB = Array(256), zB = 0; 256 > zB; ++zB)jB[zB] = String.fromCharCode(zB);
                function vB(A, B) {
                    var Q = Array(K(A) + 1);
                    return A = V(A, Q, 0, Q.length), B && (Q.length = A), Q;
                }
                function TB(A) {
                    for(var B = [], Q = 0; Q < A.length; Q++){
                        var I = A[Q];
                        255 < I && (I &= 255), B.push(String.fromCharCode(I));
                    }
                    return B.join("");
                }
                mA = jB, _A = B.BindingError = PA("BindingError"), AB = B.InternalError = PA("InternalError"), NB.prototype.isAliasOf = function(A) {
                    if (!(this instanceof NB && A instanceof NB)) return !1;
                    var B = this.c.o.i, Q = this.c.j, I = A.c.o.i;
                    for(A = A.c.j; B.G;)Q = B.ta(Q), B = B.G;
                    for(; I.G;)A = I.ta(A), I = I.G;
                    return B === I && Q === A;
                }, NB.prototype.clone = function() {
                    if (this.c.j || EB(this), this.c.qa) return this.c.count.value += 1, this;
                    var A = yB(Object.create(Object.getPrototypeOf(this), {
                        c: {
                            value: gB(this.c)
                        }
                    }));
                    return A.c.count.value += 1, A.c.aa = !1, A;
                }, NB.prototype.delete = function() {
                    this.c.j || EB(this), this.c.aa && !this.c.qa && $A("Object already scheduled for deletion"), DB(this), iB(this.c), this.c.qa || (this.c.D = void 0, this.c.j = void 0);
                }, NB.prototype.isDeleted = function() {
                    return !this.c.j;
                }, NB.prototype.deleteLater = function() {
                    return this.c.j || EB(this), this.c.aa && !this.c.qa && $A("Object already scheduled for deletion"), UB.push(this), 1 === UB.length && FB && FB(cB), this.c.aa = !0, this;
                }, aB.prototype.Yb = function(A) {
                    return this.xb && (A = this.xb(A)), A;
                }, aB.prototype.ja = function(A) {
                    this.$ && this.$(A);
                }, aB.prototype.argPackAdvance = 8, aB.prototype.readValueFromPointer = RB, aB.prototype.deleteObject = function(A) {
                    null !== A && A.delete();
                }, aB.prototype.fromWireType = function(A) {
                    function B() {
                        return this.Ba ? kB(this.i.U, {
                            o: this.kc,
                            j: Q,
                            F: this,
                            D: A
                        }) : kB(this.i.U, {
                            o: this,
                            j: A
                        });
                    }
                    var Q = this.Yb(A);
                    if (!Q) return this.ja(A), null;
                    var I = function(A, B) {
                        for(void 0 === B && $A("ptr should not be undefined"); A.G;)B = A.ta(B), A = A.G;
                        return hB[B];
                    }(this.i, Q);
                    if (void 0 !== I) return 0 === I.c.count.value ? (I.c.j = Q, I.c.D = A, I.clone()) : (I = I.clone(), this.ja(A), I);
                    if (I = this.i.Wb(Q), !(I = HB[I])) return B.call(this);
                    I = this.za ? I.Mb : I.pointerType;
                    var g = function A(B, Q, I) {
                        return Q === I ? B : void 0 === I.G || null === (B = A(B, Q, I.G)) ? null : I.Tb(B);
                    }(Q, this.i, I.i);
                    return null === g ? B.call(this) : this.Ba ? kB(I.i.U, {
                        o: I,
                        j: g,
                        F: this,
                        D: A
                    }) : kB(I.i.U, {
                        o: I,
                        j: g
                    });
                }, B.getInheritedInstanceCount = function() {
                    return Object.keys(hB).length;
                }, B.getLiveInheritedInstances = function() {
                    var A, B = [];
                    for(A in hB)hB.hasOwnProperty(A) && B.push(hB[A]);
                    return B;
                }, B.flushPendingDeletes = cB, B.setDelayFunction = function(A) {
                    FB = A, UB.length && FB && FB(cB);
                }, MB = B.UnboundTypeError = PA("UnboundTypeError"), B.count_emval_handles = function() {
                    for(var A = 0, B = 5; B < rB.length; ++B)void 0 !== rB[B] && ++A;
                    return A;
                }, B.get_first_emval = function() {
                    for(var A = 5; A < rB.length; ++A)if (void 0 !== rB[A]) return rB[A];
                    return null;
                };
                var PB = "function" == typeof atob ? atob : function(A) {
                    var B = "", Q = 0;
                    A = A.replace(/[^A-Za-z0-9\+\/=]/g, "");
                    do {
                        var I = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(A.charAt(Q++)), g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(A.charAt(Q++)), E = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(A.charAt(Q++)), C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(A.charAt(Q++));
                        I = I << 2 | g >> 4, g = (15 & g) << 4 | E >> 2;
                        var D = (3 & E) << 6 | C;
                        B += String.fromCharCode(I), 64 !== E && (B += String.fromCharCode(g)), 64 !== C && (B += String.fromCharCode(D));
                    }while (Q < A.length);
                    return B;
                };
                function _B(A) {
                    if (UA(A, HA)) {
                        if (A = A.slice(HA.length), "boolean" == typeof y && y) {
                            try {
                                var B = Buffer.from(A, "base64");
                            } catch (Q) {
                                B = new Buffer(A, "base64");
                            }
                            var Q = new Uint8Array(B.buffer, B.byteOffset, B.byteLength);
                        } else try {
                            var I = PB(A), g = new Uint8Array(I.length);
                            for(B = 0; B < I.length; ++B)g[B] = I.charCodeAt(B);
                            Q = g;
                        } catch (A) {
                            throw Error("Converting base64 string to bytes failed.");
                        }
                        return Q;
                    }
                }
                var $B = {
                    __assert_fail: function(A, B, Q, I) {
                        FA("Assertion failed: " + J(A) + ", at: " + [
                            B ? J(B) : "unknown filename",
                            Q,
                            I ? J(I) : "unknown function"
                        ]);
                    },
                    __cxa_allocate_exception: function(A) {
                        return QQ(A);
                    },
                    __cxa_atexit: function(A, B) {
                    },
                    __cxa_begin_catch: function(A) {
                        var B = YA[A];
                        return B && !B.fb && (B.fb = !0, CQ.ab--), B && (B.Ea = !1), sA.push(A), (B = LA(A)) && YA[B].ra++, A;
                    },
                    __cxa_end_catch: function() {
                        EQ(0);
                        var A = sA.pop();
                        if (A) {
                            if (A = LA(A)) {
                                var Q = YA[A];
                                Q.ra--, 0 !== Q.ra || Q.Ea || (Q.ja && B.dynCall_ii(Q.ja, A), delete YA[A], hA(A));
                            }
                            RA = 0;
                        }
                    },
                    __cxa_find_matching_catch_2: function() {
                        var A = RA;
                        if (!A) return L = 0;
                        var B = YA[A], Q = B.type;
                        if (!Q) return L = 0, 0 | A;
                        var I = Array.prototype.slice.call(arguments);
                        iQ(Q), l[22792] = A, A = 91168;
                        for(var g = 0; g < I.length; g++)if (I[g] && DQ(I[g], Q, A)) return A = l[A >> 2], B.ha.push(A), L = I[g], 0 | A;
                        return A = l[A >> 2], L = Q, 0 | A;
                    },
                    __cxa_find_matching_catch_3: function() {
                        var A = RA;
                        if (!A) return L = 0;
                        var B = YA[A], Q = B.type;
                        if (!Q) return L = 0, 0 | A;
                        var I = Array.prototype.slice.call(arguments);
                        iQ(Q), l[22792] = A, A = 91168;
                        for(var g = 0; g < I.length; g++)if (I[g] && DQ(I[g], Q, A)) return A = l[A >> 2], B.ha.push(A), L = I[g], 0 | A;
                        return A = l[A >> 2], L = Q, 0 | A;
                    },
                    __cxa_find_matching_catch_4: function() {
                        var A = RA;
                        if (!A) return L = 0;
                        var B = YA[A], Q = B.type;
                        if (!Q) return L = 0, 0 | A;
                        var I = Array.prototype.slice.call(arguments);
                        iQ(Q), l[22792] = A, A = 91168;
                        for(var g = 0; g < I.length; g++)if (I[g] && DQ(I[g], Q, A)) return A = l[A >> 2], B.ha.push(A), L = I[g], 0 | A;
                        return A = l[A >> 2], L = Q, 0 | A;
                    },
                    __cxa_find_matching_catch_5: function() {
                        var A = RA;
                        if (!A) return L = 0;
                        var B = YA[A], Q = B.type;
                        if (!Q) return L = 0, 0 | A;
                        var I = Array.prototype.slice.call(arguments);
                        iQ(Q), l[22792] = A, A = 91168;
                        for(var g = 0; g < I.length; g++)if (I[g] && DQ(I[g], Q, A)) return A = l[A >> 2], B.ha.push(A), L = I[g], 0 | A;
                        return A = l[A >> 2], L = Q, 0 | A;
                    },
                    __cxa_free_exception: hA,
                    __cxa_get_exception_ptr: function(A) {
                        return A;
                    },
                    __cxa_rethrow: function() {
                        var A = sA.pop();
                        throw A = LA(A), YA[A].Ea || (sA.push(A), YA[A].Ea = !0), RA = A, A;
                    },
                    __cxa_throw: function(A, B, Q) {
                        throw YA[A] = {
                            j: A,
                            ha: [
                                A
                            ],
                            type: B,
                            ja: Q,
                            ra: 0,
                            fb: !1,
                            Ea: !1
                        }, RA = A, "uncaught_exception" in CQ ? CQ.ab++ : CQ.ab = 1, A;
                    },
                    __cxa_uncaught_exceptions: function() {
                        return CQ.ab;
                    },
                    __map_file: function() {
                        return kA(63), -1;
                    },
                    __resumeException: function(A) {
                        throw RA || (RA = A), A;
                    },
                    __sys_fcntl64: function(A, B, Q) {
                        pA = Q;
                        try {
                            var I = uA(A);
                            switch(B){
                                case 0:
                                    var g = qA();
                                    return 0 > g ? -28 : fA.open(I.path, I.flags, 0, g).fd;
                                case 1:
                                case 2:
                                    return 0;
                                case 3:
                                    return I.flags;
                                case 4:
                                    return g = qA(), I.flags |= g, 0;
                                case 12:
                                    return g = qA(), r[g + 0 >> 1] = 2, 0;
                                case 13:
                                case 14:
                                    return 0;
                                case 16:
                                case 8:
                                    return -28;
                                case 9:
                                    return kA(28), -1;
                                default:
                                    return -28;
                            }
                        } catch (A) {
                            return void 0 !== fA && A instanceof fA.b || FA(A), -A.B;
                        }
                    },
                    __sys_ioctl: function(A, B, Q) {
                        pA = Q;
                        try {
                            var I = uA(A);
                            switch(B){
                                case 21509:
                                case 21505:
                                    return I.tty ? 0 : -59;
                                case 21510:
                                case 21511:
                                case 21512:
                                case 21506:
                                case 21507:
                                case 21508:
                                    return I.tty ? 0 : -59;
                                case 21519:
                                    if (!I.tty) return -59;
                                    var g = qA();
                                    return l[g >> 2] = 0;
                                case 21520:
                                    return I.tty ? -28 : -59;
                                case 21531:
                                    return g = qA(), fA.Ra(I, B, g);
                                case 21523:
                                case 21524:
                                    return I.tty ? 0 : -59;
                                default:
                                    FA("bad ioctl syscall " + B);
                            }
                        } catch (A) {
                            return void 0 !== fA && A instanceof fA.b || FA(A), -A.B;
                        }
                    },
                    __sys_munmap: function(A, B) {
                        try {
                            if (-1 == (0 | A) || 0 === B) var Q = -28;
                            else {
                                var I = bA[A];
                                if (I && B === I.Lc) {
                                    var g = fA.ba(I.fd);
                                    if (2 & I.Sc) {
                                        var E = I.flags, C = I.offset, D = d.slice(A, A + B);
                                        fA.da(g, D, C, B, E);
                                    }
                                    bA[A] = null, I.Gb && IQ(I.Nc);
                                }
                                Q = 0;
                            }
                            return Q;
                        } catch (A) {
                            return void 0 !== fA && A instanceof fA.b || FA(A), -A.B;
                        }
                    },
                    __sys_open: function(A, B, Q) {
                        pA = Q;
                        try {
                            var I = J(A), g = qA();
                            return fA.open(I, B, g).fd;
                        } catch (A) {
                            return void 0 !== fA && A instanceof fA.b || FA(A), -A.B;
                        }
                    },
                    __sys_stat64: function(A, B) {
                        try {
                            A = J(A);
                            A: {
                                var Q = fA.stat;
                                try {
                                    var I = Q(A);
                                } catch (B) {
                                    if (B && B.node && SA(A) !== SA(fA.I(B.node))) {
                                        var g = -54;
                                        break A;
                                    }
                                    throw B;
                                }
                                l[B >> 2] = I.dev, l[B + 4 >> 2] = 0, l[B + 8 >> 2] = I.ino, l[B + 12 >> 2] = I.mode, l[B + 16 >> 2] = I.nlink, l[B + 20 >> 2] = I.uid, l[B + 24 >> 2] = I.gid, l[B + 28 >> 2] = I.rdev, l[B + 32 >> 2] = 0, NA = [
                                    I.size >>> 0,
                                    (cA = I.size, 1 <= +BA(cA) ? 0 < cA ? (0 | gA(+IA(cA / 4294967296), 4294967295)) >>> 0 : ~~+QA((cA - +(~~cA >>> 0)) / 4294967296) >>> 0 : 0)
                                ], l[B + 40 >> 2] = NA[0], l[B + 44 >> 2] = NA[1], l[B + 48 >> 2] = 4096, l[B + 52 >> 2] = I.blocks, l[B + 56 >> 2] = I.atime.getTime() / 1e3 | 0, l[B + 60 >> 2] = 0, l[B + 64 >> 2] = I.mtime.getTime() / 1e3 | 0, l[B + 68 >> 2] = 0, l[B + 72 >> 2] = I.ctime.getTime() / 1e3 | 0, l[B + 76 >> 2] = 0, NA = [
                                    I.ino >>> 0,
                                    (cA = I.ino, 1 <= +BA(cA) ? 0 < cA ? (0 | gA(+IA(cA / 4294967296), 4294967295)) >>> 0 : ~~+QA((cA - +(~~cA >>> 0)) / 4294967296) >>> 0 : 0)
                                ], l[B + 80 >> 2] = NA[0], l[B + 84 >> 2] = NA[1], g = 0;
                            }
                            return g;
                        } catch (A) {
                            return void 0 !== fA && A instanceof fA.b || FA(A), -A.B;
                        }
                    },
                    _embind_register_bool: function(A, B, Q, I, g) {
                        var E = OA(Q);
                        IB(A, {
                            name: B = WA(B),
                            fromWireType: function(A) {
                                return !!A;
                            },
                            toWireType: function(A, B) {
                                return B ? I : g;
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: function(A) {
                                if (1 === Q) var I = n;
                                else if (2 === Q) I = r;
                                else {
                                    if (4 !== Q) throw new TypeError("Unknown boolean type size: " + B);
                                    I = l;
                                }
                                return this.fromWireType(I[A >> E]);
                            },
                            O: null
                        });
                    },
                    _embind_register_class: function(A, Q, I, g, E, C, D, i, y, F, U, c, N) {
                        U = WA(U), C = SB(E, C), i && (i = SB(D, i)), F && (F = SB(y, F)), N = SB(c, N);
                        var H = vA(U);
                        !function(A, Q) {
                            B.hasOwnProperty(A) ? ($A("Cannot register public name '" + A + "' twice"), GB(B, A, A), B.hasOwnProperty(void 0) && $A("Cannot register multiple overloads of a function with the same number of arguments (undefined)!"), B[A].N[void 0] = Q) : B[A] = Q;
                        }(H, function() {
                            VB("Cannot construct " + U + " due to unbound types", [
                                g
                            ]);
                        }), QB([
                            A,
                            Q,
                            I
                        ], g ? [
                            g
                        ] : [], function(Q) {
                            if (Q = Q[0], g) var I = Q.i, E = I.U;
                            else E = NB.prototype;
                            Q = TA(H, function() {
                                if (Object.getPrototypeOf(this) !== D) throw new _A("Use 'new' to construct " + U);
                                if (void 0 === y.V) throw new _A(U + " has no accessible constructor");
                                var A = y.V[arguments.length];
                                if (void 0 === A) throw new _A("Tried to invoke ctor of " + U + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(y.V).toString() + ") parameters instead!");
                                return A.apply(this, arguments);
                            });
                            var D = Object.create(E, {
                                constructor: {
                                    value: Q
                                }
                            });
                            Q.prototype = D;
                            var y = new oB(U, Q, D, N, I, C, i, F);
                            I = new aB(U, y, !0, !1), E = new aB(U + "*", y, !1, !1);
                            var c = new aB(U + " const*", y, !1, !0);
                            return HB[A] = {
                                pointerType: E,
                                Mb: c
                            }, function(A, Q) {
                                B.hasOwnProperty(A) || BB("Replacing nonexistant public symbol"), B[A] = Q, B[A].va = void 0;
                            }(H, Q), [
                                I,
                                E,
                                c
                            ];
                        });
                    },
                    _embind_register_class_constructor: function(A, B, Q, I, g, E) {
                        a(0 < B);
                        var C = KB(B, Q);
                        g = SB(I, g);
                        var D = [
                            E
                        ], i = [];
                        QB([], [
                            A
                        ], function(A) {
                            var Q = "constructor " + (A = A[0]).name;
                            if (void 0 === A.i.V && (A.i.V = []), void 0 !== A.i.V[B - 1]) throw new _A("Cannot register multiple constructors with identical number of parameters (" + (B - 1) + ") for class '" + A.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
                            return A.i.V[B - 1] = function() {
                                VB("Cannot construct " + A.name + " due to unbound types", C);
                            }, QB([], C, function(I) {
                                return A.i.V[B - 1] = function() {
                                    arguments.length !== B - 1 && $A(Q + " called with " + arguments.length + " arguments, expected " + (B - 1)), i.length = 0, D.length = B;
                                    for(var A = 1; A < B; ++A)D[A] = I[A].toWireType(i, arguments[A - 1]);
                                    return A = g.apply(null, D), tB(i), I[0].fromWireType(A);
                                }, [];
                            }), [];
                        });
                    },
                    _embind_register_class_function: function(A, B, Q, I, g, E, C, D) {
                        var i = KB(Q, I);
                        B = WA(B), E = SB(g, E), QB([], [
                            A
                        ], function(A) {
                            function I() {
                                VB("Cannot call " + g + " due to unbound types", i);
                            }
                            var g = (A = A[0]).name + "." + B;
                            D && A.i.lc.push(B);
                            var y = A.i.U, F = y[B];
                            return void 0 === F || void 0 === F.N && F.className !== A.name && F.va === Q - 2 ? (I.va = Q - 2, I.className = A.name, y[B] = I) : (GB(y, B, g), y[B].N[Q - 2] = I), QB([], i, function(I) {
                                var D = g, i = A, F = E, U = I.length;
                                2 > U && $A("argTypes array size mismatch! Must at least get return value and 'this' types!");
                                var c = null !== I[1] && null !== i, N = !1;
                                for(i = 1; i < I.length; ++i)if (null !== I[i] && void 0 === I[i].O) {
                                    N = !0;
                                    break;
                                }
                                var H = "void" !== I[0].name, G = "", o = "";
                                for(i = 0; i < U - 2; ++i)G += (0 !== i ? ", " : "") + "arg" + i, o += (0 !== i ? ", " : "") + "arg" + i + "Wired";
                                D = "return function " + vA(D) + "(" + G + ") {\nif (arguments.length !== " + (U - 2) + ") {\nthrowBindingError('function " + D + " called with ' + arguments.length + ' arguments, expected " + (U - 2) + " args!');\n}\n", N && (D += "var destructors = [];\n");
                                var w = N ? "destructors" : "null";
                                for(G = "throwBindingError invoker fn runDestructors retType classParam".split(" "), F = [
                                    $A,
                                    F,
                                    C,
                                    tB,
                                    I[0],
                                    I[1]
                                ], c && (D += "var thisWired = classParam.toWireType(" + w + ", this);\n"), i = 0; i < U - 2; ++i)D += "var arg" + i + "Wired = argType" + i + ".toWireType(" + w + ", arg" + i + "); // " + I[i + 2].name + "\n", G.push("argType" + i), F.push(I[i + 2]);
                                if (c && (o = "thisWired" + (0 < o.length ? ", " : "") + o), D += (H ? "var rv = " : "") + "invoker(fn" + (0 < o.length ? ", " : "") + o + ");\n", N) D += "runDestructors(destructors);\n";
                                else for(i = c ? 1 : 2; i < I.length; ++i)U = 1 === i ? "thisWired" : "arg" + (i - 2) + "Wired", null !== I[i].O && (D += U + "_dtor(" + U + "); // " + I[i].name + "\n", G.push(U + "_dtor"), F.push(I[i].O));
                                return H && (D += "var ret = retType.fromWireType(rv);\nreturn ret;\n"), G.push(D + "}\n"), I = (function(A) {
                                    var B = Function;
                                    if (!(B instanceof Function)) throw new TypeError("new_ called with constructor type " + typeof B + " which is not a function");
                                    var Q = TA(B.name || "unknownFunctionName", function() {});
                                    return Q.prototype = B.prototype, Q = new Q, (A = B.apply(Q, A)) instanceof Object ? A : Q;
                                })(G).apply(null, F), void 0 === y[B].N ? (I.va = Q - 2, y[B] = I) : y[B].N[Q - 2] = I, [];
                            }), [];
                        });
                    },
                    _embind_register_class_property: function(A, B, Q, I, g, E, C, D, i, y) {
                        B = WA(B), g = SB(I, g), QB([], [
                            A
                        ], function(A) {
                            var I = (A = A[0]).name + "." + B, F = {
                                get: function() {
                                    VB("Cannot access " + I + " due to unbound types", [
                                        Q,
                                        C
                                    ]);
                                },
                                enumerable: !0,
                                configurable: !0
                            };
                            return F.set = i ? function() {
                                VB("Cannot access " + I + " due to unbound types", [
                                    Q,
                                    C
                                ]);
                            } : function() {
                                $A(I + " is a read-only property");
                            }, Object.defineProperty(A.i.U, B, F), QB([], i ? [
                                Q,
                                C
                            ] : [
                                Q
                            ], function(Q) {
                                var C = Q[0], F = {
                                    get: function() {
                                        var B = nB(this, A, I + " getter");
                                        return C.fromWireType(g(E, B));
                                    },
                                    enumerable: !0
                                };
                                if (i) {
                                    i = SB(D, i);
                                    var U = Q[1];
                                    F.set = function(B) {
                                        var Q = nB(this, A, I + " setter"), g = [];
                                        i(y, Q, U.toWireType(g, B)), tB(g);
                                    };
                                }
                                return Object.defineProperty(A.i.U, B, F), [];
                            }), [];
                        });
                    },
                    _embind_register_emval: function(A, B) {
                        IB(A, {
                            name: B = WA(B),
                            fromWireType: function(A) {
                                var B = rB[A].value;
                                return 4 < A && 0 == --rB[A].ra && (rB[A] = void 0, dB.push(A)), B;
                            },
                            toWireType: function(A, B) {
                                return eB(B);
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: RB,
                            O: null
                        });
                    },
                    _embind_register_float: function(A, B, Q) {
                        Q = OA(Q), IB(A, {
                            name: B = WA(B),
                            fromWireType: function(A) {
                                return A;
                            },
                            toWireType: function(A, B) {
                                if ("number" != typeof B && "boolean" != typeof B) throw new TypeError('Cannot convert "' + lB(B) + '" to ' + this.name);
                                return B;
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: xB(B, Q),
                            O: null
                        });
                    },
                    _embind_register_integer: function(A, B, Q, I, g) {
                        function E(A) {
                            return A;
                        }
                        B = WA(B), -1 === g && (g = 4294967295);
                        var C = OA(Q);
                        if (0 === I) {
                            var D = 32 - 8 * Q;
                            E = function(A) {
                                return A << D >>> D;
                            };
                        }
                        var i = -1 != B.indexOf("unsigned");
                        IB(A, {
                            name: B,
                            fromWireType: E,
                            toWireType: function(A, Q) {
                                if ("number" != typeof Q && "boolean" != typeof Q) throw new TypeError('Cannot convert "' + lB(Q) + '" to ' + this.name);
                                if (Q < I || Q > g) throw new TypeError('Passing a number "' + lB(Q) + '" from JS side to C/C++ side to an argument of type "' + B + '", which is outside the valid range [' + I + ", " + g + "]!");
                                return i ? Q >>> 0 : 0 | Q;
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: ZB(B, C, 0 !== I),
                            O: null
                        });
                    },
                    _embind_register_memory_view: function(A, B, Q) {
                        function I(A) {
                            var B = x;
                            return new g(t, B[1 + (A >>= 2)], B[A]);
                        }
                        var g = [
                            Int8Array,
                            Uint8Array,
                            Int16Array,
                            Uint16Array,
                            Int32Array,
                            Uint32Array,
                            Float32Array,
                            Float64Array
                        ][B];
                        IB(A, {
                            name: Q = WA(Q),
                            fromWireType: I,
                            argPackAdvance: 8,
                            readValueFromPointer: I
                        }, {
                            Zb: !0
                        });
                    },
                    _embind_register_std_string: function(A, B) {
                        var Q = "std::string" === (B = WA(B));
                        IB(A, {
                            name: B,
                            fromWireType: function(A) {
                                var B = x[A >> 2];
                                if (Q) {
                                    var I = d[A + 4 + B], g = 0;
                                    0 != I && (g = I, d[A + 4 + B] = 0);
                                    var E = A + 4;
                                    for(I = 0; I <= B; ++I){
                                        var C = A + 4 + I;
                                        if (0 == d[C]) {
                                            if (E = J(E), void 0 === D) var D = E;
                                            else D += String.fromCharCode(0), D += E;
                                            E = C + 1;
                                        }
                                    }
                                    0 != g && (d[A + 4 + B] = g);
                                } else {
                                    for(D = Array(B), I = 0; I < B; ++I)D[I] = String.fromCharCode(d[A + 4 + I]);
                                    D = D.join("");
                                }
                                return IQ(A), D;
                            },
                            toWireType: function(A, B) {
                                B instanceof ArrayBuffer && (B = new Uint8Array(B));
                                var I = "string" == typeof B;
                                I || B instanceof Uint8Array || B instanceof Uint8ClampedArray || B instanceof Int8Array || $A("Cannot pass non-string to std::string");
                                var g = (Q && I ? function() {
                                    return K(B);
                                } : function() {
                                    return B.length;
                                })(), E = QQ(4 + g + 1);
                                if (x[E >> 2] = g, Q && I) V(B, d, E + 4, g + 1);
                                else if (I) for(I = 0; I < g; ++I){
                                    var C = B.charCodeAt(I);
                                    255 < C && (IQ(E), $A("String has UTF-16 code units that do not fit in 8 bits")), d[E + 4 + I] = C;
                                }
                                else for(I = 0; I < g; ++I)d[E + 4 + I] = B[I];
                                return null !== A && A.push(IQ, E), E;
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: RB,
                            O: function(A) {
                                IQ(A);
                            }
                        });
                    },
                    _embind_register_std_wstring: function(A, B, Q) {
                        if (Q = WA(Q), 2 === B) var I = p, g = q, E = u, C = function() {
                            return e;
                        }, D = 1;
                        else 4 === B && (I = O, g = m, E = W, C = function() {
                            return x;
                        }, D = 2);
                        IB(A, {
                            name: Q,
                            fromWireType: function(A) {
                                var Q = x[A >> 2], g = C(), E = g[A + 4 + Q * B >> D], i = 0;
                                0 != E && (i = E, g[A + 4 + Q * B >> D] = 0);
                                var y = A + 4;
                                for(E = 0; E <= Q; ++E){
                                    var F = A + 4 + E * B;
                                    if (0 == g[F >> D]) {
                                        if (y = I(y), void 0 === U) var U = y;
                                        else U += String.fromCharCode(0), U += y;
                                        y = F + B;
                                    }
                                }
                                return 0 != i && (g[A + 4 + Q * B >> D] = i), IQ(A), U;
                            },
                            toWireType: function(A, I) {
                                "string" != typeof I && $A("Cannot pass non-string to C++ string type " + Q);
                                var C = E(I), i = QQ(4 + C + B);
                                return x[i >> 2] = C >> D, g(I, i + 4, C + B), null !== A && A.push(IQ, i), i;
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: RB,
                            O: function(A) {
                                IQ(A);
                            }
                        });
                    },
                    _embind_register_void: function(A, B) {
                        IB(A, {
                            Jc: !0,
                            name: B = WA(B),
                            argPackAdvance: 0,
                            fromWireType: function() {},
                            toWireType: function() {}
                        });
                    },
                    abort: function() {
                        FA();
                    },
                    emscripten_get_sbrk_ptr: function() {
                        return 91008;
                    },
                    emscripten_memcpy_big: function(A, B, Q) {
                        d.copyWithin(A, B, B + Q);
                    },
                    emscripten_resize_heap: function(A) {
                        A >>>= 0;
                        var B = d.length;
                        if (2147483648 < A) return !1;
                        for(var Q = 1; 4 >= Q; Q *= 2){
                            var I = B * (1 + .2 / Q);
                            I = Math.min(I, A + 100663296), 0 < (I = Math.max(16777216, A, I)) % 65536 && (I += 65536 - I % 65536);
                            A: {
                                try {
                                    R.grow(Math.min(2147483648, I) - t.byteLength + 65535 >>> 16), X(R.buffer);
                                    var g = 1;
                                    break A;
                                } catch (A) {}
                                g = void 0;
                            }
                            if (g) return !0;
                        }
                        return !1;
                    },
                    environ_get: function(A, B) {
                        var Q = 0;
                        return pB().forEach(function(I, g) {
                            var E = B + Q;
                            for(g = l[A + 4 * g >> 2] = E, E = 0; E < I.length; ++E)n[g++ >> 0] = I.charCodeAt(E);
                            n[g >> 0] = 0, Q += I.length + 1;
                        }), 0;
                    },
                    environ_sizes_get: function(A, B) {
                        var Q = pB();
                        l[A >> 2] = Q.length;
                        var I = 0;
                        return Q.forEach(function(A) {
                            I += A.length + 1;
                        }), l[B >> 2] = I, 0;
                    },
                    fd_close: function(A) {
                        try {
                            var B = uA(A);
                            return fA.close(B), 0;
                        } catch (A) {
                            return void 0 !== fA && A instanceof fA.b || FA(A), A.B;
                        }
                    },
                    fd_read: function(A, B, Q, I) {
                        try {
                            A: {
                                for(var g = uA(A), E = A = 0; E < Q; E++){
                                    var C = l[B + (8 * E + 4) >> 2], D = fA.read(g, n, l[B + 8 * E >> 2], C, void 0);
                                    if (0 > D) {
                                        var i = -1;
                                        break A;
                                    }
                                    if (A += D, D < C) break;
                                }
                                i = A;
                            }
                            return l[I >> 2] = i, 0;
                        } catch (A) {
                            return void 0 !== fA && A instanceof fA.b || FA(A), A.B;
                        }
                    },
                    fd_seek: function(A, B, Q, I, g) {
                        try {
                            var E = uA(A);
                            return -9007199254740992 >= (A = 4294967296 * Q + (B >>> 0)) || 9007199254740992 <= A ? -61 : (fA.K(E, A, I), NA = [
                                E.position >>> 0,
                                (cA = E.position, 1 <= +BA(cA) ? 0 < cA ? (0 | gA(+IA(cA / 4294967296), 4294967295)) >>> 0 : ~~+QA((cA - +(~~cA >>> 0)) / 4294967296) >>> 0 : 0)
                            ], l[g >> 2] = NA[0], l[g + 4 >> 2] = NA[1], E.Oa && 0 === A && 0 === I && (E.Oa = null), 0);
                        } catch (A) {
                            return void 0 !== fA && A instanceof fA.b || FA(A), A.B;
                        }
                    },
                    fd_write: function(A, B, Q, I) {
                        try {
                            A: {
                                for(var g = uA(A), E = A = 0; E < Q; E++){
                                    var C = fA.write(g, n, l[B + 8 * E >> 2], l[B + (8 * E + 4) >> 2], void 0);
                                    if (0 > C) {
                                        var D = -1;
                                        break A;
                                    }
                                    A += C;
                                }
                                D = A;
                            }
                            return l[I >> 2] = D, 0;
                        } catch (A) {
                            return void 0 !== fA && A instanceof fA.b || FA(A), A.B;
                        }
                    },
                    getTempRet0: function() {
                        return 0 | L;
                    },
                    gettimeofday: function(A) {
                        var B = Date.now();
                        return l[A >> 2] = B / 1e3 | 0, l[A + 4 >> 2] = B % 1e3 * 1e3 | 0, 0;
                    },
                    invoke_diii: function(A, B, Q, I) {
                        var g = uQ();
                        try {
                            return qQ(A, B, Q, I);
                        } catch (A) {
                            if (mQ(g), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_fiii: function(A, B, Q, I) {
                        var g = uQ();
                        try {
                            return pQ(A, B, Q, I);
                        } catch (A) {
                            if (mQ(g), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_i: function(A) {
                        var B = uQ();
                        try {
                            return hQ(A);
                        } catch (A) {
                            if (mQ(B), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_ii: function(A, B) {
                        var Q = uQ();
                        try {
                            return kQ(A, B);
                        } catch (A) {
                            if (mQ(Q), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iif: function(A, B, Q) {
                        var I = uQ();
                        try {
                            return ZQ(A, B, Q);
                        } catch (A) {
                            if (mQ(I), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iii: function(A, B, Q) {
                        var I = uQ();
                        try {
                            return aQ(A, B, Q);
                        } catch (A) {
                            if (mQ(I), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iiii: function(A, B, Q, I) {
                        var g = uQ();
                        try {
                            return SQ(A, B, Q, I);
                        } catch (A) {
                            if (mQ(g), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iiiii: function(A, B, Q, I, g) {
                        var E = uQ();
                        try {
                            return MQ(A, B, Q, I, g);
                        } catch (A) {
                            if (mQ(E), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iiiiid: function(A, B, Q, I, g, E) {
                        var C = uQ();
                        try {
                            return eQ(A, B, Q, I, g, E);
                        } catch (A) {
                            if (mQ(C), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iiiiii: function(A, B, Q, I, g, E) {
                        var C = uQ();
                        try {
                            return JQ(A, B, Q, I, g, E);
                        } catch (A) {
                            if (mQ(C), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iiiiiii: function(A, B, Q, I, g, E, C) {
                        var D = uQ();
                        try {
                            return VQ(A, B, Q, I, g, E, C);
                        } catch (A) {
                            if (mQ(D), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iiiiiiii: function(A, B, Q, I, g, E, C, D) {
                        var i = uQ();
                        try {
                            return KQ(A, B, Q, I, g, E, C, D);
                        } catch (A) {
                            if (mQ(i), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iiiiiiiiiii: function(A, B, Q, I, g, E, C, D, i, y, F) {
                        var U = uQ();
                        try {
                            return tQ(A, B, Q, I, g, E, C, D, i, y, F);
                        } catch (A) {
                            if (mQ(U), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iiiiiiiiiiii: function(A, B, Q, I, g, E, C, D, i, y, F, U) {
                        var c = uQ();
                        try {
                            return nQ(A, B, Q, I, g, E, C, D, i, y, F, U);
                        } catch (A) {
                            if (mQ(c), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iiiiiiiiiiiii: function(A, B, Q, I, g, E, C, D, i, y, F, U, c) {
                        var N = uQ();
                        try {
                            return dQ(A, B, Q, I, g, E, C, D, i, y, F, U, c);
                        } catch (A) {
                            if (mQ(N), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iiiiij: function(A, B, Q, I, g, E, C) {
                        var D = uQ();
                        try {
                            return rQ(A, B, Q, I, g, E, C);
                        } catch (A) {
                            if (mQ(D), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iiijiiiiii: function(A, B, Q, I, g, E, C, D, i, y, F) {
                        var U = uQ();
                        try {
                            return lQ(A, B, Q, I, g, E, C, D, i, y, F);
                        } catch (A) {
                            if (mQ(U), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_iij: function(A, B, Q, I) {
                        var g = uQ();
                        try {
                            return xQ(A, B, Q, I);
                        } catch (A) {
                            if (mQ(g), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_jii: function(A, B, Q) {
                        var I = uQ();
                        try {
                            return fQ(A, B, Q);
                        } catch (A) {
                            if (mQ(I), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_jiiii: function(A, B, Q, I, g) {
                        var E = uQ();
                        try {
                            return bQ(A, B, Q, I, g);
                        } catch (A) {
                            if (mQ(E), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_v: function(A) {
                        var B = uQ();
                        try {
                            FQ(A);
                        } catch (A) {
                            if (mQ(B), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_vi: function(A, B) {
                        var Q = uQ();
                        try {
                            UQ(A, B);
                        } catch (A) {
                            if (mQ(Q), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_vii: function(A, B, Q) {
                        var I = uQ();
                        try {
                            cQ(A, B, Q);
                        } catch (A) {
                            if (mQ(I), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_viii: function(A, B, Q, I) {
                        var g = uQ();
                        try {
                            NQ(A, B, Q, I);
                        } catch (A) {
                            if (mQ(g), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_viiii: function(A, B, Q, I, g) {
                        var E = uQ();
                        try {
                            HQ(A, B, Q, I, g);
                        } catch (A) {
                            if (mQ(E), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_viiiii: function(A, B, Q, I, g, E) {
                        var C = uQ();
                        try {
                            GQ(A, B, Q, I, g, E);
                        } catch (A) {
                            if (mQ(C), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_viiiiiii: function(A, B, Q, I, g, E, C, D) {
                        var i = uQ();
                        try {
                            oQ(A, B, Q, I, g, E, C, D);
                        } catch (A) {
                            if (mQ(i), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_viiiiiiiiii: function(A, B, Q, I, g, E, C, D, i, y, F) {
                        var U = uQ();
                        try {
                            wQ(A, B, Q, I, g, E, C, D, i, y, F);
                        } catch (A) {
                            if (mQ(U), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_viiiiiiiiiiiiiii: function(A, B, Q, I, g, E, C, D, i, y, F, U, c, N, H, G) {
                        var o = uQ();
                        try {
                            YQ(A, B, Q, I, g, E, C, D, i, y, F, U, c, N, H, G);
                        } catch (A) {
                            if (mQ(o), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_viiiijji: function(A, B, Q, I, g, E, C, D, i, y) {
                        var F = uQ();
                        try {
                            sQ(A, B, Q, I, g, E, C, D, i, y);
                        } catch (A) {
                            if (mQ(F), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_viijii: function(A, B, Q, I, g, E, C) {
                        var D = uQ();
                        try {
                            LQ(A, B, Q, I, g, E, C);
                        } catch (A) {
                            if (mQ(D), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    invoke_viji: function(A, B, Q, I, g) {
                        var E = uQ();
                        try {
                            RQ(A, B, Q, I, g);
                        } catch (A) {
                            if (mQ(E), A !== A + 0 && "longjmp" !== A) throw A;
                            EQ(1, 0);
                        }
                    },
                    llvm_eh_typeid_for: function(A) {
                        return A;
                    },
                    memory: R,
                    setTempRet0: function(A) {
                        L = 0 | A;
                    },
                    strftime_l: function(A, B, Q, I) {
                        return function(A, B, Q, I) {
                            function g(A, B, Q) {
                                for(A = "number" == typeof A ? A.toString() : A || ""; A.length < B;)A = Q[0] + A;
                                return A;
                            }
                            function E(A, B) {
                                return g(A, B, "0");
                            }
                            function C(A, B) {
                                function Q(A) {
                                    return 0 > A ? -1 : 0 < A ? 1 : 0;
                                }
                                var I;
                                return 0 === (I = Q(A.getFullYear() - B.getFullYear())) && 0 === (I = Q(A.getMonth() - B.getMonth())) && (I = Q(A.getDate() - B.getDate())), I;
                            }
                            function D(A) {
                                switch(A.getDay()){
                                    case 0:
                                        return new Date(A.getFullYear() - 1, 11, 29);
                                    case 1:
                                        return A;
                                    case 2:
                                        return new Date(A.getFullYear(), 0, 3);
                                    case 3:
                                        return new Date(A.getFullYear(), 0, 2);
                                    case 4:
                                        return new Date(A.getFullYear(), 0, 1);
                                    case 5:
                                        return new Date(A.getFullYear() - 1, 11, 31);
                                    case 6:
                                        return new Date(A.getFullYear() - 1, 11, 30);
                                }
                            }
                            function i(A) {
                                A = WB(new Date(A.C + 1900, 0, 1), A.Ia);
                                var B = new Date(A.getFullYear() + 1, 0, 4), Q = D(new Date(A.getFullYear(), 0, 4));
                                return B = D(B), 0 >= C(Q, A) ? 0 >= C(B, A) ? A.getFullYear() + 1 : A.getFullYear() : A.getFullYear() - 1;
                            }
                            var y = l[I + 40 >> 2];
                            for(var F in I = {
                                uc: l[I >> 2],
                                tc: l[I + 4 >> 2],
                                Ga: l[I + 8 >> 2],
                                sa: l[I + 12 >> 2],
                                fa: l[I + 16 >> 2],
                                C: l[I + 20 >> 2],
                                Ha: l[I + 24 >> 2],
                                Ia: l[I + 28 >> 2],
                                Vc: l[I + 32 >> 2],
                                sc: l[I + 36 >> 2],
                                vc: y ? J(y) : ""
                            }, Q = J(Q), y = {
                                "%c": "%a %b %d %H:%M:%S %Y",
                                "%D": "%m/%d/%y",
                                "%F": "%Y-%m-%d",
                                "%h": "%b",
                                "%r": "%I:%M:%S %p",
                                "%R": "%H:%M",
                                "%T": "%H:%M:%S",
                                "%x": "%m/%d/%y",
                                "%X": "%H:%M:%S",
                                "%Ec": "%c",
                                "%EC": "%C",
                                "%Ex": "%m/%d/%y",
                                "%EX": "%H:%M:%S",
                                "%Ey": "%y",
                                "%EY": "%Y",
                                "%Od": "%d",
                                "%Oe": "%e",
                                "%OH": "%H",
                                "%OI": "%I",
                                "%Om": "%m",
                                "%OM": "%M",
                                "%OS": "%S",
                                "%Ou": "%u",
                                "%OU": "%U",
                                "%OV": "%V",
                                "%Ow": "%w",
                                "%OW": "%W",
                                "%Oy": "%y"
                            })Q = Q.replace(new RegExp(F, "g"), y[F]);
                            var U = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), c = "January February March April May June July August September October November December".split(" ");
                            for(F in y = {
                                "%a": function(A) {
                                    return U[A.Ha].substring(0, 3);
                                },
                                "%A": function(A) {
                                    return U[A.Ha];
                                },
                                "%b": function(A) {
                                    return c[A.fa].substring(0, 3);
                                },
                                "%B": function(A) {
                                    return c[A.fa];
                                },
                                "%C": function(A) {
                                    return E((A.C + 1900) / 100 | 0, 2);
                                },
                                "%d": function(A) {
                                    return E(A.sa, 2);
                                },
                                "%e": function(A) {
                                    return g(A.sa, 2, " ");
                                },
                                "%g": function(A) {
                                    return i(A).toString().substring(2);
                                },
                                "%G": function(A) {
                                    return i(A);
                                },
                                "%H": function(A) {
                                    return E(A.Ga, 2);
                                },
                                "%I": function(A) {
                                    return 0 == (A = A.Ga) ? A = 12 : 12 < A && (A -= 12), E(A, 2);
                                },
                                "%j": function(A) {
                                    return E(A.sa + uB(qB(A.C + 1900) ? OB : mB, A.fa - 1), 3);
                                },
                                "%m": function(A) {
                                    return E(A.fa + 1, 2);
                                },
                                "%M": function(A) {
                                    return E(A.tc, 2);
                                },
                                "%n": function() {
                                    return "\n";
                                },
                                "%p": function(A) {
                                    return 0 <= A.Ga && 12 > A.Ga ? "AM" : "PM";
                                },
                                "%S": function(A) {
                                    return E(A.uc, 2);
                                },
                                "%t": function() {
                                    return "\t";
                                },
                                "%u": function(A) {
                                    return A.Ha || 7;
                                },
                                "%U": function(A) {
                                    var B = new Date(A.C + 1900, 0, 1), Q = 0 === B.getDay() ? B : WB(B, 7 - B.getDay());
                                    return 0 > C(Q, A = new Date(A.C + 1900, A.fa, A.sa)) ? E(Math.ceil((31 - Q.getDate() + (uB(qB(A.getFullYear()) ? OB : mB, A.getMonth() - 1) - 31) + A.getDate()) / 7), 2) : 0 === C(Q, B) ? "01" : "00";
                                },
                                "%V": function(A) {
                                    var B = new Date(A.C + 1901, 0, 4), Q = D(new Date(A.C + 1900, 0, 4));
                                    B = D(B);
                                    var I = WB(new Date(A.C + 1900, 0, 1), A.Ia);
                                    return 0 > C(I, Q) ? "53" : 0 >= C(B, I) ? "01" : E(Math.ceil((Q.getFullYear() < A.C + 1900 ? A.Ia + 32 - Q.getDate() : A.Ia + 1 - Q.getDate()) / 7), 2);
                                },
                                "%w": function(A) {
                                    return A.Ha;
                                },
                                "%W": function(A) {
                                    var B = new Date(A.C, 0, 1), Q = 1 === B.getDay() ? B : WB(B, 0 === B.getDay() ? 1 : 7 - B.getDay() + 1);
                                    return 0 > C(Q, A = new Date(A.C + 1900, A.fa, A.sa)) ? E(Math.ceil((31 - Q.getDate() + (uB(qB(A.getFullYear()) ? OB : mB, A.getMonth() - 1) - 31) + A.getDate()) / 7), 2) : 0 === C(Q, B) ? "01" : "00";
                                },
                                "%y": function(A) {
                                    return (A.C + 1900).toString().substring(2);
                                },
                                "%Y": function(A) {
                                    return A.C + 1900;
                                },
                                "%z": function(A) {
                                    var B = 0 <= (A = A.sc);
                                    return A = Math.abs(A) / 60, (B ? "+" : "-") + String("0000" + (A / 60 * 100 + A % 60)).slice(-4);
                                },
                                "%Z": function(A) {
                                    return A.vc;
                                },
                                "%%": function() {
                                    return "%";
                                }
                            })0 <= Q.indexOf(F) && (Q = Q.replace(new RegExp(F, "g"), y[F](I)));
                            return (F = vB(Q, !1)).length > B ? 0 : (n.set(F, A), F.length - 1);
                        }(A, B, Q, I);
                    },
                    table: h
                }, AQ = function() {
                    function A(A) {
                        B.asm = A.exports, yA();
                    }
                    function Q(B) {
                        A(B.instance);
                    }
                    function I(A) {
                        return (s || !D && !i || "function" != typeof fetch || UA(GA, "file://") ? new Promise(function(A) {
                            A(wA());
                        }) : fetch(GA, {
                            credentials: "same-origin"
                        }).then(function(A) {
                            if (!A.ok) throw "failed to load wasm binary file at '" + GA + "'";
                            return A.arrayBuffer();
                        }).catch(function() {
                            return wA();
                        })).then(function(A) {
                            return WebAssembly.instantiate(A, g);
                        }).then(A, function(A) {
                            Y("failed to asynchronously prepare wasm: " + A), FA(A);
                        });
                    }
                    var g = {
                        env: $B,
                        wasi_snapshot_preview1: $B
                    };
                    if (iA(), B.instantiateWasm) try {
                        return B.instantiateWasm(g, A);
                    } catch (A) {
                        return Y("Module.instantiateWasm callback failed with error: " + A), !1;
                    }
                    return function() {
                        if (s || "function" != typeof WebAssembly.instantiateStreaming || UA(GA, HA) || UA(GA, "file://") || "function" != typeof fetch) return I(Q);
                        fetch(GA, {
                            credentials: "same-origin"
                        }).then(function(A) {
                            return WebAssembly.instantiateStreaming(A, g).then(Q, function(A) {
                                Y("wasm streaming compile failed: " + A), Y("falling back to ArrayBuffer instantiation"), I(Q);
                            });
                        });
                    }(), {};
                }();
                B.asm = AQ;
                var BQ = B.___wasm_call_ctors = function() {
                    return (BQ = B.___wasm_call_ctors = B.asm.__wasm_call_ctors).apply(null, arguments);
                }, QQ = B._malloc = function() {
                    return (QQ = B._malloc = B.asm.malloc).apply(null, arguments);
                }, IQ = B._free = function() {
                    return (IQ = B._free = B.asm.free).apply(null, arguments);
                }, gQ = B.___errno_location = function() {
                    return (gQ = B.___errno_location = B.asm.__errno_location).apply(null, arguments);
                }, EQ = B._setThrew = function() {
                    return (EQ = B._setThrew = B.asm.setThrew).apply(null, arguments);
                }, CQ = B.__ZSt18uncaught_exceptionv = function() {
                    return (CQ = B.__ZSt18uncaught_exceptionv = B.asm._ZSt18uncaught_exceptionv).apply(null, arguments);
                }, DQ = B.___cxa_can_catch = function() {
                    return (DQ = B.___cxa_can_catch = B.asm.__cxa_can_catch).apply(null, arguments);
                }, iQ = B.___cxa_is_pointer_type = function() {
                    return (iQ = B.___cxa_is_pointer_type = B.asm.__cxa_is_pointer_type).apply(null, arguments);
                }, yQ = B.___getTypeName = function() {
                    return (yQ = B.___getTypeName = B.asm.__getTypeName).apply(null, arguments);
                };
                B.___embind_register_native_and_builtin_types = function() {
                    return (B.___embind_register_native_and_builtin_types = B.asm.__embind_register_native_and_builtin_types).apply(null, arguments);
                };
                var FQ = B.dynCall_v = function() {
                    return (FQ = B.dynCall_v = B.asm.dynCall_v).apply(null, arguments);
                }, UQ = B.dynCall_vi = function() {
                    return (UQ = B.dynCall_vi = B.asm.dynCall_vi).apply(null, arguments);
                }, cQ = B.dynCall_vii = function() {
                    return (cQ = B.dynCall_vii = B.asm.dynCall_vii).apply(null, arguments);
                }, NQ = B.dynCall_viii = function() {
                    return (NQ = B.dynCall_viii = B.asm.dynCall_viii).apply(null, arguments);
                }, HQ = B.dynCall_viiii = function() {
                    return (HQ = B.dynCall_viiii = B.asm.dynCall_viiii).apply(null, arguments);
                }, GQ = B.dynCall_viiiii = function() {
                    return (GQ = B.dynCall_viiiii = B.asm.dynCall_viiiii).apply(null, arguments);
                }, oQ = B.dynCall_viiiiiii = function() {
                    return (oQ = B.dynCall_viiiiiii = B.asm.dynCall_viiiiiii).apply(null, arguments);
                }, wQ = B.dynCall_viiiiiiiiii = function() {
                    return (wQ = B.dynCall_viiiiiiiiii = B.asm.dynCall_viiiiiiiiii).apply(null, arguments);
                }, YQ = B.dynCall_viiiiiiiiiiiiiii = function() {
                    return (YQ = B.dynCall_viiiiiiiiiiiiiii = B.asm.dynCall_viiiiiiiiiiiiiii).apply(null, arguments);
                }, sQ = B.dynCall_viiiijji = function() {
                    return (sQ = B.dynCall_viiiijji = B.asm.dynCall_viiiijji).apply(null, arguments);
                }, LQ = B.dynCall_viijii = function() {
                    return (LQ = B.dynCall_viijii = B.asm.dynCall_viijii).apply(null, arguments);
                }, RQ = B.dynCall_viji = function() {
                    return (RQ = B.dynCall_viji = B.asm.dynCall_viji).apply(null, arguments);
                }, hQ = B.dynCall_i = function() {
                    return (hQ = B.dynCall_i = B.asm.dynCall_i).apply(null, arguments);
                }, kQ = B.dynCall_ii = function() {
                    return (kQ = B.dynCall_ii = B.asm.dynCall_ii).apply(null, arguments);
                }, aQ = B.dynCall_iii = function() {
                    return (aQ = B.dynCall_iii = B.asm.dynCall_iii).apply(null, arguments);
                }, SQ = B.dynCall_iiii = function() {
                    return (SQ = B.dynCall_iiii = B.asm.dynCall_iiii).apply(null, arguments);
                }, MQ = B.dynCall_iiiii = function() {
                    return (MQ = B.dynCall_iiiii = B.asm.dynCall_iiiii).apply(null, arguments);
                }, JQ = B.dynCall_iiiiii = function() {
                    return (JQ = B.dynCall_iiiiii = B.asm.dynCall_iiiiii).apply(null, arguments);
                }, VQ = B.dynCall_iiiiiii = function() {
                    return (VQ = B.dynCall_iiiiiii = B.asm.dynCall_iiiiiii).apply(null, arguments);
                }, KQ = B.dynCall_iiiiiiii = function() {
                    return (KQ = B.dynCall_iiiiiiii = B.asm.dynCall_iiiiiiii).apply(null, arguments);
                }, tQ = B.dynCall_iiiiiiiiiii = function() {
                    return (tQ = B.dynCall_iiiiiiiiiii = B.asm.dynCall_iiiiiiiiiii).apply(null, arguments);
                }, nQ = B.dynCall_iiiiiiiiiiii = function() {
                    return (nQ = B.dynCall_iiiiiiiiiiii = B.asm.dynCall_iiiiiiiiiiii).apply(null, arguments);
                }, dQ = B.dynCall_iiiiiiiiiiiii = function() {
                    return (dQ = B.dynCall_iiiiiiiiiiiii = B.asm.dynCall_iiiiiiiiiiiii).apply(null, arguments);
                }, rQ = B.dynCall_iiiiij = function() {
                    return (rQ = B.dynCall_iiiiij = B.asm.dynCall_iiiiij).apply(null, arguments);
                }, eQ = B.dynCall_iiiiid = function() {
                    return (eQ = B.dynCall_iiiiid = B.asm.dynCall_iiiiid).apply(null, arguments);
                }, lQ = B.dynCall_iiijiiiiii = function() {
                    return (lQ = B.dynCall_iiijiiiiii = B.asm.dynCall_iiijiiiiii).apply(null, arguments);
                }, xQ = B.dynCall_iij = function() {
                    return (xQ = B.dynCall_iij = B.asm.dynCall_iij).apply(null, arguments);
                }, ZQ = B.dynCall_iif = function() {
                    return (ZQ = B.dynCall_iif = B.asm.dynCall_iif).apply(null, arguments);
                }, fQ = B.dynCall_jii = function() {
                    return (fQ = B.dynCall_jii = B.asm.dynCall_jii).apply(null, arguments);
                }, bQ = B.dynCall_jiiii = function() {
                    return (bQ = B.dynCall_jiiii = B.asm.dynCall_jiiii).apply(null, arguments);
                }, pQ = B.dynCall_fiii = function() {
                    return (pQ = B.dynCall_fiii = B.asm.dynCall_fiii).apply(null, arguments);
                }, qQ = B.dynCall_diii = function() {
                    return (qQ = B.dynCall_diii = B.asm.dynCall_diii).apply(null, arguments);
                }, uQ = B.stackSave = function() {
                    return (uQ = B.stackSave = B.asm.stackSave).apply(null, arguments);
                };
                B.stackAlloc = function() {
                    return (B.stackAlloc = B.asm.stackAlloc).apply(null, arguments);
                };
                var OQ, mQ = B.stackRestore = function() {
                    return (mQ = B.stackRestore = B.asm.stackRestore).apply(null, arguments);
                };
                function WQ() {
                    function A() {
                        if (!OQ && (OQ = !0, B.calledRun = !0, !k)) {
                            if (B.noFSInit || fA.ka.Qa || fA.ka(), z(T), fA.ub = !1, z(P), B.onRuntimeInitialized && B.onRuntimeInitialized(), B.postRun) for("function" == typeof B.postRun && (B.postRun = [
                                B.postRun
                            ]); B.postRun.length;){
                                var A = B.postRun.shift();
                                $.unshift(A);
                            }
                            z($);
                        }
                    }
                    if (!(0 < EA)) {
                        if (B.preRun) for("function" == typeof B.preRun && (B.preRun = [
                            B.preRun
                        ]); B.preRun.length;)AA();
                        z(v), 0 < EA || (B.setStatus ? (B.setStatus("Running..."), setTimeout(function() {
                            setTimeout(function() {
                                B.setStatus("");
                            }, 1), A();
                        }, 1)) : A());
                    }
                }
                if (B.__growWasmMemory = function() {
                    return (B.__growWasmMemory = B.asm.__growWasmMemory).apply(null, arguments);
                }, B.dynCall_iiijij = function() {
                    return (B.dynCall_iiijij = B.asm.dynCall_iiijij).apply(null, arguments);
                }, B.dynCall_jiji = function() {
                    return (B.dynCall_jiji = B.asm.dynCall_jiji).apply(null, arguments);
                }, B.dynCall_iidiiii = function() {
                    return (B.dynCall_iidiiii = B.asm.dynCall_iidiiii).apply(null, arguments);
                }, B.dynCall_iiiiiiiii = function() {
                    return (B.dynCall_iiiiiiiii = B.asm.dynCall_iiiiiiiii).apply(null, arguments);
                }, B.dynCall_iiiiijj = function() {
                    return (B.dynCall_iiiiijj = B.asm.dynCall_iiiiijj).apply(null, arguments);
                }, B.dynCall_iiiiiijj = function() {
                    return (B.dynCall_iiiiiijj = B.asm.dynCall_iiiiiijj).apply(null, arguments);
                }, B.dynCall_viiiiii = function() {
                    return (B.dynCall_viiiiii = B.asm.dynCall_viiiiii).apply(null, arguments);
                }, B.asm = AQ, B.FS = fA, B.then = function(A) {
                    if (OQ) A(B);
                    else {
                        var Q = B.onRuntimeInitialized;
                        B.onRuntimeInitialized = function() {
                            Q && Q(), A(B);
                        };
                    }
                    return B;
                }, DA = function A() {
                    OQ || WQ(), OQ || (DA = A);
                }, B.run = WQ, B.preInit) for("function" == typeof B.preInit && (B.preInit = [
                    B.preInit
                ]); 0 < B.preInit.length;)B.preInit.pop()();
                return WQ(), A;
            });
            A.exports = E;
        }).call(this, "/index.js", "/");
    },
    function(A, B, Q) {
        Q.r(B), Q.d(B, "createH264MP4Encoder", function() {
            return D;
        });
        var I = Q(1), g = function(A, B, Q, I) {
            return new (Q || (Q = Promise))(function(g, E) {
                function C(A) {
                    try {
                        i(I.next(A));
                    } catch (A) {
                        E(A);
                    }
                }
                function D(A) {
                    try {
                        i(I.throw(A));
                    } catch (A) {
                        E(A);
                    }
                }
                function i(A) {
                    var B;
                    A.done ? g(A.value) : (B = A.value, B instanceof Q ? B : new Q(function(A) {
                        A(B);
                    })).then(C, D);
                }
                i((I = I.apply(A, [])).next());
            });
        };
        const E = Q.n(I)()(), C = new Promise((A)=>{
            E.then(()=>{
                A();
            });
        }), D = ()=>g(void 0, void 0, void 0, function*() {
                yield C;
                const A = new E.H264MP4Encoder;
                return A.FS = E.FS, A;
            });
    },
    function(A, B) {
        A.exports = require$$1;
    },
    function(A, B) {
        A.exports = require$$0$1;
    }
]);

var HME = /*@__PURE__*/ getDefaultExportFromCjs(h264Mp4Encoder_node);

/**
 * @typedef {object} H264MP4EncoderOptions
 * @property {boolean} [debug]
 * @property {H264MP4EncoderEncoderOptions} [encoderOptions={}]
 */ /**
 * @typedef {import("h264-mp4-encoder").H264MP4Encoder} H264MP4EncoderEncoderOptions
 * @see [h264-mp4-encoder#api]{@link https://github.com/TrevorSundberg/h264-mp4-encoder#api}
 */ class H264MP4Encoder extends Encoder$1 {
    static #_ = this.supportedExtensions = [
        "mp4"
    ];
    static #_2 = this.defaultOptions = {
        extension: H264MP4Encoder.supportedExtensions[0],
        frameMethod: "imageData"
    };
    /**
   * @param {H264MP4EncoderOptions} [options]
   */ constructor(options){
        super({
            ...H264MP4Encoder.defaultOptions,
            ...options
        });
    }
    async init(options) {
        super.init(options);
        this.encoder = await HME.createH264MP4Encoder();
        Object.assign(this.encoder, {
            // outputFilename:"output.mp4"
            width: nextMultiple(this.width, 2),
            height: nextMultiple(this.height, 2),
            frameRate: this.frameRate,
            kbps: estimateBitRate(this.width, this.height, this.frameRate) / 1000,
            // speed: 0, // Speed where 0 means best quality and 10 means fastest speed [0..10].
            // quantizationParameter: 33, // Higher means better compression, and lower means better quality [10..51].
            // groupOfPictures: 20, // How often a keyframe occurs (key frame period, also known as GOP).
            // temporalDenoise: false, // Use temporal noise supression.
            // desiredNaluBytes: 0, // Each NAL unit will be approximately capped at this size (0 means unlimited).
            debug: this.debug,
            ...this.encoderOptions
        });
        this.encoder.initialize();
    }
    async start() {
        await super.start();
        this.step();
    }
    encode(frame) {
        // TODO: addFrameYuv
        this.encoder.addFrameRgba(frame);
    }
    stop() {
        this.encoder.finalize();
        return this.encoder.FS.readFile(this.encoder.outputFilename);
    }
    dispose() {
        this.encoder.delete();
        this.encoder = null;
    }
}
var H264MP4Encoder$1 = H264MP4Encoder;

var X = {
    signature: "GIF",
    version: "89a",
    trailer: 59,
    extensionIntroducer: 33,
    applicationExtensionLabel: 255,
    graphicControlExtensionLabel: 249,
    imageSeparator: 44,
    signatureSize: 3,
    versionSize: 3,
    globalColorTableFlagMask: 128,
    colorResolutionMask: 112,
    sortFlagMask: 8,
    globalColorTableSizeMask: 7,
    applicationIdentifierSize: 8,
    applicationAuthCodeSize: 3,
    disposalMethodMask: 28,
    userInputFlagMask: 2,
    transparentColorFlagMask: 1,
    localColorTableFlagMask: 128,
    interlaceFlagMask: 64,
    idSortFlagMask: 32,
    localColorTableSizeMask: 7
};
function F(t) {
    if (t === void 0) t = 256;
    let e = 0, s = new Uint8Array(t);
    return {
        get buffer () {
            return s.buffer;
        },
        reset () {
            e = 0;
        },
        bytesView () {
            return s.subarray(0, e);
        },
        bytes () {
            return s.slice(0, e);
        },
        writeByte (r) {
            n(e + 1), s[e] = r, e++;
        },
        writeBytes (r, o, i) {
            if (o === void 0) o = 0;
            if (i === void 0) i = r.length;
            n(e + i);
            for(let c = 0; c < i; c++)s[e++] = r[c + o];
        },
        writeBytesView (r, o, i) {
            if (o === void 0) o = 0;
            if (i === void 0) i = r.byteLength;
            n(e + i), s.set(r.subarray(o, o + i), e), e += i;
        }
    };
    function n(r) {
        var o = s.length;
        if (o >= r) return;
        var i = 1024 * 1024;
        r = Math.max(r, o * (o < i ? 2 : 1.125) >>> 0), o != 0 && (r = Math.max(r, 256));
        let c = s;
        s = new Uint8Array(r), e > 0 && s.set(c.subarray(0, e), 0);
    }
}
var O = 12, J = 5003, lt = [
    0,
    1,
    3,
    7,
    15,
    31,
    63,
    127,
    255,
    511,
    1023,
    2047,
    4095,
    8191,
    16383,
    32767,
    65535
];
function at(t, e, s, n, r, o, i, c) {
    if (r === void 0) r = F(512);
    if (o === void 0) o = new Uint8Array(256);
    if (i === void 0) i = new Int32Array(J);
    if (c === void 0) c = new Int32Array(J);
    let x = i.length, a = Math.max(2, n);
    o.fill(0), c.fill(0), i.fill(-1);
    let l = 0, f = 0, g = a + 1, h = g, b = !1, w = h, _ = (1 << w) - 1, u = 1 << g - 1, k = u + 1, B = u + 2, p = 0, A = s[0], z = 0;
    for(let y = x; y < 65536; y *= 2)++z;
    z = 8 - z, r.writeByte(a), I(u);
    let d = s.length;
    for(let y = 1; y < d; y++){
        t: {
            let m = s[y], v = (m << O) + A, M = m << z ^ A;
            if (i[M] === v) {
                A = c[M];
                break t;
            }
            let V = M === 0 ? 1 : x - M;
            for(; i[M] >= 0;)if (M -= V, M < 0 && (M += x), i[M] === v) {
                A = c[M];
                break t;
            }
            I(A), A = m, B < 1 << O ? (c[M] = B++, i[M] = v) : (i.fill(-1), B = u + 2, b = !0, I(u));
        }
    }
    return I(A), I(k), r.writeByte(0), r.bytesView();
    function I(y) {
        for(l &= lt[f], f > 0 ? l |= y << f : l = y, f += w; f >= 8;)o[p++] = l & 255, p >= 254 && (r.writeByte(p), r.writeBytesView(o, 0, p), p = 0), l >>= 8, f -= 8;
        if ((B > _ || b) && (b ? (w = h, _ = (1 << w) - 1, b = !1) : (++w, _ = w === O ? 1 << w : (1 << w) - 1)), y == k) {
            for(; f > 0;)o[p++] = l & 255, p >= 254 && (r.writeByte(p), r.writeBytesView(o, 0, p), p = 0), l >>= 8, f -= 8;
            p > 0 && (r.writeByte(p), r.writeBytesView(o, 0, p), p = 0);
        }
    }
}
var $ = at;
function D(t, e, s) {
    return t << 8 & 63488 | e << 2 & 992 | s >> 3;
}
function G(t, e, s, n) {
    return t >> 4 | e & 240 | (s & 240) << 4 | (n & 240) << 8;
}
function j(t, e, s) {
    return t >> 4 << 8 | e & 240 | s >> 4;
}
function R(t, e, s) {
    return t < e ? e : t > s ? s : t;
}
function T(t) {
    return t * t;
}
function tt(t, e, s) {
    var n = 0, r = 1e100;
    let o = t[e], i = o.cnt; o.ac; let x = o.rc, a = o.gc, l = o.bc;
    for(var f = o.fw; f != 0; f = t[f].fw){
        let h = t[f], b = h.cnt, w = i * b / (i + b);
        if (!(w >= r)) {
            var g = 0;
            (g += w * T(h.rc - x), !(g >= r) && (g += w * T(h.gc - a), !(g >= r) && (g += w * T(h.bc - l), !(g >= r) && (r = g, n = f))));
        }
    }
    o.err = r, o.nn = n;
}
function Q() {
    return {
        ac: 0,
        rc: 0,
        gc: 0,
        bc: 0,
        cnt: 0,
        nn: 0,
        fw: 0,
        bk: 0,
        tm: 0,
        mtm: 0,
        err: 0
    };
}
function ut(t, e) {
    let s = e === "rgb444" ? 4096 : 65536, n = new Array(s), r = t.length;
    if (e === "rgba4444") for(let o = 0; o < r; ++o){
        let i = t[o], c = i >> 24 & 255, x = i >> 16 & 255, a = i >> 8 & 255, l = i & 255, f = G(l, a, x, c), g = f in n ? n[f] : n[f] = Q();
        g.rc += l, g.gc += a, g.bc += x, g.ac += c, g.cnt++;
    }
    else if (e === "rgb444") for(let o = 0; o < r; ++o){
        let i = t[o], c = i >> 16 & 255, x = i >> 8 & 255, a = i & 255, l = j(a, x, c), f = l in n ? n[l] : n[l] = Q();
        f.rc += a, f.gc += x, f.bc += c, f.cnt++;
    }
    else for(let o = 0; o < r; ++o){
        let i = t[o], c = i >> 16 & 255, x = i >> 8 & 255, a = i & 255, l = D(a, x, c), f = l in n ? n[l] : n[l] = Q();
        f.rc += a, f.gc += x, f.bc += c, f.cnt++;
    }
    return n;
}
function H(t, e, s) {
    if (s === void 0) s = {};
    let { format: n = "rgb565", clearAlpha: r = !0, clearAlphaColor: o = 0, clearAlphaThreshold: i = 0, oneBitAlpha: c = !1 } = s;
    if (!t || !t.buffer) throw new Error("quantize() expected RGBA Uint8Array data");
    if (!(t instanceof Uint8Array) && !(t instanceof Uint8ClampedArray)) throw new Error("quantize() expected RGBA Uint8Array data");
    let x = new Uint32Array(t.buffer), a = s.useSqrt !== !1, l = n === "rgba4444", f = ut(x, n), g = f.length, h = g - 1, b = new Uint32Array(g + 1);
    for(var w = 0, u = 0; u < g; ++u){
        let C = f[u];
        if (C != null) {
            var _ = 1 / C.cnt;
            l && (C.ac *= _), C.rc *= _, C.gc *= _, C.bc *= _, f[w++] = C;
        }
    }
    T(e) / w < .022 && (a = !1);
    for(var u = 0; u < w - 1; ++u)f[u].fw = u + 1, f[u + 1].bk = u, a && (f[u].cnt = Math.sqrt(f[u].cnt));
    a && (f[u].cnt = Math.sqrt(f[u].cnt));
    var k, B, p;
    for(u = 0; u < w; ++u){
        tt(f, u);
        var A = f[u].err;
        for(B = ++b[0]; B > 1 && (p = B >> 1, !(f[k = b[p]].err <= A)); B = p)b[B] = k;
        b[B] = u;
    }
    var z = w - e;
    for(u = 0; u < z;){
        for(var d;;){
            var I = b[1];
            if (d = f[I], d.tm >= d.mtm && f[d.nn].mtm <= d.tm) break;
            d.mtm == h ? I = b[1] = b[b[0]--] : (tt(f, I), d.tm = u);
            var A = f[I].err;
            for(B = 1; (p = B + B) <= b[0] && (p < b[0] && f[b[p]].err > f[b[p + 1]].err && p++, !(A <= f[k = b[p]].err)); B = p)b[B] = k;
            b[B] = I;
        }
        var y = f[d.nn], m = d.cnt, v = y.cnt, _ = 1 / (m + v);
        l && (d.ac = _ * (m * d.ac + v * y.ac)), d.rc = _ * (m * d.rc + v * y.rc), d.gc = _ * (m * d.gc + v * y.gc), d.bc = _ * (m * d.bc + v * y.bc), d.cnt += y.cnt, d.mtm = ++u, f[y.bk].fw = y.fw, f[y.fw].bk = y.bk, y.mtm = h;
    }
    let M = [];
    var V = 0;
    for(u = 0;; ++V){
        let L = R(Math.round(f[u].rc), 0, 255), C = R(Math.round(f[u].gc), 0, 255), Y = R(Math.round(f[u].bc), 0, 255), E = 255;
        if (l) {
            if (E = R(Math.round(f[u].ac), 0, 255), c) {
                let st = typeof c == "number" ? c : 127;
                E = E <= st ? 0 : 255;
            }
            r && E <= i && (L = C = Y = o, E = 0);
        }
        let K = l ? [
            L,
            C,
            Y,
            E
        ] : [
            L,
            C,
            Y
        ];
        if (xt(M, K) || M.push(K), (u = f[u].fw) == 0) break;
    }
    return M;
}
function xt(t, e) {
    for(let s = 0; s < t.length; s++){
        let n = t[s], r = n[0] === e[0] && n[1] === e[1] && n[2] === e[2], o = n.length >= 4 && e.length >= 4 ? n[3] === e[3] : !0;
        if (r && o) return !0;
    }
    return !1;
}
function nt(t, e, s) {
    if (s === void 0) s = "rgb565";
    if (!t || !t.buffer) throw new Error("quantize() expected RGBA Uint8Array data");
    if (!(t instanceof Uint8Array) && !(t instanceof Uint8ClampedArray)) throw new Error("quantize() expected RGBA Uint8Array data");
    if (e.length > 256) throw new Error("applyPalette() only works with 256 colors or less");
    let n = new Uint32Array(t.buffer), r = n.length, o = s === "rgb444" ? 4096 : 65536, i = new Uint8Array(r), c = new Array(o);
    if (s === "rgba4444") for(let a = 0; a < r; a++){
        let l = n[a], f = l >> 24 & 255, g = l >> 16 & 255, h = l >> 8 & 255, b = l & 255, w = G(b, h, g, f), _ = w in c ? c[w] : c[w] = gt(b, h, g, f, e);
        i[a] = _;
    }
    else {
        let a = s === "rgb444" ? j : D;
        for(let l = 0; l < r; l++){
            let f = n[l], g = f >> 16 & 255, h = f >> 8 & 255, b = f & 255, w = a(b, h, g), _ = w in c ? c[w] : c[w] = bt(b, h, g, e);
            i[l] = _;
        }
    }
    return i;
}
function gt(t, e, s, n, r) {
    let o = 0, i = 1e100;
    for(let c = 0; c < r.length; c++){
        let x = r[c], a = x[3], l = q(a - n);
        if (l > i) continue;
        let f = x[0];
        if (l += q(f - t), l > i) continue;
        let g = x[1];
        if (l += q(g - e), l > i) continue;
        let h = x[2];
        l += q(h - s), !(l > i) && (i = l, o = c);
    }
    return o;
}
function bt(t, e, s, n) {
    let r = 0, o = 1e100;
    for(let i = 0; i < n.length; i++){
        let c = n[i], x = c[0], a = q(x - t);
        if (a > o) continue;
        let l = c[1];
        if (a += q(l - e), a > o) continue;
        let f = c[2];
        a += q(f - s), !(a > o) && (o = a, r = i);
    }
    return r;
}
function q(t) {
    return t * t;
}
function ct(t) {
    if (t === void 0) t = {};
    let { initialCapacity: e = 4096, auto: s = !0 } = t, n = F(e), r = 5003, o = new Uint8Array(256), i = new Int32Array(r), c = new Int32Array(r), x = !1;
    return {
        reset () {
            n.reset(), x = !1;
        },
        finish () {
            n.writeByte(X.trailer);
        },
        bytes () {
            return n.bytes();
        },
        bytesView () {
            return n.bytesView();
        },
        get buffer () {
            return n.buffer;
        },
        get stream () {
            return n;
        },
        writeHeader: a,
        writeFrame (l, f, g, h) {
            if (h === void 0) h = {};
            let { transparent: b = !1, transparentIndex: w = 0, delay: _ = 0, palette: u = null, repeat: k = 0, colorDepth: B = 8, dispose: p = -1 } = h, A = !1;
            if (s ? x || (A = !0, a(), x = !0) : A = Boolean(h.first), f = Math.max(0, Math.floor(f)), g = Math.max(0, Math.floor(g)), A) {
                if (!u) throw new Error("First frame must include a { palette } option");
                pt(n, f, g, u, B), it(n, u), k >= 0 && dt(n, k);
            }
            let z = Math.round(_ / 10);
            wt(n, p, z, b, w);
            let d = Boolean(u) && !A;
            ht(n, f, g, d ? u : null), d && it(n, u), yt(n, l, f, g, B, o, i, c);
        }
    };
    function a() {
        ft(n, "GIF89a");
    }
}
function wt(t, e, s, n, r) {
    t.writeByte(33), t.writeByte(249), t.writeByte(4), r < 0 && (r = 0, n = !1);
    var o, i;
    n ? (o = 1, i = 2) : (o = 0, i = 0), e >= 0 && (i = e & 7), i <<= 2;
    let c = 0;
    t.writeByte(0 | i | c | o), S(t, s), t.writeByte(r || 0), t.writeByte(0);
}
function pt(t, e, s, n, r) {
    if (r === void 0) r = 8;
    let o = 1, i = 0, c = Z(n.length) - 1, x = o << 7 | r - 1 << 4 | i << 3 | c, a = 0, l = 0;
    S(t, e), S(t, s), t.writeBytes([
        x,
        a,
        l
    ]);
}
function dt(t, e) {
    t.writeByte(33), t.writeByte(255), t.writeByte(11), ft(t, "NETSCAPE2.0"), t.writeByte(3), t.writeByte(1), S(t, e), t.writeByte(0);
}
function it(t, e) {
    let s = 1 << Z(e.length);
    for(let n = 0; n < s; n++){
        let r = [
            0,
            0,
            0
        ];
        n < e.length && (r = e[n]), t.writeByte(r[0]), t.writeByte(r[1]), t.writeByte(r[2]);
    }
}
function ht(t, e, s, n) {
    if (t.writeByte(44), S(t, 0), S(t, 0), S(t, e), S(t, s), n) {
        let r = 0, o = 0, i = Z(n.length) - 1;
        t.writeByte(128 | r | o | 0 | i);
    } else t.writeByte(0);
}
function yt(t, e, s, n, r, o, i, c) {
    if (r === void 0) r = 8;
    $(s, n, e, r, t, o, i, c);
}
function S(t, e) {
    t.writeByte(e & 255), t.writeByte(e >> 8 & 255);
}
function ft(t, e) {
    for(var s = 0; s < e.length; s++)t.writeByte(e.charCodeAt(s));
}
function Z(t) {
    return Math.max(Math.ceil(Math.log2(t)), 1);
}

/**
 * @typedef {object} GIFEncoderOptions
 * @property {number} [maxColors=256]
 * @property {GIFEncoderQuantizeOptions} [quantizeOptions]
 * @property {GIFEncoderEncoderOptions} [encoderOptions={}]
 */ /**
 * @typedef {object} GIFEncoderQuantizeOptions
 * @property {"rgb565" | "rgb444" | "rgba4444"} [format="rgb565"]
 * @property {boolean | number} [oneBitAlpha=false]
 * @property {boolean} [clearAlpha=true]
 * @property {number} [clearAlphaThreshold=0]
 * @property {number} [clearAlphaColor=0x00]
 * @see [QuantizeOptions]{@link https://github.com/mattdesl/gifenc#palette--quantizergba-maxcolors-options--}
 */ /**
 * @typedef {object} GIFEncoderEncoderOptions
 * @property {number[][]} [palette]
 * @property {boolean} [first=false]
 * @property {boolean} [transparent=0]
 * @property {number} [transparentIndex=0]
 * @property {number} [delay=0]
 * @property {number} [repeat=0]
 * @property {number} [dispose=-1]
 * @see [WriteFrameOpts]{@link https://github.com/mattdesl/gifenc#gifwriteframeindex-width-height-opts--}
 */ class GIFEncoder extends Encoder$1 {
    static #_ = this.supportedExtensions = [
        "gif"
    ];
    static #_2 = this.defaultOptions = {
        extension: GIFEncoder.supportedExtensions[0],
        frameMethod: "imageData",
        maxColors: 256,
        quantizeOptions: {
            format: "rgb565",
            oneBitAlpha: false,
            clearAlpha: true,
            clearAlphaThreshold: 0,
            clearAlphaColor: 0x00
        }
    };
    /**
   * @param {GIFEncoderOptions} [options]
   */ constructor(options){
        super({
            ...GIFEncoder.defaultOptions,
            ...options
        });
    }
    async init(options) {
        super.init(options);
        this.encoder = ct();
    }
    async start() {
        await super.start();
        this.step();
    }
    encode(frame) {
        const palette = H(frame, this.maxColors, this.quantizeOptions);
        const index = nt(frame, palette, this.quantizeOptions.format);
        this.encoder.writeFrame(index, this.width, this.height, {
            palette,
            delay: 1 / this.frameRate * 1000,
            ...this.encoderOptions
        });
    }
    stop() {
        this.encoder.finish();
        const data = this.encoder.bytes();
        this.encoder.reset();
        return data;
    }
    dispose() {
        this.encoder = null;
    }
}
var GIFEncoder$1 = GIFEncoder;

/** @class */ class FrameEncoder extends Encoder$1 {
    static #_ = this.supportedExtensions = [
        "png",
        "jpg"
    ];
    static #_2 = this.supportedTargets = [
        "in-browser",
        "file-system"
    ];
    static #_3 = this.defaultOptions = {
        extension: FrameEncoder.supportedExtensions[0],
        frameMethod: "blob"
    };
    constructor(options){
        super({
            ...FrameEncoder.defaultOptions,
            ...options
        });
    }
    async init(options) {
        super.init(options);
        if (this.target === "file-system") {
            this.directory ||= await this.getDirectory();
            this.directoryHandle = await this.getDirectoryHandle(this.directory, this.filename);
        }
    }
    async writeFile(frameFileName, blob) {
        try {
            if (this.directoryHandle) {
                const fileHandle = await this.getFileHandle(frameFileName);
                const writable = await this.getWritableFileStream(fileHandle);
                await writable.write(blob);
                await writable.close();
            } else {
                downloadBlob(frameFileName, [
                    blob
                ], this.mimeType);
                // Ugh. Required otherwise frames are skipped
                await new Promise((r)=>setTimeout(r, 100));
            }
        } catch (error) {
            console.error(error);
        }
    }
    async encode(frame, frameNumber) {
        await this.writeFile(`${`${frameNumber}`.padStart(5, "0")}.${this.extension}`, frame);
    }
}
var FrameEncoder$1 = FrameEncoder;

/**
 * Enum for recorder status
 * @readonly
 * @enum {number}
 *
 * @example
 * ```js
 * // Check recorder status before continuing
 * if (canvasRecorder.status !== RecorderStatus.Stopped) {
 *   rAFId = requestAnimationFrame(() => tick());
 * }
 * ```
 */ const RecorderStatus = Object.freeze({
    Ready: 0,
    Initializing: 1,
    Recording: 2,
    Stopping: 3,
    Stopped: 4
});
/**
 * A callback to notify on the status change. To compare with RecorderStatus enum values.
 * @callback onStatusChangeCb
 * @param {number} RecorderStatus the status
 */ /**
 * @typedef {object} RecorderOptions Options for recording. All optional.
 * @property {string} [name=""] A name for the recorder, used as prefix for the default file name.
 * @property {number} [duration=10] The recording duration in seconds. If set to Infinity, `await canvasRecorder.stop()` needs to be called manually.
 * @property {number} [frameRate=30] The frame rate in frame per seconds. Use `await canvasRecorder.step();` to go to the next frame.
 * @property {boolean} [download=true] Automatically download the recording when duration is reached or when `await canvasRecorder.stop()` is manually called.
 * @property {string} [extension="mp4"] Default file extension: infers which Encoder is selected.
 * @property {string} [target="in-browser"] Default writing target: in-browser or file-system when available.
 * @property {object} [encoder] A specific encoder. Default encoder based on options.extension: GIF > WebCodecs > H264MP4.
 * @property {object} [encoderOptions] See `src/encoders` or individual packages for a list of options.
 * @property {object} [muxerOptions] See "mp4-muxer" and "webm-muxer" for a list of options.
 * @property {onStatusChangeCb} [onStatusChange]
 */ /**
 * @typedef {object} RecorderStartOptions Options for recording initialisation. All optional.
 * @property {string} [filename] Overwrite the file name completely.
 * @property {boolean} [initOnly] Only initialised the recorder and don't call the first await recorder.step().
 */ class Recorder {
    static #_ = /**
   * Sensible defaults for recording so that the recorder "just works".
   * @type {RecorderOptions}
   */ this.defaultOptions = {
        name: "",
        duration: 10,
        frameRate: 30,
        download: true,
        extension: "mp4",
        target: "in-browser",
        onStatusChange: ()=>{}
    };
    static #_2 = /**
   * A mapping of extension to their mime types
   * @type {object}
   */ this.mimeTypes = {
        mkv: "video/x-matroska;codecs=avc1",
        webm: "video/webm",
        mp4: "video/mp4",
        gif: "image/gif"
    };
    set width(value) {
        this.encoder.width = value;
    }
    set height(value) {
        this.encoder.height = value;
    }
    // TODO: allow overwrite
    get width() {
        return this.context.drawingBufferWidth || this.context.canvas.width;
    }
    get height() {
        return this.context.drawingBufferHeight || this.context.canvas.height;
    }
    get stats() {
        if (this.status !== RecorderStatus.Recording) return undefined;
        const renderTime = (Date.now() - this.startTime.getTime()) / 1000;
        const secondsPerFrame = renderTime / this.frame;
        return {
            renderTime,
            secondsPerFrame,
            detail: `Time: ${this.time.toFixed(2)} / ${this.duration.toFixed(2)}
Frame: ${this.frame} / ${this.frameTotal}
Elapsed Time: ${formatSeconds(renderTime)}
Remaining Time: ${formatSeconds(secondsPerFrame * this.frameTotal - renderTime)}
Speedup: x${(this.time / renderTime).toFixed(3)}`
        };
    }
    #updateStatus(status) {
        this.status = status;
        this.onStatusChange(this.status);
    }
    getParamString() {
        return `${this.width}x${this.height}@${this.frameRate}fps`;
    }
    getDefaultFileName(extension) {
        return `${[
            this.name,
            formatDate(this.startTime),
            this.getParamString()
        ].filter(Boolean).join("-")}.${extension}`;
    }
    getSupportedExtension() {
        const CurrentEncoder = this.encoder.constructor;
        const isExtensionSupported = CurrentEncoder.supportedExtensions.includes(this.extension);
        const extension = isExtensionSupported ? this.extension : CurrentEncoder.supportedExtensions[0];
        if (!isExtensionSupported) {
            console.warn(`canvas-record: unsupported extension for encoder "${CurrentEncoder.name}". Defaulting to "${extension}".`);
        }
        return extension;
    }
    getSupportedTarget() {
        const CurrentEncoder = this.encoder.constructor;
        let isTargetSupported = CurrentEncoder.supportedTargets.includes(this.target);
        if (this.target === "file-system" && !("showSaveFilePicker" in window)) {
            isTargetSupported = false;
        }
        const target = isTargetSupported ? this.target : CurrentEncoder.supportedTargets[0];
        if (!isTargetSupported) {
            console.warn(`canvas-record: unsupported target for encoder "${CurrentEncoder.name}". Defaulting to "${target}".`);
        }
        return target;
    }
    /**
   * Create a Recorder instance
   * @class Recorder
   * @param {RenderingContext} context
   * @param {RecorderOptions} [options={}]
   */ constructor(context, options = {}){
        this.context = context;
        const opts = {
            ...Recorder.defaultOptions,
            ...options
        };
        Object.assign(this, opts);
        if (!this.encoder) {
            if (this.extension === "gif") {
                this.encoder = new GIFEncoder$1(opts);
            } else if ([
                "png",
                "jpg"
            ].includes(this.extension)) {
                this.encoder = new FrameEncoder$1(opts);
            } else {
                this.encoder = isWebCodecsSupported ? new WebCodecsEncoder$1(opts) : new H264MP4Encoder$1(opts);
            }
        }
        this.#updateStatus(RecorderStatus.Ready);
    }
    /**
   * Sets up the recorder internals and the encoder depending on supported features.
   * @private
   */ async init(param) {
        let { filename } = param === void 0 ? {} : param;
        this.#updateStatus(RecorderStatus.Initializing);
        this.deltaTime = 1 / this.frameRate;
        this.time = 0;
        this.frame = 0;
        this.frameTotal = this.duration * this.frameRate;
        const extension = this.getSupportedExtension();
        const target = this.getSupportedTarget();
        this.startTime = new Date();
        this.filename = filename || this.getDefaultFileName(extension);
        await this.encoder.init({
            encoderOptions: this.encoderOptions,
            muxerOptions: this.muxerOptions,
            canvas: this.context.canvas,
            width: this.width,
            height: this.height,
            frameRate: this.frameRate,
            extension,
            target,
            mimeType: Recorder.mimeTypes[extension],
            filename: this.filename,
            debug: this.debug
        });
        this.#updateStatus(RecorderStatus.Initialized);
    }
    /**
   * Start the recording by initializing and optionally calling the initial step.
   * @param {RecorderStartOptions} [startOptions={}]
   */ async start(startOptions) {
        if (startOptions === void 0) startOptions = {};
        await this.init(startOptions);
        // Ensure initializing worked
        if (this.status !== RecorderStatus.Initialized) {
            console.debug("canvas-record: recorder not initialized.");
            return;
        }
        this.#updateStatus(RecorderStatus.Recording);
        if (!startOptions.initOnly) await this.step();
    }
    /**
   * Convert the context into something encodable (bitmap, blob, buffer...)
   * @private
   */ async getFrame(frameMethod) {
        switch(frameMethod){
            case "bitmap":
                {
                    return await createImageBitmap(this.context.canvas);
                }
            case "videoFrame":
                {
                    return new VideoFrame(this.context.canvas, {
                        timestamp: this.time * 1000000
                    });
                }
            case "requestFrame":
                {
                    return undefined;
                }
            case "imageData":
                {
                    if (this.context.drawingBufferWidth) {
                        const width = this.context.drawingBufferWidth;
                        const height = this.context.drawingBufferHeight;
                        const length = width * height * 4;
                        const pixels = new Uint8Array(length);
                        const pixelsFlipped = new Uint8Array(length);
                        this.context.readPixels(0, 0, width, height, this.context.RGBA, this.context.UNSIGNED_BYTE, pixels);
                        // Flip vertically
                        const row = width * 4;
                        const end = (height - 1) * row;
                        for(let i = 0; i < length; i += row){
                            pixelsFlipped.set(pixels.subarray(i, i + row), end - i);
                        }
                        return pixelsFlipped;
                    }
                    return this.context.getImageData(0, 0, nextMultiple(this.width, 2), nextMultiple(this.height, 2)).data;
                }
            default:
                {
                    return await canvasScreenshot(this.context.canvas, {
                        useBlob: true,
                        download: false,
                        filename: `output.${this.encoder.extension}`
                    });
                }
        }
    }
    /**
   * Encode a frame and increment the time and the playhead.
   * Calls `await canvasRecorder.stop()` when duration is reached.
   */ async step() {
        if (this.status === RecorderStatus.Recording && this.frame < this.frameTotal) {
            await this.encoder.encode(await this.getFrame(this.encoder.frameMethod), this.frame);
            this.time += this.deltaTime;
            this.frame++;
        } else {
            await this.stop();
        }
    }
    /**
   * Stop the recording and return the recorded buffer.
   * If options.download is set, automatically start downloading the resulting file.
   * Is called when duration is reached or manually.
   * @returns {(ArrayBuffer|Uint8Array|Blob[]|undefined)}
   */ async stop() {
        if (this.status !== RecorderStatus.Recording) return;
        this.#updateStatus(RecorderStatus.Stopping);
        const buffer = await this.encoder.stop();
        if (this.download && buffer) {
            downloadBlob(this.filename, Array.isArray(buffer) ? buffer : [
                buffer
            ], this.encoder.mimeType);
        }
        this.#updateStatus(RecorderStatus.Stopped);
        return buffer;
    }
    /**
   * Clean up the recorder and encoder
   */ async dispose() {
        await this.encoder.dispose();
    }
}

var YA = (()=>{
    var c = import.meta.url;
    return function(D) {
        var C = D || {}, C = typeof C < "u" ? C : {}, s, y;
        C.ready = new Promise(function(A, I) {
            s = A, y = I;
        }), C.create_buffer = function(I) {
            return C._malloc(I);
        }, C.free_buffer = function(I) {
            return C._free(I);
        }, C.locateFile = function(I, g) {
            return C.simd && (I = I.replace(/\.wasm$/i, ".simd.wasm")), C.getWasmPath ? C.getWasmPath(I, g, C.simd) : g + I;
        }, C.createWebCodecsEncoder = function(I) {
            return Fg(C, I);
        };
        var e = Object.assign({}, C), b = typeof window == "object", W = typeof importScripts == "function", f = "";
        function U(A) {
            return C.locateFile ? C.locateFile(A, f) : f + A;
        }
        var q;
        (b || W) && (W ? f = self.location.href : typeof document < "u" && document.currentScript && (f = document.currentScript.src), c && (f = c), f.indexOf("blob:") !== 0 ? f = f.substr(0, f.replace(/[?#].*/, "").lastIndexOf("/") + 1) : f = "", W && (q = (A)=>{
            try {
                var I = new XMLHttpRequest();
                return I.open("GET", A, !1), I.responseType = "arraybuffer", I.send(null), new Uint8Array(I.response);
            } catch (B) {
                var g = nA(A);
                if (g) return g;
                throw B;
            }
        }), (A)=>document.title = A);
        C.print || console.log.bind(console); var J = C.printErr || console.warn.bind(console);
        Object.assign(C, e), e = null, C.arguments && (C.arguments), C.thisProgram && (C.thisProgram), C.quit && (C.quit);
        var T = 4, x;
        C.wasmBinary && (x = C.wasmBinary);
        C.noExitRuntime || !0;
        typeof WebAssembly != "object" && $("no native wasm support detected");
        var P, w = !1;
        function l(A, I, g) {
            for(var B = I + g, Q = ""; !(I >= B);){
                var i = A[I++];
                if (!i) return Q;
                if (!(i & 128)) {
                    Q += String.fromCharCode(i);
                    continue;
                }
                var n = A[I++] & 63;
                if ((i & 224) == 192) {
                    Q += String.fromCharCode((i & 31) << 6 | n);
                    continue;
                }
                var E = A[I++] & 63;
                if ((i & 240) == 224 ? i = (i & 15) << 12 | n << 6 | E : i = (i & 7) << 18 | n << 12 | E << 6 | A[I++] & 63, i < 65536) Q += String.fromCharCode(i);
                else {
                    var o = i - 65536;
                    Q += String.fromCharCode(55296 | o >> 10, 56320 | o & 1023);
                }
            }
            return Q;
        }
        function G(A, I) {
            return A ? l(u, A, I) : "";
        }
        function R(A, I, g, B) {
            if (!(B > 0)) return 0;
            for(var Q = g, i = g + B - 1, n = 0; n < A.length; ++n){
                var E = A.charCodeAt(n);
                if (E >= 55296 && E <= 57343) {
                    var o = A.charCodeAt(++n);
                    E = 65536 + ((E & 1023) << 10) | o & 1023;
                }
                if (E <= 127) {
                    if (g >= i) break;
                    I[g++] = E;
                } else if (E <= 2047) {
                    if (g + 1 >= i) break;
                    I[g++] = 192 | E >> 6, I[g++] = 128 | E & 63;
                } else if (E <= 65535) {
                    if (g + 2 >= i) break;
                    I[g++] = 224 | E >> 12, I[g++] = 128 | E >> 6 & 63, I[g++] = 128 | E & 63;
                } else {
                    if (g + 3 >= i) break;
                    I[g++] = 240 | E >> 18, I[g++] = 128 | E >> 12 & 63, I[g++] = 128 | E >> 6 & 63, I[g++] = 128 | E & 63;
                }
            }
            return I[g] = 0, g - Q;
        }
        function eA(A, I, g) {
            return R(A, u, I, g);
        }
        function PA(A) {
            for(var I = 0, g = 0; g < A.length; ++g){
                var B = A.charCodeAt(g);
                B <= 127 ? I++ : B <= 2047 ? I += 2 : B >= 55296 && B <= 57343 ? (I += 4, ++g) : I += 3;
            }
            return I;
        }
        var tA, u, z, aA, j, k, uA, HA;
        function UA() {
            var A = P.buffer;
            C.HEAP8 = tA = new Int8Array(A), C.HEAP16 = z = new Int16Array(A), C.HEAP32 = j = new Int32Array(A), C.HEAPU8 = u = new Uint8Array(A), C.HEAPU16 = aA = new Uint16Array(A), C.HEAPU32 = k = new Uint32Array(A), C.HEAPF32 = uA = new Float32Array(A), C.HEAPF64 = HA = new Float64Array(A);
        }
        C.INITIAL_MEMORY || 16777216; var kA, SA = [], MA = [], JA = [];
        function $A() {
            if (C.preRun) for(typeof C.preRun == "function" && (C.preRun = [
                C.preRun
            ]); C.preRun.length;)gI(C.preRun.shift());
            sA(SA);
        }
        function AI() {
            sA(MA);
        }
        function II() {
            if (C.postRun) for(typeof C.postRun == "function" && (C.postRun = [
                C.postRun
            ]); C.postRun.length;)BI(C.postRun.shift());
            sA(JA);
        }
        function gI(A) {
            SA.unshift(A);
        }
        function CI(A) {
            MA.unshift(A);
        }
        function BI(A) {
            JA.unshift(A);
        }
        var V = 0, CA = null;
        function QI(A) {
            V++, C.monitorRunDependencies && C.monitorRunDependencies(V);
        }
        function EI(A) {
            if (V--, C.monitorRunDependencies && C.monitorRunDependencies(V), V == 0 && (CA)) {
                var I = CA;
                CA = null, I();
            }
        }
        function $(A) {
            C.onAbort && C.onAbort(A), A = "Aborted(" + A + ")", J(A), w = !0, A += ". Build with -sASSERTIONS for more info.";
            var I = new WebAssembly.RuntimeError(A);
            throw y(I), I;
        }
        var KA = "data:application/octet-stream;base64,";
        function DA(A) {
            return A.startsWith(KA);
        }
        var S;
        S = "data:application/octet-stream;base64,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NwMYIANBADYCFCADQbgcNgIQIAMgATYCDCADQegcNgIIIAEgBWohAUEAIQUCQCAGQegcQQAQGQRAIANBATYCOCAGIANBCGogASABQQFBACAGKAIAKAIUEQkAIAFBACADKAIgQQFGGyEFDAELIAYgA0EIaiABQQFBACAGKAIAKAIYEQgAAkACQCADKAIsDgIAAQILIAMoAhxBACADKAIoQQFGG0EAIAMoAiRBAUYbQQAgAygCMEEBRhshBQwBCyADKAIgQQFHBEAgAygCMA0BIAMoAiRBAUcNASADKAIoQQFHDQELIAMoAhghBQsgA0FAayQAQQAgBSIBRQ0AGiAEQQhqIgNBBHJBAEE0EB4gBEEBNgI4IARBfzYCFCAEIAA2AhAgBCABNgIIIAEgAyACKAIAQQEgASgCACgCHBEDACAEKAIgIgBBAUYEQCACIAQoAhg2AgALIABBAUYLIQAgBEFAayQAIAALCgAgACABQQAQGQsEACAACyMBAX9BsCAoAgAiAARAA0AgACgCABEHACAAKAIEIgANAAsLCyQBAn8gACgCBCIAEB1BAWoiARAYIgIEfyACIAAgARAaBUEACwsFAEHkFQsTACAAQQRqQQAgASgCBEG4FUYbC9QBAwJ/AXwBfiMAQSBrIgQkACADKQMAIQcgAigCACECIAQgASgCADYCCEHAHiAEQQhqIgUQCCEBIAQgAjYCCEGoHiAFEAghAiAEIAc+AghBqB4gBEEIahAIIQMgARAGIAQgATYCCCACEAYgBCACNgIQIAMQBiAEIAM2AhggACgCBEEDQawVIAUQFiIAQZweIAUQCiEGIAQoAggQCSAAEAEgAxABIAIQASABEAECfyAGmUQAAAAAAADgQWMEQCAGqgwBC0GAgICAeAshAyAEQSBqJAAgAwsNACAAKAIEEAEgABAXCwkAIAAoAgQQAQsaACABIAAoAgQiADYCBCABQewTNgIAIAAQBgsiAQF/QQgQHyIBIAAoAgQiADYCBCABQewTNgIAIAAQBiABCxUAIABB7BM2AgAgACgCBBABIAAQFwsTACAAQewTNgIAIAAoAgQQASAACwkAIAEgABEAAAsNACABIAIgAyAAEQUAC0ABAX8jAEEQayIDJAAgAyACNgIAIAMgATYCCCADQQhqIAMgABEGACEAIAMoAgAQASADKAIIEAEgA0EQ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IABBAToADCABQQE6AAwgACAAKAIEIgIoAgAiATYCBCABBEAgASAANgIICyACIAAoAgg2AgggACgCCCIBIAEoAgAgAEdBAnRqIAI2AgAgAiAANgIAIAAgAjYCCAwECyABRQRAIABBAToADCACQQA6AAwgAiAAKAIEIgE2AgAgAQRAIAEgAjYCCAsgACACKAIINgIIIAIoAggiASABKAIAIAJHQQJ0aiAANgIAIAAgAjYCBCACIAA2AgggACADIAIgA0YbIQMgAigCACEACwJAAkAgACgCACIBRQ0AIAEtAAwNACAAIQIMAQsCQCAAKAIEIgIEQCACLQAMRQ0BCyAAQQA6AAwgACgCCCIALQAMQQAgACADRxsNAiAAQQE6AAwMBQsgAQRAIAEtAAxFBEAgACECDAILIAAoAgQhAgsgAkEBOgAMIABBADoADCAAIAIoAgAiATYCBCABBEAgASAANgIICyACIAAoAgg2AgggACgCCCIBIAEoAgAgAEdBAnRqIAI2AgAgAiAANgIAIAAgAjYCCCAAIQELIAIgAigCCCIALQAMOgAMIABBAToADCABQQE6AAwgACAAKAIAIgIoAgQiATYCACABBEAgASAANgIICyACIAAoAgg2AgggACgCCCIBIAEoAgAgAEdBAnRqIAI2AgAgAiAANgIEIAAgAjYCCAwDCyAAKAIIIgIgAigCACAARkECdGooAgAhAAwACwALIAFBAToADAsgBBAXCwtfAQF/IwBBEGsiBCQAIAQgATYCDCAEIAI2AgggBCAAQv////8PgzcDACADQbgbaigCACIBRQRAEDYACyABIARBDGogBEEIaiAEIAEoAgAoAhgRCgAhASAEQRBqJAAgAQudDAMKfwJ8AX0jAEEgayICJAAgACgCAEHUCxAFIgQQBCEDIAQQASADQageIAIQCiEMIAIoAgAQCSADEAEgACgCAEHFCBAFIgQQBCEDIAQQASADQageIAIQCiENIAIoAgAQCSADEAEgACgCAEG+CRAFIgQQBCEDIAQQAQJ/IAxEAAAAAAAA8EFjIAxEAAAAAAAAAABmcQRAIAyrDAELQQALIQgCfyANRAAAAAAAAPBBYyANRAAAAAAAAAAAZnEEQCANqwwBC0EACyEKQwAA8EEhDiADEA8EQCAAKAIAQb4JEAUiBRAEIQQgBRABIARB5B4gAhAK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cHMAKHVuc2lnbmVkKShwIC0gYmFzZSkgPD0gaW5kZXhfYnl0ZXMAKGgtPmNhcGFjaXR5IC0gaC0+Ynl0ZXMpID49IGJ5dGVzAGZpbmFsaXplX211eGVyAGNyZWF0ZV9tdXhlcgBWaWRlb0hhbmRsZXIAU291bmRIYW5kbGVyAHBhdGNoX3NsaWNlX2hlYWRlcgB1bnNpZ25lZCBjaGFyAHRyLT5pbmZvLnRyYWNrX21lZGlhX2tpbmQgPT0gZV92aWRlbwBmcmFnbWVudGF0aW9uAGJvb2wAbWluaW1wNF92ZWN0b3JfYWxsb2NfdGFpbABlbXNjcmlwdGVuOjp2YWwAbXV4X25hbABzZXF1ZW50aWFsAHdpZHRoAC9Vc2Vycy9kYW1pZW5zZWd1aW4vUHJvamVjdHMvb3NzLyNmb3JrL21wNC13YXNtL3NyYy9taW5pbXA0L21pbmltcDQuaAB1bnNpZ25lZCBsb25nAHN0ZDo6d3N0cmluZwBzdGQ6OnN0cmluZwBzdGQ6OnUxNnN0cmluZwBzdGQ6OnUzMnN0cmluZwBtdXgtPnNlcXVlbnRpYWxfbW9kZV9mbGFnAGRvdWJsZQB2b2lkAGNoYW5nZV9zcHNfaWQAaGV2YwB3cml0ZV9wZW5kaW5nX2RhdGEAaC0+ZGF0YQBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgc2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgaW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxmbG9hdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDhfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50OF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MTZfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50MTZfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDMyX3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDMyX3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGNoYXI+AHN0ZDo6YmFzaWNfc3RyaW5nPHVuc2lnbmVkIGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNpZ25lZCBjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBsb25nPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxkb3VibGU+AG4gPiAwICYmIG4gPD0gMTYAcHBzX2lkIDw9IDI1NQAodW5zaWduZWQpbiA8PSAzMgAtYnMtPnNoaWZ0IDwgMzIAc3BzX2lkIDw9IDMxAChpbnQpcG9zX2JpdHMgPj0gMAAhKHZhbCA+PiBuKQAAACgPAACoCQAAqAkAAE4xMGVtc2NyaXB0ZW4zdmFsRQAAgA8AAJQJAABpaWlpAEHAEwvSDMgOAAAoDwAAQA8AABwPAAB2aWlpaQAAAMgOAAAoDwAAdmlpAAAAAACgCgAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAATlN0M19fMjEwX19mdW5jdGlvbjZfX2Z1bmNJWjEyY3JlYXRlX211eGVyTjEwZW1zY3JpcHRlbjN2YWxFUzNfRTMkXzBOU185YWxsb2NhdG9ySVM0X0VFRmlQS3ZteEVFRQBOU3QzX18yMTBfX2Z1bmN0aW9uNl9fYmFzZUlGaVBLdm14RUVFAIAPAAByCgAAqA8AABAKAACYCgAAqAkAAKgJAACoCQAAWjEyY3JlYXRlX211eGVyTjEwZW1zY3JpcHRlbjN2YWxFUzBfRTMkXzAAAACADwAAuAoAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0ljTlNfMTFjaGFyX3RyYWl0c0ljRUVOU185YWxsb2NhdG9ySWNFRUVFAACADwAA7AoAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0loTlNfMTFjaGFyX3RyYWl0c0loRUVOU185YWxsb2NhdG9ySWhFRUVFAACADwAANAsAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0l3TlNfMTFjaGFyX3RyYWl0c0l3RUVOU185YWxsb2NhdG9ySXdFRUVFAACADwAAfAsAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0lEc05TXzExY2hhcl90cmFpdHNJRHNFRU5TXzlhbGxvY2F0b3JJRHNFRUVFAAAAgA8AAMQLAABOU3QzX18yMTJiYXNpY19zdHJpbmdJRGlOU18xMWNoYXJfdHJhaXRzSURpRUVOU185YWxsb2NhdG9ySURpRUVFRQAAAIAPAAAQDAAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJY0VFAACADwAAXAwAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWFFRQAAgA8AAIQMAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0loRUUAAIAPAACsDAAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJc0VFAACADwAA1AwAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXRFRQAAgA8AAPwMAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lpRUUAAIAPAAAkDQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJakVFAACADwAATA0AAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWxFRQAAgA8AAHQNAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0ltRUUAAIAPAACcDQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJZkVFAACADwAAxA0AAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWRFRQAAgA8AAOwNAABOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQAAAACoDwAAFA4AAAwQAABOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAAACoDwAARA4AADgOAAAAAAAAuA4AABQAAAAVAAAAFgAAABcAAAAYAAAATjEwX19jeHhhYml2MTIzX19mdW5kYW1lbnRhbF90eXBlX2luZm9FAKgPAACQDgAAOA4AAHYAAAB8DgAAxA4AAGIAAAB8DgAA0A4AAGMAAAB8DgAA3A4AAGgAAAB8DgAA6A4AAGEAAAB8DgAA9A4AAHMAAAB8DgAAAA8AAHQAAAB8DgAADA8AAGkAAAB8DgAAGA8AAGoAAAB8DgAAJA8AAGwAAAB8DgAAMA8AAG0AAAB8DgAAPA8AAHgAAAB8DgAASA8AAHkAAAB8DgAAVA8AAGYAAAB8DgAAYA8AAGQAAAB8DgAAbA8AAAAAAABoDgAAFAAAABkAAAAWAAAAFwAAABoAAAAbAAAAHAAAAB0AAAAAAAAA8A8AABQAAAAeAAAAFgAAABcAAAAaAAAAHwAAACAAAAAhAAAATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAAAAAKgPAADIDwAAaA4AAFN0OXR5cGVfaW5mbwAAAACADwAA/A8AQZQgCwcBAAAAQBIB", DA(S) || (S = U(S));
        function LA(A) {
            try {
                if (A == S && x) return new Uint8Array(x);
                var I = nA(A);
                if (I) return I;
                if (q) return q(A);
                throw "both async and sync fetching of the wasm failed";
            } catch (g) {
                $(g);
            }
        }
        function iI() {
            return !x && (b || W) && typeof fetch == "function" ? fetch(S, {
                credentials: "same-origin"
            }).then(function(A) {
                if (!A.ok) throw "failed to load wasm binary file at '" + S + "'";
                return A.arrayBuffer();
            }).catch(function() {
                return LA(S);
            }) : Promise.resolve().then(function() {
                return LA(S);
            });
        }
        function oI() {
            var A = {
                a: tg
            };
            function I(n, E) {
                var o = n.exports;
                C.asm = o, P = C.asm.x, UA(), kA = C.asm.B, CI(C.asm.y), EI();
            }
            QI();
            function g(n) {
                I(n.instance);
            }
            function B(n) {
                return iI().then(function(E) {
                    return WebAssembly.instantiate(E, A);
                }).then(function(E) {
                    return E;
                }).then(n, function(E) {
                    J("failed to asynchronously prepare wasm: " + E), $(E);
                });
            }
            function Q() {
                return !x && typeof WebAssembly.instantiateStreaming == "function" && !DA(S) && typeof fetch == "function" ? fetch(S, {
                    credentials: "same-origin"
                }).then(function(n) {
                    var E = WebAssembly.instantiateStreaming(n, A);
                    return E.then(g, function(o) {
                        return J("wasm streaming compile failed: " + o), J("falling back to ArrayBuffer instantiation"), B(g);
                    });
                }) : B(g);
            }
            if (C.instantiateWasm) try {
                var i = C.instantiateWasm(A, I);
                return i;
            } catch (n) {
                J("Module.instantiateWasm callback failed with error: " + n), y(n);
            }
            return Q().catch(y), {};
        }
        function sA(A) {
            for(; A.length > 0;)A.shift()(C);
        }
        function rI(A, I, g, B) {
            $("Assertion failed: " + G(A) + ", at: " + [
                I ? G(I) : "unknown filename",
                g,
                B ? G(B) : "unknown function"
            ]);
        }
        function eI(A, I, g, B, Q) {}
        function hA(A) {
            switch(A){
                case 1:
                    return 0;
                case 2:
                    return 1;
                case 4:
                    return 2;
                case 8:
                    return 3;
                default:
                    throw new TypeError("Unknown type size: " + A);
            }
        }
        function tI() {
            for(var A = new Array(256), I = 0; I < 256; ++I)A[I] = String.fromCharCode(I);
            pA = A;
        }
        var pA = void 0;
        function H(A) {
            for(var I = "", g = A; u[g];)I += pA[u[g++]];
            return I;
        }
        var AA = {}, O = {}, iA = {}, aI = 48, cI = 57;
        function vA(A) {
            if (A === void 0) return "_unknown";
            A = A.replace(/[^a-zA-Z0-9_]/g, "$");
            var I = A.charCodeAt(0);
            return I >= aI && I <= cI ? "_" + A : A;
        }
        function mA(A, I) {
            return A = vA(A), new Function("body", "return function " + A + `() {
    "use strict";    return body.apply(this, arguments);
};
`)(I);
        }
        function FA(A, I) {
            var g = mA(I, function(B) {
                this.name = I, this.message = B;
                var Q = new Error(B).stack;
                Q !== void 0 && (this.stack = this.toString() + `
` + Q.replace(/^Error(:[^\n]*)?\n/, ""));
            });
            return g.prototype = Object.create(A.prototype), g.prototype.constructor = g, g.prototype.toString = function() {
                return this.message === void 0 ? this.name : this.name + ": " + this.message;
            }, g;
        }
        var bA = void 0;
        function Y(A) {
            throw new bA(A);
        }
        var WA = void 0;
        function TA(A) {
            throw new WA(A);
        }
        function DI(A, I, g) {
            A.forEach(function(E) {
                iA[E] = I;
            });
            function B(E) {
                var o = g(E);
                o.length !== A.length && TA("Mismatched type converter count");
                for(var r = 0; r < A.length; ++r)L(A[r], o[r]);
            }
            var Q = new Array(I.length), i = [], n = 0;
            I.forEach((E, o)=>{
                O.hasOwnProperty(E) ? Q[o] = O[E] : (i.push(E), AA.hasOwnProperty(E) || (AA[E] = []), AA[E].push(()=>{
                    Q[o] = O[E], ++n, n === i.length && B(Q);
                }));
            }), i.length === 0 && B(Q);
        }
        function L(A, I, g) {
            if (g === void 0) g = {};
            if (!("argPackAdvance" in I)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
            var B = I.name;
            if (A || Y('type "' + B + '" must have a positive integer typeid pointer'), O.hasOwnProperty(A)) {
                if (g.ignoreDuplicateRegistrations) return;
                Y("Cannot register type '" + B + "' twice");
            }
            if (O[A] = I, delete iA[A], AA.hasOwnProperty(A)) {
                var Q = AA[A];
                delete AA[A], Q.forEach((i)=>i());
            }
        }
        function sI(A, I, g, B, Q) {
            var i = hA(g);
            I = H(I), L(A, {
                name: I,
                fromWireType: function(n) {
                    return !!n;
                },
                toWireType: function(n, E) {
                    return E ? B : Q;
                },
                argPackAdvance: 8,
                readValueFromPointer: function(n) {
                    var E;
                    if (g === 1) E = tA;
                    else if (g === 2) E = z;
                    else if (g === 4) E = j;
                    else throw new TypeError("Unknown boolean type size: " + I);
                    return this.fromWireType(E[n >> i]);
                },
                destructorFunction: null
            });
        }
        var yA = [], M = [
            {},
            {
                value: void 0
            },
            {
                value: null
            },
            {
                value: !0
            },
            {
                value: !1
            }
        ];
        function fA(A) {
            A > 4 && --M[A].refcount === 0 && (M[A] = void 0, yA.push(A));
        }
        function hI() {
            for(var A = 0, I = 5; I < M.length; ++I)M[I] !== void 0 && ++A;
            return A;
        }
        function FI() {
            for(var A = 5; A < M.length; ++A)if (M[A] !== void 0) return M[A];
            return null;
        }
        function yI() {
            C.count_emval_handles = hI, C.get_first_emval = FI;
        }
        var d = {
            toValue: (A)=>(A || Y("Cannot use deleted val. handle = " + A), M[A].value),
            toHandle: (A)=>{
                switch(A){
                    case void 0:
                        return 1;
                    case null:
                        return 2;
                    case !0:
                        return 3;
                    case !1:
                        return 4;
                    default:
                        {
                            var I = yA.length ? yA.pop() : M.length;
                            return M[I] = {
                                refcount: 1,
                                value: A
                            }, I;
                        }
                }
            }
        };
        function wA(A) {
            return this.fromWireType(j[A >> 2]);
        }
        function fI(A, I) {
            I = H(I), L(A, {
                name: I,
                fromWireType: function(g) {
                    var B = d.toValue(g);
                    return fA(g), B;
                },
                toWireType: function(g, B) {
                    return d.toHandle(B);
                },
                argPackAdvance: 8,
                readValueFromPointer: wA,
                destructorFunction: null
            });
        }
        function wI(A, I) {
            switch(I){
                case 2:
                    return function(g) {
                        return this.fromWireType(uA[g >> 2]);
                    };
                case 3:
                    return function(g) {
                        return this.fromWireType(HA[g >> 3]);
                    };
                default:
                    throw new TypeError("Unknown float type: " + A);
            }
        }
        function NI(A, I, g) {
            var B = hA(g);
            I = H(I), L(A, {
                name: I,
                fromWireType: function(Q) {
                    return Q;
                },
                toWireType: function(Q, i) {
                    return i;
                },
                argPackAdvance: 8,
                readValueFromPointer: wI(I, B),
                destructorFunction: null
            });
        }
        function RI(A, I) {
            if (!(A instanceof Function)) throw new TypeError("new_ called with constructor type " + typeof A + " which is not a function");
            var g = mA(A.name || "unknownFunctionName", function() {});
            g.prototype = A.prototype;
            var B = new g(), Q = A.apply(B, I);
            return Q instanceof Object ? Q : B;
        }
        function XA(A) {
            for(; A.length;){
                var I = A.pop(), g = A.pop();
                g(I);
            }
        }
        function GI(A, I, g, B, Q) {
            var i = I.length;
            i < 2 && Y("argTypes array size mismatch! Must at least get return value and 'this' types!");
            for(var n = I[1] !== null && g !== null, E = !1, o = 1; o < I.length; ++o)if (I[o] !== null && I[o].destructorFunction === void 0) {
                E = !0;
                break;
            }
            for(var r = I[0].name !== "void", h = "", t = "", o = 0; o < i - 2; ++o)h += (o !== 0 ? ", " : "") + "arg" + o, t += (o !== 0 ? ", " : "") + "arg" + o + "Wired";
            var F = "return function " + vA(A) + "(" + h + `) {
if (arguments.length !== ` + (i - 2) + `) {
throwBindingError('function ` + A + " called with ' + arguments.length + ' arguments, expected " + (i - 2) + ` args!');
}
`;
            E && (F += `var destructors = [];
`);
            var _ = E ? "destructors" : "null", X = [
                "throwBindingError",
                "invoker",
                "fn",
                "runDestructors",
                "retType",
                "classParam"
            ], BA = [
                Y,
                B,
                Q,
                XA,
                I[0],
                I[1]
            ];
            n && (F += "var thisWired = classParam.toWireType(" + _ + `, this);
`);
            for(var o = 0; o < i - 2; ++o)F += "var arg" + o + "Wired = argType" + o + ".toWireType(" + _ + ", arg" + o + "); // " + I[o + 2].name + `
`, X.push("argType" + o), BA.push(I[o + 2]);
            if (n && (t = "thisWired" + (t.length > 0 ? ", " : "") + t), F += (r ? "var rv = " : "") + "invoker(fn" + (t.length > 0 ? ", " : "") + t + `);
`, E) F += `runDestructors(destructors);
`;
            else for(var o = n ? 1 : 2; o < I.length; ++o){
                var IA = o === 1 ? "thisWired" : "arg" + (o - 2) + "Wired";
                I[o].destructorFunction !== null && (F += IA + "_dtor(" + IA + "); // " + I[o].name + `
`, X.push(IA + "_dtor"), BA.push(I[o].destructorFunction));
            }
            r && (F += `var ret = retType.fromWireType(rv);
return ret;
`), F += `}
`, X.push(F);
            var sg = RI(Function, X).apply(null, BA);
            return sg;
        }
        function YI(A, I, g) {
            if (A[I].overloadTable === void 0) {
                var B = A[I];
                A[I] = function() {
                    return A[I].overloadTable.hasOwnProperty(arguments.length) || Y("Function '" + g + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + A[I].overloadTable + ")!"), A[I].overloadTable[arguments.length].apply(this, arguments);
                }, A[I].overloadTable = [], A[I].overloadTable[B.argCount] = B;
            }
        }
        function dI(A, I, g) {
            C.hasOwnProperty(A) ? ((g === void 0 || C[A].overloadTable !== void 0 && C[A].overloadTable[g] !== void 0) && Y("Cannot register public name '" + A + "' twice"), YI(C, A, A), C.hasOwnProperty(g) && Y("Cannot register multiple overloads of a function with the same number of arguments (" + g + ")!"), C[A].overloadTable[g] = I) : (C[A] = I, g !== void 0 && (C[A].numArguments = g));
        }
        function lI(A, I) {
            for(var g = [], B = 0; B < A; B++)g.push(k[I + B * 4 >> 2]);
            return g;
        }
        function uI(A, I, g) {
            C.hasOwnProperty(A) || TA("Replacing nonexistant public symbol"), C[A].overloadTable !== void 0 && g !== void 0 ? C[A].overloadTable[g] = I : (C[A] = I, C[A].argCount = g);
        }
        function HI(A, I, g) {
            var B = C["dynCall_" + A];
            return g && g.length ? B.apply(null, [
                I
            ].concat(g)) : B.call(null, I);
        }
        var oA = [];
        function ZA(A) {
            var I = oA[A];
            return I || (A >= oA.length && (oA.length = A + 1), oA[A] = I = kA.get(A)), I;
        }
        function UI(A, I, g) {
            if (A.includes("j")) return HI(A, I, g);
            var B = ZA(I).apply(null, g);
            return B;
        }
        function kI(A, I) {
            var g = [];
            return function() {
                return g.length = 0, Object.assign(g, arguments), UI(A, I, g);
            };
        }
        function SI(A, I) {
            A = H(A);
            function g() {
                return A.includes("j") ? kI(A, I) : ZA(I);
            }
            var B = g();
            return typeof B != "function" && Y("unknown function pointer with signature " + A + ": " + I), B;
        }
        var qA = void 0;
        function xA(A) {
            var I = jA(A), g = H(I);
            return p(I), g;
        }
        function MI(A, I) {
            var g = [], B = {};
            function Q(i) {
                if (!B[i] && !O[i]) {
                    if (iA[i]) {
                        iA[i].forEach(Q);
                        return;
                    }
                    g.push(i), B[i] = !0;
                }
            }
            throw I.forEach(Q), new qA(A + ": " + g.map(xA).join([
                ", "
            ]));
        }
        function JI(A, I, g, B, Q, i) {
            var n = lI(I, g);
            A = H(A), Q = SI(B, Q), dI(A, function() {
                MI("Cannot call " + A + " due to unbound types", n);
            }, I - 1), DI([], n, function(E) {
                var o = [
                    E[0],
                    null
                ].concat(E.slice(1));
                return uI(A, GI(A, o, null, Q, i), I - 1), [];
            });
        }
        function KI(A, I, g) {
            switch(I){
                case 0:
                    return g ? function(Q) {
                        return tA[Q];
                    } : function(Q) {
                        return u[Q];
                    };
                case 1:
                    return g ? function(Q) {
                        return z[Q >> 1];
                    } : function(Q) {
                        return aA[Q >> 1];
                    };
                case 2:
                    return g ? function(Q) {
                        return j[Q >> 2];
                    } : function(Q) {
                        return k[Q >> 2];
                    };
                default:
                    throw new TypeError("Unknown integer type: " + A);
            }
        }
        function LI(A, I, g, B, Q) {
            I = H(I);
            var i = hA(g), n = (t)=>t;
            if (B === 0) {
                var E = 32 - 8 * g;
                n = (t)=>t << E >>> E;
            }
            var o = I.includes("unsigned"), r = (t, F)=>{}, h;
            o ? h = function(t, F) {
                return r(F, this.name), F >>> 0;
            } : h = function(t, F) {
                return r(F, this.name), F;
            }, L(A, {
                name: I,
                fromWireType: n,
                toWireType: h,
                argPackAdvance: 8,
                readValueFromPointer: KI(I, i, B !== 0),
                destructorFunction: null
            });
        }
        function pI(A, I, g) {
            var B = [
                Int8Array,
                Uint8Array,
                Int16Array,
                Uint16Array,
                Int32Array,
                Uint32Array,
                Float32Array,
                Float64Array
            ], Q = B[I];
            function i(n) {
                n = n >> 2;
                var E = k, o = E[n], r = E[n + 1];
                return new Q(E.buffer, r, o);
            }
            g = H(g), L(A, {
                name: g,
                fromWireType: i,
                argPackAdvance: 8,
                readValueFromPointer: i
            }, {
                ignoreDuplicateRegistrations: !0
            });
        }
        function vI(A, I) {
            I = H(I);
            var g = I === "std::string";
            L(A, {
                name: I,
                fromWireType: function(B) {
                    var Q = k[B >> 2], i = B + 4, n;
                    if (g) for(var E = i, o = 0; o <= Q; ++o){
                        var r = i + o;
                        if (o == Q || u[r] == 0) {
                            var h = r - E, t = G(E, h);
                            n === void 0 ? n = t : (n += String.fromCharCode(0), n += t), E = r + 1;
                        }
                    }
                    else {
                        for(var F = new Array(Q), o = 0; o < Q; ++o)F[o] = String.fromCharCode(u[i + o]);
                        n = F.join("");
                    }
                    return p(B), n;
                },
                toWireType: function(B, Q) {
                    Q instanceof ArrayBuffer && (Q = new Uint8Array(Q));
                    var i, n = typeof Q == "string";
                    n || Q instanceof Uint8Array || Q instanceof Uint8ClampedArray || Q instanceof Int8Array || Y("Cannot pass non-string to std::string"), g && n ? i = PA(Q) : i = Q.length;
                    var E = RA(4 + i + 1), o = E + 4;
                    if (k[E >> 2] = i, g && n) eA(Q, o, i + 1);
                    else if (n) for(var r = 0; r < i; ++r){
                        var h = Q.charCodeAt(r);
                        h > 255 && (p(o), Y("String has UTF-16 code units that do not fit in 8 bits")), u[o + r] = h;
                    }
                    else for(var r = 0; r < i; ++r)u[o + r] = Q[r];
                    return B !== null && B.push(p, E), E;
                },
                argPackAdvance: 8,
                readValueFromPointer: wA,
                destructorFunction: function(B) {
                    p(B);
                }
            });
        }
        function mI(A, I) {
            for(var g = "", B = 0; !(B >= I / 2); ++B){
                var Q = z[A + B * 2 >> 1];
                if (Q == 0) break;
                g += String.fromCharCode(Q);
            }
            return g;
        }
        function bI(A, I, g) {
            if (g === void 0 && (g = 2147483647), g < 2) return 0;
            g -= 2;
            for(var B = I, Q = g < A.length * 2 ? g / 2 : A.length, i = 0; i < Q; ++i){
                var n = A.charCodeAt(i);
                z[I >> 1] = n, I += 2;
            }
            return z[I >> 1] = 0, I - B;
        }
        function WI(A) {
            return A.length * 2;
        }
        function TI(A, I) {
            for(var g = 0, B = ""; !(g >= I / 4);){
                var Q = j[A + g * 4 >> 2];
                if (Q == 0) break;
                if (++g, Q >= 65536) {
                    var i = Q - 65536;
                    B += String.fromCharCode(55296 | i >> 10, 56320 | i & 1023);
                } else B += String.fromCharCode(Q);
            }
            return B;
        }
        function XI(A, I, g) {
            if (g === void 0 && (g = 2147483647), g < 4) return 0;
            for(var B = I, Q = B + g - 4, i = 0; i < A.length; ++i){
                var n = A.charCodeAt(i);
                if (n >= 55296 && n <= 57343) {
                    var E = A.charCodeAt(++i);
                    n = 65536 + ((n & 1023) << 10) | E & 1023;
                }
                if (j[I >> 2] = n, I += 4, I + 4 > Q) break;
            }
            return j[I >> 2] = 0, I - B;
        }
        function ZI(A) {
            for(var I = 0, g = 0; g < A.length; ++g){
                var B = A.charCodeAt(g);
                B >= 55296 && B <= 57343 && ++g, I += 4;
            }
            return I;
        }
        function qI(A, I, g) {
            g = H(g);
            var B, Q, i, n, E;
            I === 2 ? (B = mI, Q = bI, n = WI, i = ()=>aA, E = 1) : I === 4 && (B = TI, Q = XI, n = ZI, i = ()=>k, E = 2), L(A, {
                name: g,
                fromWireType: function(o) {
                    for(var r = k[o >> 2], h = i(), t, F = o + 4, _ = 0; _ <= r; ++_){
                        var X = o + 4 + _ * I;
                        if (_ == r || h[X >> E] == 0) {
                            var BA = X - F, IA = B(F, BA);
                            t === void 0 ? t = IA : (t += String.fromCharCode(0), t += IA), F = X + I;
                        }
                    }
                    return p(o), t;
                },
                toWireType: function(o, r) {
                    typeof r != "string" && Y("Cannot pass non-string to C++ string type " + g);
                    var h = n(r), t = RA(4 + h + I);
                    return k[t >> 2] = h >> E, Q(r, t + 4, h + I), o !== null && o.push(p, t), t;
                },
                argPackAdvance: 8,
                readValueFromPointer: wA,
                destructorFunction: function(o) {
                    p(o);
                }
            });
        }
        function xI(A, I) {
            I = H(I), L(A, {
                isVoid: !0,
                name: I,
                argPackAdvance: 0,
                fromWireType: function() {},
                toWireType: function(g, B) {}
            });
        }
        function NA(A, I) {
            var g = O[A];
            return g === void 0 && Y(I + " has unknown type " + xA(A)), g;
        }
        function jI(A, I, g) {
            A = d.toValue(A), I = NA(I, "emval::as");
            var B = [], Q = d.toHandle(B);
            return k[g >> 2] = Q, I.toWireType(B, A);
        }
        function VI(A, I) {
            for(var g = new Array(A), B = 0; B < A; ++B)g[B] = NA(k[I + B * T >> 2], "parameter " + B);
            return g;
        }
        function OI(A, I, g, B) {
            A = d.toValue(A);
            for(var Q = VI(I, g), i = new Array(I), n = 0; n < I; ++n){
                var E = Q[n];
                i[n] = E.readValueFromPointer(B), B += E.argPackAdvance;
            }
            var o = A.apply(void 0, i);
            return d.toHandle(o);
        }
        function _I(A, I) {
            return A = d.toValue(A), I = d.toValue(I), d.toHandle(A[I]);
        }
        function PI(A) {
            A > 4 && (M[A].refcount += 1);
        }
        function zI(A) {
            return A = d.toValue(A), typeof A == "number";
        }
        var $I = {};
        function Ag(A) {
            var I = $I[A];
            return I === void 0 ? H(A) : I;
        }
        function Ig(A) {
            return d.toHandle(Ag(A));
        }
        function gg(A) {
            var I = d.toValue(A);
            XA(I), fA(A);
        }
        function Cg(A, I) {
            A = NA(A, "_emval_take_value");
            var g = A.readValueFromPointer(I);
            return d.toHandle(g);
        }
        function Bg() {
            $("");
        }
        function Qg(A, I, g) {
            u.copyWithin(A, I, I + g);
        }
        function Eg() {
            return 2147483648;
        }
        function ig(A) {
            var I = P.buffer;
            try {
                return P.grow(A - I.byteLength + 65535 >>> 16), UA(), 1;
            } catch  {}
        }
        function og(A) {
            var I = u.length;
            A = A >>> 0;
            var g = Eg();
            if (A > g) return !1;
            let B = (o, r)=>o + (r - o % r) % r;
            for(var Q = 1; Q <= 4; Q *= 2){
                var i = I * (1 + 0.2 / Q);
                i = Math.min(i, A + 100663296);
                var n = Math.min(g, B(Math.max(A, i), 65536)), E = ig(n);
                if (E) return !0;
            }
            return !1;
        }
        tI(), bA = C.BindingError = FA(Error, "BindingError"), WA = C.InternalError = FA(Error, "InternalError"), yI(), qA = C.UnboundTypeError = FA(Error, "UnboundTypeError");
        var rg = typeof atob == "function" ? atob : function(A) {
            var I = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", g = "", B, Q, i, n, E, o, r, h = 0;
            A = A.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do n = I.indexOf(A.charAt(h++)), E = I.indexOf(A.charAt(h++)), o = I.indexOf(A.charAt(h++)), r = I.indexOf(A.charAt(h++)), B = n << 2 | E >> 4, Q = (E & 15) << 4 | o >> 2, i = (o & 3) << 6 | r, g = g + String.fromCharCode(B), o !== 64 && (g = g + String.fromCharCode(Q)), r !== 64 && (g = g + String.fromCharCode(i));
            while (h < A.length);
            return g;
        };
        function eg(A) {
            try {
                for(var I = rg(A), g = new Uint8Array(I.length), B = 0; B < I.length; ++B)g[B] = I.charCodeAt(B);
                return g;
            } catch  {
                throw new Error("Converting base64 string to bytes failed.");
            }
        }
        function nA(A) {
            if (DA(A)) return eg(A.slice(KA.length));
        }
        var tg = {
            a: rI,
            q: eI,
            u: sI,
            t: fI,
            o: NI,
            h: JI,
            d: LI,
            c: pI,
            n: vI,
            l: qI,
            v: xI,
            k: jI,
            w: OI,
            b: fA,
            e: _I,
            g: PI,
            p: zI,
            f: Ig,
            j: gg,
            i: Cg,
            m: Bg,
            s: Qg,
            r: og
        }; oI(); C.___wasm_call_ctors = function() {
            return (C.___wasm_call_ctors = C.asm.y).apply(null, arguments);
        }; var RA = C._malloc = function() {
            return (RA = C._malloc = C.asm.z).apply(null, arguments);
        }, p = C._free = function() {
            return (p = C._free = C.asm.A).apply(null, arguments);
        }, jA = C.___getTypeName = function() {
            return (jA = C.___getTypeName = C.asm.C).apply(null, arguments);
        }; C.__embind_initialize_bindings = function() {
            return (C.__embind_initialize_bindings = C.asm.D).apply(null, arguments);
        }; C.dynCall_ijiii = function() {
            return (C.dynCall_ijiii = C.asm.E).apply(null, arguments);
        }; var rA;
        CA = function A() {
            rA || VA(), rA || (CA = A);
        };
        function VA(A) {
            if (V > 0 || ($A(), V > 0)) return;
            function I() {
                rA || (rA = !0, C.calledRun = !0, !w && (AI(), s(C), C.onRuntimeInitialized && C.onRuntimeInitialized(), II()));
            }
            C.setStatus ? (C.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                    C.setStatus("");
                }, 1), I();
            }, 1)) : I();
        }
        if (C.preInit) for(typeof C.preInit == "function" && (C.preInit = [
            C.preInit
        ]); C.preInit.length > 0;)C.preInit.pop()();
        return VA(), C.ready;
    };
})(), Gg = YA, GA = new Uint8Array([
    0,
    0,
    0,
    1
]);
function hg(c) {
    console.error(c);
}
YA.createFile = OA;
function OA(c) {
    if (c === void 0) c = 256;
    let D = 0, C = 0, s = new Uint8Array(c);
    return {
        contents: function() {
            return s.slice(0, C);
        },
        seek: function(e) {
            D = e;
        },
        write: function(e) {
            let a = e.byteLength;
            return y(D + a), s.set(e, D), D += a, C = Math.max(C, D), a;
        }
    };
    function y(e) {
        var a = s.length;
        if (a >= e) return;
        var v = 1024 * 1024;
        e = Math.max(e, a * (a < v ? 2 : 1.125) >>> 0), a != 0 && (e = Math.max(e, 256));
        let m = s;
        s = new Uint8Array(e), C > 0 && s.set(m.subarray(0, C), 0);
    }
}
YA.isWebCodecsSupported = _A;
function _A() {
    return typeof window < "u" && typeof window.VideoEncoder == "function";
}
function Fg(c, D) {
    if (D === void 0) D = {};
    let { width: C, height: s, groupOfPictures: y = 20, fps: e = 30, fragmentation: a = !1, sequential: v = !1, hevc: m = !1, format: b = "annexb", codec: W = "avc1.4d0034", acceleration: gA, bitrate: f, error: U = hg, encoderOptions: Z = {}, flushFrequency: QA = 10 } = D;
    if (!_A()) throw new Error("MP4 H264 encoding/decoding depends on WebCodecs API which is not supported in this environment");
    if (typeof C != "number" || typeof s != "number") throw new Error("Must specify { width, height } options");
    if (!isFinite(C) || C < 0 || !isFinite(s) || s < 0) throw new Error("{ width, height } options must be positive integers");
    let q = OA(), EA = c.create_muxer({
        width: C,
        height: s,
        fps: e,
        fragmentation: a,
        sequential: v,
        hevc: m
    }, x), dA = {
        codec: W,
        width: C,
        height: s,
        avc: {
            format: b
        },
        hardwareAcceleration: gA,
        bitrate: f,
        ...Z
    }, J = 0, T = new window.VideoEncoder({
        output (w, N) {
            P(w, N);
        },
        error: U
    });
    return T.configure(dA), {
        async end () {
            return await T.flush(), T.close(), c.finalize_muxer(EA), q.contents();
        },
        async addFrame (w) {
            let N = 1 / e * J * 1e6, K = J % y === 0, l = new VideoFrame(w, {
                timestamp: N
            });
            T.encode(l, {
                keyFrame: K
            }), l.close(), QA != null && (J + 1) % QA === 0 && await T.flush(), J++;
        },
        async flush () {
            return T.flush();
        }
    };
    function x(w, N, K) {
        q.seek(K);
        let l = c.HEAPU8.subarray(w, w + N);
        return q.write(l) !== l.byteLength;
    }
    function lA(w) {
        let N = c._malloc(w.byteLength);
        c.HEAPU8.set(w, N), c.mux_nal(EA, N, w.byteLength), c._free(N);
    }
    function P(w, N) {
        let K = null, l;
        if (N && (N.description && (l = N.description), N.decoderConfig && N.decoderConfig.description && (l = N.decoderConfig.description)), l) try {
            K = wg(l);
        } catch (R) {
            U(R);
            return;
        }
        let G = [];
        if (K && (K.sps_list.forEach((R)=>{
            G.push(GA), G.push(R);
        }), K.pps_list.forEach((R)=>{
            G.push(GA), G.push(R);
        })), b === "annexb") {
            let R = new Uint8Array(w.byteLength);
            w.copyTo(R), G.push(R);
        } else try {
            let R = new ArrayBuffer(w.byteLength);
            w.copyTo(R), fg(R).forEach((eA)=>{
                G.push(GA), G.push(eA);
            });
        } catch (R) {
            U(R);
            return;
        }
        lA(yg(G));
    }
}
function yg(c) {
    let D = c.reduce((y, e)=>y + e.byteLength, 0), C = new Uint8Array(D), s = 0;
    for(let y = 0; y < c.length; y++){
        let e = c[y];
        C.set(e, s), s += e.byteLength;
    }
    return C;
}
function fg(c) {
    let C = 0, s = [], y = c.byteLength, e = new Uint8Array(c);
    for(; C + 4 < y;){
        let a = e[C];
        if (a = (a << 8) + e[C + 1], a = (a << 8) + e[C + 2], a = (a << 8) + e[C + 3], s.push(new Uint8Array(c, C + 4, a)), a == 0) throw new Error("Error: invalid nal_length 0");
        C += 4 + a;
    }
    return s;
}
function wg(c) {
    let D = new DataView(c), C = 0, s = D.getUint8(C++), y = D.getUint8(C++), e = D.getUint8(C++), a = D.getUint8(C++), v = (D.getUint8(C++) & 3) + 1;
    if (v !== 4) throw new Error("Expected length_size to indicate 4 bytes");
    let m = D.getUint8(C++) & 31, b = [];
    for(let f = 0; f < m; f++){
        let U = D.getUint16(C, !1);
        C += 2;
        let Z = new Uint8Array(D.buffer, C, U);
        b.push(Z), C += U;
    }
    let W = D.getUint8(C++), gA = [];
    for(let f = 0; f < W; f++){
        let U = D.getUint16(C, !1);
        C += 2;
        let Z = new Uint8Array(D.buffer, C, U);
        gA.push(Z), C += U;
    }
    return {
        offset: C,
        version: s,
        profile: y,
        compat: e,
        level: a,
        length_size: v,
        pps_list: gA,
        sps_list: b,
        numSPS: m
    };
}

/**
 * @typedef {object} MP4WasmEncoderOptions
 * @property {number} [groupOfPictures=20]
 * @property {number} [flushFrequency=10]
 * @property {MP4WasmEncoderEncoderOptions} [encoderOptions={}]
 */ /**
 * @typedef {VideoEncoderConfig} MP4WasmEncoderEncoderOptions
 * @see [VideoEncoder.configure]{@link https://developer.mozilla.org/en-US/docs/Web/API/VideoEncoder/configure#config}
 */ let mp4wasm;
class MP4WasmEncoder extends Encoder$1 {
    static #_ = this.supportedExtensions = [
        "mp4"
    ];
    static #_2 = this.supportedTargets = [
        "in-browser"
    ];
    static #_3 = this.defaultOptions = {
        extension: MP4WasmEncoder.supportedExtensions[0],
        groupOfPictures: 20,
        flushFrequency: 10
    };
    get frameMethod() {
        return "bitmap";
    }
    /**
   * @param {MP4WasmEncoderOptions} [options]
   */ constructor(options){
        super({
            ...MP4WasmEncoder.defaultOptions,
            ...options
        });
    }
    async init(options) {
        super.init(options);
        mp4wasm ||= await Gg(); // { wasmBinary }
        this.encoder = mp4wasm.createWebCodecsEncoder({
            // codec: "avc1.420034", // Baseline 4.2
            codec: "avc1.4d0034",
            width: this.width,
            height: this.height,
            fps: this.frameRate,
            encoderOptions: {
                framerate: this.frameRate,
                bitrate: estimateBitRate(this.width, this.height, this.frameRate, this.encoderOptions.bitrateMode),
                ...this.encoderOptions
            }
        });
    }
    async encode(frame) {
        await this.encoder.addFrame(frame);
    }
    async stop() {
        let buffer = await this.encoder.end();
        return buffer;
    }
    async dispose() {
        this.encoder = null;
    }
}
var MP4WasmEncoder$1 = MP4WasmEncoder;

var FFMessageType;
(function(FFMessageType) {
    FFMessageType["LOAD"] = "LOAD";
    FFMessageType["EXEC"] = "EXEC";
    FFMessageType["WRITE_FILE"] = "WRITE_FILE";
    FFMessageType["READ_FILE"] = "READ_FILE";
    FFMessageType["DELETE_FILE"] = "DELETE_FILE";
    FFMessageType["RENAME"] = "RENAME";
    FFMessageType["CREATE_DIR"] = "CREATE_DIR";
    FFMessageType["LIST_DIR"] = "LIST_DIR";
    FFMessageType["DELETE_DIR"] = "DELETE_DIR";
    FFMessageType["ERROR"] = "ERROR";
    FFMessageType["DOWNLOAD"] = "DOWNLOAD";
    FFMessageType["PROGRESS"] = "PROGRESS";
    FFMessageType["LOG"] = "LOG";
    FFMessageType["MOUNT"] = "MOUNT";
    FFMessageType["UNMOUNT"] = "UNMOUNT";
})(FFMessageType || (FFMessageType = {}));

/**
 * Generate an unique message ID.
 */ const getMessageID = (()=>{
    let messageID = 0;
    return ()=>messageID++;
})();

const ERROR_NOT_LOADED = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first");
const ERROR_TERMINATED = new Error("called FFmpeg.terminate()");

/**
 * Provides APIs to interact with ffmpeg web worker.
 *
 * @example
 * ```ts
 * const ffmpeg = new FFmpeg();
 * ```
 */ class FFmpeg {
    #worker;
    /**
     * #resolves and #rejects tracks Promise resolves and rejects to
     * be called when we receive message from web worker.
     */ #resolves;
    #rejects;
    #logEventCallbacks;
    #progressEventCallbacks;
    /**
     * register worker message event handlers.
     */ #registerHandlers;
    /**
     * Generic function to send messages to web worker.
     */ #send;
    on(event, callback) {
        if (event === "log") {
            this.#logEventCallbacks.push(callback);
        } else if (event === "progress") {
            this.#progressEventCallbacks.push(callback);
        }
    }
    off(event, callback) {
        if (event === "log") {
            this.#logEventCallbacks = this.#logEventCallbacks.filter((f)=>f !== callback);
        } else if (event === "progress") {
            this.#progressEventCallbacks = this.#progressEventCallbacks.filter((f)=>f !== callback);
        }
    }
    constructor(){
        this.#worker = null;
        this.#resolves = {};
        this.#rejects = {};
        this.#logEventCallbacks = [];
        this.#progressEventCallbacks = [];
        this.loaded = false;
        this.#registerHandlers = ()=>{
            if (this.#worker) {
                this.#worker.onmessage = (param)=>{
                    let { data: { id, type, data } } = param;
                    switch(type){
                        case FFMessageType.LOAD:
                            this.loaded = true;
                            this.#resolves[id](data);
                            break;
                        case FFMessageType.MOUNT:
                        case FFMessageType.UNMOUNT:
                        case FFMessageType.EXEC:
                        case FFMessageType.WRITE_FILE:
                        case FFMessageType.READ_FILE:
                        case FFMessageType.DELETE_FILE:
                        case FFMessageType.RENAME:
                        case FFMessageType.CREATE_DIR:
                        case FFMessageType.LIST_DIR:
                        case FFMessageType.DELETE_DIR:
                            this.#resolves[id](data);
                            break;
                        case FFMessageType.LOG:
                            this.#logEventCallbacks.forEach((f)=>f(data));
                            break;
                        case FFMessageType.PROGRESS:
                            this.#progressEventCallbacks.forEach((f)=>f(data));
                            break;
                        case FFMessageType.ERROR:
                            this.#rejects[id](data);
                            break;
                    }
                    delete this.#resolves[id];
                    delete this.#rejects[id];
                };
            }
        };
        this.#send = (param, trans, signal)=>{
            let { type, data } = param;
            if (trans === void 0) trans = [];
            if (!this.#worker) {
                return Promise.reject(ERROR_NOT_LOADED);
            }
            return new Promise((resolve, reject)=>{
                const id = getMessageID();
                this.#worker && this.#worker.postMessage({
                    id,
                    type,
                    data
                }, trans);
                this.#resolves[id] = resolve;
                this.#rejects[id] = reject;
                signal == null ? void 0 : signal.addEventListener("abort", ()=>{
                    reject(new DOMException(`Message # ${id} was aborted`, "AbortError"));
                }, {
                    once: true
                });
            });
        };
        /**
     * Loads ffmpeg-core inside web worker. It is required to call this method first
     * as it initializes WebAssembly and other essential variables.
     *
     * @category FFmpeg
     * @returns `true` if ffmpeg core is loaded for the first time.
     */ this.load = (param, param1)=>{
            let { classWorkerURL, ...config } = param === void 0 ? {} : param;
            let { signal } = param1 === void 0 ? {} : param1;
            if (!this.#worker) {
                this.#worker = classWorkerURL ? new Worker(new URL(classWorkerURL, import.meta.url), {
                    type: "module"
                }) : // We need to duplicated the code here to enable webpack
                // to bundle worekr.js here.
                new Worker(new URL("./worker.js", import.meta.url), {
                    type: "module"
                });
                this.#registerHandlers();
            }
            return this.#send({
                type: FFMessageType.LOAD,
                data: config
            }, undefined, signal);
        };
        /**
     * Execute ffmpeg command.
     *
     * @remarks
     * To avoid common I/O issues, ["-nostdin", "-y"] are prepended to the args
     * by default.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * await ffmpeg.writeFile("video.avi", ...);
     * // ffmpeg -i video.avi video.mp4
     * await ffmpeg.exec(["-i", "video.avi", "video.mp4"]);
     * const data = ffmpeg.readFile("video.mp4");
     * ```
     *
     * @returns `0` if no error, `!= 0` if timeout (1) or error.
     * @category FFmpeg
     */ this.exec = (/** ffmpeg command line args */ args, /**
     * milliseconds to wait before stopping the command execution.
     *
     * @defaultValue -1
     */ timeout, param)=>{
            if (timeout === void 0) timeout = -1;
            let { signal } = param === void 0 ? {} : param;
            return this.#send({
                type: FFMessageType.EXEC,
                data: {
                    args,
                    timeout
                }
            }, undefined, signal);
        };
        /**
     * Terminate all ongoing API calls and terminate web worker.
     * `FFmpeg.load()` must be called again before calling any other APIs.
     *
     * @category FFmpeg
     */ this.terminate = ()=>{
            const ids = Object.keys(this.#rejects);
            // rejects all incomplete Promises.
            for (const id of ids){
                this.#rejects[id](ERROR_TERMINATED);
                delete this.#rejects[id];
                delete this.#resolves[id];
            }
            if (this.#worker) {
                this.#worker.terminate();
                this.#worker = null;
                this.loaded = false;
            }
        };
        /**
     * Write data to ffmpeg.wasm.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * await ffmpeg.writeFile("video.avi", await fetchFile("../video.avi"));
     * await ffmpeg.writeFile("text.txt", "hello world");
     * ```
     *
     * @category File System
     */ this.writeFile = (path, data, param)=>{
            let { signal } = param === void 0 ? {} : param;
            const trans = [];
            if (data instanceof Uint8Array) {
                trans.push(data.buffer);
            }
            return this.#send({
                type: FFMessageType.WRITE_FILE,
                data: {
                    path,
                    data
                }
            }, trans, signal);
        };
        this.mount = (fsType, options, mountPoint)=>{
            const trans = [];
            return this.#send({
                type: FFMessageType.MOUNT,
                data: {
                    fsType,
                    options,
                    mountPoint
                }
            }, trans);
        };
        this.unmount = (mountPoint)=>{
            const trans = [];
            return this.#send({
                type: FFMessageType.UNMOUNT,
                data: {
                    mountPoint
                }
            }, trans);
        };
        /**
     * Read data from ffmpeg.wasm.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * const data = await ffmpeg.readFile("video.mp4");
     * ```
     *
     * @category File System
     */ this.readFile = (path, /**
     * File content encoding, supports two encodings:
     * - utf8: read file as text file, return data in string type.
     * - binary: read file as binary file, return data in Uint8Array type.
     *
     * @defaultValue binary
     */ encoding, param)=>{
            if (encoding === void 0) encoding = "binary";
            let { signal } = param === void 0 ? {} : param;
            return this.#send({
                type: FFMessageType.READ_FILE,
                data: {
                    path,
                    encoding
                }
            }, undefined, signal);
        };
        /**
     * Delete a file.
     *
     * @category File System
     */ this.deleteFile = (path, param)=>{
            let { signal } = param === void 0 ? {} : param;
            return this.#send({
                type: FFMessageType.DELETE_FILE,
                data: {
                    path
                }
            }, undefined, signal);
        };
        /**
     * Rename a file or directory.
     *
     * @category File System
     */ this.rename = (oldPath, newPath, param)=>{
            let { signal } = param === void 0 ? {} : param;
            return this.#send({
                type: FFMessageType.RENAME,
                data: {
                    oldPath,
                    newPath
                }
            }, undefined, signal);
        };
        /**
     * Create a directory.
     *
     * @category File System
     */ this.createDir = (path, param)=>{
            let { signal } = param === void 0 ? {} : param;
            return this.#send({
                type: FFMessageType.CREATE_DIR,
                data: {
                    path
                }
            }, undefined, signal);
        };
        /**
     * List directory contents.
     *
     * @category File System
     */ this.listDir = (path, param)=>{
            let { signal } = param === void 0 ? {} : param;
            return this.#send({
                type: FFMessageType.LIST_DIR,
                data: {
                    path
                }
            }, undefined, signal);
        };
        /**
     * Delete an empty directory.
     *
     * @category File System
     */ this.deleteDir = (path, param)=>{
            let { signal } = param === void 0 ? {} : param;
            return this.#send({
                type: FFMessageType.DELETE_DIR,
                data: {
                    path
                }
            }, undefined, signal);
        };
    }
}

const readFromBlobOrFile = (blob)=>new Promise((resolve, reject)=>{
        const fileReader = new FileReader();
        fileReader.onload = ()=>{
            const { result } = fileReader;
            if (result instanceof ArrayBuffer) {
                resolve(new Uint8Array(result));
            } else {
                resolve(new Uint8Array());
            }
        };
        fileReader.onerror = (event)=>{
            var _event_target_error, _event_target;
            reject(Error(`File could not be read! Code=${(event == null ? void 0 : (_event_target = event.target) == null ? void 0 : (_event_target_error = _event_target.error) == null ? void 0 : _event_target_error.code) || -1}`));
        };
        fileReader.readAsArrayBuffer(blob);
    });
/**
 * An util function to fetch data from url string, base64, URL, File or Blob format.
 *
 * Examples:
 * ```ts
 * // URL
 * await fetchFile("http://localhost:3000/video.mp4");
 * // base64
 * await fetchFile("data:<type>;base64,wL2dvYWwgbW9yZ...");
 * // URL
 * await fetchFile(new URL("video.mp4", import.meta.url));
 * // File
 * fileInput.addEventListener('change', (e) => {
 *   await fetchFile(e.target.files[0]);
 * });
 * // Blob
 * const blob = new Blob(...);
 * await fetchFile(blob);
 * ```
 */ const fetchFile = async (file)=>{
    let data;
    if (typeof file === "string") {
        /* From base64 format */ if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file)) {
            data = atob(file.split(",")[1]).split("").map((c)=>c.charCodeAt(0));
        /* From remote server/URL */ } else {
            data = await (await fetch(file)).arrayBuffer();
        }
    } else if (file instanceof URL) {
        data = await (await fetch(file)).arrayBuffer();
    } else if (file instanceof File || file instanceof Blob) {
        data = await readFromBlobOrFile(file);
    } else {
        return new Uint8Array();
    }
    return new Uint8Array(data);
};

const getFrameName = (frame)=>`${String(frame).padStart(5, "0")}.png`;
/**
 * @typedef {object} FFmpegEncoderOptions
 * @property {FFmpegEncoderEncoderOptions} [encoderOptions={}]
 */ /**
 * @typedef {import("@ffmpeg/ffmpeg/dist/esm/types.js").FFMessageLoadConfig} FFmpegEncoderEncoderOptions
 * @see [FFmpeg#load]{@link https://ffmpegwasm.netlify.app/docs/api/ffmpeg/classes/FFmpeg#load}
 */ class FFmpegEncoder extends Encoder$1 {
    static #_ = this.supportedExtensions = [
        "mp4",
        "webm"
    ];
    /**
   * @param {FFmpegEncoderOptions} [options]
   */ constructor(options){
        super(options);
    }
    async init(options) {
        super.init(options);
        this.encoder = new FFmpeg();
        this.encoder.on("log", (param)=>{
            let { message } = param;
            console.log(message);
        });
        await this.encoder.load({
            ...this.encoderOptions
        });
        this.frameCount = 0;
    }
    async encode(frame, frameNumber) {
        await this.encoder.writeFile(getFrameName(frameNumber), await fetchFile(frame));
        this.frameCount++;
    }
    async stop() {
        const outputFilename = `output.${this.extension}`;
        const codec = this.extension === "mp4" ? "libx264" : "libvpx";
        await this.encoder.exec(`-framerate ${this.frameRate} -pattern_type glob -i *.png -s ${this.width}x${this.height} -pix_fmt yuv420p -c:v ${codec} ${outputFilename}`.split(" "));
        const data = await this.encoder.readFile(outputFilename);
        for(let i = 0; i < this.frameCount; i++){
            try {
                this.encoder.deleteFile(getFrameName(i));
            } catch (error) {
                console.error(error);
            }
        }
        try {
            this.encoder.deleteFile(outputFilename);
        } catch (error) {
            console.error(error);
        }
        return data;
    }
    async dispose() {
        await this.encoder.terminate();
        this.encoder = null;
    }
}
var FFmpegEncoder$1 = FFmpegEncoder;

/**
 * @typedef {object} MediaCaptureEncoderOptions
 * @property {number} [flushFrequency=10]
 * @property {MediaCaptureEncoderEncoderOptions} [encoderOptions={}]
 */ /**
 * @typedef {MediaRecorderOptions} MediaCaptureEncoderEncoderOptions
 * @see [MediaRecorder#options]{@link https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/MediaRecorder#options}
 */ class MediaCaptureEncoder extends Encoder$1 {
    static #_ = this.supportedExtensions = [
        "mkv",
        "webm"
    ];
    static #_2 = this.defaultOptions = {
        extension: MediaCaptureEncoder.supportedExtensions[0],
        frameMethod: "requestFrame",
        flushFrequency: 10
    };
    /**
   * @param {MediaCaptureEncoderOptions} [options]
   */ constructor(options){
        super({
            ...MediaCaptureEncoder.defaultOptions,
            ...options
        });
    }
    async init(options) {
        super.init(options);
        this.chunks = [];
        // Forces the use of requestFrame. Use canvas-record v3 for real-time capture.
        this.stream = this.canvas.captureStream(this.frameRate);
        this.recorder = new MediaRecorder(this.stream, {
            mimeType: this.mimeType,
            // audioBitsPerSecond: 128000, // 128 Kbit/sec
            // videoBitsPerSecond: 2500000, // 2.5 Mbit/sec
            ...this.encoderOptions
        });
        this.recorder.ondataavailable = (event)=>{
            event.data.size && this.chunks.push(event.data);
            if (this.q) this.q.resolve();
        };
    }
    async encode(frame, number) {
        if (this.recorder.state !== "recording") {
            this.chunks = [];
            this.recorder.start();
        }
        if (!this.frameRate !== 0) {
            var _this_stream_getVideoTracks;
            ((this.stream.getVideoTracks == null ? void 0 : (_this_stream_getVideoTracks = this.stream.getVideoTracks.call(this.stream)) == null ? void 0 : _this_stream_getVideoTracks[0]) || this.stream).requestFrame();
        }
        if (this.flushFrequency && (number + 1) % this.flushFrequency === 0) {
            this.recorder.requestData();
        }
    }
    async stop() {
        this.q = new Deferred();
        this.recorder.stop();
        await this.q.promise;
        delete this.q;
        return this.chunks;
    }
    async dispose() {
        this.recorder = null;
        this.stream = null;
    }
}
var MediaCaptureEncoder$1 = MediaCaptureEncoder;

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Encoder: Encoder$1,
  FFmpegEncoder: FFmpegEncoder$1,
  FrameEncoder: FrameEncoder$1,
  GIFEncoder: GIFEncoder$1,
  H264MP4Encoder: H264MP4Encoder$1,
  MP4WasmEncoder: MP4WasmEncoder$1,
  MediaCaptureEncoder: MediaCaptureEncoder$1,
  WebCodecsEncoder: WebCodecsEncoder$1
});

export { Deferred, index as Encoders, Recorder, RecorderStatus, downloadBlob, estimateBitRate, formatDate, formatSeconds, isWebCodecsSupported, nextMultiple };