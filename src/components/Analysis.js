import React, {Component, useEffect, useState, useContext} from 'react';
import {AuthContext} from '../Context/AuthContext';
import '../styling/Analysis.css';
import { useHistory } from 'react-router-dom';
import AnalysisPost from "./AnalysisPost"
import { Pagination } from '@material-ui/lab';

export default function Analysis() {
  
  const [currentTierPosts, setCurrentTierPosts] = useState(0);
  const [otherTierPosts, setOtherTierPosts] = useState(0);
  const [pastTierPosts, setPastTierPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotlaPages] = useState(1);
  const authContext = useContext(AuthContext);
  let history = useHistory();

  useEffect(() => {
    handlePageChange();
    setPage(page);

    fetch('/analysis/current/').then(res => res.json())
    .then(current => {
      setCurrentTierPosts(current.analyses.currentAcsTier);
      setOtherTierPosts(current.analyses.otherAcsTiers);
    }).catch(err => {})

    fetch('/analysis/past/'+ ((page-1)*10).toString() + '/10').then(res => res.json())
    .then(past => {
      setPastTierPosts(past.analyses)
    }).catch(err => {})

    fetch('/analysis/past/size').then(res => res.json())
    .then(res => {
      setTotlaPages(Math.ceil(res.size / 10));
    }).catch(err => {})

    fetch('/analysis/past/size').then(res => res.json())
    .then(res => {
      setTotlaPages(Math.ceil(res.size / 10));
    })

  },[page]);


  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePostClick = (event, value, post) => {
    console.log("REDIRECT RDIRECT");
    history.push("/analysis/post/" + post._id)
  };

  return(

    <body>
        <div className="analysis-page">

          <div className="analysis-container">

            <h1 className="analysis-title">Debates and Analysis</h1>

            <div className="analysis-category-div">
              <label className="analysis-category-label">In Progress (Open)</label>
            </div>

            {currentTierPosts.length > 0 && Array.from(Array(currentTierPosts.length)).map((x, index) => <AnalysisPost post={currentTierPosts[index]} handlePostClick={handlePostClick}/>)}

            <div className="analysis-category-div">
              <label className="analysis-category-label">In Progress (Locked)</label>
            </div>

            {otherTierPosts.length > 0 && Array.from(Array(otherTierPosts.length)).map((x, index) => <AnalysisPost post={otherTierPosts[index]} handlePostClick={handlePostClick}/>)}

            <div className="analysis-category-div">
              <label className="analysis-category-label">Past Debates and Analysis</label>
            </div>

            {pastTierPosts.length > 0 && Array.from(Array(pastTierPosts.length)).map((x, index) => <AnalysisPost post={pastTierPosts[index]} handlePostClick={handlePostClick}/>)}

            <div className="analysis-pagination">
              <Pagination count={totalPages} color="primary" onChange={handlePageChange} />
            </div>
            

          </div>
      </div>
    </body>
    
  );
    
}
