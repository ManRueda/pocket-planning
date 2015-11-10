var uuid = require('node-uuid');
var source = [];

module.exports = {
  create: function(opts){
    return source[source.push({
      uuid: uuid.v4(),
      type: opts.type,
      msg: opts.msg,
      creator: opts.creator,
      users:[],
      stories: []
    }) - 1];
  },
  get: function(uuid){
    return source.filter(function(item){
      return item.uuid === uuid;
    })[0];
  },
  removeStory: function (sesUuid, stoUuid){
    var sess = this.get(sesUuid);
    if (!sess){
      //TODO: not exist do something
    }
    var story = sess.stories.filter(function(item){
      return item.uuid === stoUuid;
    })[0];
    sess.stories.splice(sess.stories.indexOf(story), 1);
  },
  addUser: function(uuid, session, socket){
    var sess = this.get(uuid);
    if (!sess){
      //TODO: not exist do something
    }
    var user = sess.users.filter(function(item){
      return item.uuid === session.uuid
    })[0];

    if (user){
      user.socket = socket;
    }else{
      sess.users.push({
        uuid: session.uuid,
        socket: socket,
        isCreator: session.uuid === sess.creator
      });
      user = sess.users[sess.users.length - 1];
    }
    return user;
  },
  addStory: function(sesUuid, story){
    var sess = this.get(sesUuid);
    if (!sess){
      //TODO: not exist do something
    }
    sess.stories.push(story);
    return sess.stories[sess.stories.length - 1];
  },
  getStory: function(sesUuid, stoUuid){
    var sess = this.get(sesUuid);
    if (!sess){
      //TODO: not exist do something
    }
    return sess.stories.filter(function(item){
      return item.uuid === stoUuid;
    })[0];
  },
  broadcastDelStory: function(sesUuid, stoUuid, avoidCretor){
    avoidCretor = avoidCretor || true;
    var sess = this.get(sesUuid);
    if (!sess){
      //TODO: not exist do something
    }
    sess.users.forEach(function(usr, index){
      if (avoidCretor && sess.creator === usr.uuid)
        return;
      usr.socket.emit('storyDeleted', stoUuid);
    });
  },
  broadcastStory: function(sesUuid, stoUuid, avoidCretor){
    avoidCretor = avoidCretor || true;
    var sess = this.get(sesUuid);
    if (!sess){
      //TODO: not exist do something
    }
    var story = this.getStory(sesUuid, stoUuid);
    if (!story){
      //TODO: not exist do something
    }
    sess.users.forEach(function(usr, index){
      if (avoidCretor && sess.creator === usr.uuid)
        return;
      usr.socket.emit('storyCreated', story);
    });
  }
};
