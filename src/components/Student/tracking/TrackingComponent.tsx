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
import { openDB } from "idb";
import { useAuth } from "../../../state/AuthContext";
import {
  Analysis,
  ConcentrateStatus,
  FaceStatus,
  TimeStatus,
  TrackingData,
} from "./interfaces";
import { useParams } from "react-router-dom";
import { IAnalysis } from "../../../domain/detector/constants/interfaces";
import { useCreateDetector } from "../../../domain/detector/services/detector-service";

interface ExpressionData {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

const TrackingComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const { currentUser } = useAuth();
  const userId = currentUser?.studentId || 0;

  const { id: lessonId } = useParams();

  const [start, setStart] = useState<Date | null>(null);

  const createDetector = useCreateDetector();

  const DATABASE_NAME = "faceTrackingDB";
  const STORE_NAME = "trackingData";

  useEffect(() => {
    // Inicializa la base de datos al cargar el componente
    async function initDB() {
      const db = await openDB(DATABASE_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { autoIncrement: true });
          }
        },
      });
    }

    initDB();
  }, []);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        let tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (err) {
        console.error("Error obteniendo permisos de cámara:", err);
      }
    };

    getCameraPermission();
  }, []);

  const addToDatabase = async (data: ExpressionData, key: any) => {
    const db = await openDB(DATABASE_NAME, 1);
    const tx = db.transaction(STORE_NAME, "readwrite");
    await tx.store.add(data, key);
    await tx.done;
  };

  const clearDatabase = async () => {
    const db = await openDB(DATABASE_NAME, 1);
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.store.clear();
    await tx.done;
  };

  const getAllFromDatabase = async () => {
    const db = await openDB(DATABASE_NAME, 1);
    return db.getAll(STORE_NAME);
  };

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

        const expressionsData = detections.map((det) => det.expressions);

        for (const expression of expressionsData) {
          const timestampKey = new Date().getTime();
          addToDatabase(expression, timestampKey);
        }

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
      }, 1000);

      setIntervalId(newIntervalId);
    }
  };

  const handleCameraChange = (e: SelectChangeEvent<string | null>) => {
    setSelectedDevice(e.target.value as string | null);
  };

  const handleStartClick = () => {
    if (selectedDevice) {
      startVideo(selectedDevice);
      setStart(new Date());
    }
  };

  const handleStopClick = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }

    if (intervalId) {
      clearInterval(intervalId);
    }

    const storedData = await getAllFromDatabase();

    const analysis = analyze_data_fixed({
      studentId: userId,
      trackingData: storedData,
    });
    const analysisData: IAnalysis = {
      start: start!,
      end: new Date(),
      analyses: analysis,
      studentId: userId,
      lessonId: Number(lessonId),
    };

    createDetector.mutate(analysisData, {
      onSuccess: () => {
        console.log("Success");
      },
      onError: (error) => {
        console.log("Error");
      },
    });

    await clearDatabase();
  };

  const analyze_data_fixed = (data: TrackingData): Analysis[] => {
    const trackingData = data.trackingData;
    const n = trackingData.length;

    let segments: ExpressionData[][] = [];
    if (n < 3) {
      segments.push(trackingData);
    } else {
      segments = [
        trackingData.slice(0, Math.floor(n / 3)),
        trackingData.slice(Math.floor(n / 3), Math.floor((2 * n) / 3)),
        trackingData.slice(Math.floor((2 * n) / 3)),
      ];
    }

    const results: Analysis[] = [];
    for (let idx = 0; idx < segments.length; idx++) {
      const segment = segments[idx];

      const avgEmotions: ExpressionData = {
        neutral: 0,
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0,
      };

      for (const record of segment) {
        for (const emotion in avgEmotions) {
          avgEmotions[emotion as keyof ExpressionData] +=
            record[emotion as keyof ExpressionData];
        }
      }

      for (const emotion in avgEmotions) {
        avgEmotions[emotion as keyof ExpressionData] /= segment.length;
      }

      let timeStatus: TimeStatus;
      if (n < 3) {
        timeStatus = TimeStatus.middle;
      } else {
        timeStatus =
          idx === 0
            ? TimeStatus.begin
            : idx === 1
            ? TimeStatus.middle
            : TimeStatus.end;
      }

      const concentrateStatus =
        avgEmotions.neutral > 0.6 || avgEmotions.surprised > 0.6
          ? ConcentrateStatus.concentrate
          : ConcentrateStatus.desconcentrate;

      let maxEmotion: keyof ExpressionData = "neutral";
      for (const emotion in avgEmotions) {
        if (
          avgEmotions[emotion as keyof ExpressionData] > avgEmotions[maxEmotion]
        ) {
          maxEmotion = emotion as keyof ExpressionData;
        }
      }
      const faceStatus = maxEmotion.toUpperCase() as FaceStatus;

      results.push({
        timeStatus,
        concentrateStatus,
        faceStatus,
      });
    }

    return results;
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
          <canvas ref={canvasRef} width="720" height="560"></canvas>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TrackingComponent;
