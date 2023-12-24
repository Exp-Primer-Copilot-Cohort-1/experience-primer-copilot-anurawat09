//create a web server
app.use(bodyParser.urlencoded({ extended: true }));

const commentsByPostId = {};

//get request to fetch comments
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

//post request to create comments
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  //comments array for a particular post
  const comments = commentsByPostId[req.params.id] || [];
  //pushing the new comment to the comments array
  comments.push({ id: commentId, content, status: 'pending' });
  //setting the comments array for a particular post
  commentsByPostId[req.params.id] = comments;
  //sending the event to the event bus
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId: req.params.id, status: 'pending' },
  });
  //sending the comments array for a particular post
  res.status(201).send(comments);
});

//post request to receive events from event bus
app.post('/events', async (req, res) => {
  console.log('Event Received: ', req.body.type);
  const { type, data } = req.body;
  //checking the type of event
  if (type === 'CommentModerated') {
    //destructuring the data
    const { postId, id, status, content } = data;
    //fetching the comments array for a particular post
    const comments = commentsByPostId[postId];
    //finding the comment
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    //updating the status
    comment.status = status;
    //sending the event to the event bus
    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: { id, status, postId, content },
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});