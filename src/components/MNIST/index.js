import React, { useEffect, useRef, useState } from "react";
import { ContentBlock, Button, BtnGroup, Label } from "../styles";
import { Wrapper, ChartContainer, DrawingContainer } from "./styles";
import * as tf from "@tensorflow/tfjs";
import { run } from "./neuralCore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const Mnist = () => {
  const [trainSuccess, setStatus] = useState(false);
  const [model, setModel] = useState(null);
  const [preds, setPreds] = useState(null);

  const canvasRef = useRef();
  const resultCanvasRef = useRef();

  const ctx = useRef(null);
  const xs = useRef([]);
  const ys = useRef([]);
  const dots = useRef([]);
  const draw = useRef(false);

  const setDraw = val => {
    draw.current = val;
  };

  useEffect(() => {
    initCanvas();
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      const URL_MODEL = "http://localhost:8080/mymodel.json";
      let model = await tf.loadLayersModel(URL_MODEL);

      if (!model) model = await initNeuralCore();
      setModel(model);
      setStatus(true);
      model.summary();
    } catch (error) {
      console.log(error);
    }
  };

  const initNeuralCore = async () => {
    try {
      const model = await run();
      return model;
    } catch (error) {
      console.log(error);
    }
  };

  const initCanvas = () => {
    ctx.current = canvasRef.current.getContext("2d");
    ctx.current.canvas.style.backgroundColor = "black";
    ctx.current.canvas.style.borderRadius = "5px";

    ctx.current.strokeStyle = "white";
    ctx.current.lineJoin = "round";
    ctx.current.lineWidth = "10";
  };
  const mouseDownHandler = e => {
    setDraw(true);
    startDraw(e, true);
  };
  const mouseUpHadler = () => setDraw(false);
  const mouseLeaveHandler = () => setDraw(false);
  const mouseMoveHandler = e => {
    if (draw.current) {
      startDraw(e);
    }
  };

  const startDraw = (e, dot = false) => {
    const { left, top } = e.target.getBoundingClientRect();
    const mouseX = e.pageX - left;
    const mouseY = e.pageY - top;

    xs.current.push(mouseX);
    ys.current.push(mouseY);
    dots.current.push(dot);
    drawOnCanvas();
  };

  const drawOnCanvas = () => {
    const { current: canvasCtx } = ctx;
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

    for (let i = 0; i < xs.current.length; i++) {
      canvasCtx.beginPath();
      if (!dots.current[i] && i) {
        canvasCtx.moveTo(xs.current[i - 1], ys.current[i - 1]);
      } else {
        canvasCtx.moveTo(xs.current[i] - 1, ys.current[i]);
      }
      canvasCtx.lineTo(xs.current[i], ys.current[i]);
      canvasCtx.closePath();
      canvasCtx.stroke();
    }
  };

  const clearCanvas = () => {
    const { current: canvasCtx } = ctx;
    xs.current = [];
    ys.current = [];
    dots.current = [];
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
  };

  const predictHandler = async () => {
    if (!xs.current.length) return;

    const IMAGE_WIDTH = 28;
    const IMAGE_HEIGHT = 28;

    const imageData = renderResultCanvas();
    const pixels = [];
    for (let j = 0; j < imageData.data.length / 4; j++) {
      pixels.push(imageData.data[j * 4] / 255);
    }

    const inputTensor = tf.tensor(pixels);
    const reshapedInputTensor = inputTensor.reshape([
      1,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
      1
    ]);

    const preds = await model.predict(reshapedInputTensor).data();
    let results = Array.from(preds).map((prediction, i) => ({
      prediction,
      class: i
    }));

    setPreds(results);
  };

  const getImageData = ctx => {
    return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const renderResultCanvas = () => {
    const ctxRes = resultCanvasRef.current.getContext("2d");
    ctxRes.clearRect(0, 0, ctxRes.canvas.width, ctxRes.canvas.height);

    ctxRes.canvas.style.backgroundColor = "black";
    ctxRes.canvas.style.borderRadius = "5px";

    ctxRes.drawImage(ctx.current.canvas, 0, 0, 28, 28);

    return getImageData(ctxRes);
  };

  return (
    <ContentBlock>
      <BtnGroup center>
        <Button onClick={clearCanvas}>Clear</Button>
        <Button disabled={!trainSuccess || !model} onClick={predictHandler}>
          Predict
        </Button>
      </BtnGroup>
      <Wrapper>
        <DrawingContainer>
          <Label>Draw number</Label>
          <canvas
            ref={canvasRef}
            width={150}
            height={150}
            onMouseDown={mouseDownHandler}
            onMouseUp={mouseUpHadler}
            onMouseMove={mouseMoveHandler}
            onMouseLeave={mouseLeaveHandler}
          />
          {preds && <Label>You have drawn</Label>}
          <canvas ref={resultCanvasRef} width={28} height={28} />
        </DrawingContainer>
        <ChartContainer>
          {preds && (
            <BarChart
              width={700}
              height={300}
              data={preds}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="prediction" fill="#3a2a75" />
            </BarChart>
          )}
        </ChartContainer>
      </Wrapper>
    </ContentBlock>
  );
};

export default Mnist;
