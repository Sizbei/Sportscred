import React, {Component} from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import '../styling/Profile.css'
import PostPopup from './ProfilePostPopup';
import RLPopup from './ProfileRLPopup'; 
import ImageSelect from './ImageSelect';
import {AuthContext} from '../Context/AuthContext';
import ProfilePicture from './ProfilePicture';

/*
acsChart: [
    { title: 'Trivia & Games', value: tag, color: '#61b305' },
    { title: 'Analysis & Debate', value: aad, color: '#f8e871' },
    { title: 'Picks & Prediction', value: pap, color: '#d30909' },
    { title: 'Participation & History', value: pah, color: ' #ff7e1f'},
],  
acsHistory: [
    {point: 10 , category: 'Picks', time: '1 hour ago'}, 
    {point: 7 , category: 'Debate', time: '7 hours ago'}, 
    {point: -10 , category: 'Trivia', time: '10 hours ago'}, 
    {point: 13 , category: 'Debate', time: '13 hours ago'}, 
    {point: -3 , category: 'Picks', time: '20 hours ago'}, 
],
*/
const defaultLabelStyle = {
    fontSize: '7px',
    fontFamily: 'CommissionerMedium',
  };
export default class Profile extends Component {
    
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        //console.log(props.location.pathname); 
        
        this.state = { 
            path: props.location.pathname,
            username: '',
            status: '',
            about: '' ,
            interest: [],
            image: '',
            acs: 0,  
            acsChart: [], 
            acsHistory: [],
            showPostPopup: false,
            showRLPopup: false, 
            following: false, 
            fullRadarList: [], 
            teams: [],
            imgSelect: null
        }
        this.handleEditProfile = this.handleEditProfile.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }
    
    //******************* CREATING POST FUNCTIONS ****************************/
    togglePostPopup() {  
        this.setState({  
             showPostPopup: !this.state.showPostPopup  
        });  
    }
    toggleRLPopup() {  
        this.setState({  
            showRLPopup: !this.state.showRLPopup  
        });  
    }
    changeUser(user) {
        const url = '/profile/' + user; 
        this.props.history.push(url);
        window.location.reload(); 
    }
    handleEditProfile(event) { 
        // alert('Will send to edit profile page');
        event.preventDefault();
        this.props.history.push("/settings/profile");
    }
    
    async handleAddRadarList (){
        //console.log("http://localhost:5000" + this.state.path +"/addRadar"); 
        //console.log("username: " + this.context.user.username + "\n viewing: " + this.state.username );
        const body = {
            username: this.context.user.username, 
            viewing: this.state.username, 
        }
        //console.log(body) 
        const response = await fetch( this.state.path + "/addRadar" , {
            method: 'PUT' , 
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(body), 
        })
        //console.log(response); 
        window.location.reload(); 
    }
    async handleDeleteRadarList (){
        //console.log("http://localhost:5000" + this.state.path +"/deleteRadar"); 
        //console.log("username: " + this.context.user.username + "\n viewing: " + this.state.username );
        const body = {
            username: this.context.user.username, 
            viewing: this.state.username, 
        }
        //console.log(body) 
        const response = await fetch(this.state.path +"/removeRadar" , {
            method: 'DELETE' , 
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(body), 
        })
        //console.log(response); 
        window.location.reload(); 
    }

    /************************GET REQUEST FOR USER INFRORMATION ***********************/
    componentDidMount(){
        
        //defualt method in fetch is get so no need to put that as param
        fetch(this.state.path).then(res => res.json())
        //axios.get('http://localhost:5000' + this.state.path)
        .then(data => {
            //console.log("Path: " + this.state.path + "\n users:  profile/" + this.context.user.username); 
            //console.log(response.data.interest);
            this.setState({
                username: data.username,
                status: data.status,
                interest: data.interest,
                about: data.about,  
                image: data.image, 
                teams: data.teams
            }) 
        })
        .then(data => {
            //console.log("interest: " + this.state.interest);
            const params = {
                teams: this.state.interest
              }

            fetch(this.state.path + '/teams?' + new URLSearchParams(params)).then(res => res.json())
            //axios.get('http://localhost:5000' + this.state.path + '/teams', send)
            .then(data => { 
              const mapped = data.map(team => team.image).map((e) => {
                const obj = {
                  name: "",
                  image: e
                }

                return obj;
              })
              
              //console.log(mapped);
              this.setState({
                imgSelect: <ImageSelect btntext="Submit!" data={mapped} width={3} noError={true} noSelect={true} noButton={true} />
              })
            })
            .catch((error) => {
                console.log(error);
            })

            }

        )
        .catch((error) => {
          console.log(error);
        })
        
        fetch(this.state.path + "/radarlist" ).then(res => res.json()) 
        .then (data => {
            //console.log("http://localhost:5000" + this.state.path + "/radarlist");
            //console.log(data.radarList); 
            this.setState({
                fullRadarList: data.radarList, 
            })     
        })
        //console.log("http://localhost:5000/profile/" + this.context.user.username + this.state.path.slice(8, this.state.path.length) + "/checkRadar");
        fetch("/profile/" + this.context.user.username + this.state.path.slice(8, this.state.path.length) + "/checkRadar").then(res=>res.json())
        .then (data => {
            //console.log("following: " + data.following); 
            this.setState({
                following: data.following, 
            })

        })
    
        fetch( this.state.path + "/acs").then(res => res.json()) 
        .then(data => {
            console.log(data.acsChart[0].value);
            this.setState({
                acs: data.acsTotal,
                acsHistory: data.acsHistory, 
                acsChart: [   
                    { title: data.acsChart[0].title, value: data.acsChart[0].value, color: '#61b305' },
                    { title: data.acsChart[1].title, value: data.acsChart[1].value, color: '#f8e871' },
                    { title: data.acsChart[2].title, value: data.acsChart[2].value, color: '#d30909' },
                    { title: data.acsChart[3].title, value: data.acsChart[3].value, color: ' #ff7e1f'},
                ]
            })
        })
    }   


    render(){
        const radarList = this.state.fullRadarList.slice(0, 5); 
        return (
            <div>
            
            <div className="prof-background">
                <div className="prof-container-profile"> 
                    <div className="prof-profile-preview">
                        <ProfilePicture scale={3}username={this.state.username}/> 
                        <label className="prof-profile-user-score">{this.state.acs}</label>   
                    </div>
                    <div className="prof-profile-info">
                        <h1>{this.state.username}</h1>
                        <p>{this.state.status}</p>
                        {this.state.path.toLowerCase() === "/profile/" + this.context.user.username ? 
                            <button className ="prof-create-post-button" onClick={this.togglePostPopup.bind(this)}>Create Post</button> 
                            : 
                            (this.state.following ? 
                                <button className="prof-create-post-button" onClick={this.handleDeleteRadarList.bind(this)}> Unfollow </button>
                                : 
                                <button className="prof-create-post-button" onClick={this.handleAddRadarList.bind(this)}> Follow </button>
                            )                     
                        }      
                    </div>
                    <div className="prof-edit-profile">                    
                        {this.state.path.toLowerCase() === "/profile/" + this.context.user.username ? 
                        <button onClick={this.handleEditProfile}>Edit Profile</button> : 
                        null
                        }
                    </div>                   
                </div>
                
                <div className="prof-container-middle-section"> 
                    {this.state.showPostPopup ?  
                            <PostPopup closePopup={this.togglePostPopup.bind(this)} />  
                            : null  
                    }
                    {this.state.showRLPopup ?  
                            <RLPopup changeUser={this.changeUser.bind(this)} closePopup={this.toggleRLPopup.bind(this)} radarList={this.state.fullRadarList} />  
                            : null  
                    }
                    <div className="prof-left-content">
                        <div className="prof-about">
                            <h2 className="prof-title"> About</h2>
                            <p className="prof-about-content">{this.state.about}</p>
                        </div>
                        
                        <div className="prof-radar-list">
                            <h2 className="prof-title"> Radar List</h2>
                            <div className="prof-radar-list-content">
                                <div className="prof-radar-list-table"> 
                                    <table>
                                        <tbody>
                                        {radarList.map(data => {
                                        return (

                                            <tr key={data.acs + data.username}>
                                                <td>
                                                <div className="radar-list-profile-preview">
                                                <ProfilePicture scale={1}username={data.username}/> 
                                                </div>
                                                
                                                </td>
                                                <td><a className="radar-list-table-username" onClick={()=>this.changeUser(data.username)}>{data.username} ({data.acs})</a></td>
                                            </tr>

                                        )
                                        })} 

                                        </tbody>
                                    </table>       
                                </div>                   
                            <button onClick={this.toggleRLPopup.bind(this)}> View all</button>
                            </div>
                        </div>
                        
                        
                        
                    </div>
                                 
                    <div className="prof-right-content">
                        <div className="prof-acs">
                            <h2 className="prof-title"> ACS History </h2>
                            
                            <div className="prof-acs-content"> 
                                {this.state.acs === 0 ?  
                                    <div className="prof-piechart">
                                        Unavailable
                                    </div>   
                                    : 
                                    <PieChart className="prof-piechart"
                                    data={this.state.acsChart}
                                    label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                                    labelStyle={defaultLabelStyle}                
                                    raidus={42}
                                    reveal ={({dataEntry}) => Math.round(dataEntry.percentage) + '%'}
                                    />
                                }
                                

                                <table>
                                    <thead> 
                                        <tr>
                                            <th> Point </th>
                                            <th> Category </th>
                                            <th> Time </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.acsHistory.map(data => {
                                        return (
                                            <tr key={data.time}>
                                                <td className={data.points>= 0? "prof-score-content-pos" : "prof-score-content-neg"}>{data.points}</td>
                                                <td >{data.category}</td>
                                                <td>{data.date}</td>
                                            </tr>
                                        )
                                    })} 
                                
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="prof-bottom-right-content">
                            
                            <div className="prof-interest">
                                <h2 className="prof-title">Interest</h2>
                                <div className="prof-interest-content">
                                  {this.state.imgSelect}
                                </div>
                            </div>
                            
                            <div className="prof-picks">
                                <h2 className="prof-title"> Current Picks </h2>
                                <div className="prof-picks-content">
                                    To be implemented in future sprint
                                </div>
                            </div>

                        </div>
                        
                    </div>
                    
                  
                </div>
                
            </div>
            </div>
        )
            
        
    }
    
    

}