import { predictAdvancedBody, predictBody } from "../types/predict";
import API from "./axios";

export const sendTrainingData = async (trainingData: predictBody) => {
  try {
    const response = await API.post("model/predict", trainingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const sendAdvancedTrainingData = async (trainingData: predictAdvancedBody) => {
  try {
    const response = await API.post("model/predict2", trainingData);
    return response.data;
  } catch (error) {
    throw error;
  }
}
