import React, { useEffect, useState, useContext } from 'react';
import '../styling/TheZone.css';
import PostPopup from './ProfilePostPopup';
import { AuthContext } from '../Context/AuthContext';
import ProfilePicture from './ProfilePicture'
import { Link } from 'react-router-dom';



export default function TheZone(props) {
    const authContext = useContext(AuthContext);
    const postId = props.location.pathname.slice(17, props.location.pathname.length);
    const path = ' /zone/display/' + authContext.user.username + '/' + postId;

    const [username, setUsername] = useState('');
    const [likes, setLikes] = useState(0);
    const [acs, setAcs] = useState(0);
    const [content, setContent] = useState('');
    const [agree, setAgree] = useState(false);
    const [disagree, setDisagree] = useState(false);
    const [posts, setPosts] = useState([]);

    const [showPostPopup, setPostPopup] = useState(false);

    useEffect(() => {
        fetch(path).then(res => res.json())
            .then(data => {
                setPosts(data.posts);
                setUsername(data.posts.poster.username);
                setAcs(data.posts.poster.acs);
                setLikes(data.posts.likes);
                setContent(data.posts.body);
                setAgree(data.posts.upvoted);
                setDisagree(data.posts.downvoted);
                
                
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    const togglePostPopup = () => {
       setPostPopup(!showPostPopup);
    }
   
    const handlePostAgree = (data, index) => {

        const body = {
            post: data._id,
            username: authContext.user.username,
            upvoted: data.upvoted,
            downvoted: data.downvoted,
        }
        fetch('/zone/upvote', {
            method: "put",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(updatedData => {
                const updatedEntry = {
                    "_id": data._id,
                    "poster": {
                        "username": data.poster.username,
                        "image": data.poster.image,
                        "acs": data.poster.acs
                    },
                    "body": data.body,
                    "likes": updatedData.likes,
                    "upvoted": updatedData.upvoted,
                    "downvoted": updatedData.downvoted
                }
                const newPosts = [
                    ...posts.slice(0, index),
                    updatedEntry,
                    ...posts.slice(index + 1)
                ]
                setPosts(newPosts);
            })
            .catch((error) => {
                console.log(error);
            })

    }
    const handlePostDisagree = (data, index) => {
        const body = {
            post: data._id,
            username: authContext.user.username,
            upvoted: data.upvoted,
            downvoted: data.downvoted,
        }
        fetch('/zone/downvote', {
            method: "put",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            //axios.post('http://localhost:5000/post/add', body)
            .then(updatedData => {
                const updatedEntry = {
                    "_id": data._id,
                    "poster": {
                        "username": data.poster.username,
                        "image": data.poster.image,
                        "acs": data.poster.acs
                    },
                    "body": data.body,
                    "likes": updatedData.likes,
                    "upvoted": updatedData.upvoted,
                    "downvoted": updatedData.downvoted
                }
                const newPosts = [
                    ...posts.slice(0, index),
                    updatedEntry,
                    ...posts.slice(index + 1)
                ]
                setPosts(newPosts);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    
    return (
        <div class="tzone-page">
            
            <div class= "tzone-all-posts"> 
                {showPostPopup ? <PostPopup closePopup={togglePostPopup} />
                    : null
                }

                <div class="tzone-post-body">
                    <button class="tzone-create-post-btn" onClick={togglePostPopup}>  {"What's on your mind, " + (authContext.user.username) + "?"}
                    </button>
                </div>

                <div className= "tzone-post-number"> Posts ({posts.length})</div>
                {posts.map((data, index) => {
                    return (
                        <div class="tzone-overall-container">
                            <div className="tzone-post-container">

                                <div className="tzone-user-info">
                                    <Link to={'/profile/' + data.poster.username} className="tzone-profile-link">
                                    <ProfilePicture username={data.poster.username} />
                                    </Link>
                                    
                                    <label> <Link to={'/profile/' + data.poster.username} className="tzone-profile-link">{data.poster.username} ({data.poster.acs})  
                                    </Link>
                                    </label>
                                    
                                    <div className="tzone-likes"> <label> {data.likes} </label></div>
                                    </div>
                                    <div className="tzone-post-info">      
                                    <Link to={"/theZone/display/" + (data._id)} className="tzone-link">
                                        <p> {data.body} </p>
                                    </Link>
                                </div> 
                        </div>
                        <div className="tzone-post-buttons">
                                <a onClick={() => handlePostAgree(data, index)} className={data.agree ? "tzone-post-button-agree-selected" : "tzone-post-button-agree"}> Agree </a>
                                <a onClick={() => handlePostDisagree(data, index)} className={data.disagree ? "tzone-post-button-disagree-selected" : "tzone-post-button-disagree"}> Disagree </a>
                        </div>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}


