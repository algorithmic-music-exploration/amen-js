var amenPlayer = function(context, effects) {
    var queueTime = 0;
    var currentlyQueued = new Array();
    var onPlayCallback = null;
    var afterPlayCallback = null;
    var currentTriggers = new Array();

    var audioGain = context.createGain();
    audioGain.gain.value = 1;

    // Connect effects
    effects = effects || [];
    effects.unshift(audioGain);
    for (var i = 0; i < effects.length -1; i++) {
        effects[i].connect(effects[i + 1]);
    }
    effects[i].connect(context.destination);

    // create the the actual player object that we get
    var player = {
        play: function(when, q) {
            return queuePlay(when, q);
        },

        addOnPlayCallback: function(callback) {
            onPlayCallback = callback;
        },

        addAfterPlayCallback: function(callback) {
            afterPlayCallback = callback;
        },

        // Do I need both this and play?  I sort of thing so ...
        queue: function(q) {
            var now = context.currentTime;
            if (now > queueTime) {
                queueTime = now;
            }
            queueTime = queuePlay(queueTime, q);
        },

        queueRest: function(duration) {
            queueTime += duration;
        },

        stop: function() {
            for (var i = 0; i < currentlyQueued.length; i++) {
                if (currentlyQueued[i] != null) {
                    currentlyQueued[i].stop();
                }
            }
            currentlyQueued = new Array();

            if (currentTriggers.length > 0) {
                for (var j = 0; j < currentTriggers.length; j++) {
                    clearTimeout(currentTriggers[j]);
                }
                currentTriggers = new Array();
            }
        },

        curTime: function() {
            return context.currentTime;
        },
    }; // end player declaration

    function isQuantum(a) {
        return 'start' in a && 'duration' in a;
    }

    function isAudioBuffer(a) {
        return 'getChannelData' in a;
    }

    function isSilence(a) {
        return 'isSilence' in a;
    }

    // private ugly thing for actually doing playback
    function queuePlay(when, q) {
        audioGain.gain.value = 1;

        if (isAudioBuffer(q) || isQuantum(q)) {
            playBuffer(when, q);

            // Ah, this was for playing two things at once, for cowbell.js
            if ('syncBuffer' in q) {
                var audioSyncSource = context.createBufferSource();
                audioSyncSource.buffer = q.syncBuffer;
                audioSyncSource.connect(audioGain);
                currentlyQueued.push(audioSyncSource);
                audioSyncSource.start(when);
            }

            processCallbacks(when, q);
            return when + parseFloat(q.duration);

        } else if (Array.isArray(q)) {
            // Correct for load times
            if (when == 0) {
                when = context.currentTime;
            }
            for (var i = 0; i < q.length; i++) {
                when = queuePlay(when, q[i]);
            }
            return when;
        } else if (isSilence(q)) {
            return (when + parseFloat(q.duration));
        }
        else {
            console.error('cannot play ' + q);
            return when;
        }
    } // end queuePlay

    function processCallbacks(when, q) {
        var theTime = context.currentTime;
        if (onPlayCallback != null) {
            theTime = (when - context.currentTime) *  1000;
            currentTriggers.push(setTimeout(onPlayCallback, theTime));
        }

        if (afterPlayCallback != null) {
            theTime = (when - context.currentTime + parseFloat(q.duration)) *  1000;
            currentTriggers.push(setTimeout(afterPlayCallback, theTime));
        }
    }

    function playBuffer(when, q) {
        var audioSource = context.createBufferSource();
        audioSource.connect(audioGain);
        currentlyQueued.push(audioSource);
        if (isQuantum(q)) {
            audioSource.buffer = q.track.buffer;
            audioSource.start(when, q.start, q.duration);
        } else {
            audioSource.buffer = q;
            audioSource.start(when);
        }
    }


    return player;
};

exports.amenPlayer = amenPlayer;
