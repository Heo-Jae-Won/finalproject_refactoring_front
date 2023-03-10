import axios from 'axios';
import { addDoc, collection, deleteDoc, doc, getFirestore, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import qs from 'qs';
import { default as React, useContext, useEffect, useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext';
import { app } from '../fireStore';
import MyChatItem from './MyChatItem';
import './MyChatList.css';
import './MyChatList.scss';

const MyChatList = ({ location,  }) => {
    const db = getFirestore(app);
    const navigate=useNavigate();
    const search = qs.parse(location.search, { ignoreQueryPrefix: true });
    const [pcode, setPcode] = useState(search.pcode || 'ab');
    const [Message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [chatId, setChatId] = useState('unde');
    const [pboardInfo, setPboardInfo] = useState({});
    const { loginUser } = useContext(UserContext);
  

 


    const fetchRoomList = async () => {
        const q = query(
            collection(db, `chatroom`),
            where('who', 'array-contains', sessionStorage.getItem('uid')),
            limit(100)
        );



        //chatroom fetch
        onSnapshot(q, (snapshot) => {

            snapshot.forEach(async (doc) => {
                const li = document.createElement('li');

                li.className = 'list-group-item non-click';

                li.innerHTML = `
                <h6>
                ${sessionStorage.getItem('uid') === doc.data().who[0] ?
                        '판매자ㅡ'
                        :
                        '구매자ㅡ'}
                        ${sessionStorage.getItem('uid') === doc.data().who[0] ?
                        doc.data().who[1]
                        :
                        doc.data().who[0]}</h6>
                        <div class='text-small'>${doc.id}</div>
                        <p class='text-small1'>${doc.data().pcode}</p>
                        <img src=${JSON.stringify(doc.data().pimage)} width=70 height=70/>
                `;


                //same chatId onclick ㅡ> duplicate x
                if ((chatId.includes('unde') === true)) {
                    document.getElementsByClassName('list-group chat-list')[0].append(li);
                }
            });

            

            for (let i = 0; i < document.getElementsByClassName('list-group-item non-click').length; ++i) {
                document.getElementsByClassName('list-group-item non-click')[i].addEventListener("click", function () {
                    setChatId(document.getElementsByClassName("text-small")[i].innerHTML)
                    setPcode(document.getElementsByClassName("text-small1")[i].innerHTML)
                })
            }

            extractPboardData();

        });

    }


    


    const extractPboardData = async () => {
        const result = await axios.get(`/api/pboard/onlyread/${pcode}`)
        setPboardInfo(result.data);


    }

    const nonClick = document.querySelectorAll(".non-click");

    const onClick = async (e) => {

        if (e.target.tagName === 'LI' || e.target.tagName === "H6" || e.target.tagName === "IMG") {
            // dom 요소에서 모든 "click" 클래스 제거
            nonClick.forEach((e) => {
                e.classList.remove("click");
            });
            // 클릭한 dom의 최상위요소만 "click"클래스 추가. 
            e.currentTarget.classList.add("click");
        }

    }

    nonClick.forEach((e) => {
        e.addEventListener("click", onClick);
    });



    //Doc element를 최초 생성
    const sendMessage = async (e) => {
       

        if (e.keyCode === 13) {


            if (e.ctrlKey) {
                let val = e.target.value;
                let start = e.target.selectionStart;
                let end = e.target.selectionEnd;
                e.target.value = val.substring(0, start) + "\n" + val.substring(end);
                setMessage(e.target.value);
                return false; //  pre focus
            }
            
            if (Message === '') {
                alert('메시지를 입력하세요')
                return;
            }

        

            const docRef = doc(db, 'chatroom', `${chatId}`);
            const colRef = collection(docRef, 'messagelist')
            await addDoc(colRef, {
                text: Message,
                date: new Date().getTime(),
                uid: sessionStorage.getItem('uid'),
                unickname: loginUser.unickname,
                uprofile: loginUser.uprofile
            });
            setMessage('');
            window.scrollTo({
                top:200,
                left:150,
                behavior: 'smooth'
            })
        }
    }

    const fetchMessageList = () => {

        const q = query(
            collection(db, `chatroom/${chatId}/messagelist`),
            orderBy('date', 'asc'),
            limit(100)
        );

        onSnapshot(q, (snapshot) => {
            let rows = [];
            snapshot.forEach((doc) => {
                rows.push({
                    id: doc.id,
                    uid: doc.data().uid,
                    text: doc.data().text,
                    date: doc.data().date,
                    unickname: doc.data().unickname,
                    uprofile: doc.data().uprofile
                });
            });
            setMessageList(rows);
        });
    }

    const onDeleteMessage = async (id) => {
        Swal.fire({
            text: "메시지를 삭제하시겠습니까?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteDoc(doc(db, `chatroom/${chatId}/messagelist`, id));
            }
        })
    }

    const onDeleteChatroom = (id) => {
        Swal.fire({
            text: "채팅방을 나가시겠습니까?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '퇴장',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {

                //hack : if no use of setTimeout during chatroom exit, chatrooms duplication happen
                setTimeout(() => deleteDoc(doc(db, `chatroom`, id)), 1000);
                document.getElementsByClassName('list-group-item non-click click')[0].remove();
                navigate('/pboard/list')
            }
        })
    }

    useEffect(() => {
        fetchRoomList();
        fetchMessageList();
    }, [chatId]);



    return (
        <li className="container" style={{ marginTop: 100 }}>
            <li className="row" style={{ margin: '150px 0px' }}>

                <li className="col-3 p-0">

                    <ul className="list-group chat-list">
                    </ul>

                </li>
                <li className="col-9 p-0">

                    {chatId.length > 5 && <li className="chat-room">
                        <div className="wrap">
                            {messageList?.map(message =>
                                <div className={message.uid === sessionStorage.uid ? 'chat ch2' : 'chat ch1'}>
                                    <MyChatItem key={message.id}
                                        message={message}
                                        onDeleteMessage={onDeleteMessage} />
                                </div>
                            )}
                        </div>
                        
                        <Row className="mt-5 justify-content-center">
                            <Form className="d-flex my-3" style={{ width: '52rem' }}>
                                <Form.Control
                                    as="textarea"
                                    value={Message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={sendMessage}
                                    placeholder='enter를 누르세요' className="mx-2" />

                            </Form>
                            <div>
                                {((sessionStorage.getItem('uid') !== pboardInfo.uid) && (pboardInfo.pcondition === 0)) &&
                                    <Button Button onClick={() => navigate(`/my/pay/${pcode}`)}>결제창 이동</Button>}
                                <Button style={{ marginLeft: 80 }} onClick={() => navigate(-1)}>뒤로가기</Button>
                                <Button style={{ marginLeft: 80 }} onClick={() => onDeleteChatroom(chatId)}>채팅방 나가기</Button>
                            </div>
                        </Row>
                    </li>}
                </li>
            </li>
            
        </li >
    )
}

export default MyChatList