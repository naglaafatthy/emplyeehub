// =====================================================================
// EmployeeHub API - Session 1 demo
// Express + data in memory. In Session 2 the arrays move to MongoDB.
//
// HOW TO RUN THE DEMO
//   cd server
//   npm install          -> downloads express into node_modules/
//   npm run dev          -> node --watch server.js (restarts on every save)
//   then send the requests in requests.http (VS Code REST Client) or Postman
//
// THE BIG PICTURE
//   Browser / Postman  --HTTP request-->  this Node process  --HTTP response-->  back
//   A request  = method + URL + headers + (optional) body
//   A response = status code + headers + body (JSON for an API)
//   HTTP is STATELESS: the server does not remember the previous request.
// =====================================================================

// CONCEPT: CommonJS modules. require() loads a package from node_modules/
// (or a file of ours with a ./path). Session 2 splits this file into many modules.
const express = require('express');

// app is the whole web server: we register middleware and routes on it, then listen().
const app = express();

// CONCEPT: a port is a "door number" on the machine. localhost:5000 = this computer, door 5000.
// Hard-coded today; in Session 2 it comes from .env, and in Session 5 the hosting platform sets it.
const PORT = 5000;

// ---------- 1) Middleware ----------
// CONCEPT: middleware = a function (req, res, next) that runs on EVERY request, in the order
// it was registered, BEFORE the route handler. It can read/change req, answer early with res,
// or call next() to pass control to the next function in the chain.
//
//   request -> express.json() -> logger -> matching route -> (404) -> (error handler)

// Built-in middleware: reads a JSON body and puts the parsed object in req.body.
// Without it, req.body is undefined for POST/PUT requests.
// DEMO: comment this line out, send POST /api/employees, and show the 400 "name is required".
app.use(express.json());

// Our own middleware: logs every request, then passes control on with next()
// DEMO: watch the terminal while sending requests -> "GET /api/employees -> 200 (2 ms)".
// DEMO: delete next() and the request hangs forever in Postman: nobody answers it.
app.use((req, res, next) => {
  const start = Date.now();
  // 'finish' fires after the response was sent, so the status code is known by then.
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next();
});

// ---------- 2) Data (the "archive" for today) ----------
// CONCEPT: this data lives in RAM. Restart the server and every change is gone.
// DEMO: add an employee, save the file (node --watch restarts), GET again -> the new one is gone.
// That is the motivation for a database in Session 2.
const departments = [
  { id: 1, name: 'IT' },
  { id: 2, name: 'HR' },
  { id: 3, name: 'Finance' },
];

// let, not const: DELETE replaces the whole array with a filtered copy.
// (const would still allow push(), but not a new assignment.)
let employees = [
  { id: 1, name: 'Ahmed Ali', jobTitle: 'Developer', salary: 25000, departmentId: 1 },
  { id: 2, name: 'Mona Hassan', jobTitle: 'Recruiter', salary: 18000, departmentId: 2 },
  { id: 3, name: 'Omar Khaled', jobTitle: 'Accountant', salary: 20000, departmentId: 3 },
  { id: 4, name: 'Sara Adel', jobTitle: 'QA Engineer', salary: 17000, departmentId: 1 },
];
let nextId = 5; // a simple counter plays the role of an IDENTITY column today

// ---------- 3) Helpers ----------
// Checks the body of POST and PUT. Returns a list of problems (empty = valid).
// CONCEPT: NEVER trust the client. Anyone can send anything with Postman or curl,
// so the server validates every field even if the frontend also does.
// `body = {}` is a default parameter: it protects us when body is undefined.
function validateEmployee(body = {}) {
  const errors = [];
  // Truthy/falsy: !body.name is true for undefined, null and '' (empty string).
  if (!body.name || body.name.trim().length < 3) errors.push('name is required (at least 3 characters)');
  // Optional chaining is not needed here because || stops early (short-circuit).
  if (!body.jobTitle || !body.jobTitle.trim()) errors.push('jobTitle is required');
  // typeof check: "25000" (a string) is rejected, 25000 (a number) is accepted.
  if (typeof body.salary !== 'number' || body.salary < 1000) errors.push('salary must be a number >= 1000');
  // some() = "does at least one element match?" -> like ANY / EXISTS in SQL.
  if (!departments.some((d) => d.id === body.departmentId)) errors.push(`department ${body.departmentId} does not exist`);
  return errors;
}

// ---------- 4) Routes ----------
// CONCEPT: a route = HTTP method + path + handler(req, res).
// CONCEPT: REST = the URL names the resource (a noun), the method says the action:
//   GET    /api/employees      -> list        (200)
//   GET    /api/employees/:id  -> one         (200 or 404)
//   POST   /api/employees      -> create      (201 or 400)
//   PUT    /api/employees/:id  -> replace     (200, 400 or 404)
//   DELETE /api/employees/:id  -> delete      (204 or 404)

// res.send() sends text; the browser shows it as-is.
// DEMO: open http://localhost:5000 in the browser -> the browser itself is an HTTP client.




app.get( '',(req , res) =>{

}
)



app.get('/', (req, res) => {
  res.send('EmployeeHub API is running');
});

// GET /api/departments
// res.json() turns the array into a JSON string and sets Content-Type: application/json.
app.get('/api/departments', (req, res) => {
  res.json(departments);
});

// GET /api/employees              -> everyone
// GET /api/employees?departmentId=1 -> one department
// GET /api/employees?search=ali     -> name contains "ali"
// http://localhost:5000/api/employees?DepartmentId=10&SearchName=Ahmed
// CONCEPT: the query string (?key=value&key2=value2) is for filtering, sorting and paging.
// It arrives in req.query as an object: { departmentId: '1', search: 'ali' }.
app.get('/api/employees', (req, res) => {
  const { departmentId, search } = req.query; // query values are always strings
  let result = employees;

  // filter() returns a NEW array with the matching items (like WHERE in SQL).
  // Number('1') -> 1, because === compares type too: '1' === 1 is false.
  if (departmentId) {
    result = result.filter((e) => e.departmentId === Number(departmentId));
  }
  // Case-insensitive "contains": lower-case both sides, then includes().
  if (search) {
    result = result.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
  }
  res.json(result);
});

// GET /api/employees/2
// CONCEPT: :id is a route parameter. /api/employees/2 -> req.params = { id: '2' }.
app.get('/api/employees/:id', (req, res) => {
  const id = Number(req.params.id); // params are strings too
  // find() returns the first match, or undefined (like FirstOrDefault in C#).
  const employee = employees.find((e) => e.id === id);
  if (!employee) {
    // `return` matters: without it the code continues and tries to send a second response
    // -> "Cannot set headers after they are sent to the client".
    return res.status(404).json({ message: `Employee ${id} not found` });
  }
  res.json(employee); // status 200 is the default
});

// POST /api/employees
// DEMO: send the body below, then GET the list again to show the new employee.
//   { "name": "Youssef Samir", "jobTitle": "Analyst", "salary": 16000, "departmentId": 3 }
// DEMO: send { "name": "Al" } -> 400 with every problem listed at once.
app.post('/api/employees', (req, res) => {
  // In Express 5, req.body is undefined when the request has no JSON body
  // ?? (nullish coalescing) uses {} only when the left side is null or undefined.
  const body = req.body ?? {};
  const errors = validateEmployee(body);
  if (errors.length) {
    // 400 Bad Request = "your input is wrong"; the client must fix it and retry.
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  // Destructuring + picking fields: we copy ONLY what we expect.
  // Extra fields like "id" or "isAdmin" sent by the client are ignored.
  const { name, jobTitle, salary, departmentId } = body;
  const employee = { id: nextId++, name: name.trim(), jobTitle: jobTitle.trim(), salary, departmentId };
  employees.push(employee);
  // 201 Created = a new resource exists now; we return it (with its new id).
  res.status(201).json(employee);
});

// PUT /api/employees/2
// CONCEPT: PUT replaces the whole resource, so we validate the full body again.
// PUT is idempotent: sending the same request twice gives the same final state.
app.put('/api/employees/:id', (req, res) => {
  const id = Number(req.params.id);
  const employee = employees.find((e) => e.id === id);
  if (!employee) {
    return res.status(404).json({ message: `Employee ${id} not found` });
  }
  const body = req.body ?? {};
  const errors = validateEmployee(body);
  if (errors.length) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  const { name, jobTitle, salary, departmentId } = body;
  // Object.assign mutates the object that lives inside the array, so the list sees the change.
  Object.assign(employee, { name: name.trim(), jobTitle: jobTitle.trim(), salary, departmentId });
  res.json(employee);
});

// DELETE /api/employees/2
app.delete('/api/employees/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = employees.length;
  // Keep everyone except this id; if the length did not change, the id did not exist.
  employees = employees.filter((e) => e.id !== id);
  if (employees.length === before) {
    return res.status(404).json({ message: `Employee ${id} not found` });
  }
  // 204 No Content = success with an empty body (nothing left to return).
  res.status(204).send();
});

// ---------- 5) Not found + errors (always last) ----------
// CONCEPT: Express checks routes top to bottom. If nothing matched, we reach this
// middleware, so it must be registered AFTER all routes.
// DEMO: GET /api/employes (typo) -> 404 JSON instead of Express's default HTML page.
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// 4 parameters = error-handling middleware
// CONCEPT: Express recognises an error handler by its 4 parameters (err, req, res, next).
// It runs when something throws or calls next(err). Also in Express 5, errors thrown
// inside async handlers reach it automatically.
// DEMO: send a broken JSON body like { "name": } -> 400 "Invalid JSON body".
app.use((err, req, res, next) => {
  console.error(err);
  // invalid JSON in the body arrives here with status 400
  // 500 = the server's fault. Never send stack traces to the client.
  res.status(err.status || 500).json({ message: err.status === 400 ? 'Invalid JSON body' : 'Something went wrong' });
});

// CONCEPT: listen() starts the server. Node keeps running and waits for requests
// (the event loop), so the terminal does not return to the prompt.
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
