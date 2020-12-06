
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../Context/AuthContext';
import Pagination from "@material-ui/lab/Pagination";
import Reports from './Reports';
import "../styling/Reports.css";

export default function Report(props) { 
  const [reportList, setReportList] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const authContext = useContext(AuthContext); 
  const [type, setType] = useState("post"); 
  const [totalNumber, setTotalNumber] = useState(0); 
 
  const onChangeSelect = (e) => {
    console.log(e.target.value);
    if (e.target.value === "Posts") { 
      setType("post"); 
      window.location.reload(); 
    }
    
    else if (e.target.value === "Comments") {
      setType("comment"); 
      props.history.push('/reports/comment');
      window.location.reload(); 
    }
    
  }
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage); 
  }
  
  const handlePosts=  async (page) => {
    await fetch("/report/reportedPosts/" + page).then(response => response.json()) 
    .then( data => {
      setReportList(data.posts); 
      setTotalNumber(data.reports); 
    })
  }

  useEffect( () =>  {
    //console.log(currentPage -1 + "\ncurrentpage: " + currentPage ); 
    handlePosts(currentPage - 1); 
    
  }, [currentPage])
  //<Pagination shape="rounded"totalPages={Math.ceil(totalNumber/10)} onPageChange={(e, d) => setCurrentPage(d.activePage)} activePage={currentPage}/>   
  return (
    <div className="reports-background">
      <div className="reports-container" >
        <div>
          <h1> Reports </h1>
          <div className="reports-selection">
            <select onChange={onChangeSelect}>
              <option> Posts </option>
              <option> Comments </option>
            </select>
          </div>
          <div>
          <Reports reports={reportList} type={type}/>
          <Pagination className="MuiPagination-ul" color="primary" count={Math.ceil(totalNumber/10)} onChange={handlePageChange} />
          </div>
        </div>
      </div>
    </div>
  )
}