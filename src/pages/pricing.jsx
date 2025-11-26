import { Link } from "react-router-dom";

const Pricing = () => { 
  return (
    <>
      <style>{`.row:is([data-mem], [data-model]):has(.color-price:not(:empty):hover) > div:first-child:before { color: var(--bs-danger, red); content: "►"; position: absolute; transform: translateX(-1em); } .color-price:not(:empty):hover{ background: #121212; color: #fff; }`}</style>
      <h3>Pricing</h3>
      <a href="/bao-gia?id=MTA4ODQyNjk1Ng">26/11/2025</a>
    </>
  )
}

export default Pricing
