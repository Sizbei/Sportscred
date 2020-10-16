import React, {Component} from 'react';
import axios from 'axios';
import Header from './Header';

export default class Trivia extends Component {
    render() {
        return(
        <div>
          <Header />
          <p>You're on Trivia.</p>
        </div>
        );
    }
}