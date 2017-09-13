require('web-audio-test-api');
var mock = require('xhr-mock')
var mockTrack = require('../amen-test-helper');
var amen = require('../amen');
var context = new AudioContext();

var fauxTrack = mockTrack.mockTrack();
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
    return a.loadTrack(analysisUrl, trackUrl).then(track => {
        expect(track.analysis.analysis.segments.length).toEqual(3);
        expect(track.analysis.analysis.segments[0].centroid).toEqual(3000);
        expect(track.analysis.analysis.segments[2].timbre[0]).toEqual(9);
        expect(track.buffer.length).toEqual(1024);
        expect(track.status).toEqual('complete');
    });
});
