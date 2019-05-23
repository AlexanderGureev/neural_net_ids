import React, { useEffect } from "react";
import { ContentBlock } from "../styles";
import { Table } from "antd";
import { remote } from "electron";

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street"
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "10 Downing Street"
  }
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address"
  }
];

const captureCallback = packet => {
  console.log(packet);
};
export default function Sniffer() {
  useEffect(() => {}, []);

  return (
    <ContentBlock>
      <Table dataSource={dataSource} columns={columns} />
    </ContentBlock>
  );
}
