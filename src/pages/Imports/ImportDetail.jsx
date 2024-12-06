import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  InputNumber,
  notification,
  Spin,
} from "antd";
import ImportService from "../../services/ImportService";
import { HomeTwoTone } from "@ant-design/icons";
import {
  formatVND,
  isEmptyObject,
  showError,
} from "../../services/commonService";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import { Link, useParams } from "react-router-dom";

const breadcrumb = (id) => [
  {
    path: "/",
    title: <HomeTwoTone />,
  },
  {
    path: "/imports",
    title: "Phiếu nhập",
  },
  {
    title: `Chi tiết phiếu nhập #${id}`,
  },
];
const ImportDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [importDetails, setImportDetails] = useState([]);
  const [detail, setDetail] = useState(null);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        search ? setSearchLoading(true) : setIsLoading(true);
        const res = await ImportService.getAll(
          currentPage,
          currentPageSize,
          search
        );

        setData(res.data?.items);
        setTotalItems(res.data?.totalItems);
      } catch (error) {
        setSearch("");
      } finally {
        setIsLoading(false);
        setSearchLoading(false);
      }
    };
    fetchData();
  }, [currentPage, currentPageSize, search]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await ImportService.getDetail(id);

          const item = data.find((item) => item.id === parseInt(id));

          setDetail(item);
          //   console.log(item);

          setImportDetails(res.data);

          form.setFieldsValue({
            ...item,
            total: formatVND(item?.total),
            entryDate: dayjs(item?.entryDate),
            items: importDetails.map((item) => ({
              productName: item.productName,
              colorName: item.colorName,
              sizeName: item.sizeName,
              quantity: item.quantity,
              price: item.price,
            })),
          });
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [id, data]);

  const handleSubmit = async (id) => {
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
      Note: form.getFieldValue("note"),
      Total: totalAmount,
      EntryDate: form.getFieldValue("entryDate").format(),
    };

    try {
      await ImportService.update(id, updateRequest);

      const updatedData = data.map((item) =>
        item.id === id
          ? {
              ...item,
              note: form.getFieldValue("note"),
              total: totalAmount,
            }
          : item
      );

      setData(updatedData);
      setDetail({
        ...updateRequest,
        Note: form.getFieldValue("note"),
        Total: totalAmount,
        EntryDate: form.getFieldValue("entryDate").format(),
      });

      setImportDetails(
        importDetails.map((detail) => ({
          ProductId: detail.productId,
          ColorId: detail.colorId,
          SizeId: detail.sizeId,
          Quantity: detail.quantity,
          Price: detail.price,
        }))
      );
      notification.success({ message: "Thành công.", placement: "top" });
      setIsOpenUpdate(false);
    } catch (error) {
      showError(error);
    }
  };

  const handleOk = () => {
    handleSubmit(detail.id);
    setIsOpenUpdate(false);
    setDetail(null);
    setImportDetails([]);
  };

  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb(id)} />
      <Card className="drop-shadow h-fit">
        <Form layout="vertical" form={form}>
          <div className="flex space-x-4">
            {detail ? (
              <>
                <Form.Item
                  label="Ngày nhập"
                  name="entryDate"
                  getValueProps={(value) => ({
                    value: value && dayjs(Number(value)),
                  })}
                  normalize={(value) => value && `${dayjs(value).valueOf()}`}
                  className="w-1/2"
                >
                  <DatePicker disabled={!isOpenUpdate} />
                </Form.Item>

                <Form.Item label="Tổng giá trị" name="total" className="w-full">
                  {detail ? (
                    <Input value={formatVND(detail.total)} readOnly />
                  ) : (
                    <Spin />
                  )}
                </Form.Item>
                <Form.Item
                  label="Ghi chú"
                  name="note"
                  className="w-full justify-end"
                >
                  <TextArea
                    disabled={!isOpenUpdate}
                    value={data.note}
                    showCount
                    maxLength={200}
                    style={{ height: 70, resize: "none" }}
                  />
                </Form.Item>
              </>
            ) : (
              <></>
            )}
          </div>
          <Form.List
            name="items"
            initialValue={importDetails.map((item) => ({
              productName: item.productName,
              colorName: item.colorName,
              sizeName: item.sizeName,
              quantity: item.quantity,
              price: item.price,
            }))}
            onChange={(value) => {
              setImportDetails(value);
              const newTotal = value.reduce(
                (acc, item) => acc + item.quantity * item.price,
                0
              );
              form.setFieldValue("total", formatVND(newTotal));
              setTotal(newTotal);
            }}
          >
            {(fields, { add, remove }) => (
              <div className="w-full space-y-2">
                {fields.map(({ key, name, ...restField }, index) => (
                  <Card
                    key={key}
                    size="small"
                    title={`Sản phẩm ${name + 1}`}
                    className="bg-blue-50 drop-shadow-md"
                  >
                    <div className="flex justify-between space-x-4">
                      <Form.Item
                        {...restField}
                        label="Tên sản phẩm"
                        name={[name, "productName"]}
                        className="w-1/2"
                      >
                        <Input readOnly />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        label="Màu sắc"
                        name={[name, "colorName"]}
                      >
                        <Input readOnly />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        label="Kích cỡ"
                        name={[name, "sizeName"]}
                      >
                        <Input readOnly />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        label="Số lượng"
                        name={[name, "quantity"]}
                      >
                        <InputNumber
                          min={1}
                          onChange={(value) => {
                            const updatedDetails = [...importDetails];
                            updatedDetails[index].quantity = value;
                            setImportDetails(updatedDetails);

                            const newTotal = updatedDetails.reduce(
                              (acc, item) => acc + item.quantity * item.price,
                              0
                            );
                            form.setFieldValue("total", formatVND(newTotal));
                            setTotal(newTotal);
                          }}
                          disabled={!isOpenUpdate}
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        label="Giá"
                        name={[name, "price"]}
                      >
                        <InputNumber
                          className="w-full"
                          formatter={(value) =>
                            value
                              ? `${new Intl.NumberFormat("vi-VN").format(
                                  value
                                )}`
                              : ""
                          }
                          parser={(value) =>
                            value ? value.replace(/\D/g, "") : ""
                          }
                          min={1000}
                          onChange={(value) => {
                            const updatedDetails = [...importDetails];
                            updatedDetails[index].price = value;
                            setImportDetails(updatedDetails);

                            const newTotal = updatedDetails.reduce(
                              (acc, item) => acc + item.quantity * item.price,
                              0
                            );
                            form.setFieldValue("total", formatVND(newTotal));
                            setTotal(newTotal);
                          }}
                          disabled={!isOpenUpdate}
                        />
                      </Form.Item>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Form.List>
        </Form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
          <Button
            hidden={isOpenUpdate}
            type="primary"
            htmlType="submit"
            className="w-full"
            size="large"
            onClick={() => setIsOpenUpdate(true)}
          >
            Cập nhật
          </Button>
          <Button
            hidden={!isOpenUpdate}
            disabled={isEmptyObject(importDetails) || updateLoading}
            type="primary"
            htmlType="submit"
            className="w-full"
            size="large"
            onClick={handleOk}
          >
            {updateLoading ? <Spin /> : "Cập nhật"}
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
    </div>
  );
};

export default ImportDetail;
