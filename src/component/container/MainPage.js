import { Component } from 'react';
import { withRouter } from "react-router-dom";
import firebase from 'firebase/compat/app'
import styled from 'styled-components';

import Header from '../presentational/atoms/Header';
import ManImg from '../../img/Man.svg';
import Btn from '../presentational/atoms/Btn';
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
            tasksList: []
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
            tmpContent.push(<TaskBox title={element.title} point={element.point} time={element.time_required} content={element.contents} />)
        });
        this.setState({
            tasksList: tmpContent
        });
    }

    render() {
        return(
            <>
                <Header />
                
                <UserCade>
                    <ImgMan src={ManImg} />
                    <UerName>{this.state.userName}</UerName>
                    <Point>ポイント&emsp;{this.state.userPoint}</Point>

                    <Btn text="タスクを発注する" />
                    <MarginS />
                    <Btn text="受注中のタスクを確認" />
                </UserCade>

                <TaskList>
                    <TaskListTitle>助っ人募集中タスク</TaskListTitle>
                    {this.state.tasksList}
                </TaskList>
            </>
        );
    }
}
export default withRouter(MainPage);