import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Image,
  Input,
  message,
  Popconfirm,
  Spin,
  Table,
  Tooltip,
  Upload,
} from "antd";
import BrandService from "../../services/BrandService";
import {
  showError,
  toImageLink,
  toImageSrc,
} from "../../services/commonService";
import {
  DeleteTwoTone,
  EditTwoTone,
  HomeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { CiEraser } from "react-icons/ci";
import BreadcrumbLink from "../../components/BreadcrumbLink";

const breadcrumb = [
  {
    path: "/",
    title: <HomeTwoTone />,
  },
  {
    title: "Thương hiệu",
  },
];

const Brands = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [filelist, setFileList] = useState([]);
  const [brands, setBrands] = useState([]);
  const [update, setUpdate] = useState(false);
  const [updateID, setUpdateID] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState("");

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const columns = (onUpdate) => [
    {
      title: "Tên thương hiệu",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      render: (value) => (
        <Image rootClassName="w-20 h-20" src={toImageLink(value)} />
      ),
    },
    {
      title: "Thực hiện",
      render: (_, record) => (
        <Flex justify="center" align="center" className="space-x-1">
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => onUpdate(record)}>
              <EditTwoTone />
            </Button>
          </Tooltip>

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
      setIsLoading(true);
      try {
        const res = await BrandService.getAll();
        // console.log(res.data);

        setBrands(res.data);
        setTotalItems(res.data.length);
      } catch (error) {
        showError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [update]);

  const handleFileChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const onUpdate = (brand) => {
    form.setFieldsValue({
      ...brand,
      image: [
        {
          name: brand.imageUrl,
          url: brand.imageUrl,
        },
      ],
    });
    setFileList([
      {
        name: brand.imageUrl,
        url: toImageSrc(brand.imageUrl),
      },
    ]);
    setUpdateID(brand.id);
    setIsUpdate(true);
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      // console.log(filelist);

      try {
        const formData = new FormData();
        setLoadingAdd(true);
        const data = { ...values, image: filelist[0]?.originFileObj };
        // console.log(filelist);
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        const res = await BrandService.add(formData);
        setBrands([...brands, res.data]);
        setUpdate(!update);
        setIsUpdate(false);
        form.resetFields();
        setFileList([]);
        message.success("Thêm thương hiệu thành công.");
      } catch (error) {
        showError(error);
      } finally {
        setLoadingAdd(false);
      }
    } catch (error) {}
  };

  const handleUpdate = async () => {
    try {
      setLoadingUpdate(true);

      const formData = new FormData();

      const data = {
        ...form.getFieldsValue(),
        image: filelist.length > 0 ? filelist[0]?.originFileObj : null,
      };
      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      const res = await BrandService.update(updateID, formData);
      const newBrand = brands.filter((item) => item.id !== updateID);
      setBrands([...newBrand, res.data]);

      message.success("Cập nhật thành công.");

      setUpdate(!update);
      setIsUpdate(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      showError(error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    try {
      await BrandService.remove(id);
      const newData = brands.filter((item) => !(item.id === id));
      setBrands(newData);
      setTotalItems(newData.length);
      message.success("Xóa thành công");
    } catch (error) {
      showError(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setFileList([]);
  };

  return (
    <>
      <div className="space-y-4">
        <BreadcrumbLink breadcrumb={breadcrumb} />
        <div className="w-full flex justify-between items-center">
          <Input.Search
            className="w-1/2"
            placeholder="Tìm kiếm tên thương hiệu"
            value={searchText}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            // onChange={(e) => setSearchText(e.target.value)}
            size="large"
            allowClear
          />
          {/* <div>
            <Button type="primary" onClick={() => showModal()}>
              <PlusOutlined /> Thêm thương hiệu
            </Button>
          </div> */}
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="h-fit md:col-span-2 bg-white rounded-lg drop-shadow">
            <Table
              pagination={{
                showSizeChanger: true,
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                },
              }}
              loading={isLoading}
              columns={columns(onUpdate)}
              // dataSource={brands}
              dataSource={filteredBrands}
              rowKey={(record) => record.id}
              className="overflow-x-auto"
            />
          </div>
          <div className="h-fit bg-white rounded-lg drop-shadow">
            <div
              style={{
                backgroundColor: "#1d4ed8",
                height: "54.8px",
                fontSize: "14px",
                fontWeight: 600,
              }}
              className="rounded-t-xl p-4 text-white TableTitle text-xl text-center mb-5"
            >
              Thương hiệu
            </div>
            <Form form={form} className="px-4 grid grid-cols-3 gap-2">
              <label htmlFor="name">Tên thương hiệu:</label>
              <Form.Item
                name="name"
                className="col-span-2"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên thương hiệu.",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <label>Hình ảnh:</label>
              <Form.Item
                name="imageUrl"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ảnh.",
                  },
                ]}
                getValueFromEvent={(e) => e.fileList}
              >
                <Upload
                  name="file"
                  beforeUpload={() => false}
                  listType="picture-card"
                  fileList={filelist}
                  // accept="image/png, image/gif, image/jpeg, image/svg"
                  maxCount={1}
                  onChange={handleFileChange}
                >
                  {filelist.length >= 1 ? null : (
                    <button
                      style={{
                        border: 0,
                        background: "none",
                      }}
                      type="button"
                    >
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </button>
                  )}
                </Upload>
              </Form.Item>

              <div className="col-span-3 grid grid-cols-1 lg:grid-cols-5 gap-2 pb-4">
                <Button
                  type="primary"
                  className="lg:col-span-2"
                  size="large"
                  htmlType="submit"
                  onClick={handleAdd}
                  disabled={isUpdate}
                >
                  {loadingAdd ? <Spin /> : "Thêm"}
                </Button>
                <Button
                  type="primary"
                  className="lg:col-span-2"
                  size="large"
                  onClick={handleUpdate}
                  disabled={!isUpdate}
                >
                  {loadingUpdate ? <Spin /> : "Cập nhật"}
                </Button>
                <Tooltip title="Làm mới">
                  <Button size="large" className="" onClick={handleClear}>
                    <CiEraser className="text-2xl flex-shrink-0" />
                  </Button>
                </Tooltip>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Brands;
