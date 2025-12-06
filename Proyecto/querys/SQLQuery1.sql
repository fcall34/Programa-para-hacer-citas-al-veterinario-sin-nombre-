USE apointdate;
GO

-- Tabla de usuarios
CREATE TABLE Users (
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
GO

-- Tabla de servicios (solo proveedores)
CREATE TABLE Services (
    service_id INT IDENTITY(1,1) PRIMARY KEY,
    provider_id INT NOT NULL,  -- FK a Users
    title NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    category NVARCHAR(50),
    cost DECIMAL(10,2) NOT NULL,
    location NVARCHAR(200),
    available BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (provider_id) REFERENCES Users(user_id)
);
GO

-- Tabla de citas (cliente agenda con proveedor)
CREATE TABLE Appointments (
    appointment_id INT IDENTITY(1,1) PRIMARY KEY,
    service_id INT NOT NULL,
    client_id INT NOT NULL,
    provider_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status NVARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, completed
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (service_id) REFERENCES Services(service_id),
    FOREIGN KEY (client_id) REFERENCES Users(user_id),
    FOREIGN KEY (provider_id) REFERENCES Users(user_id)
);
GO
