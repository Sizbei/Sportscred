import React, {createContext, useState, useEffect} from 'react';
import AuthService from '../Services/AuthService';
import '../styling/LoadingScreen.css'

// initialize the provider and consumer
export const AuthContext = createContext();

//deconstruct the children from props
//childern are the components that we want to warp the provider about
export default ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        AuthService.isAuthenticated().then(data => {
            setUser(data.user);
            setIsAuthenticated(data.isAuthenticated);
            setIsLoaded(true);
        });
    }, []);

    return (
        <div>
            {!isLoaded ?  <div className="LoadingPage"> 
                <label className='Loading'>Loading...</label>
                <img src="https://cdn.dribbble.com/users/195056/screenshots/2379959/bouncy-ball.gif"/>
            </div>
                : <AuthContext.Provider value={{user, setUser, isAuthenticated, setIsAuthenticated}}>
                    { children } </AuthContext.Provider>}
        </div>
    )
}