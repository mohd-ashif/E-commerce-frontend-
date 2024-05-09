
import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';

const ProductCarousel = ({ products }) => {  
    return (   
        <Carousel pause='hover' interval={3000} style={{ background: 'rgba(0, 0, 0, 0.5)' }} className='mb-4'>
            {products.map(product => (
                <Carousel.Item key={product._id}>
                    <Link className='text-decoration-none' to={`/product/${product.slug}`}>
                        <div className='d-flex justify-content-end align-items-center'>
                            <Image 
                                src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${product.image}`} 
                                className='img-fluid' 
                                style={{width:"1000px" , height:'600px'}}
                                alt={product.name} 
                                
                            />
                            <p className='mx-1 text-light text-center d-none d-lg-block'>{product.description}</p>
                        </div>
                        <Carousel.Caption style={{ width: '100%', background: 'rgba(0, 0, 0, 0.5)' }} className='position-absolute start-0 bottom-0 end-0 '>
                            <h2>{product.name} (${product.offerPrice})</h2>
                            <p className='mx-1 text-light text-center d-lg-none mt-5 ml-3'>{product.description}</p>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default ProductCarousel;

