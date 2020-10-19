export default {
    login : user => {
        return fetch('http://localhost:5000/login', {
            method :  "post",
            body : JSON.stringify(user),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => data);
    },

    signup : user => {
        return fetch('http://localhost:5000/signup', {
            method :  "post",
            body : JSON.stringify(user),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => data);
    },

    logout : () => {
        return fetch('http://localhost:5000/logout')
            .then(res => res.json())
            .then(data => data);
    },

    isAuthenticated : () => {
        return fetch('http://localhost:5000/login/authenticated')
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