require('web-audio-test-api');
var mock = require('xhr-mock')
var amen = require('../amen');
var context = new AudioContext();

// ho ho ho let's make this a helper function soooon
var fauxTrack = {}
fauxTrack.status = null;
fauxTrack.buffer = null;

var analysis = {};
analysis.tempo = 129.0

analysis.sections = [];
analysis.bars = [];
analysis.beats = [];
analysis.tatums = [];
analysis.segments = [];

var segment = {};
segment.amplitude = 0.1;
segment.centroid = 3000;
segment.start = 0.0;
segment.duration = 0.5;
segment.kind = "segment";
segment.loudness_max = 0.1;
segment.loudness_max_time = 0;
segment.loudness_start = 0;
segment.timbre = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var segmentTwo = {};
segmentTwo.amplitude = 0.1;
segmentTwo.centroid = 3000;
segmentTwo.start = 0.5;
segmentTwo.duration = 0.5;
segmentTwo.kind = "segmentTwo";
segmentTwo.loudness_max = 0.1;
segmentTwo.loudness_max_time = 0.5;
segmentTwo.loudness_start = 0;
segmentTwo.timbre = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var segmentThree = {};
segmentThree.amplitude = 0.1;
segmentThree.centroid = 3000;
segmentThree.start = 1.0;
segmentThree.duration = 0.5;
segmentThree.kind = "segment";
segmentThree.loudness_max = 0.1;
segmentThree.loudness_max_time = 1.0;
segmentThree.loudness_start = 0;
segmentThree.timbre = [9.0, 9.0, 9.0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

analysis.segments.push(segment);
analysis.segments.push(segmentTwo);
analysis.segments.push(segmentThree);
fauxTrack.analysis = analysis

mock.setup();
beforeEach(() => mock.setup());
afterEach(() => mock.teardown());

test('amen loads the track and the audio', () => {
    var analysisUrl = 'http://some.s3url.analysis.json'
    var trackUrl = 'http://some.s3url.wav'

    var analysisData = JSON.stringify(fauxTrack)
    analysisData = JSON.stringify(analysisData) // the server returns double-encoded JSON, so we have to as well!
    mock.get(analysisUrl, function(req, res) {
        return res
          .status(200)
          .body(analysisData);
    });

    var audioData = new ArrayBuffer(1024);
    mock.get(trackUrl, function(req, res) {
        return res
          .status(200)
          .body(audioData);
    });

    var a = amen.amen(context);
    return a.loadTrack(analysisUrl, trackUrl)
});
