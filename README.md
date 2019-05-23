# NEURAL NET IDS

Neural net IDS is based on a neural network classifier which efficiently and rapidly classifies observed network packets with respect to attack patterns which it has been trained to recognise. As in most IDSs, classification is based on a set of descriptive features which characterise the packet.

Stack of technologies used for the implementation of IDS:

- Electron
- Nodejs
- React

## Desktop application interface

<img src="https://lh3.googleusercontent.com/X5GrZYc2NCydEa6z13kYgeNavp4CT1AH7W5f9hqODytpLXiMVjcgqPiBIfdu1N8zLzqEalCzn6VjC2ak4MgNnBZwGPNK0dpEmoTJOE-FiqyUyEIrvbGorTdx3BCmqv9i6Y0PIxvYhtZ_P_tMrXqZV_iZgYAKbG0PGVztnWFZb-PL8bxuLSb8Oi_ZLdbHCNc2er_aW1rk-Q8htJ37L8nHD2BZMbnz5VHHy5v3NOiel-y2HfoVE8Z2mD0nfN9pjp3jxWSWgOKohNfVG37DOmprQ-AdksORzxi4buFNmV3Nm04PdRPqVhw10bOnuKrGoVQ28fXijUlvUzr8ssbMoN6AHKtcZxgJUZtuV1aaVWr6u4wE8mqLlATsNPHz8UolCNil2nOAmlkp0u94g9Dhzpoodk5puRa-dEsNddHoG5rQGguXmrky138nR_7E9Ze_1FHaeHeBdyPxb8Uu9esGuiAI75-G3gHVAzQ3uPtzU7RroXOp1ioLsBob2gCAEYfY9PUF31HtOYxZbw-351cQjY_p2SIiaqX4Ec9Cnvj9vvFri9BU3nCcSBkHPU499B412tpxMgpY3NAv0FzMGtuumC4WO-vMp7CSs5ateKrQEwbsPh6VGuDHk4MV7uLdxn6VC7jPUf1TcjEFzvVAGoLGlJapLZvVj25jrw7yEdtDxTG62_jPjxdkpSB4aDCUocUuItN6eVT1iu1xsIaLwkykbX2hHWs=w3086-h1822-no" alt="ids_interface" />

## Installation

### Download Project & Install Dependencies

```
git clone https://github.com/AlexanderGureev/neural_net_ids.git && cd neural_net_ids
npm install or yarn install
```

## Download CSE-CIC-IDS2018 datasets

[A Realistic Cyber Defense Dataset (CSE-CIC-IDS2018)](https://registry.opendata.aws/cse-cic-ids2018/)

Install the [AWS CLI](https://aws.amazon.com/ru/cli/), available on Mac, Windows and Linux <br />
Run: `aws s3 sync --no-sign-request --region <your-region> "s3://cse-cic-ids2018/" neural_net_ids/main/datasets`

### `npm start`

Runs the app in the development mode.
