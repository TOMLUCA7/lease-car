import "./App.css";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Container,
  Row,
  Col,
  FloatingLabel,
  ButtonGroup,
  ToggleButton,
  Spinner,
  Form,
} from "react-bootstrap";
import tost from "react-toastify";

//Fire base
import { database, storage } from "./Firebase_Config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

function App() {
  const [carModel, setCarModel] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carImage, setCarImage] = useState("");
  const [cars, setCars] = useState("");
  const [isUploade, setIsUploade] = useState(false);
  const [progress, setProgress] = useState(0);

  const addNewCar = async () => {
    setIsUploade(true);
    if (carModel !== "" && carPrice !== "" && carImage !== "") {
      const storageRef = ref(storage, `files/${carImage.name}`);
      const uploade = uploadBytesResumable(storageRef, carImage);
      uploade.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (error) => console.log(error),
        () => {
          getDownloadURL(uploade.snapshot.ref).then(async (downloadeURL) => {
            await addDoc(collection(database, "cars"), {
              createdAt: Date.now(),
              carModel: carModel,
              carPrice: carPrice,
              carImage: downloadeURL,
            }).then((result) => {
              setIsUploade(false);
              setCarModel("");
              setCarPrice("");
              setCarImage("");
            });
          });
        }
      );
    } else {
      setIsUploade(false);
      // todo
    }
  };

  return (
    <>
      <Container fluid>
        {/* Header */}
        <Row>
          <Col xl={12} style={{ marginTop: 20, marginBottom: 20 }}>
            <h1>
              CAR<span style={{ color: "#00cc99" }}>LEASE</span>
            </h1>
          </Col>
        </Row>
        {/* Filde */}
        <Row>
          <Col xl={2} style={{}}>
            <p>Add a new car to chack its monthly payment terms</p>
          </Col>
          <Col xl={3}>
            <FloatingLabel label="Car name and model">
              <Form.Control
                value={carModel}
                onChange={(e) => {
                  setCarModel(e.target.value);
                }}
                type="text"
                placeholder="Car name and model"
              />
            </FloatingLabel>
          </Col>
          <Col xl={2}>
            <FloatingLabel label="Car price">
              <Form.Control
                value={carPrice}
                onChange={(e) => {
                  setCarPrice(e.target.value);
                }}
                type="text"
                placeholder="Car price"
              />
            </FloatingLabel>
          </Col>
          <Col xl={3}>
            <FloatingLabel label="Uploade image">
              <Form.Control
                onChange={(e) => {
                  setCarImage(e.target.files[0]);
                }}
                type="file"
                placeholder="Uploade image"
              />
            </FloatingLabel>
          </Col>
          <Col xl={2}>
            {isUploade ? (
              <Spinner animation="border" variant="warning" />
            ) : (
              <Button
                style={{ height: 59, backgroundColor: "#00cc99" }}
                size="lg"
                onClick={addNewCar}
              >
                ADD
              </Button>
            )}
          </Col>
        </Row>
        {/* Content */}
        <Row style={{ marginTop: 20 }}>
          <Col xl={3}>
            <h3>Our cars</h3>
          </Col>
          <Col xl={5}>
            <h3>Select Car</h3>
          </Col>
          <Col xl={4}>
            <h3>Calculate Monthly Payment</h3>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
