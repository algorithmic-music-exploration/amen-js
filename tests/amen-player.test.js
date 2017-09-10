require('web-audio-test-api');
amenPlayer = require('../amen-player');

var context;
var player;

function setupBuffers(context) {
    // Mock the buffer creation process so we can follow what happened
    var injectedBufferSrc = context.createBufferSource();
    var mockCreateBufferSource = jest.fn();
    mockCreateBufferSource.mockReturnValue(injectedBufferSrc);
    context.createBufferSource = mockCreateBufferSource;

    // create a half-second buffer at 44100
    var buffer = context.createBuffer(2, 22050, 44100);

    return {
            'buffer': buffer,
            'injectedBufferSrc': injectedBufferSrc
           }
}

beforeEach(() => {
    context = new AudioContext();
    player = amenPlayer.amenPlayer(context, null);
});

test('amenPlayer checks the current time', () => {
    res = (context.currentTime === player.curTime());
    expect(res).toEqual(true);
});

test('amenPlayer plays from a buffer and advances time', () => {
    res = setupBuffers(context)
    var buffer = res.buffer;
    var injectedBufferSrc = res.injectedBufferSrc
    res = player.play(0, buffer);
    expect(res).toEqual(0.5);

    context.$processTo('00:00.000');
    expect(injectedBufferSrc.$state).toEqual('PLAYING');
    context.$processTo('00:00.501');
    expect(injectedBufferSrc.$state).toEqual('FINISHED');
});

test('amenPlayer plays from an array and advances time', () => {
    res = setupBuffers(context)
    var buffer = res.buffer;
    var injectedBufferSrc = res.injectedBufferSrc
    var playbackArray = [buffer]

    res = player.play(0, playbackArray);
    expect(res).toEqual(0.5);

    context.$processTo('00:00.000');
    expect(injectedBufferSrc.$state).toEqual('PLAYING');
    context.$processTo('00:00.501');
    expect(injectedBufferSrc.$state).toEqual('FINISHED');
});
