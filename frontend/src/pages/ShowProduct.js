// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { getAllProducts } from "../features/products/productSlice";
// import { addProdToCart, getUsers } from "../features/user/userSlice";
// import { useSelector } from "react-redux";
// import { Table, InputNumber, Button, DatePicker, Select } from "antd";
// import moment from "moment";

// const { Column } = Table;
// const { Option } = Select;

// const Product = () => {
//   const dispatch = useDispatch();
//   const productState = useSelector((state) => state.product.product);
//   console.log("productState", productState);
//   const userBrands = useSelector((state) => state.auth.user.brands);
//   console.log("userBrand", userBrands);

//   const [selectedDate, setSelectedDate] = useState(null);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [updatedProducts, setUpdatedProducts] = useState({});
//   const [selectedBrand, setSelectedBrand] = useState(null); // Thêm state cho select
//   console.log("selectedBrand", selectedBrand);
//   useEffect(() => {
//     getProducts();
//   }, []);
//   useEffect(() => {
//     dispatch(getUsers());
//   }, [dispatch]);
//   const getProducts = () => {
//     dispatch(getAllProducts());
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       const filtered = productState.filter((product) =>
//         moment(product.createdAt).isSame(selectedDate, "day")
//       );
//       setFilteredProducts(filtered);
//     } else {
//       setFilteredProducts(productState);
//     }
//   }, [selectedDate, productState]);

//   const handleChangeDate = (date, dateString) => {
//     setSelectedDate(dateString);
//     const filtered = productState.filter((product) =>
//       moment(product.createdAt).isSame(dateString, "day")
//     );
//     setFilteredProducts(filtered);
//   };

//   const handleQuantityChange = (productId, value) => {
//     setUpdatedProducts((prevProducts) => ({
//       ...prevProducts,
//       [productId]: value,
//     }));
//   };

//   const handleBuy = () => {
//     const items = [];
//     for (const productId in updatedProducts) {
//       if (Object.hasOwnProperty.call(updatedProducts, productId)) {
//         items.push({
//           productId,
//           quantity: updatedProducts[productId],
//         });
//       }
//     }
//     console.log({ items });
//     dispatch(addProdToCart({ items }));
//   };

//   const handleBrandChange = (value) => {
//     setSelectedBrand(value);
   
//   };

//   const footer = () => (
//     <div style={{ textAlign: "right" }}>
//       <Button type="primary" onClick={handleBuy}>
//         Buy
//       </Button>
//     </div>
//   );

//   return (
//     <div>
//       <h2>Product</h2>
//       <DatePicker onChange={handleChangeDate} />
//       <Select
//           mode="multiple" 
//         style={{ width: 200, marginLeft: 10 }} // Thêm style cho select
//         placeholder="Select Brand" // Placeholder cho select
//         onChange={handleBrandChange} // Xử lý sự kiện khi người dùng chọn một tùy chọn
//       >
//         {userBrands.map((brand, index) => (
//           <Option key={index} value={brand}>
//             {brand}
//           </Option>
//         ))}
//       </Select>
//       <Table
//         dataSource={filteredProducts}
//         rowKey="_id"
//         pagination={false}
//         footer={footer}
//       >
//         <Column
//           title="Date"
//           dataIndex="createdAt"
//           key="date"
//           sorter={(a, b) =>
//             moment(a.createdAt).unix() - moment(b.createdAt).unix()
//           }
//           render={(text) => moment(text).format("YYYY-MM-DD")}
//         />

//         <Column
//           title="Title"
//           dataIndex="title"
//           key="title"
//           sorter={(a, b) => a.title.localeCompare(b.title)}
//         />

//         <Column title="Price" dataIndex="price" key="price" />
//         <Column
//           title="Quantity"
//           key="quantity"
//           render={(text, record) => (
//             <InputNumber
//               defaultValue={0}
//               min={0}
//               max={999}
//               onChange={(value) =>
//                 handleQuantityChange(record._id, value)
//               }
//             />
//           )}
//         />
//       </Table>
//     </div>
//   );
// };

// export default Product;





import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "../features/products/productSlice";
import { addProdToCart, getUsers } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { Table, InputNumber, Button, DatePicker, Select } from "antd";
import moment from "moment";

const { Column } = Table;
const { Option } = Select;

const Product = () => {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product.product);
  console.log("productState", productState);
  const userBrands = useSelector((state) => state.auth.user.brands);
  console.log("userBrand", userBrands);

  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [updatedProducts, setUpdatedProducts] = useState({});
  const [selectedBrand, setSelectedBrand] = useState(null); // Thêm state cho select
  console.log("selectedBrand", selectedBrand);
  // Thêm state để lưu thông tin về số lượng sản phẩm và thương hiệu đã chọn
  const [cartData, setCartData] = useState({
    items: [],
    selectedBrand: null
  });
  

  useEffect(() => {
    getProducts();
  }, []);
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  const getProducts = () => {
    dispatch(getAllProducts());
  };

  useEffect(() => {
    if (selectedDate) {
      const filtered = productState.filter((product) =>
        moment(product.createdAt).isSame(selectedDate, "day")
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(productState);
    }
  }, [selectedDate, productState]);

  const handleChangeDate = (date, dateString) => {
    setSelectedDate(dateString);
    const filtered = productState.filter((product) =>
      moment(product.createdAt).isSame(dateString, "day")
    );
    setFilteredProducts(filtered);
  };

  const handleQuantityChange = (productId, value) => {
    setUpdatedProducts((prevProducts) => ({
      ...prevProducts,
      [productId]: value,
    }));
  };

  const handleBuy = () => {
    const items = [];
    for (const productId in updatedProducts) {
      if (Object.hasOwnProperty.call(updatedProducts, productId)) {
        const selectedBrandsForProduct = selectedBrand.filter((brand) => userBrands.includes(brand)); 
        items.push({
          productId,
          quantity: updatedProducts[productId],
          brands: selectedBrandsForProduct
        });
      }
    }
    console.log({ items });
    dispatch(addProdToCart({ items }));
  };
  

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
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
      <DatePicker onChange={handleChangeDate} />
      <Select
          mode="multiple" 
        style={{ width: 200, marginLeft: 10 }} // Thêm style cho select
        placeholder="Select Brand" // Placeholder cho select
        onChange={handleBrandChange} // Xử lý sự kiện khi người dùng chọn một tùy chọn
      >
        {userBrands.map((brand, index) => (
          <Option key={index} value={brand}>
            {brand}
          </Option>
        ))}
      </Select>
      <Table
        dataSource={filteredProducts}
        rowKey="_id"
        pagination={false}
        footer={footer}
      >
        <Column
          title="Date"
          dataIndex="createdAt"
          key="date"
          sorter={(a, b) =>
            moment(a.createdAt).unix() - moment(b.createdAt).unix()
          }
          render={(text) => moment(text).format("YYYY-MM-DD")}
        />

        <Column
          title="Title"
          dataIndex="title"
          key="title"
          sorter={(a, b) => a.title.localeCompare(b.title)}
        />

        <Column title="Price" dataIndex="price" key="price" />
        <Column
          title="Quantity"
          key="quantity"
          render={(text, record) => (
            <InputNumber
              defaultValue={0}
              min={0}
              max={999}
              onChange={(value) =>
                handleQuantityChange(record._id, value)
              }
            />
          )}
        />
      </Table>
    </div>
  );
};

export default Product;
