IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users')
BEGIN
    CREATE TABLE dbo.Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    phone NVARCHAR(20),
    location NVARCHAR(200),
    password_hash NVARCHAR(255) NOT NULL,
    user_type INT NOT NULL,  -- 1=Cliente, 2=Proveedor, 3=Admin
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
    );
END
GO

-- Dar permisos explícitos por si acaso
GRANT INSERT, SELECT, UPDATE, DELETE ON dbo.Users TO miUsuario;
GO
