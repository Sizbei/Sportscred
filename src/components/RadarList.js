import React, {  useState } from 'react';
import '../styling/RadarList.css';  
import PropTypes from "prop-types";
import { withRouter } from "react-router";

/*{pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user1",acs: 20},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user2",acs: 21},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user3",acs: 22},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user4",acs: 23},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user5",acs: 24},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user6",acs: 25},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user7",acs: 26},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user8",acs: 27},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user9",acs: 28},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user10",acs: 90},
      {pictureUrl: "https://i.imgur.com/55sUslQ.png", username: "user11",acs: 30},*/
/*
useEffect(() => {
  const fetchPosts = async() => {
    setLoading(true); 
    fetch(auth + "/radarlist").then(res => res.json())
    .then(data => {
      setPosts(data.radarList)
    }) 
    setLoading(false); 
  }
  fetchPosts(); 
}, []);
*/
function Pagination(props) {
  const pageNumbers = []; 
  for(let i = 1; i <= Math.ceil(props.totalPosts/props.postsPerPage); i++) {
      pageNumbers.push(i); 
  }
  
  return (
      <nav> 
          <ul className="radar-list-pagination"> 
              {pageNumbers.map(number => ( 
                <div className='radar-list-page-box'>
                    <button key={number} onClick={()=>props.paginate(number)} > 
                    {number}
                    </button>
                </div>
                

              ))}
          </ul>
      </nav>
  )
}
//<button onClick={()=>sendToUser(data.username)}>{data.username}</button>
function Posts(props){ 
  const posts = props.posts; 

  return (
    <div className="radar-list-popup-table">  
      <table>
          <tbody>
          {posts.map(data => {
              return (
                <tbody>
                  <tr key={data.acs + data.username}>
                      <td>
                        <div className="radar-list-profile-preview">
                          <div className="radar-list-photo">
                            <img className="radar-list-popup-img" src={data.profilePic}></img>
                                              
                          </div>
                      </div>
                        
                        </td>
                      <td><a className="radar-list-popup-table-username" onClick={()=>props.changeUser(data.username)}>{data.username}  ({data.acs})</a></td>
                  </tr>
                </tbody>
              )
          })} 
      
          </tbody>
        </table>   
    </div>
  )
}

export default function RadarList(props) { 
const posts =  props.radarList; 
const [currentPage, setCurrentPage] = useState(1);
const [postsPerPage] = useState(5); 
const changeUser = props.changeUser;

//Get current posts 
const indexOfLastPost = currentPage * postsPerPage; 
const indexOfFirstPost = indexOfLastPost - postsPerPage; 
const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); 

//change page 
const paginate = (pageNumber) => setCurrentPage(pageNumber); 
return (
  <div className="radar-list-container">
      <h1 className="radar-list-h1"> Radar List </h1>
    
      <Posts posts={currentPosts} changeUser={changeUser}/> 
      <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
  </div>
);
}
