import React from "react";
import {
  Box,
  Table as TableMUI,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled, useTheme } from "@mui/material/styles";

export type HeadCell = {
  id: string;
  label: string;
  align?: "left" | "center" | "right" | "justify";
  minWidth?: string;
  maxWidth?: string;
};

type TableProps = {
  cells: HeadCell[];
  isEmpty: boolean;
  isLoading: boolean;
  isError: boolean;
  children: React.ReactNode;
  withAction?: boolean;
  withCheckBox?: boolean;
  withPagination: boolean;
  totalRows?: number;
  rowsPerPage?: number;
  currentPage?: number;
  enableScroll?: boolean;
  onHandleChangePage?: (newPage: number) => void;
  onChangeRowsPerPage?: (newRowsPerPage: number) => void;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const calculateSpanTotal = (
  span: number,
  withAction: boolean,
  withCheckBox: boolean
) => {
  return span + (withAction ? 1 : 0) + (withCheckBox ? 1 : 0);
};

type TableHeaderRowProps = {
  cells: HeadCell[];
  withCheckBox?: boolean;
  withAction?: boolean;
  enableScroll?: boolean;
};

const TableHeaderRow: React.FC<TableHeaderRowProps> = ({
  cells,
  withCheckBox,
  withAction,
  enableScroll,
}) => (
  <TableRow>
    {withCheckBox && <TableCell padding="checkbox" />}
    {cells.map(({ label, id, align = "left", minWidth, maxWidth }) => (
      <StyledTableCell
        key={id}
        align={align}
        sx={{
          fontWeight: 700,
          minWidth: minWidth || (enableScroll ? "80px" : "auto"),
          maxWidth: maxWidth,
          padding: "8px",
        }}
      >
        {label}
      </StyledTableCell>
    ))}
    {withAction && <TableCell />}
  </TableRow>
);

type CommonMessageRowProps = {
  spanTotal: number;
  message: string;
};

const CommonMessageRow: React.FC<CommonMessageRowProps> = ({
  spanTotal,
  message,
}) => (
  <TableRow>
    <TableCell colSpan={spanTotal}>
      <Typography align="center" variant="body2">
        {message}
      </Typography>
    </TableCell>
  </TableRow>
);

type TableFooterRowProps = {
  spanTotal: number;
  totalRows: number;
  rowsPerPage: number;
  currentPage: number;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => void;
};

const TableFooterRow: React.FC<TableFooterRowProps> = ({
  spanTotal,
  totalRows,
  rowsPerPage,
  currentPage,
  handleChangeRowsPerPage,
  handleChangePage,
}) => (
  <TableFooter>
    <TableRow style={{ width: "100%" }}>
      <TablePagination
        colSpan={spanTotal}
        count={totalRows}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        SelectProps={{
          inputProps: {
            "aria-label": "rows per page",
          },
          native: true,
        }}
        onPageChange={handleChangePage}
      />
    </TableRow>
  </TableFooter>
);

export const Table: React.FC<TableProps> = ({
  isEmpty,
  isError,
  children,
  cells = [],
  withPagination,
  withAction = false,
  isLoading = true,
  withCheckBox = false,
  totalRows = 0,
  rowsPerPage = 0,
  currentPage = 0,
  enableScroll = false,
  onHandleChangePage = () => false,
  onChangeRowsPerPage,
}) => {
  const theme = useTheme();
  const span = cells.length;
  const spanTotal = calculateSpanTotal(span, withAction, withCheckBox);
  const messgeRow = {
    isEmpty: "No encontramos resultados para tu busqueda",
    isLoading: "Cargando...",
    isError: "Ha habido un error, intenta nuevamente mas tarde",
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (onChangeRowsPerPage) {
      onChangeRowsPerPage(newRowsPerPage);
    }
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    onHandleChangePage(newPage);
  };

  return (
    <Box
      sx={{
        borderRadius: "5px",
        overflow: enableScroll ? "auto" : "hidden",
        display: enableScroll ? "grid" : "block",
      }}
    >
      <TableContainer sx={{ borderRadius: "10px", overflow: "auto" }}>
        <TableMUI aria-label="table">
          <TableHead
            sx={{
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.common.white
                  : theme.palette.background.default,
            }}
          >
            <TableHeaderRow
              cells={cells}
              withCheckBox={withCheckBox}
              withAction={withAction}
              enableScroll={enableScroll}
            />
          </TableHead>
          <TableBody>
            {isLoading && (
              <CommonMessageRow
                spanTotal={spanTotal}
                message={messgeRow.isLoading}
              />
            )}
            {isError && (
              <CommonMessageRow
                spanTotal={spanTotal}
                message={messgeRow.isError}
              />
            )}
            {isEmpty && !isError && (
              <CommonMessageRow
                spanTotal={spanTotal}
                message={messgeRow.isEmpty}
              />
            )}
            {children}
          </TableBody>
          {withPagination && (
            <TableFooterRow
              spanTotal={spanTotal}
              totalRows={totalRows}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleChangePage={handleChangePage}
            />
          )}
        </TableMUI>
      </TableContainer>
    </Box>
  );
};
