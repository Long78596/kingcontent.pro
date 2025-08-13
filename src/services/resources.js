import axios from 'axios';
import Client from '../Client';
import UploadClient from '../UploadClient';
export const API_RESOURCES = '/resources';
export const API_UPLOAD = 'http://tools.kingcontent.pro/upload-file-to-gcs';

export const ResourcesService = {
  getAllFile() {
    return Client.get(API_RESOURCES);
  },
  uploadFile(data, setUploadProgress) {
    return Client.post(API_RESOURCES, data, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress && setUploadProgress(percentCompleted);
      },
    });
  },
  uploadSingleFile(data, setUploadProgress) {
    return Client.post(`${API_RESOURCES}/single`, data, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress && setUploadProgress(percentCompleted);
      },
    });
  },
  deleteFile(id) {
    return Client.delete(`${API_RESOURCES}/${id}`);
  },
  getEventByDate(date) {
    return Client.get(`/event-contents-in-date?event_date=${date}`);
  },
  uploadToGCS(file, type = 'image') {
    // convert file to binary
    let binaryStr = '';
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function () {
      binaryStr = reader.result;
    };
    const urlUpload = `${API_UPLOAD}?type=${type}`;
    UploadClient.post(
      urlUpload,
      {
        file: binaryStr,
      },
      {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        },
      }
    );
  },
};
