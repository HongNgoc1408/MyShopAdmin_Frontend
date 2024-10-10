import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Image,
  Input,
  notification,
  Pagination,
  Popconfirm,
  Switch,
  Table,
} from "antd";
import {
  formatVND,
  showError,
  toImageLink,
  toTextValue,
} from "../../services/commonService";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteTwoTone,
  EyeTwoTone,
  HomeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import ProductService from "../../services/ProductService";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") ?? 1);
  const [currentPageSize, setCurrentPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [brandNames, setBrandNames] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);

  const breadcrumb = [
    {
      path: "/",
      title: <HomeTwoTone />,
    },
    {
      title: "Sản phẩm",
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      render: (value) => <span className="font-semibold">{value}</span>,
    },

    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      render: (url) => (
        <Image style={{ maxWidth: 100, minWidth: 50 }} src={toImageLink(url)} />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      render: (value) => <div className="truncate w-24 md:w-48">{value}</div>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   render: (value) => <div className="truncate w-24 md:w-48">{value}</div>,
    // },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      render: (value) => formatVND(value),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
    },
    // {
    //   title: "Đánh giá ",
    //   dataIndex: "rating",
    // },
    {
      title: "Thương hiệu",
      dataIndex: "brandName",
      filters: brandNames,
      onFilter: (value, record) => record.brandName.indexOf(value) === 0,
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      filters: categoryNames,
      onFilter: (value, record) => record.categoryName.indexOf(value) === 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "enable",
      render: (value, record) => (
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked={value}
          onChange={(value) => handleChangeEnable(record.id, value)}
        />
      ),
      filters: [
        { text: "Còn bán", value: true },
        { text: "Ngưng bán", value: false },
      ],
      onFilter: (value, record) => record.enable === value,
    },
    {
      title: "Thực hiện",
      align: "center",
      render: (_, record) => (
        <Flex justify="center" align="center" className="space-x-1">
          <Link to={`/product-detail/${record.id}`}>
            <Button>
              <EyeTwoTone />
            </Button>
          </Link>
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

  const handleSearch = (key) => key && key !== search && setSearch(key);

  useEffect(() => {
    const fetchData = async () => {
      try {
        search ? setSearchLoading(true) : setIsLoading(true);
        const res = await ProductService.getAll(
          currentPage,
          currentPageSize,
          search
        );
        var newBrandNames = toTextValue([
          ...new Set(res.data?.items?.map((order) => order.brandName)),
        ]);
        var newcategoryNames = toTextValue([
          ...new Set(res.data?.items?.map((order) => order.categoryName)),
        ]);

        setBrandNames(newBrandNames);
        setCategoryNames(newcategoryNames);
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

  const handleChangeEnable = async (id, value) => {
    try {
      const data = { enable: value };
      await ProductService.updateEnable(id, data);
      notification.success({ message: "cập nhật thành công." });
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
      });
    } catch (error) {
      showError(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
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
          <Link to="/add-products">
            <Button size="large" type="primary">
              <PlusOutlined /> Thêm sản phẩm
            </Button>
          </Link>
        </div>
        <Table
          pagination={false}
          showSorterTooltip={false}
          loading={isLoading}
          columns={columns}
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
            setSearchParams(`page=${newPage}`);
          }}
        />
      </div>
    </div>
  );
};

export default Products;
