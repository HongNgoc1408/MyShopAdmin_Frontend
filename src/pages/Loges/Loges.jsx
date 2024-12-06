import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Table,
} from "antd";
import {
  formatDateTime,
  formatVND,
  showError,
} from "../../services/commonService";
import { EyeTwoTone, HomeTwoTone } from "@ant-design/icons";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import LogesService from "../../services/LogesService";

const Loges = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [logDetails, setLogDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const breadcrumb = [
    {
      path: "/",
      title: <HomeTwoTone />,
    },
    {
      title: "Lịch sử phiếu nhập hàng",
    },
  ];

  const columns = (openStockDetail) => [
    {
      title: "Mã phiếu nhập",
      dataIndex: "importId",
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
        const res = await LogesService.getAll(
          currentPage,
          currentPageSize,
          search
        );

        // console.log("fetchData1", res.data?.items);

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

  const openLogDetail = async (id) => {
    try {
      const res = await LogesService.getDetail(id);

      //   console.log(res.data);

      setLogDetails(res.data);

      setIsModalOpen(true);
    } catch (error) {
      showError(error);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setLogDetails([]);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setLogDetails([]);
  };

  return (
    <>
      <Modal
        title="Chi tiết phiếu nhập"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        centered
      >
        {logDetails.map((item, index) => (
          <Card
            key={item.id}
            size="small"
            title={`Nhập sản phẩm ${index + 1}`}
            className="bg-blue-50 drop-shadow h-fit mb-4"
          >
            <Form layout="vertical" form={form}>
              <div className="flex space-x-2">
                <Form.Item label="Tên sản phẩm" className="w-full">
                  <Input
                    className="capitalize"
                    value={item.productName}
                    readOnly
                  />
                </Form.Item>
                <Form.Item label="Màu sắc" className="w-1/4">
                  <Input value={item.colorName} readOnly />
                </Form.Item>
                <Form.Item label="Kích cỡ" className="w-1/4">
                  <Input value={item.sizeName} readOnly />
                </Form.Item>
                <Form.Item label="Số lượng" className="w-1/4">
                  <InputNumber
                    value={item.quantity}
                    readOnly
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item label="Giá" className="w-1/4">
                  <InputNumber value={item.price} readOnly className="w-full" />
                </Form.Item>
              </div>
            </Form>
          </Card>
        ))}
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
          </div>
          <Table
            pagination={false}
            showSorterTooltip={false}
            loading={isLoading}
            columns={columns(openLogDetail)}
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

export default Loges;
