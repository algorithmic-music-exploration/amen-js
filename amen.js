// amen.js
// Heavily based on Paul Lamere's Infinite Jukebox and remix.js by The Echo Nest.  Big hugs.
var initializeAmen = function(context) {
    var amen = {
        loadTrack: function(analysisURL, trackURL) {
            var track = new Object();
            return fetchAnalysis(analysisURL, trackURL, track)
            .then(fetchAudio)
            .then(preprocessTrack);
        },
    };

    function fetchAnalysis(analysisURL, trackURL, track) {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            var errorMsg = "error: analysis could not be loaded";
            request.open('GET', analysisURL, true);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    track.analysis = JSON.parse(request.responseText);
                    track.analysis = JSON.parse(track.analysis);
                    track.status = 'analysis loaded';
                    var trackInfo = [trackURL, track];
                    resolve(trackInfo);
                } else {
                    console.error(errorMsg);
                    track.status = errorMsg
                    reject(errorMsg);
                }
            };
            request.onerror = function() {
                console.error(errorMsg);
                track.status = errorMsg
                reject(errorMsg);
            };
            request.send();
        });
    }

    function fetchAudio(trackInfo) {
        return new Promise((resolve, reject) => {
            var trackURL = trackInfo[0];
            var track = trackInfo[1];
            track.buffer = null;

            var request = new XMLHttpRequest();
            var errorMsg = "error: audio could not be loaded";
            request.open('GET', trackURL, true);
            request.responseType = 'arraybuffer';
            request.onload = function() {
                context.decodeAudioData(request.response,
                    function(buffer) {      // completed function
                        track.buffer = buffer;
                        track.status = 'complete';
                        resolve(track);
                    },
                    function(error) {
                        console.error(errorMsg, error);
                        track.status = errorMsg
                        reject(errorMsg);
                    }
                );
            };
            request.onerror = function(error) {
                console.error(errorMsg, error);
                track.status = errorMsg
                reject(errorMsg);
            };
            request.send();
        });
    }

    function preprocessTrack(track) {
        // Eventually we will have sections, bars, and maybe tatums here
        var types = ['segments', 'beats'];

        for (var i in types) {
            var type = types[i];
            // This j might need to be a regular for loop ...
            for (var j in track.analysis[type]) {
                var qlist = track.analysis[type];
                j = parseInt(j);
                var q = qlist[j];

                q.start = parseFloat(q.start);
                q.duration = parseFloat(q.duration);
                q.confidence = parseFloat(q.confidence);

                q.loudness_max = parseFloat(q.loudness_max);
                q.loudness_max_time = parseFloat(q.loudness_max_time);
                q.loudness_start = parseFloat(q.loudness_start);

                for (var k = 0; k < q.pitches.length; k++) {
                    q.pitches[k] = parseFloat(q.pitches[k]);
                }
                for (var m = 0; m < q.timbre.length; m++) {
                    q.timbre[m] = parseFloat(q.timbre[m]);
                }

                q.track = track;
                q.which = j;

                if (j > 0) {
                    q.prev = qlist[j-1];
                } else {
                    q.prev = null;
                }

                if (j < qlist.length - 1) {
                    q.next = qlist[j+1];
                } else {
                    q.next = null;
                }
            }
        }
        return track;
    }

    return amen;
};

exports.amen = initializeAmen;
