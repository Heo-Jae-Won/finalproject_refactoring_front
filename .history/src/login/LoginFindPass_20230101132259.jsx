import React, { useState } from 'react'
import { Alert, Button, Card, Form, Row } from 'react-bootstrap';
import { Grid, TextField } from '@material-ui/core';
import axios from 'axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

const LoginFindPass = () => {
  const message='비밀번호를 재발급하는 데 약 7-8초의 시간이 소요됩니다.';
  const navigate=useNavigate();
  const [form, setForm] = useState({
    uid: '',
    uemail: ''
  })

  const onCheckEmail = (form) => {
    var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
    const result = regExp.test(form);
    if (!result) {
      Swal.fire({
        text: "이메일 양식을 준수해 주세요",
        icon: 'error',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      })
    }
    return result;
  }

  const { uid, uemail } = form;

  const onChangeForm = (e) => {
    setForm(prev=>({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const onFindPass = async (e) => {
    e.preventDefault();

    if (uid === '' || uemail === '') {
      Swal.fire({
        text: "아이디와 이메일을 입력하세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      })
      return;
    }

    if (!onCheckEmail(form.uemail)) {
      return;
    }

    //find pass
    try {
      const result = await axios.post('/api/user/password', form);

      if (result.data === 1) {
        Swal.fire({
          text: "입력한 아이디는 가입되지 않은 아이디입니다",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        })
      } 
      
      else if (result.data === 2) {
        Swal.fire({
          text: "입력하신 이메일은 가입되지 않은 이메일입니다",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        })
      }
      
      else if(result.data===3){
        Swal.fire({
          text: "가입된 메일 주소로 임시 재발급 비밀번호가 발급되었습니다!",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        })
        navigate('/login/form')
      }
    } catch (e) {
      if (e) {
        Swal.fire({
          text: "예상치 못한 오류가 발생하였습니다",
          icon: 'error',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        })
      }
    }
    
  }

  return (
    <div>
      <Row className='d-flex justify-content-center my-5'>
        <Card style={{ width: '30rem' }} className="p-3">
          <Form onSubmit={onFindPass}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="id"
                label="id"
                value={form.uid}
                name="uid"
                autoComplete="unick"
                onChange={onChangeForm}
              />
            </Grid>
            <hr />
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="email"
                value={form.uemail}
                name="uemail"
                onChange={onChangeForm}
              />
            </Grid>
            <hr />
            <Button type='submit' style={{ width: '50%' }}>임시비밀번호 발급</Button>
            <Alert>{message}</Alert>
          </Form>
        </Card>
      </Row>
    </div>
  )
}

export default LoginFindPass