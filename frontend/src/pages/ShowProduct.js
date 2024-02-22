import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "../features/products/productSlice";
import { useSelector } from "react-redux";
import { Table, InputNumber, Button } from "antd";
import moment from "moment";

const { Column } = Table;

const Product = () => {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product.product);
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    dispatch(getAllProducts());
  };

  // Hàm chuyển đổi ngày
  const formatCreatedAt = (createdAt) => {
    return moment(createdAt).format("YYYY-MM-DD");
  };

  // Tính độ dài của mỗi nhóm sản phẩm theo ngày
  const calculateRowSpan = () => {
    const groupedProducts = {};
    productState.forEach((product) => {
      const date = formatCreatedAt(product.createdAt);
      if (groupedProducts[date]) {
        groupedProducts[date]++;
      } else {
        groupedProducts[date] = 1;
      }
    });
    return Object.values(groupedProducts);
  };

  // Hàm xử lý sự kiện sắp xếp
  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleBuy = () => {
    // Xử lý logic khi nhấn nút "Buy"
  };

  const footer = () => (
    <div style={{ textAlign: "right" }}>
      <Button type="primary" onClick={handleBuy}>
        Buy
      </Button>
    </div>
  );

  return (
    <div>
      <h2>Product</h2>
      <Table
        dataSource={productState}
        rowKey="_id"
        onChange={handleChange}
        pagination={{
          position: ["bottomRight"],
        }}
        footer={footer}
      >
        <Column
          title="Date"
          dataIndex="createdAt"
          key="date"
          render={(text, record, index) =>
            index === 0 && formatCreatedAt(text)
          }
          sorter={(a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
          }
          sortOrder={
            sortedInfo.columnKey === "date" && sortedInfo.order
          }
          rowSpan={() => calculateRowSpan()}
          align="center"
        />
        <Column
          title="Title"
          dataIndex="title"
          key="title"
          sorter={(a, b) => a.title.localeCompare(b.title)}
          sortOrder={
            sortedInfo.columnKey === "title" && sortedInfo.order
          }
        />
        <Column
          title="Brand"
          dataIndex="brand"
          key="brand"
          sorter={(a, b) => a.brand.localeCompare(b.brand)}
          sortOrder={
            sortedInfo.columnKey === "brand" && sortedInfo.order
          }
        />
        <Column
          title="Price"
          dataIndex="price"
          key="price"
          sorter={(a, b) => a.price - b.price}
          sortOrder={
            sortedInfo.columnKey === "price" && sortedInfo.order
          }
        />
        <Column
          title="Quantity"
          key="quantity"
          render={(text, record) => (
            <InputNumber defaultValue={1} min={1} max={10} />
          )}
        />
      </Table>
    </div>
  );
};

export default Product;
