import styled, { keyframes } from 'styled-components';

const LoaderBox = styled.div`
    margin: 0;
    padding: 50px 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #FFF;
    display: flex;
    border-radius: 5px;
`;
const RodAnimation = keyframes`
    0% {
        transform: scaleY(1);
    }
    50% {
        transform: scaleY(0.6);
    }
    100% {
        transform: scaleY(1);
    }
`;
const Span = styled.span`
    margin: 0 4px;
    display: block;
    background-color: #8DCFFF;
    width: 8px;
    height: 50px;
    animation: ${RodAnimation} 1.3s;
    animation-iteration-count: infinite;
    &:nth-child(1) {
        animation-delay: 0.1s;
    }
    &:nth-child(2) {
        animation-delay: 0.2s;
    }
    &:nth-child(3) {
        animation-delay: 0.3s;
    }
    &:nth-child(4) {
        animation-delay: 0.4s;
    }
    &:nth-child(5) {
        animation-delay: 0.5s;
    }
    &:nth-child(6) {
        animation-delay: 0.6s;
    }
    &:nth-child(7) {
        animation-delay: 0.7s;
    }
    &:nth-child(8) {
        animation-delay: 0.8s;
    }
`;
const BackColor = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #efefef;
    opacity: .7
`;

const Loader = () => {
    return(
        <>
            <BackColor>
            </BackColor>
            <LoaderBox>
                <Span></Span>
                <Span></Span>
                <Span></Span>
                <Span></Span>
                <Span></Span>
                <Span></Span>
                <Span></Span>
                <Span></Span>
            </LoaderBox>
        </>
    );
}
export default Loader;