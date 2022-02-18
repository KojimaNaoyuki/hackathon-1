import { Component } from 'react';
import { withRouter } from "react-router-dom";
import styled from 'styled-components';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';

import Btn from '../presentational/atoms/Btn';
import HelpMan from '../../img/HelpMan.svg'
import Work from '../../img/Work.svg';
import ManAll from '../../img/ManAll.svg';

const Wrap = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`;

const InputFrom = styled.section`
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
`;
const Input = styled.input`
    margin-bottom: 20px;
    padding: 5px;
    border: none;
    width: 80%;
    outline: none;
    border-radius: 3px;
    font-size: 15px;
`;

const HelpManImg = styled.img`
    width: 140px;
    position: absolute;
    top: 55px;
    left: 70px;
    opacity: .6;
`;
const WorkImg = styled.img`
    width: 140px;
    position: absolute;
    bottom: 80px;
    left: 40px;
    opacity: .6;
`;
const ManAllImg = styled.img`
    width: 140px;
    position: absolute;
    bottom: 300px;
    right: -40px;
    opacity: .6;
`;

const Mssage = styled.h2`
    width: 100%;
    position: absolute;
    top: 22%;
    left: 0;
    font-size: 19px;
    color: #4599d7;
    font-weight: bold;
    text-align: center;
`;
const Span = styled.span`
    color: #c3af4e;
`;

const MarginS = styled.div`
    margin: 15px;
`;

class LoginPage extends Component {
    constructor() {
        super();
    }

    async createUser() {
        //アカウント新規登録
        let userName = document.querySelector('#inputUserName').value;
        let email = document.querySelector('#inputEmail').value;
        let password = document.querySelector('#inputPass').value;

        if(!email || !password || !userName) {
            alert('メールアドレスまたはパスワードまたはユーザーネームが入力されていません。');
            return;
        }

        let flag = true;
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        await firebase.auth()
        .createUserWithEmailAndPassword(email, password) //新規登録
        .then(data => {
            data.user.sendEmailVerification() //新規登録したメアド宛にメールが送られる
            console.log('新規登録完了');
        })
        .catch((error) => {
            //エラー
            switch (error.code) {
            case 'auth/invalid-email':
                alert('メールアドレスの形式が違います。')
                flag = false;
                break
            case 'auth/email-already-in-use':
                alert('このメールアドレスはすでに使われています。')
                flag = false;
                break
            case 'auth/weak-password':
                alert('パスワードは6文字以上で入力してください。')
                flag = false;
                break
            default:
                alert('エラーが起きました。しばらくしてから再度お試しください。')
                flag = false;
                break
            }
        });
        //-------------------------------------------------//  firebase  //-------------------------------------------------//

        if(!flag) {
            return;
        } else {
            alert('アカウントが発行されました');
        }

        let uid = "";
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        await firebase.auth().onAuthStateChanged(user => {
            uid = user.uid;
        });

        let usersRef = firebase.firestore().collection('users');
        await usersRef.doc(uid).set({
            name: userName,
            point: 1000,
            uid: uid,
            mail: email
        })
        .then(() => console.log('firebase ok'))
        .catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//

        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            this.props.history.push("/mainApp/" + uid);
        })
        .catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
    }

    async login() {
        //ログイン

        let email = document.querySelector('#inputEmail').value;
        let password = document.querySelector('#inputPass').value;

        if(!email || !password) {
            alert('メールアドレスまたはパスワードが入力されていません。');
            return;
        }

        let uid = "";
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        await firebase.auth().onAuthStateChanged(user => {
            uid = user.uid;
        });
        
        await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            this.props.history.push("/mainApp/" + uid);
        })
        .catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
    }

    render() {
        return(
            <Wrap>
                <HelpManImg src={HelpMan} />
                <WorkImg src={Work} />
                <ManAllImg src={ManAll} />

                <Mssage>忙しい<Span>時</Span>から、暇な<Span>時</Span>から解法します</Mssage>
                <InputFrom>
                    <Input type="text" placeholder="ユーザーネーム" id='inputUserName'/>
                    <Input type="email" placeholder="メールアドレス" id='inputEmail'/>
                    <Input type="password" placeholder="パスワード" id='inputPass'/>

                    <MarginS />

                    <Btn text="ログイン" clickedFn={this.login.bind(this)}></Btn>
                    <MarginS />
                    <Btn text="アカウント新規作成" clickedFn={this.createUser.bind(this)}></Btn>
                </InputFrom>
            </Wrap>
        );
    }
}
export default withRouter(LoginPage);