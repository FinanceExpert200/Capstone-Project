import { React, useState, useEffect } from "react";
import {
    Box, Button,
    Flex, Heading, Text,
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer,
} from '@chakra-ui/react'
import {format, parseISO} from "date-fns"
import PairsTradeGraph from "../Graph/PairsTradeGraph";

export default function ResultMeanReversion({ accountValue, transactionHistory, companies, pairsData }) {
    console.log("account:___", accountValue)
    console.log("history:___", transactionHistory)
    console.log("companies:___", companies)
    console.log("PAIRs data: __ ", pairsData)

    const [history, setHistory] = useState([])
    useEffect(() => {
        const updatedHistory = companies.map((company) => {
            return transactionHistory.filter((comp) => comp.ticker === company);
        });
        setHistory(updatedHistory);

    }, [companies, transactionHistory])
    console.log("HISTORY: ", history)
    return (
        <Flex direction={'column'} w={'full'} h={'80vh'} mt={10} p={10} textColor={'white'}>
            <Heading>Pairs Trading</Heading>
            <PairsTradeGraph data={pairsData}
                historical={'historical_mean'}
                priceRatio={'price_ratio'}
                aspect={5}
                color={'white'} />
            <Flex direction={'row'} justify={'space-between'}>

                <Tabs variant='enclosed' borderColor={'black'} w={'full'} p={5} >
                    <TabList p={1} >
                        {companies.map((company) => (
                            <Tab >{company}</Tab>
                        ))
                        }

                    </TabList>

                    <TabPanels>
                        {history.map((company) => (
                            <TabPanel key={company} overflow="scroll" h={'25vh'}>
                                <TableContainer>
                                    <Table variant='simple'>
                                        <TableCaption>Description</TableCaption>
                                        <Thead>
                                            <Tr>
                                                <Th>Name</Th>
                                                <Th>Date</Th>
                                                <Th>Type</Th>
                                                <Th isNumeric>Price</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {company.map((c) => (
                                                <Tr >
                                                    <Td>{c.ticker}</Td>
                                                    <Td>{format(parseISO(c.date), "MMM, d, yyyy")}</Td>
                                                    <Td>{c.type.slice(0,1).toUpperCase() + c.type.slice(1,c.type.length)}</Td>
                                                    <Td isNumeric>${c.price.toFixed(2)}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                        <Tfoot>
                                            <Tr>
                                                <Th>Name</Th>
                                                <Th>Date</Th>
                                                <Th>Type</Th>
                                                <Th isNumeric>Price</Th>
                                            </Tr>
                                        </Tfoot>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                        ))}

                    </TabPanels>


                </Tabs>
            </Flex>
        </Flex>
    )

}