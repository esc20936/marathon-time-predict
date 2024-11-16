import { sendAdvancedBody, sendBody } from "../types/send";
import API from "./axios";

export const sendTrainingData = async (trainingData: sendBody) => {
  try {
    const response = await API.post("model/predict", trainingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const sendAdvancedTrainingData = async (trainingData: sendAdvancedBody) => {
  try {
    const response = await API.post("model/predict2", trainingData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
