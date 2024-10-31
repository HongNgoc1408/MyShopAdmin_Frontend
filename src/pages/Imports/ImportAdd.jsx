import {
  Button,
  Card,
  DatePicker,
  Input,
  notification,
  Select,
  Form,
} from "antd";
import React, { useEffect, useState } from "react";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import { CloseOutlined, HomeTwoTone } from "@ant-design/icons";
import ImportService from "../../services/ImportService";
import { showError } from "../../services/commonService";
import TextArea from "antd/es/input/TextArea";
import ProductService from "../../services/ProductService";

const breadcrumb = [
  { path: "/", title: <HomeTwoTone /> },
  { path: "/imports", title: "Phiếu nhập hàng" },
  { title: "Thêm phiếu nhập" },
];

const ImportAdd = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [colorNames, setColorNames] = useState([]);
  const [sizeNames, setSizeNames] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productResponse = await ProductService.getName();
        setProductOptions(productResponse.data);
      } catch (error) {
        showError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProductChange = async (productId) => {
    try {
      const colors = await ProductService.getColorById(productId);
      setColorNames(colors.data);
      setSizeNames([]); // Reset kích cỡ khi chọn sản phẩm mới
    } catch (error) {
      showError(error);
    }
  };

  const handleColorChange = async (colorId) => {
    try {
      const sizes = await ProductService.getSizeById(colorId);
      setSizeNames(sizes.data);
    } catch (error) {
      showError(error);
    }
  };

  const handleAdd = async (values) => {
    const importData = {
      entryDate: values.entryDate ? values.entryDate.format("YYYY-MM-DD") : "",
      note: values.note || "",
      total: values.total,
      importProducts: values.items.map((item) => ({
        productId: item.productName,
        quantity: item.quantity || 0,
        price: item.price || 0,
        colorId: item.colorName,
        sizeId: item.sizeName,
      })),
    };

    try {
      //   console.log(importData);
      await ImportService.add(importData);
      form.resetFields();
      notification.success({ message: "Thành công." });
    } catch (error) {
      showError(error);
    }
  };

  const onValuesChange = (_, allValues) => {
    const total = (allValues.items || []).reduce((sum, item) => {
      const itemTotal =
        item?.quantity && item?.price ? item.quantity * item.price : 0;
      return sum + itemTotal;
    }, 0);
    form.setFieldsValue({ total });
  };

  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb} />
      <Card className="drop-shadow h-fit">
        <Form
          onValuesChange={onValuesChange}
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          initialValues={{
            items: [
              {
                productName: undefined,
                quantity: 1,
                price: 0,
                colorName: undefined,
                sizeName: undefined,
              },
            ],
          }}
        >
          <div className="flex justify-between space-x-4">
            <div className="w-1/2">
              <div className="flex gap-5">
                <Form.Item
                  label="Ngày nhập"
                  name="entryDate"
                  rules={[
                    {
                      required: true,
                      message: "Ngày nhập hàng không được để trống",
                    },
                  ]}
                  className="w-full"
                >
                  <DatePicker
                    placeholder="Ngày lập phiếu"
                    disabledDate={(current) =>
                      current && current.valueOf() > Date.now()
                    }
                  />
                </Form.Item>
                <Form.Item label="Tổng giá trị" name="total" className="w-full">
                  <Input disabled />
                </Form.Item>
              </div>

              <Form.Item label="Ghi chú" name="note">
                <TextArea
                  showCount
                  maxLength={200}
                  placeholder="...."
                  style={{ height: 70, resize: "none" }}
                />
              </Form.Item>
            </div>
            <div className="w-1/2">
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <div
                    style={{
                      display: "flex",
                      rowGap: 16,
                      flexDirection: "column",
                    }}
                  >
                    {fields.map((field) => (
                      <Card
                        key={field.key}
                        size="small"
                        title={`Nhập sản phẩm ${field.name + 1}`}
                        className="bg-gray-50 drop-shadow-md"
                        extra={
                          <CloseOutlined onClick={() => remove(field.name)} />
                        }
                      >
                        <Form.Item
                          label="Tên sản phẩm"
                          name={[field.name, "productName"]}
                          rules={[
                            {
                              required: true,
                              message: "Tên sản phẩm không để trống",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn sản phẩm"
                            onChange={(value) => handleProductChange(value)}
                          >
                            {productOptions.map((product) => (
                              <Select.Option
                                key={product.id}
                                value={product.id}
                              >
                                {product.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <div className="flex gap-5">
                          <Form.Item
                            label="Màu sắc"
                            name={[field.name, "colorName"]}
                            rules={[
                              {
                                required: true,
                                message: "Màu sắc không để trống",
                              },
                            ]}
                            className="w-1/2"
                          >
                            <Select
                              placeholder="Chọn màu sắc"
                              onChange={(value) => handleColorChange(value)}
                            >
                              {colorNames.map((color) => (
                                <Select.Option key={color.id} value={color.id}>
                                  {color.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            label="Kích cỡ"
                            name={[field.name, "sizeName"]}
                            rules={[
                              {
                                required: true,
                                message: "Kích cỡ không để trống",
                              },
                            ]}
                            className="w-1/2"
                          >
                            <Select placeholder="Chọn kích cỡ">
                              {sizeNames.map((size) => (
                                <Select.Option key={size.id} value={size.id}>
                                  {size.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>

                        <div className="flex gap-5">
                          <Form.Item
                            label="Số lượng"
                            name={[field.name, "quantity"]}
                            rules={[
                              {
                                required: true,
                                message: "Số lượng không để trống",
                              },
                            ]}
                            className="w-1/2"
                          >
                            <Input
                              type="number"
                              min={1}
                              placeholder="Nhập số lượng"
                            />
                          </Form.Item>
                          <Form.Item
                            label="Giá"
                            name={[field.name, "price"]}
                            rules={[
                              { required: true, message: "Giá không để trống" },
                            ]}
                            className="w-1/2"
                          >
                            <Input
                              type="number"
                              min={0}
                              placeholder="Nhập giá"
                            />
                          </Form.Item>
                        </div>
                      </Card>
                    ))}
                    <div className="flex justify-between space-x-3">
                      <Button
                        size="large"
                        type="dashed"
                        onClick={() => add()}
                        block
                      >
                        + Thêm phiếu nhập
                      </Button>
                      <Button
                        type="primary"
                        danger
                        size="large"
                        htmlType="submit"
                      >
                        Lưu
                      </Button>
                    </div>
                  </div>
                )}
              </Form.List>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ImportAdd;
