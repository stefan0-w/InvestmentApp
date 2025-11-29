import React, { useState, useEffect } from 'react'
import api from "../api";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TableSortLabel, Typography
} from "@mui/material";


function TransactionHistory() {
  const [transactions, setTransactions] = useState([])
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("transaction_date");

  useEffect(() => {
    api.get("/api/transactions/")
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let valA = a[orderBy];
    let valB = b[orderBy];

    // Jeśli sortujemy po dacie, zamieniamy datę na liczby
    if (orderBy === "transaction_date") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ p: 2 }}>
        Transaction History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={orderBy === "transaction_date" ? order : false}>
              <TableSortLabel
                active={orderBy === "transaction_date"}
                direction={orderBy === "transaction_date" ? order : "asc"}
                onClick={() => handleSort("transaction_date")}
              >
                Date
              </TableSortLabel>
            </TableCell>

            <TableCell sortDirection={orderBy === "transaction_type" ? order : false}>
              <TableSortLabel
                active={orderBy === "transaction_type"}
                direction={orderBy === "transaction_type" ? order : "asc"}
                onClick={() => handleSort("transaction_type")}
              >
                Type
              </TableSortLabel>
            </TableCell>

            <TableCell sortDirection={orderBy === "asset" ? order : false}>
              <TableSortLabel
                active={orderBy === "asset"}
                direction={orderBy === "asset" ? order : "asc"}
                onClick={() => handleSort("asset")}
              >
                Asset
              </TableSortLabel>
            </TableCell>

            <TableCell sortDirection={orderBy === "quantity" ? order : false}>
              <TableSortLabel
                active={orderBy === "quantity"}
                direction={orderBy === "quantity" ? order : "asc"}
                onClick={() => handleSort("quantity")}
              >
                Volume
              </TableSortLabel>
            </TableCell>

            <TableCell sortDirection={orderBy === "price" ? order : false}>
              <TableSortLabel
                active={orderBy === "price"}
                direction={orderBy === "price" ? order : "asc"}
                onClick={() => handleSort("price")}
              >
                Price
              </TableSortLabel>
            </TableCell>

            <TableCell>
              Value (qty × price)
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedTransactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{new Date(tx.transaction_date).toLocaleString()}</TableCell>
              <TableCell>{tx.transaction_type}</TableCell>
              <TableCell>{tx.asset.symbol}</TableCell>
              <TableCell>{Number(tx.quantity).toFixed(2)}</TableCell>
              <TableCell>{Number(tx.price).toFixed(2)}</TableCell>
              <TableCell>{(tx.quantity * tx.price).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TransactionHistory