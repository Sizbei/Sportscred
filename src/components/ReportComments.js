import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../Context/AuthContext';
import Pagination from "@material-ui/lab/Pagination"
import Reports from './Reports'
import "../styling/Reports.css"

export default function Report(props) { 
  const [reportList, setReportList] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const authContext = useContext(AuthContext); 
  const [type, setType] = useState("comment"); 
  const [totalNumber, setTotalNumber] = useState(0); 


  const onChangeSelect = (e) => {
    console.log(e.target.value);
    if (e.target.value === "Posts") { 
      setType("post"); 
      props.history.push('/reports/post');
      window.location.reload(); 
    }
    
  }
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage); 
  }
  
  //count={10} color="primary" onChange={handlePageChange}
  /*color="primary" 
          size="large" 
          shape="rounded" 
          totalPages={Math.ceil(totalNumber/10)} 
          onPageChange={(e, d) => setCurrentPage(d.activePage)} 
          activePage={currentPage}
          */
  const handleComments = async (page) => { 
    await fetch("/zone/display/" + authContext.user.username + "/reportedComments/" + page).then(response => response.json()) 
    .then (data => {
      setReportList(data.comments);
      setTotalNumber(data.reports); 
      //console.log(data); 
    })
  }
  useEffect( () =>  {
    handleComments(currentPage - 1); 
  }, [currentPage])
  //
  return (
    <div className="reports-background">
      <div className="reports-container" >
        <div>
          <h1> Reports </h1>
          <div className="reports-selection">
            <select value={"Comments"} onChange={onChangeSelect}>
              <option> Posts  </option>
              <option> Comments </option>
            </select>
          </div>
          <div className ="reports-full-body-container">
          <Reports reports={reportList} type={type}/>
          <Pagination className="MuiPagination-ul" color="primary" count={Math.ceil(totalNumber/10)} onChange={handlePageChange} />
          </div>
        </div>
      </div>
    </div>
  )
}