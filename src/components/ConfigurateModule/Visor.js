import React, { useRef, useEffect } from "react";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as tf from "@tensorflow/tfjs";
import { useStore } from "easy-peasy";
import { Button } from "../styles";
import { getTensors, normalizeTensor } from "./lib/tensorsOperations";

async function showExamples(data, { classes }) {
  const EXAMPLE_BATCH = 50;

  const surface = tfvis.visor().surface({
    name: "Input Data Examples",
    styles: { height: "800px" },
    tab: "Input Data"
  });

  const normalizedTensor = normalizeTensor(getTensors(data), true);
  const [inputs, outputs] = [
    normalizedTensor[0].slice([0, 0], [EXAMPLE_BATCH]),
    normalizedTensor[1].slice([0, 0], [EXAMPLE_BATCH])
  ];

  const outputsArray = await outputs.array();

  for (let i = 0; i < inputs.shape[0]; i++) {
    const imageTensor = tf.tidy(() => {
      return inputs.slice([i, 0], [1, inputs.shape[1]]).reshape([8, 8, 1]);
    });

    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    canvas.style = "margin: 4px;";
    await tf.browser.toPixels(imageTensor, canvas);

    const resCanvas = document.createElement("canvas");
    resCanvas.width = 80;
    resCanvas.height = 80;
    canvas.style = "margin: 4px;";

    const ctx = canvas.getContext("2d");
    resCanvas.getContext("2d").drawImage(ctx.canvas, 0, 0, 80, 80);

    const typeAttack = document.createElement("p");
    const box = document.createElement("div");
    typeAttack.textContent = classes[outputsArray[i].indexOf(1)];

    typeAttack.setAttribute(
      "style",
      "white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100px; font-size: 12px;"
    );
    box.setAttribute(
      "style",
      "text-align:center; display: inline-block; padding: 0 5px;"
    );
    box.appendChild(typeAttack);
    box.appendChild(resCanvas);
    surface.drawArea.appendChild(box);
  }
}
const showDataset = numOfAttacks => {
  const dsInfo = Object.keys(numOfAttacks).map(key => ({
    index: key,
    value: numOfAttacks[key]
  }));

  tfvis.render.barchart(
    {
      name: "Dataset statistics",
      tab: "Attack ratio"
    },
    dsInfo
  );
};

const Visor = ({ config }) => {
  const { model, datasets, numOfAttacks } = useStore(state => state);
  const visor = useRef(null);

  useEffect(() => {
    if (!datasets) return;
    if (!visor.current) visor.current = tfvis.visor();
    if (config.type === "cnn") showExamples(datasets.test, config);

    if (numOfAttacks) showDataset(numOfAttacks);

    if (model) {
      const surface = {
        name: "Model Summary",
        tab: "Model Inspection",
        styles: {
          height: 800
        }
      };

      tfvis.show.modelSummary(surface, model);
      tfvis.show.layer(surface, model.getLayer(`Layer: 0`, 0));
    }
  }, [model, numOfAttacks]);

  const handleCLick = () => {
    if (!visor.current) {
      visor.current = tfvis.visor();
      return;
    }
    visor.current.toggle();
  };

  return (
    <Button onClick={handleCLick} disabled={!datasets}>
      Show Visor
    </Button>
  );
};

export default Visor;
