import { useEffect, useState } from "react";
import {
  Button,
  Card,
  ConfigProvider,
  Form,
  Image,
  Input,
  InputNumber,
  Select,
  Spin,
  Switch,
  Upload,
  App,
  Flex,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  CheckOutlined,
  CloseOutlined,
  HomeTwoTone,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  getBase64,
  showError,
  toTextLabel,
} from "../../services/commonService";
import { Link } from "react-router-dom";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import ProductService from "../../services/ProductService";

const breadcrumb = [
  {
    path: "/",
    title: <HomeTwoTone />,
  },
  {
    path: "/products",
    title: "Sản phẩm",
  },
  {
    title: "Thêm mới",
  },
];

export default function AddProduct() {
  const { message } = App.useApp();

  const [form] = Form.useForm();
  const [productAttributes, setProductAttributes] = useState({});

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [sizeList, setSizeList] = useState([]);
  const [sizeListValue, setSizeListValue] = useState([]);

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [update, setUpdate] = useState(false);

  const [colorImages, setColorImages] = useState([]);
  const colors = Form.useWatch("colors", form) || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await ProductService.fetchProductAttributes();
        Object.keys(data).forEach(
          (key) => (data[key] = toTextLabel(data[key]))
        );
        setProductAttributes(data);
      } catch (error) {
        message.error(showError(error));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [message]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChangeFile = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleChangeColorFile = ({ fileList: newFileList }, key) => {
    const colors = [...colorImages];
    colors[key] = newFileList[0];
    setColorImages(colors);
  };

  const handleSelectSize = (listSizeId, valueLabelObj) => {
    setSizeList(
      valueLabelObj.map((item) => ({ sizeId: item.value, label: item.label }))
    );

    const newList = colors.map((color) => {
      const sizeInStocks = listSizeId.map((sizeId) => {
        const exist = sizeListValue
          ?.find((e) => e.colorName === color?.colorName)
          ?.sizeInStocks?.find((e) => e.sizeId === sizeId);

        if (exist) {
          return { ...exist };
        } else return { sizeId: sizeId };
      });
      return { colorName: color.colorName, sizeInStocks: sizeInStocks };
    });

    setSizeListValue(newList);
  };

  // const handleSetSizeValue = (obj, index) => {
  //   const newList = [...sizeListValue];
  //   const sizeInStocks = newList[index].sizeInStocks.find(
  //     (e) => e.sizeId === obj.sizeId
  //   );

  //   if (sizeInStocks) sizeInStocks.inStock = obj.inStock;

  //   setSizeListValue(newList);
  // };

  const onChangeColor = (value, index) => {
    if (sizeList.length > 0) {
      const newList = [...sizeListValue];
      if (newList[index]?.colorName) {
        newList[index].colorName = value;
      } else {
        newList[index] = {};
        newList[index].colorName = value;

        sizeList.forEach((item) => {
          if (!newList[index]?.sizeInStocks) newList[index].sizeInStocks = [];
          if (
            !newList[index]?.sizeInStocks?.some((e) => e.sizeId === item.sizeId)
          ) {
            newList[index].sizeInStocks.push({ sizeId: item.sizeId });
          }
        });
      }
      setSizeListValue(newList);
    }
  };

  const handleRemoveColor = (index, key) => {
    const newImages = [...colorImages];
    newImages[key] = null;
    setColorImages(newImages);

    if (colors.length === 1) {
      setSizeList([]);
      form.setFieldValue("sizes", []);
    }
    const newList = [...sizeListValue];
    setSizeListValue(newList.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    form.resetFields();
    setSizeList([]);
    setSizeListValue([]);
    setFileList([]);
    setColorImages([]);
    setUpdate(false);
  };

  const createProduct = async (values) => {
    try {
      setSaveLoading(true);

      const formData = new FormData();
      fileList.forEach((item) => formData.append("images", item.originFileObj));

      const data = {
        ...values,
        enable: values.enable ?? true,
        description: values.description ?? "",
        guideSize: values.guideSize ?? "",
        care: values.care ?? "",
        discount: values.discount ?? 0,
      };
      delete data.images;
      delete data.sizes;

      sizeListValue.forEach((color, index) => {
        formData.append(`colorSizes[${index}].colorName`, color.colorName);
        formData.append(
          `colorSizes[${index}].image`,
          colors[index]?.image[0]?.originFileObj
        );

        color.sizeInStocks.forEach((size, sizeIndex) => {
          formData.append(
            `colorSizes[${index}].sizeInStocks[${sizeIndex}].sizeId`,
            size.sizeId
          );

          // formData.append(
          //   `colorSizes[${index}].sizeInStocks[${sizeIndex}].inStock`,
          //   size.inStock
          // );
        });
      });
      delete data.colors;

      Object.keys(data).forEach((key) => formData.append(key, data[key]));
      try {
        await ProductService.add(formData);
        handleClear();
        message.success("Thành công");
      } catch (error) {
        message.error(showError(error));
      } finally {
        setSaveLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <BreadcrumbLink breadcrumb={breadcrumb} />
        <Form
          form={form}
          disabled={saveLoading}
          onValuesChange={() => setUpdate(true)}
          onFinish={createProduct}
          layout="vertical"
          className="grid gap-3 grid-cols-1 md:grid-cols-2"
        >
          <Card className="drop-shadow h-fit">
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input
                count={{
                  show: true,
                  max: 50,
                }}
                maxLength={50}
                size="large"
                placeholder="Quần áo ..."
              />
            </Form.Item>
            <div className="grid gap-2 md:grid-cols-3">
              <Form.Item
                label="Thương hiệu"
                name="BrandId"
                rules={[
                  { required: true, message: "Vui lòng chọn thương hiệu" },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  loading={loading}
                  className="w-full"
                  size="large"
                  placeholder="Chọn"
                  options={productAttributes.brands}
                />
              </Form.Item>
              <Form.Item
                label="Danh mục"
                name="CategoryId"
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select
                  loading={loading}
                  className="w-full"
                  size="large"
                  showSearch
                  optionFilterProp="label"
                  placeholder="Chọn"
                  options={productAttributes.categories}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              >
                <InputNumber
                  min={0}
                  size="large"
                  className="w-full col-span-2"
                  formatter={(value) =>
                    value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Price..."
                />
              </Form.Item>
              <Form.Item label="Phần trăm giảm giá" name="discount">
                <InputNumber
                  size="large"
                  min={0}
                  max={100}
                  className="w-full"
                  formatter={(value) => `${value}%`}
                  parser={(value) => value?.replace("%", "")}
                  placeholder="5, 10,..."
                />
              </Form.Item>
            </div>

            <Form.Item label="Mô tả sản phẩm" name="description">
              <TextArea
                id="description"
                rows={6}
                count={{ show: true, max: 500 }}
                placeholder="Áo đẹp..."
                maxLength={500}
              />
            </Form.Item>
            <Form.Item label="Hướng dẫn chọn size" name="guideSize">
              <TextArea
                id="guideSize"
                autoSize={{ minRows: 6 }}
                count={{ show: true, max: 500 }}
                placeholder="Hướng dẫn chọn size ..."
                maxLength={500}
              />
            </Form.Item>
            <Form.Item label="Hướng dẫn bảo quản và sử dụng" name="care">
              <TextArea
                id="care"
                autoSize={{ minRows: 6 }}
                count={{ show: true, max: 500 }}
                placeholder="Không sử dụng ..."
                maxLength={500}
              />
            </Form.Item>
          </Card>
          <Card className="drop-shadow h-fit">
            <Form.Item
              label="Hình ảnh chung"
              name="images"
              rules={[{ required: true, message: "Tối thiểu 1 ảnh" }]}
              getValueFromEvent={(e) => e.fileList}
            >
              <Upload
                maxCount={5}
                beforeUpload={() => false}
                listType="picture-card"
                fileList={fileList}
                accept="image/png, image/gif, image/jpeg, image/svg"
                multiple
                onPreview={handlePreview}
                onChange={handleChangeFile}
              >
                {fileList.length >= 5 ? null : (
                  <button type="button">
                    <PlusOutlined />
                    <div>Tải lên</div>
                  </button>
                )}
              </Upload>
            </Form.Item>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}

            <Form.List
              name="colors"
              rules={[
                {
                  validator: async (_, colors) => {
                    if (!colors || colors.length < 1) {
                      return Promise.reject(
                        new Error("Vui lòng thêm ít nhất 1 màu")
                      );
                    } else {
                      const colorValues = colors
                        .map((item) => item?.colorName?.toLowerCase())
                        .filter((value) => value !== undefined);

                      if (new Set(colorValues).size !== colorValues.length) {
                        return Promise.reject(
                          new Error("Các màu không được trùng nhau")
                        );
                      }
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => {
                    const file = colorImages[key] ? [colorImages[key]] : [];
                    return (
                      <div key={key} className="grid grid-cols-2 gap-2">
                        <Flex align="baseline" gap={10}>
                          <Form.Item
                            {...restField}
                            name={[name, "colorName"]}
                            rules={[
                              { required: true, message: "Vui lòng nhập màu" },
                            ]}
                          >
                            <Input
                              className="w-full"
                              onChange={(e) =>
                                onChangeColor(e.target.value, index)
                              }
                              size="large"
                              placeholder="Đen, Trắng,..."
                            />
                          </Form.Item>
                          <MinusCircleOutlined
                            className="inline-flex"
                            onClick={() => {
                              remove(name);
                              handleRemoveColor(index, key);
                            }}
                          />
                        </Flex>
                        <Form.Item
                          name={[name, "image"]}
                          rules={[
                            { required: true, message: "Vui lòng chọn ảnh" },
                          ]}
                          getValueFromEvent={(e) => e.fileList}
                        >
                          <Upload
                            maxCount={1}
                            beforeUpload={() => false}
                            listType="text"
                            fileList={file}
                            accept="image/png, image/gif, image/jpeg, image/svg"
                            onPreview={handlePreview}
                            onChange={(e) => handleChangeColorFile(e, key)}
                          >
                            {colorImages[key] ? null : (
                              <Button type="link">
                                <PlusOutlined />
                                <span>Tải ảnh lên</span>
                              </Button>
                            )}
                          </Upload>
                        </Form.Item>
                      </div>
                    );
                  })}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm màu
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item
              label="Size"
              name="sizes"
              rules={[{ required: true, message: "Vui lòng chọn size" }]}
              className="space-y-2"
            >
              <Select
                className="w-full"
                size="large"
                showSearch
                optionFilterProp="label"
                placeholder="Thêm size"
                onChange={handleSelectSize}
                options={productAttributes.sizes}
                autoClearSearchValue
                mode="multiple"
                disabled={
                  colors.length <= 0 ||
                  colors.some(
                    (color) => color === undefined || !color?.colorName
                  )
                }
              />
            </Form.Item>
            <div className="grid grid-cols-2 gap-2">
              {sizeList.map((size, i) => (
                <Form.Item label={size.label} key={i} className="mb-2" hidden>
                  {colors.map((color, j) => {
                    if (color && color.colorName !== "") {
                      return (
                        <Flex key={j} align="center" gap={8} className="mb-2">
                          <div className="w-24 truncate border rounded-md px-2 py-1 text-center">
                            {color?.colorName}
                          </div>
                          {/* <InputNumber
                            required
                            min={0}
                            className="w-full"
                            value={
                              sizeListValue
                                .find((e) => e.colorName === color?.colorName)
                                ?.sizeInStocks?.find(
                                  (e) => e.sizeId === size.sizeId
                                )?.inStock
                            }
                            onChange={(value) =>
                              handleSetSizeValue(
                                {
                                  sizeId: size.sizeId,
                                  colorName: color.colorName,
                                  inStock: value,
                                },
                                j
                              )
                            }
                            placeholder="Số lượng kho..."
                          /> */}
                        </Flex>
                      );
                    }
                    return null;
                  })}
                </Form.Item>
              ))}
            </div>
            <Form.Item
              label="Kích hoạt sản phẩm"
              className="mt-2"
              name="enable"
              valuePropName="checked"
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
                className="bg-gray-500"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button
                disabled={!update || saveLoading}
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
              >
                {saveLoading ? <Spin /> : "Thêm"}
              </Button>

              <Button
                disabled={!update || saveLoading}
                onClick={handleClear}
                className="w-full"
                size="large"
              >
                Làm mới
              </Button>

              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      colorPrimaryHover: "rgb(156, 163, 175)",
                    },
                  },
                }}
              >
                <Link to={-1}>
                  <Button
                    type="primary"
                    className="w-full bg-gray-500"
                    size="large"
                  >
                    Trở về
                  </Button>
                </Link>
              </ConfigProvider>
            </div>
          </Card>
        </Form>
      </div>
    </>
  );
}
