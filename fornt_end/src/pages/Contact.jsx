import React from 'react'
import { useEffect } from 'react';
function Contact() {
    
     // State to store the product data
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // Fetch the product when the component mounts
    useEffect(() => {
      axios.get('https://fakestoreapi.com/products/1')
        .then((response) => {
          setProduct(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }, []);
  
    // Conditional rendering based on state
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error.message}</div>;
    }
  
    return (
      <div>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        <img src={product.image} alt={product.title} width="150" />
      </div>
    );
  
}

export default Contact