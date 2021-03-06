import { Component } from 'react';
import { withRouter } from "react-router-dom";
import styled from 'styled-components';
import firebase from 'firebase/compat/app'

import Header from '../presentational/atoms/Header';
import ManImg from './../../img/Man.svg';
import Btn from '../presentational/atoms/Btn';
import ArrowImgData from './../../img/Arrow.svg';
import TaskBox from '../presentational/atoms/TaskBox';
import Loader from '../presentational/atoms/Loader';

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
    @media screen and (min-width:860px) {
        width: 120px;
    }
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
    &:hover {
        opacity: 0.6;
        cursor: pointer;
    }
`;
const ArrowImg = styled.img`
    margin-right: 15px;
    width: 18px;
`;
const CadeContent = styled.div`
    padding: 0 0 10px;
    text-align: center;
    max-width: 860px;
    margin: 0 auto;
`;
const UserCadeInner = styled.div`
    max-width: 460px;
    margin: 0 auto;
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

const TaskListWrap = styled.div`
    @media screen and (min-width:860px) {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
    }
`;

const Attention = styled.div`
    font-size: 12px;
    color: red;
    margin: 0 auto;
    margin-top: -10px;
    margin-bottom: 20px;
    width: 80%;
    text-align: left;
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
const BackInner = styled.div`
    max-width: 560px;
    margin: 0 auto;
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
            loaderComponent: null
        }
    }

    async componentDidMount() {
        //??????????????????
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        await firebase.auth().onAuthStateChanged(user => {
            if(!user) {
                //??????????????????????????????
                console.log("?????????????????????????????????");
                this.props.history.push("/");
            } else {
                console.log('???????????????????????????????????????');
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
            tmp.push(<TaskBox id={`OrderConfirmation-${element.id}`} title={element.title} point={element.point} time={element.time_required} content={element.contents} BtnStatus={2} clickedFn={this.tasksCompletion.bind(this)} />);
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

        //??????????????????
        if(this.state.userPoint-point < 0) {
            alert('??????????????????????????????');
            return;
        }

        this._loaderOperation(true);

        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        let usersRef = firebase.firestore().collection('users');
        await usersRef.doc(this.props.match.params.uid).update({
            point: this.state.userPoint - point
        })
        .then(() => console.log('firebaes ok'))
        .catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//

        //????????????
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
            point: Number(point),
            owner_uid: this.props.match.params.uid,
            time_required: time,
            contents: detail,
            contractor: "",
            mail: user.email
        })
        .then(() => console.log('firebase ok'))
        .catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//

        this._loaderOperation(false);

        alert('???????????????????????????');

        window.location.reload();
    }

    async taskDetail(element) {
        document.querySelector('body').classList.add('on');

        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        let tasksRef = firebase.firestore().collection('tasks');
        await tasksRef.where('id', '==', Number(element.target.id.split('-')[2]))
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
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

    async tasksCompletion(element) {
        let contractorUid;
        let contractorPoint;
        let getPoint;

        this._loaderOperation(true);

        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        let usersRef = await firebase.firestore().collection('users');
        let tasksRef = await firebase.firestore().collection('tasks');
        
        await tasksRef.where('id', '==', Number(element.target.id.split('-')[2]))
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                contractorUid = doc.data().contractor;
                getPoint = doc.data().point;
            });
        })
        .then(() => console.log('firebase ok'))
        .catch(error => console.log(error));

        if(contractorUid == "") {
            this._loaderOperation(false);

            alert('????????????????????????????????????????????????');
            return;
        }

        await usersRef.doc(contractorUid).get()
        .then(doc => {
            console.log(doc.data());
            contractorPoint = doc.data().point;
        })
        .catch(error => console.log(error));
        
        await usersRef.doc(contractorUid).update({
            point: Number(contractorPoint)+Number(getPoint)
        })
        .then(() => console.log('firebase ok'))
        .catch(error => console.log(error));

        await tasksRef.doc(element.target.id.split('-')[2])
        .delete()
        .then(() => console.log('firebase del'))
        .catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//

        this._loaderOperation(false);

        alert('??????????????????');

        window.location.reload();
    }

    openCard(element) {
        let tgElement = document.querySelector('#' + element.target.id + '-wrap');

        tgElement.classList.toggle('open');
    }

    gotoMainApp() {
        this.props.history.push("/MainApp/" + this.props.match.params.uid);
    }

    _loaderOperation(status) {
        //???????????????????????????
        if(status) {
            this.setState({
                loaderComponent: <Loader />
            });
        } else {
            this.setState({
                loaderComponent: null
            });
        }
    }

    render() {
        return(
            <>
                <Header />

                <UserCade>
                    <UserCadeInner>
                        <ImgMan src={ManImg} />
                        <UerName>{this.state.userName}</UerName>
                        <Point>????????????&emsp;{this.state.userPoint}</Point>

                        <Btn text="??????" clickedFn={this.gotoMainApp.bind(this)} />
                    </UserCadeInner>
                </UserCade>

                <MarginM />

                <Cade id='taskOrder-wrap' className='back-color-white'>
                    <CadeTitle id='taskOrder' onClick={this.openCard.bind(this)} ><ArrowImg src={ArrowImgData} className='cad-img' />????????????????????????</CadeTitle>
                    <CadeContent className='cade' >
                        <Input type="text" placeholder='????????????' id='inputTitle' />
                        <Input type="number" placeholder='??????????????????' id='inputPoint' />
                        <Input type="number" placeholder='????????????(??????: ??????)' id='inputTime' />
                        <TextBox type="text" placeholder='??????????????????' id='inputDetail' />
                        <Attention>????????????????????????????????????????????????????????????????????????</Attention>

                        <Btn text="????????????" clickedFn={this.ordertask.bind(this)} />
                    </CadeContent>
                </Cade>

                <Cade id='taskOrderConfirmation-wrap'>
                    <CadeTitle id='taskOrderConfirmation' onClick={this.openCard.bind(this)} ><ArrowImg src={ArrowImgData} className='cad-img' />??????????????????????????????</CadeTitle>
                    <CadeContent className='cade'>
                        <TaskListWrap>
                            {this.state.ordersConfirmationList}
                        </TaskListWrap>
                    </CadeContent>
                </Cade>

                <Cade id='ordersReceived-wrap'>
                    <CadeTitle id='ordersReceived' onClick={this.openCard.bind(this)} ><ArrowImg src={ArrowImgData} className='cad-img' />??????????????????????????????</CadeTitle>
                    <CadeContent className='cade'>
                        <TaskListWrap>
                            {this.state.ordersReceivedList}
                        </TaskListWrap>
                    </CadeContent>
                </Cade>

                <Back className='back' />
                <BackContent className='back-content'>
                    <BackInner>
                        <BackTitle>????????????</BackTitle>
                        <BackSubTitle>???????????????????????????????????????</BackSubTitle>
                        <BackEmail>{this.state.backEmail}</BackEmail>
                        <BackMs>??????????????????????????????????????????????????????????????????</BackMs>

                        <Btn text="??????" clickedFn={this.taskDetailClose.bind(this)} />
                    </BackInner>
                </BackContent>

                {this.state.loaderComponent}
            </>
        );
    }
}
export default withRouter(MyPage);