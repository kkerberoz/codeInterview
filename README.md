# Node.js API

Create a `.env` file in the backend directory of your project. Add
environment-specific variables on new lines in the form of `JWT_SECRET=VALUE`.
For example:

```dosini
JWT_SECRET=secretttt

```

### Run sever

Run

```bash
docker-compose up
```

### For testing API with Jest and Supertest

Run

```bash
docker-compose -f docker-compose.test.yml
```
