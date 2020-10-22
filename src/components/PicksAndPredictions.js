import React, {Component} from 'react';
import axios from 'axios';
import Header from './Header';

export default class PicksAndPredictions extends Component {
    render() {
        return(
        <div>
            <Header />
            <p>You're on Picks and Predictions.</p>
        </div>
        );
    }
}