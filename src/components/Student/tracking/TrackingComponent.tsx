import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import * as faceapi from "face-api.js";
import React, { useEffect, useRef, useState } from "react";

const TrackingComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [trackingData, setTrackingData] = useState<any[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setDeviceList(videoDevices);
    });
  }, []);

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  };

  useEffect(() => {
    loadModels();
  }, []);

  const startVideo = async (deviceId?: string) => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }

    if (intervalId) {
      clearInterval(intervalId);
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId },
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    const videoEl = videoRef.current;
    const canvasEl = canvasRef.current;

    if (videoEl && canvasEl) {
      const displaySize = { width: videoEl.width, height: videoEl.height };
      faceapi.matchDimensions(canvasEl, displaySize);

      const newIntervalId = setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(videoEl, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        setTrackingData((prevData) => [...prevData, detections]);

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvasEl
          .getContext("2d")
          ?.clearRect(0, 0, canvasEl.width, canvasEl.height);

        faceapi.draw.drawDetections(canvasEl, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasEl, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvasEl, resizedDetections);
      }, 100);

      setIntervalId(newIntervalId);
    }
  };

  const handleCameraChange = (e: SelectChangeEvent<string | null>) => {
    setSelectedDevice(e.target.value as string | null);
  };

  const handleStartClick = () => {
    if (selectedDevice) {
      startVideo(selectedDevice);
    }
  };

  const handleStopClick = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }

    if (intervalId) {
      clearInterval(intervalId);
    }

    const studentData = {
      studentId: "some-id",
      trackingData,
    };

    const jsonData = JSON.stringify(studentData);
    localStorage.setItem("studentData", jsonData);
  };

  return (
    <Container>
      <Typography
        variant="h2"
        component="h2"
        gutterBottom
        style={{ paddingBottom: "40px", paddingTop: "20px" }}
      >
        Detección de Rostro con Análisis de Emociones
      </Typography>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} style={{ marginBottom: "5px" }}>
          <FormControl variant="outlined">
            <InputLabel id="camera-select-label">Seleccione Cámara</InputLabel>
            <Select
              labelId="camera-select-label"
              value={selectedDevice}
              onChange={handleCameraChange}
              label="Seleccione Cámara"
            >
              {deviceList.map((device, index) => (
                <MenuItem key={index} value={device.deviceId}>
                  {device.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} style={{ marginBottom: "5px", padding: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartClick}
          >
            Iniciar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleStopClick}
            style={{ marginLeft: "10px" }}
          >
            Detener
          </Button>
        </Grid>
        <Grid item xs={12}>
          <video ref={videoRef} width="720" height="560" autoPlay muted></video>
          {/*<canvas ref={canvasRef} width="720" height="560"></canvas>*/}
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrackingComponent;
