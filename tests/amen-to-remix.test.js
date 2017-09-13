var amenToRemix = require('../amen-to-remix');
var mockTrack = require('../amen-test-helper');

var track = mockTrack.mockTrack();
var segments = mockTrack.getSegments();
var result = amenToRemix.amenToRemix(track)

test('amenToRemix adds a dummy confidence value to each segment', () => {
    expect(result.analysis.segments[0].confidence).toBe(0.0);
});

// As the test is set up, this filters the last segment out
test('amenToRemix filters segments that are similar', () => {
    expect(result.analysis.fsegments.length).toBe(2);
});

test('amenToRemix connects first overlapping segment', () => {
    expect(result.analysis.beats[0].oseg.kind).toEqual('segmentOne');
});

test('amenToRemix connects all overlapping segments', () => {
    expect(result.analysis.beats[0].overlappingSegments.length).toBe(3);
    expect(result.analysis.beats[0].overlappingSegments[0].kind).toEqual('segmentOne');
    expect(result.analysis.beats[0].overlappingSegments[1].kind).toEqual('segmentTwo');
    expect(result.analysis.beats[0].overlappingSegments[2].kind).toEqual('segmentThree');
});

