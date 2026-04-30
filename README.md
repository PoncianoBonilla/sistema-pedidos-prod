# 🛒 Sistema de Pedidos con Django

Este proyecto es un **Sistema de Pedidos** desarrollado en **Python 3.12.1** usando **Django 5.0.x** y PostgreSQL.
Incluye 3 aplicaciones principales:

* **cliente** → gestión de clientes
* **producto** → gestión de productos
* **pedido** → gestión de pedidos

---

## 📋 Requisitos

* [Python 3.12](https://www.python.org/downloads/release/python-3121/)
* [PostgreSQL 14+](https://www.postgresql.org/download/windows/)
* Windows 10 o superior

Dependencias principales:

```
Django==5.2.7
psycopg[binary]==3.2.10
```

---

## ⚙️ Instalación en Windows

1. Clonar o descargar el proyecto:

   ```bash
   git clone https://github.com/usuario/sistema-pedidos.git
   cd sistema-pedidos
   ```

2. Configurar variables de entorno:
   Crea un archivo `.env` en la raíz con el siguiente contenido:
   ```env
   DB_NAME=pedido
   DB_PASSWORD=tu_contraseña
   SECRET_KEY=tu_secret_key_de_django
   ```

3. Crear un entorno virtual:

   ```bash
   python -m venv venv
   ```

3. Activar el entorno virtual:

   ```bash
   venv\Scripts\activate
   ```

4. Instalar dependencias:

   ```bash
   pip install -r requirements.txt
   ```

---

## 🚀 Uso

1. Aplicar migraciones de la base de datos:

   ```bash
   python manage.py migrate
   ```

2. Crear un superusuario para ingresar al panel de administración:

   ```bash
   python manage.py createsuperuser
   ```

3. Ejecutar el servidor de desarrollo:

   ```bash
   python manage.py runserver
   ```

4. Abrir el navegador en:
   👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 📂 Estructura del proyecto

```
sistema-pedidos/
│── manage.py
│── requirements.txt
│── README.md
│── cliente/
│── producto/
│── pedido/
└── sistema_pedidos/
```

---

## ✅ Comandos útiles

* Crear migraciones:

  ```bash
  python manage.py makemigrations
  ```
* Aplicar migraciones:

  ```bash
  python manage.py migrate
  ```
* Ejecutar pruebas:

  ```bash
  python manage.py test
  ```
