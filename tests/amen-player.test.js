require('web-audio-test-api');
amenPlayer = require('../amen-player');

jest.useFakeTimers();
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

    res = player.play(1, playbackArray);
    expect(res).toEqual(1.5);

    context.$processTo('00:01.000');
    expect(injectedBufferSrc.$state).toEqual('PLAYING');
    context.$processTo('00:01.501');
    expect(injectedBufferSrc.$state).toEqual('FINISHED');
});

test('amenPlayer plays from an AudioQuantum and advances time', () => {
    res = setupBuffers(context)
    var buffer = res.buffer;
    var injectedBufferSrc = res.injectedBufferSrc
    var playbackQuantum = {
                           'start': 0,
                           'duration': 0.5,
                           'track': {'buffer': buffer}
                           }

    res = player.play(2, playbackQuantum);
    expect(res).toEqual(2.5);

    context.$processTo('00:02.000');
    expect(injectedBufferSrc.$state).toEqual('PLAYING');
    context.$processTo('00:02.501');
    expect(injectedBufferSrc.$state).toEqual('FINISHED');
});

test('amenPlayer ignores silence, but advances time', () => {
    res = setupBuffers(context)
    var buffer = res.buffer;
    var injectedBufferSrc = res.injectedBufferSrc
    var playbackQuantum = {
                           'duration': 0.5,
                           'isSilence': true,
                           }

    res = player.play(3, playbackQuantum);
    expect(res).toEqual(3.5);

    context.$processTo('00:03.000');
    expect(injectedBufferSrc.$state).toEqual('UNSCHEDULED');
});


test('amenPlayer queues playback', () => {
    res = setupBuffers(context)
    var buffer = res.buffer;
    var injectedBufferSrc = res.injectedBufferSrc
    player.queue(buffer);

    context.$processTo('00:00.000');
    expect(injectedBufferSrc.$state).toEqual('PLAYING');
    context.$processTo('00:00.501');
    expect(injectedBufferSrc.$state).toEqual('FINISHED');
});

test('amenPlayer stops playback', () => {
    res = setupBuffers(context)
    var buffer = res.buffer;
    var injectedBufferSrc = res.injectedBufferSrc
    player.play(0, buffer);
    player.stop();

    context.$processTo('00:00.000');
    expect(injectedBufferSrc.$state).toEqual('FINISHED');
    context.$processTo('00:00.501');
    expect(injectedBufferSrc.$state).toEqual('FINISHED');
});

test('amenPlayer triggers both callback functions', () => {
    res = setupBuffers(context)
    var buffer = res.buffer;
    var injectedBufferSrc = res.injectedBufferSrc
    var mockOnPlayback = jest.fn();
    var mockAfterPlayback = jest.fn();
    player.addOnPlayCallback(mockOnPlayback);
    player.addAfterPlayCallback(mockAfterPlayback);
    res = player.play(0, buffer);

    context.$processTo('00:00.501');
    jest.runAllTimers();

    expect(mockOnPlayback.mock.calls.length).toBe(1);
    expect(mockAfterPlayback.mock.calls.length).toBe(1);
});
