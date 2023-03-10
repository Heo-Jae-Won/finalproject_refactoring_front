import { Card, Grid, TextField } from '@material-ui/core';
import { Rating } from '@mui/material';
import axios from 'axios';
import { addDoc, collection, getFirestore, limit, onSnapshot, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { Button, ButtonGroup, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { app } from '../fireStore';





const PboardRead = () => {
  const { pcode } = useParams();
  const navigate=useNavigate();
  const db = getFirestore(app);
  const { loginUser } = useContext(UserContext);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparisonPcode, setComparisonPcode] = useState([]);
  const [postRead, setPostRead] = useState({
    ptitle: '',
    pcontent: '',
    pwriter: '',
    plike: '',
    pimage: '',
    viewcnt: '',
    regDate: '',
    pname: '',
    upoint: '',
    file: null,
    uid: ''
  });
  const { uid, ptitle, upoint, pcontent, pwriter, pimage, pprice, pname, file } = postRead;



  const callPostRead = async () => {
    setLoading(true);

    //pcode o ㅡ>rendering on || pcode x ㅡ>move to PboardList
    try {
      const result = await axios.get(`/api/pboard/read/${pcode}`)

      const q = query(
        collection(db, `chatroom`),
        where('who', 'array-contains', sessionStorage.getItem('uid')),
        limit(100)
      );

      onSnapshot(q, (snapshot) => {
        let rows = [];
        snapshot.forEach((doc) => {
          rows.push(doc.data().pcode);
        });
        setComparisonPcode(rows);
      });

      //sell,remove o ㅡ> not allow access
      if (result.data.pcondition === 0) {
        setPostRead(result.data);
        setImage(result.data.pimage);
      } else {
        Swal.fire({
          text: "해당 상품은 판매되었거나 없는 상품입니다",
          icon: 'error',
          confirmButtonColor: '#3085d6',
        })
        let seconds_ms = 1000;
        setTimeout(() => navigate('/pboard/list'), seconds_ms);
      }
    } catch (e) {
      if (e) {
        Swal.fire({
          text: "예상치 못한 오류가 발생하였습니다",
          icon: 'error',
          confirmButtonColor: '#3085d6',
        })
      }
    }
    setLoading(false);
  }


  const onChangeForm = (e) => {
    setPostRead(postRead => ({
      ...postRead,
      [e.target.name]: e.target.value
    })
    )
  }

  const onChangeFile = (e) => {
    setPostRead(postRead => ({
      ...postRead,
      file: e.target.files[0]
    }))
    setImage(URL.createObjectURL(e.target.files[0]))
  }

  const onUpdate = (e) => {
    e.preventDefault();

    Swal.fire({
      text: "정말로 수정하시겠습니까?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '수정',
      cancelButtonText: '취소'
    }).then(async (result) => {

      //수정 click
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("pcode", pcode);
        formData.append("pcontent", pcontent);
        formData.append("ptitle", ptitle);
        formData.append("pprice", pprice);
        formData.append("pwriter", pwriter);
        formData.append("pimage", pimage);
        formData.append("pname", pname);

        try {
          await axios.post('/api/pboard/update', formData);
          Swal.fire({
            text: "수정을 완료하였습니다!",
            icon: 'success',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
          })
        } catch (e) {

          //limit on file size
          e.message === 'Network Error' ?
            Swal.fire({
              text: '파일의 용량이 250MB를 초과하여 업로드할 수 없습니다.',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
            })
            :
            Swal.fire({
              text: '예상치 못한 오류가 발생하였습니다',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
            })
        }
      }
    })

  }

  const onDelete = (e) => {
    e.preventDefault();
    Swal.fire({
      text: "정말로 삭제하시겠습니까?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    }).then(async (result) => {

      //삭제 click
      if (result.isConfirmed) {
        try {
          await axios.post('/api/pboard/delete?pcode=' + pcode);
          Swal.fire({
            text: "삭제를 완료하였습니다!",
            icon: 'success',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
          })
          navigate('/pboard/list')
        } catch (e) {
          if (e) {
            Swal.fire({
              text: '예상치 못한 오류가 발생하였습니다.',
              icon: 'error',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
            })
          }

        }
      }


    })
  }

  const setRoomList = async () => {

    if (comparisonPcode.includes(pcode) === false) {
      const docRef = collection(db, 'chatroom');
      await addDoc(docRef, {
        who: [sessionStorage.getItem('uid'), uid],
        date: new Intl.DateTimeFormat('kr', { dateStyle: 'full', timeStyle: 'full' })
          .format(new Date()),
        pcode: pcode,
        pimage: pimage,
      });
    }
    navigate(`/my/chat`)

  }

  useEffect(() => {
    callPostRead();
  }, [])


  if (loading) return (
    <Spinner animation="border" variant="primary"
      style={{ width: '20rem', height: '20rem', marginTop: '220px' }} />
  )


  return (
    <div>

      <Row className='d-flex justify-content-center my-5'>
        <Card style={{ width: '50rem' }} className="p-3">
          <Form>
            <img src={image || 'https://dummyimage.com/100x100'} alt="빈이미지" width={300} height={300} />
            <Form.Control className='my-3'
              type="file"
              onChange={onChangeFile} />

            <hr />

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={pwriter}
                readOnly
                label="작성자"
                name="pwriter"
                autoComplete="pwriter"
              />
            </Grid>

            <hr />
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                value={ptitle}
                onChange={loginUser.unickname === pwriter && onChangeForm}
                label="제목"
                helperText='제목은 50까지로 제한'
                FormHelperTextProps={{ style: { fontSize: 15 } }}
                name="ptitle"
                autoComplete="ptitle"
              />
            </Grid>
            <hr />
            <Grid item xs={12}>
              <TextField multiline
                minRows={12}
                variant="outlined"
                required
                fullWidth
                value={pcontent}
                onChange={loginUser.unickname === pwriter && onChangeForm}
                label="내용"
                helperText='내용은 300자까지로 제한'
                FormHelperTextProps={{ style: { fontSize: 15 } }}
                name="pcontent"
                autoComplete="pcontent"
              />
            </Grid>

            <hr />
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                helperText='원하는 가격을 입력하세요'
                FormHelperTextProps={{ style: { fontSize: 15 } }}
                value={pprice}
                onChange={loginUser.unickname === pwriter && onChangeForm}
                name="pprice"
                type='number'
                autoComplete="pprice"
              />
            </Grid>

            <hr />
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                helperText='상품명은 30자까지로 제한'
                label='상품명'
                FormHelperTextProps={{ style: { fontSize: 15 } }}
                value={pname}
                onChange={loginUser.unickname === pwriter && onChangeForm}
                name="pname"
              />
            </Grid>
            <hr />

            {upoint ? <>
              <span style={{ marginRight: 50, fontSize: 20 }}>판매자 별점</span>
              <Rating
                emptySymbol="fa fa-star-o fa-2x"
                fullSymbol="fa fa-star fa-2x"
                value={upoint}
                readOnly
                fractions={5} precision={0.5} max={5} />({upoint})
            </>
              : <h1>거래 이력이 없습니다.</h1>}
            <div style={{ marginTop: 30 }}>

              <ButtonGroup>
                {loginUser.unickname === pwriter &&
                  <>
                    <Button onClick={onUpdate} style={{ marginRight: 90 }}>상품 수정</Button>
                    <Button style={{ marginRight: 90 }} onClick={onDelete} >상품 삭제</Button>
                  </>}
                {loginUser.unickname !== pwriter &&
                  <Button style={{ marginRight: 90 }} onClick={() => setRoomList()}>채팅하기</Button>}
                <Button onClick={() => history.push('/pboard/list')}>상품 목록으로</Button>
              </ButtonGroup>
            </div>

          </Form>
        </Card>
      </Row>
    </div>
  )
}

export default PboardRead