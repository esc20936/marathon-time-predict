import { predictBody } from "../types/predict";
import API from "./axios";

export const sendTrainingData = async (trainingData: predictBody) => {
    try {
      const response = await API.post('model/predict', trainingData);
      return response.data;
    } catch (error) {
        throw error
    }
  };