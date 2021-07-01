-- DROP TABLE IF EXISTS messages CASCADE;
-- CREATE TABLE messages (
--   id SERIAL PRIMARY KEY NOT NULL,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   content TEXT,
--   product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
--);


INSERT INTO messages (user_id, content, product_id, is_for_admin)
VALUES (1, 'Hi, is this available?', 2, false);
