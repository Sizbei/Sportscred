import axios from "axios";

export default {
    //POST request using axios
    //login : user => {
    //    const userBody = {
    //        params: user
    //    }
    //    return axios.post('http://localhost:5000/login', {
    //        withCredentials: true,
    //        headers: {
    //            'Content-Type' : 'application/json'
    //        }
    //    }, userBody)
    //        .then(res => res.data);
    //},
    
    login : user => {
        return fetch('/login', {
            method :  "post",
            body : JSON.stringify(user),
            headers: {
               'Content-Type' : 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => data);
    },

    //signup : user => {
    //    return fetch('/signup', {
    //        method :  "post",
    //        body : JSON.stringify(user),
    //        headers: {
    //            'Content-Type' : 'application/json'
    //        }
    //    })
    //    .then(res => res.json())
    //    .then(data => data);
    //},

    logout : () => {
        return fetch('/logout')
            .then(res => res.json())
            .then(data => data);
    },

    isAuthenticated : () => {
        return fetch('/login/authenticated')
            .then(res => {
                // if passport send the 401 status, that means the user is not authorized
                if(res.status !== 401) {
                    return res.json().then(data => data);
                } else {
                    return {
                        isAuthenticated: false,
                        user: {
                            username: "",
                            email: "",
                            permissions: ""
                        }
                    };
                };
            });
    }
}