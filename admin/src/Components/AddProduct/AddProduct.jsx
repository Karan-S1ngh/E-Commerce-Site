import React from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = React.useState(null);
  const [productDetails, setProductDetails] = React.useState({
    name: '',
    category: 'women',
    new_price: '',
    old_price: ''
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    try {
      const formData = new FormData();
      formData.append('product', image);
      formData.append('name', productDetails.name);
      formData.append('category', productDetails.category);
      formData.append('new_price', productDetails.new_price);
      formData.append('old_price', productDetails.old_price);

      const response = await fetch('https://e-commerce-site-backend-tt1n.onrender.com/addproduct', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const responseData = await response.json();
      if (responseData.success) {
        alert('Product added successfully');
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add product');
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder="Type here" />
      </div>
      <div className="addproduct-itemfield">
        <p>Price</p>
        <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder="Type here" />
      </div>
      <div className="addproduct-itemfield">
        <p>Offer Price</p>
        <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder="Type here" />
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : upload_area} alt="upload area" className="addproduct-thumnail-img" />
        </label>
        <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
