import React from 'react';
import '../styles/index.scss';
import AudioRecorder from './audio-recorder';

export default class App extends React.Component {

    onStop() {

    }

  render() {
    return (
      <div>
        <h1>Order Flowers Lex</h1>
        <AudioRecorder/>
      </div>
    )
  }
}
