CREATE TRIGGER update_password BEFORE INSERT OR UPDATE ON "users" FOR EACH ROW EXECUTE PROCEDURE encrypt_password();
