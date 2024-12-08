import { Card, DatePicker, Select } from "antd";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { formatVND, showError } from "../../services/commonService";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import moment from "moment";
import StatisticService from "../../services/StatisticService";
const { RangePicker } = DatePicker;

const StatisticOrder = () => {
  const [salesYear, setSalesYear] = useState(null);
  const [spendingYear, setSpendingYear] = useState(null);
  const [totalYear, setTotalYear] = useState(null);
  const [revenueYear, setRevenueYear] = useState(null);

  const [salesData, setSalesData] = useState(null);
  const [spendingData, setSpendingData] = useState(null);
  const [totalData, setTotalData] = useState(null);
  const [revenue, setRevenue] = useState(null);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectValue, setSelectValue] = useState(0);

  const [dates, setDates] = useState([null, null]);
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();

  const handleSelectChange = (value) => {
    // console.log(value);
    setSelectValue(value);
  };

  const handleYearChange = (date, dateString) => {
    setSelectedYear(date ? date.year() : null);
  };

  const handleMonthChange = (date, dateString) => {
    setSelectedMonth(date ? date.month() + 1 : null);
  };

  const handleRangeChange = (value) => {
    if (value && value.length === 2) {
      const startDate = value[0];
      const endDate = value[1];

      setDates([startDate, endDate]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year = selectedYear == null ? currentYear : selectedYear;
        const month = selectedMonth == null ? null : selectedMonth;

        setSelectedYear(year);
        setSelectedMonth(month);

        let r;
        r = await StatisticService.getTotalRevenueYear(year, month);

        setSalesYear(r.data.sales.total);
        setSpendingYear(r.data.spending.total);
        setTotalYear(r.data.total);

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

          setRevenueYear(salesDataMapped);
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

          setRevenueYear(monthlyDataMapped);
        }
      } catch (error) {
        showError(error);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth, currentYear]);

  useEffect(() => {
    const fetchData = async () => {
      if (dates[0] && dates[1]) {
        try {
          const r = await StatisticService.getTotalRevenue(
            dates[0].format("YYYY-MM-DD"),
            dates[1].format("YYYY-MM-DD")
          );
          // console.log(r.data);

          setSalesData(r.data.sales.total);
          setSpendingData(r.data.spending.total);
          setTotalData(r.data.total);

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
          setRevenue(revenueMapped);
        } catch (error) {
          showError(error);
        }
      }
    };

    fetchData();
  }, [dates]);

  // console.log("123", revenueYear);
  return (
    <Card
      className="my-4"
      title={
        selectValue === 0
          ? `Biểu đồ chi phí và doanh thu của ${
              selectedMonth != null ? `tháng ${selectedMonth} năm` : "năm"
            } ${selectedYear}`
          : `Biểu đồ chi phí và doanh thu từ ngày ${
              dates[0] ? dates[0].format("DD-MM-YYYY") : ""
            } đến ngày ${dates[1] ? dates[1].format("DD-MM-YYYY") : ""}`
      }
    >
      <div className="flex gap-4">
        <Select
          value={selectValue}
          onChange={handleSelectChange}
          defaultValue={0}
          allowClear
          options={[
            { value: 0, label: "Nhập năm và tháng" },
            { value: 1, label: "Nhập ngày thống kê" },
          ]}
          placeholder="Nhập năm và tháng"
        />
        {selectValue === 0 ? (
          <>
            <DatePicker
              onChange={handleYearChange}
              picker="year"
              disabledDate={(current) =>
                current && current.valueOf() > Date.now()
              }
            />
            <DatePicker
              onChange={handleMonthChange}
              picker="month"
              disabledDate={(current) =>
                current && current.valueOf() > Date.now()
              }
            />
          </>
        ) : (
          <RangePicker
            onChange={handleRangeChange}
            disabledDate={(current) =>
              current && current.valueOf() > Date.now()
            }
          />
        )}
      </div>

      {selectValue === 0 ? (
        <div className="flex">
          <div className="w-full">
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={revenueYear}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(value) => {
                    if (selectedMonth == null) {
                      return `Tháng ${value}`;
                    } else {
                      return `Ngày ${value}`;
                    }
                  }}
                />
                <YAxis
                  width={100}
                  yAxisId="sales"
                  orientation="left"
                  stroke="#8884d8"
                  tickFormatter={(value) => formatVND(value)}
                />
                <YAxis
                  width={100}
                  yAxisId="spending"
                  orientation="right"
                  stroke="#fb923c"
                  tickFormatter={(value) => formatVND(value)}
                />

                <Tooltip
                  formatter={(value) => formatVND(value)}
                  labelFormatter={(label) => {
                    if (selectedMonth == null) {
                      return `Tháng ${label}`;
                    } else {
                      return `Ngày ${label}`;
                    }
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="sales"
                  dataKey="sales"
                  fill="#8884d8"
                  name="Doanh thu"
                />
                <Bar
                  yAxisId="spending"
                  dataKey="spending"
                  fill="#fb923c"
                  name="Chi phí"
                />
              </BarChart>
            </ResponsiveContainer>
            {/* <div className="flex space-x-10 justify-center justify-items-end text-end">
              <Card className="my-4">
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
                        {formatVND(salesYear)}
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
                        {formatVND(spendingYear)}
                      </p>
                    </>
                  }
                />
              </Card>
              {totalYear > 0 ? (
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
                          {formatVND(totalYear)}
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
                          {formatVND(totalYear)}
                        </p>
                      </>
                    }
                  />
                </Card>
              )}
            </div> */}
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
                      {formatVND(salesYear)}
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
                  <span className="cursor-pointer text-base">Tổng chi phí</span>
                }
                description={
                  <>
                    <p className="text-purple-400 text-xl ">
                      {formatVND(spendingYear)}
                    </p>
                  </>
                }
              />
            </Card>
            {totalYear > 0 ? (
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
                    <span className="cursor-pointer text-base">Lợi nhuận</span>
                  }
                  description={
                    <>
                      <p className="text-green-600 text-xl ">
                        {formatVND(totalYear)}
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
                        {formatVND(totalYear)}
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
            <div className="w-full">
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  width="100%"
                  height={500}
                  data={revenue}
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
                    width={100}
                    yAxisId="sales"
                    orientation="left"
                    stroke="#8884d8"
                    label={{
                      angle: -90,
                      position: "insideLeft",
                    }}
                    tickFormatter={(value) => formatVND(value)}
                  />
                  <YAxis
                    width={100}
                    yAxisId="spending"
                    orientation="right"
                    stroke="#fb923c"
                    label={{
                      angle: -90,
                      position: "insideLeft",
                    }}
                    tickFormatter={(value) => formatVND(value)}
                  />

                  <Tooltip
                    formatter={(value, name) =>
                      name === "sales"
                        ? [`${formatVND(value)}`, "Doanh thu"]
                        : [`${formatVND(value)}`, "Chi phí"]
                    }
                    labelFormatter={(label) =>
                      selectedMonth == null
                        ? `Tháng ${new Date(label).getMonth() + 1}`
                        : `Ngày ${new Date(label).getDate()}`
                    }
                  />
                  <Legend />
                  <Bar
                    yAxisId="sales"
                    dataKey="sales"
                    fill="#8884d8"
                    name="Doanh thu"
                  />
                  <Bar
                    yAxisId="spending"
                    dataKey="spending"
                    fill="#fb923c"
                    name="Chi phí"
                  />
                </BarChart>
              </ResponsiveContainer>
              {/* <div className="flex space-x-10 justify-center justify-items-end text-end">
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
                          {formatVND(salesData)}
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
                          {formatVND(spendingData)}
                        </p>
                      </>
                    }
                  />
                </Card>
                {totalData > 0 ? (
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
                            {formatVND(totalData)}
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
                            {formatVND(totalData)}
                          </p>
                        </>
                      }
                    />
                  </Card>
                )}
              </div> */}
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
                        {formatVND(salesData)}
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
                        {formatVND(spendingData)}
                      </p>
                    </>
                  }
                />
              </Card>
              {totalData > 0 ? (
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
                          {formatVND(totalData)}
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
                          {formatVND(totalData)}
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
  );
};

export default StatisticOrder;
