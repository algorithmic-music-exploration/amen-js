[![Build Status](https://travis-ci.org/algorithmic-music-exploration/amen-js.svg?branch=master)](https://travis-ci.org/algorithmic-music-exploration/amen-js.svg?branch=master)
[![GitHub license](https://img.shields.io/badge/license-BSD-blue.svg)](https://raw.githubusercontent.com/algorithmic-music-exploration/amen/master/LICENSE)

# amen.js
The JavaScript wrapper for Amen.  Amen.js uses the analysis from Amen (probably via the Amen Server) to create a `track` object that knows when each beat and segment ststart.  It then uses Web Audio API to play those chunks of audio whenever and however you want.

# Installation
For now, you just have to download `amen.js`, and `amen-player.js`, and put them in a webpage like you would any other boring JavaScript file.  Support for npm and modern JavaScript packaging is coming, but we're not there yet.

# How It Works
`amen.js` needs two things to work:  an audio file and an analysis file.  The `loadTrack` function reads these two files, and returns a `track` object.  Then, `amen-player.js` allows the chunks of audio from a `track` object to be played back.

To get that audio file and analysis file, you'll need to put each file on a web server where they can be accessed via a client side request.  You can generate an analyssi file by hand by using the Python version of Amen.  [See here for an example](https://github.com/algorithmic-music-exploration/amen/blob/master/examples/echo_nest_json.py)

To allow a user to upload an audio file of their choice and get it analyzed, you'll need the [Amen Server](https://github.com/algorithmic-music-exploration/amen-server).  Setting this server up is complicated!  There's a tutorial in the Amen Server repo, but it can be tricky.

Once your server is running, you just POST an audio file to it, and it returns the URLs where you can find the audio file and the analysis.  You pass those URLs to amen.js, and you're off.

# Examples

The most basic example is [playback.html](http://tide-pool.ca/amen-examples/playback.html).  It loads the analysis and audio from two static files on Amazon S3, and then plays the first four beats of the audio back.  It makes use of the charictaristic `amen.loadTrack(analysisUrl, trackUrl).then(remixFunction)` pattern - remixFunction is where the audio is manipulated and played back.

[uploader.html](http://tide-pool.ca/amen-examples/uploader.html) is more complicated, and requires that you have your own instance of Amen Server running.  It uploads an audio file, then polls the two URLs that are returned to eventually load the audio and analysis, and then play back the first four beats.  (Note that this version 

The final example is _much_ more complicated - it's a fork of Paul Lamere's Infinite Jukebox, and is included here to show the levels of complexity that this sort of manipulation can do.  Check it out [here!](http://tide-pool.ca/amen-examples/infinitejuke/index.html).

(Note that the the latter two examples are _not actually uploading files to an instance of Amen Server_.  Instead, they're hijacking the response from a default server to use static files.  This is well commented in the code, don't worry!)

# Thanks
- Paul Lamere
- Ben Lacker
