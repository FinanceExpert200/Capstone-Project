import React, { useState } from 'react';
import { useEffect } from 'react';
import {Box,Text} from '@chakra-ui/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StockGraph ({priceList}) {
    console.log(priceList)
    const [dataPrice, setDataPrice] = useState([])
    useEffect(() => {
        if (priceList) {
            const extractedDates = priceList.map(item => ({
              date: item.date, // Assuming date property exists in the priceList items
              openPrice: item.open, // Assuming open property exists in the priceList items
            }));
            setDataPrice(extractedDates);
          }
        }, [priceList]);

        // priceList.map((id) => {
        //     setDataPrice([...dataPrice, id.date]);

        // })
        // }, [dataPrice]);

    console.log("This is the list: " ,dataPrice);
   //const test = priceList ? priceList[0].open : 90;
        // priceList.map((id) => {
        //     setDataPrice([...dataPrice, id] )
        // })


    return (
        <Box>
            <Text>
                This is the list: 
            </Text>
            <Text>
               test
            </Text>
            <ResponsiveContainer width="100%" aspect={2}>
      <LineChart
        width={500}
        height={300}
        data={dataPrice}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'auto']}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="openPrice" stroke="#8884d8" activeDot={{ r: 8 }} />
        
      </LineChart>
    </ResponsiveContainer>
        </Box>
    )

} 