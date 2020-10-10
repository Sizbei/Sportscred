import React, {Component} from 'react';
import axios from 'axios';

export default class Example extends Component {
    constructor(props) {
        super(props);

        //Binds to methods that listen for events
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        //variables
        this.state = {
            username: '',
            users: []
          }
    }

    //One of react's lifecycle methods - method is called before displaying this component
    componentDidMount() {
        axios.get('http://localhost:5000/example/')
        .then(response => {
          if (response.data.length > 0) {
            this.setState({
              users: response.data.map(example => example.username),
              username: ''
            })
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }

    //Listens for an event and sets the username state
    onChangeUsername(e) {
      this.setState({
        username: e.target.value
      })
    }

    onSubmit(e) {
      //prevents default html form submit from taking place
      e.preventDefault();
      //Creates a body for a db call with the current variables
      const exampleBody = {
        username: this.state.username
      }

      //Can check console - browser (inspect)
      console.log(exampleBody);

      //Connects the backend with the frontend
      axios.put('http://localhost:5000/example/add', exampleBody)
        .then(res => console.log(res.data));
      window.location = '/';

        this.setState({
            username: ''
        })
    }
    
    render() {
      return (
      <div>
        <h3>Create New Example</h3>
        <form onSubmit={this.onSubmit}>
        <div className="form-group"> 
          <label>Current Examples: </label>
          {/* Creates a dropdown that drops a list of examples from th db*/}
          <select ref="userInput"
              required
              className="form-control">
            {
              //returns an array of examples to the dropdown
              this.state.users.map(function(example) {
                  return <option 
                  key={example}
                  value={example}>{example}
                  </option>;
                })
            }
          </select>
        </div>

        <div className="form-group"> 
          <label>Input a new example: </label>
          {/* Creates a text box that will listen and set the value you provide */}
          <input  type="text"
                  required
                  className="form-control"
                  value={this.state.username}
                  onChange={this.onChangeUsername}
                  />
        </div>
        <div className="form-group">
            <input type="submit" value="Create Example" className="btn btn-primary"/>
        </div>
        </form>
    </div>
    )}
}

