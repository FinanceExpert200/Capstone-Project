import React from "react";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Box, Center, Text } from '@chakra-ui/react'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';



const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, percent, index, name,stockPrice }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';


    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${name}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="grey.900">
                {`Amount: $${stockPrice.toLocaleString('en-US')}`}
            </text>
            
        </g>
    );
};


export default function UserPieChart({ stockData, tickers, updateStockPrice, }) {
    console.log('DATATTTTAAAA: ', stockData)
    // useEffect(() => {
    //     updateStockPrice(tickers);
    //   }, []);
    const [state, setState] = useState({ activeIndex: 0 })

    const onPieEnter = (_, index) => {
        setState({
            activeIndex: index,
        });
    };
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042','green', 'red'];



    return (
            <ResponsiveContainer width="50%" aspect={2.5} margin={3} >
                <PieChart >
                    <Pie
                        activeIndex={state.activeIndex}
                        activeShape={renderCustomizedLabel}
                        data={stockData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}

                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="stockPrice"
                        onMouseEnter={onPieEnter}
                    >
                        {stockData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
    )
}