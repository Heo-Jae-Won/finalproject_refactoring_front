import { MenuItem, TextField } from '@material-ui/core';
import axios from 'axios';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import Pagination from 'react-js-pagination';
import { useLocation, useNavigate } from 'react-router-dom';
import NoticeItem from './NoticeItem';

const NoticeList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const search = qs.parse(location.search, { ignoreQueryPrefix: true });
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('제목');
    const [noticeList, setNoticeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(1);
    const page = parseInt(search.page) || 1;
    const num = 5;

    //로딩 on ㅡ> 출력 ㅡ> 로딩 off
    const fetchNoticeList = async () => {
        setLoading(true);
        const result = await axios.get(`/api/notice/list?page=${page}&num=${num}&searchType=${searchType}&keyword=${query}`);
        setNoticeList(result.data.list);
        setTotal(result.data.total);
        setLoading(false);
    }



    //검색 시 목록 출력
    const fetchFilteredList = (e) => {
        if (e.keyCode === 13) {
            fetchNoticeList();
        }
    }

    useEffect(() => {
        fetchNoticeList();
    }, [page])

    if (loading) return (
        <Spinner animation="border" variant="primary"
            style={{ width: '20rem', height: '20rem', marginTop: '220px' }} />
    )

    const onPageChange = (e) => {
        navigate(`/notice/list?page=${e}`)
        window.scrollTo({
            top: 0,
            left: 150,
            behavior: 'smooth'
        })
    }

    return (
        <div className='main'>
            <TextField style={{ marginTop: 100, marginLeft: 900, marginBottom: 50, width: 120 }}
                className='search'
                select
                value={searchType}
                name='searchType'
                onChange={(e) => setSearchType(e.target.value)}>
                <MenuItem value='제목' style={{}}>제목</MenuItem>
                <MenuItem value='내용'>내용</MenuItem>
                <MenuItem value='작성자'>작성자</MenuItem>
                <MenuItem value='작성날짜'>등록날짜</MenuItem>
            </TextField>

            <TextField value={query}
                className='search2'
                style={{ marginLeft: 15, marginBottom: 50, width: 200, marginTop: 100 }}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={fetchFilteredList}>
            </TextField>

            <Table striped>
                <thead>
                    <tr >
                        <th>관리자 이름</th>
                        <th>제목</th>
                        <th>작성일자</th>
                    </tr>
                </thead>
                <tbody>
                    {noticeList.map(noticelist =>
                        <>
                            <NoticeItem key={noticelist.ncode} noticelist={noticelist} />
                        </>
                    )}
                </tbody>
            </Table>
            <br />
            <br />

            <div style={{ marginLeft: 630 }}>
                <Pagination
                    activePage={page}
                    itemsCountPerPage={6}
                    totalItemsCount={total}
                    pageRangeDisplayed={10}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(e) => onPageChange(e)}
                /> </div>
        </div>

    )
}
export default NoticeList