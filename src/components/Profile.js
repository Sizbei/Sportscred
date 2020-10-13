import React, {Component} from 'react';
import axios from 'axios';

class ProfilePicture extends React.Component {
    constructor(props) {
        super(props); 
        this.state = { 
            image: "https://lh3.googleusercontent.com/proxy/6Cwu6lDL8z6tWttjlMJOb8Ogcc0WYX5lhS5jbSIWQk2WlGdVZvXkK2rIzvYRRKo8fBKMY9R5DPQiVkTWlv9t8LITl6zUwHl8PljBgvXfejsZyqkQdAewKHYQiDNuWZKbEumb8ZUlMu5Ud12CAw" 
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
             <img src={this.state.image} />
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