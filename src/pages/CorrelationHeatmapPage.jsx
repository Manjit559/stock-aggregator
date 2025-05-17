

import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import { getAllStocks, getStockHistory } from '../services/stockAPI';
import { mean, stdDev, pearsonCorrelation } from '../utils/mathUtils';

const CorrelationHeatmapPage = () => {
  const [stocks, setStocks] = useState({});
  const [minutes, setMinutes] = useState(30);
  const [priceMap, setPriceMap] = useState({});
  const [correlationMatrix, setCorrelationMatrix] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await getAllStocks();
      setStocks(res.stocks);

      const entries = Object.entries(res.stocks);
      const priceData = {};

      for (let [_, ticker] of entries) {
        try {
          const data = await getStockHistory(ticker, minutes);
          priceData[ticker] = data.map(d => d.price);
        } catch (e) {
          console.warn(`Failed to load ${ticker}`);
        }
      }

      setPriceMap(priceData);

      // Compute correlation
      const matrix = {};
      for (let a in priceData) {
        matrix[a] = {};
        for (let b in priceData) {
          if (a === b) {
            matrix[a][b] = 1;
          } else {
            const x = priceData[a];
            const y = priceData[b];
            const minLen = Math.min(x.length, y.length);
            if (minLen < 2) {
              matrix[a][b] = NaN;
              continue;
            }
            matrix[a][b] = pearsonCorrelation(x.slice(0, minLen), y.slice(0, minLen));
          }
        }
      }

      setCorrelationMatrix(matrix);
      setLoading(false);
    };

    loadData();
  }, [minutes]);

  const getColor = (val) => {
    if (isNaN(val)) return '#eee';
    const percent = (val + 1) / 2;
    const red = Math.round(255 * (1 - percent));
    const green = Math.round(255 * percent);
    return `rgb(${red},${green},100)`;
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>🔗 Correlation Heatmap</Typography>
      <TextField
        label="Minutes"
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(Number(e.target.value))}
        sx={{ mb: 2 }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ overflow: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                {Object.keys(correlationMatrix).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(correlationMatrix).map((rowKey) => (
                <TableRow key={rowKey}>
                  <TableCell>
                    <Tooltip
                      title={
                        priceMap[rowKey]
                          ? `Mean: ${mean(priceMap[rowKey]).toFixed(2)} | StdDev: ${stdDev(priceMap[rowKey]).toFixed(2)}`
                          : ''
                      }
                    >
                      <span>{rowKey}</span>
                    </Tooltip>
                  </TableCell>
                  {Object.keys(correlationMatrix).map((colKey) => {
                    const val = correlationMatrix[rowKey][colKey];
                    return (
                      <TableCell
                        key={colKey}
                        sx={{
                          backgroundColor: getColor(val),
                          color: '#000',
                          textAlign: 'center',
                        }}
                      >
                        {isNaN(val) ? 'N/A' : val.toFixed(2)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default CorrelationHeatmapPage;
