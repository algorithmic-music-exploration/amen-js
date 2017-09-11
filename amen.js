// amen.js
// Heavily based on Paul Lamere's Infinite Jukebox and remix.js by The Echo Nest.  Big hugs.
var initializeAmen = function(context) {
    var amen = {
        // This function can probably just become a Promise?
        loadTrack: function(analysisURL, trackURL, callback) {
            var track = new Object();


            var  myFirstPromise = new Promise((resolve, reject) => {
              setTimeout(function(){
                resolve("Success!"); // Yay! Everything went well!
              }, 250);
            }


            var request = new XMLHttpRequest();
            request.open('GET', analysisURL, true);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    // Success!
                    track.analysis = JSON.parse(request.responseText);
                    // TODO - figure out why our JSON is double-encoded?
                    track.analysis = JSON.parse(track.analysis);
                    track.status = 'complete';
                    prepareTrack(track, trackURL, callback);
                } else {
                    // We reached our target server, but it returned an error
                }
            };
            request.onerror = function() {
                // There was a connection error of some sort
            };
            request.send();
        }
    };

    function prepareTrack(track, trackURL, callback) {
        if (track.status == 'complete') {
            preprocessTrack(track);
            fetchAudio(trackURL, track, callback);
        } else {
            track.status = 'error: incomplete analysis';
        }
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
    } // end preprocessTrack

    // Once we promise this up, we can take the callback out!
    function fetchAudio(url, track, callback) {
        var request = new XMLHttpRequest();
        track.buffer = null;
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        this.request = request;

        request.onload = function() {
            context.decodeAudioData(request.response,
                function(buffer) {      // completed function
                    track.buffer = buffer;
                    track.status = 'ok';
                    callback(track, 100);
                },
                function(error) {
                    console.error('Audio could not be loaded', error);
                    track.status = 'error: loading audio';
                }
            );
        };

        request.onerror = function(error) {
            console.error('Audio could not be loaded', error);
            track.status = 'error: loading audio';
        };

        request.onprogress = function(e) {
            var percent = Math.round(e.loaded * 100 / e.total);
            callback(track, percent);
        };

        request.send();
    } // end fetchAudio

    return amen;
};

exports.amen = initializeAmen;
