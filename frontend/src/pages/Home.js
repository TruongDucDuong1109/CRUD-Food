import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUsers } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { Table, InputNumber, Button, DatePicker } from "antd";
import moment from "moment";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
 
];

const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  const customerstate = useSelector(
    (state) => state.getUsers
    
  );
  console.log(customerstate);
  return (
    <div>
        Home
    </div>
  )
}

export default Home
