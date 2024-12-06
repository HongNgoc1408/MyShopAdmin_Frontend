import React, { useEffect, useState } from "react";
import {
  App,
  Button,
  Flex,
  Form,
  Input,
  Popconfirm,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteTwoTone,
  EditTwoTone,
  HomeTwoTone,
} from "@ant-design/icons";
import { CiEraser } from "react-icons/ci";
import { showError } from "../../services/commonService";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import PaymentService from "../../services/PaymentService";
const breadcrumb = [
  {
    path: "/",
    title: <HomeTwoTone />,
  },
  {
    title: "Phương thức thanh toán",
  },
];
const Payments = () => {
  const { notification } = App.useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [form] = Form.useForm();
  const [updateID, setUpdateID] = useState("");

  const [update, setUpdate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState("");

  const filteredSizes = data.filter((data) =>
    data.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const columns = (onUpdate, handleDelete) => [
    {
      title: "Tên phương thức thanh toán",
      dataIndex: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "isActive",
      render: (value, record) =>
        value ? (
          <Tag color="blue">Hoạt động</Tag>
        ) : (
          <Tag color="red">Ngưng hoạt động</Tag>
        ),

      //   <Switch
      //     checkedChildren={<CheckOutlined />}
      //     unCheckedChildren={<CloseOutlined />}
      //     defaultChecked={value}
      //   />
      filters: [
        { text: "Hoạt động", value: true },
        { text: "Ngưng hoạt động", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: "Thực hiện",
      align: "center",
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
        const res = await PaymentService.getAll();
        // console.log(res.data);
        setData(res.data);
        setTotalItems(res.data.length);
      } catch (error) {
        showError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [update]);

  const handleAdd = async () => {
    setLoadingAdd(true);
    try {
      const values = await form.validateFields();
      await PaymentService.add(values);
      notification.success({
        message: "Thêm phương thức thanh toán thành công",
        placement: "top",
      });
      setUpdate(!update);
      setIsUpdate(false);
      form.resetFields();
    } catch (error) {
      showError(error);
    } finally {
      setLoadingAdd(false);
    }
  };

  const onUpdate = (record) => {
    // console.log(record);
    form.setFieldsValue(record);
    form.setFieldsValue({ name: record.name, isActive: record.isActive });
    setUpdateID(record.id);
    setIsUpdate(true);
  };

  const handleUpdate = async () => {
    setLoadingUpdate(true);
    try {
      const values = await form.getFieldsValue();
      // console.log(updateID, values);
      await PaymentService.update(updateID, {
        ...values,
        Id: values.id,
        Name: values.name,
        IsActive: values.isActive,
      });
      notification.success({
        message: `Cập nhật thành công.`,
        placement: "top",
      });
      setUpdate(!update);
      setIsUpdate(false);
      form.resetFields();
    } catch (error) {
      showError(error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    try {
      await PaymentService.remove(id);
      const newData = data.filter((item) => !(item.id === id));
      setData(newData);
      setTotalItems(newData.length);
    } catch (error) {
      showError(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleClear = () => {
    setIsUpdate(false);
    form.resetFields();
  };

  return (
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
            columns={columns(onUpdate, handleDelete)}
            // dataSource={data}
            dataSource={filteredSizes}
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
            Danh mục
          </div>
          <Form
            form={form}
            className="px-4"
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              label="Tên phương thức"
              name="name"
              className="col-span-2"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên phương thức thanh toán.",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Trạng thái phương thức thanh toán"
              name="isActive"
              className="col-span-2"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập trạng thái phương thức thanh toán.",
                },
              ]}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
                className="bg-gray-500"
              />
            </Form.Item>
            <div className="col-span-3 grid grid-cols-1 lg:grid-cols-5 gap-2 pb-4">
              <Button
                type="primary"
                className="lg:col-span-2"
                size="large"
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
  );
};

export default Payments;
