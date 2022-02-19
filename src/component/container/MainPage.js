import { Component } from 'react';
import { withRouter } from "react-router-dom";
import firebase from 'firebase/compat/app'
import styled from 'styled-components';

import Header from '../presentational/atoms/Header';
import ManImg from '../../img/Man.svg';
import Btn from '../presentational/atoms/Btn';
import TaskBox from '../presentational/atoms/TaskBox';
import Loader from '../presentational/atoms/Loader';

const UserCade = styled.section`
    padding: 20px 0;
    position: relative;
    background-color: #FFF;
    text-align: center;
    max-width: 860px;
    margin: 0 auto;
`;
const UserCadeInner = styled.div`
    max-width: 460px;
    margin: 0 auto;
`;
const ImgMan = styled.img`
    position: absolute;
    top: 10px;
    left: 15px;
    opacity: .8;
    width: 82px;
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

const TaskList = styled.section`
    margin-top: 40px;
`;
const TaskListTitle = styled.h3`
    width: 50%;
    margin: 0;
    padding: 5px 15px;
    font-size: 16px;
    font-weight: normal;
    background-color: #8DCFFF;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    @media screen and (min-width:860px) {
        padding: 10px 0;
        width: 100%;
        text-align: center;
    }
`;

const TaskListWrap = styled.div`
    @media screen and (min-width:860px) {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        max-width: 860px;
        margin: 20px auto;
    }
`;

const MarginS = styled.div`
    margin: 15px;
`;

class MainPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            userPoint: "",
            uid: "",
            tasksList: [],
            loaderComponent: null
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
        this._displayTaskList();
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

    async _displayTaskList() {
        let tmp = [];
        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        let tasksRef = firebase.firestore().collection("tasks");
        await tasksRef.where('contractor', '==', "")
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                tmp.push(doc.data());
            });
        }).catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//

        let tmpContent = [];
        tmp.forEach(element => {
            tmpContent.push(<TaskBox id={element.id} title={element.title} point={element.point} time={element.time_required} content={element.contents} BtnStatus={true} clickedFn={this.tasksApply.bind(this)} />)
        });
        this.setState({
            tasksList: tmpContent
        });
    }

    async tasksApply(element) {
        if(!window.confirm("応募を完了してよろしいですか？")) {
            return;
        }

        const tg = element.target.id.split('-')[1];

        this._loaderOperation(true);

        //-------------------------------------------------//  firebase  //-------------------------------------------------//
        let tasksRef = firebase.firestore().collection("tasks");
        await tasksRef.doc(tg).update({
            contractor: this.props.match.params.uid
        })
        .then(() => console.log('firebase ok'))
        .catch(error => console.log(error));
        //-------------------------------------------------//  firebase  //-------------------------------------------------//

        this._loaderOperation(false);

        alert('応募が完了しました\n受注中のタスクを確認から、タスクを開始してください');

        this.props.history.push("/myPage/" + this.props.match.params.uid);
    }

    gotoMyPage() {
        this.props.history.push("/myPage/" + this.props.match.params.uid);
    }

    async logout() {
        let confirmResult = window.confirm('ログアウトしますか？\n再度ログインが必要になります');
        if(!confirmResult) {
            return;
        }
        await firebase.auth().signOut().then(() => {
            console.log('ログアウトしました');
            this.props.history.push("/");
        });
    }

    _loaderOperation(status) {
        //ローダーの表示設定
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
                        <Point>ポイント&emsp;{this.state.userPoint}</Point>

                        <Btn text="タスクを発注する" clickedFn={this.gotoMyPage.bind(this)} />
                        <MarginS />
                        <Btn text="受注中のタスクを確認" clickedFn={this.gotoMyPage.bind(this)} />
                        <MarginS />
                        <Btn text="ログアウト" clickedFn={this.logout.bind(this)} />
                    </UserCadeInner>
                </UserCade>

                <TaskList>
                    <TaskListTitle>助っ人募集中タスク</TaskListTitle>
                    <TaskListWrap>
                        {this.state.tasksList}
                    </TaskListWrap>
                </TaskList>

                {this.state.loaderComponent}
            </>
        );
    }
}
export default withRouter(MainPage);