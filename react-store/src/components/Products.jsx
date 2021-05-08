import { useParams } from "react-router-dom";
import Product from "./Product";

const Products = ({products}) => {
    const { category } = useParams();

    let filteredProducts = products.filter(p => p.category == category);
    return(
        <div className="products-container">
            {filteredProducts.map(p => 
                <Product key={p.id} product={p} />)}
        </div>
    )
}

export default Products;