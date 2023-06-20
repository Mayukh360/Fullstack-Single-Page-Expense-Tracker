import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ExpenseTracker() {
  const [expense, setExpenseName] = useState("");
  const [price, setExpensePrice] = useState("");
  const [category, setExpenseCategory] = useState("");
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3000/getData");
      console.log(response.data);
      setData(response.data);
    };
    fetchData();
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();

    const formData = {
      expense,
      price,
      category,
    };

    if (selected) {
      // Perform PUT request to update existing expense
      await axios.put(
        `http://localhost:3000/getData/${selected.id}`,
        formData
      );

      const updatedData = data.map((item) =>
        item.id === selected.id ? { ...item, ...formData } : item
      );

      setData(updatedData);
      setSelected(null);
    } else {
      // Perform POST request to create a new expense
      await axios.post("http://localhost:3000/getData", formData);

      const response = await axios.get("http://localhost:3000/getData");
      setData(response.data);
    }

    setExpenseName("");
    setExpenseCategory("");
    setExpensePrice("");
  };

  const dltBtnhandler = async (item) => {
    const filteredData = data.filter((product) => product.id !== item.id);
    setData(filteredData);
    await axios.delete(`http://localhost:3000/getData/${item.id}`);
  };

  const editBtnHandler = (item) => {
    setSelected(item);
    setExpenseName(item.expense);
    setExpensePrice(item.price);
    setExpenseCategory(item.category);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>Expense Name</label>
        <input
          type="text"
          name="expense"
          value={expense}
          onChange={(event) => setExpenseName(event.target.value)}
        />
        <label>Expense Price</label>
        <input
          type="number"
          name="price"
          value={price}
          onChange={(event) => setExpensePrice(event.target.value)}
        />
        <label>Expense Category</label>
        <select
          name="category"
          value={category}
          onChange={(event) => setExpenseCategory(event.target.value)}
        >
          <option value="">Choose a category</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Movie">Movie</option>
          <option value="Rent">Rent</option>
        </select>
        <button type="submit">{selected ? "Update" : "Submit"}</button>
      </form>
      {data &&
        data.map((item) => (
          <li key={item.id}>
            <h3>
              Expense: {item.expense} --- Price: {item.price} --- Category:{" "}
              {item.category}
              <button onClick={() => dltBtnhandler(item)}>Delete</button>
              <button onClick={() => editBtnHandler(item)}>Edit</button>
            </h3>
          </li>
        ))}
    </div>
  );
}
