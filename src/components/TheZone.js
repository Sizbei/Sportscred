import React, {Component} from 'react';
import axios from 'axios';

import Navbar from "./Navbar"

export default class TheZone extends Component {
    render() {
        return( 
        <div>
            <Navbar></Navbar>
            <p>You're on The Zone.</p>
        </div>
        );
    }
}