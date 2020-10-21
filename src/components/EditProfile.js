import React, {Component} from 'react';
import axios from 'axios';
import '../styling/EditProfile.css'
import Header from './Header';
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

export default class Example extends Component {
    constructor(props) {
        super(props);

        //Binds to methods that listen for events
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeAbout = this.onChangeAbout.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleImageLoad = this.handleImageLoad.bind(this);
        this.handleImageError = this.handleImageError.bind(this);
        this.urlChangeHandler = this.urlChangeHandler.bind(this);
        this.handleImageSubmit = this.handleImageSubmit.bind(this);
        this.handleImageSelectData = this.handleImageSelectData.bind(this);

        //variables
        this.state = {
          username: 'user3',
          status: '',
          about: '' ,
          interest: '',
          prevImage: '',
          image: '',
          imageNoError: true,
          showImageSubmit: false,
          imgInputValue: '',
          imageSelect: null
        }
    }
      
    //One of react's lifecycle methods - method is called before displaying this component

    
    componentDidMount() {
      const send = {
        params: {
          username: this.state.username
        }
      }

      axios.get('http://localhost:5000/settings/profile', send)
      .then(response => {
        console.log(response.data);
        console.log(response.data.length);
        this.setState({
          image: response.data.image,
          status: response.data.status,
          about: response.data.about,
          interest: response.data.interest,
          image: response.data.image
        })
        
      })
      .catch((error) => {
        console.log(error);
      })

      axios.get('http://localhost:5000/teams/').then(
        (e) => {
          this.setState({
            imageSelect: <ImageSelect btntext="Submit!" data={e.data} width={6} onSubmit={this.handleImageSelectData} />
          })
        }
      ); 
    }

    onChangeStatus(e) {
      console.log("onchange", e.target.value);

      this.setState({
        status: e.target.value
      }, () => this.onSubmit(e));
    }

    onChangeAbout(e) {
      this.setState({
        about: e.target.value
      }, () => this.onSubmit(e))
    }

    onSubmit(e) {
      //prevents default html form submit from taking place
      e.preventDefault();
      //Creates a body for a db call with the current variables

      const updatedInfo = {
        username: this.state.username,
        status: this.state.status,
        about: this.state.about,
        image: this.state.image
      }
      console.log("submit ", updatedInfo["status"])

      //Connects the backend with the frontend
      axios.post('http://localhost:5000/settings/profile/update', updatedInfo)
      .then(response => {   
      })
      .catch((error) => {
        console.log(error);
      })

    }

    urlChangeHandler = (e) => {
      const url = e.target.value;
      this.setState({
        image: url,
        imgInputValue: url,
        showImageSubmit: false
      })

      if (url === "" || url === this.state.prevImage) {
        console.log("noerror");
        this.setState({
          imageNoError: true
        })
      }
    }

    handleImageLoad = () => { 
      if (this.state.image != this.state.prevImage) {
        this.setState({ 
          imageNoError: true,
          showImageSubmit: true
        })
      }
    }

    handleImageError = (e) => {      
      if (this.state.imgInputValue === "" || this.imgInputValue === this.state.prevImage) {
        this.setState({imageNoError: true})
      } else {
        this.setState({
          imageNoError: false
        })
      }

      this.setState({
        showImageSubmit: false,
        image: this.state.prevImage
      })
    }

    handleImageSubmit = (e) => {
      this.setState({
        prevImage: this.state.image, 
        showImageSubmit: false
      })

      this.onSubmit(e);
    }

    handleImageSelectData = (d) => {

    }
    
    render(){
      let imgSubmitBtn;

      if (this.state.showImageSubmit) {
        imgSubmitBtn = <button className="image-submit" onClick={this.handleImageSubmit}>Update</button>
      } else {
        imgSubmitBtn = null;
      }

      return (
        <div className="editprofile-container">
          <Header />

          <div className="container-middle-section"> 
              <h1> {'Profile Settings'} </h1> 
              <div className="information"> 
                  <div className="editPP-container">
                    <h2 className="title">Profile Picture</h2>
                    <div className="editPP-photo-container">
                      <div className="preview">
                        <div className="registration-photo">
                          <img style={{ display: this.state.showImageSubmit ? "block" : "none" }} src={this.state.image} key={this.state.image} className="registration-user-given-photo" alt="" onError={this.handleImageError} onLoad={this.handleImageLoad} />
                          <img style={{ display: this.state.showImageSubmit ? "none" : "block" }} src={this.state.prevImage} key={this.state.previmage} className="registration-user-given-photo" alt="" />
                        </div>
                      </div>
                    </div>

                    <label>Profile Picture URL: </label>
                    <div className="editPP-input-container">
                      <input className="input-field" type="text" name="url" onChange={this.urlChangeHandler} value={this.imgInputValue}/>
                      {imgSubmitBtn}
                    </div>
                    <ErrorMessage flag={!this.state.imageNoError} text="*Improper url." />
                  </div>

                  <h2 className="title">Status (optional)</h2>
                  <input type="text" className="content" onChange={this.onChangeStatus} value={this.state.status}></input>
                  <h2 className="title"> About (optional)</h2>
                  <input type="text" className="content" onChange={this.onChangeAbout} value={this.state.about}></input>
                  
                  {ImageSelect}
              </div>
          </div>
          
          </div>

      )
  }
}