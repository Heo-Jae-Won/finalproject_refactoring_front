import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

const NoticeRead = ({ match, history }) => {
  const ncode = match.params.ncode;
  const [loading, setLoading] = useState(false);
  const [noticeRead, setNoticeRead] = useState({
    ntitle: '',
    ncontent: '',
    nwriter: '',
    regDate: '',
    ncode: ''
  });

  useEffect(() => {
    fetchNoticeRead();
  }, [])


  const fetchNoticeRead = async () => {
    setLoading(true);
    const result = await axios.get(`/api/notice/read/${ncode}`)
    setNoticeRead(result.data);
    setLoading(false);
  }

  const { ntitle, ncontent, nwriter, regDate } = noticeRead;

  if (loading) return (
    <Spinner animation="border" variant="primary"
      style={{ width: '20rem', height: '20rem', marginTop: '220px' }} />
  )

  return (
    <div className='event_notice'>
      <h2 className='title'>공지사항</h2>
      <div>
        <article className='article event_article' style={{ height: '272px' }}>

          <div className="article_title">
            <h2 style={{ border: 'none' }}>
              제목ㅡ{ntitle}
            </h2>
            <div style={{ width: '100%', borderBottom: '3px solid #000' }}>
              <span style={{ float: 'left' }} aria-label='등록일'>
                작성자: {nwriter}
              </span>
              <h5 className='article_date' style={{ float: 'right' }} aria-label='등록일'>
                {regDate}
              </h5>
            </div>
          </div>

          <section className='article_data'>
            <div className='fr_view'>
              내용ㅡ{ncontent}
            </div>
          </section>
        </article>
      </div>
      <Button onClick={() => { history.go(-1) }}>목록으로</Button>
    </div>
  )
}

export default NoticeRead

