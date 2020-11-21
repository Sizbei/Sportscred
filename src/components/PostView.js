import React, {useState,  useEffect, useContext} from "react"
import ProfilePicture from './ProfilePicture'
import ReportPopup from './TheZoneReportPopup';
import '../styling/PostView.css'
import {AuthContext} from '../Context/AuthContext';
import { Link } from 'react-router-dom';
/*
 {username: 'user4', comment: 'blah blah', acs: 23}, 
        {username: 'user2', comment: 'blah blah1', acs: 22}, 
        {username: 'user1', comment: 'blah blah2', acs: 3}, 
        */
export default function View(props) {
    const authContext = useContext(AuthContext); 
    const postId = props.location.pathname.slice(17, props.location.pathname.length); 
    const path = ' /zone/display/' + authContext.user.username + '/' + postId ; 
    const [commentBody, setCommentBody] = useState(''); 
    const [username, setUsername] = useState(''); 
    const [likes, setLikes] = useState(0); 
    const [acs, setAcs] = useState(0); 
    const [content, setContent] = useState(''); 
    const [agree, setAgree] = useState(false); 
    const [disagree, setDisagree] = useState(false); 
    const [comments, setComments] = useState([]);

    const [rId, setRId] = useState('');
    const [reported, setReported] = useState(false);
    const [type, setType] = useState('');

    const [showReportPopup, setReportPopup] = useState(false);
    const [showReportBtn, setShowReportBtn] = useState(false);

    useEffect(() => {
      
        fetch(path).then(res => res.json())
        .then(data => {
          console.log(data); 
          setUsername(data.posts.poster.username); 
          setAcs(data.posts.poster.acs); 
          setLikes(data.posts.likes); 
          setContent(data.posts.body); 
          setAgree(data.posts.upvoted); 
          setDisagree(data.posts.downvoted); 
          setComments(data.posts.comments); 
          setReported(data.posts.reported)
        })
        .catch((error) => {
          console.log(error); 
        })
        
      }, [])
    
    const handlePostAgree = async () => {
        
        const body = {
          post: postId, 
          username: authContext.user.username, 
          upvoted: agree, 
          downvoted: disagree, 
        }
        await fetch('/zone/upvote', {
          method :  "put",
          body : JSON.stringify(body),
          headers: {
              'Content-Type' : 'application/json'
          }
        }).then(res => res.json())
        //axios.post('http://localhost:5000/post/add', body)
        .then(data => {
          setAgree(data.upvoted);
          setDisagree(data.downvoted); 
          setLikes(data.likes); 
        }) 
        .catch((error) => {
          console.log(error);
        })  
        
        
    }
    const handlePostDisagree = async () => {
      
      const body = {
        post: postId, 
        username: authContext.user.username, 
        upvoted: agree, 
        downvoted: disagree, 
      }
      await fetch('/zone/downvote', {
        method :  "put",
        body : JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json'
        }
      }).then(res => res.json())
      //axios.post('http://localhost:5000/post/add', body)
      .then(data => {
        setDisagree(data.downvoted); 
        setAgree(data.upvoted);
        setLikes(data.likes); 
      }) 
      .catch((error) => {
        console.log(error);
      })  
    }

  const toggleReportPopup = (rId, type) => {
    setRId(rId);
    setType(type);

    setReportPopup(!showReportPopup);
  }
  
    const handleCommentAgree = async (data, index) => {      
      const body = {
        comment: data._id, 
        username: authContext.user.username, 
        upvoted: data.upvoted, 
        downvoted: data.downvoted, 
      }
      await fetch('/zone/upvote', {
        method :  "put",
        body : JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json'
        }
      }).then(res => res.json())
      //axios.post('http://localhost:5000/post/add', body)
      .then(updatedData => {
        const updatedEntry = {
          "_id": data._id, 
          "commenter": {
            "username": data.commenter.username, 
            "image": data.commenter.image,
            "acs": data.commenter.acs
          },
          "body": data.body, 
          "likes": updatedData.likes, 
          "upvoted": updatedData.upvoted, 
          "downvoted": updatedData.downvoted
        }
        const newComments = [
          ...comments.slice(0, index),
          updatedEntry, 
          ...comments.slice(index +1) 
        ]
        setComments(newComments); 
      }) 
      .catch((error) => {
        console.log(error);
      })  
      
    }
    const handleCommentDisagree = async (data, index) => { 
      const body = {
        comment: data._id, 
        username: authContext.user.username, 
        upvoted: data.upvoted, 
        downvoted: data.downvoted, 
      }
      await fetch('/zone/downvote', {
        method :  "put",
        body : JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json'
        }
      }).then(res => res.json())
      //axios.post('http://localhost:5000/post/add', body)
      .then(updatedData => {
        const updatedEntry = {
          "_id": data._id, 
          "commenter": {
            "username": data.commenter.username, 
            "image": data.commenter.image,
            "acs": data.commenter.acs
          },
          "body": data.body, 
          "likes": updatedData.likes, 
          "upvoted": updatedData.upvoted, 
          "downvoted": updatedData.downvoted
        }
        const newComments = [
          ...comments.slice(0, index),
          updatedEntry, 
          ...comments.slice(index +1) 
        ]
        setComments(newComments); 
      }) 
      .catch((error) => {
        console.log(error);
      })  
    }
    const handleChangeCommentBody = (e) => {
      setCommentBody(e.target.value); 
    }
    const handleAddComment = async () => { 
      const body = {
        post: postId, 
        commenter: authContext.user.username, 
        body: commentBody,
      }
      await fetch('/zone/addComment', {
        method :  "post",
        body : JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json'
        }
      }).then(res => res.json())
      //axios.post('http://localhost:5000/post/add', body)
      .then(data => {
        window.location.reload(); 
      }) 
      .catch((error) => {
        console.log(error);
      })
    }
  return (
  <div className="tzpv-background">
      <div className="tzpv-container">

        {showReportPopup ? <ReportPopup closePopup={toggleReportPopup} rId={rId} type={type} />
          : null
        }

        <div className="tzpv-post-container">
            <div className="tzpv-user-info">
           <label> <Link to={'/profile/' + authContext.user.username} className="tzpv-profile-pic">
                <ProfilePicture username = {username}/>
            </Link></label>

             <label className="tzpv-profile-link"> {username} ({acs})
             </label> 
             

                <div className="tzpv-likes"> <label> {likes} </label></div>
            </div>
            {authContext.user.permissions === "Moderator" ? <label className="tzpv-id-label">id: {postId}</label> : null }
          {reported ? <label className="tzpv-reported"> Post reported </label> : <button className="tzone-report-btn" onClick={() => toggleReportPopup(postId, "post")} >{"Report Post"}</button>
          }


            <div className="tzpv-post-info"> 
        
            <p> {content} </p>
            
            </div>
        </div>
        <div className="tzpv-post-buttons"> 
            <button onClick={handlePostAgree} className={agree ? "tzpv-post-button-agree-selected" :"tzpv-post-button-agree" }>   Agree  </button>
           
            <button onClick={handlePostDisagree} className={disagree? "tzpv-post-button-disagree-selected" : "tzpv-post-button-disagree" }> Disagree </button>
        </div>
        <div className="tzpv-post-comment-container">
            <input type="text" name="comment-body" onChange={handleChangeCommentBody}/>
            <button onClick={handleAddComment}> Post Comment </button> 

        </div>
        <div className="tzpv-comments-container"> 
          <h2> Comments ({comments.length})</h2>
            {comments.map((data,index) => {
                console.log(data._id); 
                return (
                  <div>
                    {authContext.user.permissions === "Moderator" ? <label className="tzpv-id-label">id: {data._id}</label> : null }
                    <div id={data._id} className="tzpv-comment-container">
                        <label className="tzpv-comment-like">{data.likes}</label>
                        <div className="tzpv-profile">
                      <label> <Link to={'/profile/' + data.commenter.username} className="tzpv-profile-link">
                        {data.commenter.username} ({data.commenter.acs}) </Link> </label>
                      <Link  className="tzpv-profile-link">
                            <ProfilePicture scale={0.8} username={data.commenter.username}/> </Link>
                           {data.reported ? <button className="tzpv-creported"> Comment reported </button> : <button className="tzpv-creport-btn" onClick={() => toggleReportPopup(data._id, "comment")} >{"Report Comment"}</button>
                            }
                            
                            <div className="tzpv-comment-agree-disagree">
                                <a onClick={()=>handleCommentAgree(data, index)}className={data.upvoted? "tzpv-comment-link-selected": "tzpv-comment-link"}> Agree </a>
                                <a onClick={()=>handleCommentDisagree(data, index)}className={data.downvoted? "tzpv-comment-link-selected": "tzpv-comment-link"}> Disagree </a>
                            </div>      
                            
                        </div>
                          
                        <p> {data.body} </p>

                    </div>
                  </div>
                )
            })}
        </div>
      </div>
  </div>
  )
}