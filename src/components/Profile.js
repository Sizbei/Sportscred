import React, {Component} from 'react';
import axios from 'axios';
import '../styling/Profile.css'

class ProfilePicture extends React.Component {
    constructor(props) {
        super(props); 
        this.state = { 
            image: 'https://i.imgur.com/9fyUaFV.jpg'
        }
    }
    
    componentDidMount() {
        this.setState((state, props) => ({
            image: this.props.image ? this.props.image : this.state.image, 

        }));
    }
    render() {
        return ( 
         <div className = "container">
            <div className="preview">
                <div className="photo">
                    <img src={this.state.image} className="user-given-photo" />
                    <span class="badge badge-light">9</span>
                </div>
            </div>
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
        <div className="container"> 
            <h2>{this.state.title}</h2>
            <p>{this.state.content}</p>
        </div>
        )    
    }
}


export default class Profile extends Component {
    render(){
        return (
            <div>
                <ProfilePicture />
                <UserInfo title={"Status"} content={"Fanlyst"}/>
                <UserInfo title={"About"}/>
                <UserInfo title={"Interest"}/> 
                <UserInfo title={"ACS History"}/> 
            </div>
            
        )
    }
    
    

}