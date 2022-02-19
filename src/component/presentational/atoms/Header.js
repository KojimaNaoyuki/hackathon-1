import styled from 'styled-components';

const HeaderBox = styled.div`
    padding: 5px 10px;
    font-family: 'Patrick Hand', cursive;
    font-weight: 800;
`;
const Title = styled.h1`
    font-size: 28px;
`;
const Span = styled.span`
    color: #4599d7;
`;

const Header = () => {
    return(
        <HeaderBox>
            <Title>Get&thinsp;<Span>Helper</Span></Title>
        </HeaderBox>
    );
}
export default Header;