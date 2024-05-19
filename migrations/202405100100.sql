ALTER TABLE ONLY todos
ADD COLUMN created_at TIMESTAMP DEFAULT NOW ();

ALTER TABLE ONLY todos
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW ();

ALTER TABLE ONLY todos
ADD COLUMN deleted_at TIMESTAMP;

ALTER TABLE todos
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;