import React, { useEffect, useState } from "react";
import { Button, Divider, Input, Modal, Pagination, Table } from "antd";
import {
  formatDateTime,
  formatVND,
  showError,
} from "../../services/commonService";
import { Link } from "react-router-dom";
import { EyeTwoTone, HomeTwoTone, PlusOutlined } from "@ant-design/icons";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import ImportService from "../../services/ImportService";

const Imports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [stockDetails, setStockDetails] = useState();
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
      title: "Ngày tạo phiếu",
      dataIndex: "createAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
        <Button onClick={() => openStockDetail(value)}>
          <EyeTwoTone />
        </Button>
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

  const openStockDetail = async (id) => {
    setIsModalOpen(true);
    try {
      //   setOrderLoading(true)
      const res = await ImportService.getDetail(id);

      console.log("std", res.data);
      setStockDetails(res.data);
    } catch (error) {
      showError(error);
    } finally {
      //   setOrderLoading(false)
    }
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columnDetails = [
    {
      title: "Mã SP",
      dataIndex: "productId",
      width: "10%",
      // ...getColumnSearchProps("name"),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
    },
    {
      title: "colorName",
      dataIndex: "colorName",
    },
    {
      title: "sizeName",
      dataIndex: "sizeName",
    },
    {
      title: "quantity",
      dataIndex: "quantity",
    },
    {
      title: "price",
      dataIndex: "price",
    },
  ];

  return (
    <>
      <Modal
        title="Chi tiết phiếu nhập"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="p-10"
        width={900}
        footer={(_, { OkBtn }) => (
          <>
            <OkBtn />
          </>
        )}
      >
        <Divider />
        <Table
          itemLayout="vertical"
          columns={columnDetails}
          dataSource={stockDetails}
        />

        <Divider />
        {/* <div className="text-right text-lg">
          Tổng giá trị phiếu nhập:
          <span className="font-serif text-3xl text-red-700 px-4">
            {formatVND(
              stockDetails.reduce((acc, item) => acc + item.quantity * item.originPrice, 0),
            )}
          </span>
        </div> */}
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
            columns={columns(openStockDetail)}
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
