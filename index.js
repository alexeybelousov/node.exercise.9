// https://github.com/risentveber/express-example-app
// {"sonrpc": "2.0", "method": "get_users", "params": "", "id": 3}
// {"sonrpc": "2.0", "method": "get_user", "params": [0], "id": 3}
// {"sonrpc": "2.0", "method": "add_user", "params": ["Alex", 300], "id": 4}
// {"sonrpc": "2.0", "method": "delete_user", "params": [0], "id": 5}
// {"sonrpc": "2.0", "method": "change_user", "params": [0, "Roma", 330], "id": 7}

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

    if (body.params[0] && body.params[1]) {
      users.push({ name: body.params[0], score: body.params[1] });
      callback(null, { user });
    } else {
      callback({ code: 404, message: 'Incorrect parameters' }, null);
    }
  },
  delete_user: function(body, callback) {
    if (users[body.params[0]]) {
      const id = body.params[0];
      users[id] = null;
      callback(null, true);
    } else if (!users[body.params[0]]) {
      callback({ code: 404, message: 'User not found or incorrect parameter' }, null);
    }
  },
  get_user: function(body, callback) {
    if (users[body.params[0]]) {
      const id = body.params[0];
      callback(null, users[body.params[0]]);
    } else if (!users[body.params[0]]) {
      callback({ code: 404, message: 'User not found or incorrect parameter' }, null);
    }
  },
  change_user: function(body, callback) {
    if (users[body.params[0]]) {
      const id = body.params[0];
      users[id] = Object.assign(users[id], { name: body.params[1], score: body.params[2] });
      callback(null, users[body.params[0]]);
    } else if (!users[body.params[0]]) {
      callback({ code: 404, message: 'User not found or incorrect parameter' }, null);
    }
  }
};

app.post("/rpc", function(req, res) {
  const method = RPC[req.body.method];
  const id = req.body.id;

  method(req.body, function(error, result) {
    if (error) {
      res.json({ jsonrpc: '2.0', error, id })
    } else {
      res.json({ jsonrpc: '2.0', result:  result, id })
    }
  });
});

app.listen(3000, () => console.log('Server has been run on 3000 port'));
