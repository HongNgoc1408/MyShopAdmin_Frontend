import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Pagination,
  Table,
} from "antd";
import {
  formatDateTime,
  formatVND,
  showError,
} from "../../services/commonService";
import { Link } from "react-router-dom";
import { EyeTwoTone, HomeTwoTone, PlusOutlined } from "@ant-design/icons";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import ImportService from "../../services/ImportService";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
const breadcrumb = [
  {
    path: "/",
    title: <HomeTwoTone />,
  },
  {
    title: "Phiếu nhập hàng",
  },
];
const Imports = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [importDetails, setImportDetails] = useState([]);
  const [detail, setDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [total, setTotal] = useState(0);
  const [entryDates, setEntryDates] = useState([]);

  const columns = (openStockDetail) => [
    {
      title: "Mã",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      title: "Người nhập phiếu",
      dataIndex: "creator",
      render: (value) => <div className="truncate w-24 md:w-48">{value}</div>,
    },

    {
      title: "Ghi chú",
      dataIndex: "note",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      sorter: (a, b) => a.total - b.total,
      render: (value) => formatVND(value),
    },
    {
      title: "Ngày nhập hàng",
      dataIndex: "entryDate",
      sorter: (a, b) => new Date(a.entryDate) - new Date(b.entryDate),
      render: (value) => formatDateTime(value),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => formatDateTime(value),
    },
    {
      title: "Thực hiện",
      dataIndex: "id",
      render: (value, record) => (
        <Flex justify="center" align="center" className="space-x-1">
          <Button onClick={() => openStockDetail(value)}>
            <EyeTwoTone />
          </Button>
        </Flex>
      ),
    },
  ];

  const handleSearch = (key) => key && key !== search && setSearch(key);

  useEffect(() => {
    const fetchData = async () => {
      try {
        search ? setSearchLoading(true) : setIsLoading(true);
        const res = await ImportService.getAll(
          currentPage,
          currentPageSize,
          search
        );

        console.log("fetchData", res.data?.items);

        setData(res.data?.items);
        setTotalItems(res.data?.totalItems);
        // setEntryDates(res.data?.items.entryDate);
      } catch (error) {
        setSearch("");
      } finally {
        setIsLoading(false);
        setSearchLoading(false);
      }
    };
    fetchData();
  }, [currentPage, currentPageSize, search]);

  const openImportDetail = async (id) => {
    try {
      const res = await ImportService.getDetail(id);
      console.log("res.data", res.data);
      const item = data.find((item) => item.id === id);
      console.log("item", item);
      setDetail(item);
      setImportDetails(res.data);
      form.setFieldsValue({
        ...item,
        total: formatVND(item.total),
        entryDate: dayjs(item.entryDate),
      });
      setIsModalOpen(true);
    } catch (error) {
      showError(error);
    }
  };

  const handleOk = (id) => {
    handleSubmit(id);
    setIsOpenUpdate(false);
    setIsModalOpen(false);
    setDetail(null);
    setImportDetails([]);
  };

  const handleCancel = () => {
    setIsOpenUpdate(false);
    setIsModalOpen(false);
    setDetail(null);
    setImportDetails([]);
  };

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

      notification.success({ message: "Thành công.", placement: "top" });

      setIsModalOpen(false);
    } catch (error) {
      showError(error);
      setDetail(null);
      setImportDetails([]);
    }
  };

  return (
    <>
      <Modal
        title="Chi tiết phiếu nhập"
        open={isModalOpen}
        onOk={() => handleOk(detail.id)}
        onCancel={handleCancel}
        className="p-10"
        width={1200}
        centered
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {!isOpenUpdate ? (
              <Button onClick={() => setIsOpenUpdate(true)}>Cập nhật</Button>
            ) : (
              <>
                <CancelBtn />
                <OkBtn />
              </>
            )}
          </>
        )}
      >
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

                  <Form.Item
                    label="Tổng giá trị"
                    name="total"
                    className="w-full"
                  >
                    <Input value={formatVND(detail.total)} readOnly />
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

            <div className="w-full  space-y-2">
              {importDetails.map((item, index) => (
                <Card
                  key={index}
                  size="small"
                  title={`Nhập sản phẩm ${index + 1}`}
                  className="bg-blue-50 drop-shadow-md"
                >
                  <div className="flex justify-between space-x-4">
                    <Form.Item
                      label="Tên sản phẩm"
                      name={`items[${index}].productName`}
                      initialValue={item.productName}
                      className="w-1/2"
                    >
                      <Input value={item.productName} readOnly />
                    </Form.Item>

                    <Form.Item
                      label="Màu sắc"
                      name={`items[${index}].colorName`}
                      initialValue={item.colorName}
                      className=""
                    >
                      <Input value={item.colorName} readOnly />
                    </Form.Item>
                    <Form.Item
                      label="Kích cỡ"
                      name={`items[${index}].sizeName`}
                      initialValue={item.sizeName}
                    >
                      <Input value={item.sizeName} readOnly />
                    </Form.Item>

                    <>
                      <Form.Item
                        label="Số lượng"
                        name={`items[${index}].quantity`}
                        initialValue={item.quantity}
                      >
                        <InputNumber
                          min={1}
                          value={item.quantity}
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
                        label="Giá"
                        name={`price-${index}`}
                        initialValue={item.price}
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
                          value={item.price}
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
                    </>
                  </div>
                </Card>
              ))}
            </div>
          </Form>
        </Card>
      </Modal>
      <div className="space-y-4">
        <BreadcrumbLink breadcrumb={breadcrumb} />
        <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
          <div className="w-full flex justify-between items-center">
            <Input.Search
              loading={searchLoading}
              className="w-1/2"
              size="large"
              allowClear
              onSearch={(key) => handleSearch(key)}
              onChange={(e) => e.target.value === "" && setSearch("")}
              placeholder="Nhập mã phiếu nhập cần tìm"
            />
            <Link to="/add-imports">
              <Button size="large" type="primary">
                <PlusOutlined /> Thêm phiếu nhập
              </Button>
            </Link>
          </div>
          <Table
            pagination={false}
            showSorterTooltip={false}
            loading={isLoading}
            columns={columns(openImportDetail)}
            dataSource={data}
            rowKey={(record) => record.id}
            className="overflow-x-auto"
          />
          <Pagination
            align="end"
            hideOnSinglePage
            showSizeChanger
            defaultCurrent={currentPage}
            defaultPageSize={currentPageSize}
            total={totalItems}
            onChange={(newPage, newPageSize) => {
              setCurrentPage(newPage);
              setCurrentPageSize(newPageSize);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Imports;
