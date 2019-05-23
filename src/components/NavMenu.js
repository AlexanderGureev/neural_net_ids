import React from "react";
import { useActions, useStore } from "easy-peasy";
import { withRouter } from "react-router";
import { Item, Nav } from "./styles";
import { navItems } from "./NavItems";

const NavMenu = ({ history }) => {
  const changePageAction = useActions(action => action.changePage);
  const page = useStore(state => state.currentPage);

  const changePage = path => {
    history.replace(path);
    changePageAction(path);
  };

  return (
    <Nav>
      {navItems.map(({ icon, text, path }) => (
        <Nav.Item
          key={text}
          onClick={() => changePage(path)}
          active={page === path}
        >
          <Item.Icon src={icon} />
          <Item.Text>{text}</Item.Text>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default withRouter(NavMenu);
