import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getTransactionById, updateTransaction } from '../../Services/Onboarding';

// Assume these API functions are defined elsewhere
// const getTransactionById = async (id) => { /* API call to fetch transaction */ };
// const updateTransaction = async (id, data) => { /* API call to update transaction */ };

const categories = [
  "Other",
  "Entertainment",
  "Education",
  "Shopping",
  "Personal Care",
  "Health & Fitness",
  "Food & Dining",
  "Gifts & Donations",
  "Investments",
  "Bills & Utilities",
  "Auto & Transport",
  "Travel",
  "Fees & Charges",
  "Business Services",
  "Personal Services",
  "Taxes",
  "Gambling",
  "Home",
  "Pensions and Insurances"
]

function TransactionEditModal({ show, onHide, transactionId, onSave }) {
  const [transaction, setTransaction] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && transactionId) {
      const fetchTransaction = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getTransactionById({id: transactionId});
          setTransaction(response.data.data);
          setSelectedCategory(response.data.data.category || 'Uncategorized');
        } catch (err) {
          setError('Failed to fetch transaction details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTransaction();
    }
  }, [show, transactionId]);

  const handleSave = async () => {
    if (!transaction) return;
    try {
      const updatedData = { ...transaction, category: selectedCategory };
      await updateTransaction({
        category: selectedCategory,
        id: transactionId,
      });
      onSave(updatedData);
      onHide();
    } catch (err) {
      setError('Failed to update transaction.');
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        {transaction && !loading && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="text"
                value={new Date(transaction.timestamp).toLocaleDateString()}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={transaction.description}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={transaction.transaction_type}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="text"
                value={transaction.amount.toFixed(2)}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Running Balance</Form.Label>
              <Form.Control
                type="text"
                value={transaction?.running_balance?.amount.toFixed(2) || 'N/A'}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                type="text"
                value={transaction.currency}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading || !transaction}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TransactionEditModal;