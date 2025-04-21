# Appeals-Service

Этот сервис предоставляет API для работой с обращениями.

## 🧑‍💻 Реализовано следующее:
## Appeals-Service:
     ➡️ Express.js CRUD контроллеры;
     ➡️ DTO схемы для структурированной передачи данных;
     ➡️ Подключение проекта к PostgreSQL, используя Docker image, предоставляющий базу данных и TypeORM;
     ➡️ Использование Swagger для документации API;
     ➡️ Сборка проекта в docker-compose файле.
     
## 🚀 Как запустить

### 1️⃣ Убедитесь, что установлен Docker и Docker Compose  
Скачать Docker: https://www.docker.com/get-started

### 2️⃣ Клонируйте репозиторий  
```
git clone https://github.com/He0rhi/Appeals_task

```
### 3️⃣ Запустите контейнеры
```
docker-compose up --build
```
### 4️⃣ Проверка
После запуска документация API будет доступно по адресу:
http://localhost:5000/api/docs/

-POST (создать новое обращение)
http://localhost:5000/api/appeals

JSON:
```
{
  "theme": "Проблема с доступом",
  "text": "Не могу войти в систему"
}
```


-GET (получить список обращений)
http://localhost:5000/api/appeals

-PUT (взять обращение в работу) 
http://localhost:5000/api/appeals/{id}/start

-PUT (завершить обращение) 
http://localhost:5000/api/appeals/{id}/complete

JSON:
```
{
  "resolution": "Проблема решена"
}
```


-PUT (отменить обращение) 
http://localhost:5000/api/appeals/{id}/cancel

JSON:
```
{
  "cancellationReason": "Дубликат обращения"
}
```


-POST (отменить все обращения в статусе "В работе")
http://localhost:5000/api/appeals/cancel-all-in-progress
JSON:
```
{
  cancellationReason": "Системная ошибка"
}
```
  



