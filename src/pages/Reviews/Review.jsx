import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Image,
  notification,
  Pagination,
  Popconfirm,
  Rate,
  Select,
  Table,
} from "antd";
import {
  formatDateTime,
  showError,
  toImageLink,
} from "../../services/commonService";
import { useSearchParams } from "react-router-dom";
import { DeleteTwoTone, HomeTwoTone } from "@ant-design/icons";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import ProductService from "../../services/ProductService";
const breadcrumb = [
  {
    path: "/",
    title: <HomeTwoTone />,
  },
  {
    title: "Sản phẩm",
  },
];

const Reviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [review, setReview] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") ?? 1);
  const [currentPageSize, setCurrentPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (currentPage - 1) * currentPageSize + index + 1,
    },
    {
      title: "Hình ảnh",
      dataIndex: "imagesUrls",
      render: (url) => (
        <Image style={{ maxWidth: 100, minWidth: 50 }} src={toImageLink(url)} />
      ),
    },
    {
      title: "Tên người đánh giá",
      dataIndex: "username",
    },
    {
      title: "Màu sắc",
      dataIndex: "colorName",
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizeName",
    },
    {
      title: "Đánh giá ",
      dataIndex: "star",
      render: (star) => (
        <>
          <Rate disabled defaultValue={star} />
        </>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (createdAt) => formatDateTime(createdAt),
    },
    {
      title: "Thực hiện",
      align: "center",
      render: (_, record) => (
        <Flex justify="center" align="center" className="space-x-1">
          <Popconfirm
            title={`Xác nhận xóa ${record.name}`}
            onConfirm={() => handleDelete(record.id)}
            loading={loadingDelete}
          >
            <Button>
              <DeleteTwoTone />
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        search ? setSearchLoading(true) : setIsLoading(true);
        const res = await ProductService.getAll(
          currentPage,
          currentPageSize,
          search
        );

        // console.log(res.data?.items);

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
    if (selectedProductId) {
      const fetchReview = async () => {
        try {
          search ? setSearchLoading(true) : setIsLoading(true);
          const res = await ProductService.getReview(
            selectedProductId,
            currentPage,
            currentPageSize,
            search
          );

          // console.log(res.data?.items);

          setReview(res.data?.items);
          setTotalItems(res.data?.totalItems);
        } catch (error) {
          setSearch("");
        } finally {
          setIsLoading(false);
          setSearchLoading(false);
        }
      };
      fetchReview();
    }
  }, [selectedProductId, currentPage, currentPageSize, search]);

  const handleChangeEnable = async (id, value) => {
    try {
      const data = { enable: value };
      await ProductService.updateEnable(id, data);
      notification.success({
        message: "Cập nhật thành công.",
        placement: "top",
      });
    } catch (error) {
      showError(error);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    try {
      await ProductService.remove(id);
      const newData = data.filter((item) => !(item.id === id));
      setData(newData);
      notification.success({
        message: "Xóa thành công",
        placement: "top",
      });
    } catch (error) {
      showError(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleChangeId = (value) => {
    setSelectedProductId(value);
  };

  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb} />
      <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
        <div className="w-full flex justify-between items-center gap-4">
          <Select
            className="w-1/2 capitalize"
            value={selectedProductId}
            onChange={handleChangeId}
            allowClear
            size="large"
            placeholder="Chọn sản phẩm"
          >
            {data.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <Table
          pagination={false}
          showSorterTooltip={false}
          loading={isLoading}
          columns={columns}
          dataSource={review}
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
            setSearchParams(`page=${newPage}`);
          }}
        />
      </div>
    </div>
  );
};

export default Reviews;
