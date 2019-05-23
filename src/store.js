import { createStore, action, thunk } from "easy-peasy";
import { io, loadLayersModel } from "@tensorflow/tfjs";

const modelActions = {
  changeStatus: action((state, payload) => ({
    ...state,
    statusGuard: !state.statusGuard
  })),
  changePage: action((state, payload) => ({
    ...state,
    currentPage: payload
  })),
  updateConfig: action((state, payload) => ({
    ...state,
    moduleConfig: {
      ...state.moduleConfig,
      ...payload
    }
  })),
  updateModel: action((state, payload) => ({
    ...state,
    model: payload
  })),
  setState: action((state, payload) => ({
    ...state,
    ...payload
  })),
  updateLogs: action((state, payload) => {
    const newLogs = Array.isArray(payload)
      ? payload.map(text => `${text} - ${new Date().toLocaleString()}`)
      : [`${payload} - ${new Date().toLocaleString()}`];

    return {
      ...state,
      logs: [...state.logs, ...newLogs]
    };
  }),
  clearLogs: action((state, payload) => ({ ...state, logs: [] })),
  updateHistory: action((state, payload) => ({
    ...state,
    history: payload
  })),
  saveModel: thunk(async (actions, payload, { injections, getState }) => {
    const { model, savedModels } = getState();
    const savedModel = await model.save(`indexeddb://${payload}`);
    actions.setState({
      savedModels: [
        ...savedModels,
        { name: payload, modelInfo: { ...savedModel } }
      ]
    });
  }),
  removeModel: thunk(async (actions, payload, { injections, getState }) => {
    const { savedModels } = getState();
    await injections.modelService.removeModel(`indexeddb://${payload}`);
    actions.setState({
      savedModels: savedModels.filter(({ name }) => name !== payload)
    });
  }),
  loadModel: thunk(async (actions, payload, { injections, getState }) => {
    const loadedModel = await injections.modelService.loadLayersModel(
      `indexeddb://${payload}`
    );
    actions.updateModel(loadedModel);
  })
};

const model = {
  statusGuard: true,
  currentPage: "/",
  model: null,
  history: [],
  moduleConfig: {
    type: "ann",
    features: [],
    classes: [],
    size: 10000,
    batchSize: 1024,
    epochs: 5,
    normalize: false,
    logScaling: false
  },
  datasets: null,
  numOfAttacks: null,
  savedModels: [],
  logs: [],
  ...modelActions
};

export default createStore(model, {
  injections: { modelService: { removeModel: io.removeModel, loadLayersModel } }
});
