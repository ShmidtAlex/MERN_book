
import express from "express";
import session from 'express-session';
import bodyParser from 'body-parser';
//import mongodb driver features
import { ObjectId } from 'mongodb';
import Issue from './issue.js';
import renderedPageRouter from './renderedPageRouter.jsx';
//create express instance
const app = express();
//using middleware static, show that static files placed in 'static' folder
app.use(express.static('static'));
//create and mount bodyParser middleware, which helps to parse .json file 
//to simple object, at the application level
app.use(bodyParser.json());

//create global variable for mongoDB connection
let db;

app.use(session({ secret: 'h7e3f5s6', resave: false, saveUninitialized: true }));

app.all('/api/*', (req, res, next) => {
  if (req.method === 'DELETE' || req.method === 'POST' || req.method === 'PUT') {
    if (!req.session || !req.session.user) {
      res.status(403).send({
        message: 'You are not authorised to perform the operation',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

//this API is designed for finding issues by filter
//'/api' is a prefix, which shows that issues is an API, it's not path
app.get('/api/issues', (req, res) => {
  const filter = {};//by default filter is empty object
  if (req.query.status) {//if in parsed query string from request from client there is any status,
    //now filter's status is equal to status from parsed query string
    filter.status = req.query.status;
  }
  if (req.query.effort_lte || req.query.effort_gte) {
    filter.effort = {};
  }
  if (req.query.effort_lte ) {
    filter.effort.$lte = parseInt(req.query.effort_lte, 10);
  }
  if (req.query.effort_gte ) {
    filter.effort.$gte = parseInt(req.query.effort_gte, 10);
  }
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }
  if (req.query._summary === undefined) {
    const offset = req.query._offset ? parseInt(req.query._offset, 10) : 0;
    let limit = req.query.limit ? parseInt(req.query._limit, 10) : 20;
    if (limit > 50) {
      limit = 50;
    }
    const cursor = db.collection('issues').find(filter).sort({ _id:1 })
    .skip(offset)
    .limit(limit);
    let totalCount;
    cursor.count(false).then(result => {
      totalCount = result;
      return cursor.toArray();
    })
    .then(issues => {
      //returning document given by find(filter) method
      res.json({ metadata: { totalCount }, records: issues });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: `Internal Server error ${error}` });
    });
  } else {
    db.collection('issues').aggregate([
      {$match: filter},
      {$group: {_id: {owner: '$owner', status: '$status'}, count: {$sum: 1}}},
    ]).toArray()
    .then(results => {
      const stats = {};
      results.forEach(result => {
        if (!stats[result._id.owner]) {
          stats[result._id.owner] = {};
        }
        stats[result._id.owner][result._id.status] = result.count;
      });
      res.json(stats);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: `Internal server error:${error}`});
    });
  }
  //any collection in mongo DB has method 'collection', which allows us supply the name
  //of collection (issues in this case), to indicate exactly which collection from data base
  
});


//this API is designed for creating new 'issues'
//.post creates an object which is supplied from the body
app.post('/api/issues',(req, res) => {
  //req.body containts the body of created new issue, it's valid for post 
  //NOTE: req.body will be undefined, if there is no middleware (bodyParser f.e.x) for interpret
  const newIssue = req.body;
  newIssue.created = new Date();//because of we have no filed for setting date, we assign it here
  //if created issue doesn't have any status from user initally, assign status 'New'
  if (!newIssue.status) {
    newIssue.status = 'New';
  }
  const err = Issue.validateIssue(newIssue);
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` });
    return;
  }
  //insert newIssue variable, which contains created issue to data base
  //before insert validate newIssue by cleanupIssue function from imported Issue variable
  db.collection('issues').insertOne(Issue.cleanupIssue(newIssue)).then(result => 
    //while it's inserting, it gets new id, which stored in property insertedId
    db.collection('issues').find({_id: result.insertedId}).limit(1)
    .next()
  )
  .then(savedIssue => {
    res.json(savedIssue);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: `Internal Server Error: ${error}` });
  });
});

app.get('/api/issues/:id', (req, res) => {
  let issueId;
  console.log(req.params.id);
  try {
    issueId = new ObjectId(req.params.id);//for using ObjectId() you need import it from mongodb
  } catch(error) {
    res.status(422).json({ message: `Invalid issue ID format : ${error}` });
    return;
  }
  db.collection('issues').find({ _id: issueId }).limit(1)
    .next()
    .then(issue => {
      if(!issue) {
        res.status(404).json({ message: `No such issue: ${issueId}` });
      } else {
        res.json(issue);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: `Internal Server Error: ${error}`});
    });
});
//Update API
app.put('/api/issues/:id', (req, res) => {
  let issueId;
  try {
    issueId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
    return;
  }
  const issue = req.body;
  delete issue._id;
  const err = Issue.validateIssue(issue);
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` });
    return;
  }
  db.collection('issues').updateOne({ _id: issueId }, Issue.convertIssue(issue)).then(() => 
      db.collection('issues').find({ _id: issueId }).limit(1)
      .next()
    )
    .then(savedIssue => {
      res.json(savedIssue);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});
//delete API:
app.delete('/api/issues/:id', (req, res) => {
  let issueId;
  try {
    issueId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
    return;
  }
  db.collection('issues').deleteOne({ _id: issueId }).then((deleteResult) => {
    if(deleteResult.result.n === 1){
      res.json({ status: "OK" });
    } else {
      res.json({ status: "Warning: object not found"});
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal server error: ${error}`});
  });
});


app.get('/api/users/me', (req, res) => {
  if (req.session && req.session.user) {
    res.json(req.session.user);
  } else {
    res.json({ signedIn: false, name: '' });
  }
});
app.post('/signin', (req, res) => {
  if (!req.body.id_token) {
    res.status(400).send({ code: 400, message: 'Missing Token' });
    return;
  }
  fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.id_token} `)
  .then(response => {
    if(!response.ok) {
      response.json().then(error => Promise.reject(error));
    }
    response.json().then(data => {
      req.session.user = {
        signedIn: true, name: data.given_name,
      };
      res.json(req.session.user);
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
});
app.post('/signout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.json({ status: 'ok' });
  }
})

app.use('/', renderedPageRouter);
//MongoClient is an object provided by mongodb module, allows us act as a client
//'connect' method connecting the database from Node.js
function setDb(newDb) {
  db = newDb;
}
export { app, setDb };