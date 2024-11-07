import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Modal,
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

const Imports = () => {
  // const form = Form.useForm();
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

  const breadcrumb = [
    {
      path: "/",
      title: <HomeTwoTone />,
    },
    {
      title: "Phiếu nhập hàng",
    },
  ];

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
      title: "Ngày nhập hàng",
      dataIndex: "entryDate",
      sorter: (a, b) => new Date(a.entryDate) - new Date(b.entryDate),
      render: (value) => formatDateTime(value),
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

        // console.log("fetchData", res.data?.items);

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

  const openImportDetail = async (id) => {
    
    try {
      const res = await ImportService.getDetail(id);

      const detail = data.find((item) => item.id === id);

      console.log(detail);
      setDetail(detail);
      setImportDetails(res.data);
      
      setIsModalOpen(true);
    } catch (error) {
      showError(error);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setDetail(null);
    setImportDetails([]);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDetail(null);
    setImportDetails([]);
  };

  return (
    <>
      <Modal
        title="Chi tiết phiếu nhập"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="p-10"
        width={900}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button>Cập nhật</Button>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Card className="drop-shadow h-fit">
          <Form layout="vertical">
            <div className="flex justify-between space-x-4">
              <div className="w-1/2">
                {detail ? (
                  <>
                    <Form.Item
                      label="Ngày nhập"
                      name="entryDate"
                      initialValue={formatDateTime(detail.entryDate)}
                    >
                      <Input value={formatDateTime(detail.entryDate)} />
                    </Form.Item>
                    <Form.Item
                      label="Tổng giá trị"
                      name="total"
                      initialValue={formatVND(detail.total)}
                    >
                      <Input value={formatVND(detail.total)} disabled />
                    </Form.Item>
                    <Form.Item
                      label="Ghi chú"
                      name="note"
                      initialValue={detail.note}
                    >
                      <TextArea
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

              <div className="w-1/2">
                {importDetails.map((item, index) => (
                  <Card
                    key={index}
                    size="small"
                    title={`Nhập sản phẩm ${index + 1}`}
                    className="bg-gray-50 drop-shadow-md"
                  >
                    <Form.Item
                      label="Tên sản phẩm"
                      name={`items[${index}].productName`}
                      initialValue={item.productName}
                    >
                      <Input value={item.productName} disabled />
                    </Form.Item>
                    <div className="flex gap-5">
                      <Form.Item
                        label="Màu sắc"
                        name={`items[${index}].colorName`}
                        initialValue={item.colorName}
                      >
                        <Input value={item.colorName} disabled />
                      </Form.Item>
                      <Form.Item
                        label="Kích cỡ"
                        name={`items[${index}].sizeName`}
                        initialValue={item.sizeName}
                      >
                        <Input value={item.sizeName} disabled />
                      </Form.Item>
                    </div>
                    <div className="flex gap-5">
                      <Form.Item
                        label="Số lượng"
                        name={`items[${index}].quantity`}
                        initialValue={item.quantity}
                      >
                        <Input value={item.quantity} />
                      </Form.Item>
                      <Form.Item
                        label="Giá"
                        name={`items[${index}].price`}
                        initialValue={item.price}
                      >
                        <Input value={item.price} />
                      </Form.Item>
                    </div>
                  </Card>
                ))}
              </div>
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
              placeholder="Tìm kiếm"
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
