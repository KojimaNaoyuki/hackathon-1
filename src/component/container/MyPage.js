import { Component } from 'react';
import { withRouter } from "react-router-dom";
import styled from 'styled-components';
import firebase from 'firebase/compat/app'

import Header from '../presentational/atoms/Header';
import ManImg from './../../img/Man.svg';
import Btn from '../presentational/atoms/Btn';
import ArrowImgData from './../../img/Arrow.svg';
import TaskBox from '../presentational/atoms/TaskBox';

const UserCade = styled.section`
    padding: 20px 0;
    position: relative;
    background-color: #FFF;
    text-align: center;
`;
const ImgMan = styled.img`
    position: absolute;
    top: 10px;
    left: 15px;
    opacity: .8;
    width: 72px;
`;
const UerName = styled.h2`
    padding: 15px 0;
    font-size: 18px;
`;
const Point = styled.h3`
    padding: 8px 0 15px;
    font-size: 16px;
`;

const Cade = styled.div`
    margin: 10px 0;
`;
const CadeTitle = styled.h3`
    display: flex;
    align-items: center;
    margin: 0;
    padding: 20px 15px;
    font-size: 16px;
    font-weight: bold;
    color: #4599d7;
    background-color: #FFF;
`;
const ArrowImg = styled.img`
    margin-right: 15px;
    width: 18px;
`;
const CadeContent = styled.div`
    padding: 0 0 10px;
    text-align: center;
`;

const Input = styled.input`
    display: block;
    margin: 0 auto;
    margin-bottom: 15px;
    padding: 5px;
    border: solid 1px #CCC;
    width: 80%;
    outline: none;
    border-radius: 3px;
    font-size: 15px;
`;
const TextBox = styled.textarea`
    display: block;
    margin: 0 auto;
    margin-bottom: 15px;
    padding: 5px;
    border: solid 1px #CCC;
    width: 80%;
    height: 120px;
    outline: none;
    border-radius: 3px;
    resize: none;
    font-size: 15px;
`;

const Back = styled.div`
`;
const BackContent = styled.div`
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    background-color: #FFF;
    text-align: center;
    padding: 10px 0;
`;
const BackTitle = styled.h3`
    margin: 0;
    padding: 15px 0;
    font-size: 15px;
    font-weight: bold;
    color: #4599d7;
`;
const BackSubTitle = styled.h3`
    margin: 0;
    padding: 0 20px;
    font-size: 15px;
    text-align: left;
`;
const BackEmail = styled.h3`
    margin: 0;
    padding: 15px 0;
    font-size: 15px;
    font-weight: normal;
`;
const BackMs = styled.h3`
    margin: 0;
    padding: 15px 0;
    font-size: 15px;
    font-weight: normal;
    width: 100%;
    overflow-wrap: break-word;
`;

const MarginS = styled.div`
    margin: 15px;
`;
const MarginM = styled.div`
    margin: 30px;
`;

class MyPage extends Component {
    constructor() {
        super();

        this.state = {
            userName: '',
            userPoint: 0,
            backEmail: '',
            ordersReceivedList: [],
            ordersConfirmationList: [],
        }
    }

    async componentDidMount() {
        //ログイン判定
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        await firebase.auth().onAuthStateChanged(user => {
            if(!user) {
                //ログインされていない
                console.log("ログインされていません");
                this.props.history.push("/");
            } else {
                console.log('正常にログインされています');
            }
        });
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        
        this._displayUserData();
        this._displyaOrdersReceived();
        this._displayOrderConfirmation();
    }

    async _displayUserData() {
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        let usersRef = firebase.firestore().collection("users");
        await usersRef.where('uid', "==", this.props.match.params.uid)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.setState({
                    userName: doc.data().name,
                    userPoint: doc.data().point
                });
            });
        }).catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
    }

    async _displyaOrdersReceived() {
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        let tmpData = [];
        let tasksRef = firebase.firestore().collection('tasks');
        await tasksRef.where('contractor', '==', this.props.match.params.uid)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                tmpData.push(doc.data());
            });
        })
        .catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//

        let tmp = []
        tmpData.forEach(element => {
            tmp.push(<TaskBox id={`OrdersReceived-${element.id}`} title={element.title} point={element.point} time={element.time_required} content={element.contents} BtnStatus={3} clickedFn={this.taskDetail.bind(this)} />);
        })
        this.setState({
            ordersReceivedList: tmp
        });    
    }

    async _displayOrderConfirmation() {
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        let tmpData = [];
        let tasksRef = firebase.firestore().collection('tasks');
        await tasksRef.where('owner_uid', '==', this.props.match.params.uid)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                tmpData.push(doc.data());
            });
        })
        .catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//

        let tmp = []
        tmpData.forEach(element => {
            tmp.push(<TaskBox title={element.title} point={element.point} time={element.time_required} content={element.contents} BtnStatus={2} />);
        })
        this.setState({
            ordersConfirmationList: tmp
        });    
    }

    async ordertask() {
        let title = document.querySelector('#inputTitle').value;
        let point = document.querySelector('#inputPoint').value;
        let time = document.querySelector('#inputTime').value;
        let detail = document.querySelector('#inputDetail').value;

        //ポイント処理
        if(this.state.userPoint-point < 0) {
            alert('ポイントが足りません');
            return;
        }

        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        let usersRef = firebase.firestore().collection('users');
        await usersRef.doc(this.props.match.params.uid).update({
            point: this.state.userPoint - point
        })
        .then(() => console.log('firebaes ok'))
        .catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//

        //発注処理
        let id = 1;
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        let tasksRef = firebase.firestore().collection('tasks');
        await tasksRef.orderBy("id", "desc").limit(1).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                id = doc.data().id + 1
            });
        });

        const user = await firebase.auth().currentUser;

        await tasksRef.doc(String(id)).set({
            id: id,
            title: title,
            point: point,
            owner_uid: this.props.match.params.uid,
            time_required: time,
            contents: detail,
            contractor: "",
            mail: user.email
        })
        .then(() => console.log('firebase ok'))
        .catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
    
        alert('募集を開始しました');
        
        document.querySelector('#inputTitle').value = "";
        document.querySelector('#inputPoint').value = "";
        document.querySelector('#inputTime').value = "";
        document.querySelector('#inputDetail').value = "";
    }

    async taskDetail(element) {
        document.querySelector('body').classList.add('on');

        console.log(element.target.id.split('-')[2]);
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        let tasksRef = firebase.firestore().collection('tasks');
        await tasksRef.where('id', '==', Number(element.target.id.split('-')[2]))
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.data().mail);
                this.setState({
                    backEmail: doc.data().mail
                });
            });
        });
        //-------------------------------------------------//  firebase  //-------------------------------------------------//

    }
    taskDetailClose() {
        document.querySelector('body').classList.remove('on');
    }

    openCard(element) {
        let tgElement = document.querySelector('#' + element.target.id + '-wrap');

        tgElement.classList.toggle('open');
    }

    gotoMainApp() {
        this.props.history.push("/MainApp/" + this.props.match.params.uid);
    }

    render() {
        return(
            <>
                <Header />

                <UserCade>
                    <ImgMan src={ManImg} />
                    <UerName>{this.state.userName}</UerName>
                    <Point>ポイント&emsp;{this.state.userPoint}</Point>

                    <Btn text="戻る" clickedFn={this.gotoMainApp.bind(this)} />
                </UserCade>

                <MarginM />

                <Cade id='taskOrder-wrap' className='back-color-white'>
                    <CadeTitle id='taskOrder' onClick={this.openCard.bind(this)} ><ArrowImg src={ArrowImgData} className='cad-img' />タスクを発注する</CadeTitle>
                    <CadeContent className='cade' >
                        <Input type="text" placeholder='タイトル' id='inputTitle' />
                        <Input type="text" placeholder='支払ポイント' id='inputPoint' />
                        <Input type="text" placeholder='推定時間' id='inputTime' />
                        <TextBox type="text" placeholder='タスクの詳細' id='inputDetail' />

                        <Btn text="募集する" clickedFn={this.ordertask.bind(this)} />
                    </CadeContent>
                </Cade>

                <Cade id='taskOrderConfirmation-wrap'>
                    <CadeTitle id='taskOrderConfirmation' onClick={this.openCard.bind(this)} ><ArrowImg src={ArrowImgData} className='cad-img' />発注中のタスクを確認</CadeTitle>
                    <CadeContent className='cade'>
                        {this.state.ordersConfirmationList}
                    </CadeContent>
                </Cade>

                <Cade id='ordersReceived-wrap'>
                    <CadeTitle id='ordersReceived' onClick={this.openCard.bind(this)} ><ArrowImg src={ArrowImgData} className='cad-img' />受注中のタスクを確認</CadeTitle>
                    <CadeContent className='cade'>
                        {this.state.ordersReceivedList}
                    </CadeContent>
                </Cade>

                <Back className='back' />
                <BackContent className='back-content'>
                    <BackTitle>手伝って</BackTitle>
                    <BackSubTitle>タスク発注者メールアドレス</BackSubTitle>
                    <BackEmail>{this.state.backEmail}</BackEmail>
                    <BackMs>発注者と連絡を取ってタスクを実施してください</BackMs>

                    <Btn text="戻る" clickedFn={this.taskDetailClose.bind(this)} />
                </BackContent>
            </>
        );
    }
}
export default withRouter(MyPage);