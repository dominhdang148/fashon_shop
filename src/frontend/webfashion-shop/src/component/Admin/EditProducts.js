import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { getCategories, getProductById, updateProduct } from "../../Services/repository";
import {isEmptyOrSpaces} from '../../Utils/Utils';
// import { useSelector } from "react-redux";
// import config from "../../config";

const EditProducts = () => {
  const initialState = {
      product_id: "",
      name: "",
      description: "",
      inventory: "",
      image: "",
      price: 0,
      category: {},
    },
    [product, setProduct] = useState(initialState),
    [categories, setCategories] = useState([]);
    // console.log(categories);
  // console.log(product);
  const navigate = useNavigate();
  let { id } = useParams();
  id = id ?? "";

  useEffect(() => {
    getProductById(id).then((data) => {
      if (data) {
        setProduct({
          ...data,
        });
      }
      else {
        setProduct(initialState);
      } 
    }, [id]);
    getCategories().then(data => {
        if (data)
            setCategories(data);
        else
            setCategories([]);
    }, []);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let form = new FormData()
    form.append("name", String(product.name));
    form.append("description", String(product.description));
    form.append("inventory", String(product.inventory));
    form.append("image", product.image);
    form.append("category", String(product.category));
    form.append("price", String(product.price));
    let formDataObj = {};
    for (let pair of form.entries()) {
      formDataObj[pair[0]] = pair[1];
    }
    
    let json = JSON.stringify(formDataObj);
    updateProduct(id, json, navigate).then(data => {
      if (data === true) {
        alert("Success!");
        navigate("/admin/products");
      } else {
        alert("Error");
      }
    })
  };

  return (
    <>
      <div className="sb-nav-fixed">
        <div id="layoutSidenav">
          <div id="layoutSidenav_content">
            <div>
              <div className="head-title" style={{ padding: "40px" }}>
                <Form
                  method="post"
                  encType="multipart/form-data"
                  onSubmit={handleSubmit}
                >
                  <Form.Control type="hidden" name="id" value={product.product_id} />
                  <div className="row mb-3" style={{ marginBottom: "30px" }}>
                    <Form.Label className="col-sm-2 col-form-label">
                      Tên sản phẩm
                    </Form.Label>
                    <div className="col-sm-10">
                      <Form.Control
                        type="text"
                        name="name"
                        title="name"
                        required
                        value={product.name || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3" style={{ marginBottom: "30px" }}>
                    <Form.Label className="col-sm-2 col-form-label">
                      Mô tả
                    </Form.Label>
                    <div className="col-sm-10">
                      <Form.Control
                        as="textarea"
                        type="text"
                        name="description"
                        title="description"
                        required
                        value={product.description || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {!isEmptyOrSpaces(product.image) && (
                    <div className="row mb-3">
                      <Form.Label className="col-sm-2 col-form-label">
                        Hình hiện tại
                      </Form.Label>
                      <div className="col-sm-10">
                        <img src={product.image} alt={product.title} />
                      </div>
                    </div>
                  )}
                  <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">
                      Chọn hình ảnh
                    </Form.Label>
                    <div className="col-sm-10">
                      <Form.Control
                        type="file"
                        name="image"
                        accept="image/*"
                        title="Image file"
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            image: e.target.files[0],
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="row mb-3" style={{ marginBottom: "30px" }}>
                    <Form.Label className="col-sm-2 col-form-label">
                      Category
                    </Form.Label>
                    <div className="col-sm-10">
                      <Form.Select
                        name="categoryId"
                        title="categoryId"
                        required
                        value={product.category_id}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            category: e.target.value,
                          })
                        }
                      >
                        <option value="">-- Choose Category --</option>
                        {categories.length > 0 && categories.map((item, index) =>
                                    <option key={index} value={item.id}>{item.title}</option>)}
                      </Form.Select>
                    </div>
                  </div>
                  <div className="row mb-3" style={{ marginBottom: "30px" }}>
                    <Form.Label className="col-sm-2 col-form-label">
                      Hàng tồn kho
                    </Form.Label>
                    <div className="col-sm-10">
                      <Form.Control
                        type="text"
                        name="inventory"
                        title="inventory"
                        required
                        value={product.inventory || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            inventory: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3" style={{ marginBottom: "30px" }}>
                    <Form.Label className="col-sm-2 col-form-label">
                      Giá
                    </Form.Label>
                    <div className="col-sm-10">
                      <Form.Control
                        type="text"
                        name="price"
                        title="price"
                        required
                        value={product.price || ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      variant="primary"
                      type="submit"
                      style={{ marginRight: "20px" }}
                    >
                      Lưu
                    </Button>
                    <Link to="/admin/product" className="btn btn-danger ms-2">
                      Hủy và quay lại
                    </Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProducts;
