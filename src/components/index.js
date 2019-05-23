import React from "react";
import { Switch, Route } from "react-router";
import logo from "./img/logo.svg";

import {
  HomeWrapper,
  SidebarContainer,
  Logo,
  ContentContainer,
  ContentBlock
} from "./styles";
import NavMenu from "./NavMenu";
import StatusGuard from "./StatusGuard";
import ConfigureModule from "./ConfigurateModule";
import TopLine from "./TopLine";
import Logs from "./Logs";
import Mnist from "./MNIST";
import Sniffer from "./Sniffer";

const EmptyComponent = () => <ContentBlock> Empty page</ContentBlock>;
const Home = () => (
  <HomeWrapper>
    <SidebarContainer>
      <Logo src={logo} />
      <NavMenu />
      <StatusGuard />
    </SidebarContainer>
    <ContentContainer>
      <TopLine />
      <Switch>
        <Route path="/" exact component={EmptyComponent} />
        <Route path="/configure" component={ConfigureModule} />
        <Route path="/settings" component={EmptyComponent} />
        <Route path="/logs" component={Logs} />
        <Route path="/monitoring" component={Sniffer} />
        <Route path="/mnist" component={Mnist} />
      </Switch>
    </ContentContainer>
  </HomeWrapper>
);

export default Home;
