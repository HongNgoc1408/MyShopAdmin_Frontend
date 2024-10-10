import React, { useEffect, useState } from "react";
import {
  App,
  Button,
  Flex,
  Form,
  Input,
  Popconfirm,
  Spin,
  Table,
  Tooltip,
} from "antd";
import SizeService from "../../services/SizeService";
import { DeleteTwoTone, EditTwoTone, HomeTwoTone } from "@ant-design/icons";
import { CiEraser } from "react-icons/ci";
import { showError } from "../../services/commonService";
import BreadcrumbLink from "../../components/BreadcrumbLink";

const Sizes = () => {
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

  const breadcrumb = [
    {
      path: "/",
      title: <HomeTwoTone />,
    },
    {
      title: "Danh mục",
    },
  ];

  const columns = (onUpdate, handleDelete) => [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   align: "center",
    //   sorter: (a, b) => a.id - b.id,
    // },
    {
      title: "Tên size",
      dataIndex: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
        const res = await SizeService.getAll();
        // console.log(res.data)
        setData(res.data);
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
      SizeService.add(values);
      notification.success({
        message: "Thêm size thành công",
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
    form.setFieldsValue(record);
    setUpdateID(record.id);
    setIsUpdate(true);
  };

  const handleUpdate = async () => {
    setLoadingUpdate(true);
    try {
      const values = await form.getFieldsValue();

      await SizeService.update(updateID, values);
      notification.success({
        message: `Cập nhật thành công.`,
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
      await SizeService.remove(id);
      const newData = data.filter((item) => !(item.id === id));
      setData(newData);
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
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="h-fit md:col-span-2 bg-white rounded-lg drop-shadow">
          <Table
            loading={isLoading}
            columns={columns(onUpdate, handleDelete)}
            dataSource={data}
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
          <Form form={form} className="px-4 grid grid-cols-3 gap-2">
            <label htmlFor="name">Tên size:</label>
            <Form.Item
              name="name"
              className="col-span-2"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên size.",
                },
              ]}
            >
              <Input />
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

export default Sizes;
