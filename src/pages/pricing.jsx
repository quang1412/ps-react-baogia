import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import myData from "./data.json";

// import { IFrame } from "../components/iframe"

const groupByN = (n, arr) => {
  const result = []
  for (let i = 0; i < arr.length; i += n) {
    result.push(arr.slice(i, i + n))
  }
  return result
}

const formatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 0, // Ensure at least 2 decimal places
  maximumFractionDigits: 2, // Limit to a maximum of 2 decimal places
})

const headers = myData.table.cols.map((c) => c.label)
const { rows } = myData.table
const itemsArr = rows.map((r) => {
  return r.c.reduce((accumulator, currentValue, currentIndex) => {
    accumulator[headers[currentIndex]] = currentValue.v
    return accumulator
  }, {})
})
const modelAll = [...new Set(itemsArr.map((item) => item.model))]

const middleIndex = Math.ceil(modelAll.length / 2)
const firstHalf = modelAll.slice(0, middleIndex)
const secondHalf = modelAll.slice(middleIndex)
const array = [firstHalf, secondHalf];



const Pricing = () => {
  const [showModal, setShowModal] = useState(false); // Initial state: modal is hidden

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <style>{`.row:is([data-mem], [data-model]):has(.color-price:not(:empty):hover) > div:first-child:before { color: var(--bs-danger, red); content: "►"; position: absolute; transform: translateX(-1em); } .color-price:not(:empty):hover{ background: #121212; color: #fff; }`}</style>
      <h3>Pricing</h3>
      <p id="time mb-3">2025</p>

      <Row style={{'fontSize':'1vw'}}>
        {array.map((models, i0) => (
          <Col xs={6} key={"part" + i0}>
            {models.map((model, i1) => {
              const memsOfModel = [...new Set(itemsArr.filter((i) => i.model == model).map((i) => i.mem)),];
              const colorsOfModel = [...new Set(itemsArr.filter((i) => i.model == model).map((i) => i.color)),];
              const groupColors = groupByN(3, colorsOfModel)
              return (
                <div className="px-1"><Row key={"model" + i1} data-model={model} className=" border-top border-start bg-light mb-3">
                  <Col xs={2} className="fw-bolder border-end border-bottom d-flex align-items-center p-1 model" style={{'fontSize':'1.3em'}}>
                    <div><span>{model}</span></div>
                  </Col>
                  <Col>
                    {memsOfModel.map((mem, i2) => (
                      <Row data-mem={mem}>
                        <Col xs={2} className="border-end border-bottom d-flex align-items-center p-1 mem">
                          <div>{mem}</div>
                        </Col>
                        <Col>
                          {groupColors.map((cgr, i3) => (
                            <Row>
                              {[0, 1, 2].map((i4) => {
                                const color = cgr[i4] || ""
                                const price = itemsArr.find((i) => i.model == model && i.mem == mem && i.color == color )?.price || ""

                                return (
                                  <Col xs={4} className="border-end border-bottom d-flex p-1 color-price" role="button" onClick={handleShow}>
                                    {color ? <div style={{'width': '40%'}}>{color}</div> : <></>}
                                    {price ? <div className="text-danger">{formatter.format(price)}</div> : <></>}
                                  </Col>
                                )
                              })}
                            </Row>
                          ))}
                        </Col>
                      </Row>
                    ))}
                  </Col>
                </Row></div>
              )
            })}
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Thông tin chi tiết</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Lưu lại
            </Button>
          </Modal.Footer>
        </Modal>
    </>
  )
}

export default Pricing
