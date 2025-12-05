import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { FaCheck, FaEdit, FaTrash, FaUndo } from "react-icons/fa";

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [list, setList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const addItem = () => {
    if (userInput.trim() !== "") {
      const newItem = { id: Math.random(), value: userInput, done: false };
      setList([...list, newItem]);
      setUserInput("");
    }
  };

  const deleteItem = (id) => {
    setList(list.filter((item) => item.id !== id));
  };

  const openEditModal = (index) => {
    setEditIndex(index);
    setEditValue(list[index].value);
    setShowModal(true);
  };

  const saveEdit = () => {
    if (editValue.trim() !== "") {
      const updatedList = [...list];
      updatedList[editIndex].value = editValue;
      setList(updatedList);
      setShowModal(false);
    }
  };

  const toggleDone = (index) => {
    const updatedList = [...list];
    updatedList[index].done = !updatedList[index].done;
    setList(updatedList);
  };

  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <h1 className="fw-bold">TODO LIST</h1>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <InputGroup>
            <FormControl
              placeholder="Add item..."
              size="lg"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button variant="dark" onClick={addItem}>
              ADD
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <ListGroup>
            {list.map((item, index) => (
              <ListGroup.Item
                key={item.id}
                className="d-flex justify-content-between align-items-center"
                style={{
                  textDecoration: item.done ? "line-through" : "none",
                  opacity: item.done ? 0.6 : 1,
                  backgroundColor: item.done ? "#d4edda" : "white", // light green if completed
                }}
              >
                <span style={{ flexGrow: 1, textAlign: "left" }}>
                  {item.value}
                </span>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Button
                    variant="light"
                    className={item.done ? "text-secondary" : "text-success"}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => toggleDone(index)}
                  >
                    {item.done ? <FaUndo /> : <FaCheck />}{" "}
                  </Button>
                  <Button
                    variant="light"
                    className="text-danger"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => deleteItem(item.id)}
                  >
                    <FaTrash />
                  </Button>

                  <Button
                    variant="light"
                    className="text-primary"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => openEditModal(index)}
                  >
                    <FaEdit />
                  </Button>
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
