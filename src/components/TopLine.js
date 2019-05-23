import React from "react";
import { useStore } from "easy-peasy";
import {
  PageTitle,
  TopLine as TopLineWrapper,
  TitleText,
  CaptionText,
  NotificationBlock
} from "./styles";
import notifIcon from "./img/notif.svg";
import { navItems } from "./NavItems";

const TopLine = () => {
  const page = useStore(state => state.currentPage);

  const { text, description } = navItems.find(({ path }) => path === page);
  return (
    <TopLineWrapper>
      <PageTitle>
        <TitleText>{text}</TitleText>
        <CaptionText>{description}</CaptionText>
      </PageTitle>
      <NotificationBlock src={notifIcon} />
    </TopLineWrapper>
  );
};

export default TopLine;
