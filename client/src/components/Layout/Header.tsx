import styled from "@emotion/styled";
import {Link as RouterLink} from "react-router-dom";
import {type ReactNode} from "react";
import logo from "../../static/logo.png";
import {type Theme, useTheme} from "@emotion/react";

const HeaderStyle = styled.header`
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 20px;
  padding: 0 20px;
  background-color: ${props => props.theme.colors.primary};
  color: ${(props: {admin?: boolean}) => props.admin ? "#000" : "#fff"};
`;

const Logo = styled.img`
  height: 40px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
`;

const Nav = styled.nav`
  display: flex;
  height: 100%;
  gap: 20px;
  align-items: center;
  > Link {
    color: ${(props: {admin?: boolean}) => props.admin ? "#000" : "#fff"};
  }
`;

const Link = styled(RouterLink)`
  font-size: 1.2rem;
  text-decoration: none;
`;

type HeaderComponentProps = {
    children: ReactNode,
    theme: Theme,
}
const HeaderComponent = ({ children, theme }: HeaderComponentProps) => (
    <HeaderStyle theme={theme}>
        {children}
    </HeaderStyle>
);

type HeaderProps = {
    admin?: boolean,
}

export default function Header({admin}: HeaderProps) {
    const theme = useTheme();
    const title = process.env.PROJECT_NAME || "Gigashop1" + admin ? " Admin" : "";

    return (
        <HeaderComponent theme={theme}>
            <Logo src={logo} alt="Logo" />
            <Title>{title}</Title>
            <Nav>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </Nav>
        </HeaderComponent>
    );
}