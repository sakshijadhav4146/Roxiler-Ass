import React, { useEffect, useState } from "react";
import axios from "axios";
import '../index.css'
import Table from "react-bootstrap/Table";

const Dashboard = () => {
    const [tableData, setTableData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(3); 
    const [searchText, setSearchText] = useState("");
    const [err, setErr] = useState(null);
    const [page, setPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(0); 

    useEffect(() => {
        fetchTransactions();
    }, [selectedMonth, searchText, page]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/transition?search=${searchText}&page=${page}`);
            setTableData(response.data.data);
            console.log(response.data.data);
            
            setTotalPages(Math.ceil(response.data.totalProducts / 10)); 
            setErr(null); 
        } catch (error) {
            
            setErr("Error fetching transactions.");
        }
    };

    
    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
        setPage(1); 
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setPage(1); 
    };

   
    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    return (
        <>
            <div className="search-select-div">
                <div className="searchbar-div">
                    <input
                        type="search"
                        value={searchText}
                        onChange={handleSearchChange}
                        className="searchbar"
                        placeholder="Search transactions..."
                    />
                </div>
                <div className="month-picker-div">
                    <label htmlFor="month-picker" className="month-picker-label">
                        Select Month
                        <select
                            name="month-picker"
                            id="month-picker"
                            className="month-picker"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i + 1}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
            {err && <h2 className="error-message">{err}</h2>}
            <div className="TransactionTable-comp">
                <Table className="tables" striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Sold</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((data) => (
                            <tr key={data._id}>
                                <td>{data._id}</td>
                                <td>{data.title}</td>
                                <td>{data.description}</td>
                                <td>{Math.floor(data.price)}</td>
                                <td>{data.category}</td>
                                <td>{data.sold ? "Yes" : "No"}</td>
                                <td className="transaction-img">
                                    <img src={data.image} alt={data.title} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={page === 1}>
                    Previous
                </button>
                <button onClick={handleNextPage} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </>
    );
};

export default Dashboard;
