const pcap = require("pcap");

function parserPacket(rawPacket) {
  const {
    payload: {
      payload: {
        payload,
        saddr: { addr: saddr },
        daddr: { addr: daddr },
        flags,
        version,
        headerLength,
        length,
        ttl,
        protocol,
        headerChecksum
      }
    }
  } = rawPacket;

  const packet = {
    payload,
    saddr,
    daddr,
    flags,
    version,
    headerLength,
    length,
    ttl,
    protocol,
    headerChecksum
  };
  return packet;
}

const initializeSniffer = (callback = () => {}) => {
  const tcpTracker = new pcap.TCPTracker();
  const pcapSession = pcap.createSession("enp0s31f6", "ip proto \\tcp");

  tcpTracker.on("session", session => {
    console.log(
      `Start of session between ${session.src_name} and ${session.dst_name}`
    );
    session.on("end", session => {
      console.log(
        `End of TCP session between ${session.src_name} and ${session.dst_name}`
      );
    });
  });

  pcapSession.on("packet", rawPacket => {
    const packet = pcap.decode.packet(rawPacket);
    tcpTracker.track_packet(packet);

    const parsedPacket = parserPacket(packet);
    callback(parsedPacket);
  });

  return { tcpTracker, pcapSession };
};

const startTcpSession = callback => {
  const { tcpTracker, pcapSession } = initializeSniffer(callback);
};

module.exports = {
  startTcpSession
};
