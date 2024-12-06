import { FaCheck, FaDownload, FaReceipt, FaUserGroup } from "react-icons/fa6";
import { Card, message, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import StatisticService from "../../services/StatisticService";
import { showError } from "../../services/commonService";
import { AiFillProduct } from "react-icons/ai";

import { Link } from "react-router-dom";
import authService from "../../services/authService";
import StatisticProduct from "../Statistic";
import StatisticOrder from "../Statistic/StatisticOrder";
import StatisticTopProduct from "../Statistic/StatisticTopProduct";

const Home = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUser] = useState(null);
  const [products, setProduct] = useState(null);
  const [orders, setOrder] = useState(null);
  const [ordersDone, setOrderDone] = useState(null);
  const [imports, setImport] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await authService.getRole();
        setRoles(res || []);
      } catch (error) {
        message.error("Lỗi");
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = await StatisticService.getToTalUser();
        const p = await StatisticService.getToTalProduct();
        const o = await StatisticService.getToTalOrder();
        const oDone = await StatisticService.getToTalOrderDone();
        const i = await StatisticService.getToTalImport();

        setUser(u.data);
        setProduct(p.data);
        setOrder(o.data);
        setOrderDone(oDone.data);
        setImport(i.data);
      } catch (error) {
        showError(error);
      }
    };
    fetchData();
  }, []);

  const onChange = (key) => {
    // console.log(key);
  };
  return (
    <>
      {roles.some((role) => role === "Admin" || role === "Manager") ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <Card>
              <Card.Meta
                avatar={
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
                      <FaUserGroup className="h-8 w-8 text-blue-400" />
                    </div>
                  </>
                }
                title={
                  <span className="cursor-pointer text-sm">Người dùng</span>
                }
                description={
                  <>
                    <p className="text-gray-700 text-2xl">{users}</p>
                    <Link to={"/users"} className="text-orange-600">
                      View
                    </Link>
                  </>
                }
              />
            </Card>

            <Card>
              <Card.Meta
                avatar={
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-yellow-100 bg-yellow-50">
                      <AiFillProduct className="h-8 w-8 text-yellow-400" />
                    </div>
                  </>
                }
                title={<span className="cursor-pointer text-sm">Sản phẩm</span>}
                description={
                  <>
                    <p className="text-gray-700 text-2xl">{products}</p>
                    <Link to={"/products"} className="text-orange-600">
                      View
                    </Link>
                  </>
                }
              />
            </Card>

            <Card>
              <Card.Meta
                avatar={
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-100 bg-orange-50">
                      <FaReceipt className="h-8 w-8 text-orange-400" />
                    </div>
                  </>
                }
                title={<span className="cursor-pointer text-sm">Đơn hàng</span>}
                description={
                  <>
                    <p className="text-gray-700 text-2xl">{orders}</p>
                    <Link to={"/orders"} className="text-orange-600">
                      View
                    </Link>
                  </>
                }
              />
            </Card>

            <Card>
              <Card.Meta
                avatar={
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-100 bg-green-50">
                      <FaCheck className="h-8 w-8 text-green-400" />
                    </div>
                  </>
                }
                title={
                  <span className="cursor-pointer text-sm">ĐH hoàn thành</span>
                }
                description={
                  <>
                    <p className="text-gray-700 text-2xl">{ordersDone}</p>
                  </>
                }
              />
            </Card>

            <Card>
              <Card.Meta
                avatar={
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-pink-100 bg-pink-50">
                      <FaDownload className="h-8 w-8 text-pink-400" />
                    </div>
                  </>
                }
                title={
                  <span className="cursor-pointer text-sm">
                    Phiếu nhập hàng
                  </span>
                }
                description={
                  <>
                    <p className="text-gray-700 text-2xl">{imports}</p>
                    <Link to={"/imports"} className="text-orange-600">
                      View
                    </Link>
                  </>
                }
              />
            </Card>
          </div>
          <Tabs
            className="mt-10 p-2 bg-white"
            centered
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Thống kê theo đơn hàng",
                children: <StatisticOrder />,
              },
              {
                key: "2",
                label: "Thống kê theo sản phẩm",
                children: <StatisticProduct />,
              },
              {
                key: "3",
                label: "Thống kê 5 sản phẩm bán chạy",
                children: <StatisticTopProduct />,
              },
            ]}
            onChange={onChange}
          />
        </>
      ) : (
        <>
          <div>{roles}</div>
        </>
      )}
    </>
  );
};

export default Home;
