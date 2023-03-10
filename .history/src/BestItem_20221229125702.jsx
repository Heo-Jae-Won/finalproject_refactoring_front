import { Button } from 'react-bootstrap';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate, withRouter } from 'react-router-dom';


const BestItem = ({ bestList }) => {
  const navigate = useNavigate();
  const { pcode, plike, ptitle, pimage } = bestList;

  const onClick = (e) => {
    e.preventDefault();
    const href = e.target.getAttribute("href")
    navigate(href);
  }
  return (

    <div>
      <img src={pimage} alt={ptitle} width={300} height={300} border={2} />
      <span>{ptitle}</span>
      <p>좋아요: {plike}</p>
      <Button variant='secondary'>
        <Nav.Link href={`/pboard/read/${pcode}`} onClick={onClick}>자세히보기</Nav.Link>
      </Button>
    </div>

  )
}

export default withRouter(BestItem)