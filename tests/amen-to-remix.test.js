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

var beat = {};
beat.amplitude = 0.1;
beat.centroid = 3000;
beat.start = 0.0;
beat.duration = 1.0;
beat.kind = "beat";
beat.loudness_max = 0.6;
beat.loudness_max_time = 0.6;
beat.loudness_start = 0;
beat.timbre = [3.0, 3.0, 3.0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

analysis.beats.push(beat);

track.analysis = analysis;


var result = amenToRemix.amenToRemix(track)
 test('amenToRemix adds a dummy confidence value to each segment', () => {
       expect(result.analysis.segments[0].confidence).toBe(0.0);
 });

// As the test is set up, this filters the last segment out
 test('amenToRemix filters segments that are similar', () => {
       expect(result.analysis.fsegments.length).toBe(2);
 });

 test('amenToRemix connects first overlapping segment', () => {
       expect(result.analysis.beats[0].oseg).toEqual(segment);
 });

 test('amenToRemix connects all overlapping segments', () => {
       expect(result.analysis.beats[0].overlappingSegments.length).toBe(3);
       expect(result.analysis.beats[0].overlappingSegments).toEqual(analysis.segments);
 });

