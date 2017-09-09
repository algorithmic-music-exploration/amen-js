// amen.js
// Heavily based on Paul Lamere's Infinite Jukebox and remix.js by The Echo Nest.  Big hugs.
// Need to handle proper packaging for browser stuff, too!
var initializeAmen = function(context) {

    // OK, so there's a few choices here:
    // I can nest the needed functions in each public function
    // I can make other files
    // I can make other objects in this file.
    // I also have this semi-global need for the audio context, hmm.
        // I could pass it into getPlayer, as well, hmmmmm.

    // oh wow, need to make all of this speak Promises
    var amen = {
        // This function can probably just become a Promise?
        // shoudl be public!
        loadTrack: function(analysisURL, trackURL, callback) {
            var track = new Object();

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
    }


    // HELPERS FOR LOADING AUDIO
    // basically a promise
    function prepareTrack(track, trackURL, callback) {
        if (track.status == 'complete') {
            preprocessTrack(track);
            fetchAudio(trackURL, track, callback);
        } else {
            track.status = 'error: incomplete analysis';
        }
    }

    // Once we promise this up, we can take the callback out!
    function fetchAudio(url, track, callback) {
        var request = new XMLHttpRequest();
        trace('fetching audio ' + url);
        track.buffer = null;
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        this.request = request;

        request.onload = function() {
            trace('audio loading ...');
            context.decodeAudioData(request.response,
                function(buffer) {      // completed function
                    track.buffer = buffer;
                    track.status = 'ok';
                    callback(track, 100);
                },
                function(e) { // error function
                    track.status = 'error: loading audio';
                    console.log('audio error', e);
                }
            );
        };

        request.onerror = function(e) {
            trace('error loading loaded', e);
            track.status = 'error: loading audio';
        };

        request.onprogress = function(e) {
            var percent = Math.round(e.loaded * 100 / e.total);
            callback(track, percent);
        };

        request.send();
    } // end fetchAudio

    function preprocessTrack(track) {
        trace('preprocessTrack');
        // Eventually we will have sections, bars, and maybe tatums here
        var types = ['segments', 'beats'];

        for (var i in types) {
            var type = types[i];
            trace('preprocessTrack ' + type);
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

    // HELPERS FOR CONSOLE LOGGING
    function trace(text) {
        console.log(text);
    }

    function error(s) {
        console.log(s);
    }

    return amen;
};

exports.amen = initializeAmen;
