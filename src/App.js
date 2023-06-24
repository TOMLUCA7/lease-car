import "./App.css";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
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
import { ToastContainer, toast } from "react-toastify";
import CarList from "./CarList";

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
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectMonths, setSelectMonths] = useState("60");
  const [selectedValue, setSelectedValue] = useState(0);

  const months = [
    { name: "12", value: "12" },
    { name: "24", value: "24" },
    { name: "36", value: "36" },
    { name: "48", value: "48" },
    { name: "60", value: "60" },
  ];

  const [minValue, setMinValue] = useState(
    selectedCar ? (selectedCar.carPrice * 10) / 100 : 0
  );

  const [maxValue, setMaxValue] = useState(
    selectedCar ? selectedCar.carPrice : 0
  );

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
          getDownloadURL(uploade.snapshot.ref)
            .then(async (downloadeURL) => {
              await addDoc(collection(database, "cars"), {
                createdAt: Date.now(),
                carModel: carModel,
                carPrice: carPrice,
                carImage: downloadeURL,
              }).then((result) => {
                toast.success(`New car Added ${carModel}`);
                setCarImage("");
                setCarModel("");
                setCarPrice("");
                setIsUploade(false);
                loadcar();
              });
            })
            .catch((error) => {
              toast.error(error.message);
            });
        }
      );
    } else {
      setIsUploade(false);
      toast.error("All filds are required !");
    }
  };

  const loadcar = async () => {
    try {
      const query = await getDocs(collection(database, "cars"));
      setCars(
        query.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    } catch (error) {}
  };

  useEffect(() => {
    loadcar();
  }, []);

  useEffect(() => {
    if (selectedCar) {
      setMinValue((selectedCar.carPrice * 10) / 100);
      setSelectedValue((selectedCar.carPrice * 10) / 100);
      setMaxValue(selectedCar.carPrice);
    }
  }, [selectedCar]);

  return (
    <>
      <ToastContainer />
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
              <>
                <Spinner animation="border" variant="warning" />
                {/* <p>{progress}</p> */}
              </>
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
            {cars.length > 0 && (
              <>
                {cars.map((car) => (
                  <CarList
                    onClick={() => {
                      setSelectedCar(car);
                    }}
                    car={car}
                  />
                ))}
              </>
            )}
          </Col>
          <Col xl={5}>
            <h3>Select Car</h3>
            {selectedCar ? (
              <>
                <img
                  alt="car"
                  src={selectedCar.carImage}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                  }}
                />
                <h3 style={{ marginTop: 20 }}>{selectedCar.carModel}</h3>
                <h1 style={{ marginTop: 20 }}>$ {selectedCar.carPrice}</h1>
              </>
            ) : (
              <p style={{ color: "#fff", fontSize: 22 }}>
                Please Select Your Cat
              </p>
            )}
          </Col>
          <Col xl={4}>
            <h3>Calculate Monthly Payment</h3>
            <h5> Number fo Monthts : </h5>
            <ButtonGroup>
              {months.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant={"outline-light"}
                  name="radio"
                  value={radio.value}
                  checked={selectMonths === radio.value}
                  onChange={(e) => setSelectMonths(e.currentTarget.value)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>

            <h5 style={{ marginTop: 20 }}>Pre-PayMent</h5>
            <Form.Range
              value={selectedValue}
              min={minValue}
              max={maxValue}
              onChange={(e) => {
                setSelectedValue(e.target.value);
              }}
            />

            <h3>$ {selectedValue}</h3>
            <h1 style={{ marginTop: 20 }}>
              {((maxValue - selectedValue) / selectMonths).toFixed()} /{" "}
              {selectMonths} <span style={{ fontSize: 14 }}>Months</span>
            </h1>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
