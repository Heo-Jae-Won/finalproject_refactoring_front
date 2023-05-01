import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { confirmRestore } from '../util/swal/confirmation';
import { restoreUser } from '../util/axios/login';
import { informServerError, informSuccess } from '../util/swal/information';

/**
 * 회원복구 화면
 */
const LoginRestore = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleUserRestore = () => {
    confirmRestore().then(async (result) => {

      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("userId", userId);

        //회원 복구
        await restoreUser(formData).then(() => {
          informSuccess()
          navigate('/login/form');
        }).catch(() => {
          informServerError()
        })

      }
    })
  }

  return (
    <div>
      <img src='/image/fn.jpg' width={930} height={410} style={{ marginTop: 20 }} alt="빈 이미지" />
      <div style={{ marginTop: 50 }}>
        <Button onClick={handleUserRestore}>계정복구</Button>
      </div>
    </div>
  )
}

export default LoginRestore