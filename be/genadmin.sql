USE movie_app;
DELETE FROM users WHERE username = 'admin';
INSERT INTO users (email, name, date_of_birth, is_active, is_admin, is_content_admin, username, password_hash) 
VALUES ('admin', 'Admin', '2000-12-21', True, True, True, 'admin', '$2b$12$3TLgHhJR7s5o..LEVC1NS.t6xPLxJ65kr85pi8BHp5d7o4F1WXb7C');