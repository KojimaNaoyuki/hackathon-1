import styled from 'styled-components';

const Btn = (props) => {
    const BtnBox = styled.button`
        width: 80%;
        width: ${props.width};
        padding: 4px 0;
        border: none;
        background-color: #8DCFFF;
        border-radius: 3px;
        font-size: 16px;
        font-weight: normal;
        transition: all 0.3s;
        &:hover {
            opacity: 0.6;
            cursor: pointer;
        }
    `;

    return(
        <BtnBox onClick={props.clickedFn} id={props.id}>
            {props.text}
        </BtnBox>
    );
}
export default Btn;