import React, { useState, useEffect } from "react";
import api from "../api";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("transaction_date");

  useEffect(() => {
    api
      .get("/api/transactions/")
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/transactions/${id}/`);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      alert("Failed to delete transaction");
    }
  };

  const handleEdit = (tx) => {
    // TU docelowo otworzysz modal
    console.log("Edit transaction:", tx);
    alert("Edit modal do implementacji ");
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let valA = a[orderBy];
    let valB = b[orderBy];

    if (orderBy === "transaction_date") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ p: 2 }}>
        Transaction History
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            {/* DATE */}
            <TableCell sortDirection={orderBy === "transaction_date" ? order : false}>
              <TableSortLabel
                active={orderBy === "transaction_date"}
                direction={orderBy === "transaction_date" ? order : "asc"}
                onClick={() => handleSort("transaction_date")}
              >
                Date
              </TableSortLabel>
            </TableCell>

            {/* TYPE */}
            <TableCell sortDirection={orderBy === "transaction_type" ? order : false}>
              <TableSortLabel
                active={orderBy === "transaction_type"}
                direction={orderBy === "transaction_type" ? order : "asc"}
                onClick={() => handleSort("transaction_type")}
              >
                Type
              </TableSortLabel>
            </TableCell>

            {/* ASSET */}
            <TableCell>
              Asset
            </TableCell>

            {/* QUANTITY */}
            <TableCell
              align="right"
              sortDirection={orderBy === "quantity" ? order : false}
            >
              <TableSortLabel
                active={orderBy === "quantity"}
                direction={orderBy === "quantity" ? order : "asc"}
                onClick={() => handleSort("quantity")}
              >
                Quantity
              </TableSortLabel>
            </TableCell>

            {/* PRICE */}
            <TableCell
              align="right"
              sortDirection={orderBy === "price" ? order : false}
            >
              <TableSortLabel
                active={orderBy === "price"}
                direction={orderBy === "price" ? order : "asc"}
                onClick={() => handleSort("price")}
              >
                Price per unit
              </TableSortLabel>
            </TableCell>

            {/* VALUE */}
            <TableCell align="right">
              Value
            </TableCell>

            {/* ACTIONS */}
            <TableCell align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedTransactions.map((tx) => (
            <TableRow key={tx.id} hover>
              {/* DATE */}
              <TableCell>
                {new Date(tx.transaction_date).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>

              {/* TYPE */}
              <TableCell>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: tx.transaction_type === "BUY" ? "#16a34a" : "#dc2626",
                  }}
                >
                  {tx.transaction_type}
                </Typography>
              </TableCell>

              {/* ASSET */}
              <TableCell>
                <strong>{tx.asset.symbol}</strong>
              </TableCell>

              {/* QUANTITY */}
              <TableCell align="right">
                {Number(tx.quantity).toFixed(2)}
              </TableCell>

              {/* PRICE */}
              <TableCell align="right">
                ${Number(tx.price).toFixed(2)}
              </TableCell>

              {/* VALUE */}
              <TableCell align="right">
                ${(tx.quantity * tx.price).toFixed(2)}
              </TableCell>

              {/* ACTIONS */}
              <TableCell align="right">
                <IconButton size="small" onClick={() => handleEdit(tx)}>
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(tx.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionHistory;
