import { Component } from 'react';
import { withRouter } from "react-router-dom";
import styled from 'styled-components';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';

import Btn from '../presentational/atoms/Btn';

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

        if(!email || !password) {
            alert('メールアドレスまたはパスワードが入力されていません。');
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
            <>
                <InputFrom>
                    <Input type="text" placeholder="ユーザーネーム" id='inputUserName'/>
                    <Input type="text" placeholder="メールアドレス" id='inputEmail'/>
                    <Input type="text" placeholder="パスワード" id='inputPass'/>

                    <MarginS />

                    <Btn text="ログイン" clickedFn={this.login.bind(this)}></Btn>
                    <MarginS />
                    <Btn text="アカウント新規作成" clickedFn={this.createUser.bind(this)}></Btn>
                </InputFrom>
            </>
        );
    }
}
export default withRouter(LoginPage);