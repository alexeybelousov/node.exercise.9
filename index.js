// https://github.com/risentveber/express-example-app
// {"sonrpc": "2.0", "method": "get_user", "params": "", "id": 2}
// {"sonrpc": "2.0", "method": "add_user", "params": "", "id": 4}
// {"sonrpc": "2.0", "method": "delete_user", "params": [0], "id": 4}

const express = require('express');
const bodyParset = require('body-parser');

const app = express();

app.use(bodyParset.json());

let users = [];

const RPC = {
  get_users: function(params, callback) {
    callback(null, users.filter(u => u));
  },
  add_user: function(body, callback) {
    const user = users.length;
    users.push(body);
    callback(null, { user });
  },
  delete_user: function(body, callback) {
    const id = body.params[0];
    users[id] = null;
    callback(null, true);
  }
};

app.post("/rpc", function(req, res) {
  const method = RPC[req.body.method];
  const id = req.body.id;
  // console.log(req.body.method);
  // console.log(RPC);
  // console.log(method);
  method(req, function(error, result) {
    if (error) {
      res.json({ jsonrpc: '2.0', error, id })
    } else {
      res.json({ jsonrpc: '2.0', result:  result, id })
    }
  });
});

app.listen(3000, () => console.log('Server has been run on 3000 port'));

// app.get('/users/:id', (req, res) => {
//   const id = req.params.id;
//   if (users[id]) {
//     res.json(users[id]);
//   } else {
//     res.status(404);
//     res.send();
//   }
// });
//
// app.put('/users/:id', (req, res) => {
//   const id = req.params.id;
//   if (users[id]) {
//     users[id] = Object.assign(users[id], req.body);
//     res.json(users[id]);
//   } else {
//     res.status(404);
//     res.send();
//   }
// });
