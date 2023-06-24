import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";

function CarList(props) {
  return (
    <>
      <Row
        style={{
          marginTop: 10,
        }}
        onClick={() => {
          props.onClick(props.car);
        }}
      >
        <Col xs={4}>
          <img
            src={props.car.carImage}
            style={{ width: "100%", borderRadius: 10 }}
          />
        </Col>
        <Col xs={8}>
          <h5>{props.car.carModel}</h5>
          <p>{props.car.carPrice}</p>
        </Col>
      </Row>
    </>
  );
}

export default CarList;
