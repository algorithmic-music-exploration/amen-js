var amenToRemix = function(track) {
    connectQuanta(track, 'sections', 'bars');
    connectQuanta(track, 'bars', 'beats');
    connectQuanta(track, 'beats', 'tatums');
    connectQuanta(track, 'tatums', 'segments');

    connectFirstOverlappingSegment(track, 'bars');
    connectFirstOverlappingSegment(track, 'beats');
    connectFirstOverlappingSegment(track, 'tatums');

    connectAllOverlappingSegments(track, 'bars');
    connectAllOverlappingSegments(track, 'beats');
    connectAllOverlappingSegments(track, 'tatums');

    filterSegments(track);

    addConfidenceToSegments(track);

    return track;
};

// Hack to make Infinite Juke work.
// Amen may return confidence for segments at some point, but not now
function addConfidenceToSegments(track) {
    for (var i = 0; i < track.analysis.segments.length; i++) {
        var seg = track.analysis.segments[i];
        seg.confidence = 0.0;
    }
} 

function isSimilar(seg1, seg2) {
    var threshold = 1;
    var distance = timbral_distance(seg1, seg2);
    return (distance < threshold);
}
 
function timbral_distance(s1, s2) {
    return euclidean_distance(s1.timbre, s2.timbre);
}

function euclidean_distance(v1, v2) {
    var sum = 0;
    for (var i = 0; i < 3; i++) {
        var delta = v2[i] - v1[i];
        sum += delta * delta;
    }
    return Math.sqrt(sum);
}

function filterSegments(track) {
    var threshold = .3;
    var fsegs = [];
    fsegs.push(track.analysis.segments[0]);
    for (var i = 1; i < track.analysis.segments.length; i++) {
        var seg = track.analysis.segments[i];
        var last = fsegs[fsegs.length - 1];
        if (isSimilar(seg, last) && seg.confidence < threshold) {
            fsegs[fsegs.length -1].duration += seg.duration;
        } else {
            fsegs.push(seg);
        }
    }
    track.analysis.fsegments = fsegs;
}

function connectQuanta(track, parent, child) {
    var last = 0;
    var qparents = track.analysis[parent];
    var qchildren = track.analysis[child];

    for (var i in qparents) {
        var qparent = qparents[i];
        qparent.children = [];

        for (var j = last; j < qchildren.length; j++) {
            var qchild = qchildren[j];
            if (qchild.start >= qparent.start
                        && qchild.start < qparent.start + qparent.duration) {
                qchild.parent = qparent;
                qchild.indexInParent = qparent.children.length;
                qparent.children.push(qchild);
                last = j;
            } else if (qchild.start > qparent.start) {
                break;
            }
        }
    }
}

function connectFirstOverlappingSegment(track, quanta_name) {
    var last = 0;
    var quanta = track.analysis[quanta_name];
    var segs = track.analysis.segments;

    for (var i = 0; i < quanta.length; i++) {
        var q = quanta[i];

        for (var j = last; j < segs.length; j++) {
            var qseg = segs[j];
            if (qseg.start >= q.start) {
                q.oseg = qseg;
                last = j;
                break;
            }
        }
    }
}

function connectAllOverlappingSegments(track, quanta_name) {
    var last = 0;
    var quanta = track.analysis[quanta_name];
    var segs = track.analysis.segments;

    for (var i = 0; i < quanta.length; i++) {
        var q = quanta[i];
        q.overlappingSegments = [];

        for (var j = last; j < segs.length; j++) {
            var qseg = segs[j];
            // seg starts before quantum so no
            if ((qseg.start + qseg.duration) < q.start) {
                continue;
            }
            // seg starts after quantum so no
            if (qseg.start > (q.start + q.duration)) {
                break;
            }
            last = j;
            q.overlappingSegments.push(qseg);
        }
    }
}

exports.amenToRemix = amenToRemix;
