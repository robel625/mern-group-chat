require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const { ExpressPeerServer } = require('peer');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use(
  '/public/images',
  express.static(path.join(__dirname, 'public/images'))
);

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log('rew', req.body);
  const { name } = req.body;
  console.log('name', name);
  try {
    const url = `./public/images/${name}`;
    console.log('nameurl', url);
    return res.json({ url });
    //return res.status(200).json('File uploded successfully');
  } catch (error) {
    console.error(error);
    console.log('rew', req.body);
  }
});

// Socket
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  SocketServer(socket);
});

// Create peer server
ExpressPeerServer(http, { path: '/' });

// delete file;
app.delete('/api/delete/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log('file_path', id);
    const delete_path = `./public/images/${id}`;
    console.log('delete_path', delete_path);

    fs.unlink(delete_path, function (err) {
      if (err && err.code == 'ENOENT') {
        // file doens't exist
        console.info("File doesn't exist, won't remove it.");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error('Error occurred while trying to remove file');
      } else {
        console.info(`removed`);
      }
    });
  } catch (error) {
    console.error(error);
    console.log('file rm', req.body);
  }
});

// Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));
app.use('/api', require('./routes/groupRouter'));
app.use('/api', require('./routes/groupmesRouter'));

const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('Connected to mongodb');
  }
);

//if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
//}

const port = process.env.PORT || 5000;
http.listen(port, () => {
  console.log('Server is running on port', port);
});
