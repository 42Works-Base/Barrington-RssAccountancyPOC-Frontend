import React, { useState, useEffect } from 'react';
// import { getBankStatements } from './api';
import { getBankStatements, getBankStatementsCategory, getTransactionByIds } from '../../Services/Onboarding';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Table, Spinner, Pagination } from 'react-bootstrap';
import TransactionEditModal from './TransactionEditModal';

const BankStatements = () => {
  const [transactions, setTransactions] = useState([]);
  const [catTransactions, setCatTransactions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('transaction');
  const pageSize = 50;

  // const [showModal, setShowModal] = useState(false);
  // const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const [transactionModal, setTransactionModal] = useState({
    show: false,
    transactionId: null,
  });

  const fetchTransactions = async (from, to) => {
    if(!isLoading) {
      setIsLoading(true);
      try {
        const data = await getBankStatements(from, to);
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
  };

  // useEffect(() => {
  //   fetchTransactions(null, null);
  // }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  const handleApplyFilter = () => {
    setActiveTab('transaction');
    if (startDate && endDate) {
      fetchTransactions(startDate, endDate);
    } else {
      fetchTransactions(null, null);
    }
  };

  const handleCategorize = async () => {
    if(!isLoading) {
      setIsLoading(true);
      try {
        const data = await getBankStatementsCategory(startDate, endDate);
        setActiveTab('aiCategory');
        setCatTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }


  const totalPages = Math.ceil(transactions.length / pageSize);
  // const startIndex = currentPage * pageSize;
  // const endIndex = startIndex + pageSize;
  // const currentTransactions = transactions.slice(startIndex, endIndex);
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentTransactions = transactions.slice(indexOfFirst, indexOfLast);


  const handleClick = (pageNum) => setCurrentPage(pageNum);

  const handleTransactionEdit = (transactionId) => {
    // setSelectedTransactionId(transactionId);
    // setShowModal(true);
    setTransactionModal({
      show: true,
      transactionId: transactionId,
    })
  };

  const handleTransactionSave = async () => {
    const transactionIds = catTransactions.map(t => t._id);

    if(!isLoading) {
      setIsLoading(true);
      try {
        const response = await getTransactionByIds({
          ids: transactionIds
        });
        setCatTransactions(response.data.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }

  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }} className="filter-container">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="mr-2"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          className="mr-2"
        />
        <button onClick={handleApplyFilter} className="filter-btn">
          Apply Filter
        </button>
      </div>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : null}

      {activeTab === "transaction" && !isLoading ? (
        transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Balance</th>
                  <th>Currency</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.transaction_id}>
                    <td>
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </td>
                    <td>{transaction.description}</td>
                    <td>{transaction.transaction_type}</td>
                    <td>{transaction.amount.toFixed(2)}</td>
                    <td>{transaction?.running_balance?.amount.toFixed(2)}</td>
                    <td>{transaction.currency}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination>
              <Pagination.First
                onClick={() => handleClick(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => handleClick(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages).keys()].map((_, index) => (
                <Pagination.Item
                  // key={page}
                  // active={page === currentPage}
                  // onClick={() => setCurrentPage(page)}
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handleClick(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                onClick={() => handleClick(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handleClick(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>

            <button onClick={handleCategorize} className="filter-btn">
              Ask AI
            </button>
          </>
        )
      ) : null}

      {activeTab === "aiCategory" && !isLoading ? (
        catTransactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Balance</th>
                  <th>Currency</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {catTransactions.map((transaction) => (
                  <tr key={transaction.transaction_id}>
                    <td>{transaction.category}</td>
                    <td>
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </td>
                    <td>{transaction.description}</td>
                    <td>{transaction.transaction_type}</td>
                    <td>{transaction.amount.toFixed(2)}</td>
                    <td>{transaction?.running_balance?.amount.toFixed(2)}</td>
                    <td>{transaction.currency}</td>
                    <td className='text-center'>
                      <span role="button" onClick={() => handleTransactionEdit(transaction._id)}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25z"
                            fill="#000000"
                          />
                          <path
                            d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
                            fill="#000000"
                          />
                        </svg>
                      </span>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )
      ) : null}

      <TransactionEditModal
        show={transactionModal.show}
        onHide={() => {
          setTransactionModal({ ...transactionModal, show: false });
        }}
        transactionId={transactionModal.transactionId}
        onSave={handleTransactionSave}
      />
    </div>
  );
};

export default BankStatements;