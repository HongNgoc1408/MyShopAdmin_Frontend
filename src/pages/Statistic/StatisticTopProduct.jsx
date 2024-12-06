import { Card, DatePicker, Select } from "antd";
import React, { useEffect, useState } from "react";
import StatisticService from "../../services/StatisticService";
import { showError } from "../../services/commonService";
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
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const StatisticTopProduct = () => {
  const [revenueYearProduct, setRevenueYearProduct] = useState(null);
  const [revenueProduct, setRevenueProduct] = useState(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year =
          selectedYearProduct == null ? currentYear : selectedYearProduct;
        const month =
          selectedMonthProduct == null ? null : selectedMonthProduct;

        setSelectedYearProduct(year);
        setSelectedMonthProduct(month);

        let r = await StatisticService.getTopProductYear(year, month);

        console.log(r.data.product);

        if (r.data && r.data.product) {
          const formattedData = r.data.product.map((product) => ({
            name: product.name,
            sold: product.sold,
            sales: product.sales,
          }));
          console.log("formattedData", formattedData);
          setRevenueYearProduct(formattedData);
        }
      } catch (error) {
        showError(error);
      }
    };

    fetchData();
  }, [selectedYearProduct, selectedMonthProduct, currentYear]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (datesProduct[0] && datesProduct[1]) {
          const r = await StatisticService.getTopProduct(
            datesProduct[0].format("YYYY-MM-DD"),
            datesProduct[1].format("YYYY-MM-DD")
          );

          console.log(r);

          if (r.data && r.data.product) {
            const formattedData = r.data.product.map((product) => ({
              name: product.name,
              sold: product.sold,
              sales: product.sales,
            }));
            console.log("Formatted Data:", formattedData);
            setRevenueProduct(formattedData);
          }
        }
      } catch (error) {
        showError(error);
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
            ? `Biểu đồ top 5 sản phẩm bán chạy nhất ${
                selectedMonthProduct != null
                  ? `tháng ${selectedMonthProduct} năm`
                  : "năm"
              } ${selectedYearProduct}`
            : `Biểu đồ top 5 sản phẩm bán chạy nhất từ ngày ${
                datesProduct[0] ? datesProduct[0].format("DD-MM-YYYY") : ""
              } đến ngày ${
                datesProduct[1] ? datesProduct[1].format("DD-MM-YYYY") : ""
              }`
        }
      >
        <div className="flex gap-4">
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
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="sales" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="sold" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="sales"
                    dataKey="sales"
                    fill="#8884d8"
                    name="Doanh thu"
                  />
                  <Bar
                    yAxisId="sold"
                    dataKey="sold"
                    fill="#82ca9d"
                    name="Số lượng bán"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="flex">
            <div className="w-9/12">
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={revenueProduct}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="sales" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="sold" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="sales"
                    dataKey="sales"
                    fill="#8884d8"
                    name="Doanh thu"
                  />
                  <Bar
                    yAxisId="sold"
                    dataKey="sold"
                    fill="#82ca9d"
                    name="Số lượng bán"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default StatisticTopProduct;
