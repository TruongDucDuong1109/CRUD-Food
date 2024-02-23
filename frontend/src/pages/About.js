import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsercart, updateCartProduct, makePayment } from '../features/user/userSlice'; 
import { Table, Button, InputNumber } from 'antd';
import { deleteCartProduct } from '../features/user/userSlice';

const About = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.auth.cartProducts);
  
  
  const handlePayment = () => {
    dispatch(makePayment(cart)); 
    console.log("cartData");
  };
  
  

  useEffect(() => {
    dispatch(getUsercart());
  }, [dispatch]);

  const deleteACartProduct = (id) => {
    dispatch(deleteCartProduct(id));
    setTimeout(() => {
      dispatch(getUsercart());
    }, 200);
  };

  const updateACartProduct = (cartDetailId, newQuantity) => {
    dispatch(updateCartProduct({ cartDetailId, newQuantity }));
    setTimeout(() => {
      dispatch(getUsercart());
    }, 200);
  };

  const [quantityMap, setQuantityMap] = useState({});

  const handleQuantityChange = (cartDetailId, value) => {
    setQuantityMap((prev) => ({
      ...prev,
      [cartDetailId]: value,
    }));
    updateACartProduct(cartDetailId, value);
  };

  const columns = [
    {
      title: 'Product Title',
      dataIndex: 'productId',
      key: 'productId',
      render: (productId) => productId.title,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          max={record.productId.quantity}
          value={quantityMap[record._id] || quantity}
          onChange={(value) => handleQuantityChange(record._id, value)}
        />
      ),
    },
    {
      title: 'Action',
      dataIndex: '_id',
      key: 'action',
      render: (id) => (
        <Button onClick={() => deleteACartProduct(id)} type="primary" danger>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Cart</h2>
      <Table columns={columns} dataSource={cart} />
      <Button onClick={handlePayment}>Thanh toán</Button> {/* Thêm button để gọi hàm handlePayment */}
    </div>
  );
};

export default About;
