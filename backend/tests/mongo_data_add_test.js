import { connectToDatabase, closeDatabaseConnection } from '../config/mongodb.js';

async function testMongoDbRetrieval() {
  try {
    console.log('🔍 Starting MongoDB data retrieval test...');
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Specify the collection
    const productsCollection = db.collection('products');
    
    // Fetch all documents from the collection (limit to 10 to avoid large data dumps)
    const products = await productsCollection.find({}).limit(10).toArray();
    
    // Check if any products were found
    if (products.length === 0) {
      console.log('ℹ️ No products found in the collection');
    } else {
      console.log(`✅ Successfully retrieved ${products.length} products`);
      
      // Display the first product (without showing large fields like image data)
      const sampleProduct = products[0];
      
      // Create a sanitized version without potentially large binary data
      const sanitizedProduct = { ...sampleProduct };
      
      // If there's image data, just indicate its presence instead of showing the full data
      if (sanitizedProduct.image_data) {
        sanitizedProduct.image_data = '[BINARY DATA]';
      }
      
      console.log('📋 Sample product:');
      console.log(JSON.stringify(sanitizedProduct, null, 2));
      
      // List all document IDs
      console.log('📜 All retrieved product IDs:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product._id} - ${product.product_name || 'Unnamed product'}`);
      });
    }
    
    // Count total number of documents
    const totalCount = await productsCollection.countDocuments();
    console.log(`📊 Total number of products in collection: ${totalCount}`);
    
  } catch (error) {
    console.error('❌ Error during MongoDB data retrieval test:', error);
  } finally {
    // Close the connection when done
    await closeDatabaseConnection();
  }
}

// Run the test
testMongoDbRetrieval()
  .then(() => console.log('🏁 MongoDB data retrieval test completed'))
  .catch(err => console.error('💥 Test failed with error:', err));