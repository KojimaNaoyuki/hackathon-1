import styled from 'styled-components';

const HeaderBox = styled.div`
    padding: 5px 10px;
`;
const Title = styled.h1`
    font-size: 20px;
`;

const Header = () => {
    return(
        <HeaderBox>
            <Title>hogehoge</Title>
        </HeaderBox>
    );
}
export default Header;