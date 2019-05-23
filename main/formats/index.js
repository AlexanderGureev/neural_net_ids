const path = require("path");

const rootPath = path.join(__dirname, "..", "datasets");

const labels = [
  "benign",
  "bot",
  "ddos",
  "infilteration",
  "ddos attack-hoic",
  "portscan",
  "ftp-patator",
  "ssh-patator",
  "ftp-bruteforce",
  "ssh-bruteforce",
  "dos slowloris",
  "dos slowhttptest",
  "dos hulk",
  "dos goldeneye",
  "ddos attacks-loic-http"
];

const features = [
  "flow duration",
  "tot fwd pkts",
  "tot bwd pkts",
  "totlen fwd pkts",
  "totlen bwd pkts",
  "fwd pkt len max",
  "fwd pkt len min",
  "fwd pkt len mean",
  "fwd pkt len std",
  "bwd pkt len max",
  "bwd pkt len min",
  "bwd pkt len mean",
  "bwd pkt len std",
  "flow byts/s",
  "flow pkts/s",
  "flow iat mean",
  "flow iat std",
  "flow iat max",
  "flow iat min",
  "fwd iat tot",
  "fwd iat mean",
  "fwd iat std",
  "fwd iat max",
  "fwd iat min",
  "bwd iat tot",
  "bwd iat mean",
  "bwd iat std",
  "bwd iat max",
  "bwd iat min",
  "fwd psh flags",
  "bwd psh flags",
  "fwd urg flags",
  "bwd urg flags",
  "bwd header len",
  "fwd pkts/s",
  "bwd pkts/s",
  "pkt len min",
  "pkt len max",
  "pkt len mean",
  "pkt len std",
  "pkt len var",
  "fin flag cnt",
  "syn flag cnt",
  "rst flag cnt",
  "psh flag cnt",
  "ack flag cnt",
  "urg flag cnt",
  "cwe flag count",
  "ece flag cnt",
  "down/up ratio",
  "pkt size avg",
  "fwd seg size avg",
  "bwd seg size avg",
  "fwd byts/b avg",
  "fwd pkts/b avg",
  "fwd blk rate avg",
  "bwd byts/b avg",
  "bwd pkts/b avg",
  "bwd blk rate avg",
  "subflow fwd pkts",
  "subflow fwd byts",
  "subflow bwd pkts",
  "subflow bwd byts",
  "init fwd win byts",
  "init bwd win byts",
  "fwd act data pkts",
  "fwd seg size min",
  "active mean",
  "active std",
  "active max",
  "active min",
  "idle mean",
  "idle std",
  "idle max",
  "idle min"
];

const minFeatures = [
  "fwd pkt len max",
  "fwd pkt len min",
  "totlen fwd pkts",
  "subflow fwd byts",
  "flow duration",
  "active mean",
  "bwd pkt len std",
  "flow iat std",
  "pkt size avg",
  "active min",
  "fwd pkt len mean",
  "bwd pkts/s",
  "fwd pkts/s",
  "syn flag cnt",
  "fwd psh flags",
  "init fwd win byts",
  "ack flag cnt",
  "psh flag cnt"
];

const fileAttackTypes = {
  [`${rootPath}/1_1.csv`]: ["benign", "bot"],
  [`${rootPath}/1_10.csv`]: ["benign", "ddos attacks-loic-http"],
  [`${rootPath}/1_2.csv`]: [
    "benign",
    "web attack � brute force",
    "web attack � xss",
    "web attack � sql injection"
  ],
  [`${rootPath}/1_3.csv`]: ["benign", "ddos"],
  [`${rootPath}/1_4.csv`]: ["benign", "portscan"],
  [`${rootPath}/1_5.csv`]: ["benign", "infilteration"],
  [`${rootPath}/1_6.csv`]: ["benign", "ftp-patator", "ssh-patator"],
  [`${rootPath}/1_7.csv`]: ["benign"],
  [`${rootPath}/1_8.csv`]: [
    "benign",
    "dos slowloris",
    "dos slowhttptest",
    "dos hulk",
    "dos goldeneye",
    "heartbleed"
  ],
  [`${rootPath}/1_9.csv`]: ["benign", "infilteration"],
  [`${rootPath}/2.csv`]: ["benign", "infilteration"],
  [`${rootPath}/3.csv`]: ["benign", "ddos attack-loic-udp", "ddos attack-hoic"],
  [`${rootPath}/4.csv`]: ["benign", "dos slowhttptest", "dos hulk"],
  [`${rootPath}/5.csv`]: ["benign", "bot"],
  [`${rootPath}/6.csv`]: ["benign", "ftp-bruteforce", "ssh-bruteforce"],
  [`${rootPath}/7.csv`]: ["benign", "dos goldeneye", "dos slowloris"],
  [`${rootPath}/8.csv`]: [
    "benign",
    "brute force -web",
    "brute force -xss",
    "sql injection"
  ],
  [`${rootPath}/9.csv`]: [
    "benign",
    "brute force -web",
    "brute force -xss",
    "sql injection"
  ]
  // [`${path.join(__dirname, "..", "test")}/1.csv`]: [
  //   "benign",
  //   "web attack � xss"
  // ],
  // [`${path.join(__dirname, "..", "test")}/2.csv`]: [
  //   "benign",
  //   "web attack � xss"
  // ]
};

module.exports = {
  features,
  labels,
  fileAttackTypes,
  minFeatures
};
