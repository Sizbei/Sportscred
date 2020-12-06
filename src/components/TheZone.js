import React, { useEffect, useState, useContext } from 'react';
import '../styling/TheZone.css';
import PostPopup from './ProfilePostPopup';
import ReportPopup from './TheZoneReportPopup';
import Pagination from "@material-ui/lab/Pagination";
import { AuthContext } from '../Context/AuthContext';
import ProfilePicture from './ProfilePicture';
import { Link } from 'react-router-dom';



export default function TheZone(props) {
    const authContext = useContext(AuthContext);
    const postId = props.location.pathname.slice(17, props.location.pathname.length);
    
    const [content, setContent] = useState('');
    const [agree, setAgree] = useState(false);
    const [disagree, setDisagree] = useState(false);
    const [rId, setRId] = useState('');
    const [reported, setReported] = useState(false);
    const [type, setType] = useState('');

    const [path, setPath] = useState('/zone/display/');
    const [sortedBy, setSortedBy] = useState('createdAt'); 

    const [currentPage, setCurrentPage] = useState(1); 
    const [totalNumber, setTotalNumber] = useState(0); 
    const [posts, setPosts] = useState([]); 

    const [showPostPopup, setPostPopup] = useState(false);         
    const [showReportPopup, setReportPopup] = useState(false);       
   

    useEffect(() => {    
        handlePosts(currentPage - 1); 
    }, [currentPage, sortedBy, path])

    const defaultState = {state: "none"};
    const [state, setState] = useState(defaultState);

    const togglePostPopup = () => {
       setPostPopup(!showPostPopup);
    }

    const handlePosts = async (page) => {
        await fetch(path + page + '/' + sortedBy).then(response => response.json())
            .then(data => {
                setPosts(data.posts);
                setContent(data.posts.body);
                setAgree(data.posts.upvoted);
                setDisagree(data.posts.downvoted);
                setPosts(data.posts);
                setTotalNumber(data.post_count);
                
            }).catch((error) => {
                console.log(error);
            })
       
    }

    const toggleReportPopup = (rId, type) => {
        setRId(rId);
        setType(type);
        
        setReportPopup(!showReportPopup);
    }

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    }

   
    const handlePostAgree = (data, index) => {
        if (state.state !== "none") return;
        setState({ state: "agree", data: data, index: index});
    }

    // post agree
    useEffect(() => {
      if (state.state != "agree") return;

      const data = state.data;
      const index = state.index;

      console.log(data);
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
                setState(defaultState);
            })
            .catch((error) => {
                console.log(error);
                setState(defaultState);
            })
    }, [state.state])

    const handlePostDisagree = (data, index) => {
      if (state.state !== "none") return;
      setState({ state: "disagree", data: data, index: index});    
    }

    useEffect(() => {
      if (state.state !== "disagree") return;

      const data = state.data;
      const index = state.index;

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
              setState(defaultState);
          })
          .catch((error) => {
              console.log(error);
              setState(defaultState);
          })
    }, [state.state])
    
    return (
        <div class="tzone-page">
            
            <div class= "tzone-all-posts"> 
            

                <div class="tzone-post-body">
                    <button class="tzone-create-post-btn" onClick={togglePostPopup}>  {"What's on your mind, " + (authContext.user.username) + "?"}
                    </button>
                </div>

               
                <div className="tzone-post-number"> {path === '/zone/display/' ? 'All' : 'Focused'} Posts ({posts.length})</div>
                <div className = "tzone-dropbtns">
                    <div class="tzone-dropdown1">
                        <button class="tzone-dropbtn1"> Views</button>
                        <div class="tzone-dropdown-content1">
                            <a className={path === '/zone/display/' ? "tzone-path-clicked" : "tzone-path-btn"
                            } onClick={() => setPath('/zone/display/')} >View All</a>
                            <a className={path === '/zone/display/focused/' ? "tzone-path-clicked" : "tzone-path-btn" 
                            } onClick={() => setPath('/zone/display/focused/')} >Compressed</a>
                        </div>
                    </div>
                    <div class="tzone-sort-btns">
                        { sortedBy === 'createdAt' ? <button class="tzone-sort-clicked" onClick={() => setSortedBy('createdAt')} >New</button>: <button class="tzone-sort" onClick={() => setSortedBy('createdAt')} >New</button>
                        }
                        {sortedBy === 'likes' ? <button class="tzone-sort-clicked" onClick={() => setSortedBy('likes')} >Popular</button> : <button class="tzone-sort" onClick={() => setSortedBy('likes')} >Popular</button>
                        }
                       
                       
                    </div> 
                    {showPostPopup ? <PostPopup closePopup={togglePostPopup} />
                        : null
                    }

                    {showReportPopup ? <ReportPopup closePopup={toggleReportPopup} rId={rId} type={type} />
                        : null
                    }
                </div>
                {posts.map((data, index) => {
                    return (
                        <div class="tzone-overall-container">
                            <div className="tzone-post-container">

                                <div className="tzone-user-info">
                                    <Link className="tzone-profile-pic">
                                    <ProfilePicture username={data.poster.username} />
                                    </Link>
                                   
                                    <label className="tzone-profile-link" >{data.poster.username} ({data.poster.acs})  
                                    </label>

                                    
                                    
                                    <div className="tzone-likes"> <label> {data.likes} </label></div>
                                    </div>

                                {data.reported ? <label className="tzone-reported"> Reported </label> : <button className="tzone-report-btn" onClick={() => toggleReportPopup( data._id, "post")} >{"Report Post"}</button>
                                   }
                               
                                    
                                    <div className="tzone-post-info">      
                                    <Link to={"/theZone/display/" + (data._id)} className="tzone-link">
                                        <p> {data.body} </p>
                                    </Link>

                                    </div> 
                                 </div>
                        <div className="tzone-post-buttons">
                                <a onClick={() => handlePostAgree(data, index)} className={data.upvoted ? "tzone-post-button-agree-selected" : "tzone-post-button-agree"}> Agree </a>
                                <a onClick={() => handlePostDisagree(data, index)} className={data.downvoted ? "tzone-post-button-disagree-selected" : "tzone-post-button-disagree"}> Disagree </a>
                        </div>

                        </div>
                    )
                })}
                <div className="pagination-center">
                <Pagination className="MuiPagination-ul" color="primary" count={Math.ceil(totalNumber/ 10)} onChange={handlePageChange} />
                </div>
            </div>
        </div>
    )
}


