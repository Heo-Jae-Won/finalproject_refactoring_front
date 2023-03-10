import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { Alert, Button, Form, Row, Spinner } from 'react-bootstrap';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { UserContext } from '../context/UserContext';
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom';

const MyInfo = () => {
  const { loginUser, setLoginUser } = useContext(UserContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const navigate= useNavigate();
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const {uid} = useParams();



  const onChangeLoginUser = (e) => {
    setLoginUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  //validate phonenumber
  const onCheckPhonenumber = (loginuser) => {
    var regExp = /^\d{3}-\d{3,4}-\d{4}$/;
    const result = regExp.test(loginuser);
    if (!result) {
      Swal.fire({
        text: "전화번호 양식을 준수해주세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      })
    }
    return result;
  }

  //validate email
  const onCheckEmail = (loginuser) => {
    var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
    const result = regExp.test(loginuser);
    if (!result) {
      Swal.fire({
        text: "이메일 양식을 준수해 주세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      })
    }
    return result;
  }

  //check duplication of nickname
  const onCheckUnickanme = async (e) => {
    e.preventDefault();
    if (loginUser.unickname === '') {
      Swal.fire({
        text: "닉네임을 입력하세요",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      })
    }

    const result = await axios.get(`/api/user/${loginUser.unickname}`);
    result.data === 1 ?
      setMessage('사용 가능한 닉네임입니다.')
      :
      setMessage('해당 닉네임은 사용할 수 없습니다')
  }




  const onChangeLoginUserFile = (e) => {
    setLoginUser({
      ...loginUser,
      file: e.target.files[0],
    })
    setImage(URL.createObjectURL(e.target.files[0]));
  }


  const fetchUserInfo = async () => {
    setLoading(true);
    const result = await axios.get(`/api/user/${uid}`);
    setLoginUser(result.data);
    setImage(result.data.uprofile);
    setLoading(false);
  }

  //fetching address API
  const handlePostCode = (data) => {

    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
    setAddress(fullAddress)
  }

  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "10%",
    width: "600px",
    height: "600px",
    padding: "7px",
  };

  //update myinfo
  const onUpdate = () => {

    if (onCheckPhonenumber(loginUser.utel) === false) {
      return;
    }

    if (!onCheckEmail(loginUser.uemail)) {
      return;
    }

    Swal.fire({
      text: "정말로 수정하시겠습니까?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '수정',
      cancelButtonText: '취소'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("uid", uid);
        formData.append("unickname", loginUser.unickname);
        formData.append("uprofile", loginUser.uprofile);
        formData.append("uaddress", address || loginUser.uaddress);
        formData.append("uemail", loginUser.uemail);
        formData.append("utel", loginUser.utel);
        formData.append("file", loginUser.file);

        try {
          await axios.post('/api/user/update', formData);
          Swal.fire({
            text: "수정을 완료하였습니다!",
            icon: 'success',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
          })
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

  //deactivate membership
  const onDelete = () => {

    Swal.fire({
      text: "회원을 탈퇴하시겠습니까?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '수정',
      cancelButtonText: '취소'
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        const formData = new FormData();
        formData.append("uid", loginUser.uid);
        await axios.post('/api/user/deactivate', formData);

        Swal.fire({
          text: "탈퇴가 완료되었습니다!",
          icon: 'success',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        })

        sessionStorage.removeItem('uid');
        navigate('/');
      }
    })
  }

  useEffect(() => {
    fetchUserInfo();
  }, [uid]);

  if (loading) return (
    <Spinner animation="border" variant="primary"
      style={{ width: '20rem', height: '20rem', marginTop: '220px' }} />
  )

  return (
    <>
      <div className='modal-address'>
        {isPopupOpen && (
          <div>
            <DaumPostcodeEmbed
              style={postCodeStyle} onClose={() => setIsPopupOpen(false)} onComplete={handlePostCode} />
          </div>
        )}
      </div>
      <div className='d-flex justify-content-center mt-5' >
        <Row className='mt-3'>
          <Form style={{ marginLeft:'70px' }}>
            <Form.Group className="mb-3" style={{ width: '300px' }}>
              <Form.Label>NickName</Form.Label>
              <Form.Control
                placeholder="닉네임"
                name='unickname'
                value={loginUser.unickname}
                onChange={onChangeLoginUser} />
              {message && <Alert>{message}</Alert>}
              <Button className='mt-3' onClick={onCheckUnickanme}>닉네임 중복확인</Button>
            </Form.Group>

            <Form.Group className="mb-3" style={{ width: '300px' }}>
              <Form.Label>Tel</Form.Label>
              <Form.Control
                name='utel'
                placeholder="Tel"
                value={loginUser.utel}
                onChange={onChangeLoginUser} />
            </Form.Group>
            <Form.Group className="mb-3">
            </Form.Group>

            <Form.Group className="mb-3" style={{ width: '300px' }}>
              <Form.Label>Email</Form.Label>
              <Form.Control
                name='uemail'
                placeholder="Email"
                value={loginUser.uemail}
                onChange={onChangeLoginUser} />
            </Form.Group>

            <Form.Group className="mb-3" style={{ width: '300px' }}>
              <Form.Label>Address</Form.Label>
              <Form.Control
                name='uaddress'
                value={address || loginUser.uaddress}
                onChange={onChangeLoginUser} />
            </Form.Group>

            <Button type='button'
              style={{ marginLeft:'-150px', marginTop: 2 }}
              onClick={() => setIsPopupOpen(true)}>우편번호 검색</Button>
            <Button className='postCode_btn'
              style={{ marginLeft: 60, marginTop: 2 }}
              type='button'
              onClick={() => setIsPopupOpen(false)} >닫기</Button>

            <Form.Control
              className="my-3" style={{ width: '300px' }}
              type="file"
              onChange={onChangeLoginUserFile}
            />
            <img src={image} style={{ width: "300px", height: "350px", marginLeft: '-150px' }} />

            <div style={{ marginTop: 20, marginLeft:'-100px' }}>
              <Button className='ff'
              style={{marginLeft:'-10px'}}
                onClick={onUpdate}>
                정보 변경하기
              </Button>
              <Button className='ff1' onClick={onDelete}>회원탈퇴</Button>
              <Button className='mx-5' onClick={() => navigate(`/my/pass/update`)}>
                비밀번호 변경
              </Button>
            </div>
          </Form>
        </Row>
      </div>
    </>
  );
}


export default MyInfo