require('web-audio-test-api');
amenPlayer = require('../amen-player');

var context = new AudioContext();
var player = amenPlayer.amenPlayer(context, null);

test('amen player dummy test', () => {
    expect(true).toEqual(true);
});

