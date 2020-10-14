import React, {Component, useDebugValue} from 'react';
import axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';
import '../styling/Profile.css'

class ProfilePicture extends React.Component {
    constructor(props) {
        super(props); 
        this.state = { 
            image: 'https://i.imgur.com/55sUslQ.png',
            acsscore: '0',
        }
    }
    
    componentDidMount() {
        this.setState((state, props) => ({
            image: this.props.image ? this.props.image : this.state.image, 

        }));
    }
    render() {
        return ( 

            <div className="profile-photo">
                <img src={this.state.image} className="profile-user-given-photo"/>
                <label className="profile-user-score"> {this.state.acsscore} </label>    
            </div>
            
            
        )
    }
}
class UserInfo extends React.Component {
    constructor(props) {
        super(props); 
        this.state = { 
            title: " " , 
            content: " ",  
        }
    }
    componentDidMount() {
        this.setState((state, props) => ({
            title: this.props.title ? this.props.title : "placeholder_title",
            content: this.props.content ? this.props.content : "placeholder_content",  
        })); 
    }
    render() {
        return (
            <div className="information"> 
                <h2 className="title">{this.state.title}</h2>
                <p className="content">{this.state.content}</p>
            </div>
            
        )    
    }
}

class ACSHistory extends React.Component { 
    constructor(props) {
        super(props); 
        this.state = { 
            
        }
    }

}
export default class Profile extends Component {
    render(){
        return (
            <div className="container">
                <div className="container-top-section"> 
                    <ProfilePicture />
                    <PieChart className="piechart"
                        data={[
                            { title: 'One', value: 10, color: '#E38627' },
                            { title: 'Two', value: 15, color: '#C13C37' },
                            { title: 'Three', value: 20, color: '#6A2135' },
                        ]}

                    />;
                </div>
                
                <div className="container-middle-section"> 
                    <UserInfo title={"Status"} content={"askldhsalkdjaslkjdasklj dklsajdlksajdlksajdlksajlkdjaslkdjaslkdjslakjdlksajdklasjkldjsalk djlsadjlksajdlkasjdkljaslkdjklasjdklsajdl kasjdlkjasldkasjkldjaslkdjaklaj lkdjklajdklasjlsjlkjdkljsaldkjaslkdjaslkdjaskldjlaksjdlkajdklajdkljalkajskl"}/>
                    <UserInfo title={"About"}/> 
                    <UserInfo title={"Interest"}/> 
                    <UserInfo title={"Radar List"}/> 
                </div> 

                
            </div>
            
        )
    }
    
    

}