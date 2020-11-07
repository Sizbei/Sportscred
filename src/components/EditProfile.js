import React, {Component} from 'react';
import toastr from 'toastr'
import '../styling/Settings.css'
import '../styling/toastr.min.css'
import {AuthContext} from '../Context/AuthContext';

import ImageSelect from './ImageSelect'


function ErrorMessage(props) {
  const flag = props.flag;
  const text = props.text;

  if (flag) {
    return <span className="error-message"> {text} </span>;
  } else {
    return <span className="error-message"> <br></br> </span>;
  }
} 

export default class EditProfile extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);

        //Binds to methods that listen for events
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeAbout = this.onChangeAbout.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleImageLoad = this.handleImageLoad.bind(this);
        this.handleImageError = this.handleImageError.bind(this);
        this.urlChangeHandler = this.urlChangeHandler.bind(this);
        this.handleImageSubmit = this.handleImageSubmit.bind(this);
        this.handleImageSelectData = this.handleImageSelectData.bind(this);

        //variables
        this.state = {
          //username: '',
          status: '',
          about: '' ,
          interest: [],
          image: '',
          nextImage: '',
          imageNoError: true,
          showImageSubmit: false,
          imgInputValue: '',
          imageSelect: null,
          statusCharacters: 30,
          aboutCharacters: 300,
        }
    }
      
    //One of react's lifecycle methods - method is called before displaying this component

    
    componentDidMount() {
      fetch('/settings/profile/' + this.context.user.username).then(res => res.json())
      //axios.get('http://localhost:5000/settings/profile', send)
      .then(data => {
        console.log(data);
        console.log(data.length);
        this.setState({
          status: data.status,
          about: data.about,
          interest: data.interest,
          image: data.image,
          statusCharacters: 30 - data.status.length,
          aboutCharacters: 300 - data.about.length,
          nextImage: data.image
        })

        fetch('/teams').then(res => res.json())
        //axios.get('http://localhost:5000/teams/')
        .then(teams => {
            this.setState({
              imageSelect: <ImageSelect btntext="Submit!" data={teams} width={6} 
              selected={data.interest} updateOnClick={true} 
              maxTeams={9}
              onSubmit={this.handleImageSelectData} onBlurHandler={this.onBlur} 
              noButton={true}/>
            })
          }
        ); 
      })
      .catch((error) => {
        console.log(error);
      })

      
    }

    onChangeStatus(e) {;

      this.setState({
        status: e.target.value,
        statusCharacters: 30 - e.target.value.length
      }, () => this.onSubmit(e));

      

    }

    onChangeAbout(e) {
      this.setState({
        about: e.target.value,
        aboutCharacters: 300 - e.target.value.length
      }, () => this.onSubmit(e))
    }

    
    onBlur = () => {      
      toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-bottom-full-width",
        preventDuplicates: true,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "2000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
      }
      toastr.clear()
      setTimeout(() => toastr.success('Profile Updated'), 300)
    }

    onSubmit() {
      //Creates a body for a db call with the current variables

      const updatedInfo = {
        username: this.context.user.username,
        status: this.state.status,
        about: this.state.about,
        image: this.state.image,
        interest: this.state.interest
      }
      console.log("submit ", updatedInfo)

      //Connects the backend with the frontend
      fetch('/settings/profile/update', {
        method :  "post",
        body : JSON.stringify(updatedInfo),
        headers: {
            'Content-Type' : 'application/json'
        }
      }).then(res => res.json())
      //axios.post('http://localhost:5000/settings/profile/update', updatedInfo)
      .then(data => {console.log(data)
      })
      .catch((error) => {
        console.log(error);
      })

    }

    urlChangeHandler = (e) => {
      const url = e.target.value;
      this.setState({
        nextImage: url,
        imgInputValue: url,
        showImageSubmit: false
      })

      if (url === "" || url === this.state.image) {
        this.setState({
          imageNoError: true
        })
      }
    }

    handleImageLoad = () => { 
      if (this.state.nextImage != this.state.image) {
        this.setState({ 
          imageNoError: true,
          showImageSubmit: true
        })
      }
    }

    handleImageError = (e) => {      
      if (this.state.imgInputValue === "" || this.imgInputValue === this.state.image) {
        this.setState({imageNoError: true})
      } else {
        this.setState({
          imageNoError: false
        })
      }

      this.setState({
        showImageSubmit: false,
        nextImage: this.state.image
      })
    }

    handleImageSubmit = (e) => {
      this.setState({
        image: this.state.nextImage, 
        showImageSubmit: false
      }, () => this.onSubmit())
    }

    handleImageSelectData = (d) => {
      this.setState({
        interest: d
      }, () => this.onSubmit())
    }
    
    render(){
      let imgSubmitBtn;

      if (this.state.showImageSubmit) {
        imgSubmitBtn = <button className="settings-submit" onClick={this.handleImageSubmit}>Update</button>
      } else {
        imgSubmitBtn = null;
      }
      
      return (
        <div className="profile-container">
          <div className="settings-container-mid"> 
              
              <div className="information-container"> 
              <h1 className="editProfile-h1"> {'Profile Settings'} </h1> 
                  <div className="editPP-container">
                    <h2 className="editProfile-h2">Profile Picture</h2>
                    <div className="editPP-photo-container">
                      <div className="preview">
                        <div className="registration-photo">
                          <img style={{ display: this.state.showImageSubmit ? "block" : "none" }} src={this.state.nextImage} key={"one-" + this.state.nextImage} className="registration-user-given-photo" alt="" onError={this.handleImageError} onLoad={this.handleImageLoad} />
                          <img style={{ display: this.state.showImageSubmit ? "none" : "block" }} src={this.state.image} key={"two-" + this.state.image} className="registration-user-given-photo" alt="" />                     
                        </div>
                      </div>
                    </div>

                    {/* <label>Profile Picture URL: </label> */}
                    <div className="editPP-input-container">
                      <input className="editPP-input-field" placeholder="Photo link" type="text" name="url" onChange={this.urlChangeHandler} value={this.imgInputValue}/>
                      {imgSubmitBtn}
                    </div>
                    <ErrorMessage flag={!this.state.imageNoError} text="*Improper url." />
                  </div>

                  <hr className="settings-hr"></hr>
                  <h2 className="settings-h2">Status (optional)</h2>
                  <input type="text" placeholder="Status (optional)" id="timer" className="status-edit" maxLength="30" onBlur={this.onBlur} onChange={this.onChangeStatus} value={this.state.status}></input>
                  <label className="characters">Characters remaining: {this.state.statusCharacters}</label>
                  
                  <hr className="settings-hr"></hr>
                  <h2 className="settings-h2"> About (optional)</h2>
                  <textarea type="text" placeholder="About (optional)" id="timer" className="about-edit" maxLength="300" onBlur={this.onBlur} onChange={this.onChangeAbout} value={this.state.about}></textarea>
                  <label className="characters">Characters remaining: {this.state.aboutCharacters}</label>
                  
                  <hr className="settings-hr"></hr>
                  <h2 className="title">Favorite Teams</h2>
                  {this.state.imageSelect}
              </div>
          </div>
          
          </div>

      )
  }
}