# NEURAL NET IDS

Neural net IDS is based on a neural network classifier which efficiently and rapidly classifies observed network packets with respect to attack patterns which it has been trained to recognise. As in most IDSs, classification is based on a set of descriptive features which characterise the packet.

Stack of technologies used for the implementation of IDS:

- Electron
- Nodejs
- React

## Installation

### Download Project & Install Dependencies

```
git clone https://github.com/AlexanderGureev/neural_net_ids.git && cd neural_net_ids
npm install or yarn install
```

## Download CSE-CIC-IDS2018 datasets

[A Realistic Cyber Defense Dataset (CSE-CIC-IDS2018)](https://registry.opendata.aws/cse-cic-ids2018/)

Install the [AWS CLI](https://aws.amazon.com/ru/cli/), available on Mac, Windows and Linux
Run: aws s3 sync --no-sign-request --region <your-region> "s3://cse-cic-ids2018/" neural_net_ids/main/datasets

### `npm start`

Runs the app in the development mode.
