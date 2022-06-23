import React, { useState, useEffect } from 'react';
import s from './EditPageFilter.module.css';
import { getItems, getCategories, deleteItem } from '../../serverqueries';

// This holds a list of some fiction products
// Some  have the same name but different cost and id
const initialProducts = [
  { id: uuidv4(), categoryId: 'tv', name: 'Einaudi', cost: 500 },
  { id: uuidv4(), categoryId: 'tv', name: 'Brahms', cost: 600 },
  { id: uuidv4(), categoryId: 'tv', name: 'Tom Henk', cost: 700 },
  { id: uuidv4(), categoryId: 'tv', name: 'Tom Handric', cost: 800 },
];


function matchCategory(categoryId, categoriesListOfObj) {
  const categoryObj = categoriesListOfObj.find(obj => obj.id === categoryId);
  return categoryObj.name;
}

function EditPageFilter() {
  // the value of the search field
  const [name, setName] = useState('');
  const [val] = useState({
    name: '',
    categoryId: null,
    id: '',
  });
  const [stateProducts, setStateProducts] = useState([]);
  const [stateCategories, setStateCategories] = useState([]);

  useEffect(() => {
    getItems().then(items => setStateProducts(items));
    getCategories().then(items => setStateCategories(items));
  }, []);

  const deleteItems = idToDelete => {
    setStateProducts(stateProducts.filter(item => item.id !== idToDelete));
    deleteItem(idToDelete);
  };

  let mappedStateToJsx = [];
  if (stateProducts.length > 0 && stateCategories.length > 0) {
    mappedStateToJsx = stateProducts.map(categoryObj => {
      return (
        <li key={categoryObj.id} className={s.product}>
          <span className={s.id}>
            {matchCategory(categoryObj.categoryId, stateCategories)}
          </span>
          <span className={s.name}>{categoryObj.name}</span>
          <button type="submit" className={s.button}>
            Edit
          </button>
          <button
            type="submit"
            className={s.buttonDelete}
            value={val}
            onClick={() => deleteItems(categoryObj.id)}
          >
            Delete
          </button>
        </li>
      );
    });
  }

  // let mappedStateToJsx = stateProducts.map(el => {});
  // the search result
  const [foundProducts, setFoundProducts] = useState(initialProducts);

  const filter = e => {
    const keyword = e.target.value;

    if (keyword !== '') {
      const results = initialProducts.filter(product => {
        return product.name.toLowerCase().startsWith(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setFoundProducts(results);
    } else {
      setFoundProducts(initialProducts);
      // If the text field is empty, show all products
    }
    setName(keyword);
  };
  const deletePosition = id => {
    setFoundProducts(foundProducts.filter(product => product.id !== id));
    console.log('click on delete');
  };

  return (
    <div className={s.container}>
      <input
        type="search"
        value={name}
        onChange={filter}
        className={s.input}
        placeholder="Search by name"
      />

      <div className={s.list}>
        {foundProducts && foundProducts.length > 0 ? (
          foundProducts.map(product => (
            <li key={product.id} className={s.productInitial}>
              <span className={s.id}>{product.categoryId}</span>
              <span className={s.name}>{product.name}</span>
              {/* <span className={s.cost}>{product.cost}$</span> */}
              <button type="submit" className={s.button}>
                Edit
              </button>
              <button
                type="submit"
                className={s.buttonDelete}
                value={name}
                onClick={() => deletePosition(product.id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <h1>No results found!</h1>
        )}
        {mappedStateToJsx}
        {/* <DemoComponent /> */}
        {/* <EditableProduct onRemove={deleteContact} /> */}
      </div>
    </div>
  );
}

export default EditPageFilter;
