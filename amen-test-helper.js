// Helper functions for creating track and segment objects for testing
var getSegments = function() {
    var segment = {};
    segment.amplitude = 0.1;
    segment.centroid = 3000;
    segment.start = 0.0;
    segment.duration = 0.5;
    segment.kind = 'segmentOne';
    segment.loudness_max = 0.1;
    segment.loudness_max_time = 0;
    segment.loudness_start = 0;
    segment.timbre = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var segmentTwo = {};
    segmentTwo.amplitude = 0.1;
    segmentTwo.centroid = 3000;
    segmentTwo.start = 0.5;
    segmentTwo.duration = 0.5;
    segmentTwo.kind = 'segmentTwo';
    segmentTwo.loudness_max = 0.1;
    segmentTwo.loudness_max_time = 0.5;
    segmentTwo.loudness_start = 0;
    segmentTwo.timbre = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var segmentThree = {};
    segmentThree.amplitude = 0.1;
    segmentThree.centroid = 3000;
    segmentThree.start = 1.0;
    segmentThree.duration = 0.5;
    segmentThree.kind = 'segmentThree';
    segmentThree.loudness_max = 0.1;
    segmentThree.loudness_max_time = 1.0;
    segmentThree.loudness_start = 0;
    segmentThree.timbre = [9.0, 9.0, 9.0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    return [segment, segmentTwo, segmentThree];
};


var mockTrack = function() {
    var track = {};
    track.status = null;
    track.buffer = null;

    var analysis = {};
    analysis.tempo = 129.0;

    analysis.sections = [];
    analysis.bars = [];
    analysis.beats = [];
    analysis.tatums = [];
    analysis.segments = getSegments();

    var beat = {};
    beat.amplitude = 0.1;
    beat.centroid = 3000;
    beat.start = 0.0;
    beat.duration = 1.0;
    beat.kind = 'beat';
    beat.loudness_max = 0.6;
    beat.loudness_max_time = 0.6;
    beat.loudness_start = 0;
    beat.timbre = [3.0, 3.0, 3.0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    analysis.beats.push(beat);

    track.analysis = analysis;
    return track;
};

exports.mockTrack = mockTrack;
exports.getSegments = getSegments;
