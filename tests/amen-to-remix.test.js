amenToRemix = require('../amen-to-remix');


var track = {};
track.status = null;
track.buffer = null;

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
segment.duration = 0.5;
segment.kind = "segment";
segment.loudness_max = 0.1;
segment.loudness_max_time = 0;
segment.loudness_start = 0;
segment.timbre = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

analysis.segments.push(segment);
analysis.segments.push(segment);
track.analysis = analysis;

var result = amenToRemix.amenToRemix(track)

 test('amenToRemix adds a dummy confidence value to each segment', () => {
       expect(result.analysis.segments[0].confidence).toBe(0.0);
 });

// This will have to change as we build out the other tests
 test('amenToRemix filters segments that are similar', () => {
       expect(result.analysis.fsegments.length).toBe(2);
 });

test('Dummy test to make sure that jest is working', () => {
    expect(true).toBe(true);
});
