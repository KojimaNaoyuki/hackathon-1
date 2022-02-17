import styled from "styled-components";
import Btn from "./Btn";
import HelpManImg from "./../../../img/HelpMan.svg";

const TaskBoxWrap = styled.div`
    position: relative;
    margin: 3px 0;
    padding: 15px 15px;
    background-color: #FFF;
    text-align: center;
`;
const ImgMan = styled.img`
    position: absolute;
    bottom: 30px;
    left: 15px;
    opacity: .3;
    width: 120px;
`;
const Title = styled.h3`
    margin: 0;
    padding: 15px 0;
    font-size: 15px;
    font-weight: bold;
    color: #4599d7;
`;
const Point = styled.h3`
    margin: 0;
    padding: 15px 0 5px;
    font-size: 15px;
`;
const Time = styled.h3`
    margin: 0;
    padding: 10px 0 20px;
    font-size: 15px;
`;
const Content = styled.p`
    width: 100%;
    font-size: 15px;
    overflow-wrap: break-word;
    text-align: left;
`;

const TaskBox = (props) => {
    return(
        <TaskBoxWrap>
            <ImgMan src={HelpManImg} />
            <Title>{props.title}</Title>
            <Point>ポイント&emsp;{props.point}</Point>
            <Time>推定時間&emsp;{props.time}時間</Time>
            <Content>{props.content}</Content>
            <Btn text="応募する" />
        </TaskBoxWrap>
    );
}
export default TaskBox;