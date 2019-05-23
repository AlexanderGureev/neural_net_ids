import homeIcon from "./img/home.svg";
import chipIcon from "./img/chip.svg";
import settingsIcon from "./img/settings.svg";
import logIcon from "./img/log.svg";
import systemIcon from "./img/system.svg";

export const navItems = [
  {
    icon: homeIcon,
    text: "Dashboard",
    description: "Setting up a neural network module",
    path: "/"
  },
  {
    icon: chipIcon,
    text: "Configurate module",
    description: "Setting up a neural network module (ANN)",
    path: "/configure"
  },
  {
    icon: settingsIcon,
    text: "Settings",
    description: "Setting up a neural network module",
    path: "/settings"
  },
  {
    icon: logIcon,
    text: "Logs",
    description: "Setting up a neural network module",
    path: "/logs"
  },
  {
    icon: systemIcon,
    text: "Monitoring center",
    description: "Setting up a neural network module",
    path: "/monitoring"
  },
  {
    icon: chipIcon,
    text: "Digit recognition",
    description: "Setting up a neural network module (MNIST)",
    path: "/mnist"
  }
  // {
  //   icon: chipIcon,
  //   text: "CNN module",
  //   description: "Setting up a neural network module (CNN)",
  //   path: "/cnn"
  // }
];
