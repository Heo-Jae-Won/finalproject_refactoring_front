import { Card, Grid, TextField } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

const PboardInsert = () => {
    const { unickname } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState('');
    const [form, setForm] = useState({
        pwriter: unickname,
        pprice: '',
        ptitle: '',
        pcontent: '',
        pname: '',
        file: null,
        pimage: ''
    })

    const { pname, pprice, ptitle, pcontent, pimage, file, pwriter } = form;

    const onChangeForm = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const onChangeFile = (e) => {
        setForm(prev => ({
            ...prev,
            file: e.target.files[0]
        }))
        setImage(URL.createObjectURL(e.target.files[0]))
    }

    const onInsert = async () => {

        const formData = new FormData();
        formData.append("file", file);
        formData.append("pcontent", pcontent);
        formData.append("ptitle", ptitle);
        formData.append("pprice", pprice);
        formData.append("pwriter", pwriter);
        formData.append("pimage", pimage);
        formData.append("pname", pname);


        Swal.fire({
            text: "등록하시겠습니까?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '등록',
            cancelButtonText: '취소'
        }).then(async (result) => {

            if (result.isConfirmed) {

                try {
                    await axios.post('/api/pboard/insert', formData);
                    Swal.fire({
                        text: "등록이 완료되었습니다",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                    })
                    navigate('/pboard/list')
                } catch (e) {
                    Swal.fire({
                        text: "이미지 파일의 확장자는 jpg와 png만 가능합니다.",
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                    })
                }
            }
        })
    }


    // 새로고침 막기(조건 부여 가능)
    useEffect(() => {
        window.onbeforeunload = function () {
            return true;
        };
        return () => {
            window.onbeforeunload = null;
        };
    }, [])

    return (
        <div>

            <Row className='d-flex justify-content-center my-5'>
                <Card style={{ width: '60rem' }} className="p-3">
                    <Form>
                        <Grid item xs={12}>
                            <p style={{ width: "100%" }}>이미지</p>
                            <img src={image || 'https://dummyimage.com/300x300'}
                                alt="빈이미지" title='메인이미지' width={300} height={300} />
                        </Grid>
                        <Form.Control className='my-3'
                            type="file"
                            onChange={onChangeFile} />
                        <hr />

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                value={ptitle}
                                onChange={onChangeForm}
                                label="제목"
                                name="ptitle"
                                autoComplete="ptitle"
                            />
                        </Grid>
                        <hr />
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="상품명"
                                value={pname}
                                onChange={onChangeForm}
                                name="pname"
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
                                onChange={onChangeForm}
                                label="내용은 300자 제한"
                                name="pcontent"
                                autoComplete="pcontent"
                            />

                            <hr />
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="가격"
                                    value={pprice}
                                    onChange={onChangeForm}
                                    name="pprice"
                                    type='number'
                                    autoComplete="pprice"
                                />
                            </Grid>
                            <hr />

                        </Grid>
                        <div style={{ marginTop: 30 }}>
                            <Button onClick={onInsert} style={{ width: '20%', margintTop: 100 }}>상품 등록</Button>
                            <Button onClick={() => navigate(-1)} style={{ width: '20%', marginLeft: 200 }}>뒤로가기</Button>

                        </div>

                    </Form>
                </Card>
            </Row>
        </div>
    )
}

export default PboardInsert



