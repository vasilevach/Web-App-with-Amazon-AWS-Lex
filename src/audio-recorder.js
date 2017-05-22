import React from 'react';

export default class AudioRecorder extends React.Component {

    constructor(props) {
        super(props);
        var _this = this;

        this.state = {
            recordStyle: "idle",
            audioURL : ""
        };

      //variables
        this.recorder = {};
        this.audioContext = new AudioContext();
        this.userAudio = {};
        this.lexAudio = {};

      //configurations
        var AWSConfig = new AWS.CognitoIdentityCredentials({IdentityPoolId:'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'});
        var LexConfig = new AWS.Config({
            credentials: AWSConfig,
            region: 'us-east-1',
        });

        AWS.config.update({
            credentials: AWSConfig,
            region: 'us-east-1'
        });

        this.lexruntime = new AWS.LexRuntime();

      this.record = this.record.bind(this);
      this.stop = this.stop.bind(this);
      this.sendToServer = this.sendToServer.bind(this);

    }

    componentDidMount() {
        var _this = this;

        navigator.mediaDevices.getUserMedia({
            audio:true
        }).then(
            function onSuccess(stream) {

                var data = [];

                _this.recorder = new MediaRecorder(stream);
                _this.userAudio = document.getElementById('user-speech');
                _this.lexAudio = document.getElementById('lex-speech');

                _this.recorder.ondataavailable = function(e) {
                    data.push(e.data);
                };

                _this.recorder.onerror = function(e) {
                    throw e.error || new Error(e.name);
                }

                _this.recorder.onstart = function(e) {
                    data = [];
                }

                _this.recorder.onstop = function(e) {

                var blobData = new Blob(data, {type: 'audio/x-l16'});

                    _this.userAudio.src = window.URL.createObjectURL(blobData);

                    var reader = new FileReader();

                    reader.onload = function() {

                        _this.audioContext.decodeAudioData(reader.result, function(buffer) {

                        _this.reSample(buffer, 16000, function(newBuffer) {

                            var arrayBuffer = _this.convertFloat32ToInt16(newBuffer.getChannelData(0));
                            _this.sendToServer(_this.convertFloat32ToInt16(newBuffer.getChannelData(0)));

                            });
                        });
                    };
                    reader.readAsArrayBuffer(blobData);
                }

            })
        .catch(function onError(error) {
          console.log(error.message);
        });
    }

    record() {
        this.recorder.start();
    }

    stop() {
        this.recorder.stop();
    }

    reSample(audioBuffer, targetSampleRate, onComplete) {
        var channel = audioBuffer.numberOfChannels;
        var samples = audioBuffer.length * targetSampleRate / audioBuffer.sampleRate;

        var offlineContext = new OfflineAudioContext(channel, samples, targetSampleRate);
        var bufferSource = offlineContext.createBufferSource();
        bufferSource.buffer = audioBuffer;

        bufferSource.connect(offlineContext.destination);
        bufferSource.start(0);
        offlineContext.startRendering().then(function(renderedBuffer){
          onComplete(renderedBuffer);
        })
    }

    convertFloat32ToInt16(buffer) {
        var l = buffer.length;
        var buf = new Int16Array(l);
        while (l--) {
                buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
        }
        return buf.buffer;
    }

    sendToServer (audioData) {
        var _this = this;
        var params = {
            botAlias: '$LATEST', /* required */
            botName: 'OrderFlowers', /* required */
            contentType: 'audio/x-l16; sample-rate=16000; channel-count=1', /* required */
            inputStream: audioData, /* required */
            userId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', /* required */
            accept: 'audio/mpeg'
        };

        this.lexruntime.postContent(params, function(err, data) {
            if (err) console.log('ERROR!', err, err.stack); // an error occurred
                else {
                    var uInt8Array = new Uint8Array(data.audioStream);
                    var arrayBuffer = uInt8Array.buffer;
                    var blob = new Blob([arrayBuffer]);
                    var url = URL.createObjectURL(blob);
                    _this.lexAudio.src = url;
                    _this.lexAudio.play();
                }
        });
    }

    render() {
        return (
          <div>
            <span onClick={this.record} className={this.state.recordStyle}>Record</span>
            <span onClick={this.stop}>Stop</span>
            <audio id="user-speech" controls>No support of audio tag</audio>
            <audio id="lex-speech" controls>No support of audio tag</audio>
          </div>
        )
    }
}
