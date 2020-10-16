import React, {Component, useDebugValue} from 'react';
import axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';
import '../styling/Profile.css'
import Header from './Header';


export default class Profile extends Component {
    constructor(props) {
        super(props);
        //console.log(props.location.pathname); 
        this.state = { 
            path: props.location.pathname,
            username: '',
            status: '',
            about: '' ,
            interest: '',
            image: 'https://i.imgur.com/55sUslQ.png',
            acsscore: '200',  
        }
    }
    componentDidMount(){ 

        axios.get('http://localhost:5000' + this.state.path)
        .then(response => {   
            this.setState({
                username: response.data.username,
                status: response.data.status,
                about: response.data.about,
                interest: response.data.interest,     
            }) 
        })
        .catch((error) => {
          console.log(error);
        })
        
    }
    
    render(){
        
        return (
          <div className="container">
            <Header />
            <div className="container-top-section"> 
                <div className="profile-photo">
                    <img src={this.state.image} className="profile-user-given-photo"/>
                    <label className="profile-badge"></label> 
                    <label className="profile-user-score">{this.state.acsscore}</label>   
                </div>
                <PieChart className="piechart"
                    data={[
                        { title: 'One', value: 10, color: '#E38627' },
                        { title: 'Two', value: 15, color: '#C13C37' },
                        { title: 'Three', value: 20, color: '#6A2135' },
                    ]}

                />;
            </div>
            
            <div className="container-middle-section"> 
                <h1> {this.state.username} </h1> 
                <div className="information"> 
                    <h2 className="title">Status</h2>
                    <p className="content">{this.state.status}</p>
                
                    <h2 className="title"> About</h2>
                    <p className="content">{this.state.about}</p>
                
                    <h2 className="title">Interest</h2>
                    <p className="content">{this.state.interest}</p>

                    <h2 className="title"> ACS History </h2>
                    <h2 className="title"> Current Picks </h2>
                    <h2 className="title"> Pick History </h2>
                    <h2 className="title"> Radar List </h2>
                </div>
                 
            </div>         
            </div>
            
        )
    }
    
    

}