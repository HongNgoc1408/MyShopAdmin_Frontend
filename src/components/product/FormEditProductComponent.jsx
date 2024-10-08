import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const FormEditProductComponent = ({ titleForm, textButton }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [quantitySold, setQuantitySold] = useState("");
  const [inventory, setInventory] = useState("");
  const [status, setStatus] = useState("");
  const [favorite, setFavorite] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  return (
    <div className="w-full p-2">
      <div
        style={{
          backgroundColor: "#1d4ed8",
          height: "54.8px",
          fontSize: "14px",
          fontWeight: 600,
        }}
        className=" rounded-t-xl p-4 text-white TableTitle"
      >
        <p>{titleForm}</p>
      </div>
      <form className="bg-white rounded-b-xl p-2">
        <div className=" px-3 mb-6 md:mb-0 mx-auto">
          <label
            className="block tracking-wide text-grey-darker text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            name="name"
            className="w-full px-5 py-2 text-gray-700 bg-gray-200 rounded"
          ></input>
        </div>
        <div className=" px-3 mb-6 md:mb-0 mx-auto">
          <label
            className="block tracking-wide text-grey-darker text-sm font-bold mb-2"
            htmlFor="price"
          >
            Price
          </label>

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            id="price"
            name="price"
            className="w-full px-5 py-2 text-gray-700 bg-gray-200 rounded"
          ></input>
        </div>
        <div className=" px-3 mb-6 md:mb-0 mx-auto">
          <label
            className="block tracking-wide text-grey-darker text-sm font-bold mb-2"
            htmlFor="discount"
          >
            Discount
          </label>

          <input
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            id="discount"
            name="discount"
            className="w-full px-5 py-2 text-gray-700 bg-gray-200 rounded"
          ></input>
        </div>
        <div className=" px-3 mb-6 md:mb-0 mx-auto">
          <label
            className="block tracking-wide text-grey-darker text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            name="description"
            className="w-full px-5 py-2 text-gray-700 bg-gray-200 rounded"
          ></input>
        </div>
        <div className=" px-3 mb-6 md:mb-0 mx-auto">
          <label
            className="block tracking-wide text-grey-darker text-sm font-bold mb-2"
            htmlFor="quantitySold"
          >
            QuantitySold
          </label>

          <input
            value={quantitySold}
            onChange={(e) => setQuantitySold(e.target.value)}
            id="quantitySold"
            name="quantitySold"
            className="w-full px-5 py-2 text-gray-700 bg-gray-200 rounded"
          ></input>
        </div>
        <div className=" px-3 mb-6 md:mb-0 mx-auto">
          <label
            className="block tracking-wide text-grey-darker text-sm font-bold mb-2"
            htmlFor="inventory"
          >
            Inventory
          </label>

          <input
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            id="inventory"
            name="inventory"
            className="w-full px-5 py-2 text-gray-700 bg-gray-200 rounded"
          ></input>
        </div>
        <div className=" px-3 mb-6 md:mb-0 mx-auto">
          <label
            className="block tracking-wide text-grey-darker text-sm font-bold mb-2"
            htmlFor="status"
          >
            Status
          </label>

          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            id="status"
            name="status"
            className="w-full px-5 py-2 text-gray-700 bg-gray-200 rounded"
          ></input>
        </div>
        <div className=" px-3 mb-6 md:mb-0 mx-auto">
          <label
            className="block tracking-wide text-grey-darker text-sm font-bold mb-2"
            htmlFor="favorite"
          >
            Favorite
          </label>

          <input
            value={favorite}
            onChange={(e) => setFavorite(e.target.value)}
            id="favorite"
            name="favorite"
            className="w-full px-5 py-2 text-gray-700 bg-gray-200 rounded"
          ></input>
        </div>
        <div className=" px-3 mb-6 md:mb-0 mx-auto">
          <label
            className="block tracking-wide text-grey-darker text-sm font-bold mb-2"
            htmlFor="categoryId"
          >
            CategoryId
          </label>

          <input
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            id="categoryId"
            name="categoryId"
            className="w-full px-5 py-2 text-gray-700 bg-gray-200 rounded"
          ></input>
        </div>
        <div className=" px-3 mb-6 md:mb-0 mx-auto">
          <label
            className="block tracking-wide text-grey-darker text-sm font-bold mb-2"
            htmlFor="brandId"
          >
            BrandId
          </label>

          <input
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            id="brandId"
            name="brandId"
            className="w-full px-5 py-2 text-gray-700 bg-gray-200 rounded"
          ></input>
        </div>
        <div className=" px-3 mb-6 md:mb-0 mx-auto">
          <label
            className="block tracking-wide text-grey-darker text-sm font-bold mb-2"
            htmlFor="name"
          >
            Upload image
          </label>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: "100%",
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
        <div className="flex items-center justify-center w-full">
          <button
            // disabled={!name.length || !image.length}
            // onClick={handleAddBrand}
            className="mt-2 font-semibold rounded-xl leading-none text-white py-4 px-10 bg-blue-700 hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 focus:outline-none  disabled:bg-gray-400 disabled:cursor-no-drop"
          >
            {textButton}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormEditProductComponent;
