import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginRestore = () => {
  const {uid} = useParams();
const navigate=useNavigate();
  //restore id
  const OnRestore = () => {
    Swal.fire({
      text: "아이디를 복원하시겠습니까?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '복원',
      cancelButtonText: '취소'
    }).then(async (result) => {

      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("uid", uid);

        try {
          await axios.post('/api/user/restore', formData);
          Swal.fire({
            text: "아이디 복원을 완료하였습니다!",
            icon: 'success',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
          })
          navigate('/login/form');
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
    })
  }







  return (
    <div>
      <img src='/image/fn.jpg' width={930} height={410} style={{marginTop:20}} />
      <div style={{ marginTop: 50 }}>
              <Button onClick={OnRestore}>계정복구</Button>
      </div>
    </div>
  )
}

export default LoginRestore