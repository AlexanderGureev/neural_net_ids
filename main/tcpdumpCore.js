const { spawn } = require("child_process");
const pcapp = require("pcap-parser");
const path = require("path");
const BinParser = require("binary-parser").Parser;

const rootDir = path.join(__dirname, "tcpdump.pcap");
const ipTcpParser = new BinParser()
  .endianess("big")
  .skip(14)
  .bit4("version")
  .bit4("headerLength")
  .uint8("tos")
  .uint16("packetLength")
  .uint16("id")
  .bit3("offset")
  .bit13("fragOffset")
  .uint8("ttl")
  .uint8("protocol")
  .uint16("checksum")
  .array("src", {
    type: "uint8",
    length: 4
  })
  .array("dst", {
    type: "uint8",
    length: 4
  })
  .uint16("srcPort")
  .uint16("dstPort")
  .uint32("seq")
  .uint32("ack")
  .bit4("dataOffset")
  .bit6("reserved")
  .nest("flags", {
    type: new BinParser()
      .bit1("urg")
      .bit1("ack")
      .bit1("psh")
      .bit1("rst")
      .bit1("syn")
      .bit1("fin")
  })
  .uint16("windowSize")
  .uint16("checksum")
  .uint16("urgentPointer");

const tcpdump = spawn("tcpdump", [
  "tcp",
  "-c",
  "20",
  "-i",
  "enp0s31f6",
  "-n",
  "-vvv",
  "-XX",
  "-w",
  `${rootDir}`
]);

tcpdump.on("exit", () => {
  const parser = pcapp.parse(rootDir);
  parser.on("packetData", function(packet) {
    console.log(ipTcpParser.parse(packet));
  });
});
