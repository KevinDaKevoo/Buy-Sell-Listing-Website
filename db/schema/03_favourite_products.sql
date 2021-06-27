DROP TABLE IF EXISTS favorite_products CASCADE;
CREATE TABLE favorite_products (
id SERIAL PRIMARY KEY NOT NULL,
product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
