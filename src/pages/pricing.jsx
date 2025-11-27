// import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

const Pricing = () => { 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async function(){
      fetch(`https://docs.google.com/spreadsheets/d/1B0lsfTAz0T2YL2-J5D3ufloYwqlJeZbdqxn06VRbTno/gviz/tq?tqx=out:json&tq&gid=1172221774&range=A2:B&headers=0`).then(res => res.text()).then(text => {
        const cleanedText = text.replace("/*O_o*/\ngoogle.visualization.Query.setResponse(", "").slice(0, -2)
        const jsonData = JSON.parse(cleanedText)
        const { rows } = jsonData.table
        if(!rows.length) { throw new Error(`Dữ liệu không hợp lệ`) }
        const arr = rows.map(r => ([r.c[0].v, r.c[1].v]))
        console.log(arr)
        setData(arr)

      }).catch(error => {
        setError(error.message)
      }).finally(() => {
        setLoading(false)
      })
    }
    fetchData();
  }, [])
  

  return (
    <>
      <h3>Báo giá</h3>
      <ul>
        {data.map(arr => {
          const [date, url] = arr;
          return <li><a href={url}>Cập nhật {date}</a></li>
        })}
      </ul>

      <div className='m-3'>
        <div className="spinner-border text-primary" style={{'display': loading ? 'block' : 'none'}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className='text-danger' style={{display: error ? 'block' : 'none'}}>⚠️ {error}</p>
      </div>
    </>
  )
}

export default Pricing
