import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { Card, DatePicker, Select } from "antd";
import React, { useEffect, useState } from "react";
import StatisticService from "../../services/StatisticService";
import { formatVND, showError } from "../../services/commonService";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSearchParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import moment from "moment";
const { RangePicker } = DatePicker;
const StatisticProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [data, setData] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") ?? 1);
  const [currentPageSize, setCurrentPageSize] = useState(5);
  const [search, setSearch] = useState("");

  const [salesYearProduct, setSalesYearProduct] = useState(null);
  const [spendingYearProduct, setSpendingYearProduct] = useState(null);
  const [totalYearProduct, setTotalYearProduct] = useState(null);
  const [revenueYearProduct, setRevenueYearProduct] = useState(null);

  const [salesDataProduct, setSalesDataProduct] = useState(null);
  const [spendingDataProduct, setSpendingDataProduct] = useState(null);
  const [totalDataProduct, setTotalDataProduct] = useState(null);
  const [revenueProduct, setRevenueProduct] = useState(null);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectValueProduct, setSelectValueProduct] = useState(0);
  const [selectedYearProduct, setSelectedYearProduct] = useState(null);
  const [selectedMonthProduct, setSelectedMonthProduct] = useState(null);

  const [datesProduct, setDatesProduct] = useState([null, null]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const handleSelectChange = (value) => {
    setSelectValueProduct(value);
  };

  const handleYearChange = (date, dateString) => {
    setSelectedYearProduct(date ? date.year() : null);
  };

  const handleMonthChange = (date, dateString) => {
    setSelectedMonthProduct(date ? date.month() + 1 : null);
  };
  const handleRangeChange = (value) => {
    if (value && value.length === 2) {
      const startDate = value[0];
      const endDate = value[1];

      setDatesProduct([startDate, endDate]);
    }
  };
  const handleChangeId = (value) => {
    setSelectedProductId(value);
  };

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
    const fetchData = async () => {
      try {
        const year =
          selectedYearProduct == null ? currentYear : selectedYearProduct;
        const month =
          selectedMonthProduct == null ? null : selectedMonthProduct;

        setSelectedYearProduct(year);
        setSelectedMonthProduct(month);

        let r;
        r = await StatisticService.getRevenueProductYear(
          selectedProductId,
          year,
          month
        );

        console.log("r", r.data);

        setSalesYearProduct(r.data.sales.total);
        setSpendingYearProduct(r.data.spending.total);
        setTotalYearProduct(r.data.total);

        if (month != null) {
          const daysInMonth = new Date(year, month, 0).getDate();

          let salesDataMapped = Array.from(
            { length: daysInMonth },
            (_, index) => ({
              time: index + 1,
              sales: 0,
              spending: 0,
            })
          );

          r.data.sales.statisticDTO.forEach((item) => {
            const day = item.time;
            const dataIndex = day - 1;
            if (salesDataMapped[dataIndex]) {
              salesDataMapped[dataIndex].sales = item.statistic;
            }
          });

          r.data.spending.statisticDTO.forEach((item) => {
            const day = item.time;
            const dataIndex = day - 1;
            if (salesDataMapped[dataIndex]) {
              salesDataMapped[dataIndex].spending = item.statistic;
            }
          });

          setRevenueYearProduct(salesDataMapped);
        } else {
          let monthlyDataMapped = Array.from({ length: 12 }, (_, index) => ({
            time: index + 1,
            sales: 0,
            spending: 0,
          }));

          r.data.sales.statisticDTO.forEach((item) => {
            const month = item.time;
            const dataIndex = month - 1;
            if (monthlyDataMapped[dataIndex]) {
              monthlyDataMapped[dataIndex].sales = item.statistic;
            }
          });

          r.data.spending.statisticDTO.forEach((item) => {
            const month = item.time;
            const dataIndex = month - 1;
            if (monthlyDataMapped[dataIndex]) {
              monthlyDataMapped[dataIndex].spending = item.statistic;
            }
          });

          setRevenueYearProduct(monthlyDataMapped);
        }
      } catch (error) {
        showError(error);
      }
    };

    fetchData();
  }, [
    selectedYearProduct,
    selectedMonthProduct,
    currentYear,
    selectedProductId,
  ]);
  useEffect(() => {
    const fetchData = async () => {
      if (datesProduct[0] && datesProduct[1]) {
        try {
          const r = await StatisticService.getRevenueProduct(
            selectedProductId,
            datesProduct[0].format("YYYY-MM-DD"),
            datesProduct[1].format("YYYY-MM-DD")
          );
          // console.log(r.data);

          setSalesDataProduct(r.data.sales.total);
          setSpendingDataProduct(r.data.spending.total);
          setTotalDataProduct(r.data.total);

          let revenueMapped = [];

          r.data.sales.statisticDateDTO.forEach((item) => {
            revenueMapped.push({
              time: moment(item.time).format("DD-MM-YYYY"),
              sales: item.statistic,
              spending: 0,
            });
          });

          r.data.spending.statisticDateDTO.forEach((item) => {
            const existing = revenueMapped.find(
              (entry) => entry.time === moment(item.time).format("DD-MM-YYYY")
            );

            if (existing) {
              existing.spending = item.statistic;
            } else {
              revenueMapped.push({
                time: moment(item.time).format("DD-MM-YYYY"),
                sales: 0,
                spending: item.statistic,
              });
            }
          });

          revenueMapped.sort((a, b) => new Date(a.time) - new Date(b.time));

          // console.log(revenueMapped);
          setRevenueProduct(revenueMapped);
        } catch (error) {
          showError(error);
        }
      }
    };

    fetchData();
  }, [datesProduct]);
  return (
    <>
      <Card
        className="my-4"
        title={
          selectValueProduct === 0
            ? `Biểu đồ doanh thu sản phẩm ${
                selectedMonthProduct != null
                  ? `tháng ${selectedMonthProduct} năm`
                  : "năm"
              } ${selectedYearProduct}`
            : `Biểu đồ chi phí và doanh thu từ ngày ${
                datesProduct[0] ? datesProduct[0].format("DD-MM-YYYY") : ""
              } đến ngày ${
                datesProduct[1] ? datesProduct[1].format("DD-MM-YYYY") : ""
              }`
        }
      >
        <div className="flex gap-4">
          <Select
            className="w-1/2 capitalize"
            value={selectedProductId}
            onChange={handleChangeId}
            allowClear
            size="large"
            placeholder="Chọn sản phẩm cần xem đánh giá"
          >
            {data.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            value={selectValueProduct}
            onChange={handleSelectChange}
            defaultValue={0}
            allowClear
            options={[
              { value: 0, label: "Nhập năm và tháng" },
              { value: 1, label: "Nhập ngày thống kê" },
            ]}
            placeholder="Nhập năm và tháng"
          />
          {selectValueProduct === 0 ? (
            <>
              <DatePicker onChange={handleYearChange} picker="year" />
              <DatePicker onChange={handleMonthChange} picker="month" />
            </>
          ) : (
            <RangePicker onChange={handleRangeChange} />
          )}
        </div>
        {selectValueProduct === 0 ? (
          <div className="flex">
            <div className="w-9/12">
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={revenueYearProduct}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    label={{
                      position: "insideBottom",
                    }}
                    tickFormatter={(value) => {
                      if (selectedMonthProduct == null) {
                        return `Tháng ${value}`;
                      } else {
                        return `Ngày ${value}`;
                      }
                    }}
                  />
                  <YAxis
                    width={80}
                    label={{
                      angle: -90,
                      position: "insideLeft",
                    }}
                    tickFormatter={(value) => formatVND(value)}
                  />
                  <Tooltip formatter={(value) => formatVND(value)} />
                  <Legend />
                  <Bar dataKey="sales" fill="#c084fc" name="Doanh thu" />
                  <Bar dataKey="spending" fill="#fb923c" name="Chi phí" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-3/12">
              <Card>
                <Card.Meta
                  avatar={
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-100 bg-orange-50">
                        <GiReceiveMoney className="h-8 w-8 text-orange-400" />
                      </div>
                    </>
                  }
                  title={
                    <span className="cursor-pointer text-base">
                      Tổng doanh thu
                    </span>
                  }
                  description={
                    <>
                      <p className=" text-[#82ca9d] text-xl">
                        {formatVND(salesYearProduct)}
                      </p>
                    </>
                  }
                />
              </Card>
              <Card className="my-4">
                <Card.Meta
                  avatar={
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-purple-100 bg-purple-50">
                        <GiPayMoney className="h-8 w-8 text-purple-400" />
                      </div>
                    </>
                  }
                  title={
                    <span className="cursor-pointer text-base">
                      Tổng chi phí
                    </span>
                  }
                  description={
                    <>
                      <p className="text-purple-400 text-xl ">
                        {formatVND(spendingYearProduct)}
                      </p>
                    </>
                  }
                />
              </Card>
              {totalYearProduct > 0 ? (
                <Card className="my-4">
                  <Card.Meta
                    avatar={
                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-100 bg-green-50">
                          <FaArrowUp className="h-8 w-8 text-green-400" />
                        </div>
                      </>
                    }
                    title={
                      <span className="cursor-pointer text-base">
                        Lợi nhuận
                      </span>
                    }
                    description={
                      <>
                        <p className="text-green-600 text-xl ">
                          {formatVND(totalYearProduct)}
                        </p>
                      </>
                    }
                  />
                </Card>
              ) : (
                <Card className="my-4">
                  <Card.Meta
                    avatar={
                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-100 bg-red-50">
                          <FaArrowDown className="h-8 w-8 text-red-400" />
                        </div>
                      </>
                    }
                    title={
                      <span className="cursor-pointer text-base">Tổn Thất</span>
                    }
                    description={
                      <>
                        <p className="text-red-600 text-xl">
                          {formatVND(totalYearProduct)}
                        </p>
                      </>
                    }
                  />
                </Card>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex">
              <div className="w-9/12">
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart
                    data={revenueProduct}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      label={{
                        position: "insideBottom",
                      }}
                      tickFormatter={(value) => value}
                    />
                    <YAxis
                      width={80}
                      label={{
                        angle: -90,
                        position: "insideLeft",
                      }}
                      tickFormatter={(value) => formatVND(value)}
                    />
                    <Tooltip formatter={(value) => formatVND(value)} />
                    <Legend />
                    <Bar dataKey="sales" fill="#c084fc" name="Doanh thu" />
                    <Bar dataKey="spending" fill="#fb923c" name="Chi phí" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-3/12">
                <Card>
                  <Card.Meta
                    avatar={
                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-100 bg-orange-50">
                          <GiReceiveMoney className="h-8 w-8 text-orange-400" />
                        </div>
                      </>
                    }
                    title={
                      <span className="cursor-pointer text-base">
                        Tổng doanh thu
                      </span>
                    }
                    description={
                      <>
                        <p className="text-xl text-[#82ca9d]">
                          {formatVND(salesDataProduct)}
                        </p>
                      </>
                    }
                  />
                </Card>
                <Card className="my-4">
                  <Card.Meta
                    avatar={
                      <>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-purple-100 bg-purple-50">
                          <GiPayMoney className="h-8 w-8 text-purple-400" />
                        </div>
                      </>
                    }
                    title={
                      <span className="cursor-pointer text-base">
                        Tổng chi phí
                      </span>
                    }
                    description={
                      <>
                        <p className="text-purple-400 text-xl ">
                          {formatVND(spendingDataProduct)}
                        </p>
                      </>
                    }
                  />
                </Card>
                {totalDataProduct > 0 ? (
                  <Card className="my-4">
                    <Card.Meta
                      avatar={
                        <>
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-100 bg-green-50">
                            <FaArrowUp className="h-8 w-8 text-green-400" />
                          </div>
                        </>
                      }
                      title={
                        <span className="cursor-pointer text-base">
                          Lợi nhuận
                        </span>
                      }
                      description={
                        <>
                          <p className="text-green-600 text-xl ">
                            {formatVND(totalDataProduct)}
                          </p>
                        </>
                      }
                    />
                  </Card>
                ) : (
                  <Card className="my-4">
                    <Card.Meta
                      avatar={
                        <>
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-100 bg-red-50">
                            <FaArrowDown className="h-8 w-8 text-red-400" />
                          </div>
                        </>
                      }
                      title={
                        <span className="cursor-pointer text-base">
                          Tổn Thất
                        </span>
                      }
                      description={
                        <>
                          <p className="text-red-600 text-xl">
                            {formatVND(totalDataProduct)}
                          </p>
                        </>
                      }
                    />
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export default StatisticProduct;
