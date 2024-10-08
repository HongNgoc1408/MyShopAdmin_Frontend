import React, { useRef, useState } from "react";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

const TableCategoryComponent = () => {
  const [data, setData] = useState([
    {
      key: "0",
      Name: "Edward King 0",
      STT: "32",
      Image: "London, Park Lane no. 0",
    },
    {
      key: "1",
      Name: "Edward King 1",
      STT: "32",
      Image: "London, Park Lane no. 1",
    },
  ]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },

    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      width: "20%",
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      width: "30%",
      ...getColumnSearchProps("Name"),
    },
    {
      title: "Image",
      dataIndex: "Image",
      key: "Image",
    },
    {
      title: "Thực hiện",
      dataIndex: "Thực hiện",
      key: "Thực hiện",
      render: (_, record) => [
        data.length >= 1 ? (
          <div className="flex">
            <button className="p-2" onClick={() => handleEdit(record.key)}>
              <Link>
                <FaEdit size={20} className="text-yellow-500" />
              </Link>
            </button>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <button className="p-2">
                <Link>
                  <FaTrash size={20} className="text-red-500" />
                </Link>
              </button>
            </Popconfirm>
          </div>
        ) : null,
      ],
    },
  ];

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };
  const handleEdit = (key) => {};
  return (
    <div className="w-2/3 p-2">
      <Table columns={columns} dataSource={data} />;
    </div>
  );
};

export default TableCategoryComponent;
