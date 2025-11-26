import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Modal, Button } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';



import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// import myData from "./data.json";
 

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


const PricingDetail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateOfPrice, setDateOfPrice] = useState('-');
  const [typeOfPrice, setTypeOfPrice] = useState('-');

  // const [dataJson, setDataJson] = useState([]);

  const navigate = useNavigate();

  const handleClose = () => setShowModal(false);
  // const handleShow = () => setShowModal(true);
  const handleGoBack = () => { navigate('/danh-sach-bao-gia') };

  useEffect(() => {
    const fetchData = async () => {
      new Promise(resolve => resolve(window.atob(searchParams.get('id')))).then(id => (
        fetch(`https://docs.google.com/spreadsheets/d/1B0lsfTAz0T2YL2-J5D3ufloYwqlJeZbdqxn06VRbTno/gviz/tq?tqx=out:json&tq&gid=${id}&range=A:F&headers=1`)
      )).then(res => res.text()).then(text => {
        const cleanedText = text.replace("/*O_o*/\ngoogle.visualization.Query.setResponse(", "").slice(0, -2)
        const jsonData = JSON.parse(cleanedText)
        const headers = jsonData.table.cols.map((c) => c.label)
        const { rows } = jsonData.table
        if(!rows.length) { throw new Error(`Dữ liệu không hợp lệ`) }
        
        const priceDate = rows[0].c[4].f || rows[0].c[4].v
        setDateOfPrice(priceDate);
        const priceType = rows[0].c[5].f || rows[0].c[5].v
        setTypeOfPrice(priceType)

        window.itemsArr = rows.map((r) => {
          return r.c.reduce((accumulator, currentValue, currentIndex) => {
            accumulator[headers[currentIndex]] = currentValue?.v
            return accumulator
          }, {})
        })

        const modelAll = [...new Set(itemsArr.map((item) => item.model))]

        const middleIndex = Math.ceil(modelAll.length / 2)
        const firstHalf = modelAll.slice(0, middleIndex)
        const secondHalf = modelAll.slice(middleIndex)
        const array = [firstHalf, secondHalf]

        setData(array)

      }).catch(error => {
        setError(error.message)
      }).finally( e => {
        setLoading(false)
      });
    }

    fetchData()
  }, []) 

  return (
    <Container fluid className='p-4' >
      <style>{`html{font-size: 1.3vw} .row:is([data-mem], [data-model]):has(.color-price:not(:empty):hover) > div:first-child:before { color: var(--bs-danger, red); content: "►"; position: absolute; transform: translateX(-1em); } .color-price:not(:empty):hover{ background: #121212; color: #fff; }`}</style>
      <style>{'div[class*="border"] { border-left-width: .1rem !important; border-top-width: .1rem !important; border-right-width: .1rem !important; border-bottom-width: .1rem !important; }'}</style>
      
      <div >
        <div className='mb-3'>
          <Button size="lg" variant="outline-secondary" onClick={handleGoBack}>Back</Button>
        </div>

        <h3>PS / Báo giá</h3>
        <p id="time mb-3">Update: {dateOfPrice} / {typeOfPrice}</p>
      </div>

      <div className='h100 w-100 d-flex justify-content-center align-items-center'>
        <div className="spinner-border" style={{'width': '3rem', 'height': '3rem', 'display': loading ? 'block' : 'none'}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className='text-danger' style={{display: error ? 'block' : 'none'}}>⚠️ {error}</p>
      </div>

      <Row >
        {data.map((models, i0) => (
          <Col xs={6} md={6}>
            {models.map((model, i1) => {
              const memsOfModel = [...new Set(window.itemsArr.filter((i) => i.model == model).map((i) => i.mem)),];
              const colorsOfModel = [...new Set(window.itemsArr.filter((i) => i.model == model).map((i) => i.color)),];
              const groupColors = groupByN(3, colorsOfModel)
              return (
                <div className="mx-1 mb-3"><Row key={"model" + i1} data-model={model} className=" border-top border-start  shadow ">
                  <Col xs={3} className="fw-bolder border-end border-bottom d-flex align-items-center p-2 model" style={{'fontSize':'1.3em'}}>
                    <div><span>{model}</span></div>
                  </Col>
                  <Col>
                    {memsOfModel.map((mem, i2) => (
                      <Row data-mem={mem}>
                        <Col xs={2} className="border-end border-bottom d-flex align-items-center p-2 mem">
                          <div>{mem}</div>
                        </Col>
                        <Col>
                          {groupColors.map((cgr, i3) => (
                            <Row>
                              {[0, 1, 2].map((i4) => {
                                const color = cgr[i4] || ""
                                const price = window.itemsArr.find((i) => i.model == model && i.mem == mem && i.color == color )?.price || ""
                                const key = (model + '-' + mem + '-' + color + '-' + i4);
                                return (
                                  <Col xs={4} className="border-end border-bottom p-2 color-price" role="button" >
                                    <OverlayTrigger key={key} placement="top" overlay={
                                        <Tooltip id={'tooltip-'+key}>{model} / {mem}</Tooltip>
                                    }>
                                      <div className=' d-flex'>
                                      {color ? <div className='text-nowrap' style={{'width': '50%'}}>{color}</div> : <></>}
                                      {price ? <div className="text-danger">{formatter.format(price)}</div> : <></>}
                                      </div>
                                    </OverlayTrigger>
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
      <style>{`.modal-dialog{ max-width: 50vw; margin-left: auto; margin-right: auto; }`}</style>
      <Modal  show={showModal} onHide={handleClose}>
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
    </Container >
  )
}

export default PricingDetail
