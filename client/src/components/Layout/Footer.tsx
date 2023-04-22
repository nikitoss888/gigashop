import styled from "@emotion/styled";
import {useTheme} from "@emotion/react";

const FooterStyle = styled.footer`
    grid-area: footer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    background-color: ${props => props.theme.colors.primary};
`;

export default function Footer() {
    const theme = useTheme();

    return (
        <FooterStyle theme={theme}>
            <p>Footer</p>
        </FooterStyle>
    );
}