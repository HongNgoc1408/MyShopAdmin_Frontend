import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Divider,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { showError } from "../../services/commonService";
import ImportService from "../../services/ImportService";
import { HomeTwoTone } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import BreadcrumbLink from "../../components/BreadcrumbLink";

const breadcrumb = (id) => [
  {
    path: "/",
    title: <HomeTwoTone />,
  },
  {
    path: "/imports",
    title: "Phiếu nhập hàng",
  },
  {
    title: `Chi tiết phiếu nhập hàng #${id}`,
  },
];

const ImportDetail = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [note, setNote] = useState();
  const [importDetails, setImportDetails] = useState([]);

  const [entryDate, setEntryDate] = useState();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ImportService.getDetail(id);
        const dataWithKey = res.data.map((item, index) => ({
          ...item,
          key: item.productId || index,
        }));
        
        console.log(dataWithKey);

        setImportDetails(dataWithKey);
      } catch (error) {
        showError(error);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    const totalAmount = importDetails.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    setTotal(totalAmount);

    const updateRequest = {
      ImportProducts: importDetails.map((detail) => ({
        ProductId: detail.productId,
        ColorId: detail.colorId,
        SizeId: detail.sizeId,
        Quantity: detail.quantity,
        Price: detail.price,
      })),
      Note: note,
      Total: totalAmount,
      EntryDate: entryDate.format(),
    };

    try {
      await ImportService.update(id, updateRequest);
      notification.success({ message: "Thành công." });
      navigate("/imports");
    } catch (error) {
      showError(error);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <BreadcrumbLink breadcrumb={breadcrumb(id)} />

        <Form form={form} component={false}>
          <Form.Item label="Note" name="note" initialValue={note}>
            <Input.TextArea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Entry Date"
            name="entryDate"
            initialValue={entryDate}
          >
            <DatePicker
              showTime
              value={entryDate}
              onChange={(date) => setEntryDate(date)}
            />
          </Form.Item>

          <Form.Item label="Total" name="total">
            <InputNumber value={total} disabled placeholder={total} />
          </Form.Item>

          <Divider orientation="left">Product Details</Divider>
          {importDetails.map((item, index) => (
            <div key={item.id}>
              <h3>Product {index + 1}</h3>
              <Form.Item
                label="Mã SP"
                name={`productId-${index}`}
                initialValue={item.productId}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Tên sản phẩm"
                name={`productName-${index}`}
                initialValue={item.productName}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Color"
                name={`colorName-${index}`}
                initialValue={item.colorName}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Size"
                name={`sizeName-${index}`}
                initialValue={item.sizeName}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Quantity"
                name={`quantity-${index}`}
                initialValue={item.quantity}
              >
                <InputNumber
                  min={0}
                  value={item.quantity}
                  onChange={(value) => {
                    const updatedDetails = [...importDetails];
                    updatedDetails[index].quantity = value;
                    setImportDetails(updatedDetails);

                    // Recalculate total after updating quantity
                    const newTotal = updatedDetails.reduce(
                      (acc, item) => acc + item.quantity * item.price,
                      0
                    );
                    setTotal(newTotal);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Price"
                name={`price-${index}`}
                initialValue={item.price}
              >
                <InputNumber
                  min={0}
                  value={item.price}
                  onChange={(value) => {
                    const updatedDetails = [...importDetails];
                    updatedDetails[index].price = value;
                    setImportDetails(updatedDetails);

                    const newTotal = updatedDetails.reduce(
                      (acc, item) => acc + item.quantity * item.price,
                      0
                    );
                    setTotal(newTotal);
                  }}
                />
              </Form.Item>
              <Divider />
            </div>
          ))}

          <Button type="primary" onClick={handleSubmit}>
            Cập nhật
          </Button>
        </Form>
      </div>
    </>
  );
};

export default ImportDetail;
