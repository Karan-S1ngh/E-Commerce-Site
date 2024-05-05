import React, { useEffect } from 'react'
import './Popular.css'
import Item from '../Item/Item'

const Popular = () => {

  const [popularProducts, setPopularProducts] = React.useState([]);

  useEffect(() => {
    fetch("https://e-commerce-site-backend-tt1n.onrender.com/popularinmen")
    .then((response) => response.json())
    .then((data) => setPopularProducts(data));
  },[])

  return (
    <div className='popular'>
        <h1>Popular in Men</h1>
        <hr />
        <div className="popular-item">
            {popularProducts.map((item,i)=>{
                return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}

export default Popular
