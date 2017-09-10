require('web-audio-test-api');
amenPlayer = require('../amen-player');

var context = new AudioContext();
var player = amenPlayer.amenPlayer(context, null);

test('amen player dummy test', () => {
    expect(true).toEqual(true);
});

test('amenPlayer checks the current time', () => {
    res = (context.currentTime === player.curTime());
    expect(res).toEqual(true);
});

test('amenPlayer plays audio and advances time', () => {
    var injectedBufferSrc = context.createBufferSource();
    var mockCreateBufferSource = jest.fn();
    mockCreateBufferSource.mockReturnValue(injectedBufferSrc);
    context.createBufferSource = mockCreateBufferSource;

    // create a half-second buffer at 44100
    var buffer = context.createBuffer(2, 22050, 44100);
    res = player.play(0, buffer);

    expect(res).toEqual(0.5);

    context.$processTo('00:00.000');
    expect(injectedBufferSrc.$state).toEqual('PLAYING');
    context.$processTo('00:00.501');
    expect(injectedBufferSrc.$state).toEqual('FINISHED');
});
