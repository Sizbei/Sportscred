import React, {Component, useDebugValue} from 'react';
import axios from 'axios';
import { PieChart } from 'react-minimal-pie-chart';
import '../styling/Profile.css'

class ProfilePicture extends React.Component {
    constructor(props) {
        super(props); 
        this.state = { 
            image: 'https://i.imgur.com/55sUslQ.png',
            acsscore: '200',
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
                <label className="profile-badge"></label> 
                <label className="profile-user-score">{this.state.acsscore}</label>   
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
    constructor(props) {
        super(props); 
        this.state = { 
            username: 'blank' ,
            status: 'blank',
            about: 'blank' ,
            interest: 'blank',  
        }
    }
    componentDidMount(){ 
        const exampleBody = {
            username: 'user1'
        }
        axios.get('http://localhost:5000/profile/username', exampleBody)
        .then(response => {
          console.print(response.data.length);   
          if (response.data.length > 0) {
            this.setState({
                username: 'response.data.map(user => user.username)',
                status: response.data.map(user => user.status) ,
                about: response.data.map(user => user.about),
                interest: response.data.map(user => user.interest),              
            })
          }
        })
        .catch((error) => {
          console.log(error);
        })
        
    }
    
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
                    <h1> {this.state.username} </h1> 
                    <UserInfo title={"Status"} content={this.state.status} />
                    <UserInfo title={"About"} content={this.state.about}/> 
                    <UserInfo title={"Interest"} content={this.state.interest}/> 
                    <UserInfo title={"Radar List"}/> 
                </div> 

                
            </div>
            
        )
    }
    
    

}