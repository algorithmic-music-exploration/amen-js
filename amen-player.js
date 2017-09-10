var amenPlayer = function(context, effects) {
    var queueTime = 0;
    var audioGain = context.createGain();
    var currentlyQueued = new Array();
    var onPlayCallback = null;
    var afterPlayCallback = null;
    var currentTriggers = new Array();
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
        var theTime = context.currentTime;
        // why in heaven's name do I have three ways of playing?
        // I am sure there was a good reason for this, but man
        if (isAudioBuffer(q)) {
            var audioSource = context.createBufferSource();
            audioSource.buffer = q;
            audioSource.connect(audioGain);
            currentlyQueued.push(audioSource);
            audioSource.start(when);

            if (onPlayCallback != null) {
                theTime = (when - context.currentTime) *  1000;
                currentTriggers.push(setTimeout(onPlayCallback, theTime));
            }

            if (afterPlayCallback != null) {
                theTime = (when - context.currentTime + parseFloat(q.duration)) *  1000;
                currentTriggers.push(setTimeout(afterPlayCallback, theTime));
            }

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
        } else if (isQuantum(q)) {
            var audioQuantumSource = context.createBufferSource();
            audioQuantumSource.buffer = q.track.buffer;
            audioQuantumSource.connect(audioGain);
            q.audioQuantumSource = audioQuantumSource;
            currentlyQueued.push(audioQuantumSource);
            audioQuantumSource.start(when, q.start, q.duration);

            // I need to clean up all these ifs
            if ('syncBuffer' in q) {
                var audioSyncSource = context.createBufferSource();
                audioSyncSource.buffer = q.syncBuffer;
                audioSyncSource.connect(audioGain);
                currentlyQueued.push(audioSyncSource);
                audioSyncSource.start(when);
            }

            if (onPlayCallback != null) {
                theTime = (when - context.currentTime) *  1000;
                currentTriggers.push(setTimeout(onPlayCallback, theTime));
            }
            if (afterPlayCallback != null) {
                theTime = (when - context.currentTime + parseFloat(q.duration)) *  1000;
                currentTriggers.push(setTimeout(afterPlayCallback, theTime));
            }
            return (when + parseFloat(q.duration));
        }
        else if (isSilence(q)) {
            return (when + parseFloat(q.duration));
        }
        else {
            console.log('cannot play ' + q);
            return when;
        }
    } // end play

    return player;
};

exports.amenPlayer = amenPlayer;
