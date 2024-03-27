import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>
            An e-commerce website is an online platform that facilitates 
            the buying and selling of goods and services. These transactions
            are conducted through the transfer of information and funds over
            the internet. The variety of e-commerce websites is vast,
            including websites that are set up by retailers, online marketplaces,
            and auction websites. E-commerce websites enable businesses to reach
            a wider customer base and sell their products or services without
            the overhead costs of a physical store or office.
            </p>
            <p>
            E-commerce websites are designed to be user-friendly and easy to
            navigate. They often include features such as product search,
            product categories, shopping carts, and secure payment processing.
            E-commerce websites can be built from scratch or using e-commerce
            platforms such as Shopify, WooCommerce, and Magento. These platforms
            provide templates and tools to help businesses create and manage
            their online stores.
            </p>
        </div>
    </div>
  )
}

export default DescriptionBox
