Запуск за допомогою Docker Compose
В корені проєкту є файл docker-compose.yml.
Щоб зібрати та запустити контейнери з бекендом і базою, виконай у терміналі:
docker-compose up --build
Це запустить бекенд і MongoDB.

Бекенд буде доступний за адресою:
http://localhost:7000

Запуск фронтенду
Перейди у папку фронтенду:
cd frontend
Запусти фронтенд:
npm start
Фронтенд буде доступний за адресою:
http://localhost:3000

В проєкті (postman/Clinic_api.postman_collection.json)

Це API сервер, розроблений на базі Node.js + Express + TypeScript + MongoDB, що дозволяє:
Керувати лікарями, клініками та медичними послугами
Проводити повноцінну аутентифікацію (реєстрація, вхід, refresh, відновлення паролю)
Керувати за допомогою адміністратора
Працювати з аватарами лікарів

Системні вимоги
Node.js >=20
MongoDB (локально або в хмарі)

📂 Структура
backend/
├── src/
│   ├── controllers/      # Логіка обробки HTTP-запитів
│   ├── routers/          # Express маршрути 
│   ├── services/         # Бізнес-логіка (робота з даними, зовнішні сервіси)
│   ├── repositories/     # Робота з БД 
│   ├── models/           # Опис Mongoose схем та моделей
│   ├── middlewares/      # Middleware для валідації, авторизації тощо
│   ├── validators/       # Joi-схеми для валідації тіла запитів
│   ├── interfaces/       # TypeScript інтерфейси і типи
│   ├── errors/           # Кастомні помилки, класи помилок
│   ├── enums/            # Константи у вигляді enum (статуси, ролі тощо)
│   ├── constants/        # Інші константи (рядкові, числові значення)
│   ├── configs/          # Конфігурації 
│   ├── templates/        # Шаблони
│   └── main.ts           # Точка входу в додаток
 
API Роути
Аутентифікація (/auth)
POST /sign-up – реєстрація лікаря
POST /sign-in – логін
POST /refresh – оновлення токенів
GET /me – інформація про поточного користувача
PATCH /activate/:token – активація облікового запису
POST /register-admin – створення адміністратора
POST /recovery – запит на відновлення паролю
POST /recovery/:token – зміна паролю

Технології
Express, TypeScript
Mongoose (MongoDB)
JWT, bcryptjs
Multer (для аватарів)
Joi (валідація)
Swagger (документація API)

Backend: Node.js, Express, TypeScript, MongoDB (mongoose), JWT
Frontend: Працює окремо на іншому порту (наприклад, порт 3000)
Документація: Swagger (через swagger-ui-express)
