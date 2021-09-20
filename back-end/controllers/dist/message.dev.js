"use strict";

var jwt = require('jsonwebtoken');

var models = require('../models'); //Create a message


exports.createMessage = function (req, res, next) {
  //body request
  var title = req.body.title;
  var content = req.body.content;
  var userId = req.body.userId;
  var attachment = "".concat(req.protocol, "://").concat(req.get('host'), "/images/").concat(req.file.filename);
  var newMessage = {
    userId: userId,
    title: title,
    content: content,
    attachment: attachment
  };

  try {
    models.Message.create(newMessage).then(function (newMessage) {
      return res.status(201).json({
        newMessage: newMessage,
        message: 'Message created !'
      });
    })["catch"](function (error) {
      return res.status(400).json({
        error: error
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error
    });
  }
}; //Modify the user message 


exports.modfifyMessageUser = function (req, res, next) {
  var userId = req.body.userId;
  models.Message.findOne({
    where: {
      id: req.params.id
    }
  }).then(function (message) {
    if (userId == message.userId) {
      try {
        models.Message.update({
          content: req.body.content
        }, {
          where: {
            id: req.params.id
          }
        }).then(function (messageUpdated) {
          return res.status(201).json({
            messageUpdated: messageUpdated,
            message: 'Message updated ! '
          });
        })["catch"](function (error) {
          return res.status(400).json({
            error: error
          });
        });
      } catch (error) {
        res.status(500).json({
          error: error
        });
      }
    } else {
      return res.status(401).json({
        message: 'You can\'t modify this message, userId not match !'
      });
    }
  })["catch"](function (error) {
    return res.status(404).json({
      error: error
    });
  });
}; //Find all Messages


exports.getAllMessages = function (req, res, next) {
  try {
    models.Message.findAll().then(function (messages) {
      return res.status(200).json({
        messages: messages
      });
    })["catch"](function (error) {
      return res.status(400).json({
        error: error
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error
    });
  }
};